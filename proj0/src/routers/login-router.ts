import express, { Request, Response } from 'express';
import * as userService from '../services/user-service';
import User from 'models/User';

const loginRouter = express.Router();

loginRouter.post('', (request: Request, response: Response) => {
    console.log('Login Router: Handling user sign in');
    const err = { message: "Invalid Credentials" };

    let body = request.body[0];
    const user: User = userService.loginUser(body);

    if (user) {
        response.json(user);
    } else {
        response.status(404).json(err);
    }
});

export default loginRouter;
