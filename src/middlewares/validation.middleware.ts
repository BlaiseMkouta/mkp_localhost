import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type Source = "body" | "params" | "query";

export function validate(schema: ZodType, source: Source = "body") {
  function middleware(req: Request, res: Response, next: NextFunction) {
    const datas = req[source];
    const result = schema.safeParse(datas);

    if (!result.success) {
      const error = result.error.issues.map(function (issue) {
        return {
          path: issue.path.join("."),
          message: issue.message,
        };
      });

      return res.status(400).json({
        success: false,
        message: "invalid datas",
        error: error,
      });
    }

    // on remplace les donnees par la version validee (champs inconnus retires)
    if (source === "body") req.body = result.data;

    next();
  }

  return middleware;
}
