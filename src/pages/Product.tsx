import { Link, Outlet } from "../mini-react-router";
// import { Link, Outlet } from "react-router-dom";

export default function Product() {
  return (
    <div>
      Product
      <Link to="/product/123詳情頁">123詳情頁</Link>
      <Outlet />
    </div>
  );
}
