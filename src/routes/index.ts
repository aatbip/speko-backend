import express from "express"

import userRoutes from "./user.route"
const router=express.Router()

router.use("/auth",userRoutes)


export default router

/* 
    /api/auth/register
    /api/auth/login
    /api/auth/questionCheck
    /api/auth/resetpassword
    /api/auth/verifysession
    
*/