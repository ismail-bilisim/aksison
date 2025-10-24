export interface Kullanici {
    id?: number;
    version?: number;
    kullaniciAdi: string;
    sifre?: string;
    ad: string;
    soyad: string;
    tcKimlikNo?: number;
    dogumTarihi?: string;
    cinsiyet?: string;
    telefon?: string;
    ePosta?: string;
    aktifMi?: boolean;
    ekleyenKullaniciId?: number;
    eklemeTarihi?: string;
}

