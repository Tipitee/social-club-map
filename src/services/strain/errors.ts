
/**
 * Custom error class for strain service errors
 */
export class StrainServiceError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = "StrainServiceError";
  }
}
