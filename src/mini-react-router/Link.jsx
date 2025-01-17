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
