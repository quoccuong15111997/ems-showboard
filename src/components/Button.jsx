import React from 'react'

export default function Button({color,bgColor,size,text,borderRadius}) {
  return (
    <button
    type={'button'}
    style={{backgroundColor:bgColor,color:color,borderRadius:borderRadius}}
    className={`text-${size} p-3 hover:drop-shadow-xl`}
>
    {text}
</button>
  )
}
