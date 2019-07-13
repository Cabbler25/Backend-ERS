import Reimbursement from "../models/Reimbursement";
import db from "../util/pg-connection";

// Get by reimbursement ID
export async function getReimbursementById(id: number): Promise<Reimbursement> {
    let query = `SELECT ${Reimbursement.getColumns()} FROM reimbursements WHERE id = $1`;
    console.log(`${query}\nValues: [ ${id} ]`);

    const result = await db.query(query, [id]);
    return result.rows[0];
}

// Get by reimbursement status ID
export async function getReimbursementByStatus(id: number): Promise<Reimbursement[]> {
    let query = `SELECT ${Reimbursement.getColumns()} FROM reimbursements WHERE status = $1 ORDER BY date_submitted ASC`;
    console.log(`${query}\nValues: [ ${id} ]`);

    const result = await db.query(query, [id]);
    return result.rows;
}

// Get by reimbursement user ID
export async function getReimbursementByUser(id: number): Promise<Reimbursement[]> {
    let query = `SELECT ${Reimbursement.getColumns()} FROM reimbursements WHERE author = $1 ORDER BY date_submitted ASC`;
    console.log(`${query}\nValues: [ ${id} ]`);

    const result = await db.query(query, [id]);
    return result.rows;
}

// Patch reimbursement
export async function updateReimbursement(rmbmnt): Promise<Reimbursement> {
    let id: number = rmbmnt.id;

    // Remove properties that may never be updated
    delete rmbmnt.id;
    delete rmbmnt.dateResolved;

    // Gather all properties and values 
    // into a SQL query. Fun
    let columns: string = '';
    let values: any[] = [];
    let count: number = 1;
    for (let a in rmbmnt) {
        // Exclude undefined/null properties
        if (rmbmnt[a] === undefined || rmbmnt[a] === null) {
            delete rmbmnt.a;
            continue;
        }
        // Convert class var names -> db column names
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

    let query = `UPDATE reimbursements SET ${columns} WHERE id = $${count} RETURNING ${Reimbursement.getColumns()}`;
    console.log(`${query}\nValues: [ ${values} ]`);

    const result = await db.query(query, values);
    return result.rows[0];
}

// Submit reimbursement
export async function submitReimbursement(rmbmnt, id): Promise<Reimbursement> {
    // Remove properties that are auto-generated
    delete rmbmnt.id; delete rmbmnt.author; delete rmbmnt.dateSubmitted;
    delete rmbmnt.dateResolved;
    rmbmnt.author = id;
    rmbmnt.dateSubmitted = Date.now();

    // Gather all properties and values 
    // into a SQL query. Fun
    let columns: string = '';
    let placeHolders: string = '';
    let values: any[] = [];
    let count: number = 1;
    for (let a in rmbmnt) {
        if (rmbmnt[a] === undefined || rmbmnt[a] === null) {
            // Handle columns that can be null
            if (a == 'resolver') {
                delete rmbmnt.a;
                continue;
            } else return new Reimbursement({}); // lacks required properties
        }
        // Convert class var names -> db column names
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

    // Jesus that took a while
    let query = `INSERT INTO reimbursements (${columns}) VALUES (${placeHolders}) RETURNING ${Reimbursement.getColumns()}`;
    console.log(`${query}\nValues: [ ${values} ]`);

    const result = await db.query(query, values);
    return result.rows[0];
}