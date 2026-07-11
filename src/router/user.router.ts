import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user.controller";

export const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", getUserById);
userRouter.post("/create", createUser);
userRouter.put("/:id/update", updateUser);
userRouter.delete("/:id/delete", deleteUser)