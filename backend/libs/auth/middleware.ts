import { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "changeme";

// Define a custom Request type to include the user payload from the token
export interface AuthenticatedRequest extends Request {
  user?: any;
}

/**
 * Middleware to verify a JWT token from the Authorization header.
 * It attaches the decoded user payload to the request object.
 */
export function verifyTokenMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach decoded payload (e.g., { sub, email, roles })
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
}

/**
 * Middleware factory to check if the authenticated user has one of the required roles.
 * Must be used *after* verifyTokenMiddleware.
 * @param requiredRoles An array of roles that are allowed access.
 */
export function hasRole(requiredRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (
      !req.user ||
      !req.user.roles ||
      !requiredRoles.some((role) => req.user.roles.includes(role))
    ) {
      return res
        .status(403)
        .json({ error: "Forbidden: You do not have the required permissions" });
    }
    next();
  };
}
