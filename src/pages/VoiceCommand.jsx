import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Navigation, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedPage from '../components/AnimatedPage';

const COMMANDS = [
    { phrase: ['heat map', 'thermal map', 'heat', 'hotspot', 'hotspots'], label: '"Show heat map"', path: '/mapping', desc: 'Opens Geospatial Thermal Mapping' },
    { phrase: ['predict', 'prediction', 'ai prediction', 'model', 'cooling'], label: '"Run AI prediction"', path: '/prediction', desc: 'Opens AI Cooling Prediction Engine' },
    { phrase: ['satellite', 'satellite feed', 'satellite catalog'], label: '"Show satellite feeds"', path: '/satellite', desc: 'Opens Satellite Thermal Catalog' },
    { phrase: ['simulate', 'simulator', 'intervention', 'scenario'], label: '"Simulate interventions"', path: '/simulator', desc: 'Opens Intervention Simulator' },
    { phrase: ['dataset', 'data', 'catalog', 'records'], label: '"Show dataset catalog"', path: '/datasets', desc: 'Opens Dataset Provenance Catalog' },
    { phrase: ['analysis', 'driver', 'feature', 'analytics'], label: '"Driver analysis"', path: '/analytics', desc: 'Opens Feature Driver Analysis' },
    { phrase: ['methodology', 'docs', 'documentation', 'method'], label: '"Show methodology"', path: '/docs', desc: 'Opens Scientific Methodology' },
    { phrase: ['mitigation', 'cooling strategy', 'strategy'], label: '"Mitigation plan"', path: '/mitigation', desc: 'Opens Cooling Strategies' },
    { phrase: ['home', 'dashboard', 'globe', 'earth'], label: '"Go home"', path: '/', desc: 'Returns to 3D Globe Dashboard' },
    { phrase: ['model registry', 'ml model', 'random forest', 'ml'], label: '"Show ML models"', path: '/ml-models', desc: 'Opens ML Model Registry' },
];

