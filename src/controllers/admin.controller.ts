import { NextFunction, Request, Response } from "express";
import { throwError } from "../helpers/ErrorHandler.helper";
import { asyncWrap } from "../middlewares/async.middleware";
import { CreateAccountInput } from "../schemas/account.schema";
import { CreditInput } from "../schemas/creditDebit.schema";
import { CreateUserInput } from "../schemas/user.schema";
import { createAccount, getAccountAmount, totalAmount, updateAmount } from "../services/account.service";
import { createUser, findUserByUsername, getUsers, totalUser } from "../services/user.service";
import chance from "../utils/chance";
import { hashPassword } from "../utils/password";
import { createTxn } from '../services/transaction.service'


export const createUserController = asyncWrap(async (req: Request<{}, {}, CreateUserInput>, res: Response, next: NextFunction) => {
    const { passwordConfirmation, ...data } = req.body
    try {
        const hashedPassword = await hashPassword(passwordConfirmation);
        data.password = hashedPassword;
        const { password, ...user } = await createUser(data)
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        throwError(400, 'Error occured create user controller');
    }
});

export const createAccountController = asyncWrap(async (req: Request<{}, {}, CreateAccountInput>, res: Response, next: NextFunction) => {
    const { username, ...data } = req.body
    try {
        const user = await findUserByUsername(username)
        if (!user) throw "user not found"
        let accountNumber = chance.integer({ min: 1000000000000000, max: 9999999999999999 }).toString();
        let account = await createAccount(data, accountNumber, user.id)
        while (!account) {
            accountNumber = chance.integer({ min: 1000000000000000, max: 999999999999999 }).toString();
            account = await createAccount(data, accountNumber, user.id)
        }
        res.status(200).json(account);
    } catch (error: any) {
        console.error(error);
        throwError(400, error);
    }
});

export const getTotalAmountController = asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const amount = await totalAmount();
        res.status(200).json({ amount: amount._sum.amount?.toFixed(2) });
    } catch (error: any) {
        console.error(error);
        throwError(400, error);
    }
});

export const getTotalUsersController = asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const totalCount = await totalUser();
        res.status(200).json({ totalUsers: totalCount });
    } catch (error: any) {
        console.error(error);
        throwError(400, error);
    }
});

export const getUsersController = asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await getUsers();
        res.status(200).json(users);
    } catch (error: any) {
        console.error(error);
        throwError(400, error);
    }
});

export const postCreditController = asyncWrap(async (req: Request<{}, {}, CreditInput>, res: Response, next: NextFunction) => {
    const { amount, accountNumber } = req.body
    try {
        const account = await getAccountAmount(accountNumber);
        if (!account) return throwError(404, "Account not found")
        const newAmount = account.amount + amount;
        const transactionId = Date.now().toString();
        const transaction = await createTxn(amount, transactionId, "CREDIT", accountNumber, null)
        if (!transaction) return throwError(404, "Transaction failed")
        const result = await updateAmount(newAmount, accountNumber)
        res.status(200).json({ updatedAmount: result.amount.toFixed(2) });
    } catch (error: any) {
        console.error(error);
        throwError(400, error);
    }
});

export const postDebitController = asyncWrap(async (req: Request<{}, {}, CreditInput>, res: Response, next: NextFunction) => {
    const { amount, accountNumber } = req.body
    try {
        const account = await getAccountAmount(accountNumber);
        if (!account) return throwError(404, "Account not found")
        const newAmount = account.amount - amount;
        const transactionId = Date.now().toString();
        const transaction = await createTxn(amount, transactionId, "DEBIT", accountNumber, null)
        if (!transaction) return throwError(404, "Transaction failed")
        const result = await updateAmount(newAmount, accountNumber)
        res.status(200).json({ updatedAmount: result.amount.toFixed(2) });
    } catch (error: any) {
        console.error(error);
        throwError(400, error);
    }
});