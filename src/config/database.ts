import {  PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../prisma/client.js"

const adapter = new PrismaPg({connectionString: process.env.DATABASE_URL});
export const prisma = new PrismaClient({adapter});



export const connectDatabase = async()=>{
    try{
        await prisma.$connect();
        console.log("Database connected successfully");
    }catch(error){
        throw new Error("unable to connect to DB");
        process.exit(1);
    }
}