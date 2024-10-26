import * as Joi from 'joi';

export default () => ({
  APP: {
    PORT: parseInt(process.env.PORT, 10) || 3000,
    HOST: process.env.HOST,
  },
  DB: {
    HOST: process.env.DB_HOST,
    PORT: parseInt(process.env.DB_PORT, 10),
    NAME: process.env.DB_NAME,
    USER: process.env.DB_USER,
    PASSWORD: process.env.DB_PASSWORD,
  },
  REDIS: {
    HOST: process.env.REDIS_HOST,
    PORT: parseInt(process.env.REDIS_PORT, 10),
    PASSWORD: process.env.REDIS_PASSWORD,
  },
});

export const ENV_VALIDATION_SCHEMA = Joi.object({
  APP_PORT: Joi.number().default(3000),
  APP_HOST: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_NAME: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().required(),
  REDIS_PASSWORD: Joi.string().required(),
});
