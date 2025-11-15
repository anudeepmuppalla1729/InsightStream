import jwt from "jsonwebtoken";

export const protectedRoutes = (protectedPaths = []) => {
  return (req, res, next) => {
    const shouldProtect = protectedPaths.some((path) =>
      req.path.startsWith(path)
    );

    if (!shouldProtect) return next();

    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(403).json({ message: "missing token" });

    const token = authHeader.split(" ")[1];
    const SECRET = process.env.JWT_SUPER_SECRET_KEY;
    try {
      jwt.verify(token, SECRET);
      next();
    } catch {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};