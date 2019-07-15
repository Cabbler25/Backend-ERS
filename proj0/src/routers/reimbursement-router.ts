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

    let err: string = 'Reimbursement not found';
    try {
        const rmbmnt: Reimbursement = new Reimbursement(request.body[0]);
        if (!rmbmnt) throw err;

        const patchedRmbmnt: Reimbursement = await reimbursementService.updateReimbursement(rmbmnt);
        patchedRmbmnt ? response.status(201).json(patchedRmbmnt) : response.sendStatus(404);
    } catch (err) {
        response.sendStatus(400);
    }
});

// Submit reimbursement
reimbursementRouter.post('', async (request: Request, response: Response) => {
    console.log('\nReimbursement Router: Handling reimbursement submit...');
    if (!hasPermission(request, response, roles.ALL)) return;

    let err: string = 'Reimbursement not valid';
    try {
        const rmbmnt: Reimbursement = new Reimbursement(request.body[0]);
        if (!rmbmnt) throw err;

        const completedRmbmnt: Reimbursement = await reimbursementService.submitReimbursement(rmbmnt, request.cookies.user.id);
        completedRmbmnt ? response.status(200).json(completedRmbmnt) : response.sendStatus(400);
    } catch (err) {
        response.sendStatus(400);
    }
});

export default reimbursementRouter; 