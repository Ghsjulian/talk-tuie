import React from 'react'
import {Navigate,useNavigate} from "react-router-dom"
import {useAuth} from "../context/Auth"



const UserAuth = ({children}) => {
  const {isLogin,user} = useAuth()
  return (<>
    {isLogin ? children : <Navigate to="/login" />}
 </> )
}

export default UserAuth