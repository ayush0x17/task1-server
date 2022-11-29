import prisma from "../db/prismaConnect"


export const createTxn = async (amount: number, transactionId: string, type: "CREDIT" | "DEBIT", fromAccount: string, toAccount: string | null) => {
    return await prisma.transaction.create({
        data: {
            amount,
            transactionId,
            fromAccount,
            type,
            toAccount
        }
    })
}

export const getAccountTxns = async (accountNumber: string) => {
    return await prisma.transaction.findMany({
        where: {
            fromAccount: accountNumber
        },
        orderBy: {
            createdAt: 'desc'
        }
    })
};