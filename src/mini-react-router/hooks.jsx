import { useContext } from "react";
import { NavigationContext, RouteContext } from "./Context";
import { Outlet } from "./Outlet";
import { normalizePathname } from "./utils";

export function useRoutes(routes) {
  const location = useLocation();
  const pathname = location.pathname;
  return routes.map((route) => {
    // TODO: 嵌套路由
    const match = pathname.startsWith(route.path);

    return match
      ? route.children
        ? route.children.map((r) => {
            // TODO: 嵌套的 path 拼裝
            let matchChildRoute = normalizePathname(r.path) === pathname;
            return (
              matchChildRoute && (
                <RouteContext.Provider value={{ outlet: r.element }}>
                  {route.element !== undefined ? route.element : <Outlet />}
                </RouteContext.Provider>
              )
            );
          })
        : route.element
      : null;
  });
}

export function useNavigator() {
  // 只關心跳轉，但要知道現在是 BrowserRouter || HashRouter ，才知道可不可以用 history
  const { navigator } = useContext(NavigationContext);
  return navigator.push;
}

export function useLocation() {
  const { location } = useContext(NavigationContext);
  return location;
}

// 讓父路由的子路由渲染出來，
// Route 包裹 Route，父層的 element 取到子路由的 element 做渲染
// 但父層 到 子 element 不知道中間間隔多少層級
// === 是跨組件存取，使用 Context
// 要拿到 Routes createRoutesFromChildren 做的 routes 內的 children
export function useOutlet() {
  const { outlet } = useContext(RouteContext);
  return outlet;
}
