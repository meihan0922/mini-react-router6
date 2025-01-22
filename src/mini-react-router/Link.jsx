import { useResolvedPath, useMatch, Link } from "react-router-dom";
// import { useNavigate } from "./hooks";

// export function Link({ to, children, ...rest }) {
//   const navigate = useNavigate();
//   const handler = (e) => {
//     e.preventDefault();
//     navigate(to);
//   };

//   return (
//     <a href={to} onClick={handler} {...rest}>
//       {children}
//     </a>
//   );
// }

// to: 可以放相對或是絕對路徑
export function NavLink({ to, children, ...rest }) {
  // 得到完整路徑名 放入 match 比對資料
  const resoved = useResolvedPath(to);
  // 解析路徑名稱，看是否有對應的路由
  const match = useMatch({
    path: resoved.pathname,
    end: true, // 是否匹配完整的路徑
  });
  console.log("matchmatch", match, to);
  console.log("resovedresoved", resoved);
  return (
    <Link
      to={to}
      {...rest}
      style={{
        // 沒有匹配到是 null
        color: match ? "red" : "black",
      }}
    >
      {children}
    </Link>
  );
}
