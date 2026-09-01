import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Video, VideoOff, Mic, MicOff, PhoneOff, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

function VideoCall() {
  const { language, t } = useLanguage();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const lawyerId = searchParams.get('lawyerId');
  const lawyerName = searchParams.get('lawyerName') || 'AI Lawyer';
  const userName = searchParams.get('userName') || '';
  const lawyerLanguage = searchParams.get('lawyerLanguage') || 'english'; // Get lawyer's language
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [hasGreeted, setHasGreeted] = useState(false);
  const [hasReceivedQuery, setHasReceivedQuery] = useState(false);
  
  const localVideoRef = useRef(null);
  const streamRef = useRef(null);
  const recognitionRef = useRef(null);
  const speakingIntervalRef = useRef(null);
  const restartTimeoutRef = useRef(null);
  const silenceTimeoutRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Keep continuous
    recognition.interimResults = true; // Show interim results
    // Use lawyer's language for speech recognition
    recognition.lang = lawyerLanguage === 'kannada' ? 'kn-IN' : (language || 'en-IN');
    recognition.maxAlternatives = 1;
    recognition.serviceURI = undefined; // Use default service
    
    let isProcessing = false; // Flag to prevent multiple simultaneous processing
    let hasReceivedAnyResult = false; // Track if we've received any results
    
    recognition.onstart = () => {
      setIsListening(true);
      hasReceivedAnyResult = false;
      console.log('✅ Speech recognition started - listening for speech...');
    };

    recognition.onaudiostart = () => {
      console.log('🎤 Audio capture started');
    };

    recognition.onaudioend = () => {
      console.log('🎤 Audio capture ended');
    };

    recognition.onsoundstart = () => {
      console.log('🔊 Sound detected - user is speaking');
    };

    recognition.onsoundend = () => {
      console.log('🔇 Sound ended - processing speech...');
    };

    recognition.onspeechstart = () => {
      console.log('💬 Speech detected!');
    };

    recognition.onspeechend = () => {
      console.log('💬 Speech ended');
    };

    recognition.onresult = (event) => {
      console.log('📝 Recognition result event:', event.results.length, 'results');
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        const isFinal = event.results[i].isFinal;
        console.log(`Result ${i}: "${transcript}" (final: ${isFinal})`);
        
        if (isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript = transcript;
        }
      }

      // Show interim results immediately
      if (interimTranscript) {
        hasReceivedAnyResult = true;
        setCurrentTranscript(interimTranscript);
        console.log('📝 Interim transcript:', interimTranscript);
        
        // Clear any existing silence timeout - user is still speaking
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      }

      // Process final transcript only once
      if (finalTranscript.trim() && !isProcessing && !hasReceivedQuery) {
        hasReceivedAnyResult = true;
        isProcessing = true;
        const finalText = finalTranscript.trim();
        console.log('✅ Final transcript received:', finalText);
        setCurrentTranscript(''); // Clear interim
        
        // Clear silence timeout since we got final result
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
        
        handleUserSpeech(finalText);
      } else if (interimTranscript && !hasReceivedQuery && !isProcessing) {
        // User is speaking but no final result yet - set up silence detection
        // Clear existing timeout
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
        }
        
        // If user stops speaking for 2 seconds, process the interim transcript
        silenceTimeoutRef.current = setTimeout(() => {
          if (!hasReceivedQuery && interimTranscript.trim()) {
            console.log('⏱️ Silence detected, processing interim transcript:', interimTranscript);
            const finalText = interimTranscript.trim();
            setCurrentTranscript('');
            handleUserSpeech(finalText);
          }
          silenceTimeoutRef.current = null;
        }, 2000); // 2 seconds of silence
      }
    };

    recognition.onerror = (event) => {
      console.error('❌ Speech recognition error:', event.error, event);
      setIsListening(false);
      
      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      
      // Don't restart for these errors
      if (event.error === 'aborted' || event.error === 'not-allowed') {
        console.log('⚠️ Not restarting due to error type:', event.error);
        return;
      }
      
      // For "no-speech" error, wait longer before restarting
      if (event.error === 'no-speech') {
        console.log('⚠️ No speech detected, will restart in 3 seconds...');
        if (!hasReceivedQuery && isAudioOn && isConnected && !isProcessing) {
          restartTimeoutRef.current = setTimeout(() => {
            if (!hasReceivedQuery && isAudioOn && isConnected && !isProcessing) {
              try {
                console.log('🔄 Restarting recognition after no-speech...');
                recognition.start();
              } catch (e) {
                console.log('❌ Recognition restart error:', e.message);
              }
            }
            restartTimeoutRef.current = null;
          }, 3000); // Wait 3 seconds for no-speech
        }
        return;
      }
      
      // Only restart if we haven't received query and audio is on
      if (!hasReceivedQuery && isAudioOn && isConnected && !isProcessing) {
        restartTimeoutRef.current = setTimeout(() => {
          if (!hasReceivedQuery && isAudioOn && isConnected && !isProcessing) {
            try {
              console.log('🔄 Restarting recognition after error...');
              recognition.start();
            } catch (e) {
              console.log('❌ Recognition restart error:', e.message);
            }
          }
          restartTimeoutRef.current = null;
        }, 2000); // Wait 2 seconds before restarting
      }
    };

    recognition.onend = () => {
      console.log('⏹️ Recognition ended. Has received result:', hasReceivedAnyResult);
      setIsListening(false);
      isProcessing = false;
      
      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      
      // Only restart if we haven't received query and audio is on
      if (!hasReceivedQuery && isAudioOn && isConnected) {
        // Wait before restarting to avoid rapid restarts
        restartTimeoutRef.current = setTimeout(() => {
          if (!hasReceivedQuery && isAudioOn && isConnected && !isProcessing) {
            try {
              console.log('🔄 Auto-restarting recognition...');
              recognition.start();
            } catch (e) {
              console.log('⚠️ Auto-restart error (might already be starting):', e.message);
              // Already started or error - ignore
            }
          }
          restartTimeoutRef.current = null;
        }, 500); // Shorter delay for continuous mode
      }
    };

    recognitionRef.current = recognition;

    return () => {
      // Clear any pending restart
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
        restartTimeoutRef.current = null;
      }
      // Clear silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
          recognitionRef.current.abort();
        } catch (e) {
          // Ignore errors on cleanup
        }
      }
    };
  }, [lawyerLanguage, isAudioOn, isConnected, hasReceivedQuery]);

  // Handle user speech - respond with thank you message
  const handleUserSpeech = async (text) => {
    if (!text.trim() || hasReceivedQuery) {
      console.log('Skipping - already processed or empty text');
      return; // Only process once
    }
    
    console.log('Processing user speech:', text);
    setCurrentTranscript('');
    setHasReceivedQuery(true);
    setConversation(prev => [...prev, { role: 'user', text, timestamp: new Date() }]);

    // Stop listening immediately
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current.abort(); // Abort any ongoing recognition
      } catch (e) {
        console.log('Error stopping recognition:', e);
      }
    }
    setIsListening(false);

    // Wait a moment, then respond with thank you message
    setTimeout(() => {
      // Use Kannada thank you message if lawyer speaks Kannada
      const thankYouMsg = lawyerLanguage === 'kannada' 
        ? 'ಧನ್ಯವಾದಗಳು, ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮನ್ನು ಸಂಪರ್ಕಿಸುತ್ತೇವೆ.'
        : t('videoCall.thankYou');
      setConversation(prev => [...prev, { role: 'assistant', text: thankYouMsg, timestamp: new Date() }]);
      speakText(thankYouMsg, lawyerLanguage);
    }, 800);
  };

  // Speak text using Web Speech API
  const speakText = (text, lang = null) => {
    if (!('speechSynthesis' in window)) return;
    
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    // Use provided language or lawyer's language or default
    utterance.lang = lang === 'kannada' ? 'kn-IN' : (lang || lawyerLanguage === 'kannada' ? 'kn-IN' : (language || 'en-IN'));
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      // After thank you message, end the call
      if (hasReceivedQuery) {
        setTimeout(() => {
          endCall();
        }, 2000); // Wait 2 seconds before ending call
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  // Initialize video stream and greet user
  useEffect(() => {
    const initVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        streamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setIsConnected(true);
        
        // Say greeting message when connected
        if (!hasGreeted) {
          setTimeout(() => {
            // Personalized greeting based on lawyer's language
            let greeting;
            if (lawyerLanguage === 'kannada') {
              // Kannada greeting - exact format as requested
              greeting = userName 
                ? `ನಮಸ್ತೆ, ${userName} ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ತಿಳಿಸಿ, ನಾನು ವಕೀಲರಿಗೆ ತಲುಪಿಸುತ್ತೇನೆ.`
                : 'ನಮಸ್ತೆ, ನಿಮ್ಮ ಸಮಸ್ಯೆಯನ್ನು ತಿಳಿಸಿ, ನಾನು ವಕೀಲರಿಗೆ ತಲುಪಿಸುತ್ತೇನೆ.';
            } else {
              // English greeting (default)
              greeting = userName 
                ? t('videoCall.greetingWithName', { name: userName })
                : t('videoCall.greeting');
            }
            
            // Use direct utterance for greeting so we can control when listening starts
            if ('speechSynthesis' in window) {
              window.speechSynthesis.cancel();
              const utterance = new SpeechSynthesisUtterance(greeting);
              utterance.lang = lawyerLanguage === 'kannada' ? 'kn-IN' : (language || 'en-IN');
              utterance.rate = 0.9;
              utterance.pitch = 1;
              utterance.volume = 1;
              
              utterance.onstart = () => {
                setIsSpeaking(true);
                console.log('Greeting started');
              };
              
              utterance.onend = () => {
                setIsSpeaking(false);
                setHasGreeted(true);
                console.log('Greeting finished, starting to listen...');
                
                // Start listening ONLY after greeting finishes speaking
                // Wait a bit longer to ensure recognition is fully ready
                setTimeout(() => {
                  if (!hasReceivedQuery && recognitionRef.current && isAudioOn && isConnected) {
                    // Check if recognition is already running
                    try {
                      console.log('🎤 Starting speech recognition after greeting finished...');
                      console.log('📋 Recognition state:', {
                        hasRecognition: !!recognitionRef.current,
                        isAudioOn,
                        isConnected,
                        hasReceivedQuery
                      });
                      recognitionRef.current.start();
                      console.log('✅ Recognition start() called successfully');
                    } catch (e) {
                      console.error('❌ Error starting recognition:', e.message, e);
                      // If it's already running, that's fine - just log it
                      if (!e.message.includes('already') && !e.message.includes('started')) {
                        // Only retry if it's not an "already started" error
                        setTimeout(() => {
                          if (!hasReceivedQuery && recognitionRef.current && isAudioOn && isConnected) {
                            try {
                              console.log('🔄 Retrying recognition start...');
                              recognitionRef.current.start();
                            } catch (e2) {
                              console.error('❌ Second attempt failed:', e2.message);
                            }
                          }
                        }, 1500);
                      } else {
                        console.log('ℹ️ Recognition already running, that\'s OK');
                      }
                    }
                  } else {
                    console.warn('⚠️ Cannot start recognition:', {
                      hasReceivedQuery,
                      hasRecognition: !!recognitionRef.current,
                      isAudioOn,
                      isConnected
                    });
                  }
                }, 1500); // Wait 1.5 seconds after greeting ends to ensure everything is ready
              };
              
              window.speechSynthesis.speak(utterance);
            }
          }, 1000); // Initial delay before greeting
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
        alert('Unable to access camera/microphone. Please check permissions.');
      }
    };

    initVideo();

    // Call duration timer
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(timer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
    };
  }, [hasGreeted, isAudioOn, t, lawyerLanguage, userName]);

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
        setIsVideoOn(!isVideoOn);
      }
    }
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioOn;
        setIsAudioOn(!isAudioOn);
      }
    }

    // Start/stop speech recognition
    if (isAudioOn && recognitionRef.current) {
      recognitionRef.current.stop();
    } else if (!isAudioOn && recognitionRef.current && isConnected) {
      setTimeout(() => {
        recognitionRef.current.start();
      }, 500);
    }
  };

  const endCall = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    window.speechSynthesis.cancel();
    navigate('/lawyers');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Video Container */}
        <div className="relative bg-black rounded-xl overflow-hidden mb-4" style={{ aspectRatio: '16/9' }}>
          {/* Remote Video (AI Lawyer) */}
          <div className="absolute inset-0">
            {isConnected ? (
              <div className="w-full h-full bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center relative">
                <div className="text-center text-white">
                  <motion.div
                    animate={isSpeaking ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 1, repeat: isSpeaking ? Infinity : 0 }}
                  >
                    <Bot className="h-32 w-32 mx-auto mb-4 opacity-90" />
                  </motion.div>
                  <p className="text-2xl font-bold">{lawyerName}</p>
                  <p className="text-sm opacity-75 mt-2">
                    {isListening ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.span
                          animate={{ opacity: [1, 0.5, 1] }}
                          transition={{ duration: 1, repeat: Infinity }}
                        >
                          🎤
                        </motion.span>
                        {t('videoCall.listening')}
                      </span>
                    ) : isSpeaking ? t('videoCall.speaking') : hasReceivedQuery ? 'Call ending...' : 'Ready to talk'}
                  </p>
                  {currentTranscript && (
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-sm mt-4 px-4 py-2 bg-white/20 rounded-lg max-w-md mx-auto"
                    >
                      "{currentTranscript}"
                    </motion.p>
                  )}
                  {isListening && !currentTranscript && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs mt-2 text-white/60"
                    >
                      Speak now... I'm listening
                    </motion.p>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center text-white">
                <Loader2 className="h-8 w-8 animate-spin mr-3" />
                <p>Connecting...</p>
              </div>
            )}
          </div>

          {/* Local Video (User) - Picture in Picture */}
          <div className="absolute bottom-4 right-4 w-64 h-48 bg-black rounded-lg overflow-hidden border-2 border-white shadow-2xl">
            {isVideoOn ? (
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <User className="h-16 w-16 text-white opacity-50" />
              </div>
            )}
          </div>

          {/* Call Duration */}
          <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg">
            <p className="text-sm font-mono">{formatTime(callDuration)}</p>
          </div>

          {/* Conversation Transcript (Optional - can be toggled) */}
          {conversation.length > 0 && (
            <div className="absolute top-4 right-4 bg-black/70 text-white px-4 py-2 rounded-lg max-w-xs max-h-32 overflow-y-auto text-xs">
              <p className="font-semibold mb-1">Recent:</p>
              {conversation.slice(-2).map((msg, idx) => (
                <p key={idx} className="mb-1">
                  <span className="font-semibold">{msg.role === 'user' ? 'You' : 'AI'}:</span> {msg.text.substring(0, 50)}...
                </p>
              ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-2xl">
          <div className="flex items-center justify-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleVideo}
              className={`p-4 rounded-full ${
                isVideoOn
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                  : 'bg-red-500 text-white'
              } shadow-lg transition-all`}
            >
              {isVideoOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleAudio}
              className={`p-4 rounded-full ${
                isAudioOn
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white'
                  : 'bg-red-500 text-white'
              } shadow-lg transition-all relative`}
            >
              {isAudioOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
              {isListening && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={endCall}
              className="p-4 rounded-full bg-red-600 text-white shadow-lg hover:bg-red-700 transition-all"
            >
              <PhoneOff className="h-6 w-6" />
            </motion.button>
          </div>
          <p className="text-center text-sm text-gray-600 mt-4">
            {isAudioOn ? 'Speak naturally - AI will respond to your questions' : 'Enable microphone to start conversation'}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VideoCall;
