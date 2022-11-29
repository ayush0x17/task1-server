import { TypeOf, z } from "zod";

export const transferSchema = z.object({
    body: z.object({
        amount: z.number({
            required_error: "Amount is required"
        }).nonnegative(),
        toAccount: z.string({
            required_error: "Email is Required"
        }),
    })
})


export type TransferInput = TypeOf<typeof transferSchema>['body']