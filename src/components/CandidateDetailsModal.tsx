import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Briefcase, Bot, Sparkles, Loader2, UploadCloud, CheckCircle } from 'lucide-react';
import { useState, useRef, useCallback } from 'react';
import toast from 'react-hot-toast';

interface Candidate {
    id: string;
    name: string;
    role: string;
    status: string;
    email?: string;
    department?: string;
    resumeUrl?: string;
    aiScore?: number;
    aiFeedback?: string;
}

interface CandidateDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    candidate: Candidate | null;
    jobs: any[];
    onUpdate: () => void;
}

const CandidateDetailsModal = ({ isOpen, onClose, candidate, jobs, onUpdate }: CandidateDetailsModalProps) => {
    if (!candidate) return null;

    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<{ score: number; feedback: string } | null>(
        candidate?.aiScore ? { score: candidate.aiScore, feedback: candidate.aiFeedback || '' } : null
    );
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getMatchingJob = () =>
        jobs.find(j => j.title.toLowerCase().includes(candidate.role.toLowerCase())) || jobs[0];

    const handleFileSelect = useCallback((file: File) => {
        const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
        if (!allowed.includes(file.type) && !file.name.match(/\.(pdf|doc|docx|txt)$/i)) {
            toast.error('Please upload a PDF, DOCX, or TXT file.');
            return;
        }
        setUploadedFile(file);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFileSelect(file);
    }, [handleFileSelect]);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => setIsDragging(false);

    const handleAnalyzeUpload = async () => {
        if (!uploadedFile) {
            toast.error('Please upload a resume first.');
            return;
        }
        const matchingJob = getMatchingJob();
        if (!matchingJob) {
            toast.error('No active jobs to screen against.');
            return;
        }

        setIsAnalyzing(true);
        try {
            const formData = new FormData();
            formData.append('file', uploadedFile);

            const res = await fetch(`http://localhost:8080/api/ai/analyze-resume/${candidate.id}?jobId=${matchingJob.id}`, {
                method: 'POST',
                body: formData,
            });

            if (res.ok) {
                const updatedCandidate = await res.json();
                setAnalysisResult({ score: updatedCandidate.aiScore, feedback: updatedCandidate.aiFeedback });
                toast.success('AI Analysis Complete!');
                onUpdate();
            } else {
                toast.error('AI Analysis Failed. Please try again.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Connection Error. Is the backend running?');
        } finally {
            setIsAnalyzing(false);
        }
    };

    // Keep fallback for when no file is uploaded – uses profile info
    const handleAiAnalysis = async () => {
        const matchingJob = getMatchingJob();
        if (!matchingJob) {
            toast.error('No active jobs to screen against.');
            return;
        }
        setIsAnalyzing(true);
        try {
            const res = await fetch(`http://localhost:8080/api/ai/screen-candidate/${candidate.id}?jobId=${matchingJob.id}`, {
                method: 'POST'
            });
            if (res.ok) {
                const updatedCandidate = await res.json();
                setAnalysisResult({ score: updatedCandidate.aiScore, feedback: updatedCandidate.aiFeedback });
                toast.success('AI Analysis Complete!');
                onUpdate();
            } else {
                toast.error('AI Analysis Failed.');
            }
        } catch (error) {
            console.error(error);
            toast.error('Connection Error.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key="modal-backdrop"
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        key="modal-content"
                        className="bg-toyfight-bg border-2 border-toyfight-cream p-8 max-w-3xl w-full relative shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] max-h-[90vh] overflow-y-auto"
                        onClick={e => e.stopPropagation()}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-toyfight-cream hover:text-toyfight-yellow transition-colors"
                        >
                            <X size={32} strokeWidth={1.5} />
                        </button>

                        {/* Header */}
                        <div className="flex flex-col md:flex-row gap-8 mb-12 border-b-2 border-toyfight-cream/10 pb-8">
                            <div className="w-32 h-32 bg-toyfight-cream/5 border-2 border-toyfight-cream shrink-0 flex items-center justify-center">
                                <img
                                    src={`https://ui-avatars.com/api/?name=${candidate.name.replace(' ', '+')}&background=random&color=fff&size=256`}
                                    alt={candidate.name}
                                    className="w-full h-full object-cover grayscale opacity-80 hover:grayscale-0 transition-all"
                                />
                            </div>
                            <div className="flex-1 space-y-4">
                                <h2 className="text-5xl font-header font-bold text-toyfight-cream uppercase tracking-tighter leading-none">
                                    {candidate.name}
                                </h2>
                                <div className="flex flex-wrap gap-3">
                                    <span className="px-4 py-1 text-sm font-mono bg-toyfight-yellow text-black font-bold uppercase tracking-widest">
                                        {candidate.role}
                                    </span>
                                    {candidate.department && (
                                        <span className="px-4 py-1 text-sm font-mono border border-toyfight-cream text-toyfight-cream uppercase tracking-widest">
                                            {candidate.department}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-3 font-mono text-sm text-toyfight-cream/60">
                                    <Mail size={14} className="text-toyfight-yellow" />
                                    {candidate.email || 'No email'}
                                    <span className="mx-2 text-toyfight-cream/20">|</span>
                                    <Briefcase size={14} className="text-toyfight-yellow" />
                                    Applied for {candidate.role}
                                </div>
                            </div>
                        </div>

                        {/* Resume Upload Zone */}
                        <div className="mb-8">
                            <h3 className="text-toyfight-cream/50 font-mono text-xs uppercase tracking-widest border-b border-toyfight-cream/10 pb-2 mb-4">
                                Resume Upload — AI Will Read This
                            </h3>

                            <div
                                onDrop={handleDrop}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onClick={() => fileInputRef.current?.click()}
                                className={`relative cursor-pointer p-8 border-2 border-dashed transition-all flex flex-col items-center gap-4 ${isDragging
                                    ? 'border-toyfight-yellow bg-toyfight-yellow/10'
                                    : uploadedFile
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

                                {uploadedFile ? (
                                    <>
                                        <CheckCircle size={40} className="text-green-400" />
                                        <div className="text-center">
                                            <p className="font-mono font-bold text-green-400 uppercase tracking-wider">
                                                {uploadedFile.name}
                                            </p>
                                            <p className="font-mono text-xs text-toyfight-cream/50 mt-1">
                                                {(uploadedFile.size / 1024).toFixed(0)} KB — Click to replace
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <UploadCloud size={40} className={isDragging ? 'text-toyfight-yellow' : 'text-toyfight-cream/30'} />
                                        <div className="text-center">
                                            <p className="font-mono font-bold text-toyfight-cream uppercase tracking-widest">
                                                Drop Resume Here
                                            </p>
                                            <p className="font-mono text-xs text-toyfight-cream/40 mt-1">
                                                PDF, DOCX, or TXT — AI will read the actual content
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className="mt-4 flex gap-3">
                                <button
                                    onClick={handleAnalyzeUpload}
                                    disabled={isAnalyzing || !uploadedFile}
                                    className="flex items-center gap-3 px-6 py-3 bg-toyfight-yellow text-black font-mono font-bold uppercase tracking-wider hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-1 justify-center"
                                >
                                    {isAnalyzing ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
                                    {isAnalyzing ? 'Analyzing Resume...' : 'Analyze Uploaded Resume'}
                                </button>
                                <button
                                    onClick={handleAiAnalysis}
                                    disabled={isAnalyzing}
                                    title="Screen using profile info only (no resume)"
                                    className="flex items-center gap-2 px-4 py-3 border border-toyfight-cream/30 text-toyfight-cream/50 font-mono text-xs uppercase tracking-wider hover:border-toyfight-cream hover:text-toyfight-cream transition-colors disabled:opacity-30"
                                >
                                    <Bot size={16} />
                                    Profile Only
                                </button>
                            </div>
                        </div>

                        {/* AI Analysis Result */}
                        {(analysisResult || isAnalyzing) && (
                            <div className="mb-8 p-1 border-2 border-toyfight-yellow bg-toyfight-yellow/5">
                                <div className="p-6 border border-toyfight-yellow/20">
                                    <h3 className="text-toyfight-yellow font-mono text-lg uppercase tracking-widest mb-2 flex items-center gap-3 border-b border-toyfight-yellow/20 pb-4">
                                        <Sparkles size={20} /> AI Suitability Report
                                    </h3>
                                    <div className="mb-6 font-mono text-[10px] text-toyfight-yellow/60 uppercase tracking-widest">
                                        Screening against: <span className="text-toyfight-cream">{getMatchingJob()?.title || 'Unknown Job'}</span>
                                    </div>

                                    {isAnalyzing ? (
                                        <div className="py-12 text-center text-toyfight-cream font-mono animate-pulse flex flex-col items-center gap-4">
                                            <Loader2 size={40} className="animate-spin text-toyfight-yellow" />
                                            <p className="uppercase tracking-widest text-sm">Processing Neural Analysis...</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-8">
                                            <div className="flex items-center gap-6">
                                                <div className="flex-1 h-6 bg-black/50 border border-toyfight-cream/20">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${analysisResult?.score}%` }}
                                                        className={`h-full ${(analysisResult?.score || 0) > 80 ? 'bg-toyfight-yellow' :
                                                            (analysisResult?.score || 0) > 50 ? 'bg-white' : 'bg-red-500'
                                                            }`}
                                                    />
                                                </div>
                                                <span className="text-5xl font-header font-bold text-toyfight-yellow w-24 text-right">
                                                    {analysisResult?.score}<span className="text-2xl text-toyfight-cream/50">%</span>
                                                </span>
                                            </div>

                                            <div className="font-mono text-sm leading-relaxed text-toyfight-cream/80 p-6 bg-black/20 border-l-4 border-toyfight-yellow">
                                                {analysisResult?.feedback}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <h3 className="text-toyfight-cream/50 font-mono text-xs uppercase tracking-widest border-b border-toyfight-cream/10 pb-2">
                                    Contact
                                </h3>
                                <div className="space-y-4 font-mono text-sm">
                                    <div className="flex items-center gap-4 text-toyfight-cream group">
                                        <Mail size={16} className="text-toyfight-yellow" />
                                        <span className="group-hover:text-toyfight-yellow transition-colors cursor-default">
                                            {candidate.email || 'No email provided'}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-toyfight-cream">
                                        <Briefcase size={16} className="text-toyfight-yellow" />
                                        <span>Applied for {candidate.role}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-toyfight-cream/50 font-mono text-xs uppercase tracking-widest border-b border-toyfight-cream/10 pb-2">
                                    Status
                                </h3>
                                <span className={`inline-block font-mono text-sm uppercase tracking-widest px-4 py-2 border ${candidate.status === 'Hired' ? 'border-green-500 text-green-400' :
                                    candidate.status === 'Rejected' ? 'border-red-500 text-red-400' :
                                        'border-toyfight-cream/30 text-toyfight-cream'
                                    }`}>
                                    {candidate.status}
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default CandidateDetailsModal;
