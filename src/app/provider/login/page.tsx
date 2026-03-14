"use client";

export default function ProviderLogin() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-gray-100">

      <div className="bg-white shadow-xl rounded-2xl p-10 w-[420px]">

        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          Tripeloo
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Provider Login
        </p>

        <form className="flex flex-col gap-5">

          {/* Username */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Username
            </label>

            <div className="flex items-center border rounded-lg p-2">
              <span className="text-gray-400 px-2">👤</span>

              <input
                type="text"
                placeholder="Enter username"
                className="w-full outline-none p-1"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Email
            </label>

            <div className="flex items-center border rounded-lg p-2">
              <span className="text-gray-400 px-2">📧</span>

              <input
                type="email"
                placeholder="Enter email"
                className="w-full outline-none p-1"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Password
            </label>

            <div className="flex items-center border rounded-lg p-2">
              <span className="text-gray-400 px-2">🔒</span>

              <input
                type="password"
                placeholder="Enter password"
                className="w-full outline-none p-1"
              />
            </div>
          </div>

          <button className="bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition">
            Login
          </button>

        </form>

      </div>

    </div>
  );
}