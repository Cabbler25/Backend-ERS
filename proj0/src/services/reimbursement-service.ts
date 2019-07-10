import Reimbursement from '../models/Reimbursement';

const reimbursements: Array<Reimbursement> = new Array;
let count: number = 0;

export function getReimbursementByStatusId(id): Reimbursement {
    return reimbursements.find((v) => {
        return v.status == id;
    });
}

export function getReimbursementByUserId(id): Reimbursement {
    return reimbursements.find((v) => {
        return v.resolver == id;
    });
}

export function submitReimbursement(): Reimbursement {
    const reimbursement = new Reimbursement(count, 'me', '500', Date.now(), 'unresolved', 'This is a test.', 0, 500, 'bad');
    count = reimbursements.push(reimbursement);
    return reimbursement;
}

export function updateReimbursement(body): Reimbursement {
    let id = body.reimbursementId;
    let idx = reimbursements.findIndex((v) => {
        return v.reimbursementId == id;
    });
    if (!idx) return;
    
    const reimbrsmnt: Reimbursement = reimbursements[idx];

    for (let a in body) {
        reimbrsmnt[a] = body[a];
    }

    reimbursements[idx] = reimbrsmnt;
    return reimbrsmnt;
}