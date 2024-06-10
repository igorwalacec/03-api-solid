export class MaxNumberCheckInsError extends Error {
  constructor() {
    super('Max number os check-ins reached.')
  }
}
