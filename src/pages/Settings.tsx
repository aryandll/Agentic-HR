import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Bell, Shield, Moon, Sun, Save, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import ContentCard from '../components/ui/ContentCard';
import InteractiveButton from '../components/ui/InteractiveButton';

const Settings = () => {
    const { user } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const [notifications, setNotifications] = useState({
        email: true,
        push: false,
        marketing: false
    });

    return (
        <div className="space-y-12 pb-12">
            <header className="mb-8">
                <h1 className="text-6xl font-header font-bold text-toyfight-cream uppercase leading-none tracking-tighter">
                    SYSTEM <span className="text-toyfight-gray">SETTINGS</span>
                </h1>
                <div className="h-1 w-24 bg-toyfight-yellow mt-4" />
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Section */}
                <div className="lg:col-span-1">
                    <ContentCard title="IDENTITY" className="h-full">
                        <div className="flex flex-col items-center mb-8">
                            <div className="w-32 h-32 rounded-full border-2 border-toyfight-cream/20 p-1 mb-6 relative">
                                <div className="absolute inset-0 border border-toyfight-yellow rounded-full animate-spin-slow opacity-20" />
                                <img
                                    src={user?.image || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}
                                    alt="Profile"
                                    className="w-full h-full rounded-full object-cover bg-toyfight-gray grayscale hover:grayscale-0 transition-all duration-500"
                                />
                            </div>
                            <h3 className="text-2xl font-header font-bold text-toyfight-cream uppercase tracking-wide">{user?.name}</h3>
                            <p className="text-toyfight-yellow font-mono text-sm uppercase">{user?.role} // {user?.department || 'HQ'}</p>
                        </div>

                        <div className="space-y-6 font-mono text-sm">
                            <div className="group">
                                <label className="text-xs text-toyfight-cream/40 uppercase tracking-widest block mb-2">Email Designation</label>
                                <div className="p-4 border-b border-toyfight-cream/10 text-toyfight-cream group-hover:border-toyfight-yellow transition-colors">
                                    {user?.email}
                                </div>
                            </div>
                            <div className="group">
                                <label className="text-xs text-toyfight-cream/40 uppercase tracking-widest block mb-2">Clearance Level</label>
                                <div className="flex items-center gap-2 p-4 border-b border-toyfight-cream/10 text-toyfight-cream group-hover:border-toyfight-yellow transition-colors">
                                    <Shield className="w-4 h-4 text-toyfight-yellow" />
                                    <span className="uppercase">{user?.accessRole}</span>
                                </div>
                            </div>
                        </div>
                    </ContentCard>
                </div>

                {/* Settings Content */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Appearance & Notifications */}
                    <ContentCard title="INTERFACE PREFERENCES">
                        <div className="space-y-8">
                            <div className="flex items-center justify-between p-6 border border-toyfight-cream/5 hover:border-toyfight-cream/20 transition-colors bg-toyfight-cream/5">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-none border border-toyfight-cream/20 flex items-center justify-center text-toyfight-cream bg-toyfight-bg">
                                        {isDark ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
                                    </div>
                                    <div>
                                        <h4 className="text-toyfight-cream font-header text-lg uppercase">Visual Mode</h4>
                                        <p className="text-toyfight-cream/40 font-mono text-xs uppercase">Toggle high-contrast display</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { toggleTheme(); toast.success('Theme Updated'); }}
                                    className={`relative inline-flex h-8 w-16 items-center rounded-none border border-toyfight-cream/20 transition-colors ${isDark ? 'bg-toyfight-yellow' : 'bg-toyfight-gray'}`}
                                >
                                    <span className={`inline-block h-6 w-6 transform bg-toyfight-bg transition-transform ${isDark ? 'translate-x-9' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border border-toyfight-cream/10 p-4 hover:border-toyfight-yellow/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-toyfight-cream font-header uppercase">Email Alerts</span>
                                        <input
                                            type="checkbox"
                                            checked={notifications.email}
                                            onChange={(e) => setNotifications({ ...notifications, email: e.target.checked })}
                                            className="w-5 h-5 rounded-none border-toyfight-cream/20 text-toyfight-yellow focus:ring-0 bg-transparent"
                                        />
                                    </div>
                                    <p className="text-xs font-mono text-toyfight-cream/40">Receive daily digest and critical alerts.</p>
                                </div>
                                <div className="border border-toyfight-cream/10 p-4 hover:border-toyfight-yellow/50 transition-colors">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-toyfight-cream font-header uppercase">Push Data</span>
                                        <input
                                            type="checkbox"
                                            checked={notifications.push}
                                            onChange={(e) => setNotifications({ ...notifications, push: e.target.checked })}
                                            className="w-5 h-5 rounded-none border-toyfight-cream/20 text-toyfight-yellow focus:ring-0 bg-transparent"
                                        />
                                    </div>
                                    <p className="text-xs font-mono text-toyfight-cream/40">Real-time terminal updates.</p>
                                </div>
                            </div>
                        </div>
                    </ContentCard>

                    {/* Security */}
                    <ContentCard title="SECURITY PROTOCOLS">
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); toast.success('Security Protocols Updated'); }}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 group">
                                    <label className="text-xs font-mono text-toyfight-cream/40 uppercase tracking-widest">Current Passkey</label>
                                    <div className="relative">
                                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-toyfight-cream/20 w-4 h-4 group-focus-within:text-toyfight-yellow transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 pl-8 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-mono text-sm"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2 group">
                                    <label className="text-xs font-mono text-toyfight-cream/40 uppercase tracking-widest">New Passkey</label>
                                    <div className="relative">
                                        <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-toyfight-cream/20 w-4 h-4 group-focus-within:text-toyfight-yellow transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="••••••••"
                                            className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 pl-8 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-mono text-sm"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end pt-4">
                                <InteractiveButton type="submit">
                                    <span className="flex items-center gap-2">
                                        <Save className="w-4 h-4" /> REWRITE CREDENTIALS
                                    </span>
                                </InteractiveButton>
                            </div>
                        </form>
                    </ContentCard>
                </div>
            </div>
        </div>
    );
};

export default Settings;
