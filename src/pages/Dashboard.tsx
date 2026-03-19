import { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion, useSpring } from 'framer-motion';
import { Users, UserPlus, DollarSign, Activity, Terminal, Cpu, HardDrive, Zap } from 'lucide-react';
import ContentCard from '../components/ui/ContentCard';

const Dashboard = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const [stats, setStats] = useState({
        totalEmployees: 0,
        newHires: 0,
        payrollCost: 0,
        avgPerformance: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Parallax transforms
    const yHero = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
    const opacityHero = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Fetch Employees
                const empRes = await fetch('http://localhost:8080/api/employees');
                if (!empRes.ok) throw new Error('Failed to fetch employees');
                const employees = await empRes.json();

                if (!Array.isArray(employees)) {
                    throw new Error('Invalid employee data format');
                }

                const total = employees.length;
                const payroll = employees.reduce((acc: number, curr: any) => acc + (curr.salary || 0), 0);
                const currentYear = new Date().getFullYear().toString();
                const newHiresCount = employees.filter((e: any) => e.joinDate && e.joinDate.startsWith(currentYear)).length;

                // Fetch Performance
                const perfRes = await fetch('http://localhost:8080/api/performance');
                if (!perfRes.ok) throw new Error('Failed to fetch performance');
                const reviews = await perfRes.json();

                let avgRating = 0;
                if (Array.isArray(reviews) && reviews.length > 0) {
                    const totalRating = reviews.reduce((acc: number, curr: any) => acc + curr.rating, 0);
                    avgRating = totalRating / reviews.length;
                }

                const performancePct = Math.round((avgRating / 5) * 100);

                setStats({
                    totalEmployees: total,
                    newHires: newHiresCount,
                    payrollCost: payroll,
                    avgPerformance: performancePct
                });
                setLoading(false);

            } catch (err) {
                console.error("Failed to fetch dashboard stats", err);
                setError('CONNECTION FAILURE. RETRYING...');
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const formatCurrency = (val: number) => {
        if (val >= 1000000) return `$${(val / 1000000).toFixed(1)}M`;
        if (val >= 1000) return `$${(val / 1000).toFixed(0)}k`;
        return `$${val}`;
    };

    const Marquee = () => {
        return (
            <div className="w-full overflow-hidden border-y border-toyfight-cream/20 bg-toyfight-bg/50 backdrop-blur-sm py-3 mb-12">
                <div className="relative flex overflow-x-hidden">
                    <div className="animate-marquee whitespace-nowrap flex gap-8">
                        {Array(4).fill("SYSTEM: ONLINE // LATENCY: 12ms // ENCRYPTION: AES-256 // NODES: 8 ACTIVE // DEPLOYMENT: STABLE // WORKFORCE: OPTIMIZED // ").map((text, i) => (
                            <span key={i} className="text-sm font-mono text-toyfight-yellow uppercase tracking-widest">
                                {text}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    // Mock Data for "Retro Charts"
    const trafficData = [40, 65, 30, 80, 55, 90, 45, 70, 60, 85, 50, 75]; // Random bars for "Hiring Traffic"

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <div className="font-mono text-toyfight-yellow animate-pulse text-xl tracking-widest">
                    INITIALIZING SYSTEM...
                </div>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="min-h-[200vh] bg-toyfight-bg text-toyfight-cream pb-32">
            {/* 1. Hero / Header */}
            <motion.div style={{ y: yHero, opacity: opacityHero }} className="pt-8">
                <Marquee />
                <div className="px-6 md:px-12 mb-24">
                    <h1 className="text-[10vw] font-header font-bold leading-[0.8] tracking-tighter uppercase text-transparent stroke-text-cream hover:text-toyfight-cream transition-colors duration-700">
                        Operational<br />
                        <span className="text-toyfight-yellow stroke-text-yellow">Dashboard</span>
                    </h1>
                </div>
            </motion.div>

            {/* 2. Key Metrics (Scroll Reveal) */}
            <div className="px-6 md:px-12 mb-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { title: "ACTIVE UNITS", value: stats.totalEmployees, icon: Users, delay: 0 },
                    { title: "NEW PROTOCOLS", value: stats.newHires, icon: UserPlus, delay: 0.1 },
                    { title: "RESOURCE ALLOC", value: formatCurrency(stats.payrollCost), icon: DollarSign, delay: 0.2 },
                    { title: "SYS INTEGRITY", value: `${stats.avgPerformance}%`, icon: Activity, delay: 0.3 },
                ].map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 100 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: item.delay, ease: [0.22, 1, 0.36, 1] }}
                        className="group bg-toyfight-bg border border-toyfight-cream/20 p-8 hover:bg-toyfight-cream hover:text-toyfight-bg transition-colors duration-500 relative overflow-hidden"
                    >
                        <div className="relative z-10 flex flex-col justify-between h-48">
                            <div className="flex justify-between items-start">
                                <item.icon className="w-8 h-8 opacity-50" />
                                <span className="font-mono text-xs tracking-widest opacity-50">0{i + 1}</span>
                            </div>
                            <div>
                                <h3 className="font-header text-6xl font-bold mb-2 tracking-tighter">{item.value}</h3>
                                <p className="font-mono text-xs uppercase tracking-widest opacity-70 group-hover:opacity-100">{item.title}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 3. System Traffic (Replaces Hiring Trends) */}
            <div className="px-6 md:px-12 mb-48">
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                    viewport={{ once: true }}
                    className="border-t border-toyfight-cream/10 pt-12"
                >
                    <div className="flex justify-between items-end mb-12">
                        <h2 className="text-6xl font-header font-bold uppercase tracking-tighter">
                            Talent <span className="text-toyfight-yellow">Acquisition</span>
                        </h2>
                        <div className="font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest text-right">
                            <div className="flex items-center gap-2 justify-end mb-1">
                                <span className="w-2 h-2 bg-toyfight-yellow rounded-full animate-pulse"></span>
                                LIVE PIPELINE
                            </div>
                            APPLICANT FLUX
                        </div>
                    </div>

                    {/* Retro Bar Chart */}
                    <div className="h-64 flex items-end justify-between gap-2 md:gap-4 px-4 py-8 bg-toyfight-bg border border-toyfight-cream/10 relative">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 w-full h-full pointer-events-none"
                            style={{ backgroundImage: `linear-gradient(to bottom, rgba(250, 246, 239, 0.05) 1px, transparent 1px)`, backgroundSize: '100% 20px' }}
                        />

                        {trafficData.map((height, i) => (
                            <motion.div
                                key={i}
                                initial={{ height: 0 }}
                                whileInView={{ height: `${height}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.8, delay: i * 0.05, ease: "backOut" }}
                                className="w-full bg-toyfight-yellow/20 relative group hover:bg-toyfight-yellow transition-colors"
                            >
                                <div className="absolute top-0 w-full h-1 bg-toyfight-yellow shadow-[0_0_10px_rgba(255,229,0,0.5)]" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 font-mono text-[10px] text-toyfight-yellow opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    APP_Vol_{i * 12}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* 4. Core Performance (Replaces Bar Chart) */}
            <div className="px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-24 mb-32">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-4xl font-header font-bold uppercase tracking-tighter mb-8">
                        Workforce <span className="text-toyfight-yellow">Metrics</span>
                    </h2>
                    <div className="space-y-8 font-mono">
                        {[
                            { label: "RETENTION_RATE", val: 94 },
                            { label: "ATTENDANCE_AVG", val: 88 },
                            { label: "BUDGET_UTIL", val: 72 },
                            { label: "OFFER_ACCEPT", val: 85 },
                        ].map((metric, i) => (
                            <div key={i} className="group">
                                <div className="flex justify-between text-xs tracking-widest mb-2 opacity-70 group-hover:opacity-100 transition-opacity">
                                    <span>{metric.label}</span>
                                    <span>{metric.val}%</span>
                                </div>
                                <div className="h-4 bg-toyfight-cream/10 w-full border border-toyfight-cream/10 overflow-hidden relative">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${metric.val}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, delay: 0.2, ease: "circOut" }}
                                        className="h-full bg-toyfight-cream group-hover:bg-toyfight-yellow transition-colors"
                                    />
                                    {/* Scanline effect over bar */}
                                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="border border-toyfight-cream/20 bg-black p-8 font-mono text-xs overflow-hidden h-[400px] relative"
                >
                    <div className="absolute top-0 right-0 p-4 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/50" />
                    </div>
                    <h3 className="text-toyfight-yellow mb-4 uppercase tracking-widest text-sm flex items-center gap-2">
                        <Terminal size={14} /> HR_EVENT_LOGS
                    </h3>
                    <div className="space-y-2 text-toyfight-cream/70">
                        {/* Simulated typing log */}
                        {[
                            "SYNCING ATTENDANCE RECORDS...",
                            "PAYROLL BATCH #2026-04 PREPARED... [PENDING]",
                            "CANDIDATE 'A. JOHNSON' -> INTERVIEW STAGE",
                            "UPDATING ORG CHART NODES...",
                            `ACTIVE HEADCOUNT: ${stats.totalEmployees} EMPLOYEES`,
                            `NEW APPPLICATIONS: +12 TODAY`,
                            `OFFER ACCEPTED: ENG_DEPT_04`,
                            "VERIFYING COMPLIANCE DOCS...",
                            "SCHEDULED MAINT: CLOCK_IN_SYS",
                            "HR DATABASE: SYNCHRONIZED.",
                            "awaiting_admin_cmd_ cursor_active"
                        ].map((log, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                            >
                                <span className="text-toyfight-cream/30 mr-4">[{new Date().toLocaleTimeString()}]</span>
                                {log}
                            </motion.div>
                        ))}
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 0.8 }}
                            className="inline-block w-2 h-4 bg-toyfight-yellow align-middle ml-1"
                        />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
