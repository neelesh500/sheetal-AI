import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

export default function VoiceCommand() {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");

    const toggleListening = () => {
        setIsListening(!isListening);
        if (!isListening) {
            setTranscript("Listening for vocal instructions...");
            setTimeout(() => {
                setTranscript("Processing spatial data analysis query...");
            }, 3000);
        } else {
            setTranscript("");
        }
    };

    return (
        <div className="page-container container">
            <div className="section-header">
                <h2>Voice Command Core</h2>
                <div className="pulse-dot"></div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <button
                        onClick={toggleListening}
                        className="btn"
                        style={{
                            padding: '2rem',
                            borderRadius: '50%',
                            background: isListening ? 'rgba(244, 63, 94, 0.2)' : 'rgba(6, 182, 212, 0.2)',
                            border: `2px solid ${isListening ? 'var(--accent-rose)' : 'var(--accent-cyan)'}`,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto',
                            animation: isListening ? 'pulse 1.5s infinite' : 'none'
                        }}
                    >
                        {isListening ? <MicOff size={48} color="var(--accent-rose)" /> : <Mic size={48} color="var(--accent-cyan)" />}
                    </button>
                    {isListening && (
                        <style>{`
                            @keyframes pulse {
                                0% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0.7); }
                                70% { box-shadow: 0 0 0 20px rgba(244, 63, 94, 0); }
                                100% { box-shadow: 0 0 0 0 rgba(244, 63, 94, 0); }
                            }
                        `}</style>
                    )}
                </div>

                <h3 style={{ color: 'var(--text-main)', minHeight: '3rem' }}>
                    {transcript || "Click the microphone to begin..."}
                </h3>

                <div className="concept-card glass-panel" style={{ marginTop: '2rem', textAlign: 'left' }}>
                    <h4 style={{ color: 'var(--accent-cyan)', marginBottom: '1rem' }}>Suggested Commands:</h4>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <li><span className="source-tag">"Show thermal map for New Delhi"</span></li>
                        <li><span className="source-tag">"Deploy XGBoost model on current data"</span></li>
                        <li><span className="source-tag">"Generate impact matrix report"</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
