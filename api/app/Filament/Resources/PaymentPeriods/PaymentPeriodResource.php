<?php

namespace App\Filament\Resources\PaymentPeriods;

use Filament\Tables\Table;
use Filament\Schemas\Schema;
use App\Models\PaymentPeriod;
use Filament\Actions\EditAction;
use Filament\Resources\Resource;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\DateTimePicker;
use Filament\Schemas\Components\Utilities\Set;
use App\Filament\Resources\PaymentPeriods\Pages\EditPaymentPeriod;
use App\Filament\Resources\PaymentPeriods\Pages\ListPaymentPeriods;
use App\Filament\Resources\PaymentPeriods\Pages\CreatePaymentPeriod;

class PaymentPeriodResource extends Resource
{
    protected static ?string $model = PaymentPeriod::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-calendar';

    protected static bool $isScopedToTenant = false;

    public static function getModelLabel(): string
    {
        return trans_choice('payment-period.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('payment-period.label', 2);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->label(__('payment-period.title'))
                    ->readOnly(),
                TextInput::make('rrule')
                    ->live()
                    ->afterStateUpdated(fn(Set $set, ?string $state) => $set('title', PaymentPeriod::transformRrule($state)))
                    ->required()
                    ->rule(['string', 'min:1', 'unique:payment_periods,rrule']),
                DateTimePicker::make('updated_at')
                    ->label(__('validation.attributes.updated_at'))
                    ->disabled(),
                DateTimePicker::make('created_at')
                    ->label(__('validation.attributes.created_at'))
                    ->disabled(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label(__('payment-period.title')),
                TextColumn::make('rrule'),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
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
            'index' => ListPaymentPeriods::route('/'),
            'create' => CreatePaymentPeriod::route('/create'),
            'edit' => EditPaymentPeriod::route('/{record}/edit'),
        ];
    }
}
