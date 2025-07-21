<?php

namespace App\JsonApi\V1;

use App\JsonApi\V1\Clubs\ClubSchema;
use App\JsonApi\V1\DivisionMembershipTypes\DivisionMembershipTypeSchema;
use App\JsonApi\V1\Divisions\DivisionSchema;
use App\JsonApi\V1\FinanceAccounts\FinanceAccountSchema;
use App\JsonApi\V1\FinanceAccountTypes\FinanceAccountTypeSchema;
use App\JsonApi\V1\FinanceContacts\FinanceContactSchema;
use App\JsonApi\V1\Members\MemberSchema;
use App\JsonApi\V1\Memberships\MembershipSchema;
use App\JsonApi\V1\MembershipTypes\MembershipTypeSchema;
use App\JsonApi\V1\PaymentPeriods\PaymentPeriodSchema;
use App\JsonApi\V1\Transactions\TransactionSchema;
use App\JsonApi\V1\Roles\RoleSchema;
use App\JsonApi\V1\Users\UserSchema;
use App\Models\Club;
use App\Models\Division;
use App\Models\FinanceAccount;
use App\Models\FinanceContact;
use App\Models\Member;
use App\Models\Membership;
use App\Models\MembershipType;
use App\Models\Scopes\ClubScope;
use App\Models\Transaction;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;
use LaravelJsonApi\Core\Document\Error;
use LaravelJsonApi\Core\Exceptions\JsonApiException;
use LaravelJsonApi\Core\Server\Server as BaseServer;

class Server extends BaseServer
{
    /**
     * The base URI namespace for this server.
     */
    protected string $baseUri = '/api/v1';

    /**
     * Bootstrap the server when it is handling an HTTP request.
     */
    public function serving(): void
    {
        Auth::shouldUse('sanctum');

        $this->addClubScope();

        Membership::saving(static function (Membership $membership): void {
            self::handleClubAssociation($membership);
        });

        Member::saving(static function (Member $member): void {
            self::handleClubAssociation($member);
        });

        Division::saving(static function (Division $division): void {
            self::handleClubAssociation($division);
        });

        FinanceAccount::saving(static function (FinanceAccount $financeAccount): void {
            self::handleClubAssociation($financeAccount);
        });

        Transaction::saving(static function (Transaction $transaction): void {
            self::handleClubAssociation($transaction);
        });
    }

    protected static function handleClubAssociation(Model $model)
    {
        $user = Auth::user();
        $club = $model->club;

        if ($club && $user->can('view', $club)) {
            return $model->club()->associate($club->getKey());
        }

        if (!$club && $user instanceof Club) {
            return $model->club()->associate($user->id);
        }

        if (!$club && getPermissionsTeamId()) {
            return $model->club()->associate(getPermissionsTeamId());
        }

        // currently only used for club form and should be handled in another way
        if (!$club && $user->hasRole('super admin')) {
            return $model->club()->associate($user->current_club_id);
        }

        throw new JsonApiException(Error::fromArray([
            'status' => 403,
            'detail' => 'You are not allowed to save a resource for this club.',
        ]));
    }

    /**
     * Get the server's list of schemas.
     */
    protected function allSchemas(): array
    {
        return [
            ClubSchema::class,
            MembershipTypeSchema::class,
            MemberSchema::class,
            MembershipSchema::class,
            DivisionSchema::class,
            DivisionMembershipTypeSchema::class,
            UserSchema::class,
            PaymentPeriodSchema::class,
            FinanceAccountSchema::class,
            FinanceAccountTypeSchema::class,
            TransactionSchema::class,
            FinanceContactSchema::class,
            RoleSchema::class,
        ];
    }

    protected function addClubScope(): void
    {
        // To prevent resources for other clubs showing up when
        // indexing (this includes relatable queries) as a club
        // or club admin, remember to add the ClubScope to relevant
        // models. See ClubScope for more information.
        Club::addGlobalScope(new ClubScope);
        Member::addGlobalScope(new ClubScope);
        Division::addGlobalScope(new ClubScope);
        Membership::addGlobalScope(new ClubScope);
        Transaction::addGlobalScope(new ClubScope);
        MembershipType::addGlobalScope(new ClubScope);
        FinanceAccount::addGlobalScope(new ClubScope);
        FinanceContact::addGlobalScope(new ClubScope);
    }
}
