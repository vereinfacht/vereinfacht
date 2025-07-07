'use server';

import { clubApi } from '@/services/club-api';
import { JsonApiClub } from '@/types/jsonapi-models';
import { Club } from '@/types/models';
import { deserialize } from 'jsonapi-fractal';
import { notFound } from 'next/navigation';

export async function fetchClubDataOrFail(
    slug: string,
    lang: string,
): Promise<Club> {
    clubApi.setLocale(lang);
    const response = await clubApi.findClubBySlug<JsonApiClub>(slug);
    const clubs = deserialize<Club>(response);

    if (!clubs || !Array.isArray(clubs) || clubs.length <= 0) {
        notFound();
    }

    const club: Club = clubs[0];

    if (!club) {
        notFound();
    }

    return club;
}
