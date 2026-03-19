import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface PillButtonProps {
    children: ReactNode;
    variant?: 'dark' | 'yellow' | 'outline';
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    className?: string;
}

export const PillButton = ({
    children,
    variant = 'dark',
    onClick,
    type = 'button',
    disabled = false,
    className = '',
}: PillButtonProps) => {
    const variantClasses = {
        dark: 'pill-button',
        yellow: 'pill-button pill-button--yellow',
        outline: 'pill-button pill-button--outline',
    };

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${variantClasses[variant]} ${className}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
        >
            <span className="relative z-10">{children}</span>
        </motion.button>
    );
};
