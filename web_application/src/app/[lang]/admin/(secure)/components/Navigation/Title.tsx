'use client';

import Text from '@/app/components/Text/Text';
import { useRoutePattern } from '@/hooks/useRoutePattern';
import { ResourceName } from '@/resources/resource';
import { getI18nNamespace } from '@/utils/localization';
import useTranslation from 'next-translate/useTranslation';
import { useParams, useSelectedLayoutSegments } from 'next/navigation';

interface Props {
    className?: string;
}

function getTitleForCurrentPage(
    params: ReturnType<typeof useParams>,
    segments: string[],
    patternSegments: string[],
    patternPath: string,
    t: ReturnType<typeof useTranslation>['t'],
): string {
    if (patternSegments.length === 0) {
        return t('general:title');
    }

    const [firstSegment, secondSegment] = patternSegments;
    const isEditRoute = patternSegments.includes('edit');
    const isDynamicSegment = (segment: string) => segment?.startsWith('[');

    // Helper function to safely get translation
    const safeTranslate = (key: string, options?: any) => {
        try {
            return t(key, options);
        } catch {
            return null;
        }
    };

    // Helper function to get resource title
    const getResourceTitle = (resourceName: string, namespace: string) => {
        if (isEditRoute) {
            const baseTitle = safeTranslate(`${namespace}:title`, { count: 1 });
            const editText = safeTranslate('general:edit');
            return baseTitle && editText ? `${baseTitle} ${editText}` : null;
        }
        return safeTranslate(`${namespace}:title`, { count: 2 });
    };

    // Case 1: Top level admin panel items
    if (patternSegments.length === 1 && !isDynamicSegment(firstSegment)) {
        return safeTranslate(`admin:${firstSegment}`) || t('general:title');
    }

    // Case 2: Nested routes with two consecutive non-dynamic segments
    if (
        patternSegments.length >= 2 &&
        !isDynamicSegment(firstSegment) &&
        !isDynamicSegment(secondSegment)
    ) {
        const namespace = getI18nNamespace(firstSegment as ResourceName);
        const nestedTitle = safeTranslate(`${namespace}:${secondSegment}`);
        if (nestedTitle) return nestedTitle;
    }

    // Case 3: Club routes
    if (firstSegment === 'club') {
        const baseTitle = t('club:title', { count: 1 });
        return isEditRoute ? `${baseTitle} ${t('general:edit')}` : baseTitle;
    }

    // Case 4: Resource routes
    const resourceName = (params.resource as string) ?? firstSegment;
    const namespace = getI18nNamespace(resourceName as ResourceName);

    const resourceTitle = getResourceTitle(resourceName, namespace);
    if (resourceTitle) return resourceTitle;

    return t('general:title');
}

export default function Title({ className }: Props) {
    const { t } = useTranslation();
    const params = useParams();
    const segments = useSelectedLayoutSegments();

    const { adminSegments: patternSegments, adminPath: patternPath } =
        useRoutePattern();

    const title = getTitleForCurrentPage(
        params,
        segments,
        patternSegments,
        patternPath,
        t,
    );

    return (
        <Text
            tag="h1"
            className={[
                'text-base font-bold tracking-[0.005em] md:text-2xl',
                className,
            ].join(' ')}
        >
            {title}
        </Text>
    );
}
