import { useContext } from "react";
import { NavigationContext } from "./Context";

export function useRoutes(routes) {
  const pathname = window.location.pathname;
  return routes.map((route) => {
    // TODO: 嵌套路由
    const match = pathname.startsWith(route.path);
    return match ? route.element : null;
  });
}

export function useNavigator() {
  // 只關心跳轉，但要知道現在是 BrowserRouter || HashRouter ，才知道可不可以用 history
  const navigator = useContext(NavigationContext);
  return navigator.push;
}
