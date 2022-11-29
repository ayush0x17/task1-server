import { TypeOf, z } from "zod";


export const createAccountSchema = z.object({
    body: z.object({
        email: z.string({
            required_error: "Email is Required"
        }).email("not a valid email"),
        amount: z.number({
            required_error: "Amount is required"
        }).nonnegative(),
        username: z.string({
            required_error: "Email is Required"
        }),
    })
})

export const temp = z.object({
    body: z.object({
        username: z.string({
            required_error: "Email is Required"
        }),
        password: z.string({
            required_error: "Password is Required"
        }).min(8, "Invalid email or Password")
    })
})


export type CreateAccountInput = TypeOf<typeof createAccountSchema>['body']

export type LoginUserInput = TypeOf<typeof temp>['body']

