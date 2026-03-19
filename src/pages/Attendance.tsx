import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

interface Employee {
    id: number;
    name: string;
    role: string;
    image: string;
}

interface AttendanceRecord {
    id: number;
    employeeId: number;
    date: string;
    clockInTime?: string;
    clockOutTime?: string;
    status: string;
}

const Attendance = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);

    const fetchData = async () => {
        try {
            const [empRes, attRes] = await Promise.all([
                fetch('http://localhost:8080/api/employees'),
                fetch('http://localhost:8080/api/attendance')
            ]);

            const empData = await empRes.json();
            const attData = await attRes.json();

            setEmployees(empData);
            setAttendance(attData);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClockIn = async (empId: number) => {
        try {
            await fetch(`http://localhost:8080/api/attendance/clock-in/${empId}`, { method: 'POST' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleClockOut = async (empId: number) => {
        try {
            await fetch(`http://localhost:8080/api/attendance/clock-out/${empId}`, { method: 'POST' });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const getStatus = (empId: number) => {
        const record = attendance.find(a => a.employeeId === empId);
        if (!record) return 'absent';
        if (record.clockOutTime) return 'clocked_out';
        return 'present';
    };

    const getClockInTime = (empId: number) => {
        const record = attendance.find(a => a.employeeId === empId);
        if (record && record.clockInTime) {
            return new Date(record.clockInTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return '--:--';
    };

    return (
        <div className="space-y-12 pb-12">
            {/* Header */}
            <div className='flex flex-col md:flex-row justify-between items-end gap-6'>
                <div>
                    <h1 className='text-6xl font-header font-bold text-toyfight-cream uppercase leading-none tracking-tighter'>
                        TIME <span className="text-toyfight-yellow">& ATTENDANCE</span>
                    </h1>
                    <div className="h-2 w-24 bg-toyfight-cream mt-4" />
                </div>

                <div className="flex flex-col items-end">
                    <p className="font-mono text-toyfight-cream/50 text-sm uppercase tracking-widest mb-1">TODAY'S DATE</p>
                    <div className="font-header text-3xl text-toyfight-cream border-b border-toyfight-yellow pb-2">
                        {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </div>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-toyfight-gray p-6 border border-toyfight-cream/10 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckCircle size={64} className="text-toyfight-cream" />
                    </div>
                    <h3 className="font-mono text-sm text-toyfight-cream/60 uppercase tracking-widest mb-2">Present Today</h3>
                    <p className="text-6xl font-header font-bold text-toyfight-cream group-hover:text-toyfight-yellow transition-colors">
                        {attendance.filter(a => !a.clockOutTime).length}
                    </p>
                </div>

                <div className="bg-toyfight-gray p-6 border border-toyfight-cream/10 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <XCircle size={64} className="text-toyfight-cream" />
                    </div>
                    <h3 className="font-mono text-sm text-toyfight-cream/60 uppercase tracking-widest mb-2">Absent / Not In</h3>
                    <p className="text-6xl font-header font-bold text-toyfight-cream group-hover:text-red-500 transition-colors">
                        {employees.length - attendance.length}
                    </p>
                </div>

                <div className="bg-toyfight-gray p-6 border border-toyfight-cream/10 relative group overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Clock size={64} className="text-toyfight-cream" />
                    </div>
                    <h3 className="font-mono text-sm text-toyfight-cream/60 uppercase tracking-widest mb-2">On Leave</h3>
                    <p className="text-6xl font-header font-bold text-toyfight-cream text-opacity-50">0</p>
                </div>
            </div>

            {/* Attendance List */}
            <div className="space-y-4">
                <div className="grid grid-cols-12 gap-4 px-6 py-2 border-b border-toyfight-cream/20 font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest">
                    <div className="col-span-4">Employee</div>
                    <div className="col-span-3 text-center">Clock In</div>
                    <div className="col-span-3 text-center">Status</div>
                    <div className="col-span-2 text-right">Action</div>
                </div>

                {employees.map((emp) => {
                    const status = getStatus(emp.id);
                    return (
                        <motion.div
                            key={emp.id}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-12 gap-4 items-center p-6 bg-toyfight-gray hover:bg-toyfight-cream/5 border border-transparent hover:border-toyfight-yellow/30 transition-all group"
                        >
                            <div className="col-span-4 flex items-center gap-4">
                                <div className="w-12 h-12 bg-toyfight-bg border border-toyfight-cream/20 flex items-center justify-center text-toyfight-cream font-bold text-lg">
                                    {emp.name.charAt(0)}
                                </div>
                                <div>
                                    <h4 className="font-header text-xl text-toyfight-cream uppercase leading-none">{emp.name}</h4>
                                    <p className="font-mono text-xs text-toyfight-cream/50 uppercase tracking-wider">{emp.role}</p>
                                </div>
                            </div>

                            <div className="col-span-3 text-center font-mono text-xl text-toyfight-yellow">
                                {getClockInTime(emp.id)}
                            </div>

                            <div className="col-span-3 flex justify-center">
                                {status === 'present' && (
                                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/50 text-green-500 font-mono text-xs uppercase tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        ONLINE
                                    </div>
                                )}
                                {status === 'clocked_out' && (
                                    <div className="px-3 py-1 bg-toyfight-cream/5 border border-toyfight-cream/20 text-toyfight-cream/50 font-mono text-xs uppercase tracking-widest">
                                        OFFLINE
                                    </div>
                                )}
                                {status === 'absent' && (
                                    <div className="px-3 py-1 bg-red-500/10 border border-red-500/50 text-red-500 font-mono text-xs uppercase tracking-widest">
                                        MISSING
                                    </div>
                                )}
                            </div>

                            <div className="col-span-2 flex justify-end">
                                {status === 'absent' && (
                                    <button
                                        onClick={() => handleClockIn(emp.id)}
                                        className="font-header text-sm bg-toyfight-cream text-toyfight-bg px-4 py-2 hover:bg-white transition-colors uppercase tracking-wide font-bold"
                                    >
                                        Clock In
                                    </button>
                                )}
                                {status === 'present' && (
                                    <button
                                        onClick={() => handleClockOut(emp.id)}
                                        className="font-header text-sm border border-toyfight-cream text-toyfight-cream px-4 py-2 hover:bg-toyfight-cream hover:text-toyfight-bg transition-colors uppercase tracking-wide font-bold"
                                    >
                                        Clock Out
                                    </button>
                                )}
                                {status === 'clocked_out' && (
                                    <span className="text-toyfight-cream/20 font-mono text-xs uppercase">--</span>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};

export default Attendance;
