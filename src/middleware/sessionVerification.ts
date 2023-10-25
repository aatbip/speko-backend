import { Request, Response, NextFunction } from "express";
import {
  IGetAuthorizationHeaderRequest,
  IJwtPayload,
  IUserCredentials,
} from "../interfaces/authCredentials.interface";
import User from "../models/UserModel";
import { asyncWrapper } from "../utils/asyncWrapper";
import { failure, success } from "../utils/responseMessage";
import { verifyJWT, verifyRefreshJWT } from "../utils/jwtHandler";
import { RefreshTokenModel } from "../models/RefreshToken";

export const sessionVerification = asyncWrapper(
  async (
    req: IGetAuthorizationHeaderRequest,
    res: Response,
    next: NextFunction
  ) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(404).json(failure("Invalid authentication header."));
    }
    const accessToken = authHeader.split(" ")[1];
    setUser(accessToken, req, res, next);
  }
);

const setNewAccessTokenByVerifyingRefreshToken = asyncWrapper(
  async (
    req: IGetAuthorizationHeaderRequest,
    res: Response,
    next: NextFunction
  ) => {
    const { refreshToken } = JSON.parse(req.cookies.userCredentials);

    const isRefreshTokenExist = await RefreshTokenModel.findOne({
      refreshToken: refreshToken,
    });
    if (!isRefreshTokenExist) {
      return res
        .status(400)
        .json(failure("Authentication Error!! Toke does not exist or match"));
    }
    const { payload, expired, error } = await verifyRefreshJWT(refreshToken);

    if (expired === "jwt expired") {
      return next(error);
    }
    const user = await User.findOne({ username: payload.username });
    if (!user) {
      return res
        .status(400)
        .json(failure("Authentication Error!! Toke does not exist or match"));
    }
    let accessToken = user.createAccessToken();
    const userCredentials: IUserCredentials = {
      id: user._id,
      username: user.username,
      password: user.password,
      role: user.role,
      accessToken,
      refreshToken,
    };

    res.cookie("userCredentials", JSON.stringify(userCredentials));
    setUser(accessToken, req, res, next);
  }
);
const setUser = async (
  accessToken: string,
  req: IGetAuthorizationHeaderRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { payload, expired } = await verifyJWT(accessToken);
    if (expired === "jwt expired") {
      return await setNewAccessTokenByVerifyingRefreshToken(req, res, next);
    }
    req.user = payload as IJwtPayload;
    return next();
  } catch (error) {
    next(error);
  }
};
export const checkIfTokenExpired = asyncWrapper(
  (req: IGetAuthorizationHeaderRequest, res: Response, next: NextFunction) => {
    if (req.user) {
      return res.status(200).json(success("verified"));
    }
  }
);
