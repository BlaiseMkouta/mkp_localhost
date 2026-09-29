// Ajoute l'id de l'utilisateur connecte sur la requete (rempli par le middleware authenticate)
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}

export {};
