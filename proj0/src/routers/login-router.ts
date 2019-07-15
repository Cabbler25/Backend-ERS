import express, { Request, Response } from 'express';
import * as loginService from '../services/login-service';
import User from '../models/User';
import Role from '../models/Role';
import db from 'util/pg-connection';

// 5 minute timeout
const timeout: number = 1000 * 60 * 5;
const loginRouter = express.Router();
const bcrypt = require('bcrypt');

loginRouter.post('', async (request: Request, response: Response) => {
    console.log('\nLogin Router: Handling user sign in...');
    let username = request.body[0].username;
    let plainTxtPass = request.body[0].password;

    const user: User = await loginService.logIn(username);
    const matches: boolean = await bcrypt.compare(plainTxtPass, user.password);
    if (user && user.id && matches) {
        const role: Role = await loginService.getRole(user.id);
        response.cookie('user', { id: user.id }, { maxAge: timeout });
        response.cookie('permissions', { id: role.id, role: role.role }, { maxAge: timeout });
        response.status(200).json(user);
    } else {
        response.status(400).json('Invalid Credentials');
    }
});

export default loginRouter;
