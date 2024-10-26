export default () => ({
  APP: {
    PORT: parseInt(process.env.PORT, 10) || 3000,
  },
  DB: {
    HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
  },
});
