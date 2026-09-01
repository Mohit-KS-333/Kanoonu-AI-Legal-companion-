import { useState } from 'react';
import { Play, Clock, BookOpen, Search, Filter, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

// Video tutorial data - Note: Actual video URLs need to be added
// For now, using placeholder content with instructions
const videoTutorials = {
  'en-IN': [
    {
      id: 1,
      title: 'Understanding Indian Legal System',
      description: 'Learn about the structure of Indian judiciary, courts hierarchy, and legal framework.',
      duration: '1:00',
      category: 'Introduction',
      thumbnail: 'https://via.placeholder.com/400x225/FF6B6B/FFFFFF?text=Legal+System',
      videoUrl: null, // Will be replaced with actual video
      topics: ['Court Structure', 'Judiciary', 'Legal Framework'],
      note: 'Video content will be added soon. This tutorial covers the structure of Indian judiciary including Supreme Court, High Courts, and lower courts.'
    },
    {
      id: 2,
      title: 'How to File a Case in India',
      description: 'Step-by-step guide on filing a case, required documents, and court procedures.',
      duration: '1:00',
      category: 'Court Procedure',
      thumbnail: 'https://via.placeholder.com/400x225/4ECDC4/FFFFFF?text=File+a+Case',
      videoUrl: null,
      topics: ['FIR', 'Charge Sheet', 'Court Filing'],
      note: 'Video content will be added soon. Learn how to file an FIR, understand the charge sheet process, and navigate court filing procedures.'
    },
    {
      id: 3,
      title: 'Property Registration Process',
      description: 'Complete guide to property registration, stamp duty, and required documents.',
      duration: '1:00',
      category: 'Property Law',
      thumbnail: 'https://via.placeholder.com/400x225/95E1D3/FFFFFF?text=Property+Registration',
      videoUrl: null,
      topics: ['Registration', 'Stamp Duty', 'Documents'],
      note: 'Video content will be added soon. Step-by-step guide to property registration including stamp duty calculation and document requirements.'
    },
    {
      id: 4,
      title: 'Understanding Contracts in India',
      description: 'Learn about contract formation, essential elements, and breach of contract.',
      duration: '1:00',
      category: 'Contract Law',
      thumbnail: 'https://via.placeholder.com/400x225/F38181/FFFFFF?text=Contracts',
      videoUrl: null,
      topics: ['Contract Elements', 'Breach', 'Remedies'],
      note: 'Video content will be added soon. Understand essential elements of a valid contract, types of breaches, and available legal remedies.'
    },
    {
      id: 5,
      title: 'Criminal Law Basics',
      description: 'Introduction to criminal law, types of crimes, and criminal procedure in India.',
      duration: '1:00',
      category: 'Criminal Law',
      thumbnail: 'https://via.placeholder.com/400x225/AA96DA/FFFFFF?text=Criminal+Law',
      videoUrl: null,
      topics: ['IPC', 'CrPC', 'Bail'],
      note: 'Video content will be added soon. Introduction to Indian Penal Code (IPC), Code of Criminal Procedure (CrPC), and bail procedures.'
    },
    {
      id: 6,
      title: 'Family Law - Divorce Process',
      description: 'Understanding divorce laws, grounds for divorce, and legal procedures.',
      duration: '1:00',
      category: 'Family Law',
      thumbnail: 'https://via.placeholder.com/400x225/FCBAD3/FFFFFF?text=Divorce',
      videoUrl: null,
      topics: ['Divorce', 'Maintenance', 'Custody'],
      note: 'Video content will be added soon. Learn about divorce laws in India, grounds for divorce, maintenance, and child custody procedures.'
    },
    {
      id: 7,
      title: 'Consumer Rights in India',
      description: 'Learn about consumer protection laws, filing complaints, and your rights.',
      duration: '1:00',
      category: 'Consumer Law',
      thumbnail: 'https://via.placeholder.com/400x225/FFD93D/FFFFFF?text=Consumer+Rights',
      videoUrl: null,
      topics: ['Consumer Act', 'Complaints', 'Redressal'],
      note: 'Video content will be added soon. Understand your consumer rights, how to file complaints, and the consumer redressal mechanism.'
    },
    {
      id: 8,
      title: 'GST Registration Guide',
      description: 'Step-by-step process for GST registration, documents required, and compliance.',
      duration: '1:00',
      category: 'Tax Law',
      thumbnail: 'https://via.placeholder.com/400x225/6BCB77/FFFFFF?text=GST',
      videoUrl: null,
      topics: ['GST', 'Registration', 'Compliance'],
      note: 'Video content will be added soon. Complete guide to GST registration process, required documents, and compliance procedures.'
    }
  ],
  'hi-IN': [
    {
      id: 1,
      title: 'भारतीय कानूनी प्रणाली को समझना',
      description: 'भारतीय न्यायपालिका की संरचना, न्यायालयों की पदानुक्रम और कानूनी ढांचे के बारे में जानें।',
      duration: '1:00',
      category: 'परिचय',
      thumbnail: 'https://via.placeholder.com/400x225/FF6B6B/FFFFFF?text=Legal+System',
      videoUrl: null,
      topics: ['न्यायालय संरचना', 'न्यायपालिका', 'कानूनी ढांचा'],
      note: 'वीडियो सामग्री जल्द ही जोड़ी जाएगी।'
    },
    {
      id: 2,
      title: 'भारत में मुकदमा कैसे दायर करें',
      description: 'मुकदमा दायर करने, आवश्यक दस्तावेजों और न्यायालय प्रक्रियाओं पर चरणबद्ध मार्गदर्शिका।',
      duration: '1:00',
      category: 'न्यायालय प्रक्रिया',
      thumbnail: 'https://via.placeholder.com/400x225/4ECDC4/FFFFFF?text=File+a+Case',
      videoUrl: null,
      topics: ['प्रथम सूचना रिपोर्ट', 'आरोप पत्र', 'न्यायालय दाखिल'],
      note: 'वीडियो सामग्री जल्द ही जोड़ी जाएगी।'
    }
  ],
  'kn-IN': [
    {
      id: 1,
      title: 'ಭಾರತೀಯ ಕಾನೂನು ವ್ಯವಸ್ಥೆಯನ್ನು ಅರ್ಥಮಾಡಿಕೊಳ್ಳುವುದು',
      description: 'ಭಾರತೀಯ ನ್ಯಾಯಾಂಗದ ರಚನೆ, ನ್ಯಾಯಾಲಯಗಳ ಶ್ರೇಣಿ ಮತ್ತು ಕಾನೂನು ಚೌಕಟ್ಟಿನ ಬಗ್ಗೆ ತಿಳಿಯಿರಿ।',
      duration: '1:00',
      category: 'ಪರಿಚಯ',
      thumbnail: 'https://via.placeholder.com/400x225/FF6B6B/FFFFFF?text=Legal+System',
      videoUrl: null,
      topics: ['ನ್ಯಾಯಾಲಯ ರಚನೆ', 'ನ್ಯಾಯಾಂಗ', 'ಕಾನೂನು ಚೌಕಟ್ಟು'],
      note: 'ವೀಡಿಯೊ ವಿಷಯವನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಸೇರಿಸಲಾಗುವುದು।'
    },
    {
      id: 2,
      title: 'ಭಾರತದಲ್ಲಿ ಪ್ರಕರಣವನ್ನು ಹೇಗೆ ದಾಖಲಿಸುವುದು',
      description: 'ಪ್ರಕರಣವನ್ನು ದಾಖಲಿಸುವುದು, ಅಗತ್ಯವಾದ ದಾಖಲೆಗಳು ಮತ್ತು ನ್ಯಾಯಾಲಯದ ಪ್ರಕ್ರಿಯೆಗಳ ಕುರಿತು ಹಂತ ಹಂತದ ಮಾರ್ಗದರ್ಶನ।',
      duration: '1:00',
      category: 'ನ್ಯಾಯಾಲಯ ಪ್ರಕ್ರಿಯೆ',
      thumbnail: 'https://via.placeholder.com/400x225/4ECDC4/FFFFFF?text=File+a+Case',
      videoUrl: null,
      topics: ['ಮೊದಲ ಮಾಹಿತಿ ವರದಿ', 'ದೋಷಾರೋಪಣ ಪತ್ರ', 'ನ್ಯಾಯಾಲಯ ದಾಖಲೆ'],
      note: 'ವೀಡಿಯೊ ವಿಷಯವನ್ನು ಶೀಘ್ರದಲ್ಲೇ ಸೇರಿಸಲಾಗುವುದು।'
    }
  ]
};

const categories = ['All', 'Introduction', 'Court Procedure', 'Property Law', 'Contract Law', 'Criminal Law', 'Family Law', 'Consumer Law', 'Tax Law'];

function VideoTutorials() {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Get videos for current language, fallback to English
  const videos = videoTutorials[language] || videoTutorials['en-IN'];

  // Filter videos
  const filteredVideos = videos.filter(video => {
    const matchesCategory = selectedCategory === 'All' || video.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Play className="h-10 w-10 text-amber-600" />
            Legal Video Tutorials
          </h1>
          <p className="text-lg text-gray-600">
            Learn legal concepts through animated video explanations
          </p>
          <div className="mt-4 p-4 bg-amber-100 border border-amber-300 rounded-lg max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-left">
                <p className="text-sm font-semibold text-amber-800 mb-1">Video Content Notice</p>
                <p className="text-xs text-amber-700">
                  Video tutorials are currently being prepared. Each tutorial will be approximately 1 minute long with animated explanations. 
                  The content structure is ready - videos will be added soon. For now, you can view the detailed descriptions and topics covered.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="card mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tutorials..."
                className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gradient-to-br from-amber-50/50 to-orange-50/50"
              />
            </div>
            <div className="relative">
              <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-12 pr-8 py-3 border border-amber-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-gradient-to-br from-amber-50/50 to-orange-50/50 appearance-none"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredVideos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card hover:shadow-2xl transition-all cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative mb-4 rounded-xl overflow-hidden">
                  <div className="w-full h-48 bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
                    <div className="text-center">
                      <BookOpen className="h-16 w-16 text-amber-600 mx-auto mb-2 opacity-50" />
                      <p className="text-xs text-amber-700 font-semibold">Video Coming Soon</p>
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {video.duration}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="text-xs px-2 py-1 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-full">
                    {video.category}
                  </span>
                </div>
                <h3 className="font-heading text-xl font-bold text-gray-900 mb-2 group-hover:text-amber-600 transition-colors">
                  {video.title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {video.topics.map((topic, idx) => (
                    <span key={idx} className="text-xs px-2 py-1 bg-amber-100 text-amber-700 rounded">
                      {topic}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredVideos.length === 0 && (
          <div className="card text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No tutorials found. Try a different search or category.</p>
          </div>
        )}

        {/* Video Modal */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedVideo(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4">
                  <h2 className="font-heading text-2xl font-bold text-gray-900 mb-2">
                    {selectedVideo.title}
                  </h2>
                  <p className="text-gray-600">{selectedVideo.description}</p>
                </div>
                
                {/* Video Placeholder */}
                <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <div className="text-center">
                    <BookOpen className="h-24 w-24 text-amber-600 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">Video Content Coming Soon</p>
                    <p className="text-sm text-gray-600 max-w-md mx-auto">
                      {selectedVideo.note || 'This tutorial video is currently being prepared and will be available soon.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {selectedVideo.topics.map((topic, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                        {topic}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedVideo(null)}
                    className="px-4 py-2 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default VideoTutorials;
