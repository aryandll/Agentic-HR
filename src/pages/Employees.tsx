import { useEffect, useState } from 'react';
import ContentCard from '../components/ui/ContentCard';
import Modal from '../components/Modal';
import InteractiveButton from '../components/ui/InteractiveButton';
import { Search, Plus, Mail, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

interface Employee {
    id: number;
    name: string;
    role: string;
    department: string;
    email: string;
    image: string;
    salary?: number;
    joinDate?: string;
}

const Employees = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        role: '',
        department: '',
        email: ''
    });

    const fetchEmployees = () => {
        fetch('http://localhost:8080/api/employees')
            .then((res) => res.json())
            .then((data) => {
                setEmployees(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Error fetching employees:', err);
                setLoading(false);
                // Fallback mock data
                setEmployees([
                    { id: 1, name: 'Alex Johnson', role: 'Senior Developer', department: 'Engineering', email: 'alex@nexus.hr', image: '' },
                    { id: 2, name: 'Sarah Connor', role: 'UX Designer', department: 'Design', email: 'sarah@nexus.hr', image: '' },
                    { id: 3, name: 'Mike Ross', role: 'Legal Counsel', department: 'Legal', email: 'mike@nexus.hr', image: '' },
                    { id: 4, name: 'Jessica Pearson', role: 'Director', department: 'Management', email: 'jessica@nexus.hr', image: '' },
                ]);
            });
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&color=fff`
                }),
            });

            if (response.ok) {
                toast.success('Employee added successfully!');
                setIsModalOpen(false);
                setFormData({ name: '', role: '', department: '', email: '' });
                fetchEmployees();
            } else {
                toast.error('Failed to add employee');
            }
        } catch (error) {
            console.error('Error adding employee:', error);
            toast.error('Error connecting to backend');
        }
    };

    const filteredEmployees = employees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className='space-y-12 pb-12'>
            {/* Header / Actions */}
            <div className='flex flex-col md:flex-row justify-between items-end gap-6'>
                <div>
                    <h1 className='text-6xl font-header font-bold text-toyfight-cream uppercase leading-none tracking-tighter'>
                        THE <span className="text-toyfight-yellow">Team</span>
                    </h1>
                    <div className="h-2 w-24 bg-toyfight-cream mt-4" />
                </div>

                <div className='flex flex-col md:flex-row gap-6 w-full md:w-auto items-end'>
                    {/* Search */}
                    <div className="relative w-full md:w-64 border-b border-toyfight-cream/20 focus-within:border-toyfight-yellow transition-colors pb-2">
                        <Search className='absolute left-0 top-0 text-toyfight-cream/50 w-5 h-5' />
                        <input
                            type='text'
                            placeholder='SEARCH TEAM...'
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className='w-full bg-transparent pl-8 text-toyfight-cream placeholder:text-toyfight-cream/30 font-mono text-sm focus:outline-none uppercase'
                        />
                    </div>

                    <InteractiveButton onClick={() => setIsModalOpen(true)}>
                        <span className="flex items-center gap-2">
                            <Plus size={18} /> ADD MEMBER
                        </span>
                    </InteractiveButton>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className='text-toyfight-cream/50 font-mono animate-pulse'>LOADING DIRECTORY...</div>
            ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
                    {filteredEmployees.map((emp, index) => (
                        <ContentCard key={emp.id} delay={index * 0.05} className="group hover:bg-toyfight-cream/5 transition-colors">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-16 h-16 bg-toyfight-gray border border-toyfight-cream/20 flex items-center justify-center text-2xl font-header font-bold text-toyfight-cream group-hover:scale-110 transition-transform duration-500">
                                    {emp.name.charAt(0)}
                                </div>
                                <div className="px-3 py-1 border border-toyfight-cream/20 rounded-full">
                                    <span className="font-mono text-[10px] text-toyfight-cream/60 uppercase tracking-widest">{emp.department}</span>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-header text-2xl text-toyfight-cream uppercase leading-none mb-2 group-hover:text-toyfight-yellow transition-colors">{emp.name}</h3>
                                <div className="flex items-center gap-2 text-toyfight-cream/60 mb-4">
                                    <Briefcase size={14} />
                                    <span className="font-sans text-xs uppercase tracking-wider">{emp.role}</span>
                                </div>

                                <div className="pt-4 border-t border-toyfight-cream/10 flex items-center gap-2 text-toyfight-cream/40 group-hover:text-toyfight-cream/80 transition-colors">
                                    <Mail size={14} />
                                    <span className="font-mono text-xs truncate">{emp.email}</span>
                                </div>
                            </div>
                        </ContentCard>
                    ))}
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="RECRUIT NEW TALENT"
            >
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-toyfight-cream/60 mb-2 uppercase tracking-widest">Full Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full bg-toyfight-bg border-b border-toyfight-cream/20 py-3 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-header text-xl uppercase placeholder:text-toyfight-cream/20"
                            placeholder="ALEX JOHNSON"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-toyfight-cream/60 mb-2 uppercase tracking-widest">Role</label>
                        <input
                            required
                            type="text"
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full bg-toyfight-bg border-b border-toyfight-cream/20 py-3 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-header text-xl uppercase placeholder:text-toyfight-cream/20"
                            placeholder="DEVELOPER"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-toyfight-cream/60 mb-2 uppercase tracking-widest">Department</label>
                        <input
                            required
                            type="text"
                            value={formData.department}
                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                            className="w-full bg-toyfight-bg border-b border-toyfight-cream/20 py-3 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-header text-xl uppercase placeholder:text-toyfight-cream/20"
                            placeholder="ENGINEERING"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-mono text-toyfight-cream/60 mb-2 uppercase tracking-widest">Email</label>
                        <input
                            required
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full bg-toyfight-bg border-b border-toyfight-cream/20 py-3 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-header text-xl uppercase placeholder:text-toyfight-cream/20"
                            placeholder="ALEX@NEXUS.HR"
                        />
                    </div>
                    <div className="pt-4">
                        <InteractiveButton type="submit" className="w-full justify-center">
                            CONFIRM RECRUITMENT
                        </InteractiveButton>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Employees;
