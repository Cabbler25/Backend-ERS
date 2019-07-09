import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRouter from './routers/user-router';
import loginRouter from './routers/login-router';
import reimbursementRouter from './routers/reimbursement-router';

const app = express();
const port = 3000;
app.use(bodyParser.json());

app.use((request: Request, response: Response, next) => {
    console.log('Request received for ' + request.url);
    next();
});

app.use((request: Request, response: Response, next) => {
    console.log('Request received for ' + request.url);
    next();
});

app.use('/users', userRouter); 
//app.use('/login', loginRouter);
//app.use('/reimbursements', reimbursementRouter);

app.listen(port, () => {
    console.log(`App started on port ${port}`);
});