import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import * as z from "zod"
import { registerApi } from '../api/userApi';
import { SyncLoader } from 'react-spinners';

const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, "Username must not be less than 3 characters")
      .max(25, "Username must not be greater than 25 characters")
      .regex(/^[a-zA-Z0-9_ ]+$/, "The username must contain only letters, numbers, spaces, and underscores (_)"),
    email: z
      .string()
      .trim()
      .email("Invalid email. Email must be a valid email address"),
    phone: z
      .string()
      .length(10, "Phone number must be exactly 10 digits")
      .regex(/^[0-9]+$/, "Phone number must contain only digits")
      .refine((value) => !/^(\d)\1{9}$/.test(value), {
        message: "Phone number cannot consist of the same digit",
      }),
    password: z
      .string()
      .trim()
      .min(8, "Password must be at least 8 characters")
      .regex(/(?=.*[a-z])/, "Password must contain at least one lowercase letter")
      .regex(/(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
      .regex(/(?=.*[0-9])/, "Password must contain at least one number")
      .regex(/(?=.*[!@#$%^&*])/, "Password must contain at least one special character"),
    confirmPassword: z
      .string()
      .trim()
      .min(1, "Please confirm your password")
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type IRegisterSchema = z.infer<typeof registerSchema>

const Register: React.FC = () => {

  const [loading,setLoading] = useState(false)
  const navigate = useNavigate()


  const { formState: { errors },setError,  handleSubmit, register } = useForm<IRegisterSchema>({
    resolver: zodResolver(registerSchema)
  });


  const onSubmit = async (data: IRegisterSchema) => {
    try {
      setLoading(true)
      const formData = {name:data.name,phone:data.phone,email:data.email,password:data.password}
      const response = await registerApi(formData)
      if(response?.data.status){
        setLoading(false)
        navigate("/login")
      }
    } catch (error:any) {
      setLoading(false)
      if(!error.response.data.status){
        const errorMessages = error.response.data.message 
        for (const [field, message] of Object.entries(errorMessages)) {
          setError(field as keyof IRegisterSchema, {
            type: 'manual',
            message : message as any
          });
        }

      }
    }
  };

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-900'>
      <div className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Signup</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your name"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              {...register("name")}
            />
            {errors.name && <p className="text-red-400 mt-1">{errors.name.message}</p>}
          </div>
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
              type="tel"
              placeholder="Enter your phone number"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              {...register("phone")}
            />
            {errors.phone && <p className="text-red-400 mt-1">{errors.phone.message}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Create a password"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              {...register("password")}
            />
            {errors.password && <p className="text-red-400 mt-1">{errors.password.message}</p>}
          </div>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Confirm your password"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && <p className="text-red-400 mt-1">{errors.confirmPassword.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-white text-gray-900 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 transition duration-300"
          >
            {loading ? <SyncLoader speedMultiplier={1} color='#ffffff' margin={1} size={5} /> :"Signup"}
          </button>
        </form>
        <p className="mt-4 text-center text-gray-300">
          Already have an account? <Link to={"/login"} className="text-white hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;