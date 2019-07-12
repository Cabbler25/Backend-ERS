import Reimbursement from "../models/Reimbursement";
import db from "../util/pg-connection";

export async function getReimbursementById(id: number): Promise<Reimbursement> {
    const query = {
        text: `SELECT ${Reimbursement.getColumns()} FROM reimbursements WHERE id = $1`,
        values: [id],
    }
    console.log(query.text + "\n" + query.values);

    const result = await db.query(query);
    return result.rows[0];
}

export async function getReimbursementByStatus(id: number): Promise<Reimbursement[]> {
    let query = `SELECT ${Reimbursement.getColumns()} FROM reimbursements WHERE status = $1 ORDER BY date_submitted ASC`;
    console.log(query + "\n" + id);

    const result = await db.query(query);
    return result.rows;
}

export async function getReimbursementByUser(id: number): Promise<Reimbursement[]> {
    let query = `SELECT ${Reimbursement.getColumns()} FROM reimbursements WHERE author = $1 ORDER BY date_submitted ASC`;
    console.log(query + "\n" + id);

    const result = await db.query(query);
    return result.rows;
}

export async function updateReimbursement(rmbmnt): Promise<Reimbursement> {
    let id: number = rmbmnt.id;
    delete rmbmnt.id;

    let columns: string = '';
    let values: any[] = [];
    let count: number = 1;
    for (let a in rmbmnt) {
        if (rmbmnt[a] === undefined || rmbmnt[a] === null) {
            delete rmbmnt.a;
            continue;
        }
        switch (a) {
            case 'dateSubmitted':
                columns += `date_submitted = $${count++}, `;
                break;
            case 'dateResolved':
                columns += `date_resolved = $${count++}, `;
                break;
            default:
                columns += `${a} = $${count++}, `;
        }
        values.push(rmbmnt[a]);
    }
    columns = columns.substr(0, columns.lastIndexOf(','));
    values.push(id);

    const query = {
        text: `UPDATE reimbursements SET ${columns} WHERE id = $${count} RETURNING ${Reimbursement.getColumns()}`,
        values: values,
    }

    console.log(query.text + '\n' + query.values);
    const result = await db.query(query);
    return result.rows[0];
}

export async function submitReimbursement(rmbmnt, id): Promise<Reimbursement> {
    delete rmbmnt.id;
    delete rmbmnt.author;
    delete rmbmnt.dateSubmitted;
    rmbmnt.author = id;
    rmbmnt.dateSubmitted = Date.now();

    let columns: string = '';
    let placeHolders: string = '';
    let values: any[] = [];
    let count: number = 1;
    for (let a in rmbmnt) {
        if (rmbmnt[a] === undefined || rmbmnt[a] === null) {
            // Handle columns that can be null
            if (a == 'dateResolved' || a == 'resolver') {
                delete rmbmnt.a;
                continue;
            } else return new Reimbursement({});
        }
        // Make sure table names are correct
        switch (a) {
            case 'dateSubmitted':
                columns += `date_submitted, `;
                break;
            case 'dateResolved':
                columns += `date_resolved, `;
                break;
            default:
                columns += `${a}, `;
        }
        placeHolders += `$${count++}, `;
        values.push(rmbmnt[a]);
    }
    columns = columns.substr(0, columns.lastIndexOf(','));
    placeHolders = placeHolders.substr(0, placeHolders.lastIndexOf(','));

    const query = {
        text: `INSERT INTO reimbursements (${columns}) VALUES (${placeHolders}) RETURNING ${Reimbursement.getColumns()}`,
        values: values,
    }
    console.log(query.text + '\n' + query.values);

    const result = await db.query(query);
    return result.rows[0];
}