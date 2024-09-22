import { ReactNode, useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { rootState } from "../Redux/store"

interface ProtectLoginProps {
  children: ReactNode
}

const PrivateRoutes: React.FC<ProtectLoginProps> = ({ children }) => {
  const status = useSelector((prevState: rootState) => prevState.user.userData)
  const navigate = useNavigate()


  useEffect(() => {
    if (status) {
      navigate('/')
    }
  }, [status, navigate])

  return <>{!status && children}</>
}

export default PrivateRoutes