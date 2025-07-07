<x-mail::panel>
@if ($count > 1)
**{{ $index }}. {{ trans_choice('member.label', 1) }}**
@else
**{{ trans_choice('member.label', 1) }}**
@endif


**@lang('member.name'):** {{$member->full_name}}\
**@lang('member.gender'):** @isset($member->gender)@lang('member.gender_options.' . $member->gender)@endisset\
**@lang('member.has_consented_media_publication'):** {{$member->consented_media_publication_at?->isPast() ? __('yes') : __('no')}}\
**@lang('member.address'):** {{$member->address}}\
**@lang('member.zip_code'):** {{$member->zip_code}}\
**@lang('member.city'):** {{$member->city}}\
**@lang('member.country'):** @lang('country.' . $member->country)\
**@lang('member.birthday'):** {{\Illuminate\Support\Carbon::parse($member->birthday)->format('d.m.Y')}}\
**@lang('member.phone_number'):** {{$member->phone_number}}\
**@lang('member.email'):** {{$member->email}}\
**@lang('member.divisions'):** {{ implode(', ', $member->divisions->map->title->toArray()) }}
</x-mail::panel>
