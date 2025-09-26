import {
    File as FileIcon,
    Image as ImageIcon,
    LoaderCircle,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import HelpText from '../HelpText';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import InputLabel from './InputLabel';

interface MediaInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
    label?: string;
    help?: string;
    name?: string;
    required?: boolean;
    multiple?: boolean;
    accept: string;
    onFilesChange?: (files: File[]) => void;
}

interface UploadTask {
    rawFile: File;
    progress: number;
}

interface UploadQueueItemProps {
    task: UploadTask;
    onRemove: () => void;
}

function UploadQueueItem({ task, onRemove }: UploadQueueItemProps) {
    return (
        <div className="mt-3 w-full">
            <div
                className={`relative flex w-full items-center justify-between rounded-md border bg-white px-3 py-2 shadow-sm ${
                    task.progress > 0 && task.progress < 100
                        ? 'animate-pulse'
                        : ''
                }`}
            >
                <div className="flex items-center space-x-2">
                    {task.rawFile.type.startsWith('image/') ? (
                        <ImageIcon className="text-slate-500" />
                    ) : (
                        <FileIcon className="text-slate-500" />
                    )}
                    <span className="truncate text-sm">
                        {task.rawFile.name}
                    </span>
                    <span className="ml-4 text-sm text-slate-500">
                        ({(task.rawFile.size / 1024 / 1024).toFixed(2)} MB)
                    </span>
                </div>

                {task.progress === 100 ? (
                    <button
                        type="button"
                        onClick={onRemove}
                        className="ml-2"
                        aria-label={`Remove ${task.rawFile.name} from upload queue`}
                    >
                        <X className="text-red-500" size={16} />
                    </button>
                ) : (
                    <div className="flex items-center gap-1">
                        <p className="text-xs text-slate-500">
                            {task.progress.toFixed(0)}%
                        </p>
                        <LoaderCircle
                            className="animate-spin text-slate-500"
                            size={16}
                        />
                    </div>
                )}

                {task.progress > 0 && task.progress < 100 && (
                    <div className="absolute bottom-0 left-0 w-full">
                        <Progress className="h-1" value={task.progress} />
                    </div>
                )}
            </div>
        </div>
    );
}

export function MediaInput({
    id,
    label,
    help,
    name,
    required = false,
    multiple = false,
    accept,
    onFilesChange,
}: MediaInputProps) {
    const [uploadQueue, setUploadQueue] = useState<UploadTask[]>([]);
    const mediaInputRef = useRef<HTMLInputElement | null>(null);

    const handleAddFiles = (newFiles: File[]) => {
        setUploadQueue((currentQueue) => {
            const tasksToAdd = newFiles.map((rawFile) => ({
                rawFile,
                progress: 0,
            }));
            const combinedQueue = multiple
                ? [...currentQueue, ...tasksToAdd]
                : tasksToAdd.slice(0, 1);

            const uniqueQueue = combinedQueue.filter(
                (task, i, array) =>
                    i ===
                    array.findIndex(
                        (t) =>
                            t.rawFile.name === task.rawFile.name &&
                            t.rawFile.size === task.rawFile.size,
                    ),
            );

            if (mediaInputRef.current) {
                const dataTransfer = new DataTransfer();
                uniqueQueue.forEach((task) =>
                    dataTransfer.items.add(task.rawFile),
                );
                mediaInputRef.current.files = dataTransfer.files;
            }

            onFilesChange?.(uniqueQueue.map((task) => task.rawFile));
            return uniqueQueue;
        });
    };

    const onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        handleAddFiles(Array.from(e.target.files));
    };

    const removeFileFromQueue = (index: number) => {
        setUploadQueue((queue) => {
            const updatedQueue = queue.filter((_, i) => i !== index);

            if (mediaInputRef.current) {
                const dataTransfer = new DataTransfer();
                updatedQueue.forEach((task) =>
                    dataTransfer.items.add(task.rawFile),
                );
                mediaInputRef.current.files = dataTransfer.files;
            }

            onFilesChange?.(updatedQueue.map((task) => task.rawFile));
            return updatedQueue;
        });
    };

    // Upload simulation per file
    useEffect(() => {
        const intervals: NodeJS.Timeout[] = [];

        uploadQueue.forEach((task, index) => {
            if (task.progress >= 100) return;

            const fileSizeKB = task.rawFile.size / 1024;
            const uploadSpeedKBps = 500;
            const durationMs = (fileSizeKB / uploadSpeedKBps) * 1000;
            const steps = Math.ceil(durationMs / 100);
            const progressIncrement = 100 / steps;

            const interval = setInterval(() => {
                setUploadQueue((queue) =>
                    queue.map((t, i) =>
                        i === index
                            ? {
                                  ...t,
                                  progress: Math.min(
                                      t.progress + progressIncrement,
                                      100,
                                  ),
                              }
                            : t,
                    ),
                );
            }, 100);

            intervals.push(interval);
        });

        return () => intervals.forEach((interval) => clearInterval(interval));
    }, [uploadQueue]);

    return (
        <div className="flex w-full flex-col items-start">
            {label && (
                <InputLabel forInput={id} required={required}>
                    {label}
                </InputLabel>
            )}

            <Input
                className="mt-1 px-3 py-2 hover:bg-slate-50"
                ref={mediaInputRef}
                id={id}
                type="file"
                accept={accept}
                multiple={multiple}
                name={name}
                required={required}
                onChange={onFileInputChange}
            />

            {help && <HelpText text={help} className="mt-0.5" />}

            {uploadQueue.map((task, index) => (
                <UploadQueueItem
                    key={`${task.rawFile.name}-${task.rawFile.size}`}
                    task={task}
                    onRemove={() => removeFileFromQueue(index)}
                />
            ))}
        </div>
    );
}
