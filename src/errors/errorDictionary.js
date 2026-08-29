export const ERRORS = {
  USER_NOT_FOUND: {
    statusCode: 404,
    message: 'El usuario solicitado no existe'
  },
  PRODUCT_NOT_FOUND: {
    statusCode: 404,
    message: 'El producto solicitado no existe'
  },
  ORDER_NOT_FOUND: {
    statusCode: 404,
    message: 'El pedido solicitado no existe'
  },
  DELIVERY_NOT_FOUND: {
    statusCode: 404,
    message: 'La entrega solicitada no existe'
  },
  INVALID_DRIVER_ROLE: {
    statusCode: 400,
    message: 'El usuario indicado no tiene rol de repartidor'
  },
  VALIDATION_ERROR: {
    statusCode: 400,
    message: 'Los datos enviados no son válidos'
  },
  INVALID_MOCK_AMOUNT: {
    statusCode: 400,
    message: 'La cantidad de registros a generar debe ser un número válido y positivo'
  },
  ROUTE_NOT_FOUND: {
    statusCode: 404,
    message: 'La ruta solicitada no existe'
  },
  FILE_REQUIRED: {
    statusCode: 400,
    message: 'Debe adjuntar un archivo'
  },
  INVALID_FILE_TYPE: {
    statusCode: 400,
    message: 'El tipo de archivo no está permitido'
  },
  FILE_TOO_LARGE: {
    statusCode: 400,
    message: 'El archivo supera el tamaño máximo permitido (5MB)'
  },
  INVALID_DOCUMENT_TYPE: {
    statusCode: 400,
    message: 'El tipo de documento indicado no es válido'
  },
  UPLOAD_ERROR: {
    statusCode: 500,
    message: 'Ocurrió un error al guardar el archivo'
  },
  INTERNAL_SERVER_ERROR: {
    statusCode: 500,
    message: 'Ocurrió un error interno en el servidor'
  }
}