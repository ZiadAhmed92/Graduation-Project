import { createContext, useState, useEffect } from "react";
import {jwtDecode} from 'jwt-decode';
import { Navigate } from "react-router-dom";
export let speechContext = createContext(0);

export default function SpeechContextProvider(props) {
  // let { userData, dataUser,logOut } = useContext(speechContext);
  const [userData, setUserdata] = useState(null)
  function logOut() {
    localStorage.removeItem('Token');
    setUserdata(null) 
    return <Navigate to='/login' />
  }
  function dataUser() {
    let token = localStorage.getItem('Token');
    let userData = jwtDecode(token);
    setUserdata(userData)

  }
  useEffect(() => {
    if(localStorage.getItem('Token')) return dataUser()
  }, [])

  return (
    <speechContext.Provider
      value={{
        logOut,
        dataUser,
        userData
      }}
    >
      {props.children}
    </speechContext.Provider>
  );
}
