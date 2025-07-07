<?php

namespace App\Filament\Resources\ClubResource\RelationManagers;

use App\Filament\Resources\DivisionResource;
use Filament\Forms\Form;
use Filament\Resources\Concerns\Translatable;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
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
        return DivisionResource::form($form);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                //
            ])
            ->actions([
                //
            ])
            ->bulkActions([
                //
            ]);
    }
}
