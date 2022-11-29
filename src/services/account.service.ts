import prisma from "../db/prismaConnect"

export const createAccount = async ({ email, amount }: { email: string, amount: number }, accountNumber: string, userId: string) => {
    try {
        return await prisma.account.create({
            data: {
                email,
                amount,
                accountNumber,
                userId
            }
        })
    } catch (error) {
        return false
    }
}

export const totalAmount = async () => {
    return await prisma.account.aggregate({
        _sum: {
            amount: true
        }
    })
}

export const getAccountAmount = async (accountNumber: string) => {
    return await prisma.account.findUnique({
        where: {
            accountNumber
        },
        select: {
            amount: true
        }
    })
}

export const updateAmount = async (amount: number, accountNumber: string) => {
    return await prisma.account.update({
        data: {
            amount
        },
        where: {
            accountNumber
        }
    })
}

export const getAccountInfo = async (userId: string) => {
    return await prisma.account.findUnique({
        where: {
            userId
        },
        select: {
            accountNumber: true,
            amount: true
        }
    })
}

