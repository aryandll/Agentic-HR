import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import InteractiveButton from '../components/ui/InteractiveButton';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (res.ok) {
                const user = await res.json();
                login(user);
                navigate('/');
            } else {
                setError('Invalid credentials');
            }
        } catch (err) {
            console.error(err);
            setError('Login failed. Is backend running?');
        }
    };

    return (
        <div className="min-h-screen bg-toyfight-bg flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Graphic */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none overflow-hidden">
                <span className="text-[25vw] font-header font-bold text-toyfight-cream leading-none tracking-tighter whitespace-nowrap">
                    NEXUS
                </span>
            </div>

            <div className="absolute top-0 left-0 w-full h-1 bg-toyfight-yellow z-20" />
            <div className="absolute bottom-0 right-0 w-full h-1 bg-toyfight-cream z-20" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="w-full max-w-md bg-toyfight-bg/90 backdrop-blur-xl border border-toyfight-cream/10 p-12 relative z-10 shadow-2xl"
            >
                <div className="mb-12">
                    <h1 className="text-6xl font-header font-bold text-toyfight-cream uppercase mb-2 leading-none tracking-tighter">
                        Log <span className="text-toyfight-yellow">In</span>
                    </h1>
                    <div className="h-1 w-12 bg-toyfight-cream mt-4" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-toyfight-cream/40 w-5 h-5 group-focus-within:text-toyfight-yellow transition-colors" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-transparent border-b border-toyfight-cream/20 py-3 pl-10 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-header text-xl placeholder:text-toyfight-cream/10"
                                placeholder="NAME@NEXUS.HR"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest">Password</label>
                        <div className="relative group">
                            <Lock className="absolute left-0 top-1/2 -translate-y-1/2 text-toyfight-cream/40 w-5 h-5 group-focus-within:text-toyfight-yellow transition-colors" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-transparent border-b border-toyfight-cream/20 py-3 pl-10 text-toyfight-cream focus:outline-none focus:border-toyfight-yellow transition-colors font-header text-xl placeholder:text-toyfight-cream/10"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border-l-2 border-red-500 text-red-400 font-mono text-xs p-3"
                        >
                            {error}
                        </motion.div>
                    )}

                    <div className="pt-4">
                        <InteractiveButton type="submit" className="w-full justify-center">
                            <span className="flex items-center gap-4">
                                ACCESS TERMINAL <ArrowRight className="w-4 h-4" />
                            </span>
                        </InteractiveButton>
                    </div>

                    <div className="pt-8 border-t border-toyfight-cream/10 text-center">
                        <p className="text-xs font-mono text-toyfight-cream/40 uppercase">
                            Restricted Area • Authorized Personnel Only
                        </p>
                    </div>

                </form>
            </motion.div>
        </div>
    );
};

export default Login;
