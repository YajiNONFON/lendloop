// Automation is opt-in: without these two settings nothing is scheduled and nothing leaves Convex.
export const automationEnabled=()=>Boolean(process.env.N8N_WEBHOOK_URL&&process.env.AUTOMATION_SECRET);
