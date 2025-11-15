import { Link } from "react-router-dom";

const Signup = () => {
  return (
    <div>
      {/* Title */}
      <h1 className="title-auth">
        Create your account
      </h1>

      {/* Subtitle */}
      <p className="subtitle-auth">
        Join the news platform
      </p>

      {/* Form */}
      <form className="form-section">

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Name
          </label>
          <input
            type="text"
            className="input-style"
          />
        </div>

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

        {/* Confirm Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
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
            Create Account
          </button>
        </div>

      </form>

      {/* Bottom Link */}
      <p className="bottom-link">
        Already have an account?{" "}
        <Link
          to="/login"
          className="font-medium text-gold-700 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Signup;
