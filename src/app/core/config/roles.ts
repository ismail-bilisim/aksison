/**
 * Tüm modül ve roller için merkezi yetki tablosu.
 * Burada rollerin, her kaynak (module/resource) üzerindeki izinleri tanımlanır.
 */

export const ROLES = {
  ADMIN: 'ROLE_ADMIN',
  ICYON: 'ROLE_ICYON',
  PRJYN: 'ROLE_PRJYN',
  METGL: 'ROLE_METGL',
  TAKLI: 'ROLE_TAKLI',
  KNTRL: 'ROLE_KNTRL',
  GRFDZ: 'ROLE_GRFDZ',
  VIDDZ: 'ROLE_VIDDZ',
  EGTMN: 'ROLE_EGTMN',
  OGRNC: 'ROLE_OGRNC',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];