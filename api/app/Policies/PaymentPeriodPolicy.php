<?php

namespace App\Policies;

use App\Models\Club;
use App\Models\PaymentPeriod;
use Illuminate\Foundation\Auth\User;

class PaymentPeriodPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        if ($user instanceof Club) {
            return true;
        }

        return $user->can('view paymentPeriods');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, PaymentPeriod $paymentPeriod): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, PaymentPeriod $paymentPeriod): bool
    {
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, PaymentPeriod $paymentPeriod): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, PaymentPeriod $paymentPeriod): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, PaymentPeriod $paymentPeriod): bool
    {
        return false;
    }
}
