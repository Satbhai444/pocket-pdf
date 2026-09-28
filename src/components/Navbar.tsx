"use client";

import { useState, useEffect } from "react";
import { Menu, Code, Bell, History, Moon, Sun, Globe, X, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [historyFiles, setHistoryFiles] = useState<{name: string, gadget: string, time: string}[]>([]);
  const [isDark, setIsDark] = useState(false);
  const { lang, setLang, t } = useLanguage();

  useEffect(() => {
    if (historyOpen) {
      try {
        const hist = JSON.parse(localStorage.getItem("4d-history") || "[]");
        setHistoryFiles(hist);
      } catch (e) {}
    }
  }, [historyOpen]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <nav className={`w-full ${isDark ? 'bg-slate-900 text-white border-white' : 'bg-white border-black text-black'} border-b-4 px-3 sm:px-6 py-3 sm:py-4 flex justify-between items-center z-50 sticky top-0 manga-shadow-sm transition-colors`}>
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3 cursor-pointer group shrink-0">
          <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full bg-doraemon-blue border-[2px] sm:border-[3px] border-black flex items-center justify-center group-hover:bg-doraemon-red transition-colors">
             <Bell size={16} className="sm:w-5 sm:h-5 text-yellow-400 fill-yellow-400 group-hover:animate-bounce" />
          </div>
          <span className="font-[family-name:var(--font-bangers)] text-xl sm:text-3xl tracking-widest text-doraemon-blue group-hover:text-doraemon-red transition-colors pt-0.5 sm:pt-1">
            4D POCKET
          </span>
        </Link>

        {/* Center Links - Desktop */}
        <div className="hidden md:flex gap-6 lg:gap-8 font-bold text-sm uppercase tracking-widest">
          <Link href="/" className="hover:text-doraemon-red hover:underline decoration-4 underline-offset-4 transition-all">{t("gadgets")}</Link>
          <Link href="/privacy" className="hover:text-doraemon-blue hover:underline decoration-4 underline-offset-4 transition-all">{t("privacy")}</Link>
          <Link href="/how-it-works" className="hover:text-doraemon-yellow hover:underline decoration-4 underline-offset-4 transition-all">{t("howItWorks")}</Link>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-1.5 sm:gap-3">
          <button 
            onClick={() => setLang(lang === "EN" ? "HI" : (lang === "HI" ? "JA" : "EN"))} 
            className="bg-teal-400 text-black p-1.5 sm:p-2.5 rounded-full border-[2px] sm:border-[3px] border-black manga-shadow-sm font-bold text-[10px] sm:text-xs hover:-translate-y-1 transition-all flex items-center gap-0.5 sm:gap-1"
          >
            <Globe size={14} className="sm:w-4 sm:h-4" /> {lang}
          </button>
          
          <button 
            onClick={toggleTheme} 
            className="bg-purple-500 text-white p-1.5 sm:p-2.5 rounded-full border-[2px] sm:border-[3px] border-black manga-shadow-sm font-bold text-xs hover:-translate-y-1 transition-all"
          >
            {isDark ? <Sun size={14} className="sm:w-4 sm:h-4" /> : <Moon size={14} className="sm:w-4 sm:h-4" />}
          </button>

          <button 
            onClick={() => setHistoryOpen(true)} 
            className="bg-orange-400 text-black p-1.5 sm:p-2.5 rounded-full border-[2px] sm:border-[3px] border-black manga-shadow-sm font-bold text-xs hover:-translate-y-1 transition-all"
          >
            <History size={14} className="sm:w-4 sm:h-4" />
          </button>

          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden lg:flex bg-yellow-400 text-black px-4 py-2 rounded-full border-[3px] border-black manga-shadow-sm font-bold text-sm hover:-translate-y-1 hover:manga-shadow transition-all items-center gap-2 uppercase tracking-widest"
          >
            <Code size={16} /> {t("source")}
          </a>
          
          {/* Mobile Hamburger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
            className={`md:hidden ${isDark ? 'bg-slate-700' : 'bg-gray-100'} p-1.5 sm:p-2 rounded-lg border-[2px] sm:border-[3px] border-black manga-shadow-sm`}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden fixed top-[56px] left-0 right-0 bg-white text-black border-b-4 border-black z-40 manga-shadow-lg"
          >
            <div className="flex flex-col">
              <Link href="/" onClick={closeMobileMenu} className="flex items-center justify-between px-6 py-4 font-bold text-sm uppercase tracking-widest border-b-2 border-gray-200 hover:bg-blue-50 transition-colors">
                {t("gadgets")} <ChevronRight size={18} />
              </Link>
              <Link href="/privacy" onClick={closeMobileMenu} className="flex items-center justify-between px-6 py-4 font-bold text-sm uppercase tracking-widest border-b-2 border-gray-200 hover:bg-blue-50 transition-colors">
                {t("privacy")} <ChevronRight size={18} />
              </Link>
              <Link href="/how-it-works" onClick={closeMobileMenu} className="flex items-center justify-between px-6 py-4 font-bold text-sm uppercase tracking-widest border-b-2 border-gray-200 hover:bg-blue-50 transition-colors">
                {t("howItWorks")} <ChevronRight size={18} />
              </Link>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" onClick={closeMobileMenu} className="flex items-center gap-2 px-6 py-4 font-bold text-sm uppercase tracking-widest text-doraemon-blue hover:bg-blue-50 transition-colors">
                <Code size={16} /> {t("source")}
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Drawer */}
      <AnimatePresence>
        {historyOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setHistoryOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            />
            <motion.div 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed top-0 right-0 w-full max-w-[85vw] sm:max-w-sm h-full bg-white text-black border-l-4 border-black z-[70] flex flex-col manga-shadow-lg"
            >
              <div className="p-4 sm:p-6 border-b-4 border-black flex justify-between items-center bg-orange-100">
                <h2 className="font-[family-name:var(--font-bangers)] text-xl sm:text-3xl tracking-widest text-orange-600 flex items-center gap-2">
                  <History size={20} className="sm:w-6 sm:h-6" /> {t("timeMachine")}
                </h2>
                <button onClick={() => setHistoryOpen(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                  <X size={20} className="sm:w-6 sm:h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                {historyFiles.length === 0 ? (
                  <div className="text-center text-gray-500 font-bold mt-10 text-sm sm:text-base">
                    <div className="text-4xl mb-3">🕰️</div>
                    {t("noGadgets")}
                  </div>
                ) : (
                  historyFiles.map((file, i) => (
                    <div key={i} className="p-3 sm:p-4 border-2 border-black rounded-xl sm:rounded-2xl bg-gray-50 manga-shadow-sm flex items-start gap-2 sm:gap-3 hover:-translate-y-1 transition-transform cursor-pointer">
                      <FileText className="text-doraemon-blue mt-0.5 shrink-0" size={20} />
                      <div className="min-w-0">
                        <p className="font-bold text-xs sm:text-sm break-all line-clamp-2">{file.name}</p>
                        <span className="text-[10px] sm:text-xs font-bold text-doraemon-red uppercase bg-red-100 px-1.5 sm:px-2 py-0.5 rounded-md border border-red-300 mt-1 inline-block">{file.gadget}</span>
                        <p className="text-[10px] text-gray-400 mt-1">{new Date(file.time).toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
