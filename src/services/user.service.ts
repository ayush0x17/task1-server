import prisma from "../db/prismaConnect"

export const findUserByUsername = async (username: string) => {
    return await prisma.user.findUnique({
        where: {
            username
        }
    })
}

export const findUserById = async (id: string) => {
    return await prisma.user.findUnique({
        where: {
            id
        }
    })
}

export const createUser = async (data: { firstName: string, lastName: string, username: string, password: string, role?: 'USER' | 'ADMIN' }) => {
    return await prisma.user.create({
        data
    })
}

export const totalUser = async () => {
    return await prisma.user.count()
}

export const getUsers = async () => {
    return await prisma.user.findMany({
        select: {
            firstName: true,
            lastName: true,
            account: {
                select: {
                    amount: true,
                    accountNumber: true
                }
            }
        }
    })
}