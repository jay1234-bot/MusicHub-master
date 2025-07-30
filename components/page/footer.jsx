"use client";
import Link from "next/link";
import { Instagram, Twitter, Github, Send, Music, Heart, Sparkles, Mail, Phone, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const socials = [
  { href: "https://instagram.com/", label: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-500" },
  { href: "https://twitter.com/", label: "Twitter", icon: Twitter, color: "from-blue-400 to-blue-600" },
  { href: "https://github.com/", label: "GitHub", icon: Github, color: "from-gray-600 to-gray-800" },
  { href: "https://t.me/censored_politicss", label: "Telegram", icon: Send, color: "from-blue-500 to-blue-700" },
];

const footerLinks = [
  { name: "About", href: "#" },
  { name: "Privacy", href: "#" },
  { name: "Terms", href: "#" },
  { name: "Contact", href: "#" },
];

const contactInfo = [
  { icon: Mail, text: "krishan432@fearlessmails.com", href: "mailto:krishan432@fearlessmails.com" },
  { icon: Phone, text: "Nhi Dunga", href: "#" },
  { icon: MapPin, text: "Aapke Dil me", href: "#" },
];

export default function Footer() {
  return (
    <footer className="w-full border-t border-white/20 dark:border-slate-700/30 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl py-12 px-6 md:px-20 lg:px-32 mt-8">
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-2">
              <motion.div
                className="p-2 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Music className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MusicHub
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Discover the perfect soundtrack for every moment. From trending hits to relaxing melodies, 
              find your rhythm with MusicHub.
            </p>
            <motion.div 
              className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-500"
              whileHover={{ scale: 1.05 }}
            >
              <Heart className="w-4 h-4 text-red-500" />
              <span>Made with love by</span>
              <a 
                href="https://t.me/censored_politicss" 
                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                krishan
              </a>
            </motion.div>
          </motion.div>

          {/* Quick Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Quick Links</h4>
            <div className="space-y-2">
              {footerLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className="block text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Contact Info */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Contact</h4>
            <div className="space-y-3">
              {contactInfo.map((info, index) => (
                <motion.a
                  key={info.text}
                  href={info.href}
                  className="flex items-center gap-3 text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  whileHover={{ x: 5 }}
                >
                  <info.icon className="w-4 h-4" />
                  <span className="text-sm">{info.text}</span>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Social Links */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h4 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Follow Us</h4>
            <div className="flex gap-3">
              {socials.map(({ href, label, icon: Icon, color }, index) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/30 hover:shadow-lg transition-all duration-300"
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 5,
                    boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)"
                  }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  aria-label={label}
                >
                  <Icon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Newsletter Section */}
        <motion.div 
          className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-3xl p-6 mb-8 border border-white/20 dark:border-slate-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
                Stay Updated
              </h3>
              <Sparkles className="w-5 h-5 text-pink-500" />
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Get the latest music updates and exclusive content delivered to your inbox.
            </p>
            <div className="flex gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-white/30 dark:border-slate-700/30 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <motion.button
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Subscribe
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 border-t border-white/20 dark:border-slate-700/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            © 2024 MusicHub. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
            <motion.a 
              href="#" 
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Terms of Service
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
              whileHover={{ scale: 1.05 }}
            >
              Cookie Policy
            </motion.a>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
