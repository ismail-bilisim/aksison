/**
 * Tüm modül ve roller için merkezi yetki tablosu.
 * Burada rollerin, her kaynak (module/resource) üzerindeki izinleri tanımlanır.
 * İzinler: 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE' | 'EXPORT' ...
 */

export type ActionType =
    | 'VIEW'
    | 'CREATE'
    | 'EDIT'
    | 'DELETE'
    | 'APPROVE'
    | 'EXPORT';

export type ResourceType =
    | 'VIDEODERS'
    | 'KULLANICI'
    | 'ROL'
    | 'KATEGORI'
    | 'SYSTEM';

export interface RoleAccessDefinition {
    [role: string]: {
        [resource in ResourceType]?: ActionType[];
    };
}

export const ROLE_ACCESS_MAP: RoleAccessDefinition = {
    ADMIN: {
        VIDEODERS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE'],
        KULLANICI: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        ROL: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        KATEGORI: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        SYSTEM: ['EXPORT'],
    },

    EDITOR: {
        VIDEODERS: ['VIEW', 'EDIT'],
        KULLANICI: ['VIEW'],
    },

    OGRETIM_ELEMANI: {
        VIDEODERS: ['VIEW', 'CREATE'],
    },

    IZLEYICI: {
        VIDEODERS: ['VIEW'],
    },
};
