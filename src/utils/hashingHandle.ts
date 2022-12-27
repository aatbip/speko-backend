import bcrypt from "bcryptjs";

export const hashPass = async (password:string):Promise<string>=> {
  const salt = await bcrypt.genSalt(13);
  const hashPassword:string=await bcrypt.hash(password,salt)
  return hashPassword;
};

export const compareHash = async (password:string,hashPass:string):Promise<boolean> => {
    const isMatch:boolean=await bcrypt.compare(password,hashPass)
    return isMatch
};
