import React from 'react'
import { useState, useEffect, useCallback } from 'react';
import './Login.css'
import { useStateContext } from '../../contexts/ContextProvider'
import { Input } from '@progress/kendo-react-inputs';
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { TreeView } from '@progress/kendo-react-treeview';
export default function Login() {
  const staticToken = "CmzFIKFr7UvPe6zBPBtn3nkrWOY3UYSLLnTfii/H9QG56Ur6b9XtFty3M9tBEKV1l3d+0mGEXmfQyuGFjrNHYGSODDy+ihkBmsHYUNPgD44=";
  const {
    token,
    setToken,
    setUserInfo,
    visibility,
    setDialogVisibility,
    setLocationSelected,
    location,
    setLocationsList,
    company,
    setCompanySelected
  } = useStateContext()
  const LOCAL_STORAGE_KEY_USER_LOGIN = 'user_login'
  const [username, setUsername] = useState(undefined);
  const [password, setPassword] = useState(undefined);
  const [remember, setRemember] = useState(false);
  const [resultLogin, setResultLogin] = useState(undefined);
  const [treeNode, setTreeNode] = useState([]);
  const [isActiveComList, setIsActiveComList] = useState(true);
  const [activeLoginButton, setActiveLoginButton] = useState(true);
  const [returnMessage, setReturnMessage] = useState('Thất bại');
  const [dropdownLocation, setDropdownLocation] = useState('');
  useEffect(() => {
    const localUserLogin = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY_USER_LOGIN))
    console.log(localUserLogin)
    if (localUserLogin != null && localUserLogin != undefined) {
      if (localUserLogin.remember) {
        setUsername(localUserLogin.username)
        setPassword(localUserLogin.password)
        setRemember(localUserLogin.remember)
      }
    }
  }, []);

  useEffect(() => {
    if (dropdownLocation === undefined)
      return
    const arr = dropdownLocation.split('|')
    if (arr.length == 2) {
      setActiveLoginButton(true)
    } else
      setActiveLoginButton(false)
  }, [dropdownLocation]);

  const onSubmit = () => {

  }
  const onUsernameChange = useCallback(
    (e) => {
      setUsername(e.target.value)
      setTreeNode([])
      setActiveLoginButton(true)
    },
    [],
  );
  const onPasswordChange = useCallback(
    (e) => {
      setPassword(e.target.value)
      setTreeNode([])
      setActiveLoginButton(true)
    },
    [],
  );
  const onRememberChange = useCallback(
    (e) => {
      setRemember(e.target.checked)
    },
    [],
  );
  useEffect(() => {
    const requestHeaders = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('TOKEN', staticToken);
    console.log(requestHeaders)
    fetch('Http://Api-Dev.firstems.com/Api/data/runApi_Syst?run_Code=SYS001', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({
        COMPCODE: 'PMC'
      })
    }).then(res => res.json()).then((result) => {
      console.log("temp token = " + result.RETNDATA.TOKEN)
      setToken(result.RETNDATA.TOKEN)
    })
  }, []);

  const handleLogin = () => {
    const requestHeaders = new Headers();
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('TOKEN', token);
    let url = 'http://api-dev.firstems.com/api/data/runapi_syst?run_code=sys005'
    let body = JSON.stringify({
      USERLGIN: username,
      PASSWORD: password,
      LGINTYPE: 1,
      APP_CODE: 'WSB',
      COMPCODE: 'PMC',
      PHONNAME: '91C5F50F-EFAB-4E3B-81EC-75CED11AD450'
    });
    if (isActiveComList && location != null) {
      requestHeaders.set('TOKEN', token);
      url = 'http://api-dev.firstems.com/api/data/runapi_syst?run_code=sys006'
      body = JSON.stringify({
        COMPCODE: company,
        LCTNCODE: location,
      });
    }
    console.log(requestHeaders)
    console.log(body)
    fetch(url, {
      method: "POST",
      headers: requestHeaders,
      body: body,
    }).then(res => {
      if (!res.ok) {
        setDialogVisibility(true)
        setReturnMessage("Lỗi - " + res.status)
        return;
      } else
        return res.json()
    }).then((result) => {
      console.log(result)
      setResultLogin(result)
    }, (error) => {
      console.log(error)
    });

  }
  function handleComList(comList) {
    const arrNode = [];
    comList.map((item) => {
      let node = {
        text: item.COMPNAME,
        data: item.COMPCODE
      }
      const nodesChild = [];
      if (item.LCTNLIST.length > 0) {
        item.LCTNLIST.map((location) => {
          let nodeChild = {
            data: item.COMPCODE + '|' + location.LCTNCODE,
            text: location.LCTNNAME,
          }
          nodesChild.push(nodeChild)
          node.items = nodesChild
        })
      }
      arrNode.push(node)
    })
    setTreeNode(arrNode)
  }

  function handleSuccess(resultLogin) {
    setUserInfo(resultLogin)
    if (remember) {
      localStorage.setItem(LOCAL_STORAGE_KEY_USER_LOGIN, JSON.stringify({ username: username, password: password, remember: remember }))
    }
    window.location.reload()
  }

  useEffect(() => {
    if (resultLogin != undefined) {
      if (resultLogin === null || resultLogin.RETNDATA === null) {
        showDialog(resultLogin.RETNMSSG != '' ? resultLogin.RETNMSSG : 'Thất bại')
        return
      }
      console.log(resultLogin.RETNCODE)
      if (resultLogin.RETNCODE === true) {
        setToken(resultLogin.RETNDATA.TOKEN)
        const comList = resultLogin.RETNDATA.COMPLIST
        if (comList.length === 1 && comList[0].LCTNLIST.length === 1) {
          // 1 công ty - 1 chi nhánh = > handleSuccess
          handleSuccess(resultLogin)
        } else {
          // Nhiều công ty - Nhiều chi nhánh => handleComList
          handleComList(comList)
        }
        console.log('Đăng nhập thành công')
      } else {
        console.log('Thất bại')
        showDialog(resultLogin.RETNMSSG != '' ? resultLogin.RETNMSSG : 'Thất bại')
      }
    }
  }, [resultLogin]);
  useEffect(() => {
    if (treeNode != null && treeNode.length > 0) {
      setIsActiveComList(true)
      setActiveLoginButton(false)
    } else {
      setIsActiveComList(false)
      setActiveLoginButton(true)
    }
  }, [treeNode]);
  function showDialog(mess) {
    setReturnMessage(mess)
    setDialogVisibility(true);
    console.log("dialog visible = " + visibility)
  }
  function dialogClose() {
    setDialogVisibility(false);
  }

  function saveLocations(id) {
    if (resultLogin != null) {
      resultLogin.RETNDATA.COMPLIST.map((comp) => {
        if (comp.COMPCODE === id.split('|')[0]) {
          setLocationsList(comp.LCTNLIST)
          return
        }
      });
    }
  }
  const usernameValidationMessage =
    "Vui lòng nhập tài khoản";
  const passwordValidationMessage =
    "Vui lòng nhập mật khẩu";
  const handleSubmit = (event) => {
    event.preventDefault();
    handleLogin(staticToken)
  };
    const toggleDialog = () => {
      setDialogVisibility(!visibility);
    };
  const onExpandChange = (event) => {
    event.item.expanded = !event.item.expanded;
    setTreeNode([...treeNode]);
  };
  return (
    <div className="container-login100" id="dialog-target">

      {visibility && (
        <Dialog title={"Thông báo"} onClose={toggleDialog}>
          <p
            style={{
              margin: "25px",
              textAlign: "center",
              width: '100px'
            }}
          >
            {returnMessage}
          </p>
          <DialogActionsBar>
            <button
              className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
              onClick={toggleDialog}
            >
              Thử lại
            </button>
          </DialogActionsBar>
        </Dialog>
      )}

      <div className="wrap-login100">
        <div className="login100-form validate-form">
          <span className="login100-form-logo">
            <img className="zmdi zmdi-landscape" src={require('../../data/logo_ems.png')} />
          </span>
          <span className="login100-form-title p-b-34 p-t-27">
            Đăng nhập hệ thống
          </span>
          <form className="k-form" onSubmit={handleSubmit}>
            <div>
              <fieldset>
                <div className="mb-3">
                  <Input
                    validityStyles={false}
                    name="username"
                    style={{
                      width: "100%",
                    }}
                    label="Tài khoản"
                    required={true}
                    onChange={onUsernameChange}
                    validationMessage={usernameValidationMessage}
                  />
                </div>
              </fieldset>
              <div className="mb-3">
                <Input
                  validityStyles={false}
                  value={password}
                  onChange={onPasswordChange}
                  name="password"
                  type="password"
                  style={{
                    width: "100%",
                  }}
                  label="Password"
                  required={true}
                  validationMessage={passwordValidationMessage}
                />
              </div>

            </div>
            <div className={'mt-2 flex justify-center'}>
              <input
                type={"checkbox"}
                id={'remember'}
                name={'remember'}
                value={'remember'}
                className={'cursor-pointer'}
                checked={remember}
                onChange={onRememberChange}
              />
              <label htmlFor={'remember'} className={'ml-2 text-md cursor-pointer'}>Nhớ mật khẩu</label>
            </div>
            <div
              className={`mt-2 pl-2 ${isActiveComList ? '' : 'hidden'}`}
            >
              <p className={'text-xl'} style={{ color: 'blue' }}>Danh sách Công ty - Chi nhánh</p>
            </div>
            <TreeView
              animate={true}
              expandIcons={true}
              onItemClick={(e) => {
                console.log(e)
                const id = e.item.data
                setDropdownLocation(id)
                if (e.item.data.split('|').length == 2) {
                  saveLocations(e.item.data)
                }
                console.log(e.item.data.split('|')[0])
                setCompanySelected(e.item.data.split('|')[0])
                setLocationSelected(e.item.data.split('|')[1])
              }}
              data={treeNode} onExpandChange={onExpandChange} />
            <div className={'mt-2 flex justify-center'}>

              <button
                disabled={!activeLoginButton}
                className={`'items-center p-2 w-full text-white ${!activeLoginButton ? 'disable-button' : 'enable-button'}`}
                type={'submit'}
                style={{ borderRadius: '10px', background: 'blue' }}
                onClick={onSubmit}
              >{isActiveComList ? 'Tiếp tục' : 'Đăng nhập'}</button>
            </div>
          </form>

        </div>
      </div>
    </div>
  )
}
