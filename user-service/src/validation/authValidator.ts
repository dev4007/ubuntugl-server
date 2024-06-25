import Joi, { Schema, ValidationError } from 'joi';
import { Request, Response, NextFunction } from 'express';

interface RegisterBody {
  sponsorById?: string;
  referralCode?: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: string;
  address: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  website?: string;
  mobile: string;
  email: string;
  password: string;
  confirmPassword: string;
  wallet: string;
}

interface LoginBody {
  email: string;
  password: string;
}

const registerSchema: Schema = Joi.object({
  sponsorById: Joi.string().optional(),
  referralCode: Joi.string().optional(),
  firstName: Joi.string().required().messages({
    'string.empty': 'First name is required'
  }),
  lastName: Joi.string().required().messages({
    'string.empty': 'Last name is required'
  }),
  dateOfBirth: Joi.date().required().messages({
    'any.required': 'Date of birth is required'
  }),
  gender: Joi.string().required().messages({
    'string.empty': 'Gender is required'
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Address is required'
  }),
  address2: Joi.string().optional(),
  city: Joi.string().required().messages({
    'string.empty': 'City is required'
  }),
  state: Joi.string().required().messages({
    'string.empty': 'State is required'
  }),
  zipCode: Joi.string().required().messages({
    'string.empty': 'Zip code is required'
  }),
  country: Joi.string().required().messages({
    'string.empty': 'Country is required'
  }),
  website: Joi.string().uri().optional().messages({
    'string.uri': 'Website must be a valid URL'
  }),
  mobile: Joi.string().required().messages({
    'string.empty': 'Mobile number is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Must be a valid email'
  }),
  password: Joi.string().min(3).required().messages({
    'string.min': 'Password must be at least 3 characters long'
  }),
  confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
    'any.only': 'Passwords do not match'
  }),
  wallet: Joi.string().required().messages({
    'string.empty': 'Country is required'
  }),
});

const loginSchema: Schema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Must be a valid email',
    'string.empty': 'Email is required'
  }),
  password: Joi.string().min(3).required().messages({
    'string.min': 'Password must be at least 3 characters long',
    'string.empty': 'Password is required'
  }),
});

const validateRegister = (req: Request<{}, {}, RegisterBody>, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorDetails: { [key: string]: string } = error.details.reduce((acc:any, currentError:any) => {
      if (!acc[currentError.path[0]]) {
        acc[currentError.path[0]] = currentError.message;
      }
      return acc;
    }, {});

    return res.status(400).json({ errors: errorDetails });
  }
  next();
};

const validateLogin = (req: Request<{}, {}, LoginBody>, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorDetails: { [key: string]: string } = error.details.reduce((acc:any, currentError:any) => {
      if (!acc[currentError.path[0]]) {
        acc[currentError.path[0]] = currentError.message;
      }
      return acc;
    }, {});
    return res.status(400).json({ errors: errorDetails });
  }
  next();
};

export { validateRegister, validateLogin };
