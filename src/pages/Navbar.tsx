import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { rootState } from '../Redux/store';
import { FiLock, FiLogOut, FiPlus } from 'react-icons/fi';
import { logoutApi, resetPasswordApi } from '../api/userApi';
import { userLogout } from '../Redux/userSlice';
import ChangePasswordModal from './ChangePassword';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ImageUploadModalUI from './AddImage';

const Navbar: React.FC = () => {
  const user = useSelector((prevState: rootState) => prevState.user.userData);
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isAddImageModalOpen, setIsAddImageModalOpen] = useState(false)

  const logout = async () => {
    try {
      dispatch(userLogout());
      await logoutApi();
    } catch (error) {
      console.log(error);
    }
  };

  const onUpload = (response:any)=>{
    try {
      if(response.data.status){
        toast.success(response.data.message)
      }else{
        toast.error(response.data.message)
      }
    } catch (error) {
      
    }
  }

  const onClose = ()=>{
    setIsAddImageModalOpen(false)
  }

  const handlePasswordChange = async (oldPassword: string, newPassword: string) => {
    try {
      if(!user){
        navigate('/login')
        return 
      }
      const response = await resetPasswordApi(user?._id,oldPassword,newPassword)
      if(response.data.status){
        toast.success(response.data.message)
        setIsPasswordModalOpen(false);
      }
    } catch (error:any) {
      if(!error.response.data.status){
        toast.error(error.response.data.message)
      }else{
        setIsPasswordModalOpen
      }
    }
  };

  return (
    <>
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-white">Welcome, {user?.name}</h1>
        </div>
        <div className="flex space-x-4">
          <button 
          onClick={()=> setIsAddImageModalOpen(true)}
          className="flex items-center px-3 py-2 bg-blue-600 rounded hover:bg-blue-700 transition duration-300 text-white">
            <FiPlus className="mr-2" /> Add Image
          </button>
          <button 
            onClick={() => setIsPasswordModalOpen(true)} 
            className="flex items-center px-3 py-2 bg-yellow-600 rounded hover:bg-yellow-700 transition duration-300 text-white"
          >
            <FiLock className="mr-2" /> Reset Password
          </button>
          <button 
            onClick={logout} 
            className="flex items-center px-3 py-2 bg-red-600 rounded hover:bg-red-700 transition duration-300 text-white"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </div>
      </header>

      <ChangePasswordModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />

      <ImageUploadModalUI 
        onClose={onClose}
        onUpload={onUpload}
        open={isAddImageModalOpen}
      />
    </>
  );
};

export default Navbar;