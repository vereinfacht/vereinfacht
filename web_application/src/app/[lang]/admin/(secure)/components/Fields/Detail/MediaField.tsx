import Text from '@/app/components/Text/Text';
import { FileIcon, ImageIcon } from 'lucide-react';

interface Props {
    value?: Array<{
        id: string | number;
        fileName: string;
        mimeType: string;
        size: number;
        previewUrl?: string;
        originalUrl: string;
    }>;
}

export default function MediaField({ value = [] }: Props) {
    if (!value.length) {
        return (
            <Text className="text-sm italic text-slate-400">
                No media available
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
                        className="relative w-48 rounded-md border border-slate-200 shadow-sm transition hover:shadow-md"
                    >
                        <picture className="relative block aspect-[0.707] overflow-hidden rounded-t-md bg-slate-100">
                            <img
                                src={media.previewUrl}
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
                            href={media.originalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute inset-0 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Open ${media.fileName}`}
                        />
                    </figure>
                );
            })}
        </div>
    );
}
