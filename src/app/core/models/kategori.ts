import { KategoriOzet } from "./kategori-ozet";
import { KullaniciOzet } from "./kullanici-ozet";

export interface Kategori {
    id?: number;
    version?: number;
    kodu?: string;
    adi?: string;
    aciklama?: string;
    ustKategori?: KategoriOzet;
    ekleyenKullanici?: KullaniciOzet;
    eklemeTarihi?: string; // ISO date string
}
