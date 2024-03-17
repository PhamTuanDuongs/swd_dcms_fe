import { AppLoadContext } from "@remix-run/cloudflare";

import { api } from "./api";

import { Role } from "~/types";

export async function getAllRoleEmployee(context: AppLoadContext) {
    return api(context).get("admin/role/all/employee").json<Role[]>();
}
