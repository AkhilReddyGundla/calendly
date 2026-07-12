import { prisma } from "../config/database";
import { createUserDto } from "../dtos/user.dto";
import { Prisma } from "../prisma/client";


export const getAll = async()=>{
    const users = await prisma.user.findMany();
    return users;
}

export const getById = async(id: number)=>{
    const user = await prisma.user.findUnique({
        where: {
            id
        }
    });
    return user;
}

export const create = async(data: createUserDto) =>{
    const{name, email} = data;
    const user = await prisma.user.create({
        data : {
            name,
            email,
        }
    });
    return user;
}

export const update = async(id : number,  updatedData : Prisma.UserUpdateInput)=>{
    const updatedUser = await prisma.user.update({
        where : {id},
        data: updatedData,
    });
    return updatedUser;
}

export const remove = async(id : number)=>{
    await prisma.user.delete({
        where : {id}
    });
}

export const findByEmail = async(email: string)=>{
    const user = await prisma.user.findUnique({
        where:{
            email,
        }
    })
    return user;
}