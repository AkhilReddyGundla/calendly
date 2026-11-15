import 'dotenv/config';
import { Pool } from 'pg';
import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "../generated/prisma/client.js"

const connectionString = process.env.DATABASE_URL;
const databaseHost = connectionString ? new URL(connectionString).hostname : "";
const localHosts = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "postgres"]);

const pool = new Pool({
    connectionString,
    ssl: localHosts.has(databaseHost) ? false : {
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