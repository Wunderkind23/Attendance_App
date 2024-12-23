 // UserContext.js
 import React, { createContext, useEffect, useState } from 'react';

 export const UserContext = createContext();
 
    const storedToken =  JSON.parse(localStorage.getItem('token'))

  export const UserProvider = ({ children }) => {
   const [user, setUser] = useState({ name: '',email:'',});
   const [authToken, setAuthToken] = useState(()=>{
    return storedToken ? storedToken : null
   })

    const logout = () => {
    setUser(null); // Clear user data from context
    localStorage.removeItem("authToken"); // Optional: Clear token from storage
    
};
   

  
    useEffect(()=>{
      // console.log('testing')
        if(storedToken){
          // console.log(storedToken)
          setAuthToken(storedToken)
        }

    },[storedToken])
    // console.log(authToken)
   return (
     <UserContext.Provider value={{ user, setUser, logout, authToken, setAuthToken }}>
       {children}
     </UserContext.Provider>
   );
 };