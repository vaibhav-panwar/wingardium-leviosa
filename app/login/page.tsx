"use client";
import Image from "next/image";
import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { signInWithGoogle } from "@/firebase/auth";
import { ProtectedRoute } from "@/components/protectedRoutes";

export default function Login() {
  const router = useRouter();
  const handleLogin = async () => {
    try {
      await signInWithGoogle();
      router.push("/");
    } catch (error) {
      console.error(error);
      alert("Error logging in with Google");
    }
  };
  return (
    <ProtectedRoute>
      <div className="flex flex-row w-full h-screen justify-between">
        <div className="bg-black w-2/3 h-full flex flex-col justify-center items-center p-10">
          <div className="fixed top-5 left-10 z-[9999]">
            <Image src="/logo.svg" alt="logo" width={150} height={150} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <p className="text-white text-5xl">
              Grow Lead Generation and Qualification by 30% through AI-driven
              Whatsapp Chat Tools
            </p>
          </div>
        </div>
        <div className=" w-1/3 h-full lex flex-col justify-flex-start items-center p-10">
          <div className="flex flex-col justify-center items-center h-item-fit">
            <h2 className="text-3xl font-bold mb-8">Login</h2>
            <button
              onClick={handleLogin}
              className="flex mb-8 items-center px-6 py-3 bg-[#4285F4] hover:bg-[#357ae8] text-white rounded shadow-md transition-colors duration-200"
            >
              Login with Google
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
