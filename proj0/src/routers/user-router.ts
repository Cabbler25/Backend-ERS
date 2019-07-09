import express, { Request, Response } from 'express';
import * as userService from '../services/user-service';
import User from 'models/User';


const userRouter = express.Router();

// Returns all users
userRouter.get('', (request: Request, response: Response) => {
    console.log('Handling get all users');
    const user: Map<Number, User> = userService.getAllUsers();
    if (user) {
        console.log(user);
        response.json(JSON.stringify([...user]));
    } else {
        response.sendStatus(404);
    }
});


// Gets specific user by ID
userRouter.get('/:id', (request: Request, response: Response) => {
    console.log('Handling get user by ID');
    const id = parseInt(request.params.id);
    const user: User = userService.getUserById(id);
    if (user) {
        console.log(user);
        response.json(user);
    } else {
        response.sendStatus(404);
    }
});

/*function jsonToMap(jsonStr) {
    return new Map(JSON.parse(jsonStr));
}*/

export default userRouter;