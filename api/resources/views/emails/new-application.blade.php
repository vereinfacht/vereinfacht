<x-mail::message>
<x-slot:header>
{{ $membership->club?->logo_url }}
</x-slot:header>

@lang('email.new_application.intro', [
    'club' => $membership->club?->title
])


@component('emails.components.membership-data', ['membership' => $membership])
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
