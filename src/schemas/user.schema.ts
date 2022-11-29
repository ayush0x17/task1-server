import { TypeOf, z } from "zod";


export const createUserSchema = z.object({
    body: z.object({
        firstName: z.string({
            required_error: "Name is Required"
        }),
        lastName: z.string({
            required_error: "Name is Required"
        }),
        username: z.string({
            required_error: "Email is Required"
        }),
        role: z.enum(['USER', 'ADMIN']).optional(),
        password: z.string({
            required_error: "Password is Required"
        }).min(8, "Password is too short, min 8 charachters required"),
        passwordConfirmation: z.string({
            required_error: "Password is Required"
        })
    }).refine(data => data.password === data.passwordConfirmation, {
        message: "Passwords does not match",
        path: ['passwordConfirmation']
    })
})

export const loginUserSchema = z.object({
    body: z.object({
        username: z.string({
            required_error: "Email is Required"
        }),
        password: z.string({
            required_error: "Password is Required"
        }).min(8, "Invalid email or Password")
    })
})

export const deserializeUserSchema = z.object({
    id: z.string({ required_error: "id is required" }),
    firstName: z.string({
        required_error: "Name is Required"
    }),
    lastName: z.string({
        required_error: "Name is Required"
    }),
    username: z.string({
        required_error: "Email is Required"
    }),
    role: z.enum(['USER', 'ADMIN'])
})

export type CreateUserInput = TypeOf<typeof createUserSchema>['body']

export type LoginUserInput = TypeOf<typeof loginUserSchema>['body']

export type DeserializeUser = TypeOf<typeof deserializeUserSchema>
