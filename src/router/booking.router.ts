import { Router } from "express";
import { requireUserId } from "../middleware/require-user-id";
import { validateParams } from "../middleware/validate";
import { listHostBookingQuerySchema } from "../dtos/booking.dto";

export const bookingRouter:Router = Router();

bookingRouter.use(requireUserId);

bookingRouter.get('/', validateParams(listHostBookingQuerySchema), )