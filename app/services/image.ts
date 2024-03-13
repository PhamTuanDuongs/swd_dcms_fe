import type { AppLoadContext } from "@remix-run/cloudflare";
import { AwsClient } from "aws4fetch";

export const uploadImg = async (key: string, context: AppLoadContext, file: File, contentType: string, filename?: string) => {
    const R2_URL = `https://${context.R2_BUCKET_NAME}.${context.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    const r2 = new AwsClient({
        accessKeyId: context.R2_ACCESS_KEY_ID as string,
        secretAccessKey: context.R2_SECRET_ACCESS_KEY as string,
    });

    const res = await r2.fetch(`${R2_URL}/${key}`, {
        body: file,
        method: "POST",
        headers: {
            "Content-Type": contentType,
        },
    });
};
