import { useState } from 'react';
import { Briefcase, MapPin, Building, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface JobModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const JobModal = ({ isOpen, onClose }: JobModalProps) => {
    const [formData, setFormData] = useState({
        title: '',
        department: '',
        location: 'Remote',
        type: 'Full-time'
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Posting job:', formData);
        // In a real app, this would POST to backend
        alert('Job Posted Successfully! (This is a demo action)');
        onClose();
        setFormData({ title: '', department: '', location: 'Remote', type: 'Full-time' });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
                    >
                        <div className="bg-[#0f0c29] border border-white/10 rounded-2xl w-full max-w-lg p-6 shadow-2xl pointer-events-auto mx-4">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-cyan-500/10 rounded-lg">
                                        <Briefcase className="text-cyan-400" size={24} />
                                    </div>
                                    <h2 className="text-2xl font-bold text-white">Post New Job</h2>
                                </div>
                                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Job Title</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                        placeholder="e.g. Senior Product Designer"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Department</label>
                                        <div className="relative">
                                            <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <input
                                                required
                                                type="text"
                                                value={formData.department}
                                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                                placeholder="e.g. Design"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Location</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
                                            <select
                                                value={formData.location}
                                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 pl-10 text-white focus:outline-none focus:border-cyan-500 transition-colors appearance-none cursor-pointer"
                                            >
                                                <option value="Remote">Remote</option>
                                                <option value="On-site">On-site</option>
                                                <option value="Hybrid">Hybrid</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Employment Type</label>
                                    <div className="flex gap-2">
                                        {['Full-time', 'Contract', 'Internship'].map((type) => (
                                            <button
                                                key={type}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, type })}
                                                className={`flex-1 py-2 rounded-lg text-sm border transition-colors ${formData.type === type
                                                        ? 'bg-cyan-500/20 border-cyan-500 text-cyan-400'
                                                        : 'border-white/10 text-gray-400 hover:border-white/30'
                                                    }`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all transform hover:-translate-y-0.5"
                                    >
                                        Publish Job
                                    </button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default JobModal;
