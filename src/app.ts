import express from "express";
import { userRouter } from "./router/user.router";
import { errorHandler } from "./middleware/error-handler";
import { recordNotFound } from "./middleware/route-not-found";
import { eventTypesRouter } from "./router/event-types.router";
const app = express();
app.use(express.json());

app.get('/health',(_req, res)=>{
    res.json({
        "status" : "ok",
        "timestamp": new Date().toISOString(),
    })
})

app.use("/users", userRouter);
app.use("/event-types", eventTypesRouter);
app.use(recordNotFound);
app.use(errorHandler);

export{app};