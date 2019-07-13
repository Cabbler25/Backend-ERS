import * as reimbursementService from "../services/reimbursement-service";
import express, { Request, Response } from 'express';
import Reimbursement from "../models/Reimbursement";
import { hasPermission } from '../util/utils';
import { roles } from '../models/Role';

const reimbursementRouter = express.Router();

// Gets reimbursement by user ID
reimbursementRouter.get('/author/userId/:userId', async (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling get reimbursement by user...');
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
    console.log('\nReimbursement Router: Handling get reimbursement by status...');
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
    console.log('\nReimbursement Router: Handling reimbursement patch...');
    if (!hasPermission(request, response, roles.FINANCE_MANAGER)) return;

    try {
        const rmbmnt: Reimbursement = new Reimbursement(request.body[0]);
        if (!rmbmnt) throw 'Reimbursement not valid';

        const patchedRmbmnt: Reimbursement = await reimbursementService.updateReimbursement(rmbmnt);
        patchedRmbmnt.id ? response.status(201).json(patchedRmbmnt) : response.sendStatus(400);
    } catch (e) {
        response.sendStatus(400);
    }
});

// Submit reimbursement
reimbursementRouter.post('', async (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling reimbursement submit...');
    if (!hasPermission(request, response, roles.ALL)) return;

    try {
        const rmbmnt: Reimbursement = new Reimbursement(request.body[0]);
        if (!rmbmnt) throw 'Reimbursement not valid';
        
        const completedRmbmnt: Reimbursement = await reimbursementService.submitReimbursement(rmbmnt, request.cookies.user.id);
        completedRmbmnt.id ? response.status(200).json(completedRmbmnt) : response.sendStatus(400);
    } catch (e) {
        response.sendStatus(400);
    }
});

export default reimbursementRouter; 