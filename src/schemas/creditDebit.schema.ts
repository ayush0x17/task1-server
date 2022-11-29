import { TypeOf, z } from "zod";

export const creditSchema = z.object({
    body: z.object({
        amount: z.number({
            required_error: "Amount is required"
        }).nonnegative(),
        accountNumber: z.string({
            required_error: "Email is Required"
        }),
    })
})


export type CreditInput = TypeOf<typeof creditSchema>['body']
