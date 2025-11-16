import { DersDurumu } from "./ders-durumu";

export interface DersOzet {
  id?: number;
  kodu?: number;
  adi?: string;
  durumKodu?: string;
  durumu?: DersDurumu; // Eksik olan alan
}
