import React from 'react';

interface Props {
    value?: any;
}

export default function MediaField({ value }: Props) {
    return value.map((media: any) => (
        <figure key={media.id}>
            <img src={media.url} alt={media.name} />
            {media.name} ({media.mime_type})
        </figure>
    ));
}
