import React, { useState, useEffect, useRef } from 'react';

// Comprehensive Knowledge Base for Institute APEX (English Only)
const KNOWLEDGE_BASE = [
  {
    category: 'neet',
    keywords: ['neet', 'medical', 'biology', 'mbbs', 'aiims', 'doctor', 'dropper', 'repeater', '11th', '12th'],
    answer: "Institute APEX offers dedicated classroom coaching for NEET (UG) for Class 11, Class 12, and Dropper batches. We focus on 100% NCERT line-by-line mastery, daily practice problem sheets (DPPs), and weekly OMR mock tests. You are welcome to attend a free 2-day trial class."
  },
  {
    category: 'jee',
    keywords: ['jee', 'iit', 'engineering', 'math', 'maths', 'main', 'advanced'],
    answer: "Our IIT-JEE (Main & Advanced) classroom program covers Physics, Chemistry, and Mathematics with rigorous conceptual clarity, shortcut techniques, and daily doubt counters to help students secure top ranks."
  },
  {
    category: 'foundation',
    keywords: ['foundation', '9th', '10th', 'ninth', 'tenth', 'olympiad', 'ntse', 'board', 'cbse', 'hbse'],
    answer: "Our Junior Foundation Program for Class 9th and 10th builds strong fundamentals in Science and Mathematics, preparing students for School Boards (CBSE & HBSE) as well as competitive exams like NTSE and Olympiads."
  },
  {
    category: 'scholarship',
    keywords: ['scholarship', 'asat', 'discount', 'concession', 'test', 'exam'],
    answer: "We conduct the APEX Scholarship Admission Test (ASAT), where hardworking students can earn up to a 90% scholarship on tuition fees based on merit. Registration is available online or at our campus."
  },
  {
    category: 'fee',
    keywords: ['fee', 'fees', 'cost', 'price', 'charges', 'installment'],
    answer: "Our fee structure is transparent and affordable with flexible installment options. Additional fee waivers are awarded through our ASAT scholarship exam. Contact our counseling desk at 94677-52374 for exact fee details."
  },
  {
    category: 'demo',
    keywords: ['demo', 'trial', 'free class', 'trial class'],
    answer: "Yes, prospective students and parents can attend 2 to 3 days of Free Trial Demo Classes to experience our classroom teaching quality and meet the faculty before taking admission."
  },
  {
    category: 'address',
    keywords: ['address', 'location', 'where', 'map', 'directions', 'huda', 'urban estate', 'jind'],
    answer: "Institute APEX is located at #1257, Urban Estate, Near HUDA Ground, Jind-126102 (Haryana). It is centrally located with easy connectivity from all parts of Jind."
  },
  {
    category: 'contact',
    keywords: ['phone', 'contact', 'call', 'mobile', 'number', 'telephone', 'email'],
    answer: "You can reach our counseling desk directly at Mobile: 94677-52374 or Landline: 01681-247700. Our email address is instituteapexjind@gmail.com."
  },
  {
    category: 'timings',
    keywords: ['timing', 'timings', 'time', 'batch', 'schedule', 'hours'],
    answer: "We operate separate Morning and Evening batches designed around school hours to avoid scheduling conflicts. Batch sizes are strictly kept small (25 to 30 students) for focused attention."
  },
  {
    category: 'results',
    keywords: ['result', 'results', 'topper', 'selection', 'rank'],
    answer: "Institute APEX has a 15+ year proven track record in Jind with students selected into premier Government Medical Colleges (AIIMS, MAMC, PGIMS) and top IITs, NITs, and BITS."
  },
  {
    category: 'greeting',
    keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
    answer: "Hello! Welcome to Institute APEX. I am your Academic Counselor. How can I assist you with NEET, IIT-JEE, or admissions today?"
  }
];

