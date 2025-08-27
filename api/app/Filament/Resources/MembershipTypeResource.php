<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MembershipTypeResource\Pages;
use App\Filament\Resources\MembershipTypeResource\RelationManagers\DivisionsRelationManager;
use App\Filament\Resources\MembershipTypeResource\RelationManagers\MembershipsRelationManager;
use App\Models\MembershipType;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Resources\Concerns\Translatable;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MembershipTypeResource extends Resource
{
    use Translatable;

    protected static ?string $model = MembershipType::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    public static function getNavigationGroup(): ?string
    {
        return trans_choice('club.label', 1);
    }

    public static function getModelLabel(): string
    {
        return trans_choice('membership-type.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('membership-type.label', 2);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title')
                    ->label(__('membership-type.title'))
                    ->required()
                    ->rules(['min:2', 'max:255']),
                RichEditor::make('description')
                    ->label(__('membership-type.description'))
                    ->required(),
                TextInput::make('admission_fee')
                    ->label(__('membership-type.admission_fee'))
                    ->numeric()
                    ->step(0.01)
                    ->prefix('€')
                    ->rules(['nullable', 'numeric', 'min:0']),
                TextInput::make('monthly_fee')
                    ->label(__('membership-type.monthly_fee'))
                    ->numeric()
                    ->step(0.01)
                    ->prefix('€')
                    ->required()
                    ->rules(['numeric', 'min:0']),
                TextInput::make('minimum_number_of_months')
                    ->label(__('membership-type.minimum_number_of_months'))
                    ->integer()
                    ->required()
                    ->rules(['numeric', 'min:0']),
                TextInput::make('minimum_number_of_members')
                    ->label(__('membership-type.minimum_number_of_members'))
                    ->integer()
                    ->required()
                    ->lte('maximum_number_of_members')
                    ->rules(['numeric', 'min:0']),
                TextInput::make('maximum_number_of_members')
                    ->label(__('membership-type.maximum_number_of_members'))
                    ->integer()
                    ->required()
                    ->gte('minimum_number_of_members')
                    ->rules(['numeric', 'min:0']),
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
            ->reorderable('sort_order')
            ->columns([
                TextColumn::make('title')
                    ->label(__('membership-type.title'))
                    ->searchable()
                    ->sortable(),
                TextColumn::make('admission_fee')
                    ->label(__('membership-type.admission_fee'))
                    ->money('EUR')
                    ->sortable(),
                TextColumn::make('monthly_fee')
                    ->label(__('membership-type.monthly_fee'))
                    ->money('EUR')
                    ->sortable(),
                TextColumn::make('minimum_number_of_months')
                    ->label(__('membership-type.minimum_number_of_months'))
                    ->sortable(),
                TextColumn::make('minimum_number_of_members')
                    ->label(__('membership-type.minimum_number_of_members'))
                    ->sortable(),
                TextColumn::make('maximum_number_of_members')
                    ->label(__('membership-type.maximum_number_of_members'))
                    ->sortable(),
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
            MembershipsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListMembershipTypes::route('/'),
            'create' => Pages\CreateMembershipType::route('/create'),
            'edit' => Pages\EditMembershipType::route('/{record}/edit'),
        ];
    }
}
