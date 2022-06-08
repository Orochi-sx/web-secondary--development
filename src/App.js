import React, { Component } from "react";
// import { Table, Button, message } from "antd";
import { normalizeData } from "./normalizeData";
import imgUrl from "./img/BK.png";
import "./app.less";
import {
  registerStore,
  getBlockData,
  getBlockVariables,
} from "@njsdata/bigscreen-sdk";
export default class App extends Component {
  divRef = null;
  state = {
    voidList: [],
    spbfData: {},
    SPsetInterval: undefined,
    listD: [],
    rotationTime: 1,
    lineNum: 4,
    data: [
      ["1212", "7686"],
      ["4", "1217867212"],
      ["1212", "121212"],
      ["786", "6786"],
    ],
    rowId: "",
    idx1: 0,
    idx2: 1,
    id: "",
    height: '120px'
  };
  fnref = (el) => {
    this.divRef = el;
  };

  lserceen = React.createRef()
  handleClose() {
    this.setState({
      dialogVisible: false,
    });

    this.addSetInterval();
  }

  addSetInterval() {

    const { listD = [], rotationTime = 3 } = this.state;

    if (listD.length >= 2) {
      this.remSetInterval();
      const SPsetInterval = setInterval(() => {

        this.nextPage(false);
      }, rotationTime * 1000);
      this.setState({
        SPsetInterval,
      });
    }
  }
  remSetInterval() {
    clearInterval(this.state.SPsetInterval);
  }
  proPage() {
    const { listD = [] } = this.state;
    let list = listD;
    if (list.length >= 2) {
      list.unshift(list[list.length - 1]);
      list.pop();
      this.setState({
        listD: list,
      });
      // this.addSetInterval();
    }
  }
  nextPage(bol) {
    const { listD = [] } = this.state;
    let list = listD;
    if (list.length >= 2) {
      if (bol) {
        this.addSetInterval();
      }
      list.push(list[0]);
      list.shift();
      this.setState({
        listD: list,
      });
    }
  }
  componentWillMount() {
    try {
      const varibale = getBlockVariables()
      let lineNum = JSON.parse(varibale.default_value).lineNum

      let rotationTime = JSON.parse(varibale.default_value).rotationTime
      this.setState({
        lineNum,
        rotationTime
      })
    }
    catch (e) {
      console.log(e);
    }


  }
  componentDidMount() {
    console.log(getBlockData(), "getBlockData");
    console.log(getBlockVariables(), "getBlockVariables");
    const { pubSub } = this.props;
    console.log(this.props);
    let data = getBlockData()



    if (data.length == 0) {
      data = [
        ["1212", "7686"],
        ["4", "1217867212"],
        ["1212", "121212"],
        ["786", "6786"],
      ]
    }
    let i = 0;
    let c = 0
    let tmpe = [];
    let { listD } = this.state
    if (data.length < this.state.lineNum) {
      listD.push(data)
    } else {
      const a = parseInt(data.length / this.state.lineNum)
      data.forEach((item) => {
        i++;
        tmpe.push(item);
        if (this.state.lineNum == i) {
          i = 0;
          c++
          listD.push(tmpe);
          tmpe = [];
        }
      });
      if (tmpe.length != 0) {
        listD.push(tmpe);
      }
    }
    this.setState({
      listD,

    },
      () => this.addSetInterval())
    pubSub &&
      pubSub.subscribe(

      );

    const events = [
    ];

    const actions = [
    ];

    window.componentCenter?.register &&
      window.componentCenter.register(this.props.componentId, "comp", this, {
        events,
        actions,
      });
    this.props?.updateProcess && this.props.updateProcess();

    this.Event_Center_getName = () => {
      return "轮播图";
    };
  }

  componentWillUnmount() {
    this.remSetInterval()
  }
  render() {
    const { listD, lineNum, idx1, idx2 } = this.state;
    console.log(listD);
    return (
      <div className="chkj_lunbo" >
        <div className="chkj_title" >专业考核指标</div>
        <div className="pageCenter">



          {
            listD.map((item, index) => {
              return (
                <div key={index} className='Iitem'>
                  {
                    item.map((item2, i) => {
                      return (
                        <div
                          key={i}
                          className={`def ${lineNum == 5 ? 'five' : null}  ${lineNum == 6 ? 'six' : null}`}
                        >
                          <div className="vive">
                            <img
                              style={{ width: "100%", height: "100%" }}
                              src={imgUrl}

                              alt=""
                            />
                          </div>
                          <div className="sp_title" style={{ textAlign: "center" }}>
                            <span
                            >
                              {item2[0]}
                            </span>
                          </div>
                          <div className="sp_title2" style={{ textAlign: "center" }}>
                            <span
                            >
                              {item2[1]}
                            </span>
                          </div>
                        </div>)

                    })

                  }
                </div>
              )


            }


            )
          }
        </div>

      </div >
    );
  }
}
