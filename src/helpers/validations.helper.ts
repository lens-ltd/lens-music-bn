import Joi from 'joi';
import { countries } from '../constants/data.constant';

export const validateEmail = (email: string) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  return schema.validate({ email });
};

export const validateCountry = (country: string) => {
  const countryExists = countries.find((c) => c.code === country.toUpperCase());

  if (!countryExists) {
    return false
  }

  return true;
};
