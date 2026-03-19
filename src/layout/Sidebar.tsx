import { LayoutDashboard, Users, UserPlus, DollarSign, Calendar, Settings, Network, Briefcase, LogOut } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const { user, logout } = useAuth();

    const links = [
        { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
        { to: "/employees", icon: Users, label: "Employees" },
        { to: "/recruitment", icon: UserPlus, label: "Recruitment" },
        { to: "/payroll", icon: DollarSign, label: "Payroll" },
        { to: "/attendance", icon: Calendar, label: "Attendance" },
        { to: "/org-chart", icon: Network, label: "Org Chart" },
        { to: "/onboarding", icon: UserPlus, label: "Onboarding" }, // Using UserPlus as icon for now, or maybe CheckSquare if available
        { to: "/careers", icon: Briefcase, label: "Careers" },
        { to: "/settings", icon: Settings, label: "Settings" },
    ];

    // Animation variants for the sidebar container
    const sidebarVariants = {
        hidden: { x: -100, opacity: 0 },
        visible: {
            x: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                staggerChildren: 0.1
            }
        }
    };

    return (
        <motion.aside
            className="fixed left-0 top-0 h-screen w-64 bg-toyfight-bg border-r border-toyfight-cream/10 z-50 flex flex-col justify-between py-8 px-6"
            initial="hidden"
            animate="visible"
            variants={sidebarVariants}
        >
            {/* Logo Area */}
            <div className="mb-12 px-2">
                <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="text-6xl font-header font-bold text-toyfight-cream tracking-tighter leading-none">
                        NEXUS
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="h-0.5 w-8 bg-toyfight-yellow" />
                        <span className="font-mono text-xs text-toyfight-cream/60 tracking-widest uppercase">HR_SYS_V2.0</span>
                    </div>
                </motion.div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-2">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) => `
                            relative group flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-500 overflow-hidden
                            ${isActive ? 'text-toyfight-bg' : 'text-toyfight-cream hover:text-toyfight-bg'}
                        `}
                    >
                        {({ isActive }) => (
                            <>
                                {/* Background Hover/Active Fill */}
                                <span className={`
                                    absolute inset-0 bg-toyfight-cream transition-transform duration-500 ease-[0.22,1,0.36,1]
                                    ${isActive ? 'translate-x-0' : '-translate-x-full group-hover:translate-x-0'}
                                `} />

                                {/* Icon & Label */}
                                <link.icon className={`w-5 h-5 relative z-10 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-toyfight-bg' : ''}`} />
                                <span className="font-sans font-medium uppercase tracking-widest text-xs relative z-10">
                                    {link.label}
                                </span>
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User Footer */}
            <div className="mt-8 pt-8 border-t border-toyfight-cream/10">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-toyfight-gray flex items-center justify-center text-toyfight-cream font-header font-bold text-xl border border-toyfight-cream/20">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div>
                            <p className="font-header text-sm text-toyfight-cream uppercase tracking-wider">{user?.name || 'User'}</p>
                            <p className="font-mono text-xs text-toyfight-cream/50">{user?.role || 'Guest'}</p>
                        </div>
                    </div>
                    <button onClick={logout} className="text-toyfight-cream/50 hover:text-toyfight-yellow transition-colors relative group">
                        <LogOut size={20} />
                        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-toyfight-cream text-toyfight-bg text-xs font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">LOGOUT</span>
                    </button>
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;
