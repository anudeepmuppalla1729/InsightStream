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
const avatarList = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
  "avatar6.png",
  "avatar7.png",
  "avatar8.png",
  "avatar9.png",
  "avatar10.png",
];

server.use(cors());
server.use(jsonServer.bodyParser);
server.use(middlewares);
protectedRoutes(["/bookmarks", "/profile", "/feed", "/users"]);

server.post("/signup", (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const db = router.db;
    const existingUser = db.get("users").find({ email }).value();
    if (existingUser)
      return res.status(409).json({ message: "User already registered" });
    const avatar = avatarList[Math.floor(Math.random() * avatarList.length)];

    const id = uuid();
    const newUser = { id: id, name, email, password, avatar };
    db.get("users").push(newUser).write();

    const SECRET = process.env.JWT_SUPER_SECRET_KEY;
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      name: newUser.name,
      email: newUser.email,
      avatar: newUser.avatar,
      token,
    });
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
      expiresIn: "7d",
    });

    if (!user.avatar) {
      user.avatar = avatarList[Math.floor(Math.random() * avatarList.length)];
      db.get("users")
        .find({ id: user.id })
        .assign({ avatar: user.avatar })
        .write();
    }

    return res.status(200).json({
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token,
    });
  } catch (e) {
    console.error("Login error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

server.patch("/users/:id/avatar", (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { avatar } = req.body;

    if (!avatarList.includes(avatar)) {
      return res.status(400).json({ message: "Invalid avatar" });
    }

    const db = router.db;
    const existing = db.get("users").find({ id }).value();

    if (!existing) return res.status(404).json({ message: "User not found" });
    if (existing.id !== user.id) return res.status(403).json({ message: "Forbidden" });

    db.get("users").find({ id }).assign({ avatar }).write();

    return res.status(200).json({ avatar });
  } catch (e) {
    console.error("PATCH /users/:id/avatar error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});


// Create a bookmark
server.post("/bookmarks", (req, res) => {
  try {
    const user = req.user; // protectedRoutes must set req.user from the token
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { article } = req.body;
    if (!article || !article.url) {
      return res.status(400).json({ message: "Missing article" });
    }

    const db = router.db;

    // Prevent duplicate for same user + url
    const existing = db
      .get("bookmarks")
      .find({ userId: user.id, "article.url": article.url })
      .value();
    if (existing) {
      return res
        .status(409)
        .json({ message: "Already bookmarked", bookmark: existing });
    }

    const id = uuid(); // you already imported uuid earlier in this file
    const saved = {
      id,
      userId: user.id,
      article,
      savedAt: new Date().toISOString(),
    };

    db.get("bookmarks").push(saved).write();

    return res.status(201).json(saved);
  } catch (e) {
    console.error("POST /bookmarks error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Get bookmarks for logged-in user
server.get("/bookmarks", (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const db = router.db;
    const userBookmarks = db
      .get("bookmarks")
      .filter({ userId: user.id })
      .value();

    return res.status(200).json(userBookmarks);
  } catch (e) {
    console.error("GET /bookmarks error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Delete bookmark by id
server.delete("/bookmarks/:id", (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const db = router.db;
    const bm = db.get("bookmarks").find({ id }).value();

    if (!bm) return res.status(404).json({ message: "Not found" });
    if (bm.userId !== user.id)
      return res.status(403).json({ message: "Forbidden" });

    db.get("bookmarks").remove({ id }).write();
    return res.status(200).json({ id });
  } catch (e) {
    console.error("DELETE /bookmarks/:id error:", e);
    return res.status(500).json({ message: "Internal server error" });
  }
});

server.use(router);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log("Server up Baby!, on PORT:", PORT);
});
