import { DersTuru } from './ders-turu';
import { DersSeviyesi } from './ders-seviyesi';
import { DersNiteligi } from './ders-niteligi';
import { DersOzet } from './ders-ozet';
import { HedefKitleEgitimSeviyesiResponse } from './hedef-kitle-egitim-seviyesi-response';
import { OdemeKaynak } from './odemekaynak';
import { SehirOzet } from './sehir-ozet';

export interface YuzyuzedersLookupData {
  dersTurleri: DersTuru[];
  dersSeviyeleri: DersSeviyesi[];
  dersNitelikleri: DersNiteligi[];
  hedefKitleEgitimSeviyeleri: HedefKitleEgitimSeviyesiResponse[];
  odemeKaynaklari: OdemeKaynak[];
  sehirler: SehirOzet[];
  dersler: DersOzet[];
}
