import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Target, Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

interface PerformanceReview {
    id: number;
    employeeId: number;
    reviewerName: string;
    rating: number;
    feedback: string;
    reviewDate: string;
    communication: number;
    technicalSkill: number;
    leadership: number;
    productivity: number;
}

interface Employee {
    id: number;
    name: string;
    role: string;
    image: string;
    managerId?: number;
}

const Performance = () => {
    const [reviews, setReviews] = useState<PerformanceReview[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const { user } = useAuth();

    const [newReview, setNewReview] = useState({
        employeeId: 0,
        rating: 5,
        feedback: '',
        communication: 5,
        technicalSkill: 5,
        leadership: 5,
        productivity: 5
    });

    const fetchData = async () => {
        try {
            const [revRes, empRes] = await Promise.all([
                fetch('http://localhost:8080/api/performance'),
                fetch('http://localhost:8080/api/employees')
            ]);
            const revData = await revRes.json();
            const empData = await empRes.json();
            setReviews(revData);
            setEmployees(empData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const getEmployee = (id: number) => employees.find(e => e.id === id);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!newReview.employeeId || !newReview.feedback.trim()) {
            toast.error('Please select an employee and provide feedback');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/performance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newReview,
                    reviewerName: user?.name || 'Anonymous',
                    reviewDate: new Date().toISOString().split('T')[0]
                })
            });

            if (response.ok) {
                toast.success('Performance review submitted successfully!');
                setShowModal(false);
                setNewReview({
                    employeeId: 0,
                    rating: 5,
                    feedback: '',
                    communication: 5,
                    technicalSkill: 5,
                    leadership: 5,
                    productivity: 5
                });
                fetchData();
            } else {
                toast.error('Failed to submit review');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error submitting review');
        }
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                    <Award key={i} size={16} className={i < rating ? "fill-current" : "text-gray-600"} />
                ))}
            </div>
        );
    };

    const ProgressBar = ({ value, color }: { value: number; color: string }) => (
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value * 10}%` }}
                className={`h-full ${color}`}
            />
        </div>
    );

    return (
        <div className="space-y-8">
            <div className='flex justify-between items-center glass p-6'>
                <div>
                    <h1 className='text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-orange-500'>
                        Performance Management
                    </h1>
                    <p className='text-gray-400 mt-1'>Evaluations and Goals</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-4 py-2 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus size={20} />
                    Add Review
                </button>
            </div>

            {/* Add Review Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Create Performance Review</h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-white transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmitReview} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Select Employee
                                    </label>
                                    <select
                                        value={newReview.employeeId}
                                        onChange={(e) => setNewReview({ ...newReview, employeeId: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 border border-yellow-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                        required
                                    >
                                        <option value={0} className="bg-gray-800 text-gray-400">Choose an employee...</option>
                                        {employees.map(emp => (
                                            <option key={emp.id} value={emp.id} className="bg-gray-800 text-white">
                                                {emp.name} - {emp.role}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Overall Rating (1-5)
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="5"
                                        value={newReview.rating}
                                        onChange={(e) => setNewReview({ ...newReview, rating: parseInt(e.target.value) })}
                                        className="w-full bg-gray-800 border border-yellow-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Communication (1-10)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={newReview.communication}
                                            onChange={(e) => setNewReview({ ...newReview, communication: parseInt(e.target.value) })}
                                            className="w-full bg-gray-800 border border-yellow-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Technical Skill (1-10)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={newReview.technicalSkill}
                                            onChange={(e) => setNewReview({ ...newReview, technicalSkill: parseInt(e.target.value) })}
                                            className="w-full bg-gray-800 border border-yellow-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Leadership (1-10)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={newReview.leadership}
                                            onChange={(e) => setNewReview({ ...newReview, leadership: parseInt(e.target.value) })}
                                            className="w-full bg-gray-800 border border-yellow-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-300 mb-2">
                                            Productivity (1-10)
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="10"
                                            value={newReview.productivity}
                                            onChange={(e) => setNewReview({ ...newReview, productivity: parseInt(e.target.value) })}
                                            className="w-full bg-gray-800 border border-yellow-500/30 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-yellow-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Feedback
                                    </label>
                                    <textarea
                                        value={newReview.feedback}
                                        onChange={(e) => setNewReview({ ...newReview, feedback: e.target.value })}
                                        rows={4}
                                        className="w-full bg-gray-800 border border-yellow-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                                        placeholder="Provide detailed feedback on the employee's performance..."
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-colors border border-white/10"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white rounded-xl font-medium transition-all shadow-lg"
                                    >
                                        Submit Review
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className='flex justify-between items-center glass p-6'>
                <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-white">
                    <Target size={18} className="text-yellow-400" />
                    <span className="font-mono">Q1 2026</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => {
                    const emp = getEmployee(review.employeeId);
                    if (!emp) return null;

                    return (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={{ y: -5 }}
                            className="glass p-6 border border-white/5 hover:border-yellow-500/30 transition-all"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <img src={emp.image} alt={emp.name} className="w-10 h-10 rounded-full border border-yellow-500/30" />
                                    <div>
                                        <h3 className="font-semibold text-white">{emp.name}</h3>
                                        <p className="text-xs text-gray-400">{emp.role}</p>
                                    </div>
                                </div>
                                {renderStars(review.rating)}
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Reviewer:</span>
                                    <span className="text-yellow-400">{review.reviewerName}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Date:</span>
                                    <span>{new Date(review.reviewDate).toLocaleDateString()}</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-4">
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Communication</span>
                                        <span className="text-blue-400">{review.communication}/10</span>
                                    </div>
                                    <ProgressBar value={review.communication} color="bg-blue-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Technical Skill</span>
                                        <span className="text-purple-400">{review.technicalSkill}/10</span>
                                    </div>
                                    <ProgressBar value={review.technicalSkill} color="bg-purple-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Productivity</span>
                                        <span className="text-orange-400">{review.productivity}/10</span>
                                    </div>
                                    <ProgressBar value={review.productivity} color="bg-orange-500" />
                                </div>
                                <div>
                                    <div className="flex justify-between text-xs mb-1">
                                        <span className="text-gray-400">Leadership</span>
                                        <span className="text-green-400">{review.leadership}/10</span>
                                    </div>
                                    <ProgressBar value={review.leadership} color="bg-green-500" />
                                </div>
                            </div>

                            <div className="bg-black/20 p-3 rounded-lg">
                                <p className="text-sm text-gray-300 italic">"{review.feedback}"</p>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {loading && <div className="p-8 text-center text-gray-400">Loading reviews...</div>}
            {!loading && reviews.length === 0 && <div className="p-8 text-center text-gray-400">No reviews found. Click "Add Review" to create one!</div>}
        </div>
    );
};

export default Performance;
