import os
from crewai import Agent, LLM

class MaintenanceAgents:
    def __init__(self):
        # Ollama modelini tanımlıyoruz (yerelde çalıştığını varsayıyoruz)
        self.llm_instance = LLM(
            model="ollama_chat/llama3.1",
            base_url=os.environ.get("OLLAMA_BASE_URL", "http://localhost:11434"),
            temperature=0.7,
            max_retries=5,
            timeout=60.0
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
            llm=self.llm_instance
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
            llm=self.llm_instance
        )