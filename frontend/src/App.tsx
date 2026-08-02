import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { Cpu, Sun, Moon } from 'lucide-react';

import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';

interface MockResultType {
  failureRisk: string;
  rootCause: string;
  status: string;
  analystReport: string;
  actionPlan: string[];
}

export default function App() {
  const [formData, setFormData] = useState({ airTemp: 300.0, processTemp: 310.0, rotSpeed: 1500, torque: 40.0, toolWear: 0 });
  const [mockResult, setMockResult] = useState<MockResultType | null>(null);
  const [uploadedFile, setUploadedFile] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('single');
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<string>('landing');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState<boolean>(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: parseFloat(e.target.value) || 0 });
  };

  const handlePredict = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
  
    const requestPayload = {
      type: "M", 
      air_temperature: formData.airTemp,
      process_temperature: formData.processTemp,
      rotational_speed: Math.round(formData.rotSpeed) || 0,
      torque: formData.torque,
      tool_wear: Math.round(formData.toolWear) || 0
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/v1/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload)
      });

      if (!response.ok) {
        throw new Error('Backend API hatası oluştu!');
      }

      const data = await response.json();

      const reportText = data.agent_analysis_report || "Sistem analizi tamamlandı. Ajan raporu oluşturulamadı.";
    
      const steps = data.recommendation 
        ? [
            data.recommendation,
            "Sensör hatları üzerindeki yükü kontrol edin.",
            "Kestirimci bakım günlüğüne bu olayı kaydedin."
          ]
        : [
            "Sensör loglarının kararlılığını telemetri hattından izlemeye devam edin.",
            "Veri tutarlılığı adına cihaz tork limitlerini gözden geçirin."
          ];

      setMockResult({
        failureRisk: `${Math.round(data.failure_probability * 100)}%`,
        rootCause: data.failure_type,
        status: data.machine_failure ? "Tehlike" : "Stabil",
        analystReport: data.agent_analysis_report || `Sistem analizi tamamlandı.`,
        actionPlan: steps
      });

    } catch (error) {
      console.error("API Entegrasyon Hatası:", error);
      setMockResult({
        failureRisk: "85% (Local Mock)",
        rootCause: "Aşırı Gerilim / Yüklenme (OSF)",
        status: "Tehlike",
        analystReport: "Cihazın tork ve dönme hızı değerleri kritik eşiğin üzerinde seyrediyor. (Not: Backend bağlantısı veya CORS kontrol edilmeli)",
        actionPlan: [
          "Motor besleme voltajını ve yük dengesini kontrol edin.",
          "Aşırı zorlanmayı önlemek adına tork sınırlandırma valflerini aktif hale getirin."
        ]
      });
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div onMouseMove={handleMouseMove} className={`min-h-screen font-sans p-6 relative overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-[#1c1d21] text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* mouse ambiyans */}
      {darkMode && (
        <div 
          className="pointer-events-none fixed w-[450px] h-[450px] bg-gradient-to-tr from-[#4285F4]/5 via-[#EA4335]/5 to-[#34A853]/5 rounded-full blur-[120px] z-30 transition-transform duration-75 ease-out"
          style={{ left: mousePos.x - 225, top: mousePos.y - 225 }}
        />
      )}

      {/* üst bar */}
      <header className={`relative p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-8 shadow-md backdrop-blur-md border z-50 ${darkMode ? 'bg-[#28292e]/80 border-slate-700' : 'bg-white/80 border-slate-200'}`}>
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('landing')}>
          <div className={`p-2 border rounded-xl shadow-inner flex items-center justify-center ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
            <img src="/logo.png" alt="FaultSense Logo" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1
                className={`text-2xl font-bold tracking-wide ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                }`}
            >
              FaultSense
            </h1>

            <span className="text-[10px] bg-blue-500/10 border border-blue-300 text-blue-500 font-bold px-2 py-0.5 rounded uppercase tracking-widest">
              AI
            </span>
          </div>
            <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Kök Neden Analizi ve Arıza Tahmin Platformu</p>
          </div>
        </div>

        {/* menü navigasyon */}
        <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-wider">
          <button onClick={() => setCurrentView('landing')} className={`transition-all py-1 duration-300 cursor-pointer ${currentView === 'landing' ? 'text-[#4285F4] border-b-2 border-[#4285F4] scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Anasayfa</button>
          <button onClick={() => setCurrentView('dashboard')} className={`transition-all py-1 duration-300 cursor-pointer ${currentView === 'dashboard' ? 'text-[#34A853] border-b-2 border-[#34A853] scale-105' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Konsol / Dashboard</button>
          <button 
            onClick={() => {
              setCurrentView('landing');
              setTimeout(() => {
                document.getElementById('hakkinda')?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }} 
            className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            Hakkında
          </button>
        </nav>

        {/* sağ kontrol */}
        <div className="flex items-center gap-4 relative z-50">
          <button onClick={() => setDarkMode(!darkMode)} className={`p-2.5 rounded-xl border transition-all cursor-pointer ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'}`}>
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[11px] font-bold uppercase tracking-wider shadow-inner ${darkMode ? 'bg-slate-900 border-slate-700 text-[#34A853]' : 'bg-slate-100 border-slate-200 text-green-600'}`}>
            <span className="w-2 h-2 rounded-full bg-[#34A853] animate-ping" />
            <span>Sistem Aktif</span>
          </div>
        </div>
      </header>

      {/* sayfa geçişleri */}
      <AnimatePresence mode="wait">
        {currentView === 'landing' ? (
          <LandingPage key="landing" onEnterConsole={() => setCurrentView('dashboard')} darkMode={darkMode} />
        ) : (
          <Dashboard 
            darkMode={darkMode}
            formData={formData}
            handleChange={handleChange}
            handlePredict={handlePredict}
            mockResult={mockResult}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            uploadedFile={uploadedFile}
            setUploadedFile={setUploadedFile}
            loading={loading}
          />
        )}
      </AnimatePresence>
    </div>
  );
}