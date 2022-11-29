import { NextFunction, Request, Response } from "express";
import { throwError } from "../helpers/ErrorHandler.helper";
import { findUserByUsername } from "../services/user.service";
import { asyncWrap } from "./async.middleware";


export const isAdmin = asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { user }: any = req;
        if (!user) throwError(401, "Not logged In");
        const userInfo = await findUserByUsername(user.username)
        if (user.role === 'ADMIN' && user.role === userInfo?.role) next();
        else res.status(401).json("No admin permission");
    } catch (error) {
        console.error(error);
        throwError(401, "Please Log In");
    }
});

export const isAuthenticated = asyncWrap(async (req: Request, _res, next: NextFunction) => {
    try {
        if (!req.isAuthenticated()) throwError(401, "Please Log In");
        next();
    } catch (error) {
        throwError(401, "Unauthorised User")
    }
})