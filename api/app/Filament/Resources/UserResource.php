<?php

namespace App\Filament\Resources;

use App\Actions\User\WelcomeClubAdmin;
use App\Filament\Resources\RolesRelationManagerResource\RelationManagers\RolesRelationManager;
use App\Filament\Resources\UserResource\Pages;
use App\Models\User;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Actions\BulkAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\Hash;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static ?string $navigationIcon = 'heroicon-o-users';

    protected static bool $isScopedToTenant = false;

    public static function getModelLabel(): string
    {
        return trans_choice('user.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('user.label', 2);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('name')
                    ->required()
                    ->rules(['max:255']),
                Select::make('preferred_locale')
                    ->label(__('member.preferred_locale'))
                    ->options([
                        'de' => __('general.german'),
                        'en' => __('general.english'),
                    ])
                    ->required()
                    ->rules(['max:5']),
                TextInput::make('email')
                    ->type('email')
                    ->required()
                    ->rules(['email', 'max:254']),
                TextInput::make('password')
                    ->password()
                    ->revealable()
                    ->dehydrateStateUsing(fn ($state) => Hash::make($state))
                    ->dehydrated(fn ($state) => filled($state))
                    ->required(fn (string $context): bool => $context === 'create'),
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
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('email')
                    ->searchable()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                BulkAction::make('email_welcome_club_admin')
                    ->label(__('user.actions.email_welcome_club_admin.name'))
                    ->action(
                        fn (Collection $records) => $records->each(
                            function ($record) {
                                try {
                                    (new WelcomeClubAdmin)->execute($record);

                                    Notification::make()
                                        ->title('Success')
                                        ->success()
                                        ->send();
                                } catch (\Throwable $th) {
                                    Notification::make()
                                        ->title($th->getMessage())
                                        ->danger()
                                        ->send();
                                }
                            }
                        )
                    ),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            RolesRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListUsers::route('/'),
            'create' => Pages\CreateUser::route('/create'),
            'edit' => Pages\EditUser::route('/{record}/edit'),
        ];
    }
}
