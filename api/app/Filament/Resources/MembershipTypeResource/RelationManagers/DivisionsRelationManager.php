<?php

namespace App\Filament\Resources\MembershipTypeResource\RelationManagers;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Concerns\Translatable;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Actions\AttachAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;

class DivisionsRelationManager extends RelationManager
{
    use Translatable;

    protected static string $relationship = 'divisions';

    public static function getTitle(Model $ownerRecord, string $pageClass): string
    {
        return trans_choice('division.label', 2);
    }

    public static function getModelLabel(): string
    {
        return trans_choice('division.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('division.label', 2);
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('monthly_fee')
                    ->label(__('division.monthly_fee'))
                    ->numeric()
                    ->step(0.01)
                    ->prefix('€')
                    ->rules(['nullable', 'numeric', 'min:0']),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('title')
            ->columns([
                Tables\Columns\TextColumn::make('title'),
                Tables\Columns\TextColumn::make('monthly_fee')
                    ->label(__('division.monthly_fee'))
                    ->money('EUR')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                AttachAction::make()
                    ->form(fn (AttachAction $action): array => [
                        $action->getRecordSelect(),
                        Forms\Components\TextInput::make('monthly_fee')
                            ->label(__('division.monthly_fee'))
                            ->numeric()
                            ->step(0.01)
                            ->prefix('€')
                            ->rules(['nullable', 'numeric', 'min:0']),
                    ]),
            ])
            ->actions([
                EditAction::make()->form(fn (EditAction $action): array => [
                    Forms\Components\TextInput::make('monthly_fee')
                        ->label(__('division.monthly_fee'))
                        ->numeric()
                        ->step(0.01)
                        ->prefix('€')
                        ->rules(['nullable', 'numeric', 'min:0']),
                ]),
                Tables\Actions\DetachAction::make(),
            ])
            ->bulkActions([
                //
            ]);
    }
}
