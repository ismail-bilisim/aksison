import { DersTuru } from './ders-turu';
import { DersSeviyesi } from './ders-seviyesi';
import { DersNiteligi } from './ders-niteligi';
import { DersDurumu } from './ders-durumu';
import { DersOzet } from './ders-ozet';

export interface VideoDers {
    id?: number;
    version?: number;
    kodu?: number;
    adi: string;
    tahminiDersSuresi?: number;
    tahminiDersTeslimTarihi?: string;
    baslamaTarihi?: string;
    dersTeslimTarihi?: string;
    amaci?: string;

    // 🔹 Eksik alanı ekliyoruz:
    durumKodu?: string;

    // 🔹 İlişkili DTO'lar
    ders?: DersOzet;
    turu?: DersTuru;
    seviyesi?: DersSeviyesi;
    niteligi?: DersNiteligi;
    dersDurumu?: DersDurumu;

    // 🔹 Diğer alanlar...
    hedefKitleEgitimSeviye?: number;
    ilgiAlaninaGoreHedefKitle?: string;
    kullanilacakProgramlar?: string;
    kazanimlar?: string;
    sikcaSorulanSorular?: string;
    dersOzeti?: string;
    dersCekimYontemi?: number;
    portalAdresi?: string;
    onayDurumu?: string;
    odemeKaynak?: string;
    birimUcret?: number;
    toplamUcret?: number;
    icerikYoneticisiID?: number;
    projeYoneticisiID?: number;
    materyalGelistiriciID?: number;
    kontrolEdenID?: number;
    grafikDuzenleyiciID?: number;
    videoDuzenleyiciID?: number;
    lmsSorumluID?: number;
    medyaSorumluID?: number;
}
