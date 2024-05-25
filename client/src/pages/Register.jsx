import { useState } from "react";
import { Link } from "react-router-dom";


export default function RegisterPage() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [umur, setUmur] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");


  const handleSubmit = async (e) => {
    e.preventDefault();


    const data = {
      fullname: fullname,
      email: email,
      password: password,
      umur: umur,
      role: role,
    };


    try {
      const response = await fetch("http://localhost:3000/daftar", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      });


      if (response.ok) {
      
        alert("Registrasi berhasil! Harap cek email untuk link verifikasi.");
      } else {
        const responseData = await response.json();
        setError(responseData.msg || "Registrasi gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  };


  const handleSendVerificationEmail = async () => {
    try {
      const response = await fetch("http://localhost:3000/send-verification-email", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ email: email }), 
      });


      if (response.ok) {
        alert("Email verifikasi berhasil dikirim!");
      } else {
        const responseData = await response.json();
        setError(responseData.msg || "Gagal mengirim email verifikasi.");
      }
    } catch (error) {
      console.error(error);
      setError("Terjadi kesalahan. Silakan coba lagi.");
    }
  };


  return (
    <div>
      <div className="flex flex-col items-center justify-center w-screen h-screen gap-4 ">
        <h1 className="text-xl font-bold">Register</h1>
        <form
          className="flex flex-col items-center p-5 border rounded-md shadow w-max"
          onSubmit={handleSubmit}
        >
          <div className="flex flex-col gap-2">
            <label>Full Name</label>
            <input
              className="border"
              type="text"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Email</label>
            <input
              className="border"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Password</label>
            <input
              className="border"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Umur</label>
            <input
              className="border"
              type="number"
              value={umur}
              onChange={(e) => setUmur(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label>Role</label>
            <input
              className="border"
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <input
            type="submit"
            value="Register"
            className="px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded hover:bg-blue-700"
          />
          {error && <div className="text-red-500">{error}</div>}
        </form>


        {/* Tombol Verifikasi Email */}
        <button
          onClick={handleSendVerificationEmail}
          className="px-4 py-2 mt-4 font-bold text-white bg-green-500 rounded hover:bg-green-700"
        >
          Verifikasi Email
        </button>


        <div className="text-center">
          Sudah memiliki akun?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}


