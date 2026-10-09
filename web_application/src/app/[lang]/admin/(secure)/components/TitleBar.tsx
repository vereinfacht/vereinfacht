import Title from './Navigation/Title';

export default function TitleBar() {
    return (
        <div className="col-span-2 flex items-center py-4 lg:col-span-1">
            <Title className="flex-1" />
        </div>
    );
}
