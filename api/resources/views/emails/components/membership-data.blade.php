@php
    $showBillingData = isset($showBillingData) && $showBillingData === false ? false : true;
@endphp
**{{ trans_choice('membership.label', 1) }}**

- **@lang('membership.type'):** {{$membership->membershipType?->title}}
- **@lang('membership.start'):** {{\Illuminate\Support\Carbon::parse($membership->started_at)->isoFormat('L')}}
@if ($showBillingData)
@include('emails.components.cost-summary', ['membership' => $membership])
- **@lang('membership.bank_iban'):** {{$membership->bank_iban}}
- **@lang('membership.bank_account_holder'):** {{$membership->bank_account_holder}}
- **{{ trans_choice('payment-period.label', 1) }}:** {{$membership->paymentPeriod?->title}}
- **@lang('membership.notes'):** {{$membership->notes}}
@endif
