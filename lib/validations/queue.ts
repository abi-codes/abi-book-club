import * as z from "zod";

export const QueueValidation = z.object({
  id: z.any().optional(),
  bookQueue: z.array(z.any()),
});

export const PublishQueueValidation = z.object({
  publishThread: z.string().min(3).max(255),
});
