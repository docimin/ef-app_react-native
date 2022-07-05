import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { TokenRegSysRequest, TokenRegSysResponse, TokenWhoAmIResponse } from "./authorization.types";
import { RecordId, RecordMetadata } from "./eurofurence.types";

export const authorizationService = createApi({
    reducerPath: "authorizationService",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://app.eurofurence.org/EF26",
        prepareHeaders: (headers, { getState }) => {
            const token: string | undefined = (getState() as any).authorization?.token;

            if (token) {
                headers.set("Authorization", `Bearer ${token}`);
            }

            return headers;
        },
    }),
    tagTypes: ["User"],
    endpoints: (builder) => ({
        postToken: builder.mutation<TokenRegSysResponse, TokenRegSysRequest>({
            query: (args) => ({
                url: "/Api/Tokens/RegSys",
                method: "POST",
                body: {
                    RegNo: args.RegNo,
                    Username: args.Username,
                    Password: args.Password,
                },
            }),
            invalidatesTags: ["User"],
        }),
        getWhoAmI: builder.query<TokenWhoAmIResponse, void>({
            query: () => ({
                url: "/Api/Tokens/WhoAmI",
            }),
            providesTags: ["User"],
        }),
        postDeviceRegistration: builder.mutation<void, { DeviceId: string; Topics: string[] }>({
            query: (args) => ({
                url: "/Api/PushNotifications/FcmDeviceRegistration",
                method: "POST",
                body: {
                    DeviceId: args.DeviceId,
                    Topics: args.Topics,
                },
            }),
        }),
    }),
});

export const selectById =
    <T extends RecordMetadata>(id: RecordId) =>
    (
        query: Query<T[]>
    ): Query<T[]> & {
        record: T | undefined;
    } => ({
        ...query,
        record: query.data?.find((record) => record.Id === id),
    });

export const filterByIds =
    <T extends RecordMetadata>(ids: RecordId[]) =>
    (
        query: Query<T[]>
    ): Query<T[]> & {
        records: T[];
    } => ({
        ...query,
        records: query.data?.filter((it) => it.Id in ids) ?? [],
    });

export const { usePostTokenMutation, useGetWhoAmIQuery, usePostDeviceRegistrationMutation } = authorizationService;