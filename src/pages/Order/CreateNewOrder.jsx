import React, { Component } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { ComboBox } from "@progress/kendo-react-dropdowns";
import { Grid, GridColumn, GridToolbar } from "@progress/kendo-react-grid";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { GrAttachment } from "react-icons/gr";
export default class CreateNewOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: localStorage.getItem("user_token"),
      userInfo: JSON.parse(localStorage.getItem("user_info")),
      titleColor: "blue",
      paymentCycles: [],
      deliveryTimes: [],
      customers: [],
      products: [],
      deliveryTypes: [],
      deliveryMethods: [],
      saleTypes: [],
      paymentMethods: [],
      selectedCustomer: { CUSTCODE: "%", CUSTNAME: "%" },
      orderCode: "",
      orderDate: "",
      custTel: "",
      custAddr: "",
      custCode: "",
      noteText: "",
      sumQuatity: 0,
      sumMoney: 0,
      rdtnRate: 0,
      rdtnCram: 0,
      cscrRate: 0,
      taxCode: "",
      vatRate: "",
      vatCram: "",
      recvEmp: "",
      recvTel: "",
      dlvPlace: "",
      dlvAddr: "",
    
    };

    this.custTel = React.createRef()
    this.custAddr = React.createRef()

    this.handleInputChange = this.handleInputChange.bind(this);
  }
  componentDidMount() {
    this.loadPaymentCycles();
    this.loadDeliveryTimes();
    this.loadDataCustomer();
    this.loadDataProducts();
    this.loadDataDeliveryType();
    this.loadDataDeliveryMethod();
    this.loadDataSaleTypes();
    this.loadDataPaymentMethod();
  }
  loadDataPaymentMethod() {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", this.state.token);
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
          this.setState({ ["paymentMethods"]: result.RETNDATA });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  loadDataSaleTypes() {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", this.state.token);
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
          this.setState({ ["saleTypes"]: result.RETNDATA });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  loadDataDeliveryMethod() {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", this.state.token);
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
          this.setState({ ["deliveryMethods"]: result.RETNDATA });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  loadDataDeliveryType() {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", this.state.token);
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
          this.setState({ ["deliveryTypes"]: result.RETNDATA });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  loadDataProducts() {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", this.state.token);
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA004";
    let body = JSON.stringify({
      DCMNCODE: "appPrdcList",
      LCTNCODE: this.state.userInfo.RETNDATA.USERLGIN.LCTNCODE,
      PARACODE: "001",
      LGGECODE: "{{0302}}",
      SCTNCODE: 1,
      JSTFDATE: "1990-01-01",
      KEY_WORD: "%",
      SHOPCODE: "%",
      CUSTCODE: this.state.selectedCustomer.CUSTCODE,
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
            item.sortSale = "H??ng b??n";
            item.inEdit = true;
          });
          this.setState({ ["products"]: result.RETNDATA });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  loadDataCustomer() {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", this.state.token);
    let url =
      "http://api-dev.firstems.com/Api/data/runApi_Data?run_Code=DTA004";
    let body = JSON.stringify({
      DCMNCODE: "appCustList",
      EMPLCODE: this.state.userInfo.RETNDATA.USERLGIN.EMPLCODE,
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
          this.setState({ ["customers"]: result.RETNDATA });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  loadDeliveryTimes() {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", this.state.token);
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
          this.setState({ ["deliveryTimes"]: result.RETNDATA });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  loadPaymentCycles() {
    const requestHeaders = new Headers();
    requestHeaders.set("Content-Type", "application/json");
    requestHeaders.set("TOKEN", this.state.token);
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
          this.setState({ ["paymentCycles"]: result.RETNDATA });
        },
        (error) => {
          console.log(error);
        }
      );
  }
  handleInputChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }
  render() {
    return (
      <>
        <div className="bg-blue-100">
          <div className="rounded-xl ">
            <div
              style={{ color: this.state.titleColor }}
              className={"ml-7 pt-5"}
            >
              Th??ng tin ????n h??ng
            </div>
            <div className="flex justify-between">
              <div className="w-full p-5">
                <div>
                  <div className="flex justify-between">
                    <div className="w-full mr-5">
                      <div style={{ color: this.state.titleColor }}>
                        M?? ????n h??ng
                      </div>
                      <Input
                        name="orderCode"
                        value={this.state.orderCode}
                        disabled={true}
                        style={{
                          background: "#cccccc",
                        }}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className={"w-full mr-5"}>
                      <div style={{ color: this.state.titleColor }}>
                        Ng??y ????n h??ng
                      </div>
                      <DatePicker
                        defaultValue={this.state.orderDate}
                        defaultShow={false}
                      />
                    </div>
                    <div className="w-full">
                      <div style={{ color: this.state.titleColor }}>
                        Lo???i b??n h??ng
                      </div>
                      <ComboBox
                        style={{
                          width: "300px",
                        }}
                        data={this.state.saleTypes}
                        textField="ITEMNAME"
                        dataItemKey="ITEMCODE"
                        allowCustom={true}
                        onChange={(e) => {
                          //setselectedSaleType(e.value);
                        }}
                      />
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-full mr-5 ">
                      <div style={{ color: this.state.titleColor }}>
                        T??n kh??ch h??ng
                      </div>
                      <ComboBox
                        style={{
                          width: "300px",
                        }}
                        textField="CUSTNAME"
                        dataItemKey="CUSTCODE"
                        data={this.state.customers}
                        allowCustom={true}
                        //onChange={handleChangeCustomer}
                      />
                    </div>
                    <div className={"w-full mr-5"}>
                      <div style={{ color: this.state.titleColor }}>
                        M?? kh??ch h??ng
                      </div>
                      <Input
                        value={this.state.custCode}
                        name="custCode"
                        disabled={true}
                        style={{
                          background: "#cccccc",
                        }}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className={"w-full"}>
                      <div style={{ color: this.state.titleColor }}>
                        S??? ??i???n tho???i
                      </div>
                      <Input
                        name="custTel"
                        value={this.state.custTel}
                        ref = {this.custTel}
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div style={{ color: this.state.titleColor }}>
                      ?????a ch??? kh??ch h??ng
                    </div>
                    <Input
                      name="custAddr"
                      value={this.state.custAddr}                     
                      ref = {this.custAddr}
                    />
                  </div>
                  <div className="w-full mr-5 ">
                    <div style={{ color: this.state.titleColor }}>
                      N???i dung ????n h??ng
                    </div>
                    <Input
                      value={this.state.noteText}
                      name="noteText"
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full p-5">
                <div>
                  <div className={"flex items-center justify-between"}>
                    <div className="w-full mr-5">
                      <div style={{ color: this.state.titleColor }}>
                        T???ng s??? l?????ng
                      </div>
                      <Input
                        value={this.state.sumQuatity}
                        name="sumQuatity"
                        style={{
                          background: "#cccccc",
                        }}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className={"w-full mr-5"}>
                      <div style={{ color: this.state.titleColor }}>
                        T???ng ti???n
                      </div>
                      <Input
                        value={this.state.sumMoney}
                        name="sumMoney"
                        style={{
                          background: "#cccccc",
                        }}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={"flex items-center justify-between"}>
                    <div className="w-full mr-5">
                      <div style={{ color: this.state.titleColor }}>
                        % chi???t kh???u
                      </div>
                      <Input
                        value={this.state.rdtnRate}
                        name="rdtnRate"
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className={"w-full mr-5"}>
                      <div style={{ color: this.state.titleColor }}>
                        S??? ti???n chi???t kh???u
                      </div>
                      <Input
                        name="rdtnCram"
                        value={this.state.rdtnCram}
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className={"w-full"}>
                      <div style={{ color: this.state.titleColor }}>
                        % Hoa h???ng kh??ch h??ng
                      </div>
                      <Input
                        name="cscrRate"
                        value={this.state.cscrRate}
                        onChange={this.handleInputChange}
                      />
                    </div>
                  </div>
                  <div className={"flex items-center justify-between"}>
                    <div className="w-full mr-5">
                      <div style={{ color: this.state.titleColor }}>
                        M?? s??? thu???
                      </div>
                      <Input
                        value={this.state.taxCode}
                        name="taxCode"
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className={"w-full mr-5"}>
                      <div style={{ color: this.state.titleColor }}>
                        Thu??? xu???t
                      </div>
                      <Input
                        value={this.state.vatRate}
                        name="vatRate"
                        onChange={this.handleInputChange}
                      />
                    </div>
                    <div className={"w-full"}>
                      <div style={{ color: this.state.titleColor }}>
                        S??? ti???n thu???
                      </div>
                      <Input
                        value={this.state.vatCram}
                        onChange={this.handleInputChange}
                        name="vatCram"
                      />
                    </div>
                  </div>
                  <div className="w-full">
                    <div className="flex justify-between">
                      <div className="w-full mr-5">
                        <div style={{ color: this.state.titleColor }}>
                          Ph????ng th???c thanh to??n
                        </div>
                        <ComboBox
                          style={{
                            width: "300px",
                          }}
                          textField="ITEMNAME"
                          dataItemKey="ITEMCODE"
                          data={this.state.paymentMethods}
                          allowCustom={true}
                          onChange={(e) => {
                            //setselectedPaymentMethod(e.value);
                          }}
                        />
                      </div>
                      <div className={"w-full"}>
                        <div style={{ color: this.state.titleColor }}>
                          K??? thanh to??n
                        </div>
                        <div className={"flex justify-between"}>
                          <Input />
                          <div className={"ml-5"}>
                            <ComboBox
                              style={{
                                width: "300px",
                              }}
                              textField="ITEMNAME"
                              dataItemKey="ITEMCODE"
                              data={this.state.paymentCycles}
                              allowCustom={true}
                              onChange={(e) => {
                                //setselectedTimeCycle(e.value);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div style={{ color: "blue" }} className={"ml-7 pt-5"}>
              Th??ng tin giao h??ng
            </div>
            <div className="flex justify-between mt-5 pr-5">
              <div className="w-full pl-5">
                <div className="flex justify-between">
                  <div className="w-full mr-5">
                    <div style={{ color: this.state.titleColor }}>
                      Ph????ng th???c giao h??ng
                    </div>
                    <ComboBox
                      style={{
                        width: "300px",
                      }}
                      textField="ITEMNAME"
                      dataItemKey="ITEMCODE"
                      data={this.state.deliveryMethods}
                      allowCustom={true}
                      onChange={(e) => {
                        //setselectedDeliveryMethod(e.value);
                      }}
                    />
                  </div>
                  <div className={"w-full mr-5"}>
                    <div style={{ color: this.state.titleColor }}>
                      Ph????ng th???c v???n chuy???n
                    </div>
                    <ComboBox
                      style={{
                        width: "300px",
                      }}
                      textField="ITEMNAME"
                      dataItemKey="ITEMCODE"
                      data={this.state.deliveryTypes}
                      allowCustom={true}
                      onChange={(e) => {
                        //setselectedDeliveryType(e.value);
                      }}
                    />
                  </div>
                  <div className={"w-full"}>
                    <div style={{ color: this.state.titleColor }}>
                      Ng??y gi??? giao h??ng
                    </div>
                    <div className={"flex"}>
                      <div className={"mr-5 justify-between"}>
                        <ComboBox
                          textField="ITEMNAME"
                          dataItemKey="ITEMCODE"
                          data={this.state.deliveryTimes}
                          onChange={(e) => {
                            //setselectedDeliveryTime(e.value);
                          }}
                          allowCustom={true}
                        />
                      </div>
                      <DatePicker
                        defaultValue={this.state.orderDate}
                        defaultShow={false}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <div className="w-full mr-5">
                    <div style={{ color: this.state.titleColor }}>
                      Ng?????i nh???n h??ng
                    </div>
                    <Input
                      name="recvEmp"
                      value={this.state.recvEmp}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className={"w-full mr-5"}>
                    <div style={{ color: this.state.titleColor }}>
                      S??? ??i???n tho???i nh???n h??ng
                    </div>
                    <Input
                      name="recvTel"
                      value={this.state.recvTel}
                      onChange={this.handleInputChange}
                    />
                  </div>
                  <div className="w-full">
                    <div style={{ color: this.state.titleColor }}>N??i giao</div>
                    <Input
                      name="dlvPlace"
                      value={this.state.dlvPlace}
                      onChange={this.handleInputChange}
                    />
                  </div>
                </div>
                <div className={"w-full mr-5"}>
                  <div style={{ color: this.state.titleColor }}>
                    ?????a ch??? giao
                  </div>
                  <Input
                    name="dlvAddr"
                    value={this.state.dlvAddr}
                    onChange={this.handleInputChange}
                  />
                </div>
              </div>
            </div>
          </div>
          <div>
            <div style={{ color: "blue" }} className={"ml-7 flex"}>
              File ????nh k??m
            </div>
            <div
              className={"flex items-center justify-between pl-10 mt-3 mb-3"}
            >
              <GrAttachment />
            </div>
          </div>

          <div className="">
            <div style={{ color: "blue" }} className={"ml-7 flex"}>
              Danh s??ch s???n ph???m
            </div>
            <ComboBox
              style={{
                width: "300px",
              marginLeft:"10px"
              }}
              data={this.state.products}
              textField="PRDCNAME"
              dataItemKey="PRDCCODE"
              allowCustom={true}
            />
            <div className={"flex items-center justify-between mt-3"}>
              <Grid
                style={{
                  height: "400px",
                }}
                data={this.state.products}
                editField="inEdit"
              >
                <GridToolbar>
                  <button
                    title="Th??m m???i"
                    className="k-button k-button-md k-rounded-md k-button-solid k-button-solid-primary"
                  >
                    Th??m m???i
                  </button>
                </GridToolbar>
                <GridColumn
                  field="PRDCCODE"
                  title="M?? s???n ph???m"
                  width="150px"
                  editable={false}
                />
                <GridColumn
                  field="PRDCNAME"
                  title="T??n s???n ph???m"
                  width="200px"
                  editable={false}
                />
                <GridColumn field="sortSale" title="Ph??n lo???i" width="300px" />
                <GridColumn field="amount" title="S??? l?????ng" editor="numeric" />
                <GridColumn field="PRCESALE" title="Gi?? b??n" editor="numeric" />
                <GridColumn
                  field="discount"
                  title="Chi???t kh???u"
                  editor="numeric"
                />
                <GridColumn field="money" title="Th??nh ti???n" editable={false} />
              </Grid>
            </div>
          </div>
        </div>
      </>
    );
  }
}
