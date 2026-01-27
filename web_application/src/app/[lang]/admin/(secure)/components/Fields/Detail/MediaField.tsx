import Text from '@/app/components/Text/Text';
import { TMediaDeserialized } from '@/types/resources';
import { FileIcon, ImageIcon } from 'lucide-react';
import useTranslation from 'next-translate/useTranslation';

interface Props {
    value?: TMediaDeserialized[];
}

export default function MediaField({ value = [] }: Props) {
    const { t } = useTranslation('general');

    if (!value.length) {
        return (
            <Text className="text-sm italic text-slate-500">
                {t('no_media_attached')}
            </Text>
        );
    }

    return (
        <div className="flex flex-wrap gap-4">
            {value.map((media) => {
                const isImage = media.mimeType.startsWith('image/');
                const icon = isImage ? (
                    <ImageIcon className="w-4 text-slate-500" />
                ) : (
                    <FileIcon className="w-4 text-slate-500" />
                );

                return (
                    <figure
                        key={media.id}
                        className="relative w-48 rounded-md border border-slate-200 shadow-xs transition hover:shadow-md"
                    >
                        <picture className="relative block aspect-[0.707] overflow-hidden rounded-t-md bg-slate-100">
                            <img
                                src={''}
                                alt={`Preview of ${media.fileName}`}
                                className="absolute inset-0 h-full w-full object-contain"
                            />
                        </picture>

                        <figcaption className="flex items-center gap-2 border-t border-slate-200 p-2">
                            {icon}
                            <Text className="truncate text-xs">
                                {media.fileName} (
                                {(media.size / 1024 / 1024).toFixed(2)} MB)
                            </Text>
                        </figcaption>

                        <a
                            href={''}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 rounded-md focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                            aria-label={`Open ${media.fileName}`}
                        />
                    </figure>
                );
            })}
        </div>
    );
}
