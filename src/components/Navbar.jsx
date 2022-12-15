import React from 'react'
import { Link,NavLink } from 'react-router-dom'
import { useStateContext } from '../contexts/ContextProvider'
import { useState, useEffect, useCallback } from 'react';
import { AiOutlineMenu } from 'react-icons/ai'
import { RiNotification3Line } from 'react-icons/ri'
import { MdKeyboardArrowDown,MdExpandMore } from 'react-icons/md'
const NavButton = ({title,customFunc,icon,color,dotColor}) => (
  <div
      content={title}
      position={'BottomCenter'}>
      <button
          type="button"
          onClick={() => customFunc()}
          style={{ color }}
          className="relative text-xl rounded-full p-3 hover:bg-light-gray"
      >
          <span
              style={{background:dotColor}}
              className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"/>
              {icon}
      </button>
  </div>
)
export default function Navbar() {
  const {
    activeMenu,
    setActiveMenu,
    isClicked,
    setIsClicked,
    handleClick,
    screenSize,
    setScreenSize,
    currentColor,
    userInfo,
    locations,
    location,
    setLocation,
    setLocationSelected
  } = useStateContext()
  const [indexLocation, setIndexLocation] = useState(0);
  const [treeNode, setTreeNode] = useState([]);
  useEffect(() => {
    locations.map((item, index) => {
      if (item.LCTNCODE !== location) {
        setIndexLocation(index)
        return
      }
    })
  }, []);
  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false)
    } else {
      setActiveMenu(true)
    }
  }, [screenSize]);
  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth)
    window.addEventListener('resize', handleResize)
    handleResize();
    return () => window.removeEventListener('resize', handleResize)
  }, []);
  useEffect(() => {
    console.log("userInfo = " + userInfo)
    if (userInfo != undefined) {
      if (userInfo != null && userInfo != undefined && userInfo.RETNDATA != undefined) {
        console.log(userInfo)
        handleComList(userInfo.RETNDATA.COMPLIST)
      }
    }

  }, []);
  const onLocationChange = useCallback(
    (e) => {
      const lctCode = e.itemData.LCTNCODE
      if (location != lctCode) {
        setLocationSelected(lctCode)
      }
    },
    [],
  );
  function handleComList(comList) {
    const arrNode = [];
    comList.map((item)=>{
        let node = {
            nodeId: item.COMPCODE,
            nodeText:item.COMPNAME,
        }
        const nodesChild = [];
        if (item.LCTNLIST.length > 0){
            item.LCTNLIST.map((location)=>{
                let nodeChild = {
                    nodeId: item.COMPCODE +'|'+ location.LCTNCODE,
                    nodeText:location.LCTNNAME,

                }
                nodesChild.push(nodeChild)
                node.nodeChild = nodesChild
            })
        }
        arrNode.push(node)
    })
    setTreeNode(arrNode)
}
  return (
    <div className='flex justify-between p-2 relative bg-white shadow-xl'>
            <div className='flex items-center'>
                <NavButton
                    title={'Menu'}
                    customFunc={()=>setActiveMenu((prevActiveMenu)=>!prevActiveMenu)}
                    color={currentColor}
                    icon={<AiOutlineMenu/>}
                />
                <Link to='/'
                     >
                    <img
                        style={{width:'150px'}}
                        src={require('../data/logo_ems.png')}/>
                </Link>

            </div>

            <div className='flex items-center'>
               <div className='flex items-center'>
                  <div className='flex items-center' >
                    Danh sách chi nhánh
                  </div>
               </div>
                <div className='flex items-center'>
                    <NavButton
                        title={'Notification'}
                        customFunc={()=>handleClick('notification')}
                        color={currentColor}
                        icon={<RiNotification3Line/>}/>
                    <div>
                        <div
                            className={'flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg'}
                            onClick={()=>handleClick('userProfile')}
                        >
                            <img
                                className='rounded-full w-8 h-8'
                                src={require('../data/avatar.jpg')}/>
                            <p>
                                <span className='text-gray-400 text-14'>Xin chào, </span>
                                {' '}
                                <span className='text-gray-400 font-bold ml-1 text-14'>{userInfo.RETNDATA.USERLGIN.EMPLNAME}</span>
                            </p>
                            <MdKeyboardArrowDown className='text-gray-400 text-14'/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  )
}
