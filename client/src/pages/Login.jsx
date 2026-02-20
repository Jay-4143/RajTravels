import { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Added Link
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // Use context

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await login(formData.email, formData.password);

    if (result.success) {
      navigate("/"); // Redirect to home or previous page
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4 text-center">{error}</div>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border p-3 mb-4 rounded"
          onChange={handleChange}
          required
        />

        <button className="w-full bg-red-500 text-white py-3 rounded hover:bg-red-600 transition-colors">
          Login
        </button>

        <div className="mt-4 text-center text-sm">
          <Link to="/forgot-password" class="text-blue-500 hover:underline">Forgot Password?</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
