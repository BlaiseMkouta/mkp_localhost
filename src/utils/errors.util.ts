export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number,
    public details?: unknown, // peuvent servir a afficher les details des erreurs ex: ceux de zod
  ) {
    super(message);
    this.name = "AppError";
  }
}
