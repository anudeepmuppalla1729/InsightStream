import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div>
      {/* Title */}
      <h1 className="title-auth">
        Sign in to your account
      </h1>

      {/* Subtitle */}
      <p className="subtitle-auth">
        Continue to your news dashboard
      </p>

      {/* Form Section */}
      <form className="form-section">
        
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            className="input-style"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            className="input-style"
          />
        </div>

        {/* CTA */}
        <div className="mt-2">
          <button
          type="submit"
          className="btn-style"
        >
          Sign In
        </button>
        </div>

      </form>

      {/* Bottom Link */}
      <p className="bottom-link">
        Don’t have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-gold-700 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
