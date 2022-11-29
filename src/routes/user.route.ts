import express from "express"
import { getAccountInfoController, getAllTxnsController, postTransferAmountController } from "../controllers/user.controller"
import validateAsset from "../middlewares/validateAsset.middleware"
import { transferSchema } from "../schemas/transaction.schema"

const router = express.Router()

router.get('/', (req, res) => {
    res.status(200).send("This is user route")
})


router.get('/account-info', getAccountInfoController)

router.get('/get-all-txns', getAllTxnsController)

router.post('/transfer', validateAsset(transferSchema), postTransferAmountController)


export default router