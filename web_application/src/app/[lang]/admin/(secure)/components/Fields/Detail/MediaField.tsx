import React from 'react';

interface Props {
    value?: any;
}

export default function MediaField({ value }: Props) {
    return value.map((media: any) =>
        media.mimeType === 'application/pdf' ? (
            <a
                key={media.id}
                href={media.originalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mb-6 block text-blue-600 underline"
            >
                {media.name} ({(media.size / 1024 / 1024).toFixed(2)} MB, PDF)
            </a>
        ) : (
            <figure key={media.id} className="mb-6">
                <img
                    src={media.originalUrl}
                    alt={media.name}
                    className="h-36 w-36 rounded-lg border border-slate-200 object-cover"
                />
                <figcaption className="text-sm text-slate-500">
                    <p>{media.name}</p>
                    <p>{media.mimeType}</p>
                    <p>{(media.size / 1024 / 1024).toFixed(2)} MB</p>
                </figcaption>
            </figure>
        ),
    );
}
