import { KullaniciOzet } from "./kullanici-ozet";

export interface EgitmenOzet {
  id?: number;
  kod?: number;
  kullanici?: KullaniciOzet;
  unvan?: string;
}
