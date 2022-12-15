import React from "react";
import { useStateContext } from "../../contexts/ContextProvider";
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import {IoIosAddCircleOutline} from 'react-icons/io'
export default function Orders() {
  const normalLink =
    "flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-white hover:bg-blue-100 hover:text-black dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2";
  const { token } = useStateContext();
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", localStorage.getItem('user_token'));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA003";
    let body = JSON.stringify({
      DCMNCODE: "DDHKH",
      STTESIGN: 7,
      BEG_DATE: "2020-01-01",
      END_DATE: "2022-12-31",
    });
    fetch(url, {
      method: "POST",
      headers: requestHeaders,
      body: body,
    })
      .then((res) => {
        if (!res.ok) {
          console.log(res.status);
          return;
        } else return res.json();
      })
      .then(
        (result) => {
          console.log(result);
          setOrders(result.RETNDATA);
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);
  useEffect(() => {
    console.log(orders);
  }, [orders]);
  return (
    <div>
      <div className={"items-center p-5"}>
        <h2 className={"text-center"}>Danh sách đơn đặt hàng</h2>
      </div>
      <div className={"m-3 bg-blue-500 rounded-xl"} style={{ width: "200px" }}>
        <NavLink to="/orders/create" key="create-orders" className={normalLink}>
          <IoIosAddCircleOutline />
          <span>Thêm mới đơn hàng</span>
        </NavLink>
      </div>
      <div className={"m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl"}>
        <Grid
          style={{
            height: "400px",
          }}
          data={orders}
        >
          <GridColumn field="MAINCODE" title="Mã đơn hàng" width="150px" />
          <GridColumn field="MAINDATE" title="Ngày tạo đơn" width="200px" />
          <GridColumn field="NOTETEXT" title="Nội dung" />
          <GridColumn field="STTENAME" title="Trạng thái" />
        </Grid>
      </div>
    </div>
  );
}
