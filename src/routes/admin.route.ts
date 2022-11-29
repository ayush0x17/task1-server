import express from "express"
import { createAccountController, createUserController, getTotalAmountController, getTotalUsersController, getUsersController, postCreditController, postDebitController } from "../controllers/admin.controller"
import validateAsset from "../middlewares/validateAsset.middleware"
import { createAccountSchema } from "../schemas/account.schema"
import { creditSchema } from "../schemas/creditDebit.schema"
import { createUserSchema } from "../schemas/user.schema"

const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).send(req.user)
})

router.post('/add-user', validateAsset(createUserSchema), createUserController)

router.post('/create-account', validateAsset(createAccountSchema), createAccountController)

router.get('/total-amount', getTotalAmountController)

router.get('/total-users', getTotalUsersController)

router.get('/users', getUsersController)

router.post('/credit', validateAsset(creditSchema), postCreditController)

router.post('/debit', validateAsset(creditSchema), postDebitController)


export default router