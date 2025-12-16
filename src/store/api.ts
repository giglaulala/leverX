import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { TAuthUser, TUser, Role } from "../types";

type SignInRequest = {
  email: string;
  password: string;
};

type SignInResponse = {
  user: TAuthUser;
};

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:3000";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: API_BASE_URL }),
  tagTypes: ["Employee", "EmployeeList", "UserList"],
  endpoints: (builder) => ({
    getEmployees: builder.query<TUser[], void>({
      query: () => "/employees",
      providesTags: (result) =>
        result && result.length
          ? [
              { type: "EmployeeList", id: "LIST" },
              ...result.map((item) => ({
                type: "Employee" as const,
                id: item._id,
              })),
            ]
          : [{ type: "EmployeeList", id: "LIST" }],
    }),
    getEmployee: builder.query<TUser, string>({
      query: (id) => `/employees/${encodeURIComponent(id)}`,
      providesTags: (_result, _error, id) => [
        { type: "Employee", id },
        { type: "EmployeeList", id: "LIST" },
      ],
    }),
    updateEmployee: builder.mutation<
      TUser,
      { id: string; body: Partial<TUser> }
    >({
      query: ({ id, body }) => ({
        url: `/employees/${encodeURIComponent(id)}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Employee", id },
        { type: "EmployeeList", id: "LIST" },
      ],
    }),
    getUsers: builder.query<TAuthUser[], void>({
      query: () => "/users",
      providesTags: (_result) => [{ type: "UserList", id: "LIST" }],
    }),
    updateUser: builder.mutation<TAuthUser, { id: string; role: Role }>({
      query: ({ id, role }) => ({
        url: `/users/${encodeURIComponent(id)}`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: [{ type: "UserList", id: "LIST" }],
    }),
    signIn: builder.mutation<SignInResponse, SignInRequest>({
      query: (body) => ({
        url: "/sign-in",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useGetEmployeesQuery,
  useGetEmployeeQuery,
  useUpdateEmployeeMutation,
  useGetUsersQuery,
  useUpdateUserMutation,
  useSignInMutation,
} = api;
