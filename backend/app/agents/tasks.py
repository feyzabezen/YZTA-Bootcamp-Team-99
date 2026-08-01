from crewai import Task
from textwrap import dedent

class MaintenanceTasks:
    def analyze_sensors_task(self, agent, sensor_data) -> Task:
        return Task(
            description=dedent(f"""
                Sana verilen şu anlık endüstriyel sensör verilerini detaylıca incele:
                {sensor_data}
                
                Bu değerleri analiz ederek normal sınırların dışına çıkan, aşırı yükselen veya alçalan
                sapmaları tespit et. Hangi sensörlerin kritik durumda olduğunu raporla.
            """),
            expected_output="Kritik eşikleri aşan sensörlerin ve anomalilerin listelendiği bir ön analiz raporu.",
            agent=agent
        )

    def generate_action_plan_task(self, agent, failure_type, shap_outputs) -> Task:
        return Task(
            description=dedent(f"""
                Veri Analisti Ajanı'nın hazırladığı anomali raporunu, tahmin edilen arıza türünü ve 
                aşağıdaki SHAP (özellik önemi) çıktılarını bir araya getirerek kök neden analizi yap:
                
                - Tahmin Edilen Arıza Türü: {failure_type}
                - SHAP Değerleri / Çıktıları: {shap_outputs}
                
                Hangi sensörün ya da özelliğin bu arıza tahminini en çok tetiklediğini belirle. 
                Ardından, sahada çalışacak bakım ekipleri için net, uygulanabilir ve adım adım bir 
                aksiyon planı hazırlayarak raporu sonlandır.
            """),
            expected_output="Arızanın kök nedenini açıklayan ve bakım ekibi için adım adım aksiyon maddeleri içeren nihai plan raporu.",
            agent=agent
        )
