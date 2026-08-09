import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client.js"

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    }
})

const adapter = new PrismaPg(pool);
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