import Api from "../service/axios"
import userEndPoints from "../service/endPoints"

export const loginApi = async (data: any) => {
  try {
    return await Api.post(userEndPoints.login, { email: data.email, password: data.password })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const registerApi = async (data: any) => {
  try {
    return await Api.post(userEndPoints.register, { name: data.name, phone: data.phone, email: data.email, password: data.password })
  } catch (error) {
    return Promise.reject(error)
  }
}

export const logoutApi = async () => {
  try {
    return await Api.post(userEndPoints.logout)
  } catch (error) {
    return Promise.reject()
  }
}

export const resetPasswordApi = async (
  userId: string,
  oldPassword: string,
  newPassword: string
) => {
    return await Api.post(userEndPoints.resetPassword, {
      userId,
      oldPassword,
      newPassword
    })
}