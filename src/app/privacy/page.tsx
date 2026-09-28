import { ShieldCheck, EyeOff, ServerOff } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#f0f8ff] relative overflow-x-hidden font-[family-name:var(--font-sans)] pb-24">
      
      {/* MANGA BACKGROUND */}
      <div className="absolute top-20 right-10 opacity-10 pointer-events-none">
        <h1 className="font-[family-name:var(--font-bangers)] text-9xl">ドカーン!</h1>
      </div>

      <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-[2rem] manga-border manga-shadow-lg mt-12 relative z-10">
        
        <h1 className="font-[family-name:var(--font-bangers)] text-5xl md:text-6xl text-doraemon-blue mb-4 tracking-widest text-center manga-shadow-sm text-white">
          PRIVACY POLICY
        </h1>
        <p className="text-center font-bold text-gray-500 uppercase tracking-widest mb-12">
          Gian aur Suneo bhi tumhara data nahi chura sakte! 🛡️
        </p>

        <div className="space-y-8">
          
          <div className="flex gap-6 items-start bg-blue-50 p-6 rounded-3xl manga-border">
            <div className="bg-doraemon-blue text-white p-4 rounded-full manga-border flex-shrink-0">
              <ServerOff size={32} />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-bangers)] text-3xl text-gray-800 tracking-wide mb-2">1. NO SERVERS. NO UPLOADS.</h2>
              <p className="text-gray-700 font-medium leading-relaxed">
                4D Pocket PDF ekdum alag tarike se kaam karta hai. Jab aap apni PDF ya photo yahan daalte ho, toh wo <strong>kabhi bhi internet ke zariye kisi server par upload nahi hoti!</strong> Saara processing (compress, merge, etc.) aapke apne laptop ya phone (browser) ke andar hi hota hai.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start bg-red-50 p-6 rounded-3xl manga-border">
            <div className="bg-doraemon-red text-white p-4 rounded-full manga-border flex-shrink-0">
              <EyeOff size={32} />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-bangers)] text-3xl text-gray-800 tracking-wide mb-2">2. WE CAN'T SEE YOUR FILES</h2>
              <p className="text-gray-700 font-medium leading-relaxed">
                Kyunki file upload hi nahi hoti, toh hum (developers) bhi tumhari files nahi dekh sakte. Tumhara bank statement ho ya personal assignment, sab kuch 100% private rehta hai.
              </p>
            </div>
          </div>

          <div className="flex gap-6 items-start bg-yellow-50 p-6 rounded-3xl manga-border">
            <div className="bg-doraemon-yellow text-black p-4 rounded-full manga-border flex-shrink-0">
              <ShieldCheck size={32} />
            </div>
            <div>
              <h2 className="font-[family-name:var(--font-bangers)] text-3xl text-gray-800 tracking-wide mb-2">3. ZERO COOKIE TRACKING</h2>
              <p className="text-gray-700 font-medium leading-relaxed">
                Doraemon ke gadgets mein tracking device nahi laga hai. Ye fan-made tool hai, sirf tumhari madad ke liye bana hai. Yahan koi shady data collection ya ads nahi aayenge!
              </p>
            </div>
          </div>

        </div>

        <div className="mt-12 flex justify-center">
          <Link href="/">
            <button className="bg-yellow-400 text-black font-[family-name:var(--font-bangers)] text-2xl px-12 py-4 rounded-xl manga-border manga-shadow hover:-translate-y-1 hover:manga-shadow-lg transition-all tracking-widest">
              BACK TO POCKET 🎒
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}
