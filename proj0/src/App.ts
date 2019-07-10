import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import userRouter from './routers/user-router';
import loginRouter from './routers/login-router';
import reimbursementRouter from './routers/reimbursement-router';
import { initializeUsers } from './services/user-service';
// import { initializeReimbursements } from './services/reimbursement-service';


const app = express();
const port = 3333;
app.use(bodyParser.json());

app.use('/users', userRouter);
app.use('/login', loginRouter);
app.use('/reimbursements', reimbursementRouter);

app.listen(port, () => {
  console.log(`App started on port ${port}`);
});

// initializeUsers();
// initializeReimbursements();