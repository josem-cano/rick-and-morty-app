import { AnyZodObject, z, ZodError, ZodIssue } from "zod";
import { Request, Response } from "express";

export class RickAndMortyApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function zParse<T extends AnyZodObject>(
  schema: T,
  req: Request,
  res: Response,
): Promise<z.infer<T>> {
  try {
    return await schema.parseAsync(req);
  } catch (error) {
    return res.status(400).json((error as ZodError).errors);
  }
}

const formatZodIssue = (issue: ZodIssue): string => {
  const { path, message } = issue;
  const pathString = path.join(".");

  return `${pathString}: ${message}`;
};

// Format the Zod error message with only the current error
export const formatZodError = (error: ZodError): string | undefined => {
  const { issues } = error;
  if (issues.length) {
    const currentIssue = issues[0];

    return formatZodIssue(currentIssue);
  }
};
