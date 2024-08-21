import React from "react";

const Login = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="w-full max-w-md p-8 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <a
          href="#"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img
            className="w-8 h-8 mr-2"
            src="https://cdn.icon-icons.com/icons2/2699/PNG/512/siemens_logo_icon_170741.png"
            alt="logo"
          />
          Asset management
        </a>
        <div className="space-y-6">
          <h6 className="text-2xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white hover:border-b-2">
            Contact to aseet administrator
          </h6>
        </div>
      </section>
    </main>
  );
};

export default Login;
