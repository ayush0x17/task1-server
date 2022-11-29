import { NextFunction, Request, Response } from "express";
import { throwError } from "../helpers/ErrorHandler.helper";
import { asyncWrap } from "../middlewares/async.middleware";
import { TransferInput } from "../schemas/transaction.schema";
import { getAccountAmount, getAccountInfo, updateAmount } from "../services/account.service";
import { createTxn, getAccountTxns } from "../services/transaction.service";

export const getAccountInfoController = asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user
    try {
        const accInfo = await getAccountInfo(user.id)
        if (!accInfo) return throwError(404, "account does not exist")
        res.status(200).json({ ...accInfo, amount: accInfo.amount.toFixed(2) });
    } catch (error: any) {
        console.error(error);
        throwError(400, error);
    }
});

export const getAllTxnsController = asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    const user: any = req.user
    try {
        const accInfo = await getAccountInfo(user.id)
        if (!accInfo) return throwError(404, "user does not exist")
        const txns = await getAccountTxns(accInfo.accountNumber)
        res.status(200).json(txns);
    } catch (error: any) {
        console.error(error);
        throwError(400, error);
    }
});

export const postTransferAmountController = asyncWrap(async (req: Request<{}, {}, TransferInput>, res: Response, next: NextFunction) => {
    const user: any = req.user
    const { amount, toAccount } = req.body
    try {
        const accInfo = await getAccountInfo(user.id)
        if (!accInfo) return throwError(404, "user does not exist")
        const res1 = await txnx(accInfo.accountNumber, amount, toAccount, "DEBIT")
        const res2 = await txnx(toAccount, amount, accInfo.accountNumber, "CREDIT")
        res.status(200).json({ res1, res2 });
    } catch (error: any) {
        console.error(error);
        throwError(400, error);
    }
});

const txnx = async (accountNumber: string, amount: number, toAccount: string | null, type: "DEBIT" | "CREDIT") => {
    try {
        const account = await getAccountAmount(accountNumber);
        if (!account) return throwError(404, "Account not found")
        let newAmount = 0;
        if (type === "DEBIT") {
            newAmount = account.amount - amount;
        } else {
            newAmount = account.amount + amount;
        }
        const transactionId = Date.now().toString();
        const transaction = await createTxn(amount, transactionId, type, accountNumber, toAccount)
        if (!transaction) return throwError(404, "Transaction failed")
        await updateAmount(newAmount, accountNumber)
        return { sucsess: true }
    } catch (error: any) {
        throwError(400, error)
        return { sucsess: false }

    }

}