import { Request, Response,NextFunction } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { success, failure } from "../utils/responseMessage";
import { IUserCredentials } from "../interfaces/authCredentials.interface";
import { verifyRecoveryToken } from "../utils/jwtHandler";
import { hashPass } from "../utils/hashingHandle";
import User from "../models/UserModel";
import {RefreshTokenModel} from "../models/RefreshToken"



export const addNewUser = asyncWrapper(async (req: Request, res: Response) => {
  const { username, password, role, passQuestion, passAnswer } = req.body;
  const newUser = await User.create({
    username: username,
    password: password,
    role: role,
    passQuestion: passQuestion,
    passAnswer: passAnswer,
  });
  res.status(200).json(newUser);
});

export const getUser = asyncWrapper(async (req: Request, res: Response) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json(failure("Enter all credentials."));
  }
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).json(failure("User does not exists"));
  }
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return res.status(400).json(failure("Incorrect Password"));
  }
  const accessToken = user.createAccessToken();
  const refreshToken = user.createRefreshToken();
  //refresh token db created here.
  await RefreshTokenModel.create({
    refreshToken: refreshToken,
  });

  const userCredentails: IUserCredentials = {
    id: user._id,
    username: user.username,
    password: user.password,
    role: user.role,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };

  res.cookie("userCredentials", JSON.stringify(userCredentails));

  res.status(200).json(success(userCredentails));
});

export const recoverAccount = asyncWrapper(
  async (req: Request, res: Response) => {
    const { username, passQuestion, passAnswer } = req.body;
    if (!username || !passQuestion || !passAnswer) {
      return res.status(400).json(failure("Enter all the credentials"));
    }
    const user = await User.findOne({ username: username });
    if (!user) {
      return res.status(404).json(failure("User doesnot exists."));
    }
    const isMatch = user.compareRecoveryAnswer(passQuestion, passAnswer);
    if (!isMatch) {
      return res.status(400).json(failure("Question Recovery failed"));
    }
    const recoveryToken = user.createRecoveryToken();
    res.status(200).json(success({ recoveryToken: recoveryToken }));
  }
);

export const resetPassword = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;
    const authHeader = req.headers.authorization;
    if (!username || !password) {
      return res.status(400).json(failure("Enter credentials."));
    }
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res.status(400).json(failure("Invalid authentication Header"));
    }
    const recoveryToken = authHeader.split(" ")[1];

    const { payload, expired, error } = verifyRecoveryToken(recoveryToken);
    if (expired === "jwt expired") {
      return next(error);
    }
    const hashedPassword: string = await hashPass(password);
    await User.updateOne({ username: username }, { password: hashedPassword });
    return res.status(200).json(success("Updated passsword."));
  }
);

export const signOut = asyncWrapper(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refreshToken } = JSON.parse(req.cookies.userCredentials);
    if(!refreshToken){return res.status(400).json(failure('no token in cookie'))}
    try {
      await RefreshTokenModel.deleteOne({ refreshToken: refreshToken });
      res.clearCookie("userCredentials");
    } catch (error) {
      return next(error);
    }

    res.status(200).json(success("You are Signed Out!"));
  }
);
