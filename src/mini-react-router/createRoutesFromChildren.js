import React from "react";

export function createRoutesFromChildren(children) {
  const routes = [];
  React.Children.forEach(children, (child) => {
    let childReactElement = child;
    let route;
    if (childReactElement.props.element) {
      route = {
        element: childReactElement.props.element,
        path: childReactElement.props.path,
      };
    }
    if (childReactElement.props.children) {
      route.children = createRoutesFromChildren(
        childReactElement.props.children
      );
    }
    routes.push(route);
  });

  return routes;
}
