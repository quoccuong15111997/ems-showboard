import React from 'react'
import { useEffect } from 'react';
import { useStateContext } from '../contexts/ContextProvider';

export default function Logout() {
    const { clearLogin} = useStateContext()
    useEffect(() => {
         clearLogin()
        window.location.href = '/';
    }, []);
  return (
    <div></div>
  )
}
