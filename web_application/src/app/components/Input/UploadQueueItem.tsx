import {
    File as FileIcon,
    Image as ImageIcon,
    LoaderCircle,
    X,
} from 'lucide-react';
import { Progress } from '../ui/progress';
import { UploadTask } from './MediaInput';
import { deleteMedia } from '@/actions/media/delete';

interface UploadQueueItemProps {
    task: UploadTask;
    onRemove: () => void;
}

export default function UploadQueueItem({
    task,
    onRemove,
}: UploadQueueItemProps) {
    async function handleRemove() {
        if (!task.mediaId) {
            return;
        }

        const response = await deleteMedia({ id: task.mediaId });

        if (response) {
            onRemove();
        } else {
            console.error(response);
        }
    }

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

                {task.progress === 100 && task.mediaId ? (
                    <button
                        onClick={handleRemove}
                        className="ml-2"
                        type="button"
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
