import jwt from "jsonwebtoken";
import {
  IRecoveryPayload,
  IJwtPayload,
} from "../interfaces/authCredentials.interface";

export const verifyRecoveryToken = (token: string): IRecoveryPayload | any => {
  try {
    const payload = jwt.verify(
      token,
      process.env.RECOVERY_JWT_SECRET as string
    );
    return { payload };
  } catch (error: any) {
    return { expired: error.message, error };
  }
};

export const verifyJWT = async (token: string): Promise<IJwtPayload | any> => {
  try {
    const payload = jwt.verify(token, process.env.ACCESS_JWT_SECRET as string);
    return { payload };
  } catch (error: any) {
    return { expired: error.message, error };
  }
};

export const verifyRefreshJWT = async (
  token: string
): Promise<IJwtPayload | any> => {
  try {
    const payload = jwt.verify(token, process.env.REFRESH_JWT_SECRET as string);
    return { payload };
  } catch (error: any) {
    return { expired: error.message, error };
  }
};
