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
