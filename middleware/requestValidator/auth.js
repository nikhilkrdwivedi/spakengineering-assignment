import joi from 'joi';
import error from './error-response.js';

export const registerValidation = (req, res, next) => {
  const reqBodySchema = joi.object({
    name: joi.string().trim().required(),
    password: joi.string().min(8).required(),
    address: joi.string().allow('',null).optional(),
    gender: joi.string().valid('FEMALE', 'MALE', 'OTHER').optional(),
    contact: joi.object({
        phone: joi.string().trim().required(),
        countryCode: joi.string().trim().required()
    }).required()

  });

  const reqBodyValidation = reqBodySchema.validate(req.body);

  if (reqBodyValidation.error) {
    error(reqBodyValidation.error, res);
  } else {
    next();
  }
};

export default {
    registerValidation,
};
