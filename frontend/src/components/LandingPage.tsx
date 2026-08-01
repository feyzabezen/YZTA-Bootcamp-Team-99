import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Activity, Cpu, ShieldAlert, Zap, ArrowRight, Terminal, Layers, Users } from 'lucide-react';

interface LandingPageProps {
  onEnterConsole: () => void;
  darkMode: boolean;
  key?: string;
}

export default function LandingPage({ onEnterConsole, darkMode }: LandingPageProps) {
  // ana kart tilt
  const [rX1, setRX1] = useState(0); const [rY1, setRY1] = useState(0);
  const [rX2, setRX2] = useState(0); const [rY2, setRY2] = useState(0);
  const [rX3, setRX3] = useState(0); const [rY3, setRY3] = useState(0);
  const [rX4, setRX4] = useState(0); const [rY4, setRY4] = useState(0);

  // hakkında tilt
  const [hX1, setHX1] = useState(0); const [hY1, setHY1] = useState(0);
  const [hX2, setHX2] = useState(0); const [hY2, setHY2] = useState(0);
  const [hX3, setHX3] = useState(0); const [hY3, setHY3] = useState(0);
  const [hX4, setHX4] = useState(0); const [hY4, setHY4] = useState(0);
  
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleTilt = (
    e: React.MouseEvent<HTMLDivElement>, 
    setX: React.Dispatch<React.SetStateAction<number>>, 
    setY: React.Dispatch<React.SetStateAction<number>>
  ) => {
    const card = e.currentTarget;
    const box = card.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5; 
    const y = (e.clientY - box.top) / box.height - 0.5;
    setX(-y * 45); 
    setY(x * 45);
  };

  const resetTilt = (
    setX: React.Dispatch<React.SetStateAction<number>>, 
    setY: React.Dispatch<React.SetStateAction<number>>
  ) => {
    setX(0);
    setY(0);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative w-full min-h-screen py-6" 
      style={{ perspective: "1200px" }}
    >
      {/* arkaplan */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-none overflow-hidden opacity-30">
        <video
          ref={videoRef} 
          src="/background-video.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="w-full h-full object-cover" 
        />
        <div className={`absolute inset-0 ${darkMode ? 'bg-black/60' : 'bg-white/60'}`} />
      </div>

      <div className="relative z-10">
        {/* hero bölümü */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-xs font-bold uppercase tracking-wider mb-6 ${darkMode ? 'border-[#EA4335]/30 bg-[#EA4335]/10 text-[#EA4335]' : 'border-red-200 bg-red-50 text-red-600'}`}
          >
            <Zap className="w-3.5 h-3.5" /> Öngörülebilir Bakım Kapsülü
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className={`text-4xl md:text-6xl font-black tracking-tight max-w-4xl leading-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}
          >
            Arızaları Meydana Gelmeden Önce <span className="text-[#4285F4]">Teş</span><span className="text-[#EA4335]">his</span> <span className="text-[#FBBC05]">Ed</span><span className="text-[#34A853]">in</span>
          </motion.h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-10">
            <button onClick={onEnterConsole} className="group px-8 py-4 bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-md transform hover:-translate-y-0.5 cursor-pointer">
              Analiz Konsolunu Aç <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </section>

        {/* ana kartlar */}
        <section className="py-12 px-6 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* mavi kart */}
          <motion.div 
            initial={{ x: -150, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 50, damping: 12 }}
            onMouseMove={(e) => handleTilt(e, setRX1, setRY1)} onMouseLeave={() => resetTilt(setRX1, setRY1)}
            animate={{ rotateX: rX1, rotateY: rY1 }}
            style={{ transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}
            className={`border p-8 rounded-3xl backdrop-blur-md shadow-md cursor-pointer min-h-[220px] flex flex-col justify-center ${darkMode ? 'bg-[#28292e] border-slate-700 hover:border-[#4285F4]' : 'bg-white border-slate-200 hover:border-blue-400'}`}
          >
            <div style={{ transform: "translateZ(60px)" }}>
              <div className={`p-3 rounded-xl w-fit mb-4 ${darkMode ? 'bg-[#4285F4]/10 text-[#4285F4]' : 'bg-blue-50 text-[#4285F4]'}`}><Activity className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold mb-3">01 / Gerçek Zamanlı Tahmin</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Sıcaklık ve tork loglarını işleyerek makine arıza riskini en yüksek doğruluk oranıyla hesaplayın.</p>
            </div>
          </motion.div>

          {/* kırmızı kart */}
          <motion.div 
            initial={{ x: 150, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 50, damping: 12 }}
            onMouseMove={(e) => handleTilt(e, setRX2, setRY2)} onMouseLeave={() => resetTilt(setRX2, setRY2)}
            animate={{ rotateX: rX2, rotateY: rY2 }}
            style={{ transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}
            className={`border p-8 rounded-3xl backdrop-blur-md shadow-md cursor-pointer min-h-[220px] flex flex-col justify-center ${darkMode ? 'bg-[#28292e] border-slate-700 hover:border-[#EA4335]' : 'bg-white border-slate-200 hover:border-red-400'}`}
          >
            <div style={{ transform: "translateZ(60px)" }}>
              <div className={`p-3 rounded-xl w-fit mb-4 ${darkMode ? 'bg-[#EA4335]/10 text-[#EA4335]' : 'bg-red-50 text-[#EA4335]'}`}><ShieldAlert className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold mb-3">02 / Otonom Ajan Orkestrası</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Analist ve Bakım Uzmanı ajanlar, tespit edilen hatalara anında Türkçe eylem planları üretir.</p>
            </div>
          </motion.div>

          {/* sarı kart */}
          <motion.div 
            initial={{ x: -150, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 50, damping: 12 }}
            onMouseMove={(e) => handleTilt(e, setRX3, setRY3)} onMouseLeave={() => resetTilt(setRX3, setRY3)}
            animate={{ rotateX: rX3, rotateY: rY3 }}
            style={{ transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}
            className={`border p-8 rounded-3xl backdrop-blur-md shadow-md cursor-pointer min-h-[220px] flex flex-col justify-center ${darkMode ? 'bg-[#28292e] border-slate-700 hover:border-[#FBBC05]' : 'bg-white border-slate-200 hover:border-yellow-400'}`}
          >
            <div style={{ transform: "translateZ(60px)" }}>
              <div className={`p-3 rounded-xl w-fit mb-4 ${darkMode ? 'bg-[#FBBC05]/10 text-[#FBBC05]' : 'bg-yellow-50 text-[#FBBC05]'}`}><Layers className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold mb-3">03 / Kök Neden Analizi</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Hata sinyallerinin kaynağını mikrosaniyeler içinde ayrıştırıp kritik donanım arızalarını önleyin.</p>
            </div>
          </motion.div>

          {/* yeşil kart */}
          <motion.div 
            initial={{ x: 150, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: "spring", stiffness: 50, damping: 12 }}
            onMouseMove={(e) => handleTilt(e, setRX4, setRY4)} onMouseLeave={() => resetTilt(setRX4, setRY4)}
            animate={{ rotateX: rX4, rotateY: rY4 }}
            style={{ transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}
            className={`border p-8 rounded-3xl backdrop-blur-md shadow-md cursor-pointer min-h-[220px] flex flex-col justify-center ${darkMode ? 'bg-[#28292e] border-slate-700 hover:border-[#34A853]' : 'bg-white border-slate-200 hover:border-green-400'}`}
          >
            <div style={{ transform: "translateZ(60px)" }}>
              <div className={`p-3 rounded-xl w-fit mb-4 ${darkMode ? 'bg-[#34A853]/10 text-[#34A853]' : 'bg-green-50 text-[#34A853]'}`}><Cpu className="w-7 h-7" /></div>
              <h3 className="text-xl font-bold mb-3">04 / Telemetri Entegrasyonu</h3>
              <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Balanced formatındaki fabrika log verilerini kesintisiz ve kayıpsız olarak sisteme işleyin.</p>
            </div>
          </motion.div>
        </section>

        {/* detaylar */}
        <section id="hakkinda" className="py-16 px-6 max-w-5xl mx-auto space-y-8 overflow-hidden">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-2xl font-bold tracking-wide">PROJE DETAYLARI</h2>
            <div className="w-12 h-1 bg-[#4285F4] mx-auto mt-2 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* kart 1 mavi */}
            <motion.div 
              initial={{ x: -150, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 50, damping: 12 }}
              onMouseMove={(e) => handleTilt(e, setHX1, setHY1)} onMouseLeave={() => resetTilt(setHX1, setHY1)}
              animate={{ rotateX: hX1, rotateY: hY1 }} style={{ transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}
              className={`p-8 rounded-3xl border shadow-sm cursor-pointer min-h-[160px] flex flex-col justify-center ${darkMode ? 'bg-[#28292e] border-slate-700 text-slate-300 hover:border-[#4285F4]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-blue-400'}`}
            >
              <div className="font-bold flex items-center gap-2 mb-2 text-base text-[#4285F4]"><Terminal className="w-5 h-5" /> Endüstriyel İhtiyaç</div>
              <p className="text-sm leading-relaxed font-medium">Modern tesislerde plansız duruş süreleri operasyonel aksaklıklara ve büyük finansal kayıplara yol açar.</p>
            </motion.div>

            {/* kart 2 kırmızı */}
            <motion.div 
              initial={{ x: 150, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 50, damping: 12 }}
              onMouseMove={(e) => handleTilt(e, setHX2, setHY2)} onMouseLeave={() => resetTilt(setHX2, setHY2)}
              animate={{ rotateX: hX2, rotateY: hY2 }} style={{ transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}
              className={`p-8 rounded-3xl border shadow-sm cursor-pointer min-h-[160px] flex flex-col justify-center ${darkMode ? 'bg-[#28292e] border-slate-700 text-slate-300 hover:border-[#EA4335]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-red-400'}`}
            >
              <div className="font-bold flex items-center gap-2 mb-2 text-base text-[#EA4335]"><Layers className="w-5 h-5" /> Stratejik Vizyon</div>
              <p className="text-sm leading-relaxed font-medium">Bu program, telemetri verilerini sürekli analiz ederek anomali riskini henüz arıza gerçekleşmeden saptar.</p>
            </motion.div>

            {/* kart 3 sarı */}
            <motion.div 
              initial={{ x: -150, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 50, damping: 12 }}
              onMouseMove={(e) => handleTilt(e, setHX3, setHY3)} onMouseLeave={() => resetTilt(setHX3, setHY3)}
              animate={{ rotateX: hX3, rotateY: hY3 }} style={{ transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}
              className={`p-8 rounded-3xl border shadow-sm cursor-pointer min-h-[160px] flex flex-col justify-center ${darkMode ? 'bg-[#28292e] border-slate-700 text-slate-300 hover:border-[#FBBC05]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-yellow-400'}`}
            >
              <div className="font-bold flex items-center gap-2 mb-2 text-base text-[#FBBC05]"><Cpu className="w-5 h-5" /> Hibrit Yapay Zeka</div>
              <p className="text-sm leading-relaxed font-medium">Platformumuz sadece makine öğrenmesi modelleri değil, otonom çalışan ajan orkestrasyonu barındırır.</p>
            </motion.div>

            {/* kart 4 yeşil */}
            <motion.div 
              initial={{ x: 150, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ type: "spring", stiffness: 50, damping: 12 }}
              onMouseMove={(e) => handleTilt(e, setHX4, setHY4)} onMouseLeave={() => resetTilt(setHX4, setHY4)}
              animate={{ rotateX: hX4, rotateY: hY4 }} style={{ transformStyle: "preserve-3d", transition: "transform 0.05s linear" }}
              className={`p-8 rounded-3xl border shadow-sm cursor-pointer min-h-[160px] flex flex-col justify-center ${darkMode ? 'bg-[#28292e] border-slate-700 text-slate-300 hover:border-[#34A853]' : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-green-400'}`}
            >
              <div className="font-bold flex items-center gap-2 mb-2 text-base text-[#34A853]"><Users className="w-5 h-5" /> Ajan Entegrasyonu</div>
              <p className="text-sm leading-relaxed font-medium">Matematiksel çıktılar LLM tabanlı ajanlarca yorumlanarak net Türkçe direktiflere dönüştürülür.</p>
            </motion.div>
          </div>

          {/* ekip kartları */}
          <div className="space-y-6 pt-12 border-t border-slate-200 dark:border-slate-800 w-full text-center">
            <div className="flex items-center gap-3 font-bold text-lg justify-center text-slate-400">
              <Users className="w-6 h-6 text-[#4285F4]" /> PROJE GELİŞTİRME EKİBİ
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
              {[
                { name: "Feyza Bezen", role: "Product Owner / Data Scientist", link: "https://www.linkedin.com/in/feyzabezen/", color: "#4285F4", bg: "rgba(66, 133, 244, 0.06)", btnBg: "bg-blue-500/10 text-blue-600 hover:bg-blue-500 hover:text-white" },
                { name: "Özlem Kınaş", role: "Data Scientist", link: "https://www.linkedin.com/in/ozlemkinas/", color: "#EA4335", bg: "rgba(234, 67, 53, 0.06)", btnBg: "bg-red-500/10 text-red-600 hover:bg-red-500 hover:text-white" },
                { name: "Nursenem Zirek", role: "Scrum Master / AI Engineer", link: "https://www.linkedin.com/in/nrsenemzrk/", color: "#FBBC05", bg: "rgba(251, 188, 5, 0.06)", btnBg: "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 hover:bg-yellow-500 hover:text-white" },
                { name: "Emre Aldemir", role: "AI Engineer / Frontend Developer", link: "https://www.linkedin.com/in/emre-aldemir-1b2301293/", color: "#34A853", bg: "rgba(52, 168, 83, 0.06)", btnBg: "bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white" }
              ].map((member, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ duration: 0.5, ease: "easeOut", delay: idx * 0.1 }}
                  style={{ backgroundColor: darkMode ? member.bg : '#ffffff', borderColor: member.color + '30' }} 
                  className="border p-5 rounded-2xl flex flex-col justify-between items-center text-center gap-4 hover:shadow-md transition-all border-opacity-40"
                >
                  <div>
                    <div 
                      style={{ color: darkMode ? '#ffffff' : '#1c1d21' }} 
                      className="font-bold text-base tracking-wide"
                    >
                      {member.name}
                    </div>
                    <div className="text-[11px] font-bold mt-1.5 uppercase tracking-wider" style={{ color: member.color }}>{member.role}</div>
                  </div>
                  <a href={member.link} target="_blank" rel="noreferrer" className={`p-2 rounded-xl border border-transparent flex items-center justify-center transition-all w-full text-xs gap-2 font-bold ${member.btnBg}`}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                    Profile Git
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
