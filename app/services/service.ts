import { api } from "./api";

import type { AppLoadContext } from "@remix-run/cloudflare";
import type { PageServiceResponse, Service } from "~/types/service";

export const findAllUndeletedServicesByName = async (context: AppLoadContext, pageNo = 1, name = "") => {
    const res = await api(context)
        .get("api/service/all", {
            searchParams: {
                pageNo,
                name,
            },
        })
        .json<PageServiceResponse>();

    return res;
};

export const addService = async (context: AppLoadContext, service: Service) => {
    try {
        const res = await api(context)
            .post("api/service/add", {
                json: service,
            })
            .json();

        return res;
    } catch (error) {
        throw error;
    }
};

export const editService = async (context: AppLoadContext, service: Service) => {
    try {
        const res = await api(context)
            .post("api/service/edit", {
                json: service,
            })
            .json();
        return res;
    } catch (error) {
        throw error;
    }
};

export const getServiceById = async (context: AppLoadContext, id: string) => {
    try {
        const res = await api(context).get(`api/service/${id}`).json<Service>();

        return res;
    } catch (error) {
        throw error;
    }
};

export const deteleServiceById = async (context: AppLoadContext, id: string) => {
    try {
        const res = await api(context).delete(`api/service/delete/${id}`).text();

        return res;
    } catch (error) {
        throw error;
    }
};

export const getServiceByName = async (context: AppLoadContext, name: any) => {
    try {
        const res = await api(context).get(`api/service/name/${name}`).json<Service[]>();

        return res;
    } catch (error) {
        throw error;
    }
};
