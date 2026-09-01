import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  'en-IN': {
    // Navigation
    nav: {
      home: 'Home',
      chat: 'Chat',
      caseLawSearch: 'Case Law Search',
      lawyers: 'Lawyers',
      documentTemplates: 'Document Templates',
      legalGlossary: 'Legal Glossary',
      videoTutorials: 'Video Tutorials',
      legalQuiz: 'Legal Quiz',
      adminLogin: 'Admin Login',
    },
    // Home Page
    home: {
      title: 'Kanoonu AI',
      subtitle: "India's Smart Legal Companion",
      description: 'Get instant legal answers, search case law, and connect with expert lawyers—all powered by AI.',
      startChat: 'Start Chat',
      findLawyers: 'Find Lawyers',
      whyTitle: 'Why Kanoonu AI?',
      whySubtitle: 'Your trusted partner for all legal queries and resources',
      features: {
        ai: {
          title: 'AI-Powered Legal Assistant',
          desc: 'Get instant answers to your legal questions powered by advanced AI trained on Indian law.',
        },
        search: {
          title: 'Case Law Search',
          desc: 'Search through thousands of Indian legal cases and precedents quickly and accurately.',
        },
        lawyers: {
          title: 'Find Expert Lawyers',
          desc: 'Connect with verified lawyers specializing in various areas of Indian law.',
        },
        trusted: {
          title: 'Trusted & Reliable',
          desc: 'Built with accuracy and reliability in mind, following Indian legal frameworks.',
        },
      },
      developedBy: 'Developed By',
    },
    // Chatbot
    chat: {
      title: 'AI Legal Assistant',
      online: 'Online • Ready to help',
      placeholder: 'Ask me about Indian law...',
      thinking: 'AI is thinking...',
      listening: 'Listening...',
      speaking: 'Speaking...',
      readAloud: 'Read aloud',
      stop: 'Stop',
      welcome: 'Welcome to Kanoonu AI',
      welcomeDesc: 'Start a conversation by asking a legal question below.',
      tip: '💡 Be specific with your legal questions for better answers',
    },
    // Lawyers
    lawyers: {
      title: 'Find Expert Lawyers',
      subtitle: 'Connect with verified lawyers specializing in various areas of Indian law',
      experience: 'Experience',
      bookConsultation: 'Book Consultation',
      bookingTitle: 'Book Consultation',
      yourName: 'Your Name',
      phoneNumber: 'Phone Number',
      preferredDate: 'Preferred Date',
      requestConsultation: 'Request Consultation',
      enterName: 'Enter your name',
      enterPhone: 'Enter your phone number',
    },
    // Case Law Search
    caseLaw: {
      title: 'Case Law Search',
      subtitle: 'Search through Indian legal cases and precedents',
      placeholder: 'Enter your legal query...',
      search: 'Search',
      searching: 'Searching...',
      results: 'Search Results',
      viewCase: 'View Case',
      noResults: 'No results found. Try a different search query.',
      enterQuery: 'Enter a search query to find relevant case law.',
    },
    // Admin
    admin: {
      title: 'Admin Dashboard',
      subtitle: 'Manage lawyers database',
      addLawyer: 'Add Lawyer',
      addNewLawyer: 'Add New Lawyer',
      name: 'Name',
      experience: 'Experience',
      phone: 'Phone',
      email: 'Email',
      specialties: 'Specialties (comma-separated)',
      cancel: 'Cancel',
      delete: 'Delete lawyer',
      noLawyers: 'No lawyers added yet. Click "Add Lawyer" to get started.',
      confirmDelete: 'Are you sure you want to delete this lawyer?',
    },
    // Admin Login
    adminLogin: {
      title: 'Admin Login',
      subtitle: 'Enter your credentials to access the admin panel',
      username: 'Username',
      password: 'Password',
      login: 'Login',
      loggingIn: 'Logging in...',
      enterUsername: 'Enter username',
      enterPassword: 'Enter password',
      invalidCredentials: 'Invalid credentials. Please try again.',
    },
    // Footer
    footer: {
      copyright: '© {year} Kanoonu AI. All rights reserved.',
    },
    // Video Call
    videoCall: {
      greeting: 'Namaste, please tell me your Legal query',
      greetingWithName: 'Namaste {name}, please tell me your Legal query',
      thankYou: "Thank you, I'll go through your case and get back to you in touch soon.",
      connecting: 'Connecting...',
      listening: 'Listening...',
      speaking: 'Speaking...',
    },
  },
  'hi-IN': {
    nav: {
      home: 'होम',
      chat: 'चैट',
      caseLawSearch: 'केस लॉ खोज',
      lawyers: 'वकील',
      documentTemplates: 'दस्तावेज़ टेम्प्लेट',
      legalGlossary: 'कानूनी शब्दकोश',
      videoTutorials: 'वीडियो ट्यूटोरियल',
      legalQuiz: 'कानूनी प्रश्नोत्तरी',
      adminLogin: 'एडमिन लॉगिन',
    },
    home: {
      title: 'कानूनू AI',
      subtitle: 'भारत का स्मार्ट कानूनी साथी',
      description: 'तत्काल कानूनी उत्तर प्राप्त करें, केस लॉ खोजें, और विशेषज्ञ वकीलों से जुड़ें—सभी AI द्वारा संचालित।',
      startChat: 'चैट शुरू करें',
      findLawyers: 'वकील खोजें',
      whyTitle: 'कानूनू AI क्यों?',
      whySubtitle: 'सभी कानूनी प्रश्नों और संसाधनों के लिए आपका विश्वसनीय साथी',
      features: {
        ai: {
          title: 'AI-संचालित कानूनी सहायक',
          desc: 'भारतीय कानून पर प्रशिक्षित उन्नत AI द्वारा संचालित अपने कानूनी प्रश्नों के तत्काल उत्तर प्राप्त करें।',
        },
        search: {
          title: 'केस लॉ खोज',
          desc: 'हजारों भारतीय कानूनी मामलों और नजीरों को त्वरित और सटीक रूप से खोजें।',
        },
        lawyers: {
          title: 'विशेषज्ञ वकील खोजें',
          desc: 'भारतीय कानून के विभिन्न क्षेत्रों में विशेषज्ञता रखने वाले सत्यापित वकीलों से जुड़ें।',
        },
        trusted: {
          title: 'विश्वसनीय और भरोसेमंद',
          desc: 'भारतीय कानूनी ढांचे का पालन करते हुए सटीकता और विश्वसनीयता को ध्यान में रखकर बनाया गया।',
        },
      },
      developedBy: 'द्वारा विकसित',
    },
    chat: {
      title: 'AI कानूनी सहायक',
      online: 'ऑनलाइन • मदद के लिए तैयार',
      placeholder: 'मुझसे भारतीय कानून के बारे में पूछें...',
      thinking: 'AI सोच रहा है...',
      listening: 'सुन रहा है...',
      speaking: 'बोल रहा है...',
      readAloud: 'जोर से पढ़ें',
      stop: 'रोकें',
      welcome: 'कानूनू AI में आपका स्वागत है',
      welcomeDesc: 'नीचे एक कानूनी प्रश्न पूछकर बातचीत शुरू करें।',
      tip: '💡 बेहतर उत्तरों के लिए अपने कानूनी प्रश्नों में विशिष्ट रहें',
    },
    lawyers: {
      title: 'विशेषज्ञ वकील खोजें',
      subtitle: 'भारतीय कानून के विभिन्न क्षेत्रों में विशेषज्ञता रखने वाले सत्यापित वकीलों से जुड़ें',
      experience: 'अनुभव',
      bookConsultation: 'परामर्श बुक करें',
      bookingTitle: 'परामर्श बुक करें',
      yourName: 'आपका नाम',
      phoneNumber: 'फोन नंबर',
      preferredDate: 'पसंदीदा तारीख',
      requestConsultation: 'परामर्श का अनुरोध करें',
      enterName: 'अपना नाम दर्ज करें',
      enterPhone: 'अपना फोन नंबर दर्ज करें',
    },
    caseLaw: {
      title: 'केस लॉ खोज',
      subtitle: 'भारतीय कानूनी मामलों और नजीरों को खोजें',
      placeholder: 'अपना कानूनी प्रश्न दर्ज करें...',
      search: 'खोजें',
      searching: 'खोज रहे हैं...',
      results: 'खोज परिणाम',
      viewCase: 'मामला देखें',
      noResults: 'कोई परिणाम नहीं मिला। एक अलग खोज प्रश्न आज़माएं।',
      enterQuery: 'प्रासंगिक केस लॉ खोजने के लिए एक खोज प्रश्न दर्ज करें।',
    },
    admin: {
      title: 'एडमिन डैशबोर्ड',
      subtitle: 'वकील डेटाबेस प्रबंधित करें',
      addLawyer: 'वकील जोड़ें',
      addNewLawyer: 'नया वकील जोड़ें',
      name: 'नाम',
      experience: 'अनुभव',
      phone: 'फोन',
      email: 'ईमेल',
      specialties: 'विशेषज्ञताएं (अल्पविराम से अलग)',
      cancel: 'रद्द करें',
      delete: 'वकील हटाएं',
      noLawyers: 'अभी तक कोई वकील नहीं जोड़ा गया है। शुरू करने के लिए "वकील जोड़ें" पर क्लिक करें।',
      confirmDelete: 'क्या आप वाकई इस वकील को हटाना चाहते हैं?',
    },
    adminLogin: {
      title: 'एडमिन लॉगिन',
      subtitle: 'एडमिन पैनल तक पहुंचने के लिए अपनी साख दर्ज करें',
      username: 'उपयोगकर्ता नाम',
      password: 'पासवर्ड',
      login: 'लॉगिन',
      loggingIn: 'लॉगिन हो रहा है...',
      enterUsername: 'उपयोगकर्ता नाम दर्ज करें',
      enterPassword: 'पासवर्ड दर्ज करें',
      invalidCredentials: 'अमान्य साख। कृपया पुनः प्रयास करें।',
    },
    footer: {
      copyright: '© {year} कानूनू AI। सभी अधिकार सुरक्षित।',
    },
    videoCall: {
      greeting: 'नमस्ते, कृपया मुझे अपनी कानूनी जांच बताएं',
      greetingWithName: 'नमस्ते {name}, कृपया मुझे अपनी कानूनी जांच बताएं',
      thankYou: 'धन्यवाद, मैं आपके मामले को देखूंगा और जल्द ही आपसे संपर्क करूंगा।',
      connecting: 'कनेक्ट हो रहा है...',
      listening: 'सुन रहा है...',
      speaking: 'बोल रहा है...',
    },
  },
  'kn-IN': {
    nav: {
      home: 'ಮುಖಪುಟ',
      chat: 'ಚಾಟ್',
      caseLawSearch: 'ಕೇಸ್ ಲಾ ಹುಡುಕಾಟ',
      lawyers: 'ವಕೀಲರು',
      documentTemplates: 'ದಾಖಲೆ ಟೆಂಪ್ಲೇಟ್‌ಗಳು',
      legalGlossary: 'ಕಾನೂನು ಶಬ್ದಕೋಶ',
      videoTutorials: 'ವೀಡಿಯೊ ಟ್ಯುಟೋರಿಯಲ್',
      legalQuiz: 'ಕಾನೂನು ರಸಪ್ರಶ್ನೆ',
      adminLogin: 'ಆಡ್ಮಿನ್ ಲಾಗಿನ್',
    },
    home: {
      title: 'ಕಾನೂನು AI',
      subtitle: 'ಭಾರತದ ಸ್ಮಾರ್ಟ್ ಕಾನೂನು ಸಂಗಾತಿ',
      description: 'ತ್ವರಿತ ಕಾನೂನು ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ, ಕೇಸ್ ಲಾ ಹುಡುಕಿ, ಮತ್ತು ತಜ್ಞ ವಕೀಲರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ—ಎಲ್ಲವೂ AI ನಿಂದ ನಡೆಸಲ್ಪಡುತ್ತದೆ।',
      startChat: 'ಚಾಟ್ ಪ್ರಾರಂಭಿಸಿ',
      findLawyers: 'ವಕೀಲರು ಹುಡುಕಿ',
      whyTitle: 'ಕಾನೂನು AI ಏಕೆ?',
      whySubtitle: 'ಎಲ್ಲಾ ಕಾನೂನು ಪ್ರಶ್ನೆಗಳು ಮತ್ತು ಸಂಪನ್ಮೂಲಗಳಿಗೆ ನಿಮ್ಮ ವಿಶ್ವಾಸಾರ್ಹ ಸಂಗಾತಿ',
      features: {
        ai: {
          title: 'AI-ಚಾಲಿತ ಕಾನೂನು ಸಹಾಯಕ',
          desc: 'ಭಾರತೀಯ ಕಾನೂನಿನಲ್ಲಿ ತರಬೇತಿ ಪಡೆದ ಸುಧಾರಿತ AI ನಿಂದ ನಡೆಸಲ್ಪಡುವ ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಗಳಿಗೆ ತ್ವರಿತ ಉತ್ತರಗಳನ್ನು ಪಡೆಯಿರಿ।',
        },
        search: {
          title: 'ಕೇಸ್ ಲಾ ಹುಡುಕಾಟ',
          desc: 'ಸಾವಿರಾರು ಭಾರತೀಯ ಕಾನೂನು ಪ್ರಕರಣಗಳು ಮತ್ತು ಮುನ್ನಡೆಗಳ ಮೂಲಕ ತ್ವರಿತವಾಗಿ ಮತ್ತು ನಿಖರವಾಗಿ ಹುಡುಕಿ।',
        },
        lawyers: {
          title: 'ತಜ್ಞ ವಕೀಲರು ಹುಡುಕಿ',
          desc: 'ಭಾರತೀಯ ಕಾನೂನಿನ ವಿವಿಧ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಪರಿಣತಿ ಹೊಂದಿರುವ ಪರಿಶೀಲಿಸಿದ ವಕೀಲರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ।',
        },
        trusted: {
          title: 'ವಿಶ್ವಾಸಾರ್ಹ ಮತ್ತು ನಂಬಲರ್ಹ',
          desc: 'ಭಾರತೀಯ ಕಾನೂನು ಚೌಕಟ್ಟುಗಳನ್ನು ಅನುಸರಿಸುತ್ತಾ ನಿಖರತೆ ಮತ್ತು ವಿಶ್ವಾಸಾರ್ಹತೆಯನ್ನು ಮನಸ್ಸಿನಲ್ಲಿಟ್ಟುಕೊಂಡು ನಿರ್ಮಿಸಲಾಗಿದೆ।',
        },
      },
      developedBy: 'ಅಭಿವೃದ್ಧಿಪಡಿಸಿದವರು',
    },
    chat: {
      title: 'AI ಕಾನೂನು ಸಹಾಯಕ',
      online: 'ಆನ್‌ಲೈನ್ • ಸಹಾಯಕ್ಕೆ ಸಿದ್ಧ',
      placeholder: 'ನನ್ನನ್ನು ಭಾರತೀಯ ಕಾನೂನಿನ ಬಗ್ಗೆ ಕೇಳಿ...',
      thinking: 'AI ಯೋಚಿಸುತ್ತಿದೆ...',
      listening: 'ಕೇಳುತ್ತಿದೆ...',
      speaking: 'ಮಾತನಾಡುತ್ತಿದೆ...',
      readAloud: 'ಜೋರಾಗಿ ಓದಿ',
      stop: 'ನಿಲ್ಲಿಸಿ',
      welcome: 'ಕಾನೂನು AI ಗೆ ಸ್ವಾಗತ',
      welcomeDesc: 'ಕೆಳಗೆ ಕಾನೂನು ಪ್ರಶ್ನೆಯನ್ನು ಕೇಳುವ ಮೂಲಕ ಸಂಭಾಷಣೆಯನ್ನು ಪ್ರಾರಂಭಿಸಿ।',
      tip: '💡 ಉತ್ತಮ ಉತ್ತರಗಳಿಗಾಗಿ ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಗಳಲ್ಲಿ ನಿರ್ದಿಷ್ಟವಾಗಿರಿ',
    },
    lawyers: {
      title: 'ತಜ್ಞ ವಕೀಲರು ಹುಡುಕಿ',
      subtitle: 'ಭಾರತೀಯ ಕಾನೂನಿನ ವಿವಿಧ ಕ್ಷೇತ್ರಗಳಲ್ಲಿ ಪರಿಣತಿ ಹೊಂದಿರುವ ಪರಿಶೀಲಿಸಿದ ವಕೀಲರೊಂದಿಗೆ ಸಂಪರ್ಕಿಸಿ',
      experience: 'ಅನುಭವ',
      bookConsultation: 'ಸಲಹೆ ಬುಕ್ ಮಾಡಿ',
      bookingTitle: 'ಸಲಹೆ ಬುಕ್ ಮಾಡಿ',
      yourName: 'ನಿಮ್ಮ ಹೆಸರು',
      phoneNumber: 'ಫೋನ್ ಸಂಖ್ಯೆ',
      preferredDate: 'ಆದ್ಯತೆಯ ದಿನಾಂಕ',
      requestConsultation: 'ಸಲಹೆಯನ್ನು ವಿನಂತಿಸಿ',
      enterName: 'ನಿಮ್ಮ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
      enterPhone: 'ನಿಮ್ಮ ಫೋನ್ ಸಂಖ್ಯೆಯನ್ನು ನಮೂದಿಸಿ',
    },
    caseLaw: {
      title: 'ಕೇಸ್ ಲಾ ಹುಡುಕಾಟ',
      subtitle: 'ಭಾರತೀಯ ಕಾನೂನು ಪ್ರಕರಣಗಳು ಮತ್ತು ಮುನ್ನಡೆಗಳನ್ನು ಹುಡುಕಿ',
      placeholder: 'ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ...',
      search: 'ಹುಡುಕಿ',
      searching: 'ಹುಡುಕುತ್ತಿದೆ...',
      results: 'ಹುಡುಕಾಟ ಫಲಿತಾಂಶಗಳು',
      viewCase: 'ಪ್ರಕರಣವನ್ನು ವೀಕ್ಷಿಸಿ',
      noResults: 'ಯಾವುದೇ ಫಲಿತಾಂಶಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಬೇರೆ ಹುಡುಕಾಟ ಪ್ರಶ್ನೆಯನ್ನು ಪ್ರಯತ್ನಿಸಿ।',
      enterQuery: 'ಸಂಬಂಧಿತ ಕೇಸ್ ಲಾ ಹುಡುಕಲು ಹುಡುಕಾಟ ಪ್ರಶ್ನೆಯನ್ನು ನಮೂದಿಸಿ।',
    },
    admin: {
      title: 'ಆಡ್ಮಿನ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್',
      subtitle: 'ವಕೀಲ ಡೇಟಾಬೇಸ್ ನಿರ್ವಹಿಸಿ',
      addLawyer: 'ವಕೀಲ ಸೇರಿಸಿ',
      addNewLawyer: 'ಹೊಸ ವಕೀಲ ಸೇರಿಸಿ',
      name: 'ಹೆಸರು',
      experience: 'ಅನುಭವ',
      phone: 'ಫೋನ್',
      email: 'ಇಮೇಲ್',
      specialties: 'ವಿಶೇಷತೆಗಳು (ಅಲ್ಪವಿರಾಮದಿಂದ ಬೇರ್ಪಡಿಸಲಾಗಿದೆ)',
      cancel: 'ರದ್ದುಮಾಡಿ',
      delete: 'ವಕೀಲ ಅಳಿಸಿ',
      noLawyers: 'ಇನ್ನೂ ಯಾವುದೇ ವಕೀಲರು ಸೇರಿಸಲಾಗಿಲ್ಲ. ಪ್ರಾರಂಭಿಸಲು "ವಕೀಲ ಸೇರಿಸಿ" ಕ್ಲಿಕ್ ಮಾಡಿ।',
      confirmDelete: 'ನೀವು ಖಚಿತವಾಗಿ ಈ ವಕೀಲರನ್ನು ಅಳಿಸಲು ಬಯಸುವಿರಾ?',
    },
    adminLogin: {
      title: 'ಆಡ್ಮಿನ್ ಲಾಗಿನ್',
      subtitle: 'ಆಡ್ಮಿನ್ ಪ್ಯಾನಲ್ ಅನ್ನು ಪ್ರವೇಶಿಸಲು ನಿಮ್ಮ ರುಜುವಾತುಗಳನ್ನು ನಮೂದಿಸಿ',
      username: 'ಬಳಕೆದಾರ ಹೆಸರು',
      password: 'ಪಾಸ್‌ವರ್ಡ್',
      login: 'ಲಾಗಿನ್',
      loggingIn: 'ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ...',
      enterUsername: 'ಬಳಕೆದಾರ ಹೆಸರನ್ನು ನಮೂದಿಸಿ',
      enterPassword: 'ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ',
      invalidCredentials: 'ಅಮಾನ್ಯ ರುಜುವಾತುಗಳು। ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ।',
    },
    footer: {
      copyright: '© {year} ಕಾನೂನು AI. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.',
    },
    videoCall: {
      greeting: 'ನಮಸ್ಕಾರ, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಯನ್ನು ಹೇಳಿ',
      greetingWithName: 'ನಮಸ್ಕಾರ {name}, ದಯವಿಟ್ಟು ನಿಮ್ಮ ಕಾನೂನು ಪ್ರಶ್ನೆಯನ್ನು ಹೇಳಿ',
      thankYou: 'ಧನ್ಯವಾದಗಳು, ನಾನು ನಿಮ್ಮ ಪ್ರಕರಣವನ್ನು ಪರಿಶೀಲಿಸುತ್ತೇನೆ ಮತ್ತು ಶೀಘ್ರದಲ್ಲೇ ನಿಮ್ಮೊಂದಿಗೆ ಸಂಪರ್ಕಿಸುತ್ತೇನೆ.',
      connecting: 'ಸಂಪರ್ಕಿಸುತ್ತಿದೆ...',
      listening: 'ಕೇಳುತ್ತಿದೆ...',
      speaking: 'ಮಾತನಾಡುತ್ತಿದೆ...',
    },
  },
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('kanoonu-language');
    return saved || 'en-IN';
  });

  useEffect(() => {
    localStorage.setItem('kanoonu-language', language);
  }, [language]);

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      value = value?.[k];
    }
    if (!value || value === key) return key;

    // Replace placeholders like {name} with actual values
    if (params && typeof value === 'string') {
      return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
        return params[paramKey] !== undefined ? params[paramKey] : match;
      });
    }

    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

