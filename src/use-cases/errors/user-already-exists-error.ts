export class UserEmailAlreadyExistsError extends Error {
  constructor() {
    super('E-mail already exists');
    this.name = 'EmailAlreadyExistsError';
  }
}