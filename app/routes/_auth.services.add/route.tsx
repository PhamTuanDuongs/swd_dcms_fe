import type { ActionFunction } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { HTTPError } from "ky";
import { z } from "zod";
import { zfd } from "zod-form-data";

import { addService } from "~/services/service";

export const ZService = zfd.formData({
    name: zfd.text(z.string().trim().nonempty("Name is required").max(126, "Name must be less than 255 characters")),
    description: zfd
        .text(z.string().trim().max(1000, "Description must be less than 1000 characters").optional())
        .transform((value) => (value ? value : "")),
    price: zfd.numeric(
        z.number().nonnegative("Price must be nonnegative").max(2_000_000_000, { message: "Price must be less than 2,000,000,000" }),
    ),
});

export const action: ActionFunction = async ({ context, request }) => {
    try {
        const service = ZService.parse(await request.formData());

        await addService(context, service);

        return json({ message: "Service added successfully!", ok: true });
    } catch (error) {
        if (error instanceof z.ZodError) {
            return json({ message: "Invalid data", ok: false }, { status: 400 });
        } else if (error instanceof HTTPError) {
            return json({ message: "Failed to add service", ok: false }, { status: error.response.status });
        }
    }
};
