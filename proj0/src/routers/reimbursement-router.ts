import express, { Request, Response } from 'express';
import { isLoggedIn, hasPermission, sendQuery } from '../services/Services';
import { permissions } from '../models/Role';

const reimbursementRouter = express.Router();

// Get reimbursement by status ID
reimbursementRouter.get('/status/:statusId', (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling get reimbursement by status ID');
    const id = parseInt(request.params.statusId);

    if (!isLoggedIn(response)) return;
    if (!hasPermission(request, response, permissions.FINANCE_MANAGER)) return;
    
    let query = `SELECT * FROM reimbursements WHERE status = ${id}`;
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

    if (!isLoggedIn(response)) return;
    if (!hasPermission(request, response, permissions.FINANCE_MANAGER, id)) return;

    let query = `SELECT * FROM reimbursements WHERE author = ${id}`;
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

    if (!isLoggedIn(response)) return;

    let userId = request.cookies.permissions.userId;
    let query = `INSERT INTO reimbursements (reimbursement_id, author, amount, date_submitted, date_resolved, description, resolver, status, type) VALUES (0, ${userId}, 500, ${Date.now()}, null, 'Test reimbursement', 2, 0, 3)`;
    console.log(query);
    sendQuery(query).then((resolve) => {
        query = `SELECT * FROM reimbursements WHERE reimbursement_id = 0`;
        sendQuery(query).then((resolve) => {
            response.json(resolve.rows);
        });
    }, (error) => {
        console.log('Update reimbursement err: ', error);
        response.sendStatus(404);
    });    
});

// Update reimbursement
reimbursementRouter.patch('', (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling reimbursement update');

    if (!isLoggedIn(response)) return;
    if (!hasPermission(request, response, permissions.FINANCE_MANAGER)) return;

    let body = request.body[0];
    let id = body.reimbursement_id;
    delete body.reimbursement_id;

    // Format body
    let properties: string = '';
    for (let a in body) {
        if (!body[a]) continue;
        properties += `${a} = '${body[a]}', `;
    }
    if (properties.length > 0) {
        properties = properties.substr(0, properties.length - 2);
    }

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
});



export default reimbursementRouter; 