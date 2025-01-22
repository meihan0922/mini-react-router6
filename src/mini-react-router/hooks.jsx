import { useCallback, useContext, useMemo } from "react";
import { NavigationContext, RouteContext } from "./Context";
import { Outlet } from "./Outlet";
import { normalizePathname } from "./utils";
import { matchPath, matchRoutes } from "react-router-dom";

function renderMatches(matches) {
  if (matches === null) return null;
  return matches.reduceRight((outlet, match) => {
    return (
      <RouteContext.Provider value={{ outlet, matches }}>
        {match.route.element || outlet}
      </RouteContext.Provider>
    );
  }, null);
}

export function useRoutes(routes) {
  const location = useLocation();
  console.log("location?.pathname", location?.pathname);
  const pathname = location?.pathname || "";
  // 遍歷 routes ，flat 拍平變成陣列結構
  const matches = matchRoutes(routes, { pathname });
  console.log("matches", matches);
  return renderMatches(matches);
}

export function useNavigate() {
  // 只關心跳轉，但要知道現在是 BrowserRouter || HashRouter ，才知道可不可以用 history
  const { navigator } = useContext(NavigationContext);
  const navigate = useCallback(
    (to, options) => {
      if (typeof to === "number") {
        navigator.go(to); // ex: -1
        return;
      }
      (options?.replace ? navigator.replace : navigator.push)(
        to,
        options?.state || {}
      );
    },
    [navigator]
  );
  return navigate;
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

export function useParams() {
  const { matches } = useContext(RouteContext);
  const lastMatch = matches.at(-1);
  return lastMatch ? lastMatch.params : {};
}

// 傳回給定路徑上的路由相對於目前位置的匹配資料
export function useMatch(pattern) {
  const { pathname } = useLocation();

  return useMemo(() => matchPath(pattern, pathname), [pathname, pattern]);
}

// 解析所連結頁面的完整路徑名
export function useResolvedPath(to) {
  // 沒有實現 baseUrl 相對路由
  return useMemo(
    () => ({
      pathname: to,
      hash: "",
      search: "",
    }),
    [to]
  );
}
