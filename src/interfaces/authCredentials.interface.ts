import { Request } from "express";
import {Types} from 'mongoose';

export interface IUserCredentials{
    id:Types.ObjectId,
    username:string,
    password:string,
    role:string,
    accessToken:string
    refreshToken:string
}


export interface IRecoveryPayload{
    userid:string,
    username:string,
    question:string,
    answer:string
}

export interface IJwtPayload{
    userid:string,
    username:string,
    password:string,
    role:string,
    iat:number,
    exp:number,
    issuer:string
}
export interface IGetAuthorizationHeaderRequest extends Request{
    user:IJwtPayload
}
