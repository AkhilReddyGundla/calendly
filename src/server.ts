import {app} from './app.js';
import { PORT } from './config/env.js';
import { connectDatabase, prisma } from './config/database.js';

const startServer = async()=>{
    await connectDatabase();
    app.listen(PORT, ()=>{
        console.log(`Server is listening at port ${PORT}`);
    });
}


startServer();