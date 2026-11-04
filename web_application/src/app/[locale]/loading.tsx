import IconLoading from '/public/svg/loading.svg';

export default function Loading() {
    return (
        <div className="mx-auto my-10 flex max-w-md flex-col items-center justify-center space-y-5">
            <IconLoading className="h-8 w-8 text-slate-900" />
        </div>
    );
}
