"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Minimize, Maximize, Scissors, Layers, FileDown, ShieldAlert, 
  Sparkles, Type, Image as ImageIcon, FileText, PenTool, Eraser, 
  RefreshCw, Lock, Unlock, Stamp, Globe 
} from "lucide-react";
import GadgetWorkspace from "@/components/GadgetWorkspace";
import { playPopSound, playTadaSound } from "@/utils/sfx";

export type Gadget = {
  id: string;
  name: string;
  japanese: string;
  icon: React.ReactNode;
  description: string;
  category: "PDF" | "Image";
  color: string;
};

const GADGETS: Gadget[] = [
  { id: "small-light", name: "Small Light", japanese: "スモールライト", icon: <Minimize size={24} />, category: "PDF", color: "bg-doraemon-blue",
    description: "Small Light ki beam se kitni bhi bhaari PDF file ko bina uski text quality kharab kiye ekdum chhota (compress) kiya ja sakta hai! Portal upload limit ki tension khatam." },
  { id: "super-glue", name: "Super Glue", japanese: "超強力接着剤", icon: <Layers size={24} />, category: "PDF", color: "bg-doraemon-red",
    description: "Jab 4-5 alag-alag PDFs hon aur unhe ek hi book banana ho, toh Super Glue se unhe chipka do! Ekdum seamless aur fast merge karega." },
  { id: "pass-loop", name: "Pass Loop", japanese: "通り抜けフープ", icon: <Scissors size={24} />, category: "PDF", color: "bg-doraemon-yellow",
    description: "Pass Loop se PDF ki kisi bhi deewar ke aar-paar jao! Kisi badi PDF ka koi bhi specific page ya section kaat kar alag nikaal sakte ho." },
  { id: "time-furoshiki", name: "Time Cloth", japanese: "タイムふろしき", icon: <RefreshCw size={24} />, category: "PDF", color: "bg-purple-500",
    description: "Time Cloth corrupt ho chuki PDF ko repair karega, aur saare hidden tracking metadata ko bilkul saaf kar dega." },
  { id: "dokodemo-door", name: "Anywhere Door", japanese: "どこでもドア", icon: <FileText size={24} />, category: "PDF", color: "bg-pink-500",
    description: "Anywhere Door se tumhari PDF, Word, Excel, ya plain text format bankar bahar aayegi. Ab edit karna aasan!" },
  { id: "memory-bread", name: "Memory Bread", japanese: "アンキパン", icon: <Type size={24} />, category: "PDF", color: "bg-orange-500",
    description: "Scanned documents padhe nahi ja rahe? Memory bread se saara text yaad kar lo (OCR). Copy aur paste ekdum easy!" },
  { id: "secret-lock", name: "Secret Lock", japanese: "ひみつロック", icon: <Lock size={24} />, category: "PDF", color: "bg-slate-700",
    description: "Is secret lock se apni private PDF pe military-grade AES password laga do. Koi bhi software ise khol nahi payega!" },
  { id: "unlock-key", name: "Master Key", japanese: "マスターキー", icon: <Unlock size={24} />, category: "PDF", color: "bg-green-600",
    description: "Master key se password protected PDF ka lock hamesha ke liye hata sakte ho (agar tumhe original password pata hai)." },
  { id: "stamp", name: "Official Stamp", japanese: "スタンプ", icon: <Stamp size={24} />, category: "PDF", color: "bg-red-600",
    description: "PDF ke har page par ek custom watermark, signature, ya brand logo chhap do taaki koi copy na kar sake." },
  { id: "translation-konjac", name: "Translation Konjac", japanese: "ほんやくコンニャク", icon: <Globe size={24} />, category: "PDF", color: "bg-teal-500",
    description: "Koi foreign language samajh nahi aa rahi? PDF ka text instantly Hindi, English, ya kisi bhi language mein translate karwa lo!" },
  { id: "big-light", name: "Big Light", japanese: "ビッグライト", icon: <Maximize size={24} />, category: "Image", color: "bg-blue-400",
    description: "Chhoti, low-resolution image par Big Light ki roshni daalo aur usko AI se huge HD size mein badal do. Ekdum sharp!" },
  { id: "dress-up-cam", name: "Dress-up Camera", japanese: "着せ替えカメラ", icon: <Eraser size={24} />, category: "Image", color: "bg-rose-500",
    description: "Image mein background pasand nahi? Dress-up Camera se background turant gayab! Transparent PNG ready!" },
  { id: "designer-furoshiki", name: "Designer Cloth", japanese: "デザイナーふろしき", icon: <ImageIcon size={24} />, category: "Image", color: "bg-indigo-500",
    description: "Image ko doosre format mein convert karo. PNG se JPG, ya WEBP. File size aur format par poora control!" },
  { id: "restoring-beam", name: "Restoring Beam", japanese: "復元光線", icon: <Sparkles size={24} />, category: "Image", color: "bg-amber-400 text-black",
    description: "Puraani dhundli ya kharab photos par Restoring Beam maaro! Photo bilkul clear, crisp aur naya jaisa ban jayegi." },
  { id: "air-crayon", name: "Air Crayon", japanese: "空気クレヨン", icon: <PenTool size={24} />, category: "Image", color: "bg-lime-500 text-black",
    description: "Magic crayon! Image ya PDF ke upar draw karo, highlight karo, ya apne visual notes banao." },
];

const NOBITA_LINES = [
  "Doraemon!! 😭 PDF 20MB ki ban gayi hai! Portal 2MB maang raha hai!!",
  "Doraemon! Mujhe dono PDFs ek sath jodne hain, warna teacher gussa karegi! 😭",
  "Doraemon!!! File me password lag gaya hai, main kya karu?! 😭",
  "Doraemon... mujhe kuch samajh nahi aa raha, madad karo na! 🥺"
];

export default function Home() {
  const [pocketOpen, setPocketOpen] = useState(false);
  const [selectedGadget, setSelectedGadget] = useState<Gadget | null>(null);
  const [nobitaLine, setNobitaLine] = useState(NOBITA_LINES[0]);

  useEffect(() => {
    if (!pocketOpen && !selectedGadget) {
      const interval = setInterval(() => {
        setNobitaLine(prev => {
          const currentIndex = NOBITA_LINES.indexOf(prev);
          return NOBITA_LINES[(currentIndex + 1) % NOBITA_LINES.length];
        });
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [pocketOpen, selectedGadget]);

  const pullGadget = (gadget: Gadget) => {
    playTadaSound();
    setSelectedGadget(gadget);
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  };

  return (
    <main className="min-h-screen flex flex-col items-center relative overflow-x-hidden font-[family-name:var(--font-sans)] pb-12 sm:pb-24">
      
      {/* MANGA BACKGROUND ELEMENTS - hidden on small screens */}
      <div className="absolute top-10 left-4 sm:left-10 opacity-5 sm:opacity-10 pointer-events-none">
        <h1 className="font-[family-name:var(--font-bangers)] text-5xl sm:text-9xl">ドカーン!</h1>
      </div>
      <div className="absolute bottom-20 right-4 sm:right-10 opacity-5 sm:opacity-10 pointer-events-none">
        <h1 className="font-[family-name:var(--font-bangers)] text-5xl sm:text-9xl">スッ...</h1>
      </div>

      {/* HEADER SECTION */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full text-center pt-6 sm:pt-12 pb-2 z-10 px-4"
      >
        <h1 className="font-[family-name:var(--font-bangers)] text-3xl sm:text-5xl md:text-7xl text-doraemon-blue manga-shadow tracking-wide">
          4D POCKET PDF
        </h1>
        <div className="mt-3 sm:mt-4 flex flex-wrap justify-center gap-2">
          <span className="bg-doraemon-yellow text-black font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full manga-border text-[10px] sm:text-xs uppercase tracking-widest">
            100% Private
          </span>
          <span className="bg-white text-doraemon-blue font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full manga-border text-[10px] sm:text-xs uppercase tracking-widest">
            Browser Only
          </span>
        </div>
      </motion.div>

      {/* COMIC DIALOGUE BUBBLES */}
      <div className="w-full max-w-3xl relative min-h-[80px] sm:h-32 mt-2 sm:mt-4 z-10 flex justify-center px-4">
        <AnimatePresence mode="wait">
          {!pocketOpen && !selectedGadget && (
            <motion.div 
              key={nobitaLine}
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="bg-white text-black p-3 sm:p-4 rounded-2xl sm:rounded-3xl manga-border manga-shadow-sm font-bold text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm text-center relative"
            >
              <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] sm:border-l-[15px] border-l-transparent border-t-[12px] sm:border-t-[16px] border-t-black border-r-[10px] sm:border-r-[15px] border-r-transparent"></div>
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] sm:border-l-[12px] border-l-transparent border-t-[10px] sm:border-t-[12px] border-t-white border-r-[8px] sm:border-r-[12px] border-r-transparent z-10"></div>
              <span className="text-blue-600 block mb-1 text-[10px] sm:text-xs uppercase tracking-widest">Nobita 🤓</span>
              {nobitaLine}
            </motion.div>
          )}

          {pocketOpen && !selectedGadget && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.9 }}
              className="bg-doraemon-blue text-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl manga-border manga-shadow-sm font-bold text-xs sm:text-sm md:text-base max-w-xs sm:max-w-sm text-center relative"
            >
              <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] sm:border-l-[15px] border-l-transparent border-t-[12px] sm:border-t-[16px] border-t-black border-r-[10px] sm:border-r-[15px] border-r-transparent"></div>
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] sm:border-l-[12px] border-l-transparent border-t-[10px] sm:border-t-[12px] border-t-doraemon-blue border-r-[8px] sm:border-r-[12px] border-r-transparent z-10"></div>
              <span className="text-yellow-300 block mb-1 text-[10px] sm:text-xs uppercase tracking-widest">Doraemon 🐱🤖</span>
              Nobita tum bhi na! 🤦‍♂️ Ye lo mera 4D Pocket, jaldi se koi gadget nikaal lo! ✨
            </motion.div>
          )}

          {selectedGadget && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="bg-yellow-400 text-black p-3 sm:p-4 rounded-2xl sm:rounded-3xl manga-border manga-shadow-sm font-bold text-base sm:text-lg md:text-2xl font-[family-name:var(--font-bangers)] max-w-xs sm:max-w-sm text-center relative"
            >
              <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[10px] sm:border-l-[15px] border-l-transparent border-t-[12px] sm:border-t-[16px] border-t-black border-r-[10px] sm:border-r-[15px] border-r-transparent"></div>
              <div className="absolute -bottom-2 sm:-bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] sm:border-l-[12px] border-l-transparent border-t-[10px] sm:border-t-[12px] border-t-yellow-400 border-r-[8px] sm:border-r-[12px] border-r-transparent z-10"></div>
              TA-DAAAA! 🎺<br/>{selectedGadget.name.toUpperCase()}!!!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* DORAEMON CSS ART */}
      <div className="relative w-full max-w-2xl mt-4 sm:mt-8 flex flex-col items-center z-20">
        
        {/* Head */}
        <div className="w-[180px] h-[180px] sm:w-[260px] sm:h-[260px] bg-doraemon-blue rounded-full manga-border manga-shadow relative flex justify-center overflow-hidden z-10">
          {/* White face */}
          <div className="w-[150px] h-[150px] sm:w-[220px] sm:h-[220px] bg-white rounded-full border-[3px] sm:border-[4px] border-black absolute bottom-0">
            {/* Eyes container */}
            <div className="absolute -top-3 sm:-top-5 left-1/2 -translate-x-1/2 flex">
              {/* Left Eye */}
              <div className="w-10 h-14 sm:w-16 sm:h-20 bg-white rounded-[50%] border-[3px] border-black relative flex items-center justify-end pr-1.5 sm:pr-2">
                <div className="w-2.5 h-3.5 sm:w-4 sm:h-5 bg-black rounded-full"></div>
              </div>
              {/* Right Eye */}
              <div className="w-10 h-14 sm:w-16 sm:h-20 bg-white rounded-[50%] border-[3px] border-black relative flex items-center justify-start pl-1.5 sm:pl-2">
                <div className="w-2.5 h-3.5 sm:w-4 sm:h-5 bg-black rounded-full"></div>
              </div>
            </div>
            
            {/* Nose */}
            <div className="w-7 h-7 sm:w-10 sm:h-10 bg-doraemon-red rounded-full border-[3px] border-black absolute top-10 sm:top-14 left-1/2 -translate-x-1/2 z-20">
              <div className="w-2 h-2 sm:w-3 sm:h-3 bg-white rounded-full absolute top-1 sm:top-1.5 left-1 sm:left-1.5"></div>
            </div>
            
            {/* Mouth line */}
            <div className="w-[3px] sm:w-[4px] h-[50px] sm:h-[80px] bg-black absolute top-16 sm:top-24 left-1/2 -translate-x-1/2"></div>
            
            {/* Mouth */}
            <div className="w-[90px] h-[40px] sm:w-[140px] sm:h-[70px] border-b-[3px] sm:border-b-[4px] border-black rounded-[50%] absolute top-[40px] sm:top-[60px] left-1/2 -translate-x-1/2"></div>
            
            {/* Whiskers Left */}
            <div className="absolute top-[60px] sm:top-[90px] left-[10px] sm:left-[20px] w-[35px] sm:w-[50px] h-[25px] sm:h-[30px] flex flex-col gap-1.5 sm:gap-3">
              <div className="w-full h-[3px] sm:h-[4px] bg-black origin-right rotate-[15deg]"></div>
              <div className="w-full h-[3px] sm:h-[4px] bg-black"></div>
              <div className="w-full h-[3px] sm:h-[4px] bg-black origin-right -rotate-[15deg]"></div>
            </div>
            {/* Whiskers Right */}
            <div className="absolute top-[60px] sm:top-[90px] right-[10px] sm:right-[20px] w-[35px] sm:w-[50px] h-[25px] sm:h-[30px] flex flex-col gap-1.5 sm:gap-3">
              <div className="w-full h-[3px] sm:h-[4px] bg-black origin-left -rotate-[15deg]"></div>
              <div className="w-full h-[3px] sm:h-[4px] bg-black"></div>
              <div className="w-full h-[3px] sm:h-[4px] bg-black origin-left rotate-[15deg]"></div>
            </div>
          </div>
        </div>

        {/* Belt & Bell */}
        <div className="relative w-44 sm:w-64 h-5 sm:h-8 bg-doraemon-red rounded-full manga-border manga-shadow flex justify-center items-center z-30 -mt-2 sm:-mt-3">
          <motion.div 
            whileHover={{ rotate: [0, -15, 15, -15, 15, 0], transition: { duration: 0.5 } }}
            className="absolute w-10 sm:w-14 h-10 sm:h-14 bg-doraemon-yellow rounded-full border-[3px] border-black manga-shadow flex flex-col items-center justify-start pt-1 sm:pt-2 cursor-pointer group"
            onClick={() => {
              playPopSound();
              setPocketOpen(!pocketOpen);
              setSelectedGadget(null);
            }}
          >
            <div className="w-7 sm:w-10 h-0.5 sm:h-1 bg-black rounded-full mb-1 group-hover:bg-gray-800"></div>
            <div className="w-7 sm:w-10 h-0.5 sm:h-1 bg-black rounded-full mb-1 group-hover:bg-gray-800"></div>
            <div className="w-2 sm:w-2.5 h-2 sm:h-2.5 bg-black rounded-full group-hover:bg-gray-800"></div>
            <div className="w-0.5 sm:w-1 h-3 sm:h-3 bg-black mt-0.5 group-hover:bg-gray-800"></div>
          </motion.div>
        </div>

        {/* Body (Belly + Pocket) */}
        <div className="relative w-[160px] h-[130px] sm:w-[220px] sm:h-[180px] bg-doraemon-blue rounded-b-[40%] manga-border manga-shadow-lg -mt-2 sm:-mt-4 flex items-end justify-center z-20 pb-3 sm:pb-5">
          
          {/* Arms (Behind Body) */}
          <div className="absolute top-2 -left-6 sm:top-4 sm:-left-12 w-[50px] h-[80px] sm:w-[70px] sm:h-[110px] bg-doraemon-blue rounded-[50%] border-[3px] border-black rotate-[45deg] -z-10">
            {/* Hand Left */}
            <div className="absolute -bottom-3 sm:-bottom-5 -left-1 sm:-left-2 w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full border-[3px] border-black manga-shadow-sm"></div>
          </div>
          <div className="absolute top-2 -right-6 sm:top-4 sm:-right-12 w-[50px] h-[80px] sm:w-[70px] sm:h-[110px] bg-doraemon-blue rounded-[50%] border-[3px] border-black -rotate-[45deg] -z-10">
            {/* Hand Right */}
            <div className="absolute -bottom-3 sm:-bottom-5 -right-1 sm:-right-2 w-10 h-10 sm:w-14 sm:h-14 bg-white rounded-full border-[3px] border-black manga-shadow-sm"></div>
          </div>

          {/* White Belly */}
          <div className="w-[130px] h-[110px] sm:w-[180px] sm:h-[150px] bg-white rounded-full border-[3px] border-black relative flex items-end justify-center pb-2 sm:pb-3 overflow-hidden">
            {/* 4D Pocket (Half Circle) */}
            <motion.div 
              className="w-[90px] sm:w-[130px] h-[45px] sm:h-[65px] bg-white rounded-b-full border-[3px] border-black relative cursor-pointer group flex items-center justify-center hover:bg-blue-50 transition-colors"
              onClick={() => {
                playPopSound();
                setPocketOpen(!pocketOpen);
                setSelectedGadget(null);
              }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={0.2}
              onDragEnd={(e, info) => {
                if (info.offset.y < -20 && !pocketOpen) {
                  playPopSound();
                  setPocketOpen(true);
                  setSelectedGadget(null);
                } else if (info.offset.y > 20 && pocketOpen) {
                  playPopSound();
                  setPocketOpen(false);
                }
              }}
              whileHover={{ scale: 1.05 }}
              whileDrag={{ scale: 1.1, cursor: "grabbing" }}
            >
              <span className="font-[family-name:var(--font-bangers)] text-[8px] sm:text-[10px] text-gray-400 group-hover:text-doraemon-blue transition-colors select-none mt-1">
                {pocketOpen ? "CLOSE" : "POCKET"}
              </span>
            </motion.div>
          </div>
        </div>

        {/* Feet */}
        <div className="flex gap-2 sm:gap-6 -mt-2 sm:-mt-4 z-10 relative">
          <div className="w-[75px] h-[30px] sm:w-[100px] sm:h-[40px] bg-white rounded-full border-[3px] border-black manga-shadow-sm"></div>
          <div className="w-[75px] h-[30px] sm:w-[100px] sm:h-[40px] bg-white rounded-full border-[3px] border-black manga-shadow-sm"></div>
        </div>
      </div>

      {/* GADGETS GRID */}
      <AnimatePresence>
        {pocketOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full max-w-6xl px-3 sm:px-4 mt-6 sm:mt-8 z-10"
          >
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
              {GADGETS.map((gadget, i) => (
                <motion.div
                  key={gadget.id}
                  initial={{ y: 50, opacity: 0, scale: 0.8 }}
                  animate={{ y: 0, opacity: 1, scale: 1, transition: { delay: i * 0.04, type: "spring", bounce: 0.4 } }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => pullGadget(gadget)}
                  className={`
                    ${gadget.color} p-2 sm:p-4 rounded-xl sm:rounded-2xl manga-border manga-shadow-sm cursor-pointer 
                    flex flex-col items-center text-center transition-all active:scale-95
                    ${gadget.color.includes('text-black') ? 'text-black' : 'text-white'}
                  `}
                >
                  <div className="bg-white/30 backdrop-blur-sm p-2 sm:p-3 rounded-full mb-1.5 sm:mb-3 manga-border">
                    {gadget.icon}
                  </div>
                  <h3 className="font-[family-name:var(--font-bangers)] text-xs sm:text-xl md:text-2xl tracking-wide leading-none mb-0.5 sm:mb-1">
                    {gadget.name}
                  </h3>
                  <span className="text-[8px] sm:text-[10px] font-bold opacity-90 uppercase">
                    {gadget.japanese}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* GADGET WORKSPACE */}
      <AnimatePresence>
        {selectedGadget && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="mt-8 sm:mt-12 w-full max-w-4xl px-3 sm:px-4 z-30"
          >
            <GadgetWorkspace 
              selectedGadget={selectedGadget} 
              onClose={() => setSelectedGadget(null)} 
            />
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}
