<?php

namespace App\Filament\Resources\MembershipTypes\RelationManagers;

use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Actions\EditAction;
use Filament\Actions\AttachAction;
use Filament\Actions\DetachAction;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Model;
use Filament\Forms\Components\TextInput;
use Filament\Resources\RelationManagers\RelationManager;
use LaraZeus\SpatieTranslatable\Resources\Concerns\Translatable;

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

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('title')
                    ->required()
                    ->maxLength(255),
                TextInput::make('monthly_fee')
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
                TextColumn::make('title'),
                TextColumn::make('monthly_fee')
                    ->label(__('division.monthly_fee'))
                    ->money('EUR')
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                AttachAction::make()
                    ->recordTitle(fn(Model $record): string => "{$record->title}")
                    ->preloadRecordSelect()
                    ->form(fn(AttachAction $action): array => [
                        $action->getRecordSelect(),
                        TextInput::make('monthly_fee')
                            ->label(__('division.monthly_fee'))
                            ->numeric()
                            ->step(0.01)
                            ->prefix('€')
                            ->rules(['nullable', 'numeric', 'min:0']),
                    ]),
            ])
            ->recordActions([
                EditAction::make()->schema(fn(EditAction $action): array => [
                    TextInput::make('monthly_fee')
                        ->label(__('division.monthly_fee'))
                        ->numeric()
                        ->step(0.01)
                        ->prefix('€')
                        ->rules(['nullable', 'numeric', 'min:0']),
                ]),
                DetachAction::make(),
            ])
            ->toolbarActions([
                //
            ]);
    }
}
