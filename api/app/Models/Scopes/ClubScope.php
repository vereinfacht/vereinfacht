<?php

namespace App\Models\Scopes;

use App\Models\Club;
use App\Models\User;
use App\Models\TaxAccount;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;
use App\Models\DivisionMembershipType;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Scope;
use Illuminate\Database\Eloquent\Builder;

class ClubScope implements Scope
{
    public function apply(Builder $builder, Model $model): void
    {
        $user = Auth::user();

        if (!$user) {
            $builder->take(0);

            return;
        }

        if (
            $user instanceof User
            && $user->isSuperAdmin()
        ) {
            return;
        }

        $clubId = null;

        if ($user instanceof Club) {
            $clubId = $user->id;
        }

        // While it's not ideal to filter the resources by the current permissionsTeamId
        // there is no easy way respect the defined view policy methods while processing
        // the JSON api request.
        // However, as long as the user cannot manipulate the current permissionsTeamId
        // freely and we do not need more granular view policies, this should be fine for now.
        // see: https://laraveljsonapi.io/docs/1.0/requests/authorization.html#hiding-entire-resources
        $clubId = getPermissionsTeamId();

        if (!$clubId) {
            $builder->take(0);

            return;
        }

        $this->filterByClubId($builder, $model, $clubId);
    }

    protected function filterByClubId(Builder $builder, Model $model, int $clubId): void
    {
        if ($model instanceof Club) {
            $builder->where('id', $clubId);

            return;
        }

        if ($model instanceof User) {
            $builder->whereHas('roles', function ($query) use ($clubId) {
                $query->where('model_has_roles.club_id', $clubId);
            });

            return;
        }

        if ($model instanceof Transaction) {
            $builder->whereHas('statement.financeAccount', function ($query) use ($clubId) {
                $query->where('club_id', $clubId);
            });

            return;
        }

        if ($model instanceof DivisionMembershipType) {
            $builder->whereHas('division', function ($query) use ($clubId) {
                $query->where('club_id', $clubId);
            });

            return;
        }

        if ($model instanceof TaxAccount) {
            $club = Club::find($clubId);

            if (!$club) {
                $builder->take(0);
                return;
            }

            $builder->where(function ($query) use ($club, $clubId) {
                $query->whereNull('club_id');

                $query->orWhere(function ($subQuery) use ($club, $clubId) {
                    $subQuery->where('club_id', $clubId);

                    if ($club->taxAccountChart) {
                        $subQuery->where(function ($chartQuery) use ($club) {
                            $chartQuery->where('tax_account_chart_id', $club->taxAccountChart->id)
                                ->orWhereNull('tax_account_chart_id');
                        });
                    } else {
                        $subQuery->whereNull('tax_account_chart_id');
                    }
                });
            });

            return;
        }

        $builder->where('club_id', $clubId);
    }
}
