import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { SyncLoader } from 'react-spinners';
import { loginApi } from '../api/userApi';
import { useDispatch } from 'react-redux';
import { userLogin } from '../Redux/userSlice';

const loginSchema = z.object({
  email: z.string().trim().email("Invalid email. Please enter a valid email address."),
  password: z.string()
    .trim() 
    .min(1, "Password cannot be empty.") 
    .refine((password) => password.length > 0, {
      message: "Password cannot be only spaces.",
    })
});

type ILogin = z.infer<typeof loginSchema>;

const Login: React.FC = () => {

  const [loading,setLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { register, setError, handleSubmit, formState: { errors } } = useForm<ILogin>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: ILogin) => {
    try {
      setLoading(true)
      const formData = { email: data.email, password: data.password }
      const response = await loginApi(formData)
      if (response?.data.status) {
        setLoading(false)
        dispatch(userLogin(response.data.data))
        navigate("/")
      }
    } catch (error: any) {
      setLoading(false)
      if (!error.response.data.status) {
        const errorMessages = error.response.data.message
        for (const [field, message] of Object.entries(errorMessages)) {
          setError(field as keyof ILogin, {
            type: 'manual',
            message: message as any
          });
        }

      }
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900'>
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              {...register("email")}
            />
            {errors.email && <p className="text-red-400 mt-1">{errors.email.message}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              {...register("password")}
            />
            {errors.password && <p className="text-red-400 mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-white text-gray-900 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition duration-300"
          >
            {loading ? <SyncLoader speedMultiplier={1} color='#ffffff' margin={1} size={5} /> : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300">
          Don't have an account? <Link to={"/register"} className="text-white hover:underline">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;