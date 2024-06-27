import React, {useState} from 'react';
export const SETTINGS_CONTEXT = React.createContext({})

export default function SETTINGS_CONTEXT_PROVIDER({children}: any){
  const [dark, setDark] = useState("dark")

  return (
    <SETTINGS_CONTEXT.Provider value={{dark, setDark}}>
      {children}
    </SETTINGS_CONTEXT.Provider>
  )
}