<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PaymentPeriodResource\Pages;
use App\Models\PaymentPeriod;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PaymentPeriodResource extends Resource
{
    protected static ?string $model = PaymentPeriod::class;

    protected static ?string $navigationIcon = 'heroicon-o-calendar';

    protected static bool $isScopedToTenant = false;

    public static function getModelLabel(): string
    {
        return trans_choice('payment-period.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('payment-period.label', 2);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title')
                    ->label(__('payment-period.title'))
                    ->readOnly(),
                TextInput::make('rrule')
                    ->live()
                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('title', PaymentPeriod::transformRrule($state)))
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
            'index' => Pages\ListPaymentPeriods::route('/'),
            'create' => Pages\CreatePaymentPeriod::route('/create'),
            'edit' => Pages\EditPaymentPeriod::route('/{record}/edit'),
        ];
    }
}
