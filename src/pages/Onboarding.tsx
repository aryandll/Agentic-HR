import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, ArrowRight, Download, FileText, Monitor, User } from 'lucide-react';
import InteractiveButton from '../components/ui/InteractiveButton';
import { useAuth } from '../context/AuthContext';

const Onboarding = () => {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Complete Profile Information', status: 'completed', icon: User },
        { id: 2, title: 'Sign Employment Contract', status: 'pending', icon: FileText },
        { id: 3, title: 'Setup Workstation & IT', status: 'pending', icon: Monitor },
        { id: 4, title: 'Review Employee Handbook', status: 'pending', icon: FileText },
        { id: 5, title: 'Team Introduction Meeting', status: 'locked', icon: User },
    ]);

    const handleComplete = (id: number) => {
        setTasks(tasks.map(t =>
            t.id === id ? { ...t, status: 'completed' } : t
        ));
    };

    const progress = Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100);

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-6xl font-header font-bold text-toyfight-cream uppercase leading-none tracking-tighter">
                        Onboarding <span className="text-toyfight-yellow">Protocol</span>
                    </h1>
                    <div className="flex items-center gap-4 mt-4">
                        <div className="h-2 w-24 bg-toyfight-cream" />
                        <span className="font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest">
                            WELCOME, {user?.name || 'RECRUIT'}
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-6xl font-header font-bold text-toyfight-yellow">{progress}%</span>
                    <span className="font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest">Module Completion</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-toyfight-cream/10 relative overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'circOut' }}
                    className="absolute top-0 left-0 h-full bg-toyfight-yellow"
                />
            </div>

            {/* Tasks Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Active Tasks */}
                <div className="space-y-4">
                    <h3 className="font-header text-2xl text-toyfight-cream uppercase mb-6">Required Actions</h3>
                    {tasks.map((task, index) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`
                                group bg-toyfight-bg border border-toyfight-cream/10 p-6 flex items-center justify-between transition-all
                                ${task.status === 'completed' ? 'opacity-50' : 'hover:border-toyfight-yellow'}
                                ${task.status === 'locked' ? 'opacity-30 pointer-events-none' : ''}
                            `}
                        >
                            <div className="flex items-center gap-6">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center border
                                    ${task.status === 'completed' ? 'bg-toyfight-yellow text-toyfight-bg border-toyfight-yellow' : 'border-toyfight-cream/20 text-toyfight-cream'}
                                `}>
                                    <task.icon size={20} />
                                </div>
                                <div>
                                    <h4 className="font-header text-xl text-toyfight-cream uppercase">{task.title}</h4>
                                    <span className="font-mono text-xs text-toyfight-cream/40 uppercase tracking-widest">
                                        {task.status}
                                    </span>
                                </div>
                            </div>

                            {task.status === 'pending' && (
                                <InteractiveButton onClick={() => handleComplete(task.id)} className="px-4 py-2 text-xs">
                                    Mark Done
                                </InteractiveButton>
                            )}
                            {task.status === 'completed' && (
                                <CheckCircle className="text-toyfight-yellow" />
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Resources */}
                <div className="space-y-4">
                    <h3 className="font-header text-2xl text-toyfight-cream uppercase mb-6">Resources</h3>
                    <div className="bg-toyfight-gray border border-toyfight-cream/10 p-8">
                        <h4 className="font-header text-xl text-toyfight-cream uppercase mb-2">Employee Handbook</h4>
                        <p className="font-mono text-xs text-toyfight-cream/60 mb-6 leading-relaxed">
                            Everything you need to know about our culture, policies, and benefits. Read this thoroughly before signing your contract.
                        </p>
                        <button className="flex items-center gap-2 text-toyfight-yellow font-header uppercase tracking-wider text-sm hover:gap-4 transition-all">
                            <Download size={16} /> Download PDF
                        </button>
                    </div>

                    <div className="bg-toyfight-gray border border-toyfight-cream/10 p-8">
                        <h4 className="font-header text-xl text-toyfight-cream uppercase mb-2">IT Setup Guide</h4>
                        <p className="font-mono text-xs text-toyfight-cream/60 mb-6 leading-relaxed">
                            Instructions for setting up your VPN, email, and internal tools.
                        </p>
                        <button className="flex items-center gap-2 text-toyfight-yellow font-header uppercase tracking-wider text-sm hover:gap-4 transition-all">
                            <ArrowRight size={16} /> View Guide
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Onboarding;
