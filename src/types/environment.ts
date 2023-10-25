export{}

declare global {
    namespace NodeJS {
      interface ProcessEnv {
        PORT: Number;
        NODE_ENV: "development" | "production";
        MONGO_URL: string;
        ACCESS_JWT_SECRET: string;
        REFRESH_JWT_SECRET:string;
        RECOVERY_JWT_SECRET:string;
        ACCESS_TOKEN_LIFETIME: number | string;
        REFRESH_TOKEN_LIFETIME: number | string;
        RECOVERY_TOKEN_LIFETIME:number|string;
      }
    }
  }
  