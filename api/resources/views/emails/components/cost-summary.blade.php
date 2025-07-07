- **@lang('membership.costs'):**
    - **@lang('membership.fee', ['title' => $membership->membershipType?->title])**: {{(new \App\Classes\Currency($membership->membershipType->monthly_fee))->formatted()}}
@foreach ($membership->members as $member)
@foreach ($member->divisions as $division)
@php
$monthlyFee = $division->membershipTypes()->where('membership_types.id', $membership->membership_type_id)->first()?->pivot?->monthly_fee ?? 0;
@endphp
@if ($monthlyFee > 0)
    - **{{$division->title}}** ({{$member->full_name}}): + {{(new \App\Classes\Currency($monthlyFee))->formatted()}}
@endif
@endforeach
@endforeach
@if ($membership->voluntary_contribution > 0)
    - **{{ __('membership.voluntary_contribution') }}**: + {{(new \App\Classes\Currency($membership->voluntary_contribution))->formatted()}}
@endif
    - **@lang('membership.sum'): {{(new \App\Classes\Currency($membership->getMonthlyFee()))->formatted()}}**
@if ($membership->membershipType->admission_fee > 0)
    - **@lang('membership-type.admission_fee')**: {{(new \App\Classes\Currency($membership->membershipType->admission_fee))->formatted()}}
@endif
