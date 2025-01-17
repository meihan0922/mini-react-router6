import React, { useRef } from "react";
import { Router } from "./Router";
// 涉及兼容性，ie, chrome 不一樣，這邊拿源碼使用
import { createBrowserHistory } from "./history.ts";

export function BrowserRouter({ children }) {
  const historyRef = useRef();

  // 避免每次都重新創造
  if (!historyRef.current) {
    historyRef.current = createBrowserHistory();
  }

  return <Router navigator={historyRef.current}>{children}</Router>;
}
