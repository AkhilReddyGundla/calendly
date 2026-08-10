import { Request, Response } from "express";
import { users, getUser, createUser as createrUserInDB, updateUser as updateUserDataInDB, deleteUser as deleteUserInDB } from "../services/user.service";
import { sendSuccess } from "../utils/api-response";
import { createUserDto, findUserDto, updateUserDto } from "../dtos/user.dto";


const getAllUsers = async(req: Request, res: Response)=>{
    const allUsers = await users();
    sendSuccess(res, allUsers, "Users fetched successfully");
}

const getUserById = async(req: Request, res: Response)=>{
    const {id} = req.params;
    const user = await getUser(Number(id));
    sendSuccess(res, user, "User fetched successfully");
}

const createUser = async(req: Request, res: Response)=>{
    const data : createUserDto = req.body;
    await createrUserInDB(data);
    sendSuccess(res, "user created in DB");
}

const updateUser = async(req: Request, res: Response)=>{
    const {id} = req.params;
    const data = req.body;
    
    const result = await updateUserDataInDB(Number(id), data);
    sendSuccess(res, result, "updated successfully");
}

const deleteUser = async(req: Request, res: Response)=>{
    const {id} = req.params;
    await deleteUserInDB(Number(id));
    sendSuccess(res, "User deleted from DB");
}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };