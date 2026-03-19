import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MapPin, X, CheckCircle, ArrowUpRight, Zap, Code, Users, Globe, UploadCloud } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';
import InteractiveButton from '../components/ui/InteractiveButton';

interface Job {
    id: number;
    title: string;
    department: string;
    location: string;
    type: string;
    description: string;
}

const CultureCard = ({ title, subtitle, icon: Icon, color, onClick }: { title: string, subtitle: string, icon: any, color: string, onClick: () => void }) => (
    <div onClick={onClick} className={`min-w-[300px] md:min-w-[400px] h-[400px] bg-toyfight-bg border border-toyfight-cream/10 p-8 flex flex-col justify-between relative group overflow-hidden cursor-pointer`}>
        <div className={`absolute inset-0 bg-${color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

        <div className="relative z-10">
            <Icon size={48} className={`text-${color} mb-6`} />
            <h3 className="text-4xl font-header font-bold uppercase text-toyfight-cream leading-none mb-2">
                {title}
            </h3>
            <p className="font-mono text-toyfight-cream/60 uppercase tracking-widest text-sm">
                {subtitle}
            </p>
        </div>

        <div className="relative z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
            <span className={`text-${color} font-header text-xl uppercase tracking-wider`}>Read More &rarr;</span>
        </div>
    </div>
);

const cultureDetails: Record<string, { description: string; points: string[] }> = {
    "SHIP FAST": {
        description: "Speed is our ultimate competitive advantage. We don't wait for perfection; we iterate relentlessly.",
        points: ["Deploy daily, not weekly.", "Bias for action over endless debate.", "Fail fast, learn faster."]
    },
    "CODE CLEAN": {
        description: "We believe that code is art. It should be elegant, readable, and maintainable.",
        points: ["Refactor without fear.", "Documentation is not optional.", "Simple is better than clever."]
    },
    "TEAM FIRST": {
        description: "No brilliant jerks. We win as a squad or we lose as individuals.",
        points: ["Radical candor with empathy.", "Leave your ego at the door.", "Celebrate others' wins."]
    },
    "GLOBAL": {
        description: "Talent has no borders. We are a distributed team building for a distributed world.",
        points: ["Asynchronous by default.", "Respect time zones.", "Diversity drives innovation."]
    },
    "IMPACT": {
        description: "We don't just build features; we solve real problems that change lives.",
        points: ["Measure what matters.", "Customer obsession.", "Think big, start small."]
    }
};

const Careers = () => {
    const { addNotification } = useNotification();
    const [jobs, setJobs] = useState<Job[]>([]);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [selectedCulture, setSelectedCulture] = useState<{ title: string, color: string } | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [submitted, setSubmitted] = useState(false);

    const handleFileSelect = useCallback((file: File) => {
        if (!file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
            alert('Please upload a PDF, DOCX, or TXT file.');
            return;
        }
        setResumeFile(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
    const handleDragLeave = () => setIsDragging(false);

    // Scroll Animation Refs
    const targetRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"]
    });

    const x = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);

    useEffect(() => {
        fetch('http://localhost:8080/api/jobs/public')
            .then(res => res.json())
            .then(data => {
                setJobs(data);

            })
            .catch(err => {
                console.error("Failed to fetch jobs", err);
                setJobs([
                    {
                        id: 1,
                        title: 'Technical Specialist',
                        department: 'Engineering',
                        location: 'Remote',
                        type: 'Full-time',
                        description: `Summary
We are looking for a Senior Software Engineer to join our core product team. You will be responsible for building scalable systems and delivering high-quality software that powers our platform. This role requires a deep understanding of modern web technologies and a passion for engineering excellence.

Description
As a Senior Software Engineer, you will drive the design and implementation of key features. You will collaborate with cross-functional teams to define requirements and deliver solutions. Your code will set the standard for quality and maintainability.

You will mentor junior engineers, conduct code reviews, and advocate for best practices. You will also participate in architectural decisions and help shape the technical roadmap of the product.

Qualifications
• 5+ years of experience in software development.
• Strong proficiency in React, Node.js, and TypeScript.
• Experience with cloud platforms (AWS/GCP) and microservices architecture.
• Excellent problem-solving skills and attention to detail.
• Ability to work effectively in a remote, fast-paced environment.`
                    },
                    { id: 2, title: 'Senior React Developer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Build the future of HR tech.' },
                    { id: 3, title: 'Product Manager', department: 'Product', location: 'New York', type: 'Full-time', description: 'Lead the product vision and strategy.' }
                ]);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('role', selectedJob?.title || 'Applicant');
            data.append('department', selectedJob?.department || 'General');
            if (resumeFile) data.append('file', resumeFile);

            const res = await fetch('http://localhost:8080/api/candidates/apply', {
                method: 'POST',
                body: data,
            });

            if (res.ok) {
                setSubmitted(true);
                addNotification('Application Received', `Application for ${selectedJob?.title} submitted successfully.`, 'success');
                setTimeout(() => {
                    setSelectedJob(null);
                    setSubmitted(false);
                    setFormData({ name: '', email: '' });
                    setResumeFile(null);
                }, 3000);
            } else {
                addNotification('Submission Failed', 'This email might already be in use.', 'error');
            }
        } catch (err) {
            console.error(err);
            setSubmitted(true);
            setTimeout(() => {
                setSelectedJob(null);
                setSubmitted(false);
                setFormData({ name: '', email: '' });
                setResumeFile(null);
            }, 3000);
        }
    };

    return (
        <div className="min-h-screen bg-toyfight-bg text-toyfight-cream font-sans overflow-x-hidden selection:bg-toyfight-yellow selection:text-toyfight-bg">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <header className="flex justify-between items-start mb-24">
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-header font-bold tracking-tighter leading-none">
                            NEXUS<span className="text-toyfight-yellow">.CAREERS</span>
                        </h1>
                        <span className="font-mono text-xs text-toyfight-cream/50 tracking-widest uppercase mt-1">
                            OP_SYS_V2.0
                        </span>
                    </div>
                </header>

                {/* Hero Section */}
                <div className="mb-32">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <h1 className="text-[12vw] leading-[0.85] font-header font-bold text-toyfight-cream uppercase tracking-tighter mb-8">
                            JOIN THE <br />
                            <span className="text-toyfight-yellow hover:text-toyfight-cream transition-colors duration-500 cursor-default">SQUAD</span>
                        </h1>
                        <p className="max-w-xl text-xl font-mono text-toyfight-cream/70 leading-relaxed border-l-2 border-toyfight-yellow pl-6">
                            We are building the operating system for modern teams.
                            Work on hard problems with world-class builders.
                        </p>
                    </motion.div>
                </div>

                {/* Moving Culture Section (Scroll Triggered) */}
                <section ref={targetRef} className="h-[50vh] mb-32 relative flex items-center overflow-hidden">
                    <motion.div
                        style={{ x, opacity }}
                        className="flex gap-8 absolute left-0 pl-6"
                    >
                        <CultureCard onClick={() => setSelectedCulture({ title: "SHIP FAST", color: "toyfight-yellow" })} title="SHIP FAST" subtitle="Velocity is our currency" icon={Zap} color="toyfight-yellow" />
                        <CultureCard onClick={() => setSelectedCulture({ title: "CODE CLEAN", color: "toyfight-cream" })} title="CODE CLEAN" subtitle="Excellence in every line" icon={Code} color="toyfight-cream" />
                        <CultureCard onClick={() => setSelectedCulture({ title: "TEAM FIRST", color: "toyfight-yellow" })} title="TEAM FIRST" subtitle="Together we go far" icon={Users} color="toyfight-yellow" />
                        <CultureCard onClick={() => setSelectedCulture({ title: "GLOBAL", color: "toyfight-cream" })} title="GLOBAL" subtitle="Work from anywhere" icon={Globe} color="toyfight-cream" />
                        <CultureCard onClick={() => setSelectedCulture({ title: "IMPACT", color: "toyfight-yellow" })} title="IMPACT" subtitle="Change the industry" icon={Zap} color="toyfight-yellow" />
                        <div className="min-w-[200px] flex items-center justify-center">
                            <h3 className="text-6xl font-header font-bold text-transparent stroke-text opacity-20">NEXUS</h3>
                        </div>
                    </motion.div>
                </section>

                <div className="mb-12 flex items-end justify-between border-b border-toyfight-cream/20 pb-4">
                    <h2 className="text-6xl font-header font-bold uppercase text-toyfight-cream">Open Positions</h2>
                    <span className="font-mono text-toyfight-yellow uppercase tracking-widest mb-2">[ {jobs.length} roles available ]</span>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 gap-4 pb-32">
                    {jobs.map((job, index) => (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedJob(job)}
                            className="group relative border-t border-toyfight-cream/20 py-12 hover:bg-toyfight-cream/5 transition-colors cursor-pointer"
                        >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div>
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="font-mono text-xs text-toyfight-yellow uppercase tracking-widest border border-toyfight-yellow/30 px-2 py-1 rounded-sm">
                                            {job.department}
                                        </span>
                                        <span className="font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest flex items-center gap-2">
                                            <MapPin size={12} /> {job.location}
                                        </span>
                                    </div>
                                    <h3 className="text-5xl font-header font-bold uppercase tracking-tight group-hover:text-toyfight-yellow transition-colors">
                                        {job.title}
                                    </h3>
                                </div>

                                <div className="flex items-center gap-8">
                                    <div className="hidden md:flex flex-col items-end text-right font-mono text-xs text-toyfight-cream/50 uppercase tracking-widest">
                                        <span>{job.type}</span>
                                        <span>Apply Now</span>
                                    </div>
                                    <div className="w-16 h-16 rounded-full border border-toyfight-cream/20 flex items-center justify-center group-hover:bg-toyfight-yellow group-hover:border-toyfight-yellow transition-all duration-300">
                                        <ArrowUpRight size={32} className="text-toyfight-cream group-hover:text-toyfight-bg transition-colors" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Application Modal */}
            <AnimatePresence>
                {selectedJob && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-toyfight-bg/95 backdrop-blur-sm"
                        onClick={() => setSelectedJob(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-toyfight-bg border border-toyfight-cream/20 w-full max-w-6xl h-[80vh] flex flex-col relative overflow-hidden shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-8 border-b border-toyfight-cream/10 flex justify-between items-start bg-toyfight-bg z-10">
                                <div>
                                    <h2 className="text-4xl font-header font-bold uppercase text-toyfight-cream leading-none">
                                        {selectedJob.title}
                                    </h2>
                                    <p className="font-mono text-xs text-toyfight-yellow mt-2 uppercase tracking-widest">
                                        {selectedJob.department} • {selectedJob.location} • {selectedJob.type}
                                    </p>
                                </div>
                                <button onClick={() => setSelectedJob(null)} className="text-toyfight-cream/50 hover:text-toyfight-yellow transition-colors">
                                    <X size={32} />
                                </button>
                            </div>

                            <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-toyfight-cream/10">
                                {/* Left Column: Job Details */}
                                <div className="overflow-y-auto p-8 space-y-8 scrollbar-hide">
                                    {selectedJob.description.split('\n\n').map((section, i) => {
                                        // Simple heuristic for headers: Short lines or explicit keywords
                                        const isHeader = section.length < 50 && !section.includes('.') && (section.includes('Summary') || section.includes('Description') || section.includes('Qualifications') || section.includes('Minimum Qualifications') || section.includes('Preferred Qualifications'));

                                        if (isHeader) {
                                            return <h3 key={i} className="text-2xl font-header font-bold text-toyfight-cream uppercase mt-6 mb-2 border-l-4 border-toyfight-yellow pl-4">{section}</h3>;
                                        }
                                        return (
                                            <p key={i} className="font-mono text-sm text-toyfight-cream/70 leading-relaxed whitespace-pre-wrap">
                                                {section}
                                            </p>
                                        );
                                    })}
                                </div>

                                {/* Right Column: Application Form */}
                                <div className="overflow-y-auto p-8 bg-toyfight-bg">
                                    {!submitted ? (
                                        <div className="max-w-md mx-auto">
                                            <h3 className="text-xl font-header font-bold text-toyfight-cream uppercase mb-8">
                                                Submit Application
                                            </h3>
                                            <form onSubmit={handleSubmit} className="space-y-8">
                                                <div className="space-y-2 group">
                                                    <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest group-focus-within:text-toyfight-yellow transition-colors">Full Name</label>
                                                    <input
                                                        required
                                                        type="text"
                                                        value={formData.name}
                                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                        className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 text-toyfight-cream font-header text-2xl uppercase placeholder:text-toyfight-cream/10 focus:outline-none focus:border-toyfight-yellow transition-all"
                                                        placeholder="JANE DOE"
                                                    />
                                                </div>
                                                <div className="space-y-2 group">
                                                    <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest group-focus-within:text-toyfight-yellow transition-colors">Email Address</label>
                                                    <input
                                                        required
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full bg-transparent border-b border-toyfight-cream/20 py-2 text-toyfight-cream font-header text-2xl uppercase placeholder:text-toyfight-cream/10 focus:outline-none focus:border-toyfight-yellow transition-all"
                                                        placeholder="JANE@EXAMPLE.COM"
                                                    />
                                                </div>
                                                {/* Resume Upload */}
                                                <div className="space-y-2">
                                                    <label className="text-xs font-mono text-toyfight-cream/60 uppercase tracking-widest">
                                                        Resume / CV <span className="text-toyfight-cream/30">(PDF, DOCX)</span>
                                                    </label>
                                                    <div
                                                        onDrop={handleDrop}
                                                        onDragOver={handleDragOver}
                                                        onDragLeave={handleDragLeave}
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className={`cursor-pointer p-6 border-2 border-dashed flex flex-col items-center gap-3 transition-all ${isDragging
                                                                ? 'border-toyfight-yellow bg-toyfight-yellow/10'
                                                                : resumeFile
                                                                    ? 'border-green-500 bg-green-500/5'
                                                                    : 'border-toyfight-cream/20 hover:border-toyfight-cream/50 hover:bg-toyfight-cream/5'
                                                            }`}
                                                    >
                                                        <input
                                                            ref={fileInputRef}
                                                            type="file"
                                                            accept=".pdf,.doc,.docx,.txt"
                                                            className="hidden"
                                                            onChange={e => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                                                        />
                                                        {resumeFile ? (
                                                            <>
                                                                <CheckCircle size={28} className="text-green-400" />
                                                                <div className="text-center">
                                                                    <p className="font-mono text-sm font-bold text-green-400 uppercase tracking-wider truncate max-w-[200px]">{resumeFile.name}</p>
                                                                    <p className="font-mono text-xs text-toyfight-cream/40 mt-1">Click to replace</p>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UploadCloud size={28} className={isDragging ? 'text-toyfight-yellow' : 'text-toyfight-cream/30'} />
                                                                <div className="text-center">
                                                                    <p className="font-mono text-sm font-bold text-toyfight-cream uppercase tracking-widest">Drop Resume Here</p>
                                                                    <p className="font-mono text-xs text-toyfight-cream/40 mt-1">or click to browse</p>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="pt-4 flex justify-end gap-4">
                                                    <InteractiveButton type="submit" className="w-full justify-center">
                                                        SEND APPLICATION
                                                    </InteractiveButton>
                                                </div>
                                            </form>
                                        </div>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-8">
                                            <motion.div
                                                initial={{ scale: 0, rotate: -180 }}
                                                animate={{ scale: 1, rotate: 0 }}
                                                className="w-24 h-24 bg-toyfight-yellow text-toyfight-bg rounded-full flex items-center justify-center mb-8"
                                            >
                                                <CheckCircle size={48} strokeWidth={2.5} />
                                            </motion.div>
                                            <h3 className="text-3xl font-header font-bold uppercase text-toyfight-cream mb-4">
                                                Application Sent
                                            </h3>
                                            <p className="font-mono text-toyfight-cream/60 uppercase tracking-widest text-sm">
                                                Good luck! We'll be in touch.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Culture Details Modal */}
            <AnimatePresence>
                {selectedCulture && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-toyfight-bg/95 backdrop-blur-sm"
                        onClick={() => setSelectedCulture(null)}
                    >
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 50, opacity: 0 }}
                            className="bg-toyfight-bg border border-toyfight-cream/20 w-full max-w-xl relative overflow-hidden p-8 md:p-12"
                            onClick={e => e.stopPropagation()}
                        >
                            <button onClick={() => setSelectedCulture(null)} className="absolute top-4 right-4 text-toyfight-cream/50 hover:text-toyfight-yellow transition-colors">
                                <X size={32} />
                            </button>

                            <h2 className="text-5xl font-header font-bold uppercase text-toyfight-cream mb-4">
                                {selectedCulture.title}
                            </h2>
                            <div className={`h-1 w-24 bg-${selectedCulture.color} mb-8`} />

                            <p className="text-xl font-mono text-toyfight-cream/80 mb-8 leading-relaxed">
                                {cultureDetails[selectedCulture.title].description}
                            </p>

                            <ul className="space-y-4">
                                {cultureDetails[selectedCulture.title].points.map((point, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <span className={`text-${selectedCulture.color} font-mono`}>0{i + 1}</span>
                                        <span className="font-header text-xl uppercase text-toyfight-cream">{point}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-12 pt-8 border-t border-toyfight-cream/10">
                                <button
                                    onClick={() => setSelectedCulture(null)}
                                    className={`text-${selectedCulture.color} font-mono uppercase tracking-widest text-sm hover:underline`}
                                >
                                    Close Details
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Careers;
