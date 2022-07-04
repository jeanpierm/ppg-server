import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiResponseOptions,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiResponse } from '../dto/api-response.dto';
import { PaginatedResponseDto } from '../dto/paginated-response.dto';

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiOkResponse({
      ...options,
      schema: {
        title: `PaginatedResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(PaginatedResponseDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiCreatedCustomResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiCreatedResponse({
      ...options,
      schema: {
        title: `ApiResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiOkCustomResponse = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiOkResponse({
      ...options,
      schema: {
        title: `ApiResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              data: {
                $ref: getSchemaPath(model),
              },
            },
          },
        ],
      },
    }),
  );
};

export const ApiOkCustomResponseArray = <TModel extends Type<any>>(
  model: TModel,
  options?: ApiResponseOptions,
) => {
  return applyDecorators(
    ApiOkResponse({
      ...options,
      schema: {
        title: `ApiResponseOf${model.name}`,
        allOf: [
          { $ref: getSchemaPath(ApiResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
  );
};
