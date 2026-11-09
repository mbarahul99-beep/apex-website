import React, { useState, useEffect, useRef } from 'react';

// Comprehensive Knowledge Base for Institute APEX (Bilingual: Hindi & English)
const KNOWLEDGE_BASE = [
  {
    category: 'neet',
    keywords: ['neet', 'medical', 'biology', 'mbbs', 'aiims', 'doctor', 'नीट', 'मेडिकल', 'बायोलॉजी', 'एमबीबीएस', 'डॉक्टर', 'ड्रॉपर', 'dropper', 'repeater', '11th neet', '12th neet'],
    answerEn: "Institute APEX provides premier classroom coaching for NEET (UG) for Class 11, Class 12, and Dropper/Repeater batches. We focus on 100% NCERT line-by-line mastery in Biology, Chemistry, and Physics, daily practice problem sheets (DPPs), and weekly OMR-based mock tests. Would you like to attend a free 2-day demo class?",
    answerHi: "इंस्टीट्यूट APEX में NEET (UG) की तैयारी के लिए 11वीं, 12वीं और ड्रॉपर/रिपीटर छात्रों के लिए विशेष क्लासरूम बैच उपलब्ध हैं। यहाँ बायोलॉजी, केमिस्ट्री और फिजिक्स में NCERT की लाइन-बाय-लाइन तैयारी, डेली प्रैक्टिस पेपर्स (DPPs) और साप्ताहिक OMR टेस्ट कराए जाते हैं। क्या आप 2 दिन की फ्री डेमो क्लास लेना चाहते हैं?"
  },
  {
    category: 'jee',
    keywords: ['jee', 'iit', 'engineering', 'math', 'maths', 'main', 'advanced', 'जेईई', 'आईआईटी', 'इंजीनियरिंग', 'गणित', 'मेंस', 'एडवांस्ड'],
    answerEn: "Our IIT-JEE (Main & Advanced) classroom coaching covers Physics, Chemistry, and Mathematics with rigorous conceptual clarity, advanced problem-solving techniques, and doubt counters. We prepare students for top IITs and NITs. Would you like to check the batch timings or meet our faculty?",
    answerHi: "हमारे यहाँ IIT-JEE (Main और Advanced) के लिए फिजिक्स, केमिस्ट्री और मैथ्स की बेहतरीन क्लासरूम कोचिंग दी जाती है। इसमें कॉन्सेप्ट क्लैरिटी, शॉर्टकट्स और डाउट काउंटर्स की सुविधा है जिससे छात्र IITs और NITs में टॉप रैंक हासिल कर सकें। क्या आप बैच टाइमिंग जानना चाहते हैं?"
  },
  {
    category: 'foundation',
    keywords: ['foundation', '9th', '10th', 'ninth', 'tenth', 'olympiad', 'ntse', 'फाउंडेशन', '9वीं', '10वीं', 'ओलंपियाड', 'बोर्ड', 'board'],
    answerEn: "Our Junior Foundation Program for Class 9th and 10th builds rock-solid fundamentals in Science and Mathematics. It prepares students for School Boards (CBSE & HBSE) as well as future competitive exams like NTSE, Olympiads, and NEET/JEE early prep.",
    answerHi: "कक्षा 9वीं और 10वीं के लिए हमारा फाउंडेशन प्रोग्राम साइंस और मैथ्स की मजबूत नींव तैयार करता है। यह स्कूल बोर्ड (CBSE/HBSE) में टॉप करने के साथ-साथ NTSE, ओलंपियाड और भविष्य के NEET/JEE की अग्रिम तैयारी कराता है।"
  },
  {
    category: 'scholarship',
    keywords: ['scholarship', 'asat', 'discount', 'concession', 'test', 'exam', 'स्कॉलरशिप', 'छात्रवृत्ति', 'छूट', 'टेस्ट', 'परीक्षा', 'फीस छूट'],
    answerEn: "We conduct the APEX Scholarship Admission Test (ASAT), where meritorious and hardworking students can earn up to 90% fee scholarships on their tuition fees. You can register for the next ASAT test directly through our website or visit the institute.",
    answerHi: "हम APEX स्कॉलरशिप एडमिशन टेस्ट (ASAT) आयोजित करते हैं, जिसके माध्यम से मेधावी और मेहनती छात्रों को ट्यूशन फीस पर 90% तक की स्कॉलरशिप (फीस छूट) दी जाती है। आप वेबसाइट से या सीधे इंस्टीट्यूट आकर टेस्ट दे सकते हैं।"
  },
  {
    category: 'fee',
    keywords: ['fee', 'fees', 'cost', 'price', 'charges', 'installment', 'फीस', 'खर्च', 'किस्त', 'रुपये', 'पैसा'],
    answerEn: "Institute APEX offers very affordable and competitive fee structures compared to large corporate institutes, with flexible easy installment options. Additional fee waivers are awarded through our ASAT scholarship test. Call us at 94677-52374 for the exact fee quote for your course.",
    answerHi: "इंस्टीट्यूट APEX की फीस जींद में सबसे किफायती और पारदर्शी है, जिसमें आसान किस्तों (Installments) की सुविधा भी है। ASAT स्कॉलरशिप टेस्ट द्वारा 90% तक फीस में छूट भी मिलती है। अपने पसंदीदा कोर्स की सटीक फीस के लिए आप 94677-52374 पर कॉल कर सकते हैं।"
  },
  {
    category: 'demo',
    keywords: ['demo', 'trial', 'free class', 'डेमो', 'ट्रायल', 'फ्री क्लास', 'क्लास', 'ट्रायल क्लास'],
    answerEn: "Yes! We welcome students and parents to attend 2 to 3 days of Free Trial Demo Classes to experience our classroom teaching quality, faculty interaction, and study material firsthand before taking admission.",
    answerHi: "हाँ बिल्कुल! हम सभी नए विद्यार्थियों को 2 से 3 दिन की फ्री ट्रायल डेमो क्लास प्रदान करते हैं, ताकि आप एडमिशन लेने से पहले शिक्षकों के पढ़ाने के तरीके और स्टडी मटेरियल को खुद अनुभव कर सकें।"
  },
  {
    category: 'address',
    keywords: ['address', 'location', 'where', 'map', 'directions', 'huda', 'urban estate', 'पता', 'कहाँ', 'लोकेशन', 'रास्ता', 'हुड्डा', 'अर्बन एस्टेट', 'जींद'],
    answerEn: "Institute APEX is located at: #1257, Urban Estate, Near HUDA Ground, Jind-126102 (Haryana). It is centrally located with convenient connectivity from all parts of Jind district.",
    answerHi: "इंस्टीट्यूट APEX का मुख्य पता है: #1257, अर्बन एस्टेट, हुड्डा ग्राउंड के पास, जींद-126102 (हरियाणा)। यह जींद शहर के केंद्र में स्थित है और यहाँ पहुँचना बेहद आसान है।"
  },
  {
    category: 'contact',
    keywords: ['phone', 'contact', 'call', 'mobile', 'number', 'telephone', 'email', 'फोन', 'संपर्क', 'कॉल', 'मोबाइल', 'नंबर', 'ईमेल'],
    answerEn: "You can reach our counseling desk directly at Mobile: 94677-52374 or Landline: 01681-247700. Our email address is instituteapexjind@gmail.com. Our counselors are available every day to assist you.",
    answerHi: "आप हमारे एडमिशन काउंसलिंग डेस्क से सीधे मोबाइल नंबर 94677-52374 या लैंडलाइन 01681-247700 पर संपर्क कर सकते हैं। हमारा ईमेल पता instituteapexjind@gmail.com है।"
  },
  {
    category: 'timings',
    keywords: ['timing', 'timings', 'time', 'batch', 'schedule', 'hours', 'समय', 'टाइमिंग', 'बैच', 'घंटे', 'कब'],
    answerEn: "We operate separate Morning and Evening batches designed specifically around school hours so students have no scheduling conflicts. Batch sizes are strictly kept small (25-30 students) for individual attention.",
    answerHi: "हमारे यहाँ सुबह और शाम के अलग-अलग बैच उपलब्ध हैं जिन्हें स्कूल के समय को ध्यान में रखकर बनाया गया है। हर बैच में छात्रों की संख्या 25-30 तक सीमित रखी जाती है ताकि प्रत्येक छात्र पर व्यक्तिगत ध्यान दिया जा सके।"
  },
  {
    category: 'results',
    keywords: ['result', 'results', 'topper', 'selection', 'rank', 'रिजल्ट', 'परिणाम', 'टॉपर', 'सलेक्शन', 'रैंक'],
    answerEn: "Institute APEX has a 15+ year proven track record in Jind with students achieving top selections in Government Medical Colleges (AIIMS, MAMC Delhi, PGIMS Rohtak) and prestigious IITs, NITs, and BITS.",
    answerHi: "इंस्टीट्यूट APEX का जींद में 15 से अधिक वर्षों का शानदार ट्रैक रिकॉर्ड रहा है। हमारे छात्र देश के प्रतिष्ठित मेडिकल कॉलेजों (AIIMS, MAMC दिल्ली, PGIMS रोहतक) और IITs/NITs में शानदार रैंक के साथ चयनित हुए हैं।"
  },
  {
    category: 'general_greeting',
    keywords: ['hello', 'hi', 'hey', 'namaste', 'pranam', 'नमस्ते', 'प्रणाम', 'हेलो', 'हाय'],
    answerEn: "Hello! Welcome to Institute APEX Jind. I am Pooja Sharma, your Academic Counselor. How can I help you regarding NEET, IIT-JEE, or Foundation admissions today?",
    answerHi: "नमस्ते! इंस्टीट्यूट APEX जींद में आपका स्वागत है। मैं आपकी अकादमिक काउंसलर पूजा शर्मा हूँ। आज मैं NEET, IIT-JEE या स्कूल फाउंडेशन एडमिशन में आपकी क्या मदद कर सकती हूँ?"
  }
];

