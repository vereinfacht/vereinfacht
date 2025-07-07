<x-mail::message>
<x-slot:header>
{{ $membership->club?->logo_url }}
</x-slot:header>

@lang('email.application_received.intro', [
    'club' => $membership->club?->title,
    'email' => $membership->club?->email
])


@component('emails.components.membership-data', [
    'membership' => $membership,
    'showBillingData' => $isOwner
])
@endcomponent


@foreach ($membership->members as $member)
@component('emails.components.member-data', [
    'member' => $member,
    'index' => $loop->iteration,
    'count' => $loop->count
])
@endcomponent
@endforeach


</x-mail::message>
