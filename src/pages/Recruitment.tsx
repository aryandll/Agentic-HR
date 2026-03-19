import { useEffect, useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, X, Briefcase, ChevronRight, Bot } from 'lucide-react';
import Modal from '../components/Modal';
import PostJobModal from '../components/PostJobModal';
import CandidateDetailsModal from '../components/CandidateDetailsModal';
import toast from 'react-hot-toast';
import InteractiveButton from '../components/ui/InteractiveButton';
import CopilotChat from '../components/CopilotChat';

interface Candidate {
    id: string;
    name: string;
    role: string;
    status: string;
    email?: string;
    department?: string;
    resumeUrl?: string;
}

interface ColumnProps {
    title: string;
    items: Candidate[];
    borderColor: string;
    onDelete: (id: string, e: React.MouseEvent) => void;
    onAdvance: (id: string, currentStatus: string) => void;
    onSelect: (candidate: Candidate) => void;
    onHire: (candidate: Candidate) => void;
}

const Column = ({ title, items, borderColor, onDelete, onAdvance, onSelect, onHire }: ColumnProps) => {
    return (
        <div className='flex flex-col gap-6 min-w-[320px] w-[350px] transition-all duration-300'>
            {/* Column Header */}
            <div className={`border-b-2 pb-4 flex justify-between items-end ${borderColor}`}>
                <h3 className='font-header font-bold text-toyfight-cream text-3xl uppercase tracking-tighter leading-none'>{title}</h3>
                <span className='font-mono text-xs text-toyfight-cream/50 mb-1'>[{items.length}]</span>
            </div>

            <div className='flex flex-col gap-4 pb-4'>
                {items.map((item, index) => (
                    <motion.div
                        key={item.id}
                        layoutId={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => onSelect(item)}
                        className='group relative bg-toyfight-gray border border-toyfight-cream/10 p-5 cursor-pointer transition-all hover:border-toyfight-yellow hover:-translate-y-1'
                    >
                        {/* Hover Overlay Actions */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 z-20">
                            {title === 'Offer Sent' && (
                                <button
                                    onClick={(e) => { e.stopPropagation(); onHire(item); }}
                                    className='p-1.5 bg-toyfight-yellow text-black rounded hover:bg-white transition-colors'
                                    title="Hire Candidate"
                                >
                                    <UserPlus size={16} />
                                </button>
                            )}
                            <button
                                onClick={(e) => { e.stopPropagation(); onAdvance(item.id, item.status); }}
                                className='p-1.5 bg-toyfight-cream text-toyfight-bg rounded hover:bg-white transition-colors'
                                title="Advance"
                            >
                                <ChevronRight size={16} />
                            </button>
                            <button
                                onClick={(e) => onDelete(item.id, e)}
                                className='p-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
                                title="Reject"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        <div className="relative z-10">
                            <h4 className='font-header text-xl text-toyfight-cream uppercase leading-none mb-1 group-hover:text-toyfight-yellow transition-colors'>{item.name}</h4>
                            <p className='font-mono text-xs text-toyfight-cream/60 uppercase tracking-widest mb-4 inline-block border-b border-toyfight-cream/10 pb-1'>{item.role}</p>

                            <div className='flex justify-between items-center'>
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-toyfight-bg border border-toyfight-cream/20 flex items-center justify-center text-[10px] font-bold text-toyfight-cream">
                                        {item.name.charAt(0)}
                                    </div>
                                    <span className="font-mono text-[10px] text-toyfight-cream/40">VIEW_PROFILE</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

const Recruitment = () => {
    const { addNotification } = useNotification();
    const [candidates, setCandidates] = useState<Candidate[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPostJobOpen, setIsPostJobOpen] = useState(false);
    const [isCopilotOpen, setIsCopilotOpen] = useState(false);
    const [newCandidate, setNewCandidate] = useState({ name: '', role: '' });
    const [showHireModal, setShowHireModal] = useState(false);
    const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
    const [hireData, setHireData] = useState({
        salary: '',
        department: '',
        startDate: new Date().toISOString().split('T')[0],
        accessRole: 'EMPLOYEE'
    });

    const [jobs, setJobs] = useState<any[]>([]);

    const fetchCandidates = () => {
        fetch('http://localhost:8080/api/candidates')
            .then(res => res.json())
            .then(data => setCandidates(data))
            .catch(err => console.error('Error fetching candidates:', err));
    };

    const fetchJobs = () => {
        fetch('http://localhost:8080/api/jobs')
            .then(res => res.json())
            .then(data => setJobs(data))
            .catch(err => console.error('Error fetching jobs:', err));
    }

    useEffect(() => {
        fetchCandidates();
        fetchJobs();
    }, []);

    const handleAddCandidate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/candidates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newCandidate, status: 'Applied' })
            });

            if (res.ok) {
                toast.success('Candidate Added');
                addNotification('New Candidate', `Added ${newCandidate.name} to the pipeline`, 'info');
                setIsModalOpen(false);
                setNewCandidate({ name: '', role: '' });
                fetchCandidates();
            } else {
                toast.error(`Failed to add candidate.`);
            }
        } catch (err) {
            console.error('Error adding candidate:', err);
            toast.error('Error connecting to backend.');
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirm("Remove this candidate?")) return;

        try {
            const res = await fetch(`http://localhost:8080/api/candidates/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                toast.success('Candidate removed');
                fetchCandidates();
            } else {
                toast.error(`Failed to delete candidate`);
            }
        } catch (err) {
            console.error(err);
            toast.error('Error deleting candidate');
        }
    };

    const handleAdvance = async (id: string, currentStatus: string) => {
        const statusOrder = ['Applied', 'Screening', 'Interview', 'Offer', 'Hired'];
        const formatStatus = (s: string) => {
            // Handle inconsistent backend naming if necessary, or just nice display
            if (s === 'Offer Sent') return 'Offer';
            return s;
        }

        // Normalize status check
        let normalizedCurrent = currentStatus;
        if (currentStatus === 'Offer Sent') normalizedCurrent = 'Offer';

        const currentIndex = statusOrder.indexOf(normalizedCurrent);

        if (currentIndex < statusOrder.length - 1) {
            let nextStatus = statusOrder[currentIndex + 1];
            if (nextStatus === 'Offer') nextStatus = 'Offer Sent'; // Match UI display preference

            // If moving to Hired, trigger hire modal
            if (nextStatus === 'Hired') {
                const candidate = candidates.find(c => c.id === id);
                if (candidate) {
                    setSelectedCandidate(candidate);
                    setHireData(prev => ({
                        ...prev,
                        department: candidate.department || prev.department
                    }));
                    setShowHireModal(true);
                }
                return;
            }

            try {
                // Backend expects specific strings likely? Assuming standard "Applied", "Screening", "Interview", "Offer", "Hired"
                // Adjusting strictly for what likely works or what was there before.
                // Reverting to simple check for safety.
                let backendNextStatus = nextStatus;
                if (nextStatus === 'Offer Sent') backendNextStatus = 'Offer';

                const res = await fetch(`http://localhost:8080/api/candidates/${id}/status?status=${backendNextStatus}`, {
                    method: 'PUT'
                });
                if (res.ok) {
                    toast.success(`Moved to ${nextStatus}`);
                    fetchCandidates();
                } else {
                    toast.error(`Failed to update status`);
                }
            } catch (err) {
                console.error(err);
                toast.error('Error updating status');
            }
        } else {
            toast("Candidate is already hired!");
        }
    };

    const handleHireClick = (candidate: Candidate) => {
        setSelectedCandidate(candidate);
        setHireData(prev => ({
            ...prev,
            department: candidate.department || prev.department
        }));
        setShowHireModal(true);
    };

    const columns = {
        applied: candidates.filter(c => c.status === 'Applied'),
        screening: candidates.filter(c => c.status === 'Screening'),
        interview: candidates.filter(c => c.status === 'Interview'),
        offer: candidates.filter(c => c.status === 'Offer' || c.status === 'Offer Sent'),
        hired: candidates.filter(c => c.status === 'Hired'),
    };

    return (
        <div className='h-full flex flex-col pb-8'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12'>
                <div>
                    <h1 className='text-6xl font-header font-bold text-toyfight-cream uppercase leading-none tracking-tighter'>
                        Talent <span className="text-toyfight-yellow">Pipeline</span>
                    </h1>
                    <div className="h-2 w-24 bg-toyfight-cream mt-4" />
                </div>
                <div className='flex gap-4'>
                    <InteractiveButton onClick={() => setIsPostJobOpen(true)} variant="secondary">
                        <span className="flex items-center gap-2">
                            <Briefcase size={18} /> POST JOB
                        </span>
                    </InteractiveButton>
                    <InteractiveButton onClick={() => setIsModalOpen(true)}>
                        <span className="flex items-center gap-2">
                            <UserPlus size={18} /> CANDIDATE
                        </span>
                    </InteractiveButton>
                    <InteractiveButton onClick={() => setIsCopilotOpen(true)} variant="secondary" className="border-toyfight-yellow text-toyfight-yellow hover:bg-toyfight-yellow hover:text-black">
                        <span className="flex items-center gap-2 font-bold tracking-widest">
                            <Bot size={18} /> COPILOT
                        </span>
                    </InteractiveButton>
                </div>
            </div>

            {/* Kanban Board */}
            <div className='flex gap-8 overflow-x-auto pb-12 scrollbar-hide'>
                <Column
                    title='Applied'
                    items={columns.applied}
                    borderColor='border-toyfight-cream'
                    onDelete={handleDelete}
                    onAdvance={handleAdvance}
                    onSelect={setSelectedCandidate}
                    onHire={handleHireClick}
                />
                <Column
                    title='Screening'
                    items={columns.screening}
                    borderColor='border-toyfight-yellow'
                    onDelete={handleDelete}
                    onAdvance={handleAdvance}
                    onSelect={setSelectedCandidate}
                    onHire={handleHireClick}
                />
                <Column
                    title='Interview'
                    items={columns.interview}
                    borderColor='border-indigo-400'
                    onDelete={handleDelete}
                    onAdvance={handleAdvance}
                    onSelect={setSelectedCandidate}
                    onHire={handleHireClick}
                />
                <Column
                    title='Offer Sent'
                    items={columns.offer}
                    borderColor='border-emerald-400'
                    onDelete={handleDelete}
                    onAdvance={handleAdvance}
                    onSelect={setSelectedCandidate}
                    onHire={handleHireClick}
                />
                <Column
                    title='Hired'
                    items={columns.hired}
                    borderColor='border-pink-500'
                    onDelete={handleDelete}
                    onAdvance={handleAdvance}
                    onSelect={setSelectedCandidate}
                    onHire={handleHireClick}
                />
            </div>

            {/* Modals */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="NEW TALENT">
                <form onSubmit={handleAddCandidate} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-toyfight-cream/60 mb-2 uppercase tracking-widest">Full Name</label>
                        <input
                            type="text"
                            placeholder="ALEX JOHNSON"
                            value={newCandidate.name}
                            onChange={(e) => setNewCandidate({ ...newCandidate, name: e.target.value })}
                            className="w-full bg-toyfight-bg border-b border-toyfight-cream/20 py-3 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-header text-xl uppercase placeholder:text-toyfight-cream/20"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-toyfight-cream/60 mb-2 uppercase tracking-widest">Role</label>
                        <input
                            type="text"
                            placeholder="DESIGNER"
                            value={newCandidate.role}
                            onChange={(e) => setNewCandidate({ ...newCandidate, role: e.target.value })}
                            className="w-full bg-toyfight-bg border-b border-toyfight-cream/20 py-3 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-header text-xl uppercase placeholder:text-toyfight-cream/20"
                            required
                        />
                    </div>
                    <div className="pt-4">
                        <InteractiveButton type="submit" className="w-full justify-center">ADD CANDIDATE</InteractiveButton>
                    </div>
                </form>
            </Modal>

            <PostJobModal
                isOpen={isPostJobOpen}
                onClose={() => setIsPostJobOpen(false)}
                onJobPosted={() => toast.success("Mission Brief Uploaded")}
            />

            {/* Hire Candidate Modal - Simplified for aesthetic consistency */}
            <AnimatePresence>
                {showHireModal && selectedCandidate && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={() => setShowHireModal(false)}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-toyfight-bg border border-toyfight-cream/20 p-8 w-full max-w-md relative"
                        >
                            <button onClick={() => setShowHireModal(false)} className="absolute top-4 right-4 text-toyfight-cream/50 hover:text-toyfight-cream">
                                <X size={24} />
                            </button>
                            <h2 className="text-4xl font-header font-bold text-toyfight-cream uppercase leading-none mb-2">OFFICIAL HIRE</h2>
                            <p className="font-mono text-xs text-toyfight-yellow uppercase tracking-widest mb-8">Onboarding {selectedCandidate.name}</p>

                            <form onSubmit={async (e) => {
                                e.preventDefault();
                                try {
                                    const response = await fetch(`http://localhost:8080/api/candidates/${selectedCandidate.id}/hire`, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({
                                            salary: parseFloat(hireData.salary),
                                            department: hireData.department || selectedCandidate.department || 'Engineering',
                                            startDate: hireData.startDate,
                                            accessRole: hireData.accessRole,
                                            managerId: 2
                                        })
                                    });

                                    if (response.ok) {
                                        toast.success(`Hired ${selectedCandidate.name}!`);
                                        setShowHireModal(false);
                                        fetchCandidates();
                                    } else {
                                        toast.error('Failed to hire candidate');
                                    }
                                } catch (err) {
                                    console.error(err);
                                    toast.error('Error hiring candidate');
                                }
                            }} className="space-y-6">
                                <div>
                                    <label className="block text-xs font-mono text-toyfight-cream/60 mb-2 uppercase tracking-widest">Annual Salary</label>
                                    <input
                                        required
                                        type="number"
                                        value={hireData.salary}
                                        onChange={(e) => setHireData({ ...hireData, salary: e.target.value })}
                                        placeholder="120000"
                                        className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow font-mono"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-toyfight-cream/60 mb-2 uppercase tracking-widest">Department</label>
                                    <select
                                        required
                                        value={hireData.department}
                                        onChange={(e) => setHireData({ ...hireData, department: e.target.value })}
                                        className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow font-mono uppercase"
                                    >
                                        <option value="" className="bg-toyfight-bg">Select...</option>
                                        {['Engineering', 'Product', 'Design', 'Marketing', 'HR', 'Sales', 'Legal', 'Management'].map(d => (
                                            <option key={d} value={d} className="bg-toyfight-bg">{d}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="pt-4">
                                    <InteractiveButton type="submit" className="w-full justify-center">CONFIRM HIRE</InteractiveButton>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <CandidateDetailsModal
                isOpen={!!selectedCandidate && !showHireModal}
                onClose={() => setSelectedCandidate(null)}
                candidate={selectedCandidate}
                // @ts-ignore
                jobs={jobs}
                onUpdate={fetchCandidates}
            />

            <CopilotChat 
                isOpen={isCopilotOpen} 
                onClose={() => setIsCopilotOpen(false)} 
                onRefreshBoard={fetchCandidates} 
            />
        </div>
    );
};

export default Recruitment;
