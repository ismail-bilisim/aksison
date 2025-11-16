export interface VideoDers {
    id?: number;
    kodu?: number;
    adi: string;
    tahminiDersSuresi?: number;
    tahminiDersTeslimTarihi?: string;
    baslamaTarihi?: string;
    dersTeslimTarihi?: string;
    amaci?: string;
    turuKodu?: string;
    seviyesiKodu?: string;
    niteligiKodu?: string;
    hedefKitleEgitimSeviye?: number;
    ilgiAlaninaGoreHedefKitle?: string;
    kullanilacakProgramlar?: string;
    kazanimlar?: string;
    sikcaSorulanSorular?: string;
    dersOzeti?: string;
    dersCekimYontemi?: number;
    portalAdresi?: string;
    onayDurumu?: string;
    paydasId?: number;
    odemeKaynak?: string;
    birimUcret?: number;
    toplamUcret?: number;
    durumKodu?: string;
    icerikYoneticisiId?: number;
    projeYoneticisiId?: number;
    materyalGelistiriciId?: number;
    kontrolEdenId?: number;
    grafikDuzenleyiciId?: number;
    videoDuzenleyiciId?: number;
    lmsSorumluId?: number;
    medyaSorumluId?: number;
    dersKodu?: number;
}

