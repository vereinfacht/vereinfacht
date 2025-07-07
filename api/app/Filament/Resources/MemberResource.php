<?php

namespace App\Filament\Resources;

use App\Enums\GenderOptionEnum;
use App\Filament\Resources\ClubResource\RelationManagers\DivisionsRelationManager;
use App\Filament\Resources\MemberResource\Pages;
use App\Models\Member;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;

class MemberResource extends Resource
{
    protected static ?string $model = Member::class;

    protected static ?string $navigationIcon = 'heroicon-o-user-group';

    public static function getNavigationGroup(): ?string
    {
        return trans_choice('club.label', 1);
    }

    public static function getModelLabel(): string
    {
        return trans_choice('member.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('member.label', 2);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('first_name')
                    ->label(__('member.first_name'))
                    ->required(),
                TextInput::make('last_name')
                    ->label(__('member.last_name'))
                    ->required(),
                TextInput::make('email')
                    ->label(__('member.email'))
                    ->email()
                    ->rules(['nullable']),
                Select::make('membership_id')
                    ->label(trans_choice('membership.label', 1))
                    ->relationship(name: 'membership', titleAttribute: 'title')
                    ->getOptionLabelFromRecordUsing(fn (Model $record) => $record->title)
                    ->required(),
                Select::make('gender')
                    ->label(__('member.gender'))
                    ->options([
                        GenderOptionEnum::MALE->value => __('member.gender_options.'.GenderOptionEnum::MALE->value),
                        GenderOptionEnum::FEMALE->value => __('member.gender_options.'.GenderOptionEnum::FEMALE->value),
                        GenderOptionEnum::OTHER->value => __('member.gender_options.'.GenderOptionEnum::OTHER->value),
                    ])
                    ->rules(['nullable']),
                Select::make('preferred_locale')
                    ->label(__('member.preferred_locale'))
                    ->options([
                        'de' => __('general.german'),
                        'en' => __('general.english'),
                    ])
                    ->required()
                    ->rules(['max:5']),
                DatePicker::make('birthday')
                    ->label(__('validation.attributes.birthday')),
                DateTimePicker::make('updated_at')
                    ->label(__('validation.attributes.updated_at'))
                    ->disabled(),
                DateTimePicker::make('created_at')
                    ->label(__('validation.attributes.created_at'))
                    ->disabled(),
                Fieldset::make(__('validation.attributes.address'))->schema(
                    self::addressFields()
                ),
            ]);
    }

    public static function addressFields()
    {
        return [
            TextInput::make('address')
                ->label(__('validation.attributes.address'))
                ->required(),
            TextInput::make('zip_code')
                ->label(__('validation.attributes.postal_code'))
                ->required(),
            TextInput::make('city')
                ->label(__('validation.attributes.city'))
                ->required(),
            TextInput::make('country')
                ->label(__('validation.attributes.country'))
                ->required(),
            TextInput::make('phone_number')
                ->label(__('validation.attributes.phone'))
                ->required()
                ->rules(['nullable']),
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('first_name')
                    ->label(__('member.first_name'))
                    ->searchable()
                    ->sortable(),
                TextColumn::make('last_name')
                    ->label(__('member.last_name'))
                    ->searchable()
                    ->sortable(),
                TextColumn::make('membership.title')
                    ->label(trans_choice('membership.label', 1)),
                IconColumn::make('consented_media_publication_at')
                    ->label(__('member.has_consented_media_publication'))
                    ->icon(fn (string $state): string => Carbon::parse($state)->isPast() ? 'heroicon-o-check' : ''),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                //
            ]);
    }

    public static function getRelations(): array
    {
        return [
            DivisionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMembers::route('/'),
            'create' => Pages\CreateMember::route('/create'),
            'edit' => Pages\EditMember::route('/{record}/edit'),
        ];
    }
}
