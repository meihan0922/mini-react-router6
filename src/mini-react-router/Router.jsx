import { useMemo } from "react";
import { NavigationContext } from "./Context";

// 可以給 HashRouter 和 BrowserRouter 共用
// navigator 就是 history
export function Router({ navigator, children, location }) {
  // 源碼當中，會把 navigator, location 拆開兩個 context 來放，這邊做簡化
  let navigationContext = useMemo(
    () => ({ navigator, location }),
    [navigator, location]
  );

  return (
    <NavigationContext.Provider value={navigationContext}>
      {children}
    </NavigationContext.Provider>
  );
}
