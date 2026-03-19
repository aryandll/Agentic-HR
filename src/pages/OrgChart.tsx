import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Network, Users, Building2, ChevronDown, ChevronUp } from 'lucide-react';

interface Employee {
    id: number;
    name: string;
    role: string;
    department: string;
    image: string;
    managerId?: number;
    subordinates?: Employee[];
}

interface DepartmentGroup {
    name: string;
    employees: Employee[];
    color: string;
}

const OrgChart = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedDepts, setExpandedDepts] = useState<Set<string>>(new Set(['Management', 'Engineering', 'Legal']));

    useEffect(() => {
        fetch('http://localhost:8080/api/employees')
            .then(res => res.json())
            .then(data => {
                setEmployees(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const toggleDepartment = (dept: string) => {
        const newExpanded = new Set(expandedDepts);
        if (newExpanded.has(dept)) {
            newExpanded.delete(dept);
        } else {
            newExpanded.add(dept);
        }
        setExpandedDepts(newExpanded);
    };

    // Group employees by department
    const groupByDepartment = (): DepartmentGroup[] => {
        const deptMap = new Map<string, Employee[]>();
        // Using strict ToyFight/Brutalist colors instead of gradients
        const colors = {
            'Management': 'border-pink-500',
            'Engineering': 'border-cyan-500',
            'Legal': 'border-yellow-500',
            'Design': 'border-purple-500',
            'Operations': 'border-emerald-500',
            'Finance': 'border-blue-500',
        };

        employees.forEach(emp => {
            const dept = emp.department || 'Other';
            if (!deptMap.has(dept)) {
                deptMap.set(dept, []);
            }
            deptMap.get(dept)?.push(emp);
        });

        return Array.from(deptMap.entries()).map(([name, emps]) => ({
            name,
            employees: emps,
            color: colors[name as keyof typeof colors] || 'border-gray-500'
        }));
    };

    const departments = groupByDepartment();

    const EmployeeCard = ({ employee }: { employee: Employee }) => {
        const subordinateCount = employees.filter(e => e.managerId === employee.id).length;

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                className="bg-toyfight-gray border border-toyfight-cream/10 p-5 relative group transition-all hover:border-toyfight-yellow"
            >
                <div className="flex items-start gap-4">
                    <div className="relative">
                        <div className="w-12 h-12 bg-toyfight-bg border border-toyfight-cream/20 flex items-center justify-center text-toyfight-cream font-bold text-lg">
                            {employee.name.charAt(0)}
                        </div>
                        {subordinateCount > 0 && (
                            <div className="absolute -bottom-2 -right-2 bg-toyfight-yellow text-toyfight-bg text-[10px] font-bold w-5 h-5 flex items-center justify-center border border-toyfight-bg">
                                {subordinateCount}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h4 className="font-header text-xl text-toyfight-cream uppercase leading-none truncate group-hover:text-toyfight-yellow transition-colors">{employee.name}</h4>
                        <p className="font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest mt-1 truncate">{employee.role}</p>
                        {employee.managerId && (
                            <div className="mt-3 pt-3 border-t border-toyfight-cream/5 text-[10px] font-mono text-toyfight-cream/30 uppercase">
                                Reports to: <span className="text-toyfight-cream/50">{employees.find(e => e.id === employee.managerId)?.name || 'Unknown'}</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>
        );
    };

    return (
        <div className="space-y-12 pb-20">
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-end gap-6'>
                <div>
                    <h1 className='text-6xl font-header font-bold text-toyfight-cream uppercase leading-none tracking-tighter'>
                        THE <span className="text-toyfight-yellow">HIERARCHY</span>
                    </h1>
                    <div className="h-2 w-24 bg-toyfight-cream mt-4" />
                </div>

                <div className="flex gap-8">
                    <div className="text-right">
                        <div className="font-mono text-3xl text-toyfight-cream font-bold leading-none">{departments.length}</div>
                        <div className="font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest">DEPARTMENTS</div>
                    </div>
                    <div className="text-right">
                        <div className="font-mono text-3xl text-toyfight-cream font-bold leading-none">{employees.length}</div>
                        <div className="font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest">MEMBERS</div>
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="text-toyfight-cream/50 font-mono animate-pulse uppercase tracking-widest">LOADING STRUCTURE...</div>
            ) : (
                <div className="space-y-8">
                    {departments.map((dept, idx) => (
                        <motion.div
                            key={dept.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={`border-l-4 ${dept.color} bg-toyfight-cream/5 pl-6 py-6 pr-6`}
                        >
                            {/* Department Header */}
                            <button
                                onClick={() => toggleDepartment(dept.name)}
                                className="w-full flex items-center justify-between group mb-6"
                            >
                                <div className="flex items-center gap-4">
                                    <h2 className="text-4xl font-header font-bold text-toyfight-cream uppercase leading-none group-hover:text-toyfight-yellow transition-colors text-left">
                                        {dept.name}
                                    </h2>
                                    <span className="font-mono text-xs text-toyfight-cream/40 bg-toyfight-bg px-2 py-1 border border-toyfight-cream/10">
                                        {dept.employees.length}
                                    </span>
                                </div>
                                {expandedDepts.has(dept.name) ? (
                                    <ChevronUp className="w-6 h-6 text-toyfight-cream group-hover:text-toyfight-yellow transition-colors" />
                                ) : (
                                    <ChevronDown className="w-6 h-6 text-toyfight-cream group-hover:text-toyfight-yellow transition-colors" />
                                )}
                            </button>

                            {/* Department Employees */}
                            <AnimatePresence>
                                {expandedDepts.has(dept.name) && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pt-2">
                                            {dept.employees.map(emp => (
                                                <EmployeeCard key={emp.id} employee={emp} />
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>
            )}

            {!loading && departments.length === 0 && (
                <div className="text-toyfight-cream/50 font-mono uppercase tracking-widest">SYSTEM EMPTY // NO DATA FOUND</div>
            )}
        </div>
    );
};

export default OrgChart;
