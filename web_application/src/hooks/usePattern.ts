import Boxes from '@/app/components/Patterns/Boxes';
import CheckerBoard from '@/app/components/Patterns/CheckerBoard';
import Dots from '@/app/components/Patterns/Dots';
import Lines from '@/app/components/Patterns/Lines';
import Triangles from '@/app/components/Patterns/Triangles';
import Waves from '@/app/components/Patterns/Waves';

const patterns: JSX.Element[] = [
    Waves(),
    Dots(),
    Triangles(),
    Boxes(),
    Lines(),
    CheckerBoard(),
];

export function usePattern(index: number) {
    if (!index) {
        return patterns[0];
    }

    return patterns[index % patterns.length];
}
