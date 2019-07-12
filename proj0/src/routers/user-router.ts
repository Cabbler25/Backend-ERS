import * as userService from '../services/user-service';
import express, { Request, Response } from 'express';
import User from '../models/User';
import { hasPermission } from '../util/utils';
import { roles } from '../models/Role';

const userRouter = express.Router();

// Gets all users
userRouter.get('', async (request: Request, response: Response) => {
    console.log('\nUser Router: Handling get all users');

    if (!hasPermission(request, response, roles.FINANCE_MANAGER)) return;

    const users: User[] = await userService.getAllUsers();
    if (users && users.length > 0) {
        response.status(200).json(users);
    } else {
        response.sendStatus(404); 
    }
});
 
// Gets specific user by ID
userRouter.get('/:id', async (request: Request, response: Response) => {
    console.log('\nUser Router: Handling get user by ID');
    const id = parseInt(request.params.id);

    if (!hasPermission(request, response, roles.FINANCE_MANAGER, id)) return;

    const user: User = await userService.getUserById(id);
    if (user.id) {
        response.status(200).json(user);
    } else {
        response.sendStatus(404);
    }
});

// Update user
userRouter.patch('', async (request: Request, response: Response) => {
    console.log('\nUser Router: Handling user patch');

    if (!hasPermission(request, response, roles.ADMIN)) return;

    try {
        const user: User = new User(request.body[0]);
        if (!user) throw 'User not found';

        const patchedUser: User = await userService.updateUser(user);
        if (patchedUser.id) {
            response.status(200).json(patchedUser);
        } else {
            response.sendStatus(404);

        }
    } catch(e) {
        response.sendStatus(404);
    }
});

export default userRouter;