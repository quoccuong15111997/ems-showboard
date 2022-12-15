import React from 'react'
import {MdOutlineCancel} from "react-icons/md";
import {BsCheck} from "react-icons/bs";
import { useStateContext } from '../contexts/ContextProvider';

export default function ThemeSettings() {
  const {setColor, setMode,currentMode,currentColor, setThemeSettings} = useStateContext()
  return (
    <div>ThemeSettings</div>
  )
}
