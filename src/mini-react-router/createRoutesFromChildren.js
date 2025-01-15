import React from "react";

export function createRoutesFromChildren(children) {
  const routes = [];
  React.Children.forEach(children, (child) => {
    let childReactElement = child;
    if (childReactElement?.props?.element) {
      const route = {
        element: childReactElement.props.element,
        path: childReactElement.props.path,
      };
      routes.push(route);
    }
  });

  return routes;
}
