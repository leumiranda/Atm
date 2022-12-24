class CustomError extends Error {
  constructor(name, statusCode, message) {
    super(message);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    Error.captureStackTrace(this);
  }
}

module.exports = {
  apiError404: new CustomError('NotFound', 404, 'Entidade não encontrada'),
  apiError403: new CustomError('Forbidden', 403, 'Usuário não tem acesso ao recurso'),
  apiError500: new CustomError('SystemError', 500, 'Houve um erro ao processar o recurso'),
  CustomError,
};
