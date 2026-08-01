import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import Papa from 'papaparse';
import { Activity, Upload, CheckCircle, FileText, ShieldAlert, AlertTriangle, Sparkles, Gauge } from 'lucide-react';

declare const Plotly: any;

const mockChartData = [
  { name: 'Log #102', sicaklik: 300.1, tork: 42.5, hiz: 1480 },
  { name: 'Log #103', sicaklik: 301.5, tork: 44.0, hiz: 1510 },
  { name: 'Log #104', sicaklik: 302.2, tork: 41.2, hiz: 1495 },
  { name: 'Log #105', sicaklik: 304.8, tork: 56.6, hiz: 1580 }, 
  { name: 'Log #106', sicaklik: 305.0, tork: 58.1, hiz: 1610 }, 
  { name: 'Log #107', sicaklik: 301.2, tork: 40.5, hiz: 1500 },
];

interface DashboardProps {
  darkMode: boolean;
  formData: {
    airTemp: number;
    processTemp: number;
    rotSpeed: number;
    torque: number;
    toolWear: number;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handlePredict: (e: React.FormEvent<HTMLFormElement>) => void;
  mockResult: {
    failureRisk: string;
    rootCause: string;
    status: string;
    analystReport: string;
    actionPlan: string[];
  } | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  uploadedFile: string | null;
  setUploadedFile: (file: string | null) => void;
}

export default function Dashboard({ 
  darkMode, 
  formData, 
  handleChange, 
  handlePredict, 
  mockResult, 
  activeTab, 
  setActiveTab, 
  uploadedFile, 
  setUploadedFile 
}: DashboardProps) {
  const [timeArray, setTimeArray] = useState<string[]>([]);
  const [tempArray, setTempArray] = useState<number[]>([]);
  const [torqueArray, setTorqueArray] = useState<number[]>([]);

  const chartRef = useRef<HTMLDivElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file.name);
      
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows = results.data as any[];
          const times = rows.map((_, index) => `Log #${index + 1}`);
          const temps = rows.map(row => parseFloat(row.air_temperature || row.airTemp || row.sicaklik || row.AirTemp || 0));
          const torques = rows.map(row => parseFloat(row.torque || row.tork || row.Torque || 0));

