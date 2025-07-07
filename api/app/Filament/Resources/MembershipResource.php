<?php

namespace App\Filament\Resources;

use App\Enums\MembershipStatusEnum;
use App\Filament\Resources\MembershipResource\Pages;
use App\Models\Membership;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class MembershipResource extends Resource
{
    protected static ?string $model = Membership::class;

    protected static ?string $navigationIcon = 'heroicon-o-credit-card';

    public static function getNavigationGroup(): ?string
    {
        return trans_choice('club.label', 1);
    }

    public static function getModelLabel(): string
    {
        return trans_choice('membership.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('membership.label', 2);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('membership_type_id')
                    ->label(trans_choice('membership-type.label', 1))
                    ->preload()
                    ->relationship(name: 'membershipType', titleAttribute: 'title')
                    ->searchable()
                    ->required(),
                DatePicker::make('started_at')
                    ->label(__('membership.started_at'))
                    ->required(),
                DatePicker::make('ended_at')
                    ->label(__('membership.ended_at'))
                    ->rules(['nullable', 'after:started_at']),
                Textarea::make('notes')
                    ->label(__('membership.notes')),
                Select::make('status')
                    ->label(__('membership.status.label'))
                    ->options([
                        null => '',
                        MembershipStatusEnum::APPLIED->value => __('membership.status.'.MembershipStatusEnum::APPLIED->value),
                        MembershipStatusEnum::ACTIVE->value => __('membership.status.'.MembershipStatusEnum::ACTIVE->value),
                        MembershipStatusEnum::CANCELLED->value => __('membership.status.'.MembershipStatusEnum::CANCELLED->value),
                    ]),
                TextInput::make('voluntary_contribution')
                    ->label(__('membership.voluntary_contribution'))
                    ->helperText(__('membership.voluntary_contribution_help'))
                    ->numeric()
                    ->step(0.01)
                    ->prefix('€')
                    ->rules(['nullable', 'numeric', 'min:0']),
                DateTimePicker::make('updated_at')
                    ->label(__('validation.attributes.updated_at'))
                    ->disabled(),
                DateTimePicker::make('created_at')
                    ->label(__('validation.attributes.created_at'))
                    ->disabled(),
                Fieldset::make(__('membership.payment'))->schema(
                    self::paymentFields()
                ),
            ]);
    }

    public static function paymentFields()
    {
        return [
            TextInput::make('bank_account_holder')
                ->label(__('membership.bank_account_holder'))
                ->helperText(__('membership.bank_account_holder_help'))
                ->required(),
            TextInput::make('bank_iban')
                ->label(__('membership.bank_iban'))
                ->required(),
            Select::make('payment_period_id')
                ->label(trans_choice('payment-period.label', 1))
                ->getOptionLabelFromRecordUsing(fn (Model $record) => $record->title)
                ->relationship(name: 'paymentPeriod')
                ->required(),
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('id')
                    ->label(__('id'))
                    ->sortable(),
                TextColumn::make('club.title')
                    ->label(trans_choice('club.label', 1))
                    ->sortable(),
                TextColumn::make('membershipType.title')
                    ->label(trans_choice('membership-type.label', 1))
                    ->sortable(),
                TextColumn::make('started_at')
                    ->label(__('membership.started_at'))
                    ->sortable()
                    ->date('d.m.Y'),
                TextColumn::make('status')
                    ->label(__('membership.status.label'))
                    ->formatStateUsing(fn (string $state): string => __("membership.status.{$state}"))
                    ->sortable()
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        default => 'gray',
                        MembershipStatusEnum::APPLIED->value => 'warning',
                        MembershipStatusEnum::ACTIVE->value => 'success',
                        MembershipStatusEnum::CANCELLED->value => 'danger',
                    }),
                TextColumn::make('monthly_fee')
                    ->label(__('membership.sum'))
                    ->money('EUR')
                    ->state(function (Membership $record): float {
                        return $record->getMonthlyFee();
                    })
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->options([
                        MembershipStatusEnum::APPLIED->value => __('membership.status.'.MembershipStatusEnum::APPLIED->value),
                        MembershipStatusEnum::ACTIVE->value => __('membership.status.'.MembershipStatusEnum::ACTIVE->value),
                        MembershipStatusEnum::CANCELLED->value => __('membership.status.'.MembershipStatusEnum::CANCELLED->value),
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMemberships::route('/'),
            'create' => Pages\CreateMembership::route('/create'),
            'edit' => Pages\EditMembership::route('/{record}/edit'),
        ];
    }
}
