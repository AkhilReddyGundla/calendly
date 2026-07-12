import { Router } from "express";
import { createUser, deleteUser, getAllUsers, getUserById, updateUser } from "../controllers/user.controller";
import { validate, validateParams } from "../middleware/validate";
import { createUserSchema, findUserSchema, updateUserSchema } from "../dtos/user.dto";

export const userRouter = Router();

userRouter.get("/", getAllUsers);
userRouter.get("/:id", validateParams(findUserSchema), getUserById);
userRouter.post("/create",validate(createUserSchema) ,createUser);
userRouter.patch("/:id/update", validate(updateUserSchema), updateUser);
userRouter.delete("/:id/delete", deleteUser);