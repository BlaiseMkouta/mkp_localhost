import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type Source = "body" | "params" | "query";

export function validate(schema: ZodType, source: Source = "body") {
  function middleware(req: Request, res: Response, next: NextFunction) {
    const datas = req[source];
    const result = schema.safeParse(datas);

    // fuction issue (isSecureContext)
    const error = result.error?.issues.map(function (issue) {
      return {
        code: issue.path.join(""),
        message: issue.message,
      };
    });

    if (!result.success) {

      return res.status(400).json({
        success: false,
        message: "invalid datas",
        error: error,
      });
    }

    next();
  }

  return middleware;
}
