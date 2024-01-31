import React from "react";
import {
  createBrowserRouter,
  RouteObject,
  RouterProvider,
} from "react-router-dom";
import { Character } from "@repo/domain";
import { Characters } from "../pages/characters/characters.tsx";
import { CharacterDetail } from "../pages/characterDetail/characterDetail.tsx";
import { Register } from "../pages/register/register.tsx";
import { Login } from "../pages/login/login.tsx";
import { ProtectedRoute } from "../utils/protected-route.tsx";
import { getApi } from "../utils/api.ts";
import { NotFound } from "../pages/notFound/notFound.tsx";

function Routes() {
  const routesForAuthenticatedOnly: RouteObject[] = [
    {
      path: "/",
      element: <ProtectedRoute />,
      errorElement: <NotFound />,
      children: [
        {
          path: "/characters",
          element: <Characters />,
        },
        {
          path: "/characters/:id",
          element: <CharacterDetail />,
          loader: async ({ params }) => {
            const api = getApi();
            const res = await api.get<Character>(`/characters/${params.id}`);
            if (res.status === 404) {
              throw new Response("Not Found", { status: 404 });
            }
            return { character: res.data };
          },
          errorElement: <NotFound />,
        },
      ],
    },
  ];

  const routesForNotAuthenticatedOnly: RouteObject[] = [
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
  ];

  const router = createBrowserRouter([
    ...routesForNotAuthenticatedOnly,
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
}

export default Routes;
