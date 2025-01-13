"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const Wrapper = (props) => {
    const router = useRouter();
    
    useEffect(() => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login"); // Redirect to login if no token
      }
    }, []);
    
    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;