          setTimeArray(times);
          setTempArray(temps);
          setTorqueArray(torques);
        }
      });
    }
  };

  useEffect(() => {
    if (!chartRef.current || typeof Plotly === 'undefined') return;

    let data: any[] = [];

    if (timeArray.length > 0) {
      data = [
        {
          x: timeArray,
          y: tempArray,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Sıcaklık (K)',
          marker: { color: '#EA4335' },
        },
        {
          x: timeArray,
          y: torqueArray,
          type: 'scatter',
          mode: 'lines',
          name: 'Tork (Nm)',
          marker: { color: '#FBBC05' },
          yaxis: 'y2'
        }
      ];
    } else {
      data = [
        {
          x: mockChartData.map(d => d.name),
          y: mockChartData.map(d => d.sicaklik),
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Sıcaklık (K) (Örnek)',
          marker: { color: '#EA4335' },
        },
        {
          x: mockChartData.map(d => d.name),
          y: mockChartData.map(d => d.tork),
          type: 'scatter',
          mode: 'lines',
          name: 'Tork (Nm) (Örnek)',
          marker: { color: '#FBBC05' },
          yaxis: 'y2'
        }
      ];
    }

    const layout = {
      autosize: true,
      paper_bgcolor: 'transparent',
      plot_bgcolor: 'transparent',
      margin: { t: 20, r: 40, l: 40, b: 40 },
      showlegend: true,
      legend: { orientation: 'h', y: -0.25 },
      font: { color: darkMode ? '#64748b' : '#334155', size: 10 },
      xaxis: { gridcolor: darkMode ? '#334155' : '#e2e8f0', zeroline: false },
      yaxis: { title: 'Sıcaklık (K)', gridcolor: darkMode ? '#334155' : '#e2e8f0', zeroline: false },
      yaxis2: { title: 'Tork (Nm)', overlaying: 'y', side: 'right', gridcolor: 'transparent', zeroline: false }
    };

    const config = { responsive: true, displayModeBar: false };

    // Çizim yapmadan önce elementin genişliğini tam olarak algılaması için kısa bir ara veriyoruz
    const timer = setTimeout(() => {
      if (chartRef.current && typeof Plotly !== 'undefined') {
        Plotly.newPlot(chartRef.current, data, layout, config);
      }
    }, 50);

    return () => {
      clearTimeout(timer);
      if (chartRef.current && typeof Plotly !== 'undefined') {
        try {
          Plotly.purge(chartRef.current);
        } catch (e) {
          console.error(e);
        }
      }
    };
  }, [timeArray, tempArray, torqueArray, darkMode, mockResult]); 

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10 w-full"
    >
      {/* sol panel */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div className={`border p-1.5 rounded-xl flex gap-2 shadow-sm ${darkMode ? 'bg-[#28292e] border-slate-700' : 'bg-slate-200/60 border-slate-300'}`}>
          <button onClick={() => setActiveTab('single')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer ${activeTab === 'single' ? 'bg-[#4285F4] text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'}`}>Tekli Telemetri</button>
          <button onClick={() => setActiveTab('bulk')} className={`flex-1 py-2.5 rounded-lg text-xs font-bold uppercase transition-all duration-300 cursor-pointer ${activeTab === 'bulk' ? 'bg-[#34A853] text-white shadow-md' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Toplu CSV Analizi</button>
        </div>

        {activeTab === 'single' ? (
          <div className={`border rounded-2xl p-6 shadow-sm transition-all duration-500 ${darkMode ? 'bg-[#28292e] border-slate-700 focus-within:border-[#4285F4]/50' : 'bg-white border-slate-200 focus-within:border-blue-400'}`}>
            <h2 className="text-md font-bold mb-5 flex items-center gap-2.5 text-[#4285F4] pb-3 border-b border-slate-200 dark:border-slate-800"><Activity className="w-5 h-5" /> Gerçek Zamanlı Parametre Girişi</h2>
            <form onSubmit={handlePredict} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Hava Sıcaklığı (K)</label>
                <input type="number" step="0.1" name="airTemp" value={formData.airTemp} onChange={handleChange} className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-mono ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-[#4285F4]' : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-500'}`} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">İşlem Sıcaklığı (K)</label>
                <input type="number" step="0.1" name="processTemp" value={formData.processTemp} onChange={handleChange} className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-mono ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-[#4285F4]' : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-500'}`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Dönme Hızı (rpm)</label>
                  <input type="number" name="rotSpeed" value={formData.rotSpeed} onChange={handleChange} className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-mono ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-[#4285F4]' : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-500'}`} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5">Tork (Nm)</label>
                  <input type="number" step="0.1" name="torque" value={formData.torque} onChange={handleChange} className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-mono ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-[#4285F4]' : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-500'}`} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Takım Aşınması (dk)</label>
                <input type="number" name="toolWear" value={formData.toolWear} onChange={handleChange} className={`w-full rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/20 transition-all font-mono ${darkMode ? 'bg-slate-900 border-slate-700 text-slate-100 focus:border-[#4285F4]' : 'bg-slate-100 border-slate-300 text-slate-900 focus:border-blue-500'}`} />
              </div>
              <button type="submit" className="w-full bg-[#4285F4] hover:bg-[#3367D6] text-white text-sm font-bold py-3.5 rounded-xl shadow-md transition-all cursor-pointer">
                <span className="flex items-center justify-center gap-2"><Sparkles className="w-4 h-4" /> Arıza Riskini Hesapla</span>
              </button>
            </form>
          </div>
        ) : (
          <div className={`border rounded-2xl p-6 shadow-sm transition-all duration-500 ${darkMode ? 'bg-[#28292e] border-slate-700 hover:border-green-500/30' : 'bg-white border-slate-200 hover:border-green-300'}`}>
            <h2 className="text-md font-bold mb-5 flex items-center gap-2.5 text-[#34A853] pb-3 border-b border-slate-200 dark:border-slate-800"><Upload className="w-5 h-5" /> Endüstriyel Toplu Analiz</h2>
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative group/upload ${darkMode ? 'border-slate-700 bg-slate-900/30 hover:border-[#34A853]/40' : 'border-slate-300 bg-slate-50 hover:border-green-400'}`}>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              <Upload className="w-10 h-10 text-slate-400 group-hover/upload:text-[#34A853] mx-auto mb-3 transition-transform" />
              <p className="text-sm font-semibold">Fabrika log dosyasını sürükleyin veya seçin</p>
            </div>
            {uploadedFile && (
              <div className="mt-4 flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl text-xs text-emerald-400"><CheckCircle className="w-5 h-5 flex-shrink-0" /> <span className="font-medium truncate">Yüklenen Dosya Şeması Alındı: {uploadedFile}</span></div>
            )}
          </div>
        )}
      </div>

      {/* sağ panel */}
      <div className="lg:col-span-7 w-full block">
        <div className={`border rounded-2xl p-6 shadow-md w-full block transition-all duration-500 ${darkMode ? 'bg-[#28292e] border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-slate-800 pb-3 mb-5">
            <h2 className="text-md font-bold flex items-center gap-2.5 text-[#34A853] tracking-wide"><FileText className="w-5 h-5" /> Teşhis ve Yapay Zeka Çıktısı</h2>
          </div>

          {/* İçerik Düzeni Girişi */}
          <div className="w-full block space-y-6">
            {mockResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className={`border p-5 rounded-2xl flex items-center gap-4 ${darkMode ? 'bg-slate-900 border-[#EA4335]/30' : 'bg-slate-50 border-slate-200'}`}>
                  <ShieldAlert className="w-10 h-10 text-[#EA4335]" />
                  <div>
                    <div className="text-[10px] text-[#EA4335] font-bold uppercase tracking-wider">Arıza Riski Oranı</div>
                    <div className="text-3xl font-bold text-[#EA4335] font-mono">{mockResult.failureRisk}</div>
                  </div>
                </div>
                <div className={`border p-5 rounded-2xl flex items-center gap-4 ${darkMode ? 'bg-slate-900 border-[#FBBC05]/30' : 'bg-slate-50 border-slate-200'}`}>
                  <AlertTriangle className="w-10 h-10 text-[#FBBC05]" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-[#FBBC05] font-bold uppercase tracking-wider">Tespit Edilen Kök Neden</div>
                    <div className="text-sm font-bold text-[#FBBC05] truncate mt-1">{mockResult.rootCause}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Grafik Alanı - Taşıyıcı genişliği tam genişliğe zorlanarak kilitlendi */}
            <div className={`border rounded-xl p-4 w-full block ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-2 mb-4 text-xs font-bold tracking-widest uppercase text-[#4285F4]"><Gauge className="w-4 h-4" /> Canlı Sensör Trend Logları (Telemetry Analiz)</div>
              <div className="w-full min-h-[300px] block" ref={chartRef}></div>
            </div>

            {mockResult && (
              <div className={`space-y-4 border rounded-2xl p-5 block shadow-inner ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                <div>
                  <h3 className="text-xs font-bold text-[#4285F4] uppercase tracking-widest mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#4285F4]"></span> Analist Ajan Yorumu</h3>
                  <p className={`text-sm leading-relaxed border p-3 rounded-xl font-medium ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>{mockResult.analystReport}</p>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-[#34A853] uppercase tracking-widest mb-2 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-[#34A853]"></span> Bakım Uzmanı Eylem Planı</h3>
                  <div className={`border p-3 rounded-xl space-y-2 ${darkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>
                    {mockResult.actionPlan.map((step, idx) => (
                      <div key={idx} className="text-sm flex gap-2 items-start font-medium">
                        <span className="text-[#34A853] font-bold font-mono">{idx + 1}.</span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center p-4 border border-dashed rounded-xl border-slate-300 dark:border-slate-700 text-slate-400 select-none">
              <p className="text-sm font-bold tracking-wide">Telemetri Analiz Hattı Hazır</p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-medium">Sol panelden canlı verileri girip risk hesaplamasını tetikleyin veya fabrika log dökümünü (.csv) sisteme aktarın.</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
