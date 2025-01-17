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
