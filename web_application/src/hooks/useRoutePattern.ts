import { usePathname, useParams } from 'next/navigation';

export function useRoutePattern() {
    const pathname = usePathname();
    const params = useParams();

    let path = pathname;

    Object.entries(params).forEach(([key, value]) => {
        path = path.replace(String(value), `[${key}]`);
    });

    const segments = path.split('/').slice(1);
    const adminSegments = segments.slice(segments.indexOf('admin') + 1);
    const adminPath = segments.slice(segments.indexOf('admin') + 1).join('/');

    return {
        path,
        adminPath,
        segments,
        adminSegments,
    };
}
