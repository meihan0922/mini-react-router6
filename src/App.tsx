import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
// import { BrowserRouter as Router, Routes, Route } from "./mini-react-router";
// import { useLocation } from "./mini-react-router/hooks";
import Home from "./pages/Home";
import Product from "./pages/Product";
import Layout from "./pages/Layout";
import ProductDetail from "./pages/ProductDetail";
import { AuthProvider, useAuth } from "./fakeAuth";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/product" element={<Product />}>
                <Route path=":id" element={<ProductDetail />} />
              </Route>
              <Route
                path="/user"
                element={
                  <NeedAuth>
                    <User />
                  </NeedAuth>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NoMatch />} />
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

function NeedAuth({ children }) {
  const auth = useAuth();
  const location = useLocation();
  if (!auth.user?.username) {
    return <Navigate to="/login" state={{ from: location }} replace={true} />;
  }

  return (
    <div>
      <h1>需要權限</h1>
      {children}
    </div>
  );
}

function User() {
  const auth = useAuth();
  const navigator = useNavigate();
  console.log("auth", auth);
  return (
    <div>
      <h1>User: {auth.user?.username}</h1>
      <button
        onClick={() => {
          auth.signOut(() => {
            navigator("/login", { replace: true });
          });
        }}
      >
        logout
      </button>
    </div>
  );
}
function Login() {
  const auth = useAuth();
  const navigator = useNavigate();
  const from = useLocation().state?.from.pathname || "/";
  const submit = (e) => {
    const formData = new FormData(e.currentTarget);
    const username = formData.get("username");
    auth.signIn({ username }, () => navigator(from, { replace: true }));
  };

  if (auth.user?.username) {
    return <Navigate to={from} />;
  }
  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input type="text" name="username" />
        <button type="submit">login</button>
      </form>
    </div>
  );
}
function NoMatch() {
  return (
    <div>
      <h1>NoMatch</h1>
    </div>
  );
}

export default App;
