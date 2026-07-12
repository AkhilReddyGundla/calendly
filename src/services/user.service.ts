import { createUserDto, updateUserDto } from "../dtos/user.dto";
import { getAll, getById, create, update, remove, findByEmail} from "../repositories/user.repositry"
import { conflict, notFound } from "../utils/api-error";



export const users = async ()=>{
    const users = await getAll();
    return users;
}

export const getUser = async(id : number)=>{
    const user = await getById(id);
    if(!user){
        throw notFound("User not found");
    }
    return user;
}

export const createUser = async(data: createUserDto)=>{
    const {email} = data;
    const existingEmail = await findByEmail(email);
    if(existingEmail){
        throw conflict("User already exist in database");
    }
    return create(data);
}

export const updateUser = async(id : number, data : updateUserDto)=>{
    const user = await getById(id);
    if(!user){
        throw notFound("User not found");
    }
    const newEmail = data.email;
    if(newEmail && newEmail !== user.email){
        const existingEmail = await findByEmail(newEmail);
        if(existingEmail){
            throw conflict(`User with ${newEmail} already exist in database`);
        }  
    }
    return update(id, data);
}

export const deleteUser = async(id : number)=>{
    const user = await getById(id);
    if(!user){
        throw notFound("User not found");
    }
    await remove(id);
}