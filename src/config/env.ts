import 'dotenv/config';


export const PORT = process.env.PORT || 3000
export const node_env = process.env.NODE_ENV || "development"
export const slotGenerationDates = Number(process.env.SLOT_GENERATION_DAYS) || 30

export const TEMPORAL_ADDRESS = process.env.TEMPORAL_ADDRESS || 'localhost:7233'
export const TEMPORAL_NAMESPACE = process.env.TEMPORAL_NAMESPACE || 'default'
export const TEMPORAL_TASK_QUEUE = process.env.TEMPORAL_TASK_QUEUE || 'calendly-task';