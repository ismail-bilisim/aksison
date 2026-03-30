import { SurecTuruOzet } from './surec-turu-ozet';
import { KullaniciOzet } from './kullanici-ozet';
import { PrensipResponse } from './prensip-response';
import { StandartResponse } from './standart-response';
import { SurecAdimResponse } from './surec-adim-response';

export interface ProsedurResponse {
  id: number;
  version: number;
  adi: string;
  icerikSurum: number;
  amac: string | null;
  kapsam: string | null;
  durumu: string | null;
  durumuAdi: string | null;
  yururlukteMi: boolean;
  yururlukTarihi: string | null;
  surecTuru: SurecTuruOzet | null;
  prensipler: PrensipResponse[];
  standartlar: StandartResponse[];
  surecAdimlar: SurecAdimResponse[];
  ekleyenKullanici: KullaniciOzet | null;
  eklemeTarihi: string | null;
  degistireKullanici: KullaniciOzet | null;
  degistirmeTarihi: string | null;
  onaylayan: KullaniciOzet | null;
  onayTarihi: string | null;
}
