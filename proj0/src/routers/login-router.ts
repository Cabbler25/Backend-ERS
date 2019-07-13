import express, { Request, Response } from 'express';
import * as loginService from '../services/login-service';
import User from '../models/User';
import Role from '../models/Role';

// 5 minute timoeout
const timeout: number = 1000 * 60 * 5;
const loginRouter = express.Router();   

loginRouter.post('', async (request: Request, response: Response) => {
    console.log('\nLogin Router: Handling user sign in...');
    let username = request.body[0].username;
    let password = request.body[0].password;

    const user: User = await loginService.logIn([username, password]);
    if (user && user.id) {
        const role: Role = await loginService.getRole(user.id);
        response.cookie('user', {id: user.id}, { maxAge: timeout, httpOnly: true });
        response.cookie('permissions', {id: role.id, role: role.role}, { maxAge: timeout, httpOnly: true });
        response.status(200).json(user); 
    } else {
        response.status(400).json('Invalid Credentials');
    }
});

export default loginRouter;
 