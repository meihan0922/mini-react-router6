# mini-react-router6

`react-router` 包含了三個庫 - `react-router` `react-router-dom` `react-router-native`。

- react-router: 大部分核心功能。包含路由匹配和 hooks。
- react-router-dom: 包含了 `react-router` 和 DOM 相關的 api，ex: `<BrowserRouter>` `<HashRouter>` `<Link>`。
- react-router-native: 包含了 `react-router` 和 react native 相關的 api，ex: `<NativeRouter>` `native 版 <Link>`。

根據運行環境選不同的庫。

```terminal
npm i react-router@6
```

## 基本使用

### BrowserRouter 與 HashRouter 對比

BrowserRouter 和 HashRouter 都是根組件，實現原理不同

1. 原理不同，頁面不同：

   - HashRouter `/#/XXX` ，原理就是監聽 XXX 變化！ 但瀏覽器不監聽，頁面重新整理後，省略 #，對服務器端來說是同個頁面。
   - BrowserRouter，背後是瀏覽器使用 HTML 5 history api 讓頁面 UI 同步，對服務端來說是不同的！

2. HashRouter 不支持 location.key 和 location.state，動態路由跳轉需要通過 ? 傳遞參數。
3. Hash 不需要服務器的配置就可以運行，但盡可能使用 browserHistory。

### 路由

React router 提供兩種方法來聲明路由

- JSX

  - `<Routes>` `<Route>`: 基於當前 location 渲染頁面的主要方法，

    - `<Route>` 相當於 `if` 如果匹配路由則渲染，默認對大小寫不敏感，可另外設置 `caseSensitive`。默認 `element = Outlet`

      ```tsx
      <Route path="users">
        <Route path=":id" element={<SomeElement />} />
      </Route>
      ```

    - `<Routes>` location 改變時，會遍歷所有的 `子<Route>`，如果是嵌套的，且對應 URL 則通過 `<Outlet>` 來渲染子路由。

      ```tsx
      <div className="App">
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}> // children 和 element 都存在則渲染 element，
              <Route index element={<Home />} /> // 如果想要渲染 children 則必須要在 element 中使用 <Outlet>
              <Route path="product" element={<Product />} />
            </Route>
          </Routes>
        </Router>
      </div>
      ```

  - `<Outlet>`: 在父路由中，想要渲染嵌套的子路由時使用。如果父路由是精準匹配，就會渲染帶有 index 標記的子路由，否則不渲染。

- `useRoutes`

#### 跳轉

- JSX `<Link>` `<NavLink>`
- `useNavigate` `Navigate` 事件或響應狀態變化

```tsx
<Link to="/">Home</Link>
<Link to="/product">Product</Link>
<NavLink to="test" style={({isActive})=> ({"color": isActive ? "red": "black"})}>Test</NavLink>
```

#### 匹配

- `matchPath`: 基於 URL 匹配 path 的對象
- `matchRoutes`: 基於 location 返回的路由集合
- `createRoutesFromChildren`: 創建一個 react 元素集合的路由配置
- `useHref`: 返回作為 `<a href>` 的相對路徑
- `useLocation` `useNavigationType`: 當前的 location
- `resolvePath`: 基於給定的 URL，返回相對路徑

#### 動態路由

```tsx
<div className="App">
  <Router>
    <Routes>
      <Route path="/products" element={<Layout />}>
        <Route path=":id" element={<Product />} />
      </Route>
    </Routes>
  </Router>
</div>
```

在 `<Product/>` 中就可以使用 `useParams()` ，拿到動態路由的值。

#### 錯誤路由配置

```tsx
<div className="App">
  <Router>
    <Routes>
      <Route path="/products" element={<Layout />}>
        <Route path=":id" element={<Product />} />
      </Route>
      <Route path="*" element={<NoMatch />} />
    </Routes>
  </Router>
</div>
```

## 實現

只有實現最最簡單的架構，了解常用的組件的原理。

### 架構

- mini-react-router
  - index
  - BrowserRouter
  - Routes
  - Route: 帶有 path, element 屬性
  - createRoutesFromChildren: 把子節點 chilren 做一個陣列內含物件 path, element
  - hooks: 包含 `useRoutes` 處理

先暴力完成基本使用

```tsx
<div className="App">
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="product" element={<Product />} />
    </Routes>
  </BrowserRouter>
</div>
```

