import Api from "../service/axios"
import { imageEndPoints } from "../service/endPoints"

export const uploadImages = async (formData:FormData)=>{
  try {
    return await Api.post(imageEndPoints.uploadImages,formData,{
      headers:{
        'Content-Type': 'multipart/form-data',
      }
    })
  } catch (error) {
    return Promise.reject()
  }
}

export const getAllImages = async (userId:string)=>{
  try {
    return await Api.get(`${imageEndPoints.getAllImages}?userId=${userId}`)
  } catch (error) {
    return Promise.reject()
  }
}

export const deleteImage = async (imageId:string,userId:string)=>{
  try {
    return await Api.delete(`${imageEndPoints.deleteImage}/${imageId}/${userId}`)
  } catch (error) {
    return Promise.reject()
  }
}

export const editImage = async (data:any)=>{
  try {
    return Api.put(`${imageEndPoints.editImage}`,data,{
      headers : {
        'Content-Type' : "multipart/form-data"
      }
    })
  } catch (error) {
    return Promise.reject()
  }
}

export const imageOrderChange = async (updatedImages:any)=>{
  try {
    return Api.post(imageEndPoints.changeImageOrder,{updatedImages})
  } catch (error) {
    return Promise.reject()
  }
}