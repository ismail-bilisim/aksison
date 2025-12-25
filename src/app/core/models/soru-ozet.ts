import { SoruTipiOzet } from "./soru-tipi-ozet";

export interface SoruOzet {
  id: number;
  soruTipi: SoruTipiOzet;
  soruMetni: string;
}
