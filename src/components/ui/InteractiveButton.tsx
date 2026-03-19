import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface InteractiveButtonProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    variant?: 'primary' | 'secondary' | 'danger';
    type?: 'button' | 'submit' | 'reset';
}

const InteractiveButton = ({
    children,
    onClick,
    className = "",
    variant = 'primary',
    type = 'button'
}: InteractiveButtonProps) => {

    const baseStyles = "relative px-6 py-3 rounded-full overflow-hidden border border-toyfight-cream/20 font-sans font-medium uppercase tracking-wider text-sm transition-colors duration-300";

    // Variants define the initial and hover states
    const variants = {
        primary: {
            bg: "bg-toyfight-yellow",
            text: "group-hover:text-black"
        },
        secondary: {
            bg: "bg-toyfight-cream",
            text: "group-hover:text-toyfight-bg"
        },
        danger: {
            bg: "bg-red-500",
            text: "group-hover:text-white"
        }
    };

    const selectedVariant = variants[variant];

    return (
        <motion.button
            type={type}
            onClick={onClick}
            className={`${baseStyles} group ${className}`}
            initial="initial"
            whileHover="hover"
            whileTap="tap"
        >
            {/* Background Fill Animation */}
            <motion.div
                className={`absolute inset-0 ${selectedVariant.bg} translate-y-full`}
                variants={{
                    initial: { translateY: "100%" },
                    hover: { translateY: "0%" },
                    tap: { scale: 0.95 }
                }}
                transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} // Bezier curve for "luxury" feel
            />

            {/* Text Content */}
            <span className={`relative z-10 transition-colors duration-300 ${selectedVariant.text}`}>
                {children}
            </span>
        </motion.button>
    );
};

export default InteractiveButton;
