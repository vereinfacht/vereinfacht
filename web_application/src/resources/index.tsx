import { DivisionMembershipTypeResource } from '@/resources/division-membership-types';
import { DivisionResource } from '@/resources/divisions';
import { MembershipTypeResource } from '@/resources/membership-types';
import { MembershipResource } from '@/resources/memberships';
import { ResourceName } from '@/resources/resource';
import { SupportedLocale, supportedLocales } from '@/utils/localization';

// the order of these resources currently determines the order in the navigation
const resources = [
    new MembershipResource(),
    new MembershipTypeResource(),
    new DivisionResource(),
    new DivisionMembershipTypeResource(),
];

export const resourceNavigationItems = resources
    .map((resource) => {
        if (!resource.showInNavigation || !resource.canIndex) {
            return;
        }

        return resource.name;
    })
    .filter(Boolean) as ResourceName[];

export function findResource(resourceName: string, locale?: string) {
    const resource = resources.find(
        (resource) => resource.name === resourceName,
    );

    if (locale && supportedLocales.includes(locale as SupportedLocale)) {
        resource?.setLocale(locale as SupportedLocale);
    }

    return resource;
}
