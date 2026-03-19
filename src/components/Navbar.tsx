import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cyan-500/30">
                    HR
                </div>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                    Nexus
                </span>
            </Link>

            <div className="flex gap-6">
                <Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link>
            </div>
        </nav>
    );
};

export default Navbar;
