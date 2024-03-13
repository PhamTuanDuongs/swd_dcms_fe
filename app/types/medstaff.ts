import * as z from "zod";

export const ZMedStaff = z.object({
    userDTO: z.object({
        id: z.number(),
        email: z.string(),
        role: z.object({
            id: z.number(),
            name: z.string(),
        }),
        metadata: z.object({
            id: z.number(),
            name: z.string().min(1),
            phoneNo: z.string(),
        }),
    }),
});

export type Medstaff = z.infer<typeof ZMedStaff>;
