import os
from crewai import Agent
from langchain_google_genai import ChatGoogleGenerativeAI

class MaintenanceAgents:
    def __init__(self):
        # Gemini modelini tanımlıyoruz (Tercihe göre gemini-2.5-flash veya gemini-2.5-pro)
        # os.environ["GEMINI_API_KEY"] sistemde yüklü olmalıdır.
        api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
        self.gemini_llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash",
            temperature=0.2,
            google_api_key=os.environ.get("GEMINI_API_KEY")
        )

    def data_analyst_agent(self) -> Agent:
        return Agent(
            role="Kıdemli Veri Analisti Ajanı",
            goal="Sensör değerlerini ve zaman serisi verilerini inceleyerek normal dışı sapmaları ve anormallikleri tespit etmek.",
            backstory=(
                "Endüstriyel IoT sensörleri, zaman serisi analizleri ve veri anomalileri "
                "konusunda uzman bir analistsin. Gelen ham sensör verilerindeki (sıcaklık, "
                "titreşim, basınç vb.) mikro değişimleri yakalayarak sistemin mevcut sağlık durumunu çıkartırsın."
            ),
            verbose=True,
            allow_delegation=False,
            llm=self.gemini_llm  # Gemini modeli enjekte edildi
        )

    def root_cause_expert_agent(self) -> Agent:
        return Agent(
            role="Kök Neden Bakım Uzmanı",
            goal="Olası arıza türlerini, sensör verilerini ve SHAP (özellik önemi) çıktılarını "
                 "analiz ederek nokta atışı kök neden tespiti yapmak ve somut bir aksiyon planı hazırlamak.",
            backstory=(
                "Makine mühendisliği ve kestirimci bakım süreçlerinde yılların deneyimine sahip bir uzmansın. "
                "Yapay zeka modellerinin ürettiği SHAP değerlerini okuyarak, hangi sensörün arızayı ne kadar "
                "tetiklediğini mükemmel şekilde analiz edersin. Amacın sadece arızayı söylemek değil, "
                "bakım ekiplerinin sahada uygulayabileceği adım adım bir aksiyon planı sunmaktır."
            ),
            verbose=True,
            allow_delegation=True,
            llm=self.gemini_llm  # Gemini modeli enjekte edildi
        )