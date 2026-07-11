import { Request, Response } from "express";
import { users, getUser, createUser as createrUserInDB, updateUser as updateUserDataInDB, deleteUser as deleteUserInDB } from "../services/user.service";
import {ApiError, notFound } from "../utils/api-error";


const getAllUsers = async(req: Request, res: Response)=>{
    const allUsers = await users();
    res.status(200).json({
        success: true,
        message: "Users fetched successfully",
        data: allUsers
    });
}

const getUserById = async(req: Request, res: Response)=>{
    const {id } = req.params;
    if(Number.isNaN(id)){
        throw new ApiError(500, "Invalid user Id");
    }
    const user = await getUser(Number(id));
    if(!user){
        throw notFound("User Not Found");
    }
    res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user
    });
}

const createUser = async(req: Request, res: Response)=>{
    const {name, email} = req.body;
    // zod validation
    await createrUserInDB(name, email);
    res.status(200).json({
        "success": true,
        "message": "user created in DB",
    })
}

const updateUser = async(req: Request, res: Response)=>{
    const {id} = req.params;
    const {data} = req.body;
    
    const result = await updateUserDataInDB(Number(id), data);
    res.status(200).json({
        "success" : true,
        "message": "updated successfully",
    })
}

const deleteUser = async(req: Request, res: Response)=>{
    const {id} = req.params;
    await deleteUserInDB(Number(id));
    res.status(200).json({
        "success": true,
        "message": "User deleted successfully",
    })

}

export { getAllUsers, getUserById, createUser, updateUser, deleteUser };