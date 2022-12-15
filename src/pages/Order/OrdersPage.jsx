import { Tooltip } from "@progress/kendo-react-tooltip";
import React from "react";
import { useState, useEffect } from "react";
import "./OrdersPage.css";
import { BsCardList, BsFillLockFill, BsFillDiagram3Fill } from "react-icons/bs";
import {
  GrAdd,
  GrEdit,
  GrClose,
  GrPrevious,
  GrChapterPrevious,
  GrCaretPrevious,
  GrCaretNext,
  GrChapterNext,
  GrSearch,
  GrPrint,
} from "react-icons/gr";
import { RiFileCopyLine } from "react-icons/ri";
import { IoIosCut } from "react-icons/io";
import { FiSave, FiFilter } from "react-icons/fi";
import { MdOutlineModeEditOutline } from "react-icons/md";
import {
  BsPlusLg,
  BsSearch,
  BsPrinter,
  BsChevronBarLeft,
  BsChevronBarRight,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { AiOutlineClose } from "react-icons/ai";
import { HiOutlineClipboardList } from "react-icons/hi";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import {
  Grid,
  GridColumn,
  getSelectedState,
  getSelectedStateFromKeyDown,
} from "@progress/kendo-react-grid";
import { getter } from "@progress/kendo-react-common";
import CreateNewOrder from "./CreateNewOrder";
import CreateOrder from "./CreateOrder";
const GridHeader = (props) => {
  return (
    <div onClick={props.onClick} className="text-black font-semibold">
      {props.title}
    </div>
  );
};
const DATA_ITEM_KEY = "MAINCODE";
const SELECTED_FIELD = "selected";
const idGetter = getter(DATA_ITEM_KEY);
const selectionModes = [
  {
    value: "single",
    label: "Single selection mode",
  },
  {
    value: "multiple",
    label: "Multiple selection mode",
  },
];
const initStateButton = {
  list: true,
  add: false,
  copy: false,
  del: false,
  edit: false,
  save: false,
  cancel: false,
  first: false,
  reverse: false,
  next: false,
  last: false,
  search: false,
  filter: false,
  lock: false,
  print: false,
  view: false,
};
export default function OrdersPage() {
  const [stateButton, setstateButton] = useState(initStateButton);
  const [rightValue, setRightValue] = useState(0);
  const [listVisible, setListVisible] = useState(true);
  const [selectionMode, setSelectionMode] = React.useState(
    selectionModes[1].value
  );
  const [sumDocuments, setSumDocuments] = useState(0);
  const [orders, setOrders] = useState([]);
  var initDateFrom = new Date();
  var initDateTo = new Date();
  const [dateFrom, setdateFrom] = useState(initDateFrom);
  const [dateTo, setdateTo] = useState(initDateTo);
  useEffect(() => {
    //stateButton.list = rightValue & 0 > 0
    var newSate = {};
    console.log(rightValue);
    console.log(rightValue & 2048);
    newSate.list = true;
    newSate.add = (rightValue & 2) > 0 ? true : false;
    newSate.copy = (rightValue & 4) > 0 ? true : false;
    newSate.del = (rightValue & 8) > 0 ? true : false;
    newSate.edit = (rightValue & 16) > 0 ? true : false;
    newSate.save = (rightValue & 32) > 0 ? true : false;
    newSate.cancel = (rightValue & 64) > 0 ? true : false;
    newSate.first = (rightValue & 128) > 0 ? true : false;
    newSate.reverse = (rightValue & 256) > 0 ? true : false;
    newSate.next = (rightValue & 512) > 0 ? true : false;
    newSate.last = (rightValue & 1024) > 0 ? true : false;
    newSate.search = (rightValue & 2048) > 0 ? true : false;
    newSate.filter = (rightValue & 4096) > 0 ? true : false;
    newSate.lock = (rightValue & 8192) > 0 ? true : false;
    newSate.print = (rightValue & 16384) > 0 ? true : false;
    newSate.view = (rightValue & 32768) > 0 ? true : false;

    setstateButton(newSate);

    console.log(newSate);
  }, [rightValue]);
  const loadOrderData = () => {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA003";
    let body = JSON.stringify({
      DCMNCODE: "DDHKH",
      STTESIGN: 7,
      BEG_DATE:
        dateFrom.getFullYear() +
        "-" +
        ("0" + (dateFrom.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + dateFrom.getDate()).slice(-2),
      END_DATE:
        dateTo.getFullYear() +
        "-" +
        ("0" + (dateTo.getMonth() + 1)).slice(-2) +
        "-" +
        ("0" + dateTo.getDate()).slice(-2),
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
          console.log(result);
          var ordersResponse = result.RETNDATA;
          ordersResponse.map((dataItem) => {
            dataItem.selected = false;
          });
          console.log(ordersResponse);
          setOrders(ordersResponse);
          setSumDocuments(ordersResponse.length);
        },
        (error) => {
          console.log(error);
        }
      );
  };
  useEffect(() => {
    console.log(orders);
  }, [orders]);
  const [selectedState, setSelectedState] = React.useState({});
  const onSelectionChange = (event) => {
    const newSelectedState = getSelectedState({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY,
    });
    setSelectedState(newSelectedState);
  };
  const onKeyDown = (event) => {
    const newSelectedState = getSelectedStateFromKeyDown({
      event,
      selectedState: selectedState,
      dataItemKey: DATA_ITEM_KEY,
    });
    setSelectedState(newSelectedState);
  };
  function someParentFunction() {
    // The child component can call this function.
  }
  var biRef = {
    someParentFunction: someParentFunction,
  };
  const onFunClick = (functionName) => {
    if (functionName === "list") {
      setListVisible(!listVisible);
    }
    if (functionName === "save") {
      biRef.saveFunction();
    }
    console.log(functionName);
  };
  useEffect(() => {
    console.log("listVisible is change");
    if (listVisible) {
      setRightValue(0);
    } else {
      //setRightValue(1+128+256+2048+4096+16384+32768)
      setRightValue(32);
    }
  }, [listVisible]);
  const onItemDoubleClick = () => {
    var maincodeSelected = Object.keys(selectedState)[0];
    localStorage.setItem(
      "main_code_document_selected",
      Object.keys(selectedState)[0]
    );
    console.log(selectedState);
    setListVisible(false);
    orders.map((item) => {
      if (item.MAINCODE === maincodeSelected) {
        localStorage.setItem("order_document_selected", JSON.stringify(item));
        loadDataDocument();
        if (item.STTESIGN === 0) {
          setRightValue(
            2 +
              4 +
              8 +
              16 +
              128 +
              256 +
              512 +
              1024 +
              2048 +
              8192 +
              16384 +
              32768
          );
        } else {
          setRightValue(
            2 + 4 + 128 + 256 + 512 + 1024 + 2048 + 4096 + 16384 + 32768
          );
        }
        return;
      }
    });
  };
  function loadDataDocument() {
    console.log("call load document");
    var orderDocumentSelected = JSON.parse(
      localStorage.getItem("order_document_selected")
    );
    if (orderDocumentSelected == null) {
      return;
    }
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    console.log("maincode = " + orderDocumentSelected.MAINCODE);
    requestHeaders.set("TOKEN", localStorage.getItem("user_token"));
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA005";
    let body = JSON.stringify({
      DCMNCODE: "DDHKH",
      KEY_CODE: orderDocumentSelected.KKKK0000,
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
          console.log(JSON.stringify(result));
          localStorage.setItem("order_document_data", JSON.stringify(result));
        },
        (error) => {
          console.log(error);
        }
      );
  }

  return (
    <>
      <div className="text-blue-700 font-bold p-3 text-center">
        ĐƠN ĐẶT HÀNG
      </div>
      <div className="w-full flex bg-gray-200">
        <Tooltip className="m-3">
          <button
            title="Bật tắt danh sách chứng từ"
            type="button"
            onClick={() => onFunClick("list")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-list"
            disabled={!stateButton.list}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<HiOutlineClipboardList />}
          </button>
        </Tooltip>
        <div className="bg-gray-400 w-0.5 m-3"></div>
        <Tooltip className="m-3">
          <button
            title="Thêm chứng từ mới"
            type="button"
            onClick={() => onFunClick("add")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-add"
            disabled={!stateButton.add}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<BsPlusLg />}
          </button>
        </Tooltip>
        <Tooltip className="m-3">
          <button
            title="Nhân bản"
            type="button"
            onClick={() => onFunClick("copy")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-dup"
            disabled={!stateButton.copy}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<RiFileCopyLine />}
          </button>
        </Tooltip>
        <Tooltip className="m-3">
          <button
            title="Xóa chứng từ"
            type="button"
            onClick={() => onFunClick("del")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-del"
            disabled={!stateButton.del}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<IoIosCut />}
          </button>
        </Tooltip>
        <Tooltip className="m-3">
          <button
            title="Sửa chứng từ"
            type="button"
            onClick={() => onFunClick("edit")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-edit"
            disabled={!stateButton.edit}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<MdOutlineModeEditOutline />}
          </button>
        </Tooltip>
        <div className="bg-gray-400 w-0.5 m-3"></div>
        <Tooltip className="m-3">
          <button
            title="Lưu chứng từ"
            type="submit"
            form='form-create-orders'
            onClick={() => onFunClick("save")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            disabled={!stateButton.save}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<FiSave />}
          </button>
        </Tooltip>
        <Tooltip className="m-3">
          <button
            title="Hủy thao tác"
            type="button"
            onClick={() => onFunClick("cancel")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-cancel"
            disabled={!stateButton.cancel}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<AiOutlineClose />}
          </button>
        </Tooltip>
        <div className="bg-gray-400 w-0.5 m-3"></div>
        <Tooltip className="m-3">
          <button
            title="Về chứng từ đầu"
            type="button"
            onClick={() => onFunClick("first")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-first"
            disabled={!stateButton.first}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<BsChevronBarLeft />}
          </button>
        </Tooltip>
        <Tooltip className="m-3">
          <button
            title="Về chứng từ trước"
            type="button"
            onClick={() => onFunClick("reverse")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-reverse"
            disabled={!stateButton.reverse}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<BsChevronLeft />}
          </button>
        </Tooltip>
        <Tooltip className="m-3">
          <button
            title="Về chứng từ sau"
            type="button"
            onClick={() => onFunClick("next")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-next"
            disabled={!stateButton.next}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<BsChevronRight />}
          </button>
        </Tooltip>
        <Tooltip className="m-3">
          <button
            title="Về chứng từ cuối"
            type="button"
            onClick={() => onFunClick("last")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-last"
            disabled={!stateButton.last}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<BsChevronBarRight />}
          </button>
        </Tooltip>
        <div className="bg-gray-400 w-0.5 m-3"></div>
        <Tooltip className="m-3">
          <button
            title="Tìm kiếm chứng từ"
            type="button"
            onClick={() => onFunClick("search")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-search"
            disabled={!stateButton.search}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<BsSearch />}
          </button>
        </Tooltip>
        <Tooltip className="m-3">
          <button
            title="Lọc giới hạn dữ liệu"
            type="button"
            onClick={() => {}}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-filter"
            disabled={!stateButton.filter}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<FiFilter />}
          </button>
        </Tooltip>
        <div className="bg-gray-400 w-0.5 m-3"></div>
        <Tooltip className="m-3">
          <button
            title="Khóa chứng từ"
            type="button"
            onClick={() => onFunClick("lock")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-lock"
            disabled={!stateButton.lock}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<BsFillLockFill />}
          </button>
        </Tooltip>
        <div className="bg-gray-400 w-0.5 m-3"></div>
        <Tooltip className="m-3">
          <button
            title="In chứng từ"
            type="button"
            onClick={() => onFunClick("print")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-print"
            disabled={!stateButton.print}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<BsPrinter />}
          </button>
        </Tooltip>
        <Tooltip className="m-3">
          <button
            title="Xem xét duyệt"
            type="button"
            onClick={() => onFunClick("view")}
            className="relative text-xl rounded-full p-3 text-blue-600 hover:bg-blue-200  disabled:text-gray-400"
            id="btn-view"
            disabled={!stateButton.view}
          >
            <span className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2" />
            {<BsFillDiagram3Fill />}
          </button>
        </Tooltip>
      </div>
      <div>
        {listVisible && (
          <div>
            <div className="w-full flex bg-blue-200 p-3">
              <div className="flex items-center">
                <div className="w-fit text-xs">Từ ngày:</div>
                <div className="ml-5 mr-5">
                  <DatePicker
                    id="date-from"
                    defaultValue={dateFrom}
                    format="dd/MM/yyyy"
                    onChange={(e) => {
                      setdateFrom(e.value);
                    }}
                  />
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-fit text-xs">đến ngày:</div>
                <div className="ml-5">
                  <DatePicker
                    id="date-to"
                    defaultValue={dateTo}
                    format="dd/MM/yyyy"
                    onChange={(e) => {
                      setdateTo(e.value);
                    }}
                  />
                </div>
              </div>
              <button
                type="button"
                className="rounded-md bg-green-500 text-white pl-5 pr-5 ml-5 items-center"
                onClick={loadOrderData}
              >
                Lọc
              </button>
              <div className="flex items-center ml-10">
                <div className="w-fit text-xs">Tổng số chứng từ:</div>
                <div className="ml-3 text-red-700 text-xs font-semibold">
                  {sumDocuments}
                </div>
              </div>
            </div>
            <div className={" bg-white rounded-3xl"}>
              <Grid
                style={{
                  height: "600px",
                }}
                data={orders.map((item) => ({
                  ...item,
                  [SELECTED_FIELD]: selectedState[idGetter(item)],
                }))}
                dataItemKey={DATA_ITEM_KEY}
                selectedField={SELECTED_FIELD}
                selectable={{
                  enabled: true,
                  cell: false,
                  mode: selectionMode,
                }}
                navigatable={true}
                onSelectionChange={onSelectionChange}
                onKeyDown={onKeyDown}
                onRowDoubleClick={onItemDoubleClick}
              >
                <GridColumn
                  field="MAINCODE"
                  title="Mã đơn hàng"
                  width="150px"
                  headerCell={GridHeader}
                />
                <GridColumn
                  field="MAINDATE"
                  title="Ngày đơn hàng"
                  width="200px"
                  headerCell={GridHeader}
                />
                <GridColumn
                  field="NOTETEXT"
                  title="Nội dung"
                  headerCell={GridHeader}
                />
                <GridColumn
                  field="STTENAME"
                  title="Trạng thái"
                  headerCell={GridHeader}
                />
              </Grid>
            </div>
          </div>
        )}
      </div>
      <div>{!listVisible && <CreateOrder biRef={biRef} />}</div>
    </>
  );
}