export default function CounselorAvatar({ settings = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [language, setLanguage] = useState('hi'); // 'hi' or 'en'
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [handsFree, setHandsFree] = useState(true); // Continuous Auto Follow-up
  const [systemVoices, setSystemVoices] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [chatLog, setChatLog] = useState([
    {
      sender: 'counselor',
      textHi: "नमस्ते! मैं इंस्टीट्यूट APEX जींद से पूजा शर्मा हूँ। मैं NEET, IIT-JEE, 9वीं-10वीं फाउंडेशन या स्कॉलरशिप एडमिशन में आपकी कैसे सहायता कर सकती हूँ?",
      textEn: "Hello! I am Pooja Sharma from Institute APEX, Jind. How can I assist you with NEET, IIT-JEE, Foundation courses, or scholarship admissions today?"
    }
  ]);
  const [currentSubtitle, setCurrentSubtitle] = useState('');

  const recognitionRef = useRef(null);
  const chatBottomRef = useRef(null);
  const synthRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const handsFreeRef = useRef(handsFree);
  const isSpeakingRef = useRef(false);
  const isOpenRef = useRef(false);

  // Keep references in sync with latest state
  useEffect(() => { handsFreeRef.current = handsFree; }, [handsFree]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);
  useEffect(() => { isOpenRef.current = isOpen; }, [isOpen]);

  // Voice Loading & Natural Female Selection
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

      // Initialize Speech Recognition for continuous hands-free listening
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;

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
          console.warn('Speech recognition status:', event.error);
          setIsListening(false);
          // Restart gently after momentary silence if still in hands-free mode
          if (event.error === 'no-speech' && handsFreeRef.current && isOpenRef.current && !isSpeakingRef.current) {
            setTimeout(() => {
              if (handsFreeRef.current && isOpenRef.current && !isSpeakingRef.current) {
                startListening();
              }
            }, 900);
          }
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
        audioPlayerRef.current.pause();
      }
    };
  }, []);

  // Auto-scroll chat log
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatLog, currentSubtitle, isSpeaking, isListening, isThinking]);

  // Select the highest quality natural Indian female voice
  const getNaturalFemaleVoice = (langCode) => {
    const voices = systemVoices.length > 0 
      ? systemVoices 
      : (synthRef.current ? synthRef.current.getVoices() : []);
    if (!voices || voices.length === 0) return null;

    // Reject robotic male names strictly
    const isRoboticOrMale = (name) => {
      const lower = name.toLowerCase();
      return lower.includes('david') || lower.includes('mark') || lower.includes('george') || 
             lower.includes('ravi') || lower.includes('madhav') || lower.includes('hemant') || 
             (lower.includes('male') && !lower.includes('female'));
    };

    // Female names / indicators across OSes (Edge, Chrome, Windows, Android, iOS)
    const isFemaleVoice = (name) => {
      const lower = name.toLowerCase();
      if (isRoboticOrMale(lower)) return false;
      const femaleTokens = [
        'swara', 'heera', 'neerja', 'kalpana', 'geeta', 'shruti', 'sunita', 
        'priya', 'veena', 'ananya', 'pooja', 'kavya', 'female', 'zira', 
        'google हिन्दी', 'google uk english female', 'google us english', 
        'natural', 'samantha', 'victoria', 'karen'
      ];
      return femaleTokens.some(tok => lower.includes(tok));
    };

    if (langCode === 'hi') {
      const hiFemale = voices.find(v => 
        (v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi-in')) && 
        isFemaleVoice(v.name)
      );
      if (hiFemale) return hiFemale;

      const anyHi = voices.find(v => v.lang.toLowerCase().startsWith('hi') || v.lang.toLowerCase().includes('hi-in'));
      if (anyHi) return anyHi;

      const inFemale = voices.find(v => 
        (v.lang.toLowerCase().includes('in') || v.lang.toLowerCase().startsWith('en-in')) && 
        isFemaleVoice(v.name)
      );
      if (inFemale) return inFemale;

      const anyFemale = voices.find(v => isFemaleVoice(v.name));
      if (anyFemale) return anyFemale;
    } else {
      const inFemale = voices.find(v => 
        (v.lang.toLowerCase() === 'en-in' || v.lang.toLowerCase().includes('in')) && 
        isFemaleVoice(v.name)
      );
      if (inFemale) return inFemale;

      const engFemale = voices.find(v => 
        v.lang.toLowerCase().startsWith('en') && 
        isFemaleVoice(v.name)
      );
      if (engFemale) return engFemale;
    }

    return voices.find(v => !isRoboticOrMale(v.name)) || voices[0];
  };

  // Start Voice Listening (Continuous)
  const startListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.abort();
    } catch (e) {}

    recognitionRef.current.lang = language === 'hi' ? 'hi-IN' : 'en-IN';
    try {
      recognitionRef.current.start();
    } catch (err) {
      // Ignore if already listening
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
    setIsListening(false);
  };

  // Voice playback logic (ElevenLabs Natural Human Voice API or Enhanced Offline Female Voice)
  const speakText = async (text, langCode, autoFollowUp = true) => {
    if (isMuted) {
      if (autoFollowUp && handsFreeRef.current && isOpenRef.current) {
        setTimeout(startListening, 600);
      }
      return;
    }

    stopListening();
    setCurrentSubtitle(text);

    // 1. Check if ElevenLabs Natural Voice API is configured
    if (settings.enableElevenLabsVoice && settings.elevenLabsApiKey) {
      try {
        setIsSpeaking(true);
        const voiceId = settings.elevenLabsVoiceId || '21m00Tcm4TlvDq8ikWAM';
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': settings.elevenLabsApiKey
          },
          body: JSON.stringify({
            text: text,
            model_id: 'eleven_multilingual_v2',
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.8
            }
          })
        });

        if (response.ok) {
          const blob = await response.blob();
          const audioUrl = URL.createObjectURL(blob);
          if (audioPlayerRef.current) {
            audioPlayerRef.current.pause();
          }
          const audio = new Audio(audioUrl);
          audioPlayerRef.current = audio;

          audio.onended = () => {
            setIsSpeaking(false);
            if (autoFollowUp && handsFreeRef.current && isOpenRef.current && !isMuted) {
              setTimeout(() => {
                if (isOpenRef.current && !isSpeakingRef.current) {
                  startListening();
                }
              }, 450);
            }
          };

          audio.onerror = () => {
            console.warn('ElevenLabs playback error, using fallback');
            playBrowserSynth(text, langCode, autoFollowUp);
          };

          await audio.play();
          return;
        } else {
          console.warn('ElevenLabs API returned status:', response.status);
          playBrowserSynth(text, langCode, autoFollowUp);
          return;
        }
      } catch (err) {
        console.warn('ElevenLabs fetch error:', err);
        playBrowserSynth(text, langCode, autoFollowUp);
        return;
      }
    }

    // 2. Default browser female voice synthesis
    playBrowserSynth(text, langCode, autoFollowUp);
  };

  const playBrowserSynth = (text, langCode, autoFollowUp) => {
    if (!synthRef.current) {
      if (autoFollowUp && handsFreeRef.current && isOpenRef.current) {
        setTimeout(startListening, 600);
      }
      return;
    }

    try {
      synthRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.pitch = 1.16;
      utterance.rate = langCode === 'hi' ? 0.94 : 0.98;

      const chosenVoice = getNaturalFemaleVoice(langCode);
      if (chosenVoice) {
        utterance.voice = chosenVoice;
      }

      utterance.onstart = () => {
        setIsSpeaking(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        if (autoFollowUp && handsFreeRef.current && isOpenRef.current && !isMuted) {
          setTimeout(() => {
            if (isOpenRef.current && !isSpeakingRef.current) {
              startListening();
            }
          }, 450);
        }
      };

      utterance.onerror = (e) => {
        console.warn('SpeechSynthesis event:', e);
        setIsSpeaking(false);
        if (autoFollowUp && handsFreeRef.current && isOpenRef.current) {
          setTimeout(startListening, 500);
        }
      };

      synthRef.current.speak(utterance);
    } catch (err) {
      console.warn('TTS execution error:', err);
      setIsSpeaking(false);
      if (autoFollowUp && handsFreeRef.current && isOpenRef.current) {
        setTimeout(startListening, 500);
      }
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

  const toggleMicManual = () => {
    if (!recognitionRef.current) {
      alert(language === 'hi' 
        ? 'आपके ब्राउज़र में वॉइस रिकॉग्निशन सपोर्टेड नहीं है। कृपया लिखकर सवाल पूछें।' 
        : 'Voice input is not supported on this browser. Please type your query.');
      return;
    }

    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };

  // Process query against Google Gemini AI API (or Local Knowledge Base)
  const handleUserQuery = async (queryText) => {
    if (!queryText || !queryText.trim()) return;
    const cleanQuery = queryText.trim();

    // Add user message to log
    const newChatLog = [...chatLog, { sender: 'user', text: queryText }];
    setChatLog(newChatLog);
    setUserInput('');
    setIsThinking(true);

    let answerText = "";

    // 1. Try Google Gemini API if configured
    if (settings.geminiApiKey) {
      try {
        const systemPrompt = `You are Pooja Sharma, Senior Academic Counselor at Institute APEX, Jind (#1257, Urban Estate, Near HUDA Ground, Jind-126102, Haryana. Phone: 94677-52374, 01681-247700). 
Coaching offered: NEET (Medical) Class 11, 12, Droppers (100% NCERT mastery, DPPs, OMR tests); IIT-JEE (Main & Adv) 11, 12; Foundation 9th-10th (Olympiads, NTSE, CBSE/HBSE Boards). Scholarships: APEX Scholarship Admission Test (ASAT) offers up to 90% fee scholarship. Free 2-3 day trial demo classes available. Small batches (25-30 students).
Answer the following student query warmly, politely, and concisely in 2-3 sentences in ${language === 'hi' ? 'Hindi (Devanagari script)' : 'English'}. Query: "${cleanQuery}"`;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${settings.geminiApiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        });

        if (response.ok) {
          const data = await response.json();
          const generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (generated && generated.trim()) {
            answerText = generated.trim();
          }
        }
      } catch (err) {
        console.warn('Gemini API query error, using local knowledge base fallback:', err);
      }
    }

    // 2. Fallback to Local Knowledge Base if Gemini API is not configured or failed
    if (!answerText) {
      const lower = cleanQuery.toLowerCase();
      let matchedItem = null;
      let highestScore = 0;

      for (const item of KNOWLEDGE_BASE) {
        let score = 0;
        for (const kw of item.keywords) {
          if (lower.includes(kw.toLowerCase())) {
            score += 1;
          }
        }
        if (score > highestScore) {
          highestScore = score;
          matchedItem = item;
        }
      }

      if (matchedItem && highestScore > 0) {
        answerText = language === 'hi' ? matchedItem.answerHi : matchedItem.answerEn;
      } else {
        answerText = language === 'hi'
          ? "धन्यवाद! अधिक जानकारी, सटीक बैच टाइमिंग और व्यक्तिगत मार्गदर्शन के लिए आप हमारे हेल्पलाइन नंबर 94677-52374 पर कॉल कर सकते हैं या हमारे जींद इंस्टीट्यूट (हुड्डा ग्राउंड के पास) पधार सकते हैं। क्या आप कुछ और जानना चाहते हैं?"
          : "Thank you! For specific queries, batch timings, or instant admissions guidance, please call our counselor directly at 94677-52374 or visit our institute near HUDA Ground, Jind. Would you like to know anything else?";
      }
    }

    setIsThinking(false);

    const counselorMsg = {
      sender: 'counselor',
      textHi: answerText,
      textEn: answerText
    };

    setChatLog([...newChatLog, counselorMsg]);

    // Speak response with automatic follow-up listening enabled
    speakText(answerText, language, true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    handleUserQuery(userInput);
  };

  const openAvatar = () => {
    setIsOpen(true);
    // Greet student with female voice and enter hands-free listening
    setTimeout(() => {
      const greeting = language === 'hi' 
        ? "नमस्ते! मैं इंस्टीट्यूट APEX जींद से आपकी सीनियर काउंसलर पूजा शर्मा हूँ। मैं NEET, IIT-JEE या स्कूल फाउंडेशन में आपकी क्या सहायता कर सकती हूँ?"
        : "Hello! I am Pooja Sharma, Senior Academic Counselor from Institute APEX, Jind. How can I assist you with NEET, IIT-JEE, or admissions today?";
      speakText(greeting, language, true);
    }, 300);
  };

  const closeAvatar = () => {
    stopSpeaking();
    stopListening();
    setIsOpen(false);
  };

  const toggleLanguage = (lang) => {
    stopSpeaking();
    stopListening();
    setLanguage(lang);
    const switchMsg = lang === 'hi'
      ? "नमस्ते! अब आप मुझसे हिंदी में बात कर सकते हैं। पूछिए अपना सवाल!"
      : "Switched to English! Feel free to ask your questions.";
    speakText(switchMsg, lang, true);
  };

  const quickQuestions = language === 'hi' ? [
    { label: "NEET बैच जानकारी", query: "NEET बैच की जानकारी दीजिए" },
    { label: "IIT-JEE कोचिंग", query: "IIT-JEE कोचिंग की जानकारी दीजिए" },
    { label: "स्कॉलरशिप टेस्ट (ASAT)", query: "स्कॉलरशिप टेस्ट ASAT क्या है?" },
    { label: "फ्री डेमो क्लास", query: "फ्री डेमो क्लास कैसे मिलेगी?" },
    { label: "इंस्टीट्यूट का पता", query: "इंस्टीट्यूट का पता और फोन नंबर क्या है?" }
  ] : [
    { label: "NEET Batches", query: "Tell me about NEET batches" },
    { label: "IIT-JEE Coaching", query: "Tell me about IIT-JEE coaching" },
    { label: "Scholarship Test (ASAT)", query: "What is the ASAT scholarship test?" },
    { label: "Free Demo Class", query: "How to book a free demo class?" },
    { label: "Institute Location", query: "What is the address and contact number?" }
  ];

  const counselorName = language === 'hi' ? "पूजा शर्मा (सीनियर काउंसलर)" : "Pooja Sharma (Sr. Counselor)";

  return (
    <>
      {/* Floating Audio-Wave AI Launcher Bubble */}
      {!isOpen && (
        <div className="counselor-bubble-wrapper">
          <button
            className="counselor-bubble-btn"
            onClick={openAvatar}
            title={language === 'hi' ? "काउंसलर से लाइव बातचीत करें (वॉयस व ऑडियो)" : "Talk to AI Counselor (Live Voice)"}
            aria-label="Academic Counselor"
          >
            <div className="counselor-bubble-img-wrap">
              <picture>
                <source srcSet="/images/counselor_avatar.webp" type="image/webp" />
                <img 
                  src="/images/counselor_avatar.jpg" 
                  alt="Academic Counselor" 
                  className="counselor-bubble-img"
                  loading="lazy"
                />
              </picture>
              <span className="counselor-live-dot" />
            </div>
            <div className="counselor-bubble-text">
              <span className="counselor-bubble-badge">
                <span className="live-pulse" /> {language === 'hi' ? "AI काउंसलर" : "AI Counselor"}
              </span>
              <span className="counselor-bubble-sub">
                {language === 'hi' ? "ऑडियो वॉयस कंसल्टेशन" : "Live Voice Assistant"}
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Main Interactive Audio-Wave AI Counselor Window */}
      {isOpen && (
        <div className="counselor-modal-overlay">
          <div className="counselor-card" role="dialog" aria-label="AI Counselor Consultation">
            
            {/* Window Header */}
            <div className="counselor-header">
              <div className="counselor-header-left">
                <div className="counselor-header-avatar-wrap">
                  <picture>
                    <source srcSet="/images/counselor_avatar.webp" type="image/webp" />
                    <img 
                      src="/images/counselor_avatar.jpg" 
                      alt="Counselor" 
                      className="counselor-header-avatar"
                    />
                  </picture>
                  <span className={`counselor-status-dot ${isSpeaking ? 'speaking' : isListening ? 'listening-dot' : ''}`} />
                </div>
                <div className="counselor-header-info">
                  <h4 className="counselor-name">{counselorName}</h4>
                  <span className="counselor-title">
                    {language === 'hi' ? "इंस्टीट्यूट APEX • ऑडियो वॉयस परामर्श" : "Institute APEX • Voice Consultation"}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="counselor-header-actions">
                {/* Hands-Free Duplex Auto-Listen Toggle */}
                <button
                  className={`handsfree-toggle-btn ${handsFree ? 'active' : ''}`}
                  onClick={() => {
                    const next = !handsFree;
                    setHandsFree(next);
                    if (!next) stopListening();
                  }}
                  title={handsFree 
                    ? (language === 'hi' ? "स्वतः सुनना (ऑटो फॉलो-अप) चालू है" : "Auto-Listen (Hands-Free) is ON") 
                    : (language === 'hi' ? "स्वतः सुनना बंद है (माइक दबाकर बोलें)" : "Auto-Listen is OFF")}
                >
                  <span className="hf-dot" />
                  <span>{handsFree ? (language === 'hi' ? "ऑटो-लिसन" : "Hands-Free") : (language === 'hi' ? "मैनुअल" : "Manual")}</span>
                </button>

                {/* Language Switch */}
                <div className="counselor-lang-toggle" title="Switch Language">
                  <button 
                    className={`lang-btn ${language === 'hi' ? 'active' : ''}`} 
                    onClick={() => toggleLanguage('hi')}
                  >
                    हिंदी
                  </button>
                  <button 
                    className={`lang-btn ${language === 'en' ? 'active' : ''}`} 
                    onClick={() => toggleLanguage('en')}
                  >
                    EN
                  </button>
                </div>

                {/* Mute Toggle */}
                <button 
                  className={`counselor-icon-btn ${isMuted ? 'muted' : ''}`}
                  onClick={() => {
                    if (!isMuted) stopSpeaking();
                    setIsMuted(!isMuted);
                  }}
                  title={isMuted ? "Unmute Voice" : "Mute Voice"}
                  aria-label="Toggle Mute"
                >
                  {isMuted ? (
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H9z" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  )}
                </button>

                {/* Close Button */}
                <button 
                  className="counselor-icon-btn close"
                  onClick={closeAvatar}
                  title="Close"
                  aria-label="Close"
                >
                  <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Audio Wave Avatar Viewport (Modern Dignified Voice Orb Presentation) */}
            <div className="counselor-video-stage audio-wave-stage">
              <div className="audio-wave-orb-wrapper">
                
                {/* Acoustic Sound Wave Rings (Animate around avatar when speaking or listening) */}
                <div className={`audio-wave-rings ${isSpeaking ? 'speaking-waves' : isListening ? 'listening-waves' : 'idle-waves'}`}>
                  <span className="wave-ring ring-1" />
                  <span className="wave-ring ring-2" />
                  <span className="wave-ring ring-3" />
                </div>

                {/* Clean Professional Counselor Portrait */}
                <div className="audio-counselor-portrait">
                  <picture>
                    <source srcSet="/images/counselor_avatar.webp" type="image/webp" />
                    <img 
                      src="/images/counselor_avatar.jpg" 
                      alt="Pooja Sharma - Academic Counselor" 
                      className="audio-counselor-img"
                    />
                  </picture>
                </div>

                {/* Dynamic Multi-Bar Spectrum Equalizer */}
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

              {/* HUD Consultation State Badge */}
              <div className={`counselor-hud-badge ${isThinking ? 'hud-thinking' : isListening ? 'hud-listening' : isSpeaking ? 'hud-speaking' : ''}`}>
                <span className={`hud-rec-dot ${isThinking ? 'thinking-pulse' : isSpeaking ? 'active' : isListening ? 'listening-pulse' : ''}`} />
                <span>
                  {isThinking
                    ? (language === 'hi' ? "AI सोच रही हैं..." : "AI Thinking...")
                    : isSpeaking 
                      ? (language === 'hi' ? "काउंसलर बोल रही हैं..." : "Counselor Speaking...") 
                      : isListening 
                        ? (language === 'hi' ? "सुन रही हूँ, बोलिए..." : "Listening... Speak now")
                        : (language === 'hi' ? "ऑडियो वॉयस परामर्श" : "Voice Consultation")}
                </span>
              </div>

              {/* Subtitle Teleprompter Banner */}
              <div className="counselor-teleprompter">
                <div className="teleprompter-top-row">
                  <span className="teleprompter-label">
                    {isThinking
                      ? (language === 'hi' ? "AI विश्लेषण:" : "AI Processing:")
                      : isListening 
                        ? (language === 'hi' ? "आपकी आवाज़:" : "Your Voice:")
                        : (language === 'hi' ? "काउंसलर का उत्तर:" : "Counselor:")}
                  </span>
                  {handsFree && (
                    <span className="teleprompter-hf-badge">
                      {isListening ? (language === 'hi' ? "● माइक खुला है" : "● Mic Active") : (language === 'hi' ? "ऑटो फॉलो-अप" : "Auto Follow-up")}
                    </span>
                  )}
                </div>
                <p className="teleprompter-text">
                  {isThinking
                    ? (language === 'hi' ? "आपके प्रश्न का उत्तर तैयार किया जा रहा है..." : "Analyzing query and preparing response...")
                    : isListening 
                      ? (language === 'hi' ? "मैं आपकी बात सुन रही हूँ, अपना सवाल पूछिए..." : "Listening... Speak your question now...")
                      : currentSubtitle || (language === 'hi' 
                          ? "नमस्ते! NEET, IIT-JEE या स्कॉलरशिप संबंधी सहायता के लिए पूछिए।" 
                          : "Hello! Ask any question about NEET, IIT-JEE, or admissions.")}
                </p>
              </div>
            </div>

            {/* Chat Transcript / Dialogue Scroll */}
            <div className="counselor-chat-stream">
              {chatLog.map((msg, idx) => (
                <div key={idx} className={`counselor-bubble-row ${msg.sender === 'user' ? 'user-row' : 'counselor-row'}`}>
                  {msg.sender === 'counselor' && (
                    <div className="row-avatar">
                      <img src="/images/counselor_avatar.webp" alt="Avatar" />
                    </div>
                  )}
                  <div className={`counselor-chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'counselor-bubble'}`}>
                    <p>
                      {msg.sender === 'user' 
                        ? msg.text 
                        : (language === 'hi' ? msg.textHi : msg.textEn)}
                    </p>
                    {msg.sender === 'counselor' && (
                      <button 
                        className="repeat-audio-btn"
                        onClick={() => speakText(language === 'hi' ? msg.textHi : msg.textEn, language, false)}
                        title="Replay Voice"
                      >
                        <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: 12, height: 12 }}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        <span>{language === 'hi' ? "सुनिए" : "Listen"}</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Suggestion Chips */}
            <div className="counselor-chips-container">
              <span className="chips-title">{language === 'hi' ? "त्वरित सवाल (क्लिक करें):" : "Quick Questions (Click to Ask):"}</span>
              <div className="chips-scroll">
                {quickQuestions.map((chip, idx) => (
                  <button 
                    key={idx} 
                    className="counselor-chip"
                    onClick={() => handleUserQuery(chip.query)}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Continuous Voice & Text Input Section */}
            <form className="counselor-input-form" onSubmit={handleFormSubmit}>
              <button 
                type="button"
                className={`counselor-mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleMicManual}
                title={isListening 
                  ? (language === 'hi' ? "सुनना रोकें" : "Pause listening") 
                  : (language === 'hi' ? "बोलिए (माइक)" : "Speak your question (Mic)")}
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
                placeholder={isListening 
                  ? (language === 'hi' ? "सुन रही हूँ, बोलिए..." : "Listening... speak now") 
                  : (language === 'hi' ? "यहाँ सवाल लिखें या बोलें..." : "Type or speak your question...")}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
              />

              <button 
                type="submit" 
                className="counselor-send-btn"
                disabled={!userInput.trim()}
                title="Send Question"
                aria-label="Send"
              >
                <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: 16, height: 16 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </form>

            {/* Direct Connect Quick Actions */}
            <div className="counselor-quick-footer">
              <a 
                href={`tel:${(settings.phone || '94677-52374').replace(/[^0-9+]/g, '')}`} 
                className="counselor-footer-action call"
              >
                <svg fill="currentColor" viewBox="0 0 24 24" style={{ width: 14, height: 14 }}>
                  <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <span>{language === 'hi' ? "सीधे कॉल करें" : "Direct Call"}</span>
              </a>

              <a 
                href={`https://wa.me/91${(settings.whatsappNumber || '9467752374').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(language === 'hi' ? 'नमस्ते APEX इंस्टीट्यूट, मुझे कोचिंग एडमिशन के बारे में मार्गदर्शन चाहिए।' : 'Hello APEX Institute, I would like to get admission details.')}`}
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
