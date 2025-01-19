import { Link, Outlet } from "../mini-react-router";

export default function Product() {
  return (
    <div>
      Product
      <Link to="/product/123詳情頁">123詳情頁</Link>
      <Outlet />
    </div>
  );
}
