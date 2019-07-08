import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRouter from './routers/user-router';
import loginRouter from './routers/user-router';
import reimbursementRouter from './routers/user-router';

const app = express();
const port = 3333;
app.use(bodyParser.json);


app.listen(3000, () => {
    console.log(`App started on port ${port}`);
});