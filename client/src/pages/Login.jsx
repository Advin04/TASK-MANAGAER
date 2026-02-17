import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/Slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { Button, Input } from "@material-tailwind/react";
import { useState } from "react";
import { Eye, EyeClosed, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const onSubmit = (userData) => {
    setIsLoading(true);
    dispatch(loginUser(userData)).then((data) => {
      console.log("LOGIN RESPONSE:", data); // DEBUG LOG
      setIsLoading(false);
      if (data?.payload?.success) {
        toast.success(data?.payload?.message);
        console.log("Navigating to:", `/${data.payload.user.role}/dashboard`); // DEBUG LOG
        navigate(`/${data.payload.user.role}/dashboard`);
      } else {
        console.error("Login failed:", data?.payload?.message); // DEBUG LOG
        toast.error(data?.payload?.message);
      }
    });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <form
        id="login-form"
        onSubmit={handleSubmit(onSubmit)}
        className="glass-card p-8 rounded-2xl w-full"
      >
        <div className="flex flex-col gap-6 text-[#5E5E5E] dark:text-gray-300">
          <div className="text-center mb-2">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-primary">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="w-full space-y-4">
            <div>
              <Input
                id="login-email"
                size="lg"
                label="Email Address"
                {...register("email")}
                type="email"
                required
                className="!border-gray-300 dark:!border-gray-600 focus:!border-primary-500"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0"
                }}
              />
            </div>

            <div className="relative">
              <Input
                id="login-password"
                size="lg"
                label="Password"
                {...register("password")}
                type={passwordVisible ? "text" : "password"}
                required
                className="!border-gray-300 dark:!border-gray-600 focus:!border-primary-500"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
                containerProps={{
                  className: "min-w-0"
                }}
                icon={
                  <div onClick={togglePasswordVisibility} className="cursor-pointer">
                    {passwordVisible ?
                      <EyeClosed className="w-5 h-5 text-gray-500 hover:text-primary-500 transition-colors" /> :
                      <Eye className="w-5 h-5 text-gray-500 hover:text-primary-500 transition-colors" />
                    }
                  </div>
                }
              />
            </div>
          </div>

          <Button
            id="login-submit"
            type="submit"
            fullWidth
            className="btn-primary flex items-center justify-center gap-2 py-3 text-base capitalize"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Login <LogIn size={18} />
              </>
            )}
          </Button>

          <div className="text-center mt-2">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <Link
                className="font-semibold text-primary-500 hover:text-primary-600 hover:underline transition-colors"
                to="/auth/register"
              >
                Register here
              </Link>
            </p>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default Login;
