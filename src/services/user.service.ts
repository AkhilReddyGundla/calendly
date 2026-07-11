import { Prisma } from "../prisma/client";
import { getAll, getUserById, createUser as createrUserInDB, updateUser as updateUserInDB, deleteUser as deleteUserInDB} from "../repositories/user.repositry"
import { notFound } from "../utils/api-error";



export const users = async ()=>{
    const users = await getAll();
    return users;
}

export const getUser = async(id : number)=>{
    const user = await getUserById(id);
    if(!user){
        throw notFound("User not found");
    }
    return user;
}

export const createUser = async(name : string, email : string)=>{
    const user = await createrUserInDB(name, email);
    return user;
}

export const updateUser = async(id : number, data : Prisma.UserUpdateInput)=>{
    const updateduser = await updateUserInDB(id, data);
    return updateduser
}

export const deleteUser = async(id : number)=>{
    await deleteUserInDB(id);
}