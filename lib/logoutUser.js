const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("token");
  
    // Optionally, redirect the user to the login page
    window.location.href = "/login"; // or use `router.push('/login')` if you are using Next.js router
  };

export default handleLogout;
  