import { useToast } from '@/hooks/toast/use-toast';
import useTranslation from 'next-translate/useTranslation';
import { useEffect, useRef, useState } from 'react';
import HelpText from '../HelpText';
import { Input } from '../ui/input';
import InputLabel from './InputLabel';
import UploadQueueItem from './UploadQueueItem';
import { TMediaDeserialized } from '@/types/resources';

interface MediaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    accept: string;
    setLoading: (isLoading: boolean) => void;
    label?: string;
    help?: string;
    name?: string;
    media?: TMediaDeserialized[];
    multiple?: boolean;
}

export interface UploadTask {
    progress: number;
    rawFile:
        | File
        | {
              name: string;
              size: number;
              type: string;
          };
    mediaId?: string;
}

export function MediaInput({
    id,
    label,
    help,
    name,
    media,
    multiple = false,
    accept,
    setLoading,
}: MediaInputProps) {
    const { toast } = useToast();
    const { t } = useTranslation();
    const [uploadQueue, setUploadQueue] = useState<UploadTask[]>(
        media
            ? media.map((m) => ({
                  progress: 100,
                  mediaId: m.id,
                  rawFile: {
                      name: m.fileName,
                      size: m.size,
                      type: m.mimeType,
                  },
              }))
            : [],
    );
    const [mediaIds, setMediaIds] = useState<string[]>([]);
    const mediaInputRef = useRef<HTMLInputElement | null>(null);

    const handleAddFiles = (newFiles: File[]) => {
        setUploadQueue((currentQueue) => {
            const existingFiles = new Set(
                currentQueue.map((f) => f.rawFile.name + f.rawFile.size),
            );
            const tasksToAdd = newFiles
                .filter((f) => !existingFiles.has(f.name + f.size))
                .map((rawFile) => ({ rawFile, progress: 0 }));

            return multiple
                ? [...currentQueue, ...tasksToAdd]
                : tasksToAdd.slice(0, 1);
        });
    };

    function onFileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (!e.target.files) {
            return;
        }

        handleAddFiles(Array.from(e.target.files));
    }

    async function uploadFile(task: UploadTask, index: number) {
        if (task.progress === 100 || task.rawFile instanceof File === false) {
            return;
        }

        const formData = new FormData();
        formData.append('file', task.rawFile);
        formData.set('collectionName', 'receipts');

        const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
        });

        const result = await response.json();

        if (result.status === 201 && result.mediaId) {
            setMediaIds((ids) => [...ids, result.mediaId]);
            setUploadQueue((queue) =>
                queue.map((t, i) =>
                    i === index
                        ? { ...t, progress: 100, mediaId: result.mediaId }
                        : t,
                ),
            );

            toast({
                variant: 'success',
                description: t('notification:media.upload.success', {
                    fileName: task.rawFile.name,
                }),
            });
        } else {
            setUploadQueue((queue) => queue.filter((_, i) => i !== index));
            toast({
                variant: 'error',
                description: t('notification:media.upload.error', {
                    fileName: task.rawFile.name,
                }),
            });
        }
    }

    const isUploading = useRef(false);

    useEffect(() => {
        const uploadAll = async () => {
            if (uploadQueue.length === 0 || isUploading.current) {
                return;
            }

            isUploading.current = true;
            setLoading(true);

            for (let i = 0; i < uploadQueue.length; i++) {
                const task = uploadQueue[i];
                if (task.progress < 100) {
                    await uploadFile(task, i);
                }
            }

            setLoading(false);
            isUploading.current = false;
        };

        uploadAll();
    }, [uploadQueue]);

    return (
        <div className="flex w-full flex-col items-start">
            {label && <InputLabel forInput={id}>{label}</InputLabel>}
            <input
                type="hidden"
                name={'relationships[media][media]'}
                value={
                    mediaIds.length > 0 ? '[' + mediaIds.join(',') + ']' : '[]'
                }
            />
            <Input
                className="mt-1 px-3 py-2 hover:bg-slate-50"
                ref={mediaInputRef}
                id={id}
                type="file"
                accept={accept}
                multiple={multiple}
                name={name}
                onChange={onFileInputChange}
                data-cy="media-input"
            />
            {help && <HelpText text={help} className="mt-0.5" />}
            {uploadQueue.map((task, index) => (
                <UploadQueueItem
                    key={`${task.rawFile.name}-${task.rawFile.size}`}
                    task={task}
                    onRemove={() => {
                        setUploadQueue((queue) =>
                            queue.filter((_, i) => i !== index),
                        );
                        if (task.mediaId) {
                            setMediaIds((ids) =>
                                ids.filter((id) => id !== task.mediaId),
                            );
                        }
                    }}
                />
            ))}
        </div>
    );
}
