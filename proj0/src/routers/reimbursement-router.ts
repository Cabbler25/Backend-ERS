import express, { Request, Response } from 'express';
import Role from '../models/Role';
import User from '../models/User';
import Reimbursement from '../models/Reimbursement'
import * as reimbursementService from '../services/reimbursement-service';

const reimbursementRouter = express.Router();

reimbursementRouter.get('/status/:statusId', (request: Request, response: Response) => {
    console.log('Reimbursement Router: Handling get reimbursement by status ID');

    const id = parseInt(request.params.statusId);
    const reimbursement: Reimbursement = reimbursementService.getReimbursementByStatusId(id);

    if (reimbursement) {
        response.json(reimbursement);
    } else {
        response.sendStatus(404);
    }
});

reimbursementRouter.get('/author/userId/:userId', (request: Request, response: Response) => {
    console.log('Reimbursement Router: Handling get reimbursement by user ID');

    const id = parseInt(request.params.userId);
    const reimbursement: Reimbursement = reimbursementService.getReimbursementByUserId(id);

    if (reimbursement) {
        response.json(reimbursement);
    } else {
        response.sendStatus(404);
    }
});

reimbursementRouter.post('', (request: Request, response: Response) => {
    console.log('Reimbursement Router: Handling reimbursement submit');

    const reimbursement: Reimbursement = reimbursementService.submitReimbursement();

    if (reimbursement) {
        response.status(201).json(reimbursement);
    } else {
        response.sendStatus(404);
    }
});

reimbursementRouter.patch('', (request: Request, response: Response) => {
    console.log('Reimbursement Router: Handling reimbursement update');

    let body = request.body[0];
    const reimbursement: Reimbursement = reimbursementService.updateReimbursement(body);

    if (reimbursement) {
        response.status(201).json(reimbursement);
    } else {
        response.sendStatus(404);
    }
});



export default reimbursementRouter; 