export default function VoiceCommand() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [history, setHistory] = useState([]);
    const [supported, setSupported] = useState(true);
    const [navigatingTo, setNavigatingTo] = useState(null);
    const navigate = useNavigate();
    const recognitionRef = useRef(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setSupported(false);
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript('');
            setNavigatingTo(null);
        };

        recognition.onresult = (event) => {
            let interim = '';
            let final = '';
            for (let i = event.resultIndex; i < event.results.length; i++) {
                const text = event.results[i][0].transcript;
                if (event.results[i].isFinal) final += text;
                else interim += text;
            }
            setTranscript(final || interim);

            if (final) {
                const lower = final.toLowerCase().trim();
                let matched = false;
                for (const cmd of COMMANDS) {
                    if (cmd.phrase.some(p => lower.includes(p))) {
                        setNavigatingTo(cmd.desc);
                        setHistory(prev => [{
                            text: final,
                            action: cmd.desc,
                            path: cmd.path,
                            time: new Date().toLocaleTimeString()
                        }, ...prev.slice(0, 7)]);
                        setTimeout(() => navigate(cmd.path), 1800);
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    setHistory(prev => [{
                        text: final,
                        action: 'No route matched',
                        path: null,
                        time: new Date().toLocaleTimeString()
                    }, ...prev.slice(0, 7)]);
                }
            }
        };

        recognition.onerror = (event) => {
            setIsListening(false);
            if (event.error === 'not-allowed') {
                setTranscript('Microphone access denied. Please allow microphone permissions in browser settings.');
            } else {
                setTranscript(`Error: ${event.error}. Please try again.`);
            }
        };

        recognition.onend = () => setIsListening(false);
        recognitionRef.current = recognition;
    }, [navigate]);

    const toggleListening = () => {
        if (!isListening) {
            recognitionRef.current?.start();
        } else {
            recognitionRef.current?.stop();
        }
    };

    return (
        <AnimatedPage>
            <div style={{ maxWidth: '960px', margin: '0 auto', padding: '2rem 1.5rem' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginBottom: '2rem' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <Volume2 size={26} style={{ color: 'var(--accent-cyan)' }} />
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700, color: '#f8fafc' }}>
                            Voice Command Accessibility
                        </h2>
                    </div>
                    <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem', maxWidth: '700px' }}>
                        Navigate the entire SHEETAL.AI platform using spoken voice commands. Uses the browser-native Web Speech API — no external service or internet required for recognition.
                    </p>
                </motion.div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
                    {/* Microphone Panel */}
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                    >
                        {!supported ? (
                            <div style={{ textAlign: 'center', color: '#f43f5e' }}>
                                <MicOff size={48} style={{ marginBottom: '1rem', opacity: 0.7 }} />
                                <p style={{ fontWeight: 600 }}>Speech Recognition Not Supported</p>
                                <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                                    Use Google Chrome or Microsoft Edge for voice support.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Mic Button */}
                                <div style={{ position: 'relative' }}>
                                    {isListening && (
                                        <>
                                            {[1, 2, 3].map(i => (
                                                <motion.div
                                                    key={i}
                                                    style={{
                                                        position: 'absolute',
                                                        inset: 0,
                                                        borderRadius: '50%',
                                                        border: '2px solid rgba(244, 63, 94, 0.5)',
                                                    }}
                                                    animate={{ scale: 1 + i * 0.4, opacity: 0 }}
                                                    transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}
                                                />
                                            ))}
                                        </>
                                    )}
                                    <button
                                        onClick={toggleListening}
                                        style={{
                                            width: 100,
                                            height: 100,
                                            borderRadius: '50%',
                                            background: isListening
                                                ? 'radial-gradient(circle, rgba(244,63,94,0.3), rgba(244,63,94,0.1))'
                                                : 'radial-gradient(circle, rgba(6,182,212,0.2), rgba(6,182,212,0.05))',
                                            border: `3px solid ${isListening ? '#f43f5e' : 'var(--accent-cyan)'}`,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.3s ease',
                                            position: 'relative',
                                            zIndex: 1,
                                        }}
                                    >
                                        {isListening
                                            ? <MicOff size={40} color="#f43f5e" />
                                            : <Mic size={40} color="var(--accent-cyan)" />
                                        }
                                    </button>
                                </div>

                                {/* Status */}
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{
                                        fontWeight: 700,
                                        fontSize: '1rem',
                                        color: isListening ? '#f43f5e' : '#f8fafc',
                                        marginBottom: '0.35rem'
                                    }}>
                                        {isListening ? '🔴 Listening...' : '🎙️ Click to Speak'}
                                    </div>
                                    <AnimatePresence mode="wait">
                                        {transcript && (
                                            <motion.div
                                                key={transcript}
                                                initial={{ opacity: 0, y: 5 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0 }}
                                                style={{
                                                    background: 'rgba(255,255,255,0.05)',
                                                    border: '1px solid rgba(255,255,255,0.1)',
                                                    borderRadius: '8px',
                                                    padding: '0.6rem 1rem',
                                                    fontSize: '0.9rem',
                                                    color: 'var(--accent-cyan)',
                                                    fontStyle: 'italic',
                                                    maxWidth: '280px',
                                                    margin: '0 auto'
                                                }}
                                            >
                                                "{transcript}"
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {navigatingTo && (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            style={{ fontSize: '0.82rem', color: 'var(--accent-emerald)', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                                        >
                                            <Navigation size={12} /> Navigating to: {navigatingTo}
                                        </motion.div>
                                    )}
                                </div>
                            </>
                        )}
                    </motion.div>

                    {/* Commands Reference */}
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '1.5rem' }}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h4 style={{ margin: '0 0 1rem', color: 'var(--accent-cyan)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ChevronRight size={14} /> Available Commands
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                            {COMMANDS.map((cmd, i) => (
                                <motion.div
                                    key={i}
                                    onClick={() => navigate(cmd.path)}
                                    initial={{ opacity: 0, x: 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.05 * i + 0.2 }}
                                    style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        padding: '0.6rem 0.85rem',
                                        background: 'rgba(255,255,255,0.03)',
                                        borderRadius: '6px',
                                        border: '1px solid rgba(255,255,255,0.05)',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s ease',
                                    }}
                                    whileHover={{ background: 'rgba(6, 182, 212, 0.08)', borderColor: 'rgba(6,182,212,0.3)' }}
                                >
                                    <div>
                                        <div style={{ fontSize: '0.82rem', color: '#e2e8f0', fontWeight: 600 }}>{cmd.label}</div>
                                        <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '1px' }}>{cmd.desc}</div>
                                    </div>
                                    <ChevronRight size={14} style={{ color: '#475569', flexShrink: 0 }} />
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Command History */}
                {history.length > 0 && (
                    <motion.div
                        className="glass-panel"
                        style={{ padding: '1.5rem', marginTop: '1.5rem' }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    >
                        <h4 style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={14} style={{ color: '#94a3b8' }} /> Recent Commands
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {history.map((h, i) => (
                                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.82rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                                    <div>
                                        <span style={{ color: 'var(--accent-cyan)', fontStyle: 'italic' }}>"{h.text}"</span>
                                        <span style={{ color: '#64748b', marginLeft: '8px' }}>→ {h.action}</span>
                                    </div>
                                    <span style={{ color: '#475569', fontSize: '0.72rem' }}>{h.time}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </AnimatedPage>
    );
}
