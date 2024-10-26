import * as Joi from 'joi';

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

export const ENV_VALIDATION_SCHEMA = Joi.object({
  APP: Joi.object({
    PORT: Joi.number().default(3000),
  }),
  DB: Joi.object({
    HOST: Joi.string().required(),
    PORT: Joi.number().required(),
    NAME: Joi.string().required(),
    USER: Joi.string().required(),
    PASSWORD: Joi.string().required(),
  }),
});
