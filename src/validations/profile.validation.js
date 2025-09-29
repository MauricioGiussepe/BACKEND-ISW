import Joi from "joi";

export const updateProfileSchema = Joi.object({
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  currentPassword: Joi.string().min(8).optional(),
}).or("email", "password")

