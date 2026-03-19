import { Search, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import InteractiveButton from '../components/ui/InteractiveButton';

const Header = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, unreadCount, markAsRead, clearAll } = useNotification();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        toast.success('Logged out successfully');
        navigate('/login');
    };

    // Get current page title from path
    const getPageTitle = () => {
        const path = location.pathname.split('/')[1];
        if (!path) return 'DASHBOARD';
        return path.toUpperCase();
    };

    return (
        <header className="sticky top-0 z-30 w-full bg-toyfight-bg/95 backdrop-blur-sm border-b border-toyfight-cream/10 px-8 py-6">
            <div className="flex items-center justify-between">

                {/* Left: Page Title - Big Typography */}
                <div className="flex items-center gap-4">
                    <motion.h2
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, ease: "circOut" }}
                        className="text-5xl font-header font-bold text-toyfight-cream uppercase tracking-tight"
                    >
                        {getPageTitle()}
                    </motion.h2>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-6">

                    {/* Minimal Search */}
                    <div className="hidden md:flex items-center border-b border-toyfight-cream/20 pb-1 w-64 focus-within:border-toyfight-yellow transition-colors">
                        <Search className="w-4 h-4 text-toyfight-cream/50 mr-2" />
                        <input
                            type="text"
                            placeholder="SEARCH..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    toast.loading(`Searching for "${searchQuery}"...`, { duration: 2000 });
                                    setTimeout(() => {
                                        toast.dismiss();
                                        toast.success(`Found 0 results for "${searchQuery}"`);
                                    }, 2000);
                                    setSearchQuery('');
                                }
                            }}
                            className="bg-transparent border-none outline-none text-toyfight-cream placeholder:text-toyfight-cream/30 font-mono text-sm w-full"
                        />
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 rounded-full hover:bg-toyfight-cream/10 transition-colors"
                        >
                            <Bell className="w-6 h-6 text-toyfight-cream" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-toyfight-yellow text-[10px] font-bold text-toyfight-bg">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute right-0 mt-4 w-80 bg-toyfight-bg border border-toyfight-cream/20 shadow-2xl overflow-hidden z-50"
                                >
                                    <div className="p-4 border-b border-toyfight-cream/10 flex justify-between items-center bg-toyfight-cream/5">
                                        <h3 className="font-header text-lg text-toyfight-cream uppercase">Notifications</h3>
                                        {notifications.length > 0 && (
                                            <button onClick={clearAll} className="text-xs font-mono text-toyfight-yellow hover:underline">
                                                CLEAR ALL
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto custom-scrollbar">
                                        {notifications.length === 0 ? (
                                            <div className="p-8 text-center text-toyfight-cream/40 font-mono text-sm">
                                                NO NEW ALERTS
                                            </div>
                                        ) : (
                                            notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => markAsRead(notif.id)}
                                                    className={`p-4 border-b border-toyfight-cream/10 cursor-pointer transition-colors hover:bg-toyfight-cream/5 ${!notif.read ? 'bg-toyfight-cream/5' : ''}`}
                                                >
                                                    <p className="font-sans font-medium text-toyfight-cream text-sm mb-1">{notif.title}</p>
                                                    <p className="font-mono text-xs text-toyfight-cream/60">{notif.message}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Logout Button */}
                    <InteractiveButton variant="secondary" onClick={handleLogout}>
                        <span className="flex items-center gap-2">
                            Logout <LogOut className="w-3 h-3" />
                        </span>
                    </InteractiveButton>

                </div>
            </div>
        </header>
    );
};

export default Header;
