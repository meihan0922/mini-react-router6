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
