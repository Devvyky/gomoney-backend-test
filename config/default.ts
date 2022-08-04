export interface Configuration {
  env: string;
  port: number;
  database: {
    url: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  baseUrl: string;
}

export const configuration = (): Configuration => ({
  env: process.env.NODE_ENV as string,
  port: parseInt(process.env.PORT as string, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL as string,
  },
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  },
  baseUrl: process.env.BASE_URL as string,
});
