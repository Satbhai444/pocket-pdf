import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t-4 border-black py-12 flex flex-col items-center justify-center z-50 relative mt-auto">
      
      {/* Title */}
      <h2 className="font-[family-name:var(--font-bangers)] text-4xl text-doraemon-blue mb-2 tracking-widest manga-shadow-sm text-white">
        4D POCKET PDF
      </h2>
      
      {/* Made with Love */}
      <p className="font-bold text-gray-700 mb-8 flex items-center gap-2 text-sm uppercase tracking-widest bg-gray-100 px-4 py-2 rounded-full border-2 border-gray-200">
        Made with ❤️ and Dorayaki 🥞
      </p>

      {/* Links */}
      <div className="flex flex-wrap justify-center gap-4 md:gap-8 font-bold text-xs md:text-sm uppercase tracking-widest text-gray-500 mb-8 px-4 text-center">
        <Link href="/how-it-works" className="hover:text-doraemon-blue transition-colors">100% Client-Side Processing</Link>
        <span className="hidden md:inline">•</span>
        <Link href="/privacy" className="hover:text-doraemon-red transition-colors">No Data Collection</Link>
        <span className="hidden md:inline">•</span>
        <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-doraemon-yellow transition-colors text-black">Open Source GitHub</a>
      </div>

      {/* Copyright */}
      <div className="text-xs font-bold text-gray-400 uppercase tracking-widest border-t-2 border-gray-100 pt-6 w-full max-w-lg text-center">
        © {new Date().getFullYear()} 4D Pocket. Fan-made utility tool.
        <br className="md:hidden" /> Not affiliated with Fujiko F. Fujio.
      </div>
      
    </footer>
  );
}
