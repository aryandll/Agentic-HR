import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, MapPin, Building2, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import InteractiveButton from './ui/InteractiveButton';

interface PostJobModalProps {
    isOpen: boolean;
    onClose: () => void;
    onJobPosted: () => void;
}

const PostJobModal: React.FC<PostJobModalProps> = ({ isOpen, onClose, onJobPosted }) => {
    const { addNotification } = useNotification();
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: 'Remote',
        type: 'Full-time',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                toast.success('Mission Brief Uploaded');
                addNotification('New Job Posted', `Job "${formData.title}" is now live on the careers page.`, 'success');
                onJobPosted();
                onClose();
                setFormData({ title: '', department: '', location: 'Remote', type: 'Full-time', description: '' });
            } else {
                toast.error('Failed to post job');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error posting job');
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-toyfight-bg w-full max-w-2xl border border-toyfight-cream/20 relative"
                >
                    <div className="p-8 pb-0 flex justify-between items-start">
                        <div>
                            <h2 className="text-4xl font-header font-bold text-toyfight-cream uppercase leading-none tracking-tighter">
                                NEW <span className="text-toyfight-yellow">MISSION</span>
                            </h2>
                            <p className="font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest mt-2">DEFINE ROLE PARAMETERS</p>
                        </div>
                        <button onClick={onClose} className="text-toyfight-cream/50 hover:text-toyfight-cream transition-colors">
                            <X size={32} strokeWidth={1.5} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2 group">
                                <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest group-focus-within:text-toyfight-yellow transition-colors">Job Title</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="text"
                                        placeholder="SENIOR DESIGNER"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 text-toyfight-cream font-header text-2xl uppercase placeholder:text-toyfight-cream/10 focus:outline-none focus:border-toyfight-yellow transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest group-focus-within:text-toyfight-yellow transition-colors">Department</label>
                                <div className="relative">
                                    <select
                                        required
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 text-toyfight-cream font-header text-2xl uppercase focus:outline-none focus:border-toyfight-yellow transition-all appearance-none cursor-pointer"
                                    >
                                        <option value="" className="bg-toyfight-bg text-base">Select...</option>
                                        {['Engineering', 'Product', 'Design', 'Marketing', 'HR', 'Sales'].map(d => (
                                            <option key={d} value={d} className="bg-toyfight-bg text-base font-mono">{d}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest group-focus-within:text-toyfight-yellow transition-colors">Location</label>
                                <div className="relative">
                                    <input
                                        required
                                        type="text"
                                        placeholder="REMOTE / NYC"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 text-toyfight-cream font-header text-2xl uppercase placeholder:text-toyfight-cream/10 focus:outline-none focus:border-toyfight-yellow transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2 group">
                                <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest group-focus-within:text-toyfight-yellow transition-colors">Type</label>
                                <div className="relative">
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 text-toyfight-cream font-header text-2xl uppercase focus:outline-none focus:border-toyfight-yellow transition-all appearance-none cursor-pointer"
                                    >
                                        {['Full-time', 'Part-time', 'Contract', 'Internship'].map(t => (
                                            <option key={t} value={t} className="bg-toyfight-bg text-base font-mono">{t}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2 group">
                            <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest group-focus-within:text-toyfight-yellow transition-colors">Brief</label>
                            <div className="relative">
                                <textarea
                                    required
                                    rows={4}
                                    placeholder={`Summary\n(Brief overview of the role...)\n\nDescription\n(Detailed responsibilities...)\n\nQualifications\n(Requirements and skills...)`}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 text-toyfight-cream font-mono text-sm placeholder:text-toyfight-cream/30 focus:outline-none focus:border-toyfight-yellow transition-all resize-none h-64"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end gap-4 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-4 font-header font-bold text-toyfight-cream uppercase tracking-wider hover:text-toyfight-yellow transition-colors"
                            >
                                ABORT
                            </button>
                            <InteractiveButton type="submit">
                                PUBLISH OP
                            </InteractiveButton>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PostJobModal;
