import { Zap, Wrench, Globe, Fingerprint } from "lucide-react";
import Link from "next/link";

export default function HowItWorksPage() {
  return (
    <main className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-[#f0f8ff] relative overflow-x-hidden font-[family-name:var(--font-sans)] pb-24">
      
      <div className="absolute top-40 left-10 opacity-10 pointer-events-none">
        <h1 className="font-[family-name:var(--font-bangers)] text-9xl transform -rotate-12">マジック!</h1>
      </div>

      <div className="w-full max-w-4xl bg-white p-8 md:p-12 rounded-[2rem] manga-border manga-shadow-lg mt-12 relative z-10">
        
        <h1 className="font-[family-name:var(--font-bangers)] text-5xl md:text-6xl text-doraemon-blue mb-4 tracking-widest text-center manga-shadow-sm text-white">
          HOW IT WORKS?
        </h1>
        <p className="text-center font-bold text-gray-500 uppercase tracking-widest mb-12">
          Doraemon ki tech ka raaz kholte hain! 🔬
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          
          <div className="bg-yellow-50 p-8 rounded-3xl manga-border relative group hover:-translate-y-2 transition-transform">
            <div className="absolute -top-6 -left-6 bg-doraemon-yellow text-black p-4 rounded-full manga-border manga-shadow">
              <Globe size={32} />
            </div>
            <h2 className="font-[family-name:var(--font-bangers)] text-3xl text-gray-800 tracking-wide mb-3 mt-4">1. WebAssembly (WASM)</h2>
            <p className="text-gray-700 font-medium">
              Dekisugi ki tarah smart! Humne complex C++ aur Rust code ko browser mein run karne ke liye WebAssembly ka use kiya hai. Matlab PDF processing ek software ki tarah tez chalegi, wo bhi directly browser mein.
            </p>
          </div>

          <div className="bg-blue-50 p-8 rounded-3xl manga-border relative group hover:-translate-y-2 transition-transform">
            <div className="absolute -top-6 -right-6 bg-doraemon-blue text-white p-4 rounded-full manga-border manga-shadow">
              <Zap size={32} />
            </div>
            <h2 className="font-[family-name:var(--font-bangers)] text-3xl text-gray-800 tracking-wide mb-3 mt-4">2. Blazing Fast</h2>
            <p className="text-gray-700 font-medium">
              Kyunki file internet par upload nahi hoti, isliye tumhari 50MB ki file ko process hone mein sirf microseconds lagte hain! Internet band hone par bhi yeh website poori speed se kaam karegi.
            </p>
          </div>

          <div className="bg-red-50 p-8 rounded-3xl manga-border relative group hover:-translate-y-2 transition-transform">
            <div className="absolute -top-6 -left-6 bg-doraemon-red text-white p-4 rounded-full manga-border manga-shadow">
              <Wrench size={32} />
            </div>
            <h2 className="font-[family-name:var(--font-bangers)] text-3xl text-gray-800 tracking-wide mb-3 mt-4">3. Pure Client-Side</h2>
            <p className="text-gray-700 font-medium">
              Doraemon ke gadgets sirf Nobita ke control mein hote hain. Waise hi, yahan tumhari device (CPU/RAM) hi processing engine hai. No third-party servers, no waiting for queues!
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl manga-border relative group hover:-translate-y-2 transition-transform">
            <div className="absolute -top-6 -right-6 bg-slate-700 text-white p-4 rounded-full manga-border manga-shadow">
              <Fingerprint size={32} />
            </div>
            <h2 className="font-[family-name:var(--font-bangers)] text-3xl text-gray-800 tracking-wide mb-3 mt-4">4. No Footprints</h2>
            <p className="text-gray-700 font-medium">
              Jaise Time Cloth kisi chiz ka history badal deta hai, waise hi jab tum window close karte ho, tumhara saara data turant RAM se delete ho jata hai. Humesha ke liye safe!
            </p>
          </div>

        </div>

        <div className="mt-16 flex justify-center">
          <Link href="/">
            <button className="bg-doraemon-blue text-white font-[family-name:var(--font-bangers)] text-2xl px-12 py-4 rounded-xl manga-border manga-shadow hover:-translate-y-1 hover:manga-shadow-lg transition-all tracking-widest">
              LET'S USE GADGETS! 🚀
            </button>
          </Link>
        </div>

      </div>
    </main>
  );
}
