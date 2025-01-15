import React, { ReactNode, ReactElement } from "react";
import { createRoutesFromChildren } from "./createRoutesFromChildren";
import { useRoutes } from "./hooks";

export function Routes({ children }) {
  const routes = createRoutesFromChildren(children);

  return useRoutes(routes);
}
