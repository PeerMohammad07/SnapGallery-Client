import { useEffect } from "react"
import GalleryHome from "./GalleryHome"
import { useSelector } from "react-redux"
import { rootState } from "../Redux/store"
import { useNavigate } from "react-router-dom"

const Home = () => {
  const userData = useSelector((prevState:rootState)=> prevState.user.userData)
  const navigate = useNavigate()
  useEffect(()=>{
    if(!userData){
      navigate('/login')
    }
  },[userData])

  return (
    <div>
      <GalleryHome/>
    </div>
  )
}

export default Home
