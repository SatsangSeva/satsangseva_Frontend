// import React, { useState } from "react";
// import '../Csss/AdminLogin.css'
// const AdminLogin = ({ setAdmin }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // Static admin credentials for simplicity
//     // const adminEmail = process.env.REACT_APP_ADMIN;
//     // const adminPassword = process.env.REACT_APP_ADMIN_KEY;

//     // if (email === adminEmail && password === adminPassword) {
//     //   alert('Login Successful')
//     //   setAdmin(adminPassword);
//     //   // navigate("/admin/adminpage"); // Redirect to the admin dashboard
//     // } else {
//     //   alert("Invalid credentials!");
//     // }
//   };

//   return (
//     <div className="admin-login-container">
//       <form className="admin-login-form" onSubmit={handleLogin}>
//         <h2 className="text-center"><span className="text-tomato"> Admin </span>Login</h2>
//         <div>
//           <label className="form-label" htmlFor="email">Email:</label>
//           <input
//             className="form-control"
//             id="email"
//             type="email"
//             placeholder="Admin Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//             autoComplete="username"
//           />
//         </div>
//         <div>
//           <label className="form-label" htmlFor="password">Password:</label>
//           <input
//             className="form-control"
//             id="password"
//             type="password"
//             placeholder="Admin Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//             autoComplete="current-password"
//           />
//         </div>
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// };

// export default AdminLogin;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../Csss/AdminLogin.css';

const AdminLogin = ({ setAdmin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const url = process.env.REACT_APP_BACKEND;
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make the POST request to your backend login endpoint
      const { data } = await axios.post(url + "admin/login", { email, password });

      // Store token and admin details (password is removed on the server)
      localStorage.setItem("token", data.token);
      localStorage.setItem("admin", JSON.stringify(data.admin));

      // Update state and navigate to the admin dashboard
      setAdmin(data.admin);
      alert("Logged in !!")
      navigate("/admin/dashboard");
    } catch (err) {

      if (err.response && err.response.data && err.response.data.message) {
        alert(err.response.data.message)

      } else {
        alert("Something went wrong. Please try again later.")
      }
    }
  };


  useEffect(() => {
    const adminToken = localStorage.getItem("token");
    const admin = JSON.parse(localStorage.getItem("admin"));

    if (adminToken && admin && admin?.designation === "admin") {
      navigate("/admin/dashboard")
    }

  }, [])

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2 className="text-center">
          <span className="text-tomato"> Admin </span>Login
        </h2>
        <div>
          <label className="form-label" htmlFor="email">
            Email:
          </label>
          <input
            className="form-control"
            id="email"
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="username"
          />
        </div>
        <div>
          <label className="form-label" htmlFor="password">
            Password:
          </label>
          <input
            className="form-control"
            id="password"
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default AdminLogin;
