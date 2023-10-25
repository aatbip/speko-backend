import  express  from "express";
import {addNewUser,getUser,recoverAccount,resetPassword,signOut} from "../controllers/userController"
import { checkIfTokenExpired, sessionVerification } from "../middleware/sessionVerification";
const router=express.Router()

router.post('/register',addNewUser);
router.post('/login',getUser)
router.get('/logout',signOut)
router.post('/questionCheck',recoverAccount)
router.post('/resetpassword',resetPassword)
router.get('/verifysession',sessionVerification,checkIfTokenExpired)

export default router