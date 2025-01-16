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
// src/mini-react-router/BrowserRouter.js
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

// src/mini-react-router/Route.js
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
// src/mini-react-router/Link.js
import { useNavigator } from "./hooks";

export function Link({ to, children }) {
  // TODO: useNavigator 結合 history 拿到 push 方法
  const navigate = useNavigator();
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

在寫 `useNavigator` 拿 history 之前，要先思考，BrowserRouter 和 HashRouter 都是根組件，實現原理不同。我們要拿到的是 Browser 的 history！

回到 `src/mini-react-router/BrowserRouter.js`

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
  // 用 context 傳遞 history
  return <Router navigator={historyRef.current}>{children}</Router>;
}
```

> src/mini-react-router/Context.js

```ts
import { createContext } from "react";

const NavigationContext = createContext();

export { NavigationContext };
```

> src/mini-react-router/Router.js

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
export function useNavigator() {
  // 只關心跳轉，但要知道現在是 BrowserRouter || HashRouter ，才知道可不可以用 history
  const navigator = useContext(NavigationContext);
  return navigator.push;
}
```

這個時候，`Link` 就可以透過 `useNavigator` 拿到 history 了

```tsx
import { useNavigator } from "./hooks";

export function Link({ to, children }) {
  const navigate = useNavigator();
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
