import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 
import Navbar from "../components/Navbar";

export default function Dashboard() {
  const [cookies] = useCookies(["TOKEN"]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (cookies.TOKEN) {
      const decodedToken = jwtDecode(cookies.TOKEN);
      setUser(decodedToken); 
    }
  }, [cookies.TOKEN]);

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div style={{ backgroundColor: "#9DC88D" }} className="min-h-screen">
      <Navbar user={user} onLogout={handleLogout} />
      <section className="mx-auto mt-4 ml-6">
        <h1 className="text-2xl font-bold">Website ShineSkins</h1>
        <table className="mt-4 border-collapse border border-pink-500">
          <thead>
            <tr>
              <th className="border border-pink-500 px-4 py-2">Fullname</th>
              <th className="border border-pink-500 px-4 py-2">Email</th>
              <th className="border border-pink-500 px-4 py-2">Age</th>
              <th className="border border-pink-500 px-4 py-2">Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-pink-500 px-4 py-2">{user && user.fullname}</td>
              <td className="border border-pink-500 px-4 py-2">{user && user.email}</td>
              <td className="border border-pink-500 px-4 py-2">{user && user.umur}</td>
              <td className="border border-pink-500 px-4 py-2">{user && user.role}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  );
}