```tsx
// src/mini-react-router/BrowserRouter.jsx
export function BrowserRouter({ children }) {
  return <>{children}</>;
}
// src/mini-react-router/Routes.js
import { createRoutesFromChildren } from "./createRoutesFromChildren";
import { useRoutes } from "./hooks";

export function Routes({ children }) {
  const routes = createRoutesFromChildren(children);

  return useRoutes(routes);
}
// src/mini-react-router/createRoutesFromChildren.js
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
    // 處理嵌套的 <Route><Route>XXX</Route><Route>
    if (childReactElement.props.children) {
      route.children = createRoutesFromChildren(
        childReactElement.props.children
      );
    }
    routes.push(route);
  });

  return routes;
}

// src/mini-react-router/Route.jsx
export function Route() {
  return <div>Route</div>;
}

// src/mini-react-router/hooks.js

export function useRoutes(routes) {
  const pathname = window.location.pathname;
  return routes.map((route) => {
    // TODO: 嵌套路由
    const match = pathname.startsWith(route.path);
    return match ? route.element : null;
  });
}
```

### 路由切換

```tsx
function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="product" element={<Product />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}
// > src/pages/Layout.tsx
import { Link } from "../mini-react-router";

export default function Layout() {
  return (
    <div>
      Layout
      <Link to="/">Home</Link>
      <Link to="/product">Product</Link>
      {/* <Outlet /> */}
    </div>
  );
}
// src/mini-react-router/Link.jsx
import { useNavigate } from "./hooks";

export function Link({ to, children }) {
  // TODO: useNavigate 結合 history 拿到 push 方法
  const navigate = useNavigate();
  const handler = (e) => {
    e.preventDefault();
    // TODO: 路由跳轉
  };

  return (
    <a href={to} onClick={handler}>
      {children}
    </a>
  );
}
```

在寫 `useNavigate` 拿 history 之前，要先思考，BrowserRouter 和 HashRouter 都是根組件，實現原理不同。我們要拿到的是 Browser 的 history！

回到 `src/mini-react-router/BrowserRouter.jsx`

```tsx
import React, { useRef } from "react";
import { Router } from "./Router";
// 這邊拿源碼使用，涉及兼容性，ie, chrome 不一樣
// 執行後會回傳 history 的擴充
import { createBrowserHistory } from "./history.ts";

export function BrowserRouter({ children }) {
  const historyRef = useRef();

  // 避免每次都重新創造
  if (!historyRef.current) {
    historyRef.current = createBrowserHistory();
  }
  // 做了一個 Router 組件，可以和 HashRouter 共用
  // 用 context 傳遞 history，順便做 location
  return (
    <Router navigator={historyRef.current} location={state.location}>
      {children}
    </Router>
  );
}
```

> src/mini-react-router/Context.js

```ts
import { createContext } from "react";

const NavigationContext = createContext();

export { NavigationContext };
```

> src/mini-react-router/Router.jsx

```tsx
import { useMemo } from "react";
import { NavigationContext } from "./Context";

// 可以給 HashRouter 和 BrowserRouter 共用
// navigator 就是 history
export function Router({ navigator, children }) {
  let navigationContext = useMemo(() => navigator, [navigator]);

  return (
    <NavigationContext.Provider value={navigationContext}>
      {children}
    </NavigationContext.Provider>
  );
}
```

> src/mini-react-router/hooks.js

```ts
export function useNavigate() {
  // 只關心跳轉，但要知道現在是 BrowserRouter || HashRouter ，才知道可不可以用 history
  const { navigator } = useContext(NavigationContext);
  return navigator.push;
}
// 順便處理 location
export function useLocation() {
  const { location } = useContext(NavigationContext);
  return location;
}
```

這個時候，`Link` 就可以透過 `useNavigate` 拿到 history 了

```tsx
import { useNavigate } from "./hooks";

export function Link({ to, children }) {
  const navigate = useNavigate();
  const handler = (e) => {
    e.preventDefault();
    navigate(to);
  };

  return (
    <a href={to} onClick={handler}>
      {children}
    </a>
  );
}
```

把 `useRoutes` 內的 location 替換成 `useLocation` 即可。

### 路由渲染

要實現不管 `<Route>` 嵌套有多深，都可以渲染出 `子<Route>` 的 element

比方 `<Layout/>` 就可以透過呼叫 `<Outlet/>` 渲染出對應的 `<Home/>` 或是 `<Product/>`

```tsx
<div className="App">
  <Router>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/product" element={<Product />} />
      </Route>
    </Routes>
  </Router>
</div>
```

```tsx
export default function Layout() {
  return (
    <div>
      Layout
      <Link to="/">Home</Link>
      <Link to="/product">Product</Link>
      <Outlet />
    </div>
  );
}
```

這要怎麼做呢？而且 `<Layout/>` ，如果又嵌套子組件，更深層使用 `<Outlet/>` 也必須可行！

先想到跨組件渲染，會用到 context

> src/mini-react-router/Context.js

```tsx
const NavigationContext = createContext();
const RouteContext = createContext();
export { NavigationContext, RouteContext };
```

