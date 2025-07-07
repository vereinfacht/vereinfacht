import React, { PropsWithChildren } from 'react';
import styles from './CardItem.module.css';
import { BooleanIcon } from '../BooleanIcon';

interface Props extends PropsWithChildren {
    checked?: boolean;
    hasLine?: boolean;
}

function CardItem({ children, checked, hasLine }: Props) {
    return (
        <div className="flex gap-3 text-sm">
            <div className="relative flex w-5 justify-center">
                {checked !== undefined ? (
                    <BooleanIcon checked={checked} />
                ) : (
                    <div className="mt-[0.55em] h-[0.375rem] w-[0.375rem] rounded-full bg-slate-500"></div>
                )}
                {hasLine && (
                    <div
                        className={[
                            'line absolute top-2 -z-10 w-[0.125rem] rounded-xl bg-slate-300',
                            styles.line,
                        ].join(' ')}
                    ></div>
                )}
            </div>
            <div className="flex-1">{children}</div>
        </div>
    );
}

export default CardItem;
