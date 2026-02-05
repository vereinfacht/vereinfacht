<?php

namespace App\Filament\Resources\Users;

use Throwable;
use App\Models\User;
use Filament\Tables\Table;
use Filament\Schemas\Schema;
use Filament\Actions\BulkAction;
use Filament\Actions\EditAction;
use Filament\Resources\Resource;
use Illuminate\Support\Facades\Hash;
use Filament\Forms\Components\Select;
use App\Actions\User\WelcomeClubAdmin;
use Filament\Tables\Columns\TextColumn;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Illuminate\Database\Eloquent\Collection;
use Filament\Forms\Components\DateTimePicker;
use App\Filament\Resources\Users\Pages\EditUser;
use App\Filament\Resources\Users\Pages\ListUsers;
use App\Filament\Resources\Users\Pages\CreateUser;
use App\Filament\Resources\RolesRelationManagerResource\RelationManagers\RolesRelationManager;

class UserResource extends Resource
{
    protected static ?string $model = User::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-users';

    protected static bool $isScopedToTenant = false;

    public static function getModelLabel(): string
    {
        return trans_choice('user.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('user.label', 2);
    }

    public static function form(Schema $schema): Schema
    {
        return $schema
            ->components([
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
                    ->dehydrateStateUsing(fn($state) => Hash::make($state))
                    ->dehydrated(fn($state) => filled($state))
                    ->required(fn(string $context): bool => $context === 'create'),
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
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkAction::make('email_welcome_club_admin')
                    ->label(__('user.actions.email_welcome_club_admin.name'))
                    ->action(
                        fn(Collection $records) => $records->each(
                            function ($record) {
                                try {
                                    (new WelcomeClubAdmin)->execute($record);

                                    Notification::make()
                                        ->title('Success')
                                        ->success()
                                        ->send();
                                } catch (Throwable $th) {
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
            'index' => ListUsers::route('/'),
            'create' => CreateUser::route('/create'),
            'edit' => EditUser::route('/{record}/edit'),
        ];
    }
}
