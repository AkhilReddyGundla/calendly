import { Request, Response } from "express";
import { users, getUser, createUser as createrUserInDB, updateUser as updateUserDataInDB, deleteUser as deleteUserInDB } from "../services/user.service";


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
    try {
        const user = await getUser(Number(id));
        res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
}

const createUser = async(req: Request, res: Response)=>{
    const {name, email} = req.body;
    // zod validation

    try {
        await createrUserInDB(name, email);
        res.status(200).json({
            "success": true,
            "message": "user created in DB",
        })
    } catch (error) {
        res.status(401).json({
            "success": false,
            "message": error,
        })
    }
}

const updateUser = async(req: Request, res: Response)=>{
    const {id} = req.params;
    const {data} = req.body;

    try {
        const result = await updateUserDataInDB(Number(id), data);
        res.status(200).json({
            "success" : true,
            "message": "updated successfully",
        })
    } catch (error) {
        res.status(401).json({
            "success": false,
            "message": error,
        })
    }
}

const deleteUser = async(req: Request, res: Response)=>{
    const {id} = req.params;
    try {
        deleteUserInDB(Number(id));
        res.status(200).json({
            "success": true,
            "message": "User deleted successfully",
        })
    } catch (error) {
        res.status(401).json({
            "success": false,
            "message": error,
        })
    }
}

export { getAllUsers, getUserById, createUser, updateUser };