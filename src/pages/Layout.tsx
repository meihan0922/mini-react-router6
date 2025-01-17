// import { Link, Outlet } from "react-router-dom";
import { Link, Outlet } from "../mini-react-router";

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
