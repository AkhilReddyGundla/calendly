import express from "express";
import { userRouter } from "./router/user.router";
const app = express();
app.use(express.json());

app.get('/health',(_req, res)=>{
    res.json({
        "status" : "ok",
        "timestamp": new Date().toISOString(),
    })
})

app.use("/users", userRouter);

export{app};