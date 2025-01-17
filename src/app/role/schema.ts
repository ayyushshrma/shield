import Joi from 'joi';
import Config from '../../config/config';

const validationOptions = Config.get('/validationOptions');

const Role = Joi.object()
  .keys({
    id: Joi.string().uuid().required(),
    displayname: Joi.string().required(),
    attributes: Joi.array().items(Joi.string()).allow(null),
    metadata: Joi.object().required().allow(null),
    createdAt: Joi.date().iso().required(),
    updatedAt: Joi.date().iso().required(),
    tags: Joi.array().items(Joi.string())
  })
  .unknown(true)
  .label('Role')
  .options(validationOptions);

export const RoleResponse = Role;
export const RolesResponse = Joi.array()
  .items(Role)
  .label('Roles')
  .options(validationOptions);

export const Attributes = Joi.alternatives().try(
  Joi.array().items(Joi.string().optional()).label('attributes').optional(),
  Joi.string().optional()
);

const actionOperationPayload = Joi.object()
  .label('ActionOperation')
  .keys({
    operation: Joi.string().valid('create', 'delete').required(),
    action: Joi.string().required()
  })
  .unknown(true);

export const createPayload = Joi.object()
  .label('RoleCreatePayload')
  .keys({
    displayname: Joi.string().required(),
    attributes: Joi.array().items(Joi.string()),
    actions: Joi.array().items(actionOperationPayload),
    metadata: Joi.object(),
    tags: Joi.array().items(Joi.string())
  })
  .options(validationOptions);
