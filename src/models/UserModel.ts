import { Schema, model, Types } from "mongoose";
import { hashPass, compareHash } from "../utils/hashingHandle";
import jwt from "jsonwebtoken";

export interface IUser {
  _id: Types.ObjectId;
  username: string;
  password: string;
  role: "user" | "admin";
  passQuestion: string;
  passAnswer: string;
  createAccessToken: () => string;
  createRefreshToken: () => string;
  createRecoveryToken: () => string;
  comparePassword: (password: string) => boolean;
  compareRecoveryAnswer: (question: string, answer: string) => boolean;
}

const UserSchema = new Schema<IUser>({
  username: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    // required:true,
  },
  passQuestion: {
    type: String,
    required: true,
  },
  passAnswer: {
    type: String,
    required: true,
  },
});

UserSchema.pre("save", async function () {
  this.password = await hashPass(this.password);
});

UserSchema.methods.createAccessToken = function (): string {
  return jwt.sign(
    {
      userid: this.__id,
      username: this.username,
      password: this.password,
      role: this.role,
    },
    process.env.ACCESS_JWT_SECRET as string,
    { expiresIn: process.env.ACCESS_TOKEN_LIFETIME as string, issuer: "speko_server" }
  );
};

UserSchema.methods.createRefreshToken = function (): string {
  return jwt.sign(
    { username: this.username },
    process.env.REFRESH_JWT_SECRET as string,
    { expiresIn: process.env.REFRESH_TOKEN_LIFETIME as string }
  );
};
UserSchema.methods.comparePassword = async function (password: string) {
  console.log(password);
  const isMatch = await compareHash(password, this.password);
  console.log(isMatch);
  return isMatch;
};
UserSchema.methods.compareRecoveryAnswer = function (
  question: string,
  answer: string
): boolean {
  if (question !== this.passQuestion && answer !== this.passAnswer) {
    return false;
  }
  return true;
};
UserSchema.methods.createRecoveryToken = function (): string {
  return jwt.sign(
    {
      userid: this._id,
      username: this.username,
      question: this.passQuestion,
      answer: this.passAnswer,
    },
    process.env.RECOVERY_JWT_SECRET as string,
    { expiresIn: process.env.RECOVERY_TOKEN_LIFETIME as string, issuer: "speko_server" }
  );
};
const User = model<IUser>("User", UserSchema);

export default User;
