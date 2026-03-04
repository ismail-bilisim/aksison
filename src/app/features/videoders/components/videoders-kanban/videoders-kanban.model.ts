import { DersOzet } from '../../../../core/models/ders-ozet';

export interface VideoDersKanbanColumn {
  id: string;
  title: string;
  icon: string;
  colorAccent: string;
  durumlar: string[];
  dersler: DersOzet[];
}

export const KANBAN_COLUMN_CONFIG: Omit<VideoDersKanbanColumn, 'dersler'>[] = [
  { id: 'plan', title: 'Plan', icon: 'bi-clipboard-check', colorAccent: '#4a90e2',
    durumlar: ['TASLK', 'DBONS', 'DBONY'] },
  { id: 'anlasma', title: 'Anlaşma', icon: 'bi-handshake', colorAccent: '#f5a623',
    durumlar: ['ICEGN', 'EICOS', 'ICONY', 'EOVIS', 'EOVGN', 'OVONY', 'OVREV', 'IZEGN', 'EIZOS', 'IZONY', 'IZREV', 'SOZET'] },
  { id: 'cekim', title: 'Çekim', icon: 'bi-camera-reels', colorAccent: '#7b68ee',
    durumlar: ['SOZIM'] },
  { id: 'teslim', title: 'Teslim', icon: 'bi-box-seam', colorAccent: '#e74c3c',
    durumlar: ['CKTML', 'COONV', 'CRVIS', 'DEKON', 'DEKRV', 'RVZTM', 'SRKNO', 'SRKNR', 'SRVTM'] },
  { id: 'yayin', title: 'Yayın', icon: 'bi-broadcast', colorAccent: '#2ecc71',
    durumlar: ['VMNTM', 'GRFTM', 'TVDTM', 'AYZTM', 'STBTM', 'LMSYK', 'YOEOS', 'YAYON'] }
];

export const DURUM_LABELS: Record<string, string> = {
  'TASLK': 'Taslak',
  'DBONS': 'Başlatma Onayında',
  'DBONY': 'Başlatma Onaylandı',
  'ICEGN': 'İçerik Eğitmende',
  'EICOS': 'İçerik Onayında',
  'ICONY': 'İçerik Onaylandı',
  'EOVIS': 'Ö. Video İstendi',
  'EOVGN': 'Ö. Video Gönderildi',
  'OVONY': 'Ö. Video Onaylandı',
  'OVREV': 'Ö. Video Revize',
  'IZEGN': 'İzlence Eğitmende',
  'EIZOS': 'İzlence Onayında',
  'IZONY': 'İzlence Onaylandı',
  'IZREV': 'İzlence Revize',
  'SOZET': 'Sözleşme Talep',
  'SOZIM': 'Sözleşme İmzalandı',
  'CKTML': 'Çekim Tamamlandı',
  'COONV': 'Çekim Ön Onay',
  'CRVIS': 'Çekim Revize',
  'DEKON': 'Detaylı K. Onay',
  'DEKRV': 'Detaylı K. Revize',
  'RVZTM': 'Revize Tamamlandı',
  'SRKNO': 'Soru K. Onay',
  'SRKNR': 'Soru K. Revize',
  'SRVTM': 'Soru Revize OK',
  'VMNTM': 'Montaj Tamamlandı',
  'GRFTM': 'Grafik Tamamlandı',
  'TVDTM': 'Tanıtım Video OK',
  'AYZTM': 'Alt Yazı OK',
  'STBTM': 'Storyboard OK',
  'LMSYK': 'LMS Yüklendi',
  'YOEOS': 'Yayın Onayında',
  'YAYON': 'Yayın Onaylandı'
};
