import React, { useState } from 'react';
import { Lock, Hash, ArrowRight, Sparkles, RefreshCw, Type, CaseUpper, Key, ArrowDown, ShieldCheck } from 'lucide-react';
import { encryptText, decryptText, cipherMap } from './jejetography'; 

export default function App() {
  const [plainText, setPlainText] = useState("");
  const [cipherText, setCipherText] = useState("");
  const [decryptedText, setDecryptedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");

  const handleEncrypt = () => {
    if (!plainText) return;
    setIsLoading(true);
    setLoadingText("ENCRYPTING...");
    setTimeout(() => {
      const result = encryptText(plainText);
      setCipherText(result);
      setDecryptedText(""); 
      setIsLoading(false);
    }, 1500);
  };

  const handleDecrypt = () => {
    if (!cipherText) return;
    setIsLoading(true);
    setLoadingText("DECRYPTING...");
    setTimeout(() => {
      const result = decryptText(cipherText);
      setDecryptedText(result);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen h-screen w-full bg-[#0F0520] text-white font-sans p-6 lg:p-10 flex flex-col overflow-hidden relative">
      
      {/* --- LOADING OVERLAY --- */}
      {isLoading && (
        <div className="absolute inset-0 z-50 bg-[#0F0520]/90 backdrop-blur-md flex flex-col items-center justify-center transition-all duration-300">
          <div className="relative w-28 h-28 mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-white/10"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-[#F472B6] border-r-[#C084FC] border-b-transparent border-l-transparent animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center animate-pulse">
              <Sparkles className="#F472B6 w-10 h-10" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#F472B6] to-[#C084FC] tracking-[0.2em] animate-pulse">
            {loadingText}
          </h2>
        </div>
      )}

      {/* HEADER */}
      <header className="text-center mb-8 shrink-0">
        <h1 className="text-5xl font-bold text-[#F472B6] flex items-center justify-center gap-4 mb-2">
          <Sparkles className="w-10 h-10" /> Jejetography
        </h1>
        <p className="text-[#C084FC] text-base tracking-widest uppercase opacity-80 font-medium">
          Transform text into encrypted cipher with Jejemon-style cryptography
        </p>
      </header>

      {/* MAIN CONTENT */}
      <div className="w-full max-w-[1800px] mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 min-h-0">
        
        {/* LEFT COLUMN (Inputs) */}
        <div className="lg:col-span-3 flex flex-col gap-6 h-full">
          
          {/* MAIN INPUT CARD */}
          <div className="bg-[#180a33] p-8 rounded-[2rem] border border-[#7E22CE]/30 shadow-2xl shadow-black/50 flex flex-col gap-8 flex-1 min-h-0">
            
            {/* --- ROW 1: PLAIN TEXT --- */}
            <div className="flex flex-col h-1/3 min-h-[200px] bg-[#7E22CE]/10 rounded-3xl p-6 border border-[#7E22CE]/20 shadow-inner transition-all focus-within:bg-[#7E22CE]/20 focus-within:border-[#7E22CE] focus-within:ring-1 focus-within:ring-[#7E22CE]">
              <label className="flex items-center gap-3 text-[#C084FC] font-bold mb-3 text-base uppercase tracking-wider">
                <Lock size={20} /> Enter Plain Text
              </label>
              {/* BIGGER TEXT: text-2xl */}
              <textarea 
                className="w-full flex-1 bg-transparent text-white text-2xl leading-relaxed focus:outline-none resize-none placeholder-white/30"
                placeholder="Type here to encrypt..."
                value={plainText}
                onChange={(e) => setPlainText(e.target.value)}
              />
              <div className="flex justify-end mt-3">
                {/* BIGGER BUTTON: py-3 px-8 text-lg */}
                <button 
                  onClick={handleEncrypt}
                  disabled={isLoading}
                  className="bg-[#F472B6] hover:bg-[#d65db5] text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-[#F472B6]/30 flex items-center gap-3 text-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                >
                  Encrypt 
                </button>
              </div>
            </div>

            {/* --- ROW 2: ENCRYPTED & DECRYPTED --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1 min-h-0">
              
              {/* BOX 2: ENCRYPTED FIELD */}
              <div className="flex flex-col h-full bg-[#7E22CE]/10 rounded-3xl p-6 border border-[#7E22CE]/20 shadow-inner transition-all focus-within:bg-[#7E22CE]/20 focus-within:border-[#7E22CE]">
                <label className="flex items-center gap-3 text-[#F472B6] font-bold mb-3 text-base uppercase tracking-wider">
                  <Hash size={20} /> Encrypted Field
                </label>
                {/* BIGGER TEXT: text-2xl */}
                <textarea 
                  className="w-full flex-1 bg-transparent text-[#F472B6] font-mono text-2xl leading-relaxed focus:outline-none resize-none placeholder-white/30"
                  placeholder="Cipher output..."
                  value={cipherText}
                  onChange={(e) => setCipherText(e.target.value)}
                />
                <div className="flex justify-end mt-3">
                  {/* BIGGER BUTTON */}
                  <button 
                    onClick={handleDecrypt}
                    disabled={isLoading}
                    className="bg-[#C084FC] hover:bg-[#a975df] text-white font-bold py-3 px-8 rounded-2xl shadow-lg shadow-[#C084FC]/30 flex items-center gap-3 text-lg transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50"
                  >
                    Decrypt 
                  </button>
                </div>
              </div>

              {/* BOX 3: DECRYPTED FIELD */}
              <div className="flex flex-col h-full bg-[#7E22CE]/10 rounded-3xl p-6 border border-[#7E22CE]/20 shadow-inner">
                <label className="flex items-center gap-3 text-emerald-400 font-bold mb-3 text-base uppercase tracking-wider">
                  <ShieldCheck size={20} /> Decrypted Field
                </label>
                {/* BIGGER TEXT: text-2xl */}
                <textarea 
                  readOnly
                  className="w-full flex-1 bg-transparent text-emerald-300 font-mono text-2xl leading-relaxed focus:outline-none resize-none placeholder-white/30"
                  placeholder="Result appears here..."
                  value={decryptedText}
                />
                {/* Spacer for button height alignment */}
                <div className="h-[52px] mt-3"></div> 
              </div>

            </div>
          </div>

          {/* RULES CARD */}
          <div className="bg-[#180a33] p-6 rounded-[2rem] border border-[#7E22CE]/30 shadow-xl shrink-0 h-[180px] overflow-hidden">
            <h3 className="flex items-center gap-3 text-[#F472B6] font-bold mb-5 text-base uppercase tracking-wider">
              <Lock size={20} /> Encryption Rules
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              <RuleCard icon={<Type/>} title="Prefix System" desc="Consonants (C), Vowels <V>" />
              <RuleCard icon={<CaseUpper/>} title="Vowel Markers" desc="Vowels get ~ marker" />
              <RuleCard icon={<Hash/>} title="Length Tag" desc="5+ letters get #L" />
              <RuleCard icon={<RefreshCw/>} title="Transposition" desc="Reverse word" />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (Cipher Key) */}
        <div className="lg:col-span-1 bg-[#180a33] p-8 rounded-[2rem] border border-[#7E22CE]/30 flex flex-col h-full shadow-xl overflow-hidden">
          <h3 className="text-[#C084FC] font-bold mb-6 flex items-center gap-3 shrink-0 text-base uppercase tracking-wider">
            <Key size={20} /> Cipher Key
          </h3>
          
          <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
            <div className="columns-2 gap-4 space-y-4">
              {Object.entries(cipherMap)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([letter, symbol]) => (
                  <div key={letter} className="break-inside-avoid flex justify-between items-center bg-[#7E22CE]/10 p-4 rounded-2xl border border-[#7E22CE]/20 hover:border-[#F472B6] transition-colors group">
                    {/* BIGGER KEY TEXT: text-sm -> text-base */}
                    <span className="text-gray-400 font-bold w-6 text-center text-sm">{letter}</span>
                    <span className="text-gray-600 text-xs">→</span>
                    <span className="text-[#F472B6] font-mono font-bold w-10 text-center group-hover:text-white text-base">{symbol}</span>
                  </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function RuleCard({ icon, title, desc }) {
  return (
    <div className="bg-[#7E22CE]/10 p-4 rounded-2xl border border-[#7E22CE]/20 flex flex-col gap-2 hover:bg-[#7E22CE]/20 transition-colors h-full justify-center">
      <div className="flex items-center gap-3">
        <div className="bg-[#F472B6]/20 w-10 h-10 rounded-xl flex items-center justify-center text-[#F472B6] shrink-0">
          {React.cloneElement(icon, { size: 20 })}
        </div>
        {/* BIGGER TITLE: text-sm */}
        <h4 className="font-bold text-[#F472B6] text-sm uppercase tracking-wide">{title}</h4>
      </div>
      {/* BIGGER DESC: text-xs */}
      <p className="text-xs text-gray-400 leading-snug pl-1">{desc}</p>
    </div>
  );
}