在 `<Outlet/>` 中使用 `useOutlet`

```tsx
// src/mini-react-router/Outlet.jsx
export function Outlet() {
  return useOutlet();
}
// src/mini-react-router/hooks.jsx
export function useOutlet() {
  const { outlet } = useContext(RouteContext);
  return outlet;
}
```

現在要看 `<RouteContext.Provider/>` 要加在哪裡，
我們會在 value 存 element，在 `Routes` 中會使用 `createRoutesFromChildren` 拿到 children，並且遞迴處理成 `routes` 傳到 `useRoutes` 中，比對路徑。

比對路徑的同時，應該可以同時處理 context

```tsx
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

// src/mini-react-router/utils.js
// 處理開頭和末尾多個連續的 /，變成單個
export const normalizePathname = (path) => {
  return path.replace(/\/+$/, "").replace(/^\/*/, "/");
};
```

現在已經完成取值了，但畫面還沒有連動 react 重新渲染！

```tsx
import React, { useLayoutEffect, useRef, useState } from "react";
import { Router } from "./Router";
// 涉及兼容性，ie, chrome 不一樣，這邊拿源碼使用
import { createBrowserHistory } from "./history.ts";

export function BrowserRouter({ children }) {
  const historyRef = useRef();

  // 避免每次都重新創造
  if (!historyRef.current) {
    historyRef.current = createBrowserHistory({ window, v5Compat: true });
  }
  // location 變更就表示要重新渲染
  const [state, setState] = useState({ location: historyRef.current.location });

  // 執行的時機是 DOM 變更後立刻執行，
  // 如果是 useEffect 延後執行，會先行渲染到畫面上
  useLayoutEffect(() => {
    historyRef.current.listen((p) => {
      setState(p);
    }); // 會監聽變化，回傳新的 location，去做 setState
  }, []);

  return (
    <Router navigator={historyRef.current} location={state.location}>
      {children}
    </Router>
  );
}
```

這樣就完成路由渲染了！

### 動態路由 matchRoutes，修改 map 錯誤，實現 useParams

現在打開來看會報關於 map key 錯誤，原因是 `useRoutes` 當中有 map children ，卻沒有用到 key。
但其實這樣寫也不太好，因為他們實際上是嵌套的，所以用 reduce 堆疊組成一個 dom 結構才是對的。
這時候要重新處理 routes 參數。
使用源碼當中的 `matchRoutes` ，專門處理 flat 拍平，
回傳拍平後的結構

```js
// http://localhost:3000/product/123詳情頁
[
  {
    params: { id: "123詳情頁" },
    pathname: "/",
    pathnameBase: "/",
    route:{
      children:(2) [{…}, {…}], // Home, Product
      element:{…}, // Layout
      path:"/"
    },
  },
  {
    params: { id: "123詳情頁" },
    pathname: "/product",
    pathnameBase: "/product",
    route:{
      children:(1) [{…}], // ProductDetail
      element:{…}, // Product
      path:"/product"
    },
  },
  {
    params: { id: "123詳情頁" },
    pathname: "/product/123詳情頁",
    pathnameBase: "/product/123詳情頁",
    route:{
      element:{…}, // ProductDetail
      path:"/product/123詳情頁"
    },
  },
];
```

這邊就不實現 `matchRoutes` ，只要知道他是如何拍平的就好。
最後拿到新的拍平後的結構，實現 `renderMatches` 取代原先 map 處理，要做出這樣的結構。

```tsx
<Layout>
  <RouteContext.Provider>
    <Product>
      <RouteContext.Provider>
        <ProductDetail />
      </RouteContext.Provider>
    </Product>
  </RouteContext.Provider>
</Layout>
```

```js
function renderMatches(matches) {
  if (matches === null) return null;
  // 從內部開始做 reduce
  // matches 也處理過 params，把它傳下去，提供給 useParams 使用
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
```

就可以實現不報錯誤的動態路由了。

```tsx
<Router>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/product" element={<Product />}>
        <Route path=":id" element={<ProductDetail />} />
      </Route>
    </Route>
  </Routes>
</Router>;

// src/pages/Product.tsx
import { Link, Outlet } from "../mini-react-router";

export default function Product() {
  return (
    <div>
      Product
      <Link to="/product/123詳情頁">123詳情頁</Link>
      <Outlet />
    </div>
  );
}

// src/pages/ProductDetail.tsx
import { useParams } from "../mini-react-router";

export default function ProductDetail() {
  const { id } = useParams();
  return <div>ProductDetail: {id}</div>;
}

// src/mini-react-router/hooks.jsx
export function useParams() {
  const { matches } = useContext(RouteContext);
  const lastMatch = matches.at(-1);
  return lastMatch ? lastMatch.params : {};
}
```

### 路由權限

要怎麼實現需要權限才能訪問的頁面呢？

先做一個假登入的物件，連接到 context (也可以用 redux，可以跨層級就好)

```js
// fakeAuth.js
export const fakeAuthProvider = {
  isAuthenticated: false,
  signIn(cb) {
    fakeAuthProvider.isAuthenticated = true;
    setTimeout(cb, 100);
  },
  signOut(cb) {
    fakeAuthProvider.isAuthenticated = false;
    setTimeout(cb, 100);
  },
};

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const signIn = (newUser, cb) => {
    setUser(newUser);
    cb();
  };

  const signOut = (cb) => {
    setUser(null);
    cb();
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

接著改變原來的 UI

```jsx
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />}>
                <Route path=":id" element={<ProductDetail />} />
              </Route>
              <Route
                path="/user"
                element={
                  <NeedAuth>
                    <User />
                  </NeedAuth>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}
```

預計做出 `User` `NeedAuth` `NoMatch` `Login` 組件

```jsx
function User() {
  const auth = useAuth();
  const navigator = useNavigate();
  console.log("auth", auth);
  return (
    <div>
      <h1>User: {auth.user?.username}</h1>
      <button
        onClick={() => {
          auth.signOut(() => {
            navigator("/login", { replace: true });
          });
        }}
      >
        logout
      </button>
    </div>
  );
}

function NeedAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  if (!auth.user?.username) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  return (
    <div>
      <h1>需要權限</h1>
      {children}
    </div>
  );
}

function NoMatch() {
  return (
    <div>
      <h1>NoMatch</h1>
    </div>
  );
}

function Login() {
  const auth = useAuth();
  const navigator = useNavigate();
  const from = useLocation().state?.from.pathname || "/";
  const submit = (e) => {
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    auth.signIn({ username }, () => navigator(from, { replace: true }));
  };

  if (auth.user?.username) {
    return <Navigate to={from} />;
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input type="text" name="username" />
        <button type="submit">login</button>
      </form>
    </div>
  );
}
```

這樣就可以實現路由跳轉前，增加權限頁面阻擋

### 實現 Navigate & useNavigate

```jsx
// src/mini-react-router/Navigate.jsx
import { useEffect } from "react";
import { useNavigate } from "./hooks";

export function Navigate({ state, to, replace }) {
  const navigate = useNavigate();

  // 副作用
  useEffect(() => {
    navigate(to, { state, replace });
  }, [state, to, replace, navigate]);

  return null;
}

// src/mini-react-router/hooks.jsx
export function useNavigate() {
  // 只關心跳轉，但要知道現在是 BrowserRouter || HashRouter ，才知道可不可以用 history
  const { navigator } = useContext(NavigationContext);
  const navigate = useCallback(
    (to, options) => {
      if (typeof to === "number") {
        navigator.go(to); // ex: -1
        return;
      }
      (options.replace ? navigator.replace : navigator.push)(to, options.state);
    },
    [navigator]
  );
  return navigate;
}
```

### 實現 NavLink

沒有實現在每個 props 上傳遞 `({ isActive, isPending, isTransitioning })=>{...}`，只是知道他在內部主要做了什麼。

```tsx
// to: 可以放相對或是絕對路徑
export function NavLink({ to, children, ...rest }) {
  // 得到完整路徑名 放入 match 比對資料
  const resoved = useResolvedPath(to);
  // 解析路徑名稱，看是否有對應的路由
  // 源碼中 調用了 matchPath 來實現
  const match = useMatch({
    path: resoved.pathname,
    end: true, // 是否匹配完整的路徑
  });
  console.log("matchmatch", match, to);
  console.log("resovedresoved", resoved);
  return (
    <Link
      to={to}
      {...rest}
      style={{
        // 沒有匹配到是 null
        color: match ? "red" : "black",
      }}
    >
      {children}
    </Link>
  );
}
```

## 總結

1. 通過 `<BrowserRouter>` 包裹了 『`<HashRouter>` 也可以使用的 `<Router>`』，通過`useLayoutEffect` 監聽歷史紀錄的變化，觸發整顆樹重新渲染！
2. `<Router>` 其實就是 context，放入 history 和 location，`useNavigate` `useLocation` `useParams` 都是拿 context 的值，所以使用都會跟著渲染。
3. `<Routes>` 處理了所有的子節點，做成一種 routes 的數據結構，處理嵌套，包含 `<Outlet>` 的使用，也是 reduce 包 Context，層層包裹後，拿到寄存的子節點。
4. 關於路由權限，在頂層使用 Context 包裹，放入需要權限的全局狀態，包含登入登出，再需要權限的頁面上層放入 `<Navigate>` ，判斷是否有權限，否則進行跳轉。
