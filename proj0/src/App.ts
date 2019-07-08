import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRouter from './routers/user-router';
import loginRouter from './routers/login-router';
import reimbursementRouter from './routers/reimbursement-router';

const app = express();
const port = 3333;
app.use(bodyParser.json);


app.listen(port, () => {
    console.log(`App started on port ${port}`);
});