import React from 'react'
import {Navigate,useNavigate} from "react-router-dom"
import {useAuth} from "../context/Auth"



const LoginAuth = ({children}) => {
  const {isLogin,user} = useAuth()
  return (<>
    {!isLogin ? children : <Navigate to="/" />}
 </> )
}

export default LoginAuth