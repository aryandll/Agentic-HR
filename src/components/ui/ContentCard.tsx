import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ContentCardProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    title?: string;
}

const ContentCard = ({ children, className = "", delay = 0, title }: ContentCardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: delay, ease: "easeOut" }}
            className={`group relative bg-toyfight-bg border border-toyfight-cream/10 p-6 overflow-hidden flex flex-col ${className}`}
        >
            {/* Hover Reveal Border/Background */}
            <motion.div
                className="absolute inset-0 bg-toyfight-cream/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />

            <div className="absolute top-0 left-0 w-full h-1 bg-toyfight-yellow transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-in-out" />

            {title && (
                <div className="mb-4 shrink-0">
                    <h3 className="font-header text-xl text-toyfight-cream uppercase tracking-wide relative z-10">
                        {title}
                    </h3>
                    <div className="h-px w-full bg-toyfight-cream/10 mt-2 group-hover:bg-toyfight-cream/30 transition-colors duration-500" />
                </div>
            )}

            <div className="relative z-10 flex-1 min-h-0">
                {children}
            </div>
        </motion.div>
    );
};

export default ContentCard;
