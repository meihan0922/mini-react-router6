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
