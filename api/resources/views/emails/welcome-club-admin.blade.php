<x-mail::message>
<x-slot:header>
https://app.vereinfacht.digital/svg/vereinfacht_logo.svg
</x-slot:header>

{!! __('email.welcome_club_admin.intro', [
    'supportEmail' => $supportEmail,
    'url' => $url,
]) !!}

<x-mail::button :url="$url">
    @lang('email.welcome_club_admin.button')
</x-mail::button>

</x-mail::message>
