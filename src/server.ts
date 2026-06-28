import {app} from './app.js';
import { PORT } from './config/env.js';


const startServer = ()=>{
    app.listen(PORT, ()=>{
        console.log(`Server is listening at port ${PORT}`);
    });
}


startServer();