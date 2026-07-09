import { prisma } from "../config/database";
import { Prisma } from "../prisma/client";


export const getAll = async()=>{
    const users = await prisma.user.findMany();
    return users;
}

export const getUserById = async(id: number)=>{
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });
    return user;
}

export const createUser = async(name: string, email: string) =>{
    const user = await prisma.user.create({
        data : {
            name,
            email,
        }
    });
    return user;
}

export const updateUser = async(id : number,  updatedData : Prisma.UserUpdateInput)=>{
    const updatedUser = await prisma.user.update({
        where : {id},
        data: updatedData,
    });
    return updatedUser;
}

export const deleteUser = async(id : number)=>{
    await prisma.user.delete({
        where : {id}
    });
}