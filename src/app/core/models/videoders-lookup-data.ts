import { DersTuru } from './ders-turu';
import { DersSeviyesi } from './ders-seviyesi';
import { DersNiteligi } from './ders-niteligi';
import { DersOzet } from './ders-ozet';
import { HedefKitleEgitimSeviyesiResponse } from './hedef-kitle-egitim-seviyesi-response';
import { DersCekimYontemiResponse } from './ders-cekim-yontemi-response';
import { OdemeKaynak } from './odeme-kaynak';

export interface VideodersLookupData {
  dersTurleri: DersTuru[];
  dersSeviyeleri: DersSeviyesi[];
  dersNitelikleri: DersNiteligi[];
  hedefKitleEgitimSeviyeleri: HedefKitleEgitimSeviyesiResponse[];
  dersCekimYontemleri: DersCekimYontemiResponse[];
  odemeKaynaklari: OdemeKaynak[];
  dersler: DersOzet[];
}
