import { Schema, model, Types } from "mongoose";

export interface IRefreshToken {
  _id: Types.ObjectId;
  refreshToken: string;
}

const refreshTokenSchema = new Schema<IRefreshToken>({
  refreshToken: {
    type: String,
    required: true,
    default: "",
  },
});

const RefreshTokenModel = model<IRefreshToken>("RefreshToken", refreshTokenSchema);

export { RefreshTokenModel };
