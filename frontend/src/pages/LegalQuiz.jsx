import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, CheckCircle, XCircle, ArrowRight, BookOpen, Star, Lock, Unlock, Download } from 'lucide-react';
import { quizLevels } from '../data/quizData';
import { Link } from 'react-router-dom';

function LegalQuiz() {
    // --- States ---
    const [unlockedLevel, setUnlockedLevel] = useState(1); // 1 to 5
    const [currentLevel, setCurrentLevel] = useState(null); // null means in menu

    // Game state
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [currentLevelScore, setCurrentLevelScore] = useState(0);
    const [levelComplete, setLevelComplete] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);

    // Certificate state
    const [userName, setUserName] = useState('');
    const canvasRef = useRef(null);

    const [isCertificateGenerated, setIsCertificateGenerated] = useState(false);

    // Load progress
    useEffect(() => {
        const savedLevel = localStorage.getItem('kanoonu_quiz_level');
        if (savedLevel) {
            setUnlockedLevel(parseInt(savedLevel));
        }
    }, []);

    // Save progress
    const saveProgress = (level) => {
        localStorage.setItem('kanoonu_quiz_level', level);
        setUnlockedLevel(level);
    };

    // --- Handlers ---
    const handleLevelSelect = (levelIndex) => {
        const level = levelIndex + 1;
        if (level <= unlockedLevel) {
            setCurrentLevel(level);
            setCurrentQuestionIndex(0);
            setScore(0);
            setSelectedOption(null);
            setIsCorrect(null);
            setLevelComplete(false);
            setShowCertificate(false);
            setIsCertificateGenerated(false);
        }
    };

    // Helper to get score setter wrapper
    const setScore = (val) => setCurrentLevelScore(val);

    const activeQuestions = currentLevel ? quizLevels[currentLevel - 1].questions : [];
    const activeLevelData = currentLevel ? quizLevels[currentLevel - 1] : null;

    const handleOptionClick = (index) => {
        if (selectedOption !== null) return;
        setSelectedOption(index);
        const correct = index === activeQuestions[currentQuestionIndex].correctIndex;
        setIsCorrect(correct);
        if (correct) {
            setScore(currentLevelScore + 1);
        }
    };

    const handleNext = () => {
        // Reset for next question
        setSelectedOption(null);
        setIsCorrect(null);

        if (currentQuestionIndex < activeQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        } else {
            // Level Finished
            setLevelComplete(true);
            if (currentLevel === unlockedLevel && currentLevel < 5) {
                saveProgress(unlockedLevel + 1);
            }
        }
    };

    const handleBackToMenu = () => {
        setCurrentLevel(null);
        setLevelComplete(false);
        setShowCertificate(false);
        setIsCertificateGenerated(false);
    };

    const generateCertificate = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        canvas.width = 1000;
        canvas.height = 700;

        // Background
        const gradient = ctx.createLinearGradient(0, 0, 1000, 700);
        gradient.addColorStop(0, "#fdfbf7");
        gradient.addColorStop(1, "#fff");
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 1000, 700);

        // Border
        ctx.strokeStyle = "#d97706"; // Amber 600
        ctx.lineWidth = 20;
        ctx.strokeRect(40, 40, 920, 620);
        ctx.strokeStyle = "#b45309"; // Amber 700
        ctx.lineWidth = 5;
        ctx.strokeRect(65, 65, 870, 570);

        // Text Config
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic'; // Reset baseline

        // Header
        ctx.fillStyle = "#92400e";
        ctx.font = "bold 60px Serif";
        ctx.fillText("Certificate of Completion", 500, 150);

        // Subtext
        ctx.fillStyle = "#4b5563";
        ctx.font = "30px Sans-serif";
        ctx.fillText("This is to certify that", 500, 240);

        // Name
        ctx.fillStyle = "#d97706";
        ctx.font = "bold italic 70px Serif";
        ctx.fillText(userName, 500, 340);

        // Line under name
        ctx.beginPath();
        ctx.moveTo(300, 360);
        ctx.lineTo(700, 360);
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Body
        ctx.fillStyle = "#374151";
        ctx.font = "25px Sans-serif";
        ctx.fillText("Has successfully completed the", 500, 430);
        ctx.font = "bold 35px Sans-serif";
        ctx.fillText("Kanoonu AI Legal Awareness Course", 500, 480);

        // Date
        const dateStr = new Date().toLocaleDateString();
        ctx.font = "20px Sans-serif";
        ctx.fillStyle = "#6b7280";
        ctx.fillText(`Issued on: ${dateStr}`, 500, 550);

        // Seal (Simple circle representation)
        ctx.beginPath();
        ctx.arc(500, 620, 40, 0, 2 * Math.PI);
        ctx.fillStyle = "#fcd34d"; // Amber 300
        ctx.fill();
        ctx.strokeStyle = "#d97706";
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = "#92400e";
        ctx.font = "bold 16px Sans-serif";
        ctx.fillText("KANOONU", 500, 625);
    };

    const handleDownloadCertificate = () => {
        const canvas = canvasRef.current;
        const link = document.createElement('a');
        link.download = `Kanoonu_Certificate_${userName.replace(/\s+/g, '_')}.png`;
        link.href = canvas.toDataURL();
        link.click();
    };

    useEffect(() => {
        if (showCertificate && isCertificateGenerated && canvasRef.current) {
            generateCertificate();
        }
    }, [showCertificate, isCertificateGenerated]);

    // --- Render Views ---

    // 1. Certificate View
    if (showCertificate) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-8 rounded-2xl shadow-2xl max-w-2xl w-full text-center"
                >
                    <h2 className="text-3xl font-bold text-amber-800 mb-6">🎉 Congratulations!</h2>
                    <p className="mb-6 text-gray-600">You have improved your legal awareness significantly.</p>

                    {!isCertificateGenerated ? (
                        <div className="space-y-4">
                            <label className="block text-left text-sm font-medium text-gray-700">Enter your full name for the certificate</label>
                            <input
                                type="text"
                                placeholder="e.g. Rahul Sharma"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                            <button
                                disabled={!userName.trim()}
                                onClick={() => setIsCertificateGenerated(true)}
                                className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
                            >
                                Generate Certificate
                            </button>
                            <button
                                onClick={handleBackToMenu}
                                className="text-gray-500 text-sm hover:underline mt-2"
                            >
                                Skip & Back to Menu
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="border shadow-lg mb-6 overflow-hidden max-w-full">
                                <canvas ref={canvasRef} className="max-w-full h-auto" style={{ maxHeight: '400px' }}></canvas>
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={handleDownloadCertificate}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-lg shadow-md transition-all"
                                >
                                    <Download className="w-5 h-5" /> Download
                                </button>
                                <button
                                    onClick={handleBackToMenu}
                                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg transition-all"
                                >
                                    Back to Menu
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        );
    }

    // 2. Main Menu (Level Select)
    if (!currentLevel) {
        return (
            <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h1 className="text-4xl font-bold text-slate-900 mb-2">Legal Skills Roadmap</h1>
                            <p className="text-slate-500">Complete all levels to earn your certificate.</p>
                        </div>
                        <Link to="/" className="text-slate-500 hover:text-amber-600 bg-white px-4 py-2 rounded-lg shadow-sm font-medium text-sm">
                            Back to Home
                        </Link>
                    </div>

                    <div className="space-y-6">
                        {quizLevels.map((levelData, index) => {
                            const isUnlocked = index + 1 <= unlockedLevel;
                            const isCompleted = index + 1 < unlockedLevel; // If level 2 is unlocked, level 1 is done
                            const isFinal = index === 4;

                            return (
                                <motion.button
                                    key={levelData.level}
                                    disabled={!isUnlocked}
                                    onClick={() => handleLevelSelect(index)}
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={isUnlocked ? { scale: 1.02, x: 10 } : {}}
                                    whileTap={isUnlocked ? { scale: 0.98 } : {}}
                                    className={`w-full text-left p-6 rounded-2xl flex items-center gap-6 border-2 transition-all relative overflow-hidden
                                ${isUnlocked
                                            ? 'bg-white border-amber-200 shadow-md hover:shadow-lg hover:border-amber-400 cursor-pointer'
                                            : 'bg-slate-100 border-slate-200 opacity-70 cursor-not-allowed'}`}
                                >
                                    {/* Level Number / Icon */}
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold shrink-0
                                ${isCompleted ? 'bg-green-100 text-green-600' :
                                            isUnlocked ? 'bg-amber-100 text-amber-600' : 'bg-slate-200 text-slate-400'}`}>
                                        {isCompleted ? <CheckCircle className="w-8 h-8" /> :
                                            !isUnlocked ? <Lock className="w-6 h-6" /> : levelData.level}
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={`text-xl font-bold mb-1 ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                                            {levelData.title}
                                        </h3>
                                        <p className={`text-sm ${isUnlocked ? 'text-slate-600' : 'text-slate-400'}`}>
                                            {levelData.description}
                                        </p>
                                    </div>

                                    {/* Status Indicator */}
                                    {isUnlocked && (
                                        <div className="bg-amber-50 rounded-full p-2">
                                            {isCompleted ? <Star className="w-6 h-6 text-amber-400 fill-current" /> : <Unlock className="w-6 h-6 text-amber-400" />}
                                        </div>
                                    )}
                                </motion.button>
                            );
                        })}
                    </div>

                    {unlockedLevel > 5 && (
                        <div className="mt-8 text-center">
                            <p className="text-green-600 font-bold mb-4">Mastery Achieved!</p>
                            <button
                                onClick={() => setShowCertificate(true)}
                                className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 mx-auto"
                            >
                                <Trophy className="w-5 h-5" /> View Certificate
                            </button>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // 3. Level Complete Modal
    if (levelComplete) {
        const isFinalLevel = currentLevel === 5;

        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-amber-100"
                >
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Trophy className="w-10 h-10 text-green-600" />
                    </div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Level {currentLevel} Complete!</h2>
                    <p className="text-slate-500 mb-8">
                        You scored <span className="font-bold text-amber-600">{currentLevelScore}</span> out of {activeQuestions.length}
                    </p>

                    {isFinalLevel ? (
                        <button
                            onClick={() => setShowCertificate(true)}
                            className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-transform transform hover:-translate-y-1"
                        >
                            Claim Certificate 🎓
                        </button>
                    ) : (
                        <button
                            onClick={handleBackToMenu}
                            className="w-full py-4 bg-indigo-600 text-white text-lg font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-all"
                        >
                            Continue to Level {currentLevel + 1}
                        </button>
                    )}
                </motion.div>
            </div>
        );
    }

    // 4. Quiz Gameplay View
    const currentQ = activeQuestions[currentQuestionIndex];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-amber-50 py-8 px-4 flex flex-col items-center">
            {/* Top Bar */}
            <div className="w-full max-w-2xl flex justify-between items-center mb-8">
                <button onClick={handleBackToMenu} className="text-slate-400 hover:text-slate-600 font-medium text-sm">
                    ← Exit Level
                </button>
                <div className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1 rounded-full uppercase tracking-widest">
                    Level {currentLevel}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full max-w-2xl h-1.5 bg-slate-200 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-amber-500"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestionIndex) / activeQuestions.length) * 100}%` }}
                />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQ.id}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden"
                >
                    <div className="p-8 md:p-10">
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mb-8 leading-relaxed">
                            {currentQ.question}
                        </h2>

                        <div className="space-y-3">
                            {currentQ.options.map((opt, idx) => {
                                const isSelected = selectedOption === idx;
                                const isCorrectOption = idx === currentQ.correctIndex;

                                let styles = "border-slate-200 hover:bg-slate-50";
                                if (selectedOption !== null) {
                                    if (isCorrectOption) styles = "border-green-500 bg-green-50 text-green-700 font-medium";
                                    else if (isSelected) styles = "border-red-500 bg-red-50 text-red-700";
                                    else styles = "border-slate-100 text-slate-400";
                                }

                                return (
                                    <button
                                        key={idx}
                                        onClick={() => handleOptionClick(idx)}
                                        disabled={selectedOption !== null}
                                        className={`w-full text-left p-4 rounded-xl border-2 transition-all ${styles} flex justify-between items-center`}
                                    >
                                        {opt}
                                        {selectedOption !== null && isCorrectOption && <CheckCircle className="w-5 h-5 text-green-600" />}
                                        {selectedOption !== null && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-red-600" />}
                                    </button>
                                );
                            })}
                        </div>

                        {selectedOption !== null && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="mt-6 pt-6 border-t border-slate-100"
                            >
                                <div className="bg-slate-50 p-4 rounded-xl text-sm text-slate-600 mb-6 flex gap-3">
                                    <BookOpen className="w-5 h-5 shrink-0 text-amber-500" />
                                    <p>{currentQ.explanation}</p>
                                </div>
                                <button
                                    onClick={handleNext}
                                    className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                                >
                                    Next Question <ArrowRight className="w-4 h-4" />
                                </button>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default LegalQuiz;
