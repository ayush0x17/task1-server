import { NextFunction, Request, Response } from "express";
import { throwError } from "../helpers/ErrorHandler.helper";
import { asyncWrap } from "../middlewares/async.middleware";

export const postLogIn = asyncWrap(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { password, ...data }: any = req.user;
        res.status(200).json(data);
    } catch (error) {
        console.error(error);
        throwError(400, 'Error occured in post Login');
    }
});

export const postLogOut = asyncWrap(async (req: Request, res: Response) => {
    try {
        req.logOut((err) => {
            if (err) return throwError(400, "error log out")
            res.status(201).json({ message: "Logged Out Sucessfully." });
        });
    } catch (error) {
        throwError(400, "Error occurd during logout")
    }
})

