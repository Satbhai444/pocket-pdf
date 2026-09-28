"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type Language = "EN" | "HI" | "JA";

type Translations = {
  [key in Language]: {
    [key: string]: string;
  };
};

const translations: Translations = {
  EN: {
    gadgets: "Gadgets",
    privacy: "Privacy",
    howItWorks: "How it works",
    timeMachine: "TIME MACHINE ⏳",
    dropPdf: "DROP PDF HERE",
    dropImage: "DROP IMAGE HERE",
    dropIt: "DROP IT HERE!",
    tapToBrowse: "(Tap to browse files)",
    filesToProcess: "Files to process:",
    noGadgets: "No gadgets used yet. Open the 4D Pocket!",
    source: "Source",
    mangaSuccess: "Manga Success! 🎉",
    successMsg: "magic applied successfully!",
    errorMsg: "Oops! Something went wrong.",
  },
  HI: {
    gadgets: "गैजेट्स",
    privacy: "गोपनीयता",
    howItWorks: "यह कैसे काम करता है",
    timeMachine: "टाइम मशीन ⏳",
    dropPdf: "PDF यहाँ डालें",
    dropImage: "IMAGE यहाँ डालें",
    dropIt: "यहाँ छोड़ें!",
    tapToBrowse: "(फ़ाइल चुनने के लिए टैप करें)",
    filesToProcess: "प्रक्रिया के लिए फ़ाइलें:",
    noGadgets: "अभी तक कोई गैजेट इस्तेमाल नहीं हुआ। 4D पॉकेट खोलें!",
    source: "सोर्स",
    mangaSuccess: "मंगा सफलता! 🎉",
    successMsg: "जादू सफलतापूर्वक लागू हो गया!",
    errorMsg: "उफ़! कुछ गलत हो गया।",
  },
  JA: {
    gadgets: "ひみつ道具",
    privacy: "プライバシー",
    howItWorks: "使い方",
    timeMachine: "タイムマシン ⏳",
    dropPdf: "ここにPDFをドロップ",
    dropImage: "ここに画像をドロップ",
    dropIt: "ここにドロップ！",
    tapToBrowse: "(タップしてファイルを選択)",
    filesToProcess: "処理するファイル:",
    noGadgets: "まだ道具は使われていません。四次元ポケットを開いて！",
    source: "ソース",
    mangaSuccess: "マンガ大成功！ 🎉",
    successMsg: "魔法が適用されました！",
    errorMsg: "おっと！エラーが発生しました。",
  }
};

type LanguageContextType = {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.EN) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("EN");

  const t = (key: keyof typeof translations.EN) => {
    return translations[lang]?.[key] || translations.EN[key];
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
