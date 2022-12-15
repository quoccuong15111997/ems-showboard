import {createContext, useContext, useEffect, useState} from 'react'

const StateContext = createContext()

export const ContextProvider = ({ children }) =>{
    const [activeMenu, setActiveMenu] = useState(true);
    const [screenSize,setScreenSize] = useState(undefined)
    const [token, setAppToken] = useState(undefined);
    const [visibility, setDialogVisibility] = useState(false);
    const [currentColor,setCurrentColor] = useState('#03C9D7')
    const [titleColor,setTitleColor] = useState('#019676')
    const [currentMode,setCurrentMode] = useState('Light')
    const [themeSettings, setThemeSettings] = useState(false);
    const [location, setLocation] = useState(localStorage.getItem('user_location'));
    //const [location, setLocation] = useState('001');
    const [company, setCompany] = useState(localStorage.getItem('user_company'));
    //const [company, setCompany] = useState('PMC');

    const [userInfo, setUser] = useState(JSON.parse('{"RETNCODE":true,"RETNDATE":"2022-10-12T00:16:32.6235527+07:00","RETNMSSG":"","RETNDATA":{"TOKEN":"f5f4fhcZ/yIy7u7/EFDmBN0i/E6QCWzU9hh4wEls3qqIzOMscbuM4WFw1pSCB050loMwydmXnfaXGVSpeiN5t1yVSkGF3uHqEMSvD+EINjLGxPOGsEf5W4cKJM/j/fY2Cq6JZLEQZB9exGqX3k5jpw==","EXPIREDTIME":"2022-10-12T15:17:54.0143596+07:00","LOADLGIN":1,"APP_RGHT":15,"COMPLIST":[{"COMPCODE":"PMC","COMPNAME":"Công ty TNHH Giải pháp Tin học FirstEMS","LCTNLIST":[{"LCTNCODE":"001","LCTNNAME":"CN1 - Công ty TNHH Giải pháp Tin học FirstEMS PMC 1427"}]}],"USERLGIN":{"LCTNCODE":"001","LCTNNAME":"CN1 - Công ty TNHH Giải pháp Tin học FirstEMS PMC 1427","LCTNBRIF":"Tổng công ty","USERCODE":"000001","USERNAME":"Phan Ngọc Ẩn","APP_RGHT":15,"USERTYPE":4,"ROLECODE":4,"DEF_DSBR":"","EMPLCODE":"000001","EMPLNAME":"Phạm Thanh Phương","DPTMCODE":"000100000000","DPTMNAME":"Ban Giám Đốc","PSTNCODE":"000001","PSTNNAME":"Tổng Giám Đốc","JOB_CODE":"000001","JOB_NAME":"Giám đốc","LOGOCOMP":null,"APP_MENU":[]}}}'));
    //const [userInfo, setUser] = useState(JSON.parse(localStorage.getItem('user_info')))
    const [locations, setLocations] = useState(JSON.parse('[{"LCTNCODE":"001","LCTNNAME":"EMS_Công ty TNHH Giải pháp Tin học FirstEMS - SQL2019-1427"},{"LCTNCODE":"HCM","LCTNNAME":"EMS_HCM.Công ty TNHH Giải pháp Tin học FirstEMS - SQL2019-1427"}]'));
    //const [locations, setLocations] = useState(JSON.parse(localStorage.getItem('locations')))
    const setLocationsList = (locationsList) =>{
        setLocations((locationsList))
        localStorage.setItem('locations',JSON.stringify(locationsList))
    }
    const setUserInfo = (user)=>{
        localStorage.setItem('user_info',JSON.stringify(user))
        setUser(user)
    }
    const setToken = (newToken)=>{
        setAppToken(newToken)
        localStorage.setItem('user_token',newToken)
    }
    const setMode = (e) =>{
        setCurrentMode(e.target.value)
        localStorage.setItem('themeMode',e.target.value)
        setThemeSettings((false))
    }
    const setColor = (color) =>{
        setCurrentColor(color)
        localStorage.setItem('colorMode',color)
        setThemeSettings(false)
    }
    const setLocationSelected = (location)=>{
        setLocation(location)
        localStorage.setItem('user_location',location)
    }
    const setCompanySelected = (company)=>{
        setCompany(company)
        localStorage.setItem('user_company',company)
    }
    useEffect(() => {
        const localToken = localStorage.getItem('user_token')
        if (localToken != null && localToken != undefined){
            setAppToken(localToken)
        }
    }, []);
    const clearLogin = () => {
        localStorage.removeItem('user_token')
        localStorage.removeItem('user_info')
        setLocations('')
        setLocationSelected('')
        setCompanySelected('')
    }
    return (
        <StateContext.Provider value={{
            activeMenu,setActiveMenu,
            screenSize,setScreenSize,
            token, setToken,
            userInfo,setUserInfo,
            visibility,setDialogVisibility,
            currentMode,setCurrentMode,
            currentColor,setCurrentColor,
            themeSettings, setThemeSettings,
            location,setLocationSelected,
            setMode,setColor,
            locations,setLocationsList,
            company,setCompanySelected,
            clearLogin,titleColor,setTitleColor
        }}>
            {children}
        </StateContext.Provider>
    )
}

export const useStateContext = () => useContext(StateContext);