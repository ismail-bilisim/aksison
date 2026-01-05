/**
 * Tüm modül ve roller için merkezi yetki tablosu.
 * Burada rollerin, her kaynak (module/resource) üzerindeki izinleri tanımlanır.
 * İzinler: 'VIEW' | 'CREATE' | 'EDIT' | 'DELETE' | 'APPROVE' | 'EXPORT' | 'ASSIGN' ...
 */

export type ActionType =
    | 'VIEW'
    | 'CREATE'
    | 'EDIT'
    | 'DELETE'
    | 'APPROVE'
    | 'EXPORT'
    | 'ASSIGN'
    | 'ASSIGN_SELF'
    | 'ASSIGN_OTHERS';

export type ResourceType =
    | 'VIDEODERS'
    | 'KULLANICI'
    | 'ROL'
    | 'KATEGORI'
    | 'SYSTEM'
    | 'TALEP';

export interface RoleAccessDefinition {
    [role: string]: {
        [resource in ResourceType]?: ActionType[];
    };
}

export const ROLE_ACCESS_MAP: RoleAccessDefinition = {
    ROLE_ADMIN: {
        VIDEODERS: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE'],
        KULLANICI: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        ROL: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        KATEGORI: ['VIEW', 'CREATE', 'EDIT', 'DELETE'],
        SYSTEM: ['EXPORT'],
        TALEP: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'ASSIGN', 'ASSIGN_SELF', 'ASSIGN_OTHERS'],
    },

    ROLE_ICYON: {
        VIDEODERS: ['VIEW', 'EDIT'],
        KULLANICI: ['VIEW'],
        TALEP: ['VIEW', 'CREATE', 'EDIT'],
    },

    ROLE_PRJYN: {
        VIDEODERS: ['VIEW', 'CREATE', 'EDIT'],
        TALEP: ['VIEW', 'CREATE', 'EDIT', 'ASSIGN_SELF'],
    },

    ROLE_METGL: {
        VIDEODERS: ['VIEW', 'EDIT'],
        TALEP: ['VIEW', 'CREATE', 'EDIT'],
    },

    ROLE_TAKLI: {
        VIDEODERS: ['VIEW', 'CREATE', 'EDIT', 'APPROVE'],
        KULLANICI: ['VIEW'],
        TALEP: ['VIEW', 'CREATE', 'EDIT', 'DELETE', 'APPROVE', 'ASSIGN', 'ASSIGN_OTHERS'],
    },

    ROLE_KNTRL: {
        VIDEODERS: ['VIEW'],
        TALEP: ['VIEW'],
    },

    ROLE_GRFDZ: {
        VIDEODERS: ['VIEW', 'EDIT'],
        TALEP: ['VIEW', 'CREATE'],
    },

    ROLE_VIDDZ: {
        VIDEODERS: ['VIEW', 'EDIT'],
        TALEP: ['VIEW', 'CREATE'],
    },

    ROLE_EGTMN: {
        VIDEODERS: ['VIEW', 'CREATE'],
        TALEP: ['VIEW', 'CREATE'],
    },

    ROLE_OGRNC: {
        VIDEODERS: ['VIEW'],
        TALEP: ['VIEW'],
    },
};
