export const permissions = {
    ADMIN: 'admin',
    FINANCE_MANAGER: 'finance-manager',
    EMPLOYEE: 'employee'
}

export default class Role {
    roleId: number; // primary key
    role: Enumerator; // not null, unique    
    
    constructor(roleId: number, role: Enumerator) {
        this.roleId = roleId;
        this.role = role;
    }
}