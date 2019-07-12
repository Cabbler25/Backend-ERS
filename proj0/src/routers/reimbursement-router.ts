import * as reimbursementService from "../services/reimbursement-service";
import express, { Request, Response } from 'express';
import Reimbursement from "../models/Reimbursement";
import { hasPermission } from '../util/utils';
import { roles } from '../models/Role';

const reimbursementRouter = express.Router();
 
// Gets reimbursement by user ID
reimbursementRouter.get('/author/userId/:userId', async (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling get reimbursement by user');
    const id = parseInt(request.params.userId);

    if (!hasPermission(request, response, roles.FINANCE_MANAGER, id)) return;

    const rmbmnt: Reimbursement[] = await reimbursementService.getReimbursementByUser(id);
    if (rmbmnt && rmbmnt.length > 0) {
        response.status(200).json(rmbmnt);
    } else {
        response.sendStatus(404);
    }
});

// Gets reimbursement by status ID
reimbursementRouter.get('/status/:statusId', async (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling get reimbursement by status');
    const id = parseInt(request.params.statusId);

    if (!hasPermission(request, response, roles.FINANCE_MANAGER)) return;

    const rmbmnt: Reimbursement[] = await reimbursementService.getReimbursementByStatus(id);
    if (rmbmnt && rmbmnt.length > 0) {
        response.status(200).json(rmbmnt);
    } else {
        response.sendStatus(404);
    }
});

// Update reimbursement
reimbursementRouter.patch('', async (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling reimbursement patch');

    if (!hasPermission(request, response, roles.FINANCE_MANAGER)) return;

    try {
        const rmbmnt: Reimbursement = new Reimbursement(request.body[0]);
        if (!rmbmnt) throw 'Reimbursement not valid';

        const patchedRmbmnt: Reimbursement = await reimbursementService.updateReimbursement(rmbmnt);
        if (patchedRmbmnt.id) {
            response.status(201).json(patchedRmbmnt);
        } else {
            response.sendStatus(400);
        }
    } catch(e) {
        response.sendStatus(400);
    }
});

// Submit reimbursement
reimbursementRouter.post('', async (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling reimbursement submit');

    if (!hasPermission(request, response, roles.ALL)) return;

    try {
        const rmbmnt: Reimbursement = new Reimbursement(request.body[0]);
        if (!rmbmnt) throw 'Reimbursement not valid';
       
        const completedRmbmnt: Reimbursement = await reimbursementService.submitReimbursement(rmbmnt, request.cookies.user.id);
        if (completedRmbmnt.id) {
            response.status(200).json(completedRmbmnt);
        } else {
            response.sendStatus(400);
        }
    } catch(e) {
        response.sendStatus(400);
    }
});


/*
// Get reimbursement by status ID
reimbursementRouter.get('/status/:statusId', (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling get reimbursement by status ID');
    const id = parseInt(request.params.statusId);

    if (!hasPermission(request, response, roles.FINANCE_MANAGER)) return;

    let query = `SELECT * FROM reimbursements WHERE status = ${id} ORDER BY date_submitted ASC`;
    console.log(query);
    sendQuery(query).then((resolve) => {
        response.json(resolve.rows);
    }, (error) => {
        console.log('Get reimbursement err: ', error);
        response.sendStatus(404);
    });
});

// Get reimbursement by user ID
reimbursementRouter.get('/author/userId/:userId', (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling get reimbursement by user ID');
    const id = parseInt(request.params.userId);

    if (!hasPermission(request, response, roles.FINANCE_MANAGER, id)) return;

    let query = `SELECT * FROM reimbursements WHERE author = ${id} ORDER BY date_submitted ASC`;
    console.log(query);
    sendQuery(query).then((resolve) => {
        response.json(resolve.rows);
    }, (error) => {
        console.log('Get reimbursement by user ID err: ', error);
        response.sendStatus(404);
    });
});

// Submit new reimbursement
reimbursementRouter.post('', (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling reimbursement submit');

    if (!hasPermission(request, response, roles.ALL)) return;

    // Format body
    let body = request.body[0];
    // Hard code the reimbursement id as 0
    // Can be removed - don't delete reimb id
    delete body.reimbursement_id;
    let columns: string = 'reimbursement_id, ';
    let values: string = '0, ';
    for (let a in body) {
        columns += `${a}, `;
        switch (a) {
            case 'author':
                values += `${request.cookies.user.userId}, `;
                break;
            case 'date_submitted':
                values += `${Date.now()}, `;
                break;
            default:
                values += `${typeof body[a] === 'number' ? `${body[a]}` : `'${body[a]}'`}, `;
                break;
        }
    }
    columns = columns.substr(0, columns.lastIndexOf(','));
    values = values.substr(0, values.lastIndexOf(','));

    let query = `INSERT INTO reimbursements (${columns}) VALUES (${values})`;
    console.log(query);
    sendQuery(query).then((resolve) => {
        // Also hardcoded reimbursement ID as 0
        query = `SELECT * FROM reimbursements WHERE reimbursement_id = 0`;
        sendQuery(query).then((resolve) => {
            response.status(201).json(resolve.rows);
        });
    }, (error) => {
        console.log('Submit reimbursement err: ', error);
        response.sendStatus(409);
    });
});

// Update reimbursement
reimbursementRouter.patch('', (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling reimbursement update');

    if (!hasPermission(request, response, roles.FINANCE_MANAGER)) return;

    // Format body
    let body = request.body[0];
    let id = body.reimbursement_id;
    delete body.reimbursement_id;
    let properties: string = '';
    for (let a in body) {
        properties += `${a} = ${typeof body[a] === 'number' ? `${body[a]}` : `'${body[a]}'`}, `;
    }
    properties = properties.substr(0, properties.lastIndexOf(','));

    let query = `UPDATE reimbursements SET ${properties} WHERE reimbursement_id = ${id}`;
    console.log(query);
    sendQuery(query).then((resolve) => {
        query = `SELECT * FROM reimbursements WHERE reimbursement_id = ${id}`;
        sendQuery(query).then((resolve) => {
            response.json(resolve.rows);
        });
    }, (error) => {
        console.log('Update reimbursement err: ', error);
        response.sendStatus(404);
    });
});*/



export default reimbursementRouter; 