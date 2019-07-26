export const roles = {
    ADMIN: 'admin',
    FINANCE_MANAGER: 'finance-manager',
    USER: 'user',
    ALL: 'all'
}

export default class Role {
    id: number;
    role: string;

    constructor(obj) {
        this.id = obj.id;
        this.role = obj.role;
    }

    static getColumns(): string {
        return 'id, role';
    }

    static hasPermission(id, requiredId) {
        if (id <= requiredId) {
            return true;
        }
        return false;
    }
}