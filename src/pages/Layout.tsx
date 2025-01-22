import { Link, Outlet } from "react-router-dom";
import { NavLink } from "../mini-react-router";

export default function Layout() {
  return (
    <div>
      Layout
      <NavLink to="/">Home</NavLink>
      <NavLink to="/product">Product</NavLink>
      <NavLink to="/user">User</NavLink>
      <NavLink to="/login">Login</NavLink>
      <Outlet />
    </div>
  );
}
