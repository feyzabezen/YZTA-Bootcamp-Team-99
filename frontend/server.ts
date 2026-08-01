import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  app.post("/api/v1/predict", async (req, res) => {
    try {
      const { type, air_temperature, process_temperature, rotational_speed, torque, tool_wear } = req.body;

      const air = parseFloat(air_temperature) || 300.0;
      const proc = parseFloat(process_temperature) || 310.0;
      const rpm = parseInt(rotational_speed) || 1500;
      const tq = parseFloat(torque) || 40.0;
      const wear = parseInt(tool_wear) || 0;

      let machine_failure = false;
      let failure_probability = 0.05;
      let failure_type = "No Failure";
      let risk_level = "Low";
      let recommendation = "Makine normal çalışıyor.";

      const tempDiff = proc - air;
      const power = tq * rpm * (Math.PI / 30); // Rad/s gücü

      if (wear >= 200) {
        machine_failure = true;
        failure_type = "Tool Wear Failure";
        risk_level = "Medium";
        recommendation = "Takımı değiştirin (Takım aşınması kritik seviyede: " + wear + " dk).";
        failure_probability = 0.82;
      } else if (tempDiff < 8.6 && rpm < 1380) {
        machine_failure = true;
        failure_type = "Heat Dissipation Failure";
        risk_level = "High";
        recommendation = "Soğutma sistemini kontrol edin. Isı dağılımı yetersiz.";
        failure_probability = 0.88;
      } else if (power < 3500 || power > 9000) {
        machine_failure = true;
        failure_type = "Power Failure";
        risk_level = "High";
        recommendation = "Motor yükünü azaltın. Güç tüketimi normal sınırların dışında (" + Math.round(power) + " W).";
        failure_probability = 0.94;
      } else if (tq >= 55.0 || rpm >= 2600) {
        machine_failure = true;
        failure_type = "Overstrain Failure / Aşırı Gerilim";
        risk_level = "High";
        recommendation = "Aşırı yüklenmeyi önlemek adına tork sınırlandırma valflerini aktif hale getirin.";
        failure_probability = 0.87;
      }

      let agent_analysis_report = null;

      if (machine_failure && process.env.GEMINI_API_KEY) {
        try {
          const prompt = `
            Aşağıdaki endüstriyel sensör verilerini ve kestirimci bakım kural motorunun tespit ettiği arıza türünü detaylıca analiz et:
            
            - Makine Tipi: ${type}
            - Hava Sıcaklığı: ${air} K
            - Proses Sıcaklığı: ${proc} K (Sıcaklık Farkı: ${tempDiff.toFixed(2)} K)
            - Dönüş Hızı: ${rpm} RPM
            - Tork: ${tq} Nm (Hesaplanan Güç: ${Math.round(power)} W)
            - Takım Aşınması: ${wear} dk
            - Tahmin Edilen Arıza Türü: ${failure_type}
            - Önerilen İlk Aksiyon: ${recommendation}

            Sen şu iki ajandan oluşan bir otonom CrewAI orkestrasyonusun:
            1. 'Kıdemli Veri Analisti Ajanı': IoT verilerini inceleyerek normal sınırların dışına çıkan sapmaları tespit edip bir Ön Rapor hazırlar.
            2. 'Kök Neden Bakım Uzmanı': Sapmaların kökenini araştırır ve sahada uygulanabilecek somut, adım adım bir Bakım Planı oluşturur.

            Lütfen bu iki ajanın analizlerini içeren tek bir birleşik rapor üret. Rapor tamamen Türkçe olmalı, profesyonel endüstriyel standartta yazılmalı ve Markdown formatında olmalı. Rapor başlığı ve bölümleri net olmalıdır.
          `;

          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              systemInstruction: "Endüstriyel Kestirimci Bakım ve IoT Sensör Analitiği alanında uzman bir yapay zeka ajansın. Tamamen Türkçe, teknik detayları güçlü ve aksiyon odaklı raporlar üretirsin."
            }
          });

          agent_analysis_report = response.text || "";
        } catch (geminiErr) {
          console.error("Gemini Rapor Üretim Hatası:", geminiErr);
          agent_analysis_report = `[Yapay Zeka Ajan Analizi] Arıza Tespiti: ${failure_type}. Risk Seviyesi: ${risk_level}. Lütfen tork limitlerini kontrol edin ve aşırı ısınmayı önlemek için soğutma ünitelerini devreye alın.`;
        }
      } else if (machine_failure) {
        agent_analysis_report = `[Yapay Zeka Ajan Analizi] Arıza Durumu: ${failure_type} saptandı. API anahtarı yüklendiğinde, Kıdemli Veri Analisti ve Kök Neden Bakım Uzmanı ajanları burada tam teşekküllü bir eylem raporu oluşturacaktır.`;
      }

      res.json({
        machine_failure,
        failure_probability,
        failure_type,
        risk_level,
        recommendation,
        agent_analysis_report
      });

    } catch (err: any) {
      console.error("Prediction API Hatası:", err);
      res.status(500).json({ error: "İç sunucu hatası oluştu." });
    }
  });

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Sunucu aktif: http://localhost:${PORT}`);
  });
}

startServer();
