import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface BrutalistCardProps {
    children: ReactNode;
    variant?: 'default' | 'dark' | 'lavender' | 'pink';
    className?: string;
    animate?: boolean;
}

export const BrutalistCard = ({
    children,
    variant = 'default',
    className = '',
    animate = true,
}: BrutalistCardProps) => {
    const variantClasses = {
        default: 'brutalist-card',
        dark: 'brutalist-card brutalist-card--dark',
        lavender: 'brutalist-card brutalist-card--lavender',
        pink: 'brutalist-card brutalist-card--pink',
    };

    const cardContent = (
        <div className={`${variantClasses[variant]} ${className}`}>
            {children}
        </div>
    );

    if (!animate) {
        return cardContent;
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            {cardContent}
        </motion.div>
    );
};
