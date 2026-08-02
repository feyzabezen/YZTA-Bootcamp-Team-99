import pandas as pd
import numpy as np


def ozellik_muhendisligi(df):
    """
    Modelin eğitiminde kullanılan tüm türetilmiş (engineered) özellikleri hesaplar.
    NOT: Bu fonksiyon, X_train/X_test verisi ZATEN standardize edilmiş (scale
    edilmiş) haldeyken çağrılmalıdır (bkz. CleanedDataset/X_train.csv).
    """
    print("[BİLGİ] Özellik mühendisliği adımı uygulanıyor...")

    # Sütun isimleri
    hava_sicakligi = 'Air temperature [K]'
    islem_sicakligi = 'Process temperature [K]'
    donus_hizi = 'Rotational speed [rpm]'
    tork = 'Torque [Nm]'
    takim_asinmasi = 'Tool wear [min]'

    # 1) Sıcaklık farkı (mutlak değer!)
    df['Temperature_Diff'] = np.abs(df[islem_sicakligi] - df[hava_sicakligi])
    print("[BAŞARILI] 'Temperature_Diff' özelliği başarıyla eklendi.")

    # 2) Güç (Power) = Tork * Dönüş hızı
    df['Power'] = df[tork] * df[donus_hizi]
    print("[BAŞARILI] 'Power' özelliği başarıyla eklendi.")

    # 3) Takım aşınması * Tork etkileşimi
    df['Tool_Wear_Torque'] = df[takim_asinmasi] * df[tork]
    print("[BAŞARILI] 'Tool_Wear_Torque' özelliği başarıyla eklendi.")

    return df