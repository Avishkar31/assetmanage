// 'use client'
// import { useRouter } from "next/router";
// import Link from "next/link";

// const LoginPage = () => {
//   const router = useRouter();

//   async function handleSubmit(event) {
//     event.preventDefault();

//     const formData = new FormData(event.currentTarget);
//     const email = formData.get("email");
//     const password = formData.get("password");

//     const response = await fetch("/api/auth/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ email, password })
//     });

//     if (response.ok) {
//       router.push("/profile");
//     } else {
//       // Handle errors
//     }
//   }

//   return (
//     <main className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
//       <section className="w-full max-w-md p-8 bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//         <Link href="#">
//           <a className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
//             <img
//               className="w-8 h-8 mr-2"
//               src="https://cdn.icon-icons.com/icons2/2699/PNG/512/siemens_logo_icon_170741.png"
//               alt="logo"
//             />
//             Asset management
//           </a>
//         </Link>
//         <div className="space-y-6">
//           <h6 className="text-2xl leading-tight tracking-tight text-gray-900 dark:text-white">
//             Sign in to your account
//           </h6>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label
//                 htmlFor="email"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Your email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 className="block w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 placeholder="name@company.com"
//                 required
//               />
//             </div>
//             <div>
//               <label
//                 htmlFor="password"
//                 className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//               >
//                 Password
//               </label>
//               <input
//                 type="password"
//                 name="password"
//                 id="password"
//                 className="block w-full p-2.5 border rounded-lg bg-gray-50 text-gray-900 border-gray-300 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//                 placeholder="••••••••"
//                 required
//               />
//             </div>
//             <div className="flex items-center justify-between">
//               <div className="flex items-start">
//                 <div className="flex items-center h-5">
//                   <input
//                     id="remember"
//                     aria-describedby="remember"
//                     type="checkbox"
//                     className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600"
//                   />
//                 </div>
//               </div>
//               <Link href="/forgot-password">
//                 <a className="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500">
//                   Forgot password?
//                 </a>
//               </Link>
//             </div>
//             <button
//               type="submit"
//               className="w-full py-2.5 px-5 text-sm font-medium text-white border border-1 bg-primary-600 rounded-lg focus:ring-4 focus:outline-none hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
//             >
//               Sign in
//             </button>
//             <p className="text-sm font-light text-gray-500 dark:text-gray-400">
//               Don’t have an account yet?{" "}
//               <Link href="/signup">
//                 <a className="font-medium text-primary-600 hover:underline dark:text-primary-500">
//                   Sign up
//                 </a>
//               </Link>
//             </p>
//           </form>
//         </div>
//       </section>
//     </main>
//   );
// };

// export default LoginPage;
