import { useContext } from "react";
import { NavigationContext, RouteContext } from "./Context";
import { Outlet } from "./Outlet";
import { normalizePathname } from "./utils";
import { matchRoutes } from "react-router-dom";

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
  const pathname = location.pathname;
  // 遍歷 routes ，flat 拍平變成陣列結構
  const matches = matchRoutes(routes, { pathname });
  console.log("matches", matches);
  return renderMatches(matches);
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

export function useParams() {
  const { matches } = useContext(RouteContext);
  const lastMatch = matches.at(-1);
  return lastMatch ? lastMatch.params : {};
}
