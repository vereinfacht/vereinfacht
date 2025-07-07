<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ClubResource\Pages;
use App\Filament\Resources\ClubResource\RelationManagers\DivisionsRelationManager;
use App\Filament\Resources\ClubResource\RelationManagers\MembershipTypesRelationManager;
use App\Models\Club;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Fieldset;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Forms\Set;
use Filament\Resources\Concerns\Translatable;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class ClubResource extends Resource
{
    use Translatable;

    protected static ?string $model = Club::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static bool $isScopedToTenant = false;

    public static function getModelLabel(): string
    {
        return trans_choice('club.label', 1);
    }

    public static function getPluralModelLabel(): string
    {
        return trans_choice('club.label', 2);
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                TextInput::make('title')
                    ->label(__('club.title'))
                    ->live(onBlur: true)
                    ->afterStateUpdated(fn (Set $set, ?string $state) => $set('slug', Str::slug($state)))
                    ->required()
                    ->rules(['min:2', 'max:255']),
                TextInput::make('extended_title')
                    ->label(__('club.extended_title'))
                    ->required(),
                TextInput::make('email')
                    ->email()
                    ->label(__('validation.attributes.email'))
                    ->required(),
                TextInput::make('slug')
                    ->required(),
                RichEditor::make('apply_title')
                    ->label(__('club.apply_title'))
                    ->columnSpanFull()
                    ->helperText(__('club.apply_title_help')),
                TextInput::make('website_url')
                    ->label(__('club.website_url'))
                    ->url()
                    ->columnSpanFull(),
                Select::make('paymentPeriods')
                    ->label(trans_choice('payment-period.label', 2))
                    ->getOptionLabelFromRecordUsing(fn (Model $record) => $record->title)
                    ->multiple()
                    ->preload()
                    ->relationship(titleAttribute: 'rrule'),
                DateTimePicker::make('updated_at')
                    ->label(__('validation.attributes.updated_at'))
                    ->disabled(),
                DateTimePicker::make('created_at')
                    ->label(__('validation.attributes.created_at'))
                    ->disabled(),
                Fieldset::make(__('validation.attributes.address'))->schema(
                    self::addressFields()
                ),
                Fieldset::make(__('general.settings'))->schema(
                    self::settingsFields()
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
        ];
    }

    public static function settingsFields()
    {
        return [
            Select::make('preferred_locale')
                ->label(__('club.preferred_locale'))
                ->options([
                    'de' => __('general.german'),
                    'en' => __('general.english'),
                ])
                ->required()
                ->rules(['max:5']),
            ColorPicker::make('primary_color')
                ->label(__('club.primary_color'))
                ->required(),
            TextInput::make('logo_url')
                ->label(__('club.logo_url'))
                ->url()
                ->required(),
            TextInput::make('privacy_statement_url')
                ->label(__('club.privacy_statement_url'))
                ->url()
                ->required(),
            TextInput::make('contribution_statement_url')
                ->label(__('club.contribution_statement_url'))
                ->url()
                ->required(),
            TextInput::make('constitution_url')
                ->label(__('club.constitution_url'))
                ->url()
                ->required(),
            Select::make('membership_start_cycle_type')
                ->label(__('club.membership_start_cycle'))
                ->options(
                    [
                        'daily' => __('club.membership_start_cycle_type.daily'),
                        'monthly' => __('club.membership_start_cycle_type.monthly'),
                    ]
                )
                ->required(),
            Toggle::make('allow_voluntary_contribution')
                ->label(__('club.allow_voluntary_contribution')),
            Toggle::make('has_consented_media_publication_is_required')
                ->label(__('club.has_consented_media_publication_is_required')),
            Toggle::make('has_consented_media_publication_default_value')
                ->label(__('club.has_consented_media_publication_default_value')),
        ];
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                ImageColumn::make('logo_url'),
                TextColumn::make('title')
                    ->label(__('club.title'))
                    ->searchable()
                    ->sortable(),
                TextColumn::make('slug')
                    ->label(__('Slug'))
                    ->searchable(),
                TextColumn::make('apply_url')
                    ->label(__('club.apply_url'))
                    ->copyable(),
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
            MembershipTypesRelationManager::class,
            DivisionsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListClubs::route('/'),
            'create' => Pages\CreateClub::route('/create'),
            'edit' => Pages\EditClub::route('/{record}/edit'),
        ];
    }
}