export default function CounselorAvatar({ settings = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [systemVoices, setSystemVoices] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'counselor',
      text: "Hello! I am your Academic Counselor at Institute APEX, Jind. How can I help you with NEET, IIT-JEE, Foundation courses, or scholarship admissions today?"
    }
  ]);

  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);
  const synthRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const isSpeakingRef = useRef(false);
  const isOpenRef = useRef(false);

  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  // Voice Loading for Clean Natural English Output
  const refreshVoices = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        setSystemVoices(v);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
      refreshVoices();

      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = refreshVoices;
      }

      // Speech Recognition for Hands-Free voice input
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event) => {
          setIsListening(false);
          const transcript = event.results[0][0].transcript;
          if (transcript && transcript.trim()) {
            handleUserQuery(transcript);
          }
        };

        recognition.onerror = (event) => {
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      }
    }

    return () => {
      stopSpeaking();
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if (audioPlayerRef.current) {
        try { audioPlayerRef.current.pause(); } catch (e) {}
      }
    };
  }, []);

  // Auto-scroll chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, isSpeaking, isListening, isThinking]);

  // Get Clean Natural English Female Voice
  const getNaturalEnglishVoice = () => {
    const voices = systemVoices.length > 0 
      ? systemVoices 
      : (synthRef.current ? synthRef.current.getVoices() : []);
    if (!voices || voices.length === 0) return null;

    const femaleKeywords = ['natural', 'heera', 'neerja', 'female', 'zira', 'samantha', 'victoria', 'karen', 'google uk english female', 'google us english'];
    const femaleVoice = voices.find(v => {
      const lower = v.name.toLowerCase();
      if (lower.includes('david') || lower.includes('mark') || lower.includes('george')) return false;
      return v.lang.toLowerCase().startsWith('en') && femaleKeywords.some(kw => lower.includes(kw));
    });

    if (femaleVoice) return femaleVoice;
    return voices.find(v => v.lang.toLowerCase().startsWith('en')) || voices[0];
  };

  const startListening = () => {
    if (!recognitionRef.current) return;
    try { recognitionRef.current.abort(); } catch (e) {}
    try {
      recognitionRef.current.lang = 'en-US';
      recognitionRef.current.start();
    } catch (e) {}
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);
  };

  // Play Speech (Gemini Audio or Browser Speech)
  const speakText = (text, customAudioBase64 = null) => {
    if (isMuted) return;
    stopListening();

    // 1. If Gemini returned native studio-quality audio
    if (customAudioBase64) {
      try {
        setIsSpeaking(true);
        if (audioPlayerRef.current) {
          audioPlayerRef.current.pause();
        }
        const audio = new Audio(`data:audio/mp3;base64,${customAudioBase64}`);
        audioPlayerRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          if (isOpenRef.current && !isMuted) {
            setTimeout(startListening, 400);
          }
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          fallbackBrowserSpeak(text);
        };
        audio.play();
        return;
      } catch (err) {
        fallbackBrowserSpeak(text);
        return;
      }
    }

    fallbackBrowserSpeak(text);
  };

  const fallbackBrowserSpeak = (text) => {
    if (!synthRef.current) return;
    try {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.15;
      utterance.rate = 1.0;

      const voice = getNaturalEnglishVoice();
      if (voice) utterance.voice = voice;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => {
        setIsSpeaking(false);
        if (isOpenRef.current && !isMuted) {
          setTimeout(startListening, 450);
        }
      };
      utterance.onerror = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    } catch (e) {
      setIsSpeaking(false);
    }
  };

  const stopSpeaking = () => {
    if (audioPlayerRef.current) {
      try { audioPlayerRef.current.pause(); } catch (e) {}
    }
    if (synthRef.current) {
      try { synthRef.current.cancel(); } catch (e) {}
    }
    setIsSpeaking(false);
  };

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Voice input is not supported on this browser. Please type your query.');
      return;
    }
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  // Process User Query via Google Gemini (or Knowledge Base)
  const handleUserQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;
    const cleanQuery = queryText.trim();

    setChatLog(prev => [...prev, { sender: 'user', text: cleanQuery }]);
    setUserInput('');
    setIsThinking(true);

    let answerText = "";
    let audioData = null;

    // 1. Check if Gemini API is provided
    if (settings.geminiApiKey) {
      try {
        const systemPrompt = `You are the Senior Academic Counselor at Institute APEX, Jind (#1257, Urban Estate, Near HUDA Ground, Jind-126102, Haryana. Phone: 94677-52374).
We offer premier coaching for: NEET (UG) for Class 11, 12, and Droppers; IIT-JEE (Main & Advanced) for Class 11 and 12; Foundation for Class 9th and 10th (Olympiads, NTSE, School Boards); and ASAT Scholarship Test with up to 90% fee waiver. Free 2-3 day trial demo classes are available.
Please reply strictly in clear, professional English in 2 to 3 concise, helpful sentences. Student Query: "${cleanQuery}"`;

        // Request Gemini 2.0 Flash with audio + text generation
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${settings.geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }],
            generationConfig: {
              responseModalities: ["TEXT", "AUDIO"],
              speechConfig: {
                voiceConfig: {
                  prebuiltVoiceConfig: {
                    voiceName: "Aoede" // Warm natural studio female voice
                  }
                }
              }
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const parts = data.candidates?.[0]?.content?.parts || [];
          for (const p of parts) {
            if (p.text) answerText = p.text.trim();
            if (p.inlineData && p.inlineData.data) audioData = p.inlineData.data;
          }
        } else {
          // Fallback to text-only Gemini if audio modality is unavailable
          const textResp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: systemPrompt }] }]
            })
          });
          if (textResp.ok) {
            const textData = await textResp.json();
            answerText = textData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "";
          }
        }
      } catch (err) {
        console.warn('Gemini API call failed, falling back to knowledge base:', err);
      }
    }

    // 2. Knowledge Base Fallback if no Gemini key or network issue
    if (!answerText) {
      const lower = cleanQuery.toLowerCase();
      let best = null;
      let maxScore = 0;
      for (const item of KNOWLEDGE_BASE) {
        let score = 0;
        for (const kw of item.keywords) {
          if (lower.includes(kw)) score++;
        }
        if (score > maxScore) {
          maxScore = score;
          best = item;
        }
      }
      answerText = best && maxScore > 0 
        ? best.answer 
        : "Thank you for reaching out. For course curriculum, batch schedules, or fee concession details, please contact our counseling desk at 94677-52374 or visit our institute near HUDA Ground, Jind.";
    }

    setIsThinking(false);
    setChatLog(prev => [...prev, { sender: 'counselor', text: answerText }]);

    // Speak response
    speakText(answerText, audioData);
  };

  const openAvatar = () => {
    setIsOpen(true);
    setTimeout(() => {
      speakText("Hello! I am your Academic Counselor at Institute APEX. How can I assist you with admissions or courses today?");
    }, 300);
  };

  const closeAvatar = () => {
    stopSpeaking();
    stopListening();
    setIsOpen(false);
  };

  return (
    <>
      {/* Launcher Bubble */}
      {!isOpen && (
        <div className="counselor-bubble-wrapper">
          <button
            className="counselor-bubble-btn"
            onClick={openAvatar}
            title="Voice Counselor"
            aria-label="Voice Counselor"
          >
            <div className="counselor-bubble-img-wrap">
              <img 
                src="/images/counselor_avatar.webp" 
                alt="Counselor" 
                className="counselor-bubble-img"
              />
              <span className="counselor-live-dot" />
            </div>
            <div className="counselor-bubble-text">
              <span className="counselor-bubble-badge">
                <span className="live-pulse" /> Voice Counselor
              </span>
              <span className="counselor-bubble-sub">
                Online Consultation
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Clean Minimalist Voice Chat Modal */}
      {isOpen && (
        <div className="counselor-modal-overlay">
          <div className="counselor-card" role="dialog" aria-label="Counselor Voice Chat">
            
            {/* Header */}
            <div className="counselor-header">
              <div className="counselor-header-left">
                <div className="counselor-header-avatar-wrap">
                  <img 
                    src="/images/counselor_avatar.webp" 
                    alt="Counselor" 
                    className="counselor-header-avatar"
                  />
                  <span className={`counselor-status-dot ${isSpeaking ? 'speaking' : isListening ? 'listening-dot' : ''}`} />
                </div>
                <div className="counselor-header-info">
                  <h4 className="counselor-name">Academic Counselor</h4>
                  <span className="counselor-title">Institute APEX • Live Support</span>
                </div>
              </div>

              <div className="counselor-header-actions">
                <button 
                  className={`counselor-icon-btn ${isMuted ? 'muted' : ''}`}
                  onClick={() => {
                    if (!isMuted) stopSpeaking();
                    setIsMuted(!isMuted);
                  }}
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H9z" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  )}
                </button>

                <button 
                  className="counselor-icon-btn close"
                  onClick={closeAvatar}
                  title="Close"
                >
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Audio Wave Visualizer Center */}
            <div className="counselor-video-stage audio-wave-stage">
              <div className="audio-wave-orb-wrapper">
                <div className={`audio-wave-rings ${isSpeaking ? 'speaking-waves' : isListening ? 'listening-waves' : 'idle-waves'}`}>
                  <span className="wave-ring ring-1" />
                  <span className="wave-ring ring-2" />
                  <span className="wave-ring ring-3" />
                </div>

                <div className="audio-counselor-portrait">
                  <img 
                    src="/images/counselor_avatar.webp" 
                    alt="Counselor" 
                    className="audio-counselor-img"
                  />
                </div>

                {isSpeaking && (
                  <div className="counselor-spectrum-bars">
                    <span className="spectrum-bar s1" />
                    <span className="spectrum-bar s2" />
                    <span className="spectrum-bar s3" />
                    <span className="spectrum-bar s4" />
                    <span className="spectrum-bar s5" />
                    <span className="spectrum-bar s6" />
                    <span className="spectrum-bar s7" />
                  </div>
                )}
              </div>

              {/* Status Pill */}
              <div className={`counselor-hud-badge ${isThinking ? 'hud-thinking' : isListening ? 'hud-listening' : isSpeaking ? 'hud-speaking' : ''}`}>
                <span className={`hud-rec-dot ${isThinking ? 'thinking-pulse' : isSpeaking ? 'active' : isListening ? 'listening-pulse' : ''}`} />
                <span>
                  {isThinking ? "Thinking..." : isSpeaking ? "Counselor Speaking..." : isListening ? "Listening..." : "Voice Consultation"}
                </span>
              </div>
            </div>

            {/* Conversation Log */}
            <div className="counselor-chat-stream">
              {chatLog.map((msg, idx) => (
                <div key={idx} className={`counselor-bubble-row ${msg.sender === 'user' ? 'user-row' : 'counselor-row'}`}>
                  {msg.sender === 'counselor' && (
                    <div className="row-avatar">
                      <img src="/images/counselor_avatar.webp" alt="Avatar" />
                    </div>
                  )}
                  <div className={`counselor-chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'counselor-bubble'}`}>
                    <p>{msg.text}</p>
                    {msg.sender === 'counselor' && (
                      <button 
                        className="repeat-audio-btn"
                        onClick={() => speakText(msg.text)}
                        title="Replay Voice"
                      >
                        <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: 12, height: 12 }}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>Listen</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Input Form */}
            <form className="counselor-input-form" onSubmit={(e) => { e.preventDefault(); handleUserQuery(userInput); }}>
              <button 
                type="button"
                className={`counselor-mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleMic}
                title={isListening ? "Stop listening" : "Speak (Microphone)"}
                aria-label="Voice Input"
              >
                {isListening ? (
                  <div className="mic-pulsing-wave">
                    <span className="mic-dot" />
                    <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                    </svg>
                  </div>
                ) : (
                  <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ width: 18, height: 18 }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15a3 3 0 003-3V6a3 3 0 00-6 0v6a3 3 0 003 3z" />
                  </svg>
                )}
              </button>

              <input 
                type="text" 
                className="counselor-text-input"
                placeholder={isListening ? "Listening... speak now" : "Type or speak your question..."}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />

              <button 
                type="submit" 
                className="counselor-send-btn"
                disabled={!userInput.trim()}
                title="Send"
                aria-label="Send"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>

            {/* Quick Actions Footer */}
            <div className="counselor-quick-footer">
              <a 
                href={`tel:${(settings.phone || '94677-52374').replace(/[^0-9+]/g, '')}`} 
                className="counselor-footer-action call"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span>Call Institute</span>
              </a>

              <a 
                href={`https://wa.me/91${(settings.whatsappNumber || '9467752374').replace(/[^0-9]/g, '')}?text=${encodeURIComponent('Hello APEX Institute, I would like to get admission details.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="counselor-footer-action whatsapp"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.517 2.266 2.27 3.51 5.284 3.508 8.489-.005 6.66-5.343 11.999-11.957 11.999-2.005-.001-3.973-.504-5.714-1.463L0 24zm6.59-4.846c1.6.95 3.197 1.451 4.82 1.452 5.518 0 10.006-4.486 10.01-10.002.002-2.673-1.037-5.186-2.927-7.079-1.889-1.89-4.4-2.932-7.08-2.933-5.524 0-10.014 4.487-10.018 10.004-.002 1.699.444 3.361 1.293 4.81l-.963 3.518 3.606-.945zm11.367-7.795c-.3-.15-1.772-.875-2.046-.975-.276-.1-.476-.15-.676.15-.2.3-.776.975-.95 1.175-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.414-1.492-.893-.797-1.497-1.782-1.672-2.082-.175-.3-.018-.462.13-.61.135-.133.3-.35.45-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.676-1.63-1.026-2.47-.3-.72-.6-1.125-.676-1.125-.175 0-.35-.025-.525-.025-.175 0-.476.075-.726.35-.25.275-.95.925-.95 2.25s.965 2.6 1.1 2.775c.135.175 1.9 2.9 4.6 4.075.642.28 1.144.446 1.534.57.645.205 1.233.176 1.7.106.52-.078 1.772-.725 2.022-1.425.25-.7.25-1.3.175-1.425-.075-.125-.275-.2-.575-.35z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
