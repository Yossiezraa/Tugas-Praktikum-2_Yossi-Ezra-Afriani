import { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function LoginPage() {
  const [cookies, setCookie, removeCookie] = useCookies(["TOKEN"]);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://localhost:3000/login", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (response.ok) {
        setCookie("TOKEN", result.token, {
          path: "/",
          expires: new Date(Date.now() + 120000),
        });
        navigate("/homepage");
      } else {
        setError(result.msg);
      }
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  };

  const handleLogout = () => {
    removeCookie("TOKEN");
    navigate("/");
  };

  return (
    <div>
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4 ">
        <h1 className="text-xl font-bold">Login</h1>
        <form
          className="flex flex-col items-center p-5 border rounded-md shadow w-max"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              className="border"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Password</label>
            <input
              className="border"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <input
            type="submit"
            value="Login"
            className="px-4 py-2 mt-4 font-bold text-white bg-grey-500 rounded hover:bg-grey-700"
          />
          {error && <div className="text-red-500">{error}</div>}
        </form>
        <div className="mt-4">
          Belum punya akun?{" "}
          <Link to="/register" className="text-blue-500">
            Daftar
          </Link>
        </div>
      </div>
    </div>
  );
}
