import React from "react";
import { GrAttachment } from "react-icons/gr";
import { useStateContext } from "../../contexts/ContextProvider";
import { useEffect, useState, useCallback } from "react";
import { Input, NumericTextBox } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { Label } from "@progress/kendo-react-labels";
import { FieldWrapper } from "@progress/kendo-react-form";
import { Upload } from "@progress/kendo-react-upload";
import moment from "moment/moment";
import { Dialog,DialogActionsBar } from "@progress/kendo-react-dialogs";
import {
  Grid,
  GridColumn,
  GridToolbar,
  GridNoRecords,
} from "@progress/kendo-react-grid";
import {
  DropDownList,
  MultiColumnComboBox,
} from "@progress/kendo-react-dropdowns";
import { filterBy } from "@progress/kendo-data-query";
import { Form, Field, FormElement } from "@progress/kendo-react-form";
import "./Order.css";
import {
  FormInput,
  FormDatePicker,
  FormComboBox,
  FormTextArea,
  FormNumericTextBox,
} from "../../components/FormComponents";
import { fieldRequireValidator } from "../../components/Validator";
import { MyCommandCell } from "../../components";
import { useNavigate } from 'react-router-dom';

const OrderDetailHeader = (props) => {
  return (
    <a className="k-link text-center" onClick={props.onClick}>
      <span
        style={{
          color: "blue",
          textAlign: "center",
        }}
      >
        {props.title}
      </span>
      {props.children}
    </a>
  );
};
export const DropDownCell = (props) => {
  var sortSales = props.sortSale;
  const handleChange = (e) => {
    if (props.onChange) {
      props.onChange({
        dataIndex: 0,
        dataItem: props.dataItem,
        field: props.field,
        syntheticEvent: e.syntheticEvent,
        value: e.target.value.value,
      });
    }
  };

  const { dataItem } = props;
  const field = props.field || "";
  const dataValue = dataItem[field] === null ? "" : dataItem[field];
  return (
    <td>
      {dataItem.inEdit ? (
        <DropDownList
          style={{
            width: "200px",
          }}
          onChange={handleChange}
          value={sortSales.find((c) => c.value === dataValue)}
          data={sortSales}
          textField="ITEMNAME"
        />
      ) : (
        dataValue.toString()
      )}
    </td>
  );
};
export default function CreateOrder(props) {
  
  const { token, userInfo, titleColor, visibility, setDialogVisibility } =
    useStateContext();
  const [dialogValue, setdialogValue] = useState({
    message:'Thất bại',
    color:'blue',
    button:'Thử lại',
    redirectUrl:'/'
  })
  const navigate = useNavigate();
  const [saleTypes, setSaleTypes] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [deliveryMethods, setDeliveryMethods] = useState([]);
  const [deliveryTypes, setDeliveryTypes] = useState([]);
  const [deliveryTimes, setDeliveryTimes] = useState([]);
  const [paymentCycles, setPaymentCycles] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [sortSales, setsortSales] = useState([]);
  const currentDate = new Date();
  const [mainDate, setmainDate] = useState(currentDate);
  const editField = "inEdit";
  const [selectedCustomer, setSelectedCustomer] = useState({
    CUSTNAME: "%",
    CUSTCODE: "%",
  });

  const [orderCode, setOrderCode] = useState("");
  const [orderDate, setOrderDate] = useState(currentDate);
  const [custTel, setCustTel] = useState("");
  const [custAddr, setCustAddr] = useState("");
  const [custCode, setCustCode] = useState("");
  const [noteText, setnoteText] = useState("");
  const [sumQuatity, setsumQuatity] = useState(0);
  const [sumMoney, setsumMoney] = useState(0);
  const [sumMoneyCram, setsumMoneyCram] = useState(0);
  const [rdtnRate, setrdtnRate] = useState(0);
  const [rdtnCram, setrdtnCram] = useState(0);
  const [cscrRate, setcscrRate] = useState(0);
  const [taxCode, settaxCode] = useState("");
  const [vatRate, setvatRate] = useState(0);
  const [vatCram, setvatCram] = useState(0);
  const [recvEmp, setrecvEmp] = useState("");
  const [recvTel, setrecvTel] = useState("");
  const [dlvPlace, setdlvPlace] = useState("");
  const [dlvAddr, setdlvAddr] = useState("");
  

  const handleChange = useCallback((event) => {
    var name = event.target.name;

    switch (name) {
      case "CUST_TEL": {
        setCustTel(event.target.value);
        break;
      }
      case "CUSTADDR": {
        setCustAddr(event.target.value);
        break;
      }
      case "RDTNRATE": {
        setrdtnRate(event.target.value);
        break;
      }
      case "VAT_RATE": {
        setvatRate(event.target.value);
        break;
      }
    }
  }, []);

  const initOrderHeader = {
    COMPCODE: "",
    LCTNCODE: "",
    ODERCODE: "",
    ODERDATE: currentDate,
    CUSTCODE: selectedCustomer.CUSTCODE,
    CUOMRATE: 1,
    PYMNPERD: "",
    PYMNNUMB: 0,
    DLVRTYPE: "",
    DLVRDATE: currentDate,
    DLVRPLCE: "",
    EMPLCODE: "",
    NOTETEXT: "", // Nội dung đơn hàng
    CUST_TEL: "", // Số điện thoại khách hàng
    TAX_CODE: "", // Mã số thuế
    VAT_RATE: 0, // Thuế xuất
    VAT_CRAM: 0, // Tiền thuế
    SUM_CRAM: 0, // Tổng tiền
    VAT_AMNT: 0,
    SUM_AMNT: 0,
    SMPRQTTY: 20, // Tổng số lượng
    RCVREMPL: "", // Người nhận hàng
    RCVR_TEL: "", // SĐT nhận hàng
    DLVRMTHD: 1,
    DLVRHOUR: 0,
    DLVRADDR: "", // Địa chỉ giao hàng
    PAY_MTHD: 0,
    MCUSTNME: "",
    SRC_DATA: 3,
    USERLGIN: "",
    RDTNRATE: 0, // % Chiết khấu
    RDTNCRAM: 0, // Số tiền chiết khấu
    RDTNAMNT: 0, // Số tiền chiết khấu VND
    CSCMRATE: 0, // % Hoa hồng
    DCMNSBCD: "",
    CUSTADDR: "",
    DDDD: "DDHKH",
    ACCERGHT: 0,
    STTESIGN: 0,
    STTENAME: "",
    KKKK0000: "",
  };

  const [selectedSaleType, setselectedSaleType] = useState();
  const [selectedPaymentMethod, setselectedPaymentMethod] = useState();
  const [selectedTimeCycle, setselectedTimeCycle] = useState();
  const [selectedDeliveryType, setselectedDeliveryType] = useState();
  const [selectedDeliveryMethod, setselectedDeliveryMethod] = useState();
  const [selectedDeliveryTime, setselectedDeliveryTime] = useState();

  const requestHeaders = new Headers();
  requestHeaders.set("Content-Type", "application/json");

  console.log(requestHeaders);
  function loadSortSale() {
    console.log("load sortsale");
    var local_key = "DTA002-lstSortSale";
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    if (sortSales.length == 0) {
      if (
        localStorage.getItem(local_key) !== null &&
        localStorage.getItem(local_key) !== undefined
      ) {
        setsortSales(JSON.parse(localStorage.getItem(local_key)));
      } else {
        let url =
          "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA002";
        let body = JSON.stringify({
          LISTCODE: "lstSortSale",
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
              result.RETNDATA.map((item) => {
                item.value = item.ITEMCODE;
              });
              setsortSales(result.RETNDATA);
              localStorage.setItem(local_key, JSON.stringify(result.RETNDATA));
            },
            (error) => {
              console.log(error);
            }
          );
      }
    }
  }
  function loadPaymentCycles() {
    var local_key = "DTA002-lstTimeType";
    if (paymentCycles.length > 0) {
      loadDataCustomer();
      return;
    }
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    if (
      localStorage.getItem(local_key) !== null &&
      localStorage.getItem(local_key) !== undefined
    ) {
      setPaymentCycles(JSON.parse(localStorage.getItem(local_key)));
      loadDataCustomer();
      return;
    }
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA002";
    let body = JSON.stringify({
      LISTCODE: "lstTimeType",
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
          //console.log(result.RETNDATA);
          setPaymentCycles(result.RETNDATA);
          localStorage.setItem(local_key, JSON.stringify(result.RETNDATA));
          loadDataCustomer();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  function loadDeliveryTimes() {
    var local_key = "DTA002-lstListHour";
    if (deliveryTimes.length > 0) {
      loadPaymentCycles();
      return;
    }
    if (
      localStorage.getItem(local_key) !== null &&
      localStorage.getItem(local_key) !== undefined
    ) {
      setDeliveryTimes(JSON.parse(localStorage.getItem(local_key)));
      loadPaymentCycles();
      return;
    }

    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA002";
    let body = JSON.stringify({
      LISTCODE: "lstListHour",
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
          //console.log(result.RETNDATA);
          setDeliveryTimes(result.RETNDATA);
          localStorage.setItem(local_key, JSON.stringify(result.RETNDATA));
          loadPaymentCycles();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  function loadDataCustomer() {
    // Fake Data
    //setCustomers(JSON.parse(localStorage.getItem("fake_customer")));
    //console.log("list customer = " + customers.length);
    //loadDataProducts();
    // return;
    var local_key = "DTA004-appCustList";
    if (customers.length > 0) {
      loadDataProducts();
      return;
    }
    if (
      localStorage.getItem(local_key) !== null &&
      localStorage.getItem(local_key) !== undefined
    ) {
      setCustomers(JSON.parse(localStorage.getItem(local_key)));
      loadDataProducts();
      return;
    }
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA004";
    let body = JSON.stringify({
      DCMNCODE: "appCustList",
      EMPLCODE: userInfo.RETNDATA.USERLGIN.EMPLCODE,
      PARACODE: "001",
      KEY_WORD: "%",
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
          //console.log(result.RETNDATA);
          setCustomers(result.RETNDATA);
          localStorage.setItem(local_key, JSON.stringify(result.RETNDATA));
          loadDataProducts();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  function loadDataProducts() {
    var local_key = "DTA004-appPrdcList";
    if (products.length > 0) {
      return;
    }
    if (
      localStorage.getItem(local_key) !== null &&
      localStorage.getItem(local_key) !== undefined
    ) {
      var result = JSON.parse(localStorage.getItem(local_key));
      result.map((item) => {
        item.PRCESALE = 100000;
        item.amount = 1;
        item.discount = 0;
        item.money = item.amount * item.PRCESALE;
        item.sortSale = "Hàng bán";
        item.inEdit = true;
      });
      setProducts(result);
      return;
    }
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA004";
    let body = JSON.stringify({
      DCMNCODE: "appPrdcList",
      LCTNCODE: userInfo.RETNDATA.USERLGIN.LCTNCODE,
      PARACODE: "001",
      LGGECODE: "{{0302}}",
      SCTNCODE: 1,
      JSTFDATE: "1990-01-01",
      KEY_WORD: "%",
      SHOPCODE: "%",
      CUSTCODE: selectedCustomer.CUSTCODE,
    });
    console.log(body);
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
          //console.log(result.RETNDATA);
          result.RETNDATA.map((item) => {
            item.PRCESALE = 100000;
            item.amount = 1;
            item.discount = 0;
            item.money = item.amount * item.PRCESALE;
            item.sortSale =
              sortSales[0] != undefined ? sortSales[0].ITEMCODE : "001";
            item.inEdit = true;
          });
          setProducts(result.RETNDATA);
          localStorage.setItem(local_key, JSON.stringify(result.RETNDATA));
        },
        (error) => {
          console.log(error);
        }
      );
  }
  function loadDataDeliveryType() {
    var local_key = "DTA002-lstDlvrType";
    if (deliveryTypes.length > 0) {
      loadDeliveryTimes();
      return;
    }
    if (
      localStorage.getItem(local_key) !== null &&
      localStorage.getItem(local_key) !== undefined
    ) {
      setDeliveryTypes(JSON.parse(localStorage.getItem(local_key)));
      loadDeliveryTimes();
      return;
    }
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA002";
    let body = JSON.stringify({
      LISTCODE: "lstDlvrType",
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
          //console.log(result.RETNDATA);
          setDeliveryTypes(result.RETNDATA);
          localStorage.setItem(local_key, JSON.stringify(result.RETNDATA));
          loadDeliveryTimes();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  function loadDataDeliveryMethod() {
    var local_key = "DTA002-lstDlvrMthd";
    if (deliveryMethods.length > 0) {
      loadDataDeliveryType();
      return;
    }
    if (
      localStorage.getItem(local_key) !== null &&
      localStorage.getItem(local_key) !== undefined
    ) {
      setDeliveryMethods(JSON.parse(localStorage.getItem(local_key)));
      loadDataDeliveryType();
      return;
    }
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA002";
    let body = JSON.stringify({
      LISTCODE: "lstDlvrMthd",
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
          //console.log(result.RETNDATA);
          setDeliveryMethods(result.RETNDATA);
          localStorage.setItem(local_key, JSON.stringify(result.RETNDATA));
          loadDataDeliveryType();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  function loadDataSaleTypes() {
    var local_key = "DTA002-lstmngSub_Dcmn";
    if (saleTypes.length > 0) {
      loadDataPaymentMethod();
      return;
    }
    if (
      localStorage.getItem(local_key) !== null &&
      localStorage.getItem(local_key) !== undefined
    ) {
      setSaleTypes(JSON.parse(localStorage.getItem(local_key)));
      loadDataPaymentMethod();
      return;
    }
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA002";
    let body = JSON.stringify({
      LISTCODE: "lstmngSub_Dcmn",
      CONDFLTR: "UsedStte=1 AND DcmnCode='HDBHD'",
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
          //console.log(result.RETNDATA);
          setSaleTypes(result.RETNDATA);
          localStorage.setItem(local_key, JSON.stringify(result.RETNDATA));
          loadDataPaymentMethod();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  function loadDataPaymentMethod() {
    var local_key = "DTA002-lst_inpCustOdMt_Pay_Mthd_2";
    if (paymentMethods.length > 0) {
      loadDataDeliveryMethod();
      return;
    }
    if (
      localStorage.getItem(local_key) !== null &&
      localStorage.getItem(local_key) !== undefined
    ) {
      setPaymentMethods(JSON.parse(localStorage.getItem(local_key)));
      loadDataDeliveryMethod();
      return;
    }
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA002";
    let body = JSON.stringify({
      LISTCODE: "lst_inpCustOdMt_Pay_Mthd_2",
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
          //console.log(result.RETNDATA);
          setPaymentMethods(result.RETNDATA);
          localStorage.setItem(local_key, JSON.stringify(result.RETNDATA));
          loadDataDeliveryMethod();
        },
        (error) => {
          console.log(error);
        }
      );
  }
  useEffect(() => {
    loadSortSale();
    loadDataSaleTypes();
    loadDataCustomer();
  }, []);
  useEffect(() => {
    loadDataProducts();
    setCustTel(selectedCustomer.TEL_NUMB);
    setCustAddr(selectedCustomer.CUSTADDR);
  }, [selectedCustomer]);
  const handleChangeCustomer = useCallback((event) => {
    setSelectedCustomer(event.value);
    console.log(selectedCustomer.CUSTCODE);
  }, []);

  // Grid detail
  const [orderDetails, setOrderDetails] = useState([]);
  const EDIT_FIELD = "inEdit";
  const [changes, setChanges] = useState(false);
  const enterEdit = (dataItem, field) => {
    const newData = orderDetails.map((item) => ({
      ...item,
      [EDIT_FIELD]: item.PRDCCODE === dataItem.PRDCCODE ? field : undefined,
    }));
    setOrderDetails(newData);
  };
  const itemChange = (event) => {
    let field = event.field || "";
    event.dataItem[field] = event.value;
    let newData = orderDetails.map((item) => {
      if (item.PRDCCODE === event.dataItem.PRDCCODE) {
        item[field] = event.value;
        if (field == "amount" || field == "PRCESALE" || field == "discount") {
          item["discountCram"] =
            (item["amount"] * item["PRCESALE"] * item["discount"]) / 100;
          item["money"] =
            item["amount"] * item["PRCESALE"] - item["discountCram"];
        }
        console.log(
          "id = " +
            event.dataItem.PRDCCODE +
            " change = " +
            field +
            " value = " +
            event.value
        );
      }

      return item;
    });
    setOrderDetails(newData);
    setChanges(true);
  };

  // Product list
  const productListColumns = [
    {
      field: "PRDCCODE",
      header: "Mã sản phẩm",
      width: "100px",
    },
    {
      field: "PRDCNAME",
      header: "Tên sản phẩm",
      width: "300px",
    },
    {
      field: "PRCESALE",
      header: "Đơn giá",
      width: "300px",
    },
  ];
  const [filterProduct, setFilterProduct] = React.useState();
  const handleFilterProductChange = (event) => {
    if (event) {
      setFilterProduct(event.filter);
    }
  };
  const handleProductComboBoxChange = (e) => {
    var item = e.value;
    item.sortSale = sortSales[0].ITEMCODE;
    item.amount = 1;
    item.discount = 0;
    item.discountCram = 0;
    item.inEdit = true;
    item.money = item.amount * item.PRCESALE;
    setOrderDetails([...orderDetails, item]);
  };
  const remove = (dataItem) => {
    const newData = orderDetails.filter(
      (item) => item.PRDCCODE !== dataItem.PRDCCODE
    );
    console.log("Length new data = " + newData.length);
    setOrderDetails(newData);
  };
  const CommandCell = (props) => (
    <MyCommandCell {...props} editField={editField} remove={remove} />
  );
  const DropdownSortSale = (props) => (
    <DropDownCell {...props} sortSale={sortSales}></DropDownCell>
  );
  useEffect(() => {
    var sumProductQuantity = 0;
    var sumProductMoney = 0;
    orderDetails.map((item) => {
      sumProductQuantity += item.amount;
      sumProductMoney += item.money;
    });
    setsumQuatity(sumProductQuantity);
    setsumMoney(sumProductMoney);
  }, [orderDetails]);

  useEffect(() => {
    var rdtn = (sumMoney * rdtnRate) / 100;
    var vatCram = ((sumMoney - rdtn) * vatRate) / 100;
    setrdtnCram(rdtn);
    setvatCram(vatCram);
    setsumMoneyCram(sumMoney - rdtn + vatCram);
  }, [sumMoney, rdtnRate, vatRate]);
  const handleSubmit = (dataItem) => {
    //console.log(JSON.stringify(dataItem))
    //return
    if (orderDetails.length == 0) {
      alert("Chưa thêm sản phẩm");
      return;
    }
    var userInfo = JSON.parse(localStorage.getItem("user_info")).RETNDATA;
    var postHeader = {
      ACCERGHT: 0,
      COMPCODE: localStorage.getItem("user_company"),
      LCTNCODE: localStorage.getItem("user_location"),
      ODERDATE: moment(dataItem.orderDate).format("yyyy-MM-DD"),
      CUSTCODE: selectedCustomer.CUSTCODE,
      CUOMRATE: 1,
      PYMNPERD: dataItem.PYMNPERD.ITEMCODE,
      PYMNNUMB: dataItem.PYMNNUMB,
      DLVRTYPE: dataItem.DLVRTYPE.ITEMCODE,
      DLVRDATE: moment(dataItem.DLVRDATE).format("yyyy-MM-DD"),
      DLVRPLCE: dataItem.DLVRPLCE,
      EMPLCODE: "",
      NOTETEXT: dataItem.NOTETEXT, // Nội dung đơn hàng
      CUST_TEL: custTel, // Số điện thoại khách hàng
      TAX_CODE: dataItem.TAX_CODE, // Mã số thuế
      VAT_RATE: dataItem.VAT_RATE, // Thuế xuất
      VAT_CRAM: vatCram, // Tiền thuế
      SUM_CRAM: sumMoneyCram, // Tổng tiền
      VAT_AMNT: vatCram,
      SUM_AMNT: sumMoneyCram,
      SMPRQTTY: sumQuatity, // Tổng số lượng
      RCVREMPL: dataItem.RCVREMPL, // Người nhận hàng
      RCVR_TEL: dataItem.RCVR_TEL, // SĐT nhận hàng
      DLVRMTHD: parseInt(dataItem.DLVRMTHD.ITEMCODE),
      DLVRHOUR: parseInt(dataItem.DLVRHOUR.ITEMCODE),
      DLVRADDR: dataItem.DLVRADDR, // Địa chỉ giao hàng
      PAY_MTHD: 0,
      MCUSTNME: selectedCustomer.CUSTNAME,
      SRC_DATA: 1,
      RDTNRATE: rdtnRate, // % Chiết khấu
      RDTNCRAM: rdtnCram, // Số tiền chiết khấu
      RDTNAMNT: rdtnCram, // Số tiền chiết khấu VND
      CSCMRATE: dataItem.CSCMRATE, // % Hoa hồng
      DCMNSBCD: "001",
      DDDD: "DDHKH",
      CUSTADDR: custAddr,
      EMPLCODE: userInfo.USERLGIN.EMPLCODE,
    };
    var postDetails = [];
    orderDetails.map((item) => {
      var detail = {
        PRDCCODE: item.PRDCCODE,
        QUOMCODE: item.QUOMCODE,
        QUOMQTTY: item.amount,
        PRDCQTTY: item.amount,
        CUOMCODE: "VND",
        CUOMRATE: 1,
        CRSLPRCE: item.PRCESALE,
        SALEPRCE: item.PRCESALE * 1,
        DISCRATE: item.discount,
        DCPRCRAM: item.discountCram,
        DCPRAMNT: item.discountCram,
        OVPRCRAM: 0,
        OVPRAMNT: 0,
        OVERDISC: 0,
        OVERCRAM: 0,
        OVERAMNT: 0,
        PRCECRAM: item.PRCESALE - item.discountCram,
        PRCEAMNT: item.PRCESALE - item.discountCram,
        MNEYCRAM: item.amount * (item.PRCESALE - item.discountCram),
        MNEYAMNT: item.amount * (item.PRCESALE - item.discountCram),
        SORTCODE: 1,
        ORGNCODE: 1,
        NOTETEXT_DT: "",
      };
      postDetails.push(detail);
    });
    postHeader.DETAIL = postDetails;
    var postHeaders = [];
    postHeaders.push(postHeader);
    var postOrder = {
      DCMNCODE: "DDHKH",
      HEADER: postHeaders,
    };
    console.log(JSON.stringify(postOrder));
    fetchPostOrder(postOrder);
  };
  function fetchPostOrder(body) {
    const currentToken = localStorage.getItem("user_token");
    console.log(currentToken);
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA007";
    fetch(url, {
      method: "POST",
      headers: requestHeaders,
      body: JSON.stringify(body),
    })
      .then((res) => {
        if (!res.ok) {
          console.log(res.status);
          return;
        } else return res.json();
      })
      .then(
        (result) => {
          if(result.RETNCODE){
            showDialog(result.RETNMSSG !== null ? result.RETNMSSG : 'Thành công',"OK","/orders")
          }else{
            showDialog(result.RETNMSSG !== null ? result.RETNMSSG : 'Thất bại',"Thử lại",'/')
          }
        },
        (error) => {
          console.log(error);
        }
      );
  }
  function showDialog(mess, button,redirectUrl) {
    setdialogValue({message:mess,button:button,redirectUrl:redirectUrl})
    setDialogVisibility(true);
    console.log("dialog visible = " + visibility)
  }
  const toggleDialog = () => {
    setDialogVisibility(!visibility);
    if(dialogValue.redirectUrl !== '/'){
      navigate(dialogValue.redirectUrl);
    }
  };
  function saveFunction() {
    console.log("save function called")
    //elementForm.onsubmit()
 }
  props.biRef.saveFunction = saveFunction;

  return (
    <>
      <div className="bg-blue-100">
        {visibility && (
          <Dialog title={"Thông báo"} onClose={toggleDialog}>
            <p
              style={{
                margin: "25px",
                textAlign: "center",
                width: "100px",
              }}
            >
              {dialogValue.message}
            </p>
            <DialogActionsBar>
              <button
                className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-base"
                onClick={toggleDialog}
              >
                {dialogValue.button}
              </button>
            </DialogActionsBar>
          </Dialog>
        )}
        <Form
        id="form-create-orders"
          onSubmit={handleSubmit}
          initialValues={initOrderHeader}
          render={(formRenderProps) => (
            <FormElement>
              <fieldset>
                <div className="bg-blue-100">
                  
                  <div className=" rounded-xl m-5">
                    <div
                      style={{ color: titleColor }}
                      className={"ml-7 pt-5 text-xl"}
                    >
                      Thông tin đơn hàng
                    </div>
                    <div className="flex justify-between">
                      <div className="w-full pl-5">
                        <div>
                          <div className="flex justify-between">
                            <div className="w-full mr-5">
                              <Field
                                id="ODERCODE"
                                name="ODERCODE"
                                label="Mã đơn hàng"
                                component={FormInput}
                                disabled={true}
                              />
                            </div>
                            <div className={"w-full mr-5"}>
                              <Field
                                id="ODERDATE"
                                name="ODERDATE"
                                label="Ngày đơn hàng"
                                component={FormDatePicker}
                                validator={fieldRequireValidator}
                                format={"dd/MM/yyyy"}
                              />
                            </div>
                            <div className="w-full">
                              <Field
                                id="saleTypes"
                                name="saleTypes"
                                label="Loại bán hàng"
                                component={FormComboBox}
                                validator={fieldRequireValidator}
                                data={saleTypes}
                                textField="ITEMNAME"
                                dataItemKey="ITEMCODE"
                                allowCustom={true}
                                wrapperStyle={{
                                  width: "300px",
                                }}
                              />
                            </div>
                          </div>
                          <div className="flex w-full">
                            <div className="w-full">
                              <Field
                                id="MCUSTNME"
                                name="MCUSTNME"
                                label="Tên khách hàng"
                                component={FormComboBox}
                                validator={fieldRequireValidator}
                                data={customers}
                                textField="CUSTNAME"
                                dataItemKey="CUSTCODE"
                                allowCustom={true}
                                onChange={handleChangeCustomer}
                                placeholder={"Click để chọn"}
                              />
                            </div>
                          </div>
                          <div className="w-full flex justify-between">
                            <div className={"w-full mr-5"}>
                              <FieldWrapper>
                                <Label style={{ color: "blue" }}>
                                  Mã khách hàng
                                </Label>
                                <div className={"k-form-field-wrap"}>
                                  <Input
                                    id="CUSTCODE"
                                    name="CUSTCODE"
                                    style={{ borderColor: "grey" }}
                                    value={selectedCustomer.CUSTCODE}
                                    disabled
                                  />
                                </div>
                              </FieldWrapper>
                            </div>
                            <div className={"w-full"}>
                              <FieldWrapper>
                                <Label style={{ color: "blue" }}>
                                  Số điện thoại
                                </Label>
                                <div className={"k-form-field-wrap"}>
                                  <Input
                                    id="CUST_TEL"
                                    name="CUST_TEL"
                                    style={{ borderColor: "grey" }}
                                    value={custTel}
                                    onChange={handleChange}
                                  />
                                </div>
                              </FieldWrapper>
                            </div>
                          </div>
                          <div className="w-full">
                            <FieldWrapper>
                              <Label style={{ color: "blue" }}>
                                Địa chỉ khách hàng
                              </Label>
                              <div className={"k-form-field-wrap"}>
                                <Input
                                  id="CUSTADDR"
                                  name="CUSTADDR"
                                  style={{ borderColor: "grey" }}
                                  value={selectedCustomer.CUSTADDR}
                                />
                              </div>
                            </FieldWrapper>
                          </div>
                          <div className="w-full mr-5 ">
                            <Field
                              id="NOTETEXT"
                              name="NOTETEXT"
                              label="Nội dung đơn hàng"
                              component={FormTextArea}
                              validator={fieldRequireValidator}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full pl-5 pr-5">
                        <div>
                          <div className={"flex items-center justify-between"}>
                            <div className="w-full mr-5">
                              <FieldWrapper>
                                <Label style={{ color: "blue" }}>
                                  Tổng số lượng
                                </Label>
                                <div className={"k-form-field-wrap"}>
                                  <NumericTextBox
                                    id="SMPRQTTY"
                                    name="SMPRQTTY"
                                    style={{ borderColor: "grey" }}
                                    value={sumQuatity}
                                    type="number"
                                    disabled
                                  />
                                </div>
                              </FieldWrapper>
                            </div>
                            <div className={"w-full"}>
                              <FieldWrapper>
                                <Label style={{ color: "blue" }}>
                                  Tổng tiền
                                </Label>
                                <div className={"k-form-field-wrap"}>
                                  <NumericTextBox
                                    id="SUM_CRAM"
                                    name="SUM_CRAM"
                                    style={{ borderColor: "grey" }}
                                    value={sumMoneyCram}
                                    type="number"
                                    disabled
                                  />
                                </div>
                              </FieldWrapper>
                            </div>
                          </div>
                          <div className={"flex items-center justify-between"}>
                            <div className="w-full mr-5">
                              <Field
                                id="RDTNRATE"
                                name="RDTNRATE"
                                label="% chiết khấu"
                                component={FormNumericTextBox}
                                className="text-alig-right"
                                onChange={handleChange}
                              />
                            </div>
                            <div className={"w-full mr-5"}>
                              <FieldWrapper>
                                <Label style={{ color: "blue" }}>
                                  Tiền chiết khấu
                                </Label>
                                <div className={"k-form-field-wrap"}>
                                  <NumericTextBox
                                    id="RDTNCRAM"
                                    name="RDTNCRAM"
                                    style={{ borderColor: "grey" }}
                                    value={rdtnCram}
                                    disabled
                                  />
                                </div>
                              </FieldWrapper>
                            </div>
                            <div className={"w-full"}>
                              <Field
                                id="CSCMRATE"
                                name="CSCMRATE"
                                label="% Hoa hồng khách hàng"
                                component={FormNumericTextBox}
                                className="text-alig-right"
                              />
                            </div>
                          </div>
                          <div className={"flex items-center justify-between"}>
                            <div className="w-full mr-5">
                              <Field
                                id="TAX_CODE"
                                name="TAX_CODE"
                                label="Mã số thuế"
                                component={FormInput}
                              />
                            </div>
                            <div className={"w-full mr-5"}>
                              <Field
                                id="VAT_RATE"
                                name="VAT_RATE"
                                label="Thuế xuất"
                                component={FormNumericTextBox}
                                className="text-alig-right"
                                onChange={handleChange}
                              />
                            </div>
                            <div className={"w-full"}>
                              <FieldWrapper>
                                <Label style={{ color: "blue" }}>
                                  Số tiền thuế
                                </Label>
                                <div className={"k-form-field-wrap"}>
                                  <NumericTextBox
                                    id="VAT_CRAM"
                                    name="VAT_CRAM"
                                    style={{ borderColor: "grey" }}
                                    value={vatCram}
                                    disabled
                                  />
                                </div>
                              </FieldWrapper>
                            </div>
                          </div>
                          <div className="w-full">
                            <div className="flex justify-between">
                              <div className="w-full mr-5">
                                <Field
                                  id="paymentMethods"
                                  name="paymentMethods"
                                  label="Phương thức thanh toán"
                                  component={FormComboBox}
                                  validator={fieldRequireValidator}
                                  data={paymentMethods}
                                  textField="ITEMNAME"
                                  dataItemKey="ITEMCODE"
                                  allowCustom={true}
                                  wrapperStyle={{
                                    width: "300px",
                                  }}
                                  noRecordsTemplate="Không có dữ liệu"
                                />
                              </div>

                              <div className="w-full mr-5">
                                <Field
                                  id="PYMNNUMB"
                                  name="PYMNNUMB"
                                  label="Số"
                                  component={FormInput}
                                  validator={fieldRequireValidator}
                                />
                              </div>
                              <div className={"w-full"}>
                                <Field
                                  id="PYMNPERD"
                                  name="PYMNPERD"
                                  label="Kỳ thanh toán"
                                  component={FormComboBox}
                                  validator={fieldRequireValidator}
                                  data={paymentCycles}
                                  textField="ITEMNAME"
                                  dataItemKey="ITEMCODE"
                                  allowCustom={true}
                                  noRecordsTemplate="Không có dữ liệu"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-xl m-5 pb-5">
                    <div
                      style={{ color: titleColor }}
                      className={"ml-7 text-xl"}
                    >
                      Thông tin giao hàng
                    </div>
                    <div className="flex justify-between pr-5">
                      <div className="w-full pl-5">
                        <div className="flex justify-between">
                          <div className="w-full mr-5">
                            <Field
                              id="DLVRMTHD"
                              name="DLVRMTHD"
                              label="Phương thức giao hàng"
                              component={FormComboBox}
                              validator={fieldRequireValidator}
                              data={deliveryMethods}
                              textField="ITEMNAME"
                              dataItemKey="ITEMCODE"
                              allowCustom={true}
                              noRecordsTemplate="Không có dữ liệu"
                            />
                          </div>
                          <div className={"w-full mr-5"}>
                            <Field
                              id="DLVRTYPE"
                              name="DLVRTYPE"
                              label="Phương thức vận chuyển"
                              component={FormComboBox}
                              validator={fieldRequireValidator}
                              data={deliveryTypes}
                              textField="ITEMNAME"
                              dataItemKey="ITEMCODE"
                              allowCustom={true}
                              noRecordsTemplate="Không có dữ liệu"
                            />
                          </div>
                          <div className={"w-full"}>
                            <div className={"flex"}>
                              <div className={"mr-5 justify-between"}>
                                <Field
                                  id="DLVRHOUR"
                                  name="DLVRHOUR"
                                  label="Giờ giao hàng"
                                  component={FormComboBox}
                                  validator={fieldRequireValidator}
                                  data={deliveryTimes}
                                  textField="ITEMNAME"
                                  dataItemKey="ITEMCODE"
                                  allowCustom={true}
                                  noRecordsTemplate="Không có dữ liệu"
                                />
                              </div>
                              <div>
                                <Field
                                  id="DLVRDATE"
                                  name="DLVRDATE"
                                  label="Ngày"
                                  component={FormDatePicker}
                                  validator={fieldRequireValidator}
                                  format={"dd/MM/yyyy"}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between">
                          <div className="w-full mr-5">
                            <Field
                              id="RCVREMPL"
                              name="RCVREMPL"
                              label="Người nhận hàng"
                              component={FormInput}
                              validator={fieldRequireValidator}
                            />
                          </div>
                          <div className={"w-full mr-5"}>
                            <Field
                              id="RCVR_TEL"
                              name="RCVR_TEL"
                              label="Số điện thoại nhận hàng"
                              component={FormInput}
                              validator={fieldRequireValidator}
                            />
                          </div>
                          <div className="w-full">
                            <Field
                              id="DLVRPLCE"
                              name="DLVRPLCE"
                              label="Nơi giao"
                              component={FormInput}
                              validator={fieldRequireValidator}
                            />
                          </div>
                        </div>
                        <div className={"w-full mr-5"}>
                          <Field
                            id="DLVRADDR"
                            name="DLVRADDR"
                            label="Địa chỉ giao"
                            component={FormTextArea}
                            validator={fieldRequireValidator}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
              <div className="ml-5">
                <div style={{ color: titleColor }} className={"ml-7 text-xl"}>
                  File đính kèm
                </div>
                <Upload multiple={true} defaultFiles={[]} autoUpload={false} />
              </div>
              <div className="rounded-xl ml-5">
                <div style={{ color: titleColor }} className={"ml-7 text-xl"}>
                  Danh sách sản phẩm
                </div>
                <div className="flex items-center mt-5 ml-5">
                  <div className="mr-5">Thêm sản phẩm</div>
                  <MultiColumnComboBox
                    style={{
                      width: "500px",
                      borderColor: "gray",
                    }}
                    columns={productListColumns}
                    textField={"PRDCNAME"}
                    data={
                      products ? filterBy(products, filterProduct) : products
                    }
                    filterable={true}
                    onFilterChange={handleFilterProductChange}
                    onChange={handleProductComboBoxChange}
                  />
                </div>
                <div className={"flex items-center justify-between mt-3"}>
                  <Grid
                    style={{
                      height: "400px",
                    }}
                    data={orderDetails}
                    dataItemKey={"PRDCCODE"}
                    rowHeight={50}
                    onItemChange={itemChange}
                    editField={EDIT_FIELD}
                  >
                    <GridNoRecords>
                      <p className="text-red-700 italic"> Không có dữ liệu</p>
                    </GridNoRecords>
                    <GridColumn
                      headerCell={OrderDetailHeader}
                      field="PRDCCODE"
                      title="Mã sản phẩm"
                      width="150px"
                      editable={false}
                    />
                    <GridColumn
                      headerCell={OrderDetailHeader}
                      field="PRDCNAME"
                      title="Tên sản phẩm"
                      width="200px"
                      editable={false}
                    />
                    <GridColumn
                      headerCell={OrderDetailHeader}
                      field="sortSale"
                      title="Phân loại"
                      width="300px"
                      cell={DropdownSortSale}
                    />
                    <GridColumn
                      headerCell={OrderDetailHeader}
                      field="amount"
                      title="Số lượng"
                      editor="numeric"
                    />
                    <GridColumn
                      headerCell={OrderDetailHeader}
                      field="QUOMNAME"
                      title="Đơn vị tính"
                      editable={false}
                    />
                    <GridColumn
                      headerCell={OrderDetailHeader}
                      field="PRCESALE"
                      title="Giá bán"
                      editor="numeric"
                    />
                    <GridColumn
                      headerCell={OrderDetailHeader}
                      field="discount"
                      title="Chiết khấu"
                      editor="numeric"
                    />
                    <GridColumn
                      headerCell={OrderDetailHeader}
                      field="discountCram"
                      title="Tiền chiết khấu"
                      editor="numeric"
                    />
                    <GridColumn
                      headerCell={OrderDetailHeader}
                      field="money"
                      title="Thành tiền"
                      editable={false}
                      editor="numeric"
                      format="{0:n}"
                    />
                    <GridColumn cell={CommandCell} width="100px" />
                  </Grid>
                </div>
                <div className="p-5 flex items-center justify-end">
                  <button
                    className="mr-3 pl-10 pr-10 pt-2 pb-2 rounded-md text-white"
                    style={{ background: "#019676" }}
                    type={"submit"}
                  >
                    Lưu
                  </button>
                  <button
                    className="pl-10 pr-10 pt-2 pb-2 rounded-md text-white"
                    style={{ background: "#f89633" }}
                    type="button"
                  >
                    Khóa
                  </button>
                </div>
              </div>
            </FormElement>
          )}
        />
      </div>
    </>
  );
}
