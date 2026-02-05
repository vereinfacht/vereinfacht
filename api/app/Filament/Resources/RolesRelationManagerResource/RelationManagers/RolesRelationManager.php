<?php

namespace App\Filament\Resources\RolesRelationManagerResource\RelationManagers;

use App\Models\Club;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Actions\AttachAction;
use Filament\Actions\DetachAction;
use Filament\Actions\BulkActionGroup;
use Filament\Forms\Components\Select;
use Filament\Actions\DetachBulkAction;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Model;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;

class RolesRelationManager extends RelationManager
{
    protected static string $relationship = 'roles';

    public static function getTitle(Model $ownerRecord, string $pageClass): string
    {
        return trans_choice('role.label', 2);
    }

    public static function getModelLabel(): string
    {
        return trans_choice('role.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('role.label', 2);
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required()
                    ->maxLength(255),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('name')
            ->columns([
                TextColumn::make('name'),
                TextColumn::make('pivot.club_id')
                    ->label(trans_choice('club.label', 1))
                    ->formatStateUsing(fn(string $state): string => Club::find($state)->title),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                AttachAction::make()
                    ->preloadRecordSelect()
                    ->form(fn(AttachAction $action): array => [
                        $action->getRecordSelect(),
                        Select::make('club_id')
                            ->label(trans_choice('club.label', 1))
                            ->options(Club::all()->pluck('title', 'id')->toArray())
                            ->searchable()
                            ->required(),
                    ]),
            ])
            ->recordActions([
                DetachAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DetachBulkAction::make(),
                ]),
            ]);
    }
}
