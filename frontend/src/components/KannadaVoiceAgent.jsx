import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, RotateCcw, Volume2 } from 'lucide-react';

const KannadaVoiceAgent = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState('idle'); // idle, greeting, listening, processing, speaking, finished
    const [messages, setMessages] = useState([]); // Array of { sender: 'agent'|'user', text: string }
    const [showReplay, setShowReplay] = useState(false);

    const recognitionRef = useRef(null);
    const audioRef = useRef(new Audio());

    const [processing, setProcessing] = useState(false);

    const [selectedLanguage, setSelectedLanguage] = useState(null); // 'kn' or 'hi'

    // Responses
    const responses = {
        kn: {
            greeting: {
                text: "ನಮಸ್ತೆ, ನಾನು ನಿಮ್ಮ ಸಹಾಯಕ. ಲಾಯರ್ ಬುಕ್ ಮಾಡಲು 'Lawyer Book' ಎಂದು ಹೇಳಿ.",
                fallbackText: "Namaste, naanu nimma sahayaka. Lawyer book maadalu 'Lawyer Book' endu heli.",
                audio: "/audio/kannada_greeting.mp3"
            },
            steps: {
                text: "ಲಾಯರ್ ಬುಕ್ ಮಾಡಲು: 1. 'Find Lawyers' ಕ್ಲಿಕ್ ಮಾಡಿ. 2. ಲಾಯರ್ ಆಯ್ಕೆ ಮಾಡಿ. 3. 'Book Consultation' ಒತ್ತಿ.",
                fallbackText: "Lawyer book maadalu: 1. 'Find Lawyers' click maadi. 2. Lawyer aayke maadi. 3. 'Book Consultation' otti."
            }
        },
        hi: {
            greeting: {
                text: "नमस्कार, आपको कोई मदद चाहिए तो मैं कर सकता हूँ।",
                fallbackText: "Namaskar, aapko koi madad chaiye toh mai kar sakhtha hu."
            }
        }
    };

    useEffect(() => {
        // Initialize Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            // Dynamic lang based on selection, default to KN
            recognitionRef.current.lang = selectedLanguage === 'hi' ? 'hi-IN' : 'kn-IN';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript.toLowerCase();
                console.log("Recognized:", transcript);
                handleUserSpeech(transcript);
            };

            recognitionRef.current.onerror = (event) => {
                if (mode === 'listening') setMode('idle');
            };
        }
    }, [mode, selectedLanguage]);

    const playAudio = (src, onEnd, textToSpeakIfFailed, langCode = 'en-IN') => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current = new Audio(src);
            audioRef.current.onended = onEnd;
            audioRef.current.play().catch(e => {
                console.error("Audio play failed, switching to System Voice:", e);
                if (textToSpeakIfFailed) {
                    const utterance = new SpeechSynthesisUtterance(textToSpeakIfFailed);
                    utterance.lang = langCode;
                    utterance.onend = onEnd;
                    window.speechSynthesis.speak(utterance);
                }
            });
        }
    };

    const playTTS = async (textItem, onEnd, lang = 'kn') => {
        const text = typeof textItem === 'object' ? textItem.text : textItem;
        const fallback = typeof textItem === 'object' ? textItem.fallbackText : textItem;
        const langCode = lang === 'hi' ? 'hi' : 'kn';
        const systemLang = lang === 'hi' ? 'hi-IN' : 'en-IN'; // Hindi uses native system voice, Kannada uses Romanized English fallback

        console.log(`TTS Request (${lang}):`, text);

        // Google TTS
        const encoded = encodeURIComponent(text);
        const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=gtx&tl=${langCode}&q=${encoded}`;
        playAudio(url, onEnd, fallback, systemLang);
    };

    const startInteraction = () => {
        if (mode !== 'idle' && mode !== 'language_select') return;

        window.speechSynthesis.cancel();
        setIsOpen(true);
        setMode('language_select');
        setMessages([]);
        setShowReplay(false);
        setProcessing(false);
        setSelectedLanguage(null);
    };

    const handleLanguageSelect = (lang) => {
        setSelectedLanguage(lang);
        setMode('greeting');

        if (lang === 'kn') {
            playAudio(responses.kn.greeting.audio, () => {
                startListening();
            }, responses.kn.greeting.fallbackText, 'en-IN');
        } else {
            // Hindi Flow
            const greeting = responses.hi.greeting;
            setMessages([{ sender: 'assistant', text: greeting.text, fallback: greeting.fallbackText }]);
            playTTS(greeting, () => {
                setMode('finished'); // Ends after greeting as per request
                setShowReplay(true);
            }, 'hi');
        }
    };

    const startListening = () => {
        setMode('listening');
        try { recognitionRef.current.start(); } catch (e) { }
    };

    const handleUserSpeech = (text) => {
        if (processing) return;

        // Only process for Kannada as Hindi flow ends at greeting (per user request)
        if (selectedLanguage === 'kn') {
            const keywords = ['lawyer', 'book', 'consultancy', 'ಲಾಯರ್', 'ಬುಕ್', 'ಮಾಡು'];
            if (keywords.some(k => text.includes(k)) || text.length > 3) {
                setProcessing(true);
                setMode('processing');
                setMessages(prev => [...prev, { sender: 'user', text }]);
                provideGuidance();
            }
        }
    };

    const provideGuidance = () => {
        setMode('speaking');
        const stepData = responses.kn.steps;

        setMessages(prev => [...prev, {
            sender: 'assistant',
            text: stepData.text,
            fallback: stepData.fallbackText
        }]);

        playTTS(stepData, () => {
            setMode('finished');
            setShowReplay(true);
            setProcessing(false);
        }, 'kn');
    };

    const handleReplay = () => {
        // Replay logic depends on the selected language and current mode
        if (selectedLanguage === 'kn' && mode === 'finished') {
            provideGuidance();
        } else if (selectedLanguage === 'hi' && mode === 'finished') {
            const greeting = responses.hi.greeting;
            playTTS(greeting, () => { }, 'hi');
        }
    };

    return (
        <div className="fixed bottom-32 right-8 z-50 flex flex-col items-end gap-4 pointer-events-none">
            {/* Chat Bubble Interface */}
            <AnimatePresence>
                {(isOpen || messages.length > 0) && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-4 w-72 mb-2 border border-rose-100 max-h-96 overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-3">
                            <span className="font-bold text-rose-600 flex items-center gap-2">
                                <Bot size={18} /> Kannada Agent
                            </span>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X size={16} />
                            </button>
                        </div>


                        <div className="space-y-3 text-sm">
                            {mode === 'language_select' && (
                                <div className="flex flex-col gap-3 py-2">
                                    <p className="text-gray-600 font-medium text-center">Choose your language</p>
                                    <div className="flex gap-2 justify-center">
                                        <button
                                            onClick={() => handleLanguageSelect('kn')}
                                            className="px-4 py-2 bg-rose-50 text-rose-700 rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors font-bold"
                                        >
                                            ಕನ್ನಡ
                                        </button>
                                        <button
                                            onClick={() => handleLanguageSelect('hi')}
                                            className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg border border-orange-200 hover:bg-orange-100 transition-colors font-bold"
                                        >
                                            हिंदी
                                        </button>
                                    </div>
                                </div>
                            )}

                            {messages.map((msg, idx) => (
                                <div key={idx} className={`flex w-full ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`p-2 rounded-xl max-w-[85%] relative group flex items-end gap-2 ${msg.sender === 'user'
                                        ? 'bg-rose-500 text-white rounded-tr-none'
                                        : 'bg-gray-100 text-gray-800 rounded-tl-none'
                                        }`}>

                                        <div>{msg.text}</div>

                                        {/* Audio Replay Icon for Agent Messages */}
                                        {msg.sender === 'assistant' && (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    console.log("Replay Triggered (with fallback):", msg.fallback ? "Yes" : "No");
                                                    // Pass both text and fallback to playTTS
                                                    playTTS({
                                                        text: msg.text,
                                                        fallbackText: msg.fallback || msg.text
                                                    }, () => console.log("Replay finished"));
                                                }}
                                                className="p-1.5 rounded-full bg-rose-100 hover:bg-rose-200 text-rose-600 transition-colors ml-2 shadow-sm border border-rose-200 active:scale-90"
                                                aria-label="Play message audio"
                                                title="Replay Audio"
                                            >
                                                <Volume2 size={14} strokeWidth={2.5} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {mode === 'listening' && (
                                <div className="flex items-center gap-1 mt-2 justify-center">
                                    <span className="text-xs text-gray-500">Listening</span>
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-2 h-2 bg-rose-500 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                                        className="w-2 h-2 bg-rose-500 rounded-full"
                                    />
                                    <motion.div
                                        animate={{ scale: [1, 1.5, 1] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                                        className="w-2 h-2 bg-rose-500 rounded-full"
                                    />
                                </div>
                            )}
                        </div>

                        {showReplay && (
                            <button
                                onClick={handleReplay}
                                className="mt-4 w-full py-2 flex items-center justify-center gap-2 bg-rose-100 text-rose-700 rounded-lg hover:bg-rose-200 transition-colors text-sm font-medium"
                            >
                                <RotateCcw size={16} />
                                Replay Instructions
                            </button>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Trigger Button */}
            <div className="pointer-events-auto relative">
                {/* Blinking Dots Indicator (Floating above button) */}
                {mode === 'listening' && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-1 z-20">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ opacity: [0.2, 1, 0.2], scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)] border border-white"
                            />
                        ))}
                    </div>
                )}

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={startInteraction}
                    className={`h-14 w-14 rounded-full flex items-center justify-center shadow-lg border border-white/20 relative overflow-hidden transition-all duration-300 ${mode === 'listening'
                        ? 'bg-rose-600 shadow-[0_0_30px_rgba(225,29,72,0.6)]'
                        : 'bg-gradient-to-br from-rose-500 to-orange-600'
                        }`}
                >
                    <motion.div
                        className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
                        style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)' }}
                    />

                    {/* Pulsing effect when listening */}
                    {mode === 'listening' && (
                        <motion.div
                            animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="absolute inset-0 rounded-full bg-white/30"
                        />
                    )}

                    <Bot className="h-7 w-7 text-white relative z-10" />
                </motion.button>
            </div>
        </div>
    );
};

export default KannadaVoiceAgent;
