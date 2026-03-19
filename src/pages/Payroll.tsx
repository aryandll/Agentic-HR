import { useEffect, useState } from 'react';
import { DollarSign, Calendar, Download, PlayCircle, Eye, TrendingUp, PieChart, Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import ContentCard from '../components/ui/ContentCard';
import InteractiveButton from '../components/ui/InteractiveButton';
import Modal from '../components/Modal';

interface Employee {
    id: number;
    name: string;
    role: string;
    department: string;
    salary?: number;
    image: string;
}

interface Payslip {
    id: number;
    employeeId: number;
    payPeriod: string;
    baseSalary: number;
    overtime: number;
    performanceBonus: number;
    transportAllowance: number;
    housingAllowance: number;
    incomeTax: number;
    socialSecurity: number;
    healthInsurance: number;
    otherDeductions: number;
    grossPay: number;
    totalDeductions: number;
    netPay: number;
    generatedDate: string;
    status: string;
}

const Payroll = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [payslips, setPayslips] = useState<Payslip[]>([]);
    const [summary, setSummary] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [selectedPayslip, setSelectedPayslip] = useState<Payslip | null>(null);
    const [showPayslipModal, setShowPayslipModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDepartment, setSelectedDepartment] = useState('All');
    const [selectedPeriod, setSelectedPeriod] = useState('All');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [empRes, payslipRes, summaryRes] = await Promise.all([
                fetch('http://localhost:8080/api/employees'),
                fetch('http://localhost:8080/api/payroll/payslips'),
                fetch('http://localhost:8080/api/payroll/summary')
            ]);

            const empData = await empRes.json();
            const payslipData = await payslipRes.json();
            const summaryData = await summaryRes.json();

            setEmployees(empData);
            setPayslips(payslipData);
            setSummary(summaryData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleGeneratePayroll = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/payroll/generate/February 2026', {
                method: 'POST'
            });

            if (response.ok) {
                toast.success('Payroll generated for February 2026!');
                fetchData();
            } else {
                toast.error('Failed to generate payroll');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error generating payroll');
        }
    };

    const getEmployee = (id: number) => employees.find(e => e.id === id);

    const viewPayslip = (payslip: Payslip) => {
        setSelectedPayslip(payslip);
        setShowPayslipModal(true);
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-12 pb-12">
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-end gap-6'>
                <div>
                    <h1 className='text-6xl font-header font-bold text-toyfight-cream uppercase leading-none tracking-tighter'>
                        PAYROLL <span className="text-toyfight-lavender">&</span><br />COMPENSATION
                    </h1>
                </div>
                <div className="flex gap-4">
                    <InteractiveButton onClick={handleGeneratePayroll}>
                        <span className="flex items-center gap-2">
                            <PlayCircle size={18} /> GENERATE PAYROLL
                        </span>
                    </InteractiveButton>
                    <button className="h-10 w-10 flex items-center justify-center rounded-full border border-toyfight-cream/20 text-toyfight-cream hover:bg-toyfight-cream/10 transition-colors">
                        <Download size={18} />
                    </button>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <ContentCard title="TOTAL GROSS PAY" delay={0.1}>
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-header font-bold text-toyfight-yellow">{formatCurrency(summary.totalGrossPay || 0)}</span>
                        <DollarSign className="text-toyfight-cream/20 w-8 h-8 mb-1" />
                    </div>
                </ContentCard>

                <ContentCard title="TOTAL NET PAY" delay={0.2}>
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-header font-bold text-toyfight-cream">{formatCurrency(summary.totalNetPay || 0)}</span>
                        <TrendingUp className="text-toyfight-cream/20 w-8 h-8 mb-1" />
                    </div>
                </ContentCard>

                <ContentCard title="TOTAL DEDUCTIONS" delay={0.3}>
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-header font-bold text-red-400">{formatCurrency(summary.totalDeductions || 0)}</span>
                        <PieChart className="text-toyfight-cream/20 w-8 h-8 mb-1" />
                    </div>
                </ContentCard>

                <ContentCard title="AVG NET PAY" delay={0.4}>
                    <div className="flex justify-between items-end">
                        <span className="text-3xl font-header font-bold text-toyfight-lavender">{formatCurrency(summary.averageNetPay || 0)}</span>
                        <Calendar className="text-toyfight-cream/20 w-8 h-8 mb-1" />
                    </div>
                </ContentCard>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 border-b border-toyfight-cream/10 pb-8">
                {/* Search */}
                <div className="flex-1 relative border-b border-toyfight-cream/20 focus-within:border-toyfight-yellow transition-colors pb-2">
                    <Search className="absolute left-0 top-0 text-toyfight-cream/50 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="SEARCH EMPLOYEE..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className='w-full bg-transparent pl-8 text-toyfight-cream placeholder:text-toyfight-cream/30 font-mono text-sm focus:outline-none uppercase'
                    />
                </div>

                {/* Department Filter */}
                <div className="relative border-b border-toyfight-cream/20 focus-within:border-toyfight-yellow transition-colors pb-2 min-w-[200px]">
                    <Filter className="absolute left-0 top-0 text-toyfight-cream/50 w-5 h-5" />
                    <select
                        value={selectedDepartment}
                        onChange={(e) => setSelectedDepartment(e.target.value)}
                        className="w-full bg-transparent pl-8 text-toyfight-cream font-mono text-sm focus:outline-none uppercase appearance-none cursor-pointer"
                    >
                        <option className="bg-toyfight-bg" value="All">All Departments</option>
                        <option className="bg-toyfight-bg" value="Engineering">Engineering</option>
                        <option className="bg-toyfight-bg" value="Management">Management</option>
                        <option className="bg-toyfight-bg" value="Legal">Legal</option>
                        <option className="bg-toyfight-bg" value="Operations">Operations</option>
                        <option className="bg-toyfight-bg" value="Finance">Finance</option>
                        <option className="bg-toyfight-bg" value="Design">Design</option>
                    </select>
                </div>
            </div>

            {/* Payslips Table */}
            <div className="border border-toyfight-cream/10 rounded-lg overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-toyfight-cream/5 text-toyfight-cream uppercase text-xs font-mono tracking-wider">
                        <tr>
                            <th className="p-4 font-normal opacity-60">Employee</th>
                            <th className="p-4 font-normal opacity-60">Pay Period</th>
                            <th className="p-4 font-normal opacity-60">Gross Pay</th>
                            <th className="p-4 font-normal opacity-60">Deductions</th>
                            <th className="p-4 font-normal opacity-60">Net Pay</th>
                            <th className="p-4 font-normal opacity-60">Status</th>
                            <th className="p-4 font-normal opacity-60">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-toyfight-cream/5 text-toyfight-cream">
                        {payslips
                            .filter((payslip) => {
                                const emp = getEmployee(payslip.employeeId);
                                if (!emp) return false;

                                const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase());
                                const matchesDepartment = selectedDepartment === 'All' || emp.department === selectedDepartment;
                                const matchesPeriod = selectedPeriod === 'All' || payslip.payPeriod === selectedPeriod;

                                return matchesSearch && matchesDepartment && matchesPeriod;
                            })
                            .map((payslip) => {
                                const emp = getEmployee(payslip.employeeId);
                                if (!emp) return null;

                                return (
                                    <motion.tr
                                        key={payslip.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="hover:bg-toyfight-cream/5 transition-colors group"
                                    >
                                        <td className="p-4 flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-toyfight-gray flex items-center justify-center font-header text-sm font-bold border border-toyfight-cream/20">
                                                {emp.name.charAt(0)}
                                            </div>
                                            <div>
                                                <span className="font-header text-sm uppercase tracking-wide block group-hover:text-toyfight-yellow transition-colors">{emp.name}</span>
                                                <span className="text-xs font-mono opacity-50">{emp.role}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 font-mono text-sm">{payslip.payPeriod}</td>
                                        <td className="p-4 font-mono text-sm">{formatCurrency(payslip.grossPay)}</td>
                                        <td className="p-4 font-mono text-sm text-red-400">{formatCurrency(payslip.totalDeductions)}</td>
                                        <td className="p-4 font-mono text-sm font-bold text-toyfight-yellow">{formatCurrency(payslip.netPay)}</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-none text-[10px] font-mono uppercase border ${payslip.status === 'PAID'
                                                ? 'border-green-500 text-green-500'
                                                : 'border-yellow-500 text-yellow-500'
                                                }`}>
                                                {payslip.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => viewPayslip(payslip)}
                                                className="text-toyfight-cream/50 hover:text-toyfight-cream transition-colors"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                    </tbody>
                </table>
                {loading && <div className="p-8 text-center text-toyfight-cream/40 font-mono text-sm">LOADING DATA...</div>}
                {!loading && payslips.length === 0 && <div className="p-8 text-center text-toyfight-cream/40 font-mono text-sm">NO RECORDS FOUND</div>}
            </div>

            {/* Payslip Detail Modal */}
            <Modal
                isOpen={showPayslipModal}
                onClose={() => setShowPayslipModal(false)}
                title="PAYSLIP DETAILS"
            >
                {selectedPayslip && (
                    <div className="space-y-8">
                        {/* Employee Info */}
                        <div className="flex items-center gap-4 py-4 border-b border-toyfight-cream/10">
                            <div className="w-16 h-16 rounded-full bg-toyfight-gray flex items-center justify-center font-header text-2xl font-bold border border-toyfight-cream/20">
                                {getEmployee(selectedPayslip.employeeId)?.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="text-xl font-header font-bold text-toyfight-cream uppercase">
                                    {getEmployee(selectedPayslip.employeeId)?.name}
                                </h3>
                                <div className="flex gap-2 text-xs font-mono text-toyfight-cream/60 uppercase">
                                    <span>{getEmployee(selectedPayslip.employeeId)?.role}</span>
                                    <span>•</span>
                                    <span>{getEmployee(selectedPayslip.employeeId)?.department}</span>
                                </div>
                            </div>
                        </div>

                        {/* Earnings Section */}
                        <div>
                            <h3 className="text-lg font-header font-bold text-toyfight-yellow mb-4 uppercase flex items-center gap-2">
                                <DollarSign size={20} /> Earnings
                            </h3>
                            <div className="space-y-2 font-mono text-sm">
                                <div className="flex justify-between text-toyfight-cream/80">
                                    <span>BASE SALARY</span>
                                    <span>{formatCurrency(selectedPayslip.baseSalary)}</span>
                                </div>
                                {selectedPayslip.overtime > 0 && (
                                    <div className="flex justify-between text-toyfight-cream/80">
                                        <span>OVERTIME</span>
                                        <span>{formatCurrency(selectedPayslip.overtime)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-toyfight-yellow font-bold border-t border-toyfight-cream/10 pt-2 mt-2">
                                    <span>GROSS PAY</span>
                                    <span>{formatCurrency(selectedPayslip.grossPay)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Deductions Section */}
                        <div>
                            <h3 className="text-lg font-header font-bold text-red-400 mb-4 uppercase flex items-center gap-2">
                                <PieChart size={20} /> Deductions
                            </h3>
                            <div className="space-y-2 font-mono text-sm">
                                <div className="flex justify-between text-toyfight-cream/80">
                                    <span>INCOME TAX</span>
                                    <span>{formatCurrency(selectedPayslip.incomeTax)}</span>
                                </div>
                                <div className="flex justify-between text-toyfight-cream/80">
                                    <span>SOCIAL SECURITY</span>
                                    <span>{formatCurrency(selectedPayslip.socialSecurity)}</span>
                                </div>
                                <div className="flex justify-between text-red-400 font-bold border-t border-toyfight-cream/10 pt-2 mt-2">
                                    <span>TOTAL DEDUCTIONS</span>
                                    <span>{formatCurrency(selectedPayslip.totalDeductions)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Net Pay */}
                        <div className="bg-toyfight-cream/5 p-6 border border-toyfight-cream/10">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-mono text-xs text-toyfight-cream/60 uppercase">NET PAY (TAKE HOME)</p>
                                    <p className="font-mono text-[10px] text-toyfight-cream/40 mt-1 uppercase">GENERATED: {formatDate(selectedPayslip.generatedDate)}</p>
                                </div>
                                <h2 className="text-4xl font-header font-bold text-toyfight-yellow tracking-tighter">
                                    {formatCurrency(selectedPayslip.netPay)}
                                </h2>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4">
                            <InteractiveButton className="flex-1 justify-center">
                                <span className="flex items-center gap-2">
                                    <Download size={18} /> DOWNLOAD PDF
                                </span>
                            </InteractiveButton>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default Payroll;
