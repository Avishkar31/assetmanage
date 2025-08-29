"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiUser, FiLock, FiBriefcase, FiUserCheck } from "react-icons/fi";
import Link from "next/link";

export default function Signup() {
  const [siemensId, setSiemensId] = useState("");
  const [password, setPassword] = useState("");
  const [segment, setSegment] = useState("");
  const [role, setRole] = useState("regular");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is admin
    const checkAuthorization = () => {
      try {
        const user = localStorage.getItem('user');
        if (!user) {
          router.push('/login');
          return;
        }
        const userData = JSON.parse(user);
        if (userData.role?.toLowerCase() !== 'admin') {
          router.push('/stocks');
          return;
        }
        setIsAuthorized(true);
      } catch (e) {
        console.error('Authorization check failed:', e);
        router.push('/login');
      }
    };
    
    checkAuthorization();
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!siemensId || !password || !segment || !role) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ siemensId, password, segment, role })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      router.push("/login");
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  // Handler for the database check button
  const handleCheckDatabase = async () => {
    try {
      const response = await fetch("/api/auth/checkdb");
      if (!response.ok) throw new Error("Database check failed");
      const data = await response.json();
      alert(`Database status: ${data.status || "OK"}`);
    } catch (err) {
      alert("Database check failed");
    }
  };

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-red-500/10 p-8 rounded-lg text-center">
          <h2 className="text-2xl text-red-500 font-bold mb-4">Access Denied</h2>
          <p className="text-gray-300 mb-4">Only administrators can access this page.</p>
          <button
            onClick={() => router.push('/stocks')}
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Create Account</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Join the asset management platform</p>
              
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300">
                <p className="font-medium">Error</p>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="siemensId" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <FiUser className="mr-2" />
                  Siemens ID
                </label>
                <div className="relative">
                  <input
                    id="siemensId"
                    type="text"
                    placeholder="Enter your Siemens ID"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    value={siemensId}
                    onChange={(e) => setSiemensId(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                  <FiLock className="mr-2" />
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    placeholder="Create a secure password"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Password must be at least 6 characters</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="segment" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <FiBriefcase className="mr-2" />
                    Segment
                  </label>
                  <div className="relative">
                    <input
                      id="segment"
                      type="text"
                      placeholder="Your segment"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                      value={segment}
                      onChange={(e) => setSegment(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
                    <FiUserCheck className="mr-2" />
                    Role
                  </label>
                  <div className="relative">
                    <select
                      id="role"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors appearance-none"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                    >
                      <option value="regular">Regular User</option>
                      <option value="admin">Administrator</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-teal-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{" "}
                <Link href="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 px-8 py-4">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>

      {/* Floating button for database check */}
      <button
        onClick={handleCheckDatabase}
        className="fixed bottom-6 right-6 z-50 bg-teal-600 hover:bg-teal-700 text-white px-4 py-3 rounded-full shadow-lg transition-colors"
        title="Check Database"
        type="button"
      >
        Check Database
      </button>
    </div>
  );
}