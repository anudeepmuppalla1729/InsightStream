import jsonServer from "json-server";
import jwt from "jsonwebtoken";
import cors from "cors";
import { protectedRoutes } from "./middleware/auth.js";
import { v4 as uuid } from "uuid";
import dotenv from "dotenv";
dotenv.config();

const server = jsonServer.create();
const router = jsonServer.router("mock/db.json");
const middlewares = jsonServer.defaults();

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);

server.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });
    
    const db = router.db;
    const existingUser = db.get("users").find({ email }).value();
    if (existingUser)
      return res.status(409).json({ message: "User already registered" });
    
    const id = uuid();
    const newUser = { id: id, name, email, password };
    db.get("users").push(newUser).write();

    const SECRET = process.env.JWT_SUPER_SECRET_KEY;
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET, { expiresIn: "7d" });
    
    return res.status(201).json({ name: newUser.name, email: newUser.email, token });
  } catch (e) {
    console.error("Signup error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

server.post("/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const db = router.db;
    const user = db.get("users").find({ email, password }).value();

    if (!user)
      return res.status(401).json({ message: "Invalid email or password" });

    const SECRET = process.env.JWT_SUPER_SECRET_KEY;
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET, {
      expiresIn: "7d"
    })

    return res.status(200).json({ name: user.name, email: user.email, token });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

server.use(
  protectedRoutes(["/bookmarks", "/profile", "/feed"])
);

server.use(router);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server up Baby!, on PORT:", PORT);
})