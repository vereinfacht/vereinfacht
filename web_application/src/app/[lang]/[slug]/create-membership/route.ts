import { FormMember } from '@/hooks/application/ApplicationProvider';
import { clubApi } from '@/services/club-api';
import { ValidationError } from '@/services/json-api';
import { Membership } from '@/types/models';
import { NextRequest, NextResponse } from 'next/server';

interface MemberIdentifier {
    id: string;
}
interface ClubIdentifier {
    id: string;
}

interface MembershipIdentifier {
    id: string;
}

async function createMember(
    member: FormMember,
    membershipId: MembershipIdentifier,
    clubId: ClubIdentifier,
): Promise<MemberIdentifier> {
    const memberRequest = {
        ...member,
        club: clubId,
        membership: membershipId,
    };
    const createMemberResponse = await clubApi.createMember(memberRequest);

    if (!createMemberResponse.data.id) {
        return Promise.reject('Could not create member');
    }

    return Promise.resolve({
        id: createMemberResponse.data.id,
    });
}

async function createMembership(
    membership: Membership,
    clubId: ClubIdentifier,
): Promise<MembershipIdentifier> {
    const membershipRequest = {
        ...membership,
        club: clubId,
    };

    const createMembershipResponse =
        await clubApi.createMembership(membershipRequest);

    if (!createMembershipResponse.data.id) {
        return Promise.reject('Could not create membership');
    }

    return Promise.resolve({
        id: createMembershipResponse.data.id,
    });
}

async function setOwner(
    membershipId: MembershipIdentifier,
    ownerId: MemberIdentifier,
) {
    const membershipRequest = {
        ...membershipId,
        owner: ownerId,
    };

    return await clubApi.updateMembership(membershipRequest);
}

async function applyMembership(membershipId: MembershipIdentifier) {
    const membershipRequest = {
        ...membershipId,
    };

    return await clubApi.applyMembership(membershipRequest);
}

export async function POST(request: NextRequest) {
    const data = await request.json();
    const clubId: ClubIdentifier = { id: data.clubId };
    const members: FormMember[] = data.application.members;
    const membership: Membership = data.application.membership;

    try {
        const membershipId = await createMembership(membership, clubId);

        const createdMemberIds = await Promise.all(
            members.map(async (member) =>
                createMember(member, membershipId, clubId),
            ),
        );

        await setOwner(membershipId, createdMemberIds[0]);

        await applyMembership(membershipId);

        return NextResponse.json('');
    } catch (error) {
        if (error instanceof ValidationError) {
            return new Response(JSON.stringify(error.errors), {
                status: 422,
                statusText: error.message,
            });
        }
        return NextResponse.error();
    }
}
