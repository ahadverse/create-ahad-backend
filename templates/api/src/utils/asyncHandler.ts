import { Request, Response, NextFunction } from "express";

export function asyncHandler<Req extends Request = Request>(
  fn: (req: Req, res: Response) => Promise<void>
) {
  return (req: Req, res: Response, next: NextFunction): void => {
    fn(req, res).catch(next);
  };
}
