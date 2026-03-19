import { ReactNode } from 'react';

interface ChipTagProps {
    children: ReactNode;
    variant?: 'lavender' | 'pink' | 'yellow' | 'mint' | 'peach';
    className?: string;
}

export const ChipTag = ({
    children,
    variant = 'lavender',
    className = '',
}: ChipTagProps) => {
    const variantClasses = {
        lavender: 'chip-tag',
        pink: 'chip-tag chip-tag--pink',
        yellow: 'chip-tag chip-tag--yellow',
        mint: 'chip-tag chip-tag--mint',
        peach: 'chip-tag chip-tag--peach',
    };

    return (
        <span className={`${variantClasses[variant]} ${className}`}>
            {children}
        </span>
    );
};
