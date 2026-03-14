"use client";

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <div className="bg-white p-10 rounded-xl shadow-lg w-[420px] text-center">

        <h1 className="text-3xl font-bold mb-2">
          Welcome to Tripeloo
        </h1>

        <p className="text-gray-500 mb-6">
          Login to continue your travel journey
        </p>

        <div className="space-y-5">

          <div>
            <label className="block font-semibold mb-1">
              Username
            </label>

            <input
              type="text"
              placeholder="Enter username"
              className="w-full border rounded-lg p-3 text-center"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter email"
              className="w-full border rounded-lg p-3 text-center"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              Password
            </label>

            <input
              type="password"
              placeholder="Enter password"
              className="w-full border rounded-lg p-3 text-center"
            />
          </div>

          <button className="w-full bg-blue-600 text-white p-3 rounded-lg">
            Login
          </button>

        </div>

      </div>

    </div>
  );
}