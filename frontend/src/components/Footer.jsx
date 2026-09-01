import { Link } from 'react-router-dom';
import { Scale } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../contexts/LanguageContext';

function Footer() {
  const { t } = useLanguage();
  const footerLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/chat', label: t('nav.chat') },
    { path: '/case-law-search', label: t('nav.caseLawSearch') },
    { path: '/lawyers', label: t('nav.lawyers') },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-strong bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 text-white mt-16 border-t border-white/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 mb-4 md:mb-0"
          >
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Scale className="h-6 w-6" />
            </motion.div>
            <span className="font-heading text-lg font-bold drop-shadow-lg">
              Kanoonu AI
            </span>
          </motion.div>
          <div className="flex flex-wrap justify-center gap-4 mb-4 md:mb-0">
            {footerLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={link.path}>
                  <motion.span
                    whileHover={{ scale: 1.1, y: -2 }}
                    className="text-white/90 hover:text-white transition-colors cursor-pointer block"
                  >
                    {link.label}
                  </motion.span>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-white/70 text-sm"
          >
            {t('footer.copyright').replace('{year}', new Date().getFullYear())}
          </motion.p>
        </div>
      </div>
    </motion.footer>
  );
}

export default Footer;
