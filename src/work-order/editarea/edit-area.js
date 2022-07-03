import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, InputNumber, message, Row, Col, TreeSelect, Select } from "antd";
import { DropTarget } from "react-dnd";
import {
  queryUserAll,
  AuthorityUser,
  // queryOfficeDelCreateMember,
  queryWorkStations,
  queryFestivalDays,
  saveDispatch,
  queryWorkTime,
  queryCurrentOfficeUsers,
  insideDispatch,
  queryUserInfoByID,
  updateDispatchDate,
  insideDispatchInsert,
  logicDelete,
  updateDispStatus,
} from "../../api/index";
import moment from "moment";
import "./edit-area.less";
import cloneDeep from "lodash.clonedeep";
import { DeleteOutlined, FormOutlined } from "@ant-design/icons";
import isMobile from "../is-mobile";
const { Option } = Select;
const borderColors = ["#8080FF", "#F59A23", "#EC808D", "#797979", "#FFFF00", "#FF0000", "#00FF00", "#00FFFF", "#FF00FF", "#000080"];
const bgColors = ["#8080FF", "#F59A23", "#EC808D", "#797979", "#FFFF00", "#FF0000", "#00FF00", "#00FFFF", "#FF00FF", "#000080"];
// const fontColors = [
//   '#8080FF',
//   '#F59A23',
//   '#EC808D',
//   '#797979',
//   '#FFFF00',
//   '#FF0000',
//   '#00FF00',
//   '#00FFFF',
//   '#FF00FF',
//   '#000080',
// ];
class EditArea extends Component {
  static propTypes = {
    machine: PropTypes.object,
    station: PropTypes.object,
    setStationInfo: PropTypes.func,
    batchId: PropTypes.string,
    selectedStation: PropTypes.array,
    queryProInfo: PropTypes.func,
    isDraging: PropTypes.bool,
  };
  formRef = React.createRef();
  state = {
    userId: null,
    userList: [],
    resultData: [],
    stationInfo: [],
    baseTimeLine: [], // {time: 1636819200000, isFestivalDay: false}
    baseTimeLen: 16,
    editblockInfoVisible: false,
    readyBlockInfo: {
      dragsource: {},
      droptarget: {},
    },
    durtionInput: 1,
    personInput: {},
    workTypeInput: {},
    workTypeInputShow: false,
    neibuPerson: [],
    weituoPerson: [],
    blockColors: {}, // 相同零件保持相同颜色
    clickFlag: {},
    hoverStation: {},
    hoverTime: {},
    workTime: "",
    acceptInfo: {},
    sourceInfo: {
      proInfo: {},
      instInfo: {},
    },
    nowStation: {},
    isEditing: false,
  };
  componentDidMount() {
    this.loadData();
    AuthorityUser((data) => {
      if (data?.id) {
        this.setState({ userId: data?.id });
        this.loadUserData(data.id);
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isDraging) {
      this.setState({
        hoverStation: {},
        hoverTime: {},
      });
    }
  }

  loadUserData = (userId) => {
    queryUserAll((data) => {
      this.setState({ userList: data });
      queryCurrentOfficeUsers(userId, (result) => {
        if (result) {
          this.transform(result);
          this.setState({
            resultData: result,
          });
        }
      });
    });
  };

  transform = (data) => {
    let _that = this;
    let createMember = this.state.userId;
    data?.forEach(function (item) {
      item.key = item.id;
      item.title = item.name;
      item.disabled = !item.user_type;

      _that.state.userList[0]?.forEach((res) => {
        if (item.key === res.officeId && res.id !== createMember) {
          if (item.children !== undefined) {
            item.children.push(res);
          }
        }
      });
      if (item.children) {
        _that.transform(item.children);
      }
    });
  };

  async loadData() {
    queryWorkStations(this.props.selectedStation?.map((item) => item.key) || [], (data) => {
      let newData = [];
      data?.forEach((item) => {
        item.isdelete === "0" && newData.push(item);
      });
      this.props.selectedStation?.length === 0 && this.props.setStationInfo({ stationInfo: newData });
      this.refreshColorSetting(newData);
      this.createTimeLine(0, () => {
        const { baseTimeLine } = this.state;
        newData?.forEach((stationItem) => {
          stationItem?.tProdDispatchList.forEach((dispatchItem) => {
            if (dispatchItem.dispEndTime > baseTimeLine[baseTimeLine.length - 1]) {
              this.createTimeLine(moment(dispatchItem.dispEndTime).diff(moment(baseTimeLine[baseTimeLine.length - 1]), "days"));
            }
            // this.isOverflowTime(dispatchItem);
          });
        });
      });
      this.setState({
        stationInfo: newData,
      });
    });
  }

  isOverflowTime(lastInfo) {
    let compareDays = 0;
    lastInfo || (lastInfo = {});
    let { overflow, overflowTime } = this.caculateFestivalTime(lastInfo.dispFromTime, lastInfo.machiningTime);
    overflow && overflowTime > compareDays && (compareDays = overflowTime);
    if (compareDays > 0) {
      this.createTimeLine(compareDays);
    }
  }
  setNowProStatus(sourceInfo, acceptInfo, nowStation) {
    if (acceptInfo) {
      this.setState({
        sourceInfo,
        acceptInfo,
        nowStation,
      });
    }
  }
  initWorkTime = async (compCode, processNo) => {
    queryWorkTime({ compCode, processNo }, (data) => {
      this.setState({
        workTime: data.workTimes,
      });
    });
  };
  /**
   * 时间基线
   */
  createTimeLine(days, callBack) {
    queryFestivalDays({}, (data) => {
      let newData = [];
      let { baseTimeLen } = this.state;
      baseTimeLen = baseTimeLen + (days || 0);
      data?.forEach((item) => {
        item?.festivalDate && newData.push(moment(item.festivalDate).format("MM-DD"));
      });
      let offsetBeforeDays = 1;
      let offsetAfterDays = 5;
      let timeLine = Array.from({ length: baseTimeLen });
      let baseTimeLine = [];

      timeLine?.forEach((item, i) => {
        if (i < 5) {
          while (
            newData.includes(
              moment()
                .startOf("day")
                .subtract(i + offsetBeforeDays, "days")
                .format("MM-DD")
            )
          ) {
            baseTimeLine.unshift({
              time: moment()
                .startOf("day")
                .subtract(i + offsetBeforeDays, "days")
                .valueOf(),
              isFestivalDay: true,
            });
            offsetBeforeDays++;
          }
          baseTimeLine.unshift({
            time: moment()
              .startOf("day")
              .subtract(i + offsetBeforeDays, "days")
              .valueOf(),
            isFestivalDay: false,
          });
        } else {
          while (
            newData.includes(
              moment()
                .startOf("day")
                .subtract(offsetAfterDays - i, "days")
                .format("MM-DD")
            )
          ) {
            baseTimeLine.push({
              time: moment()
                .startOf("day")
                .subtract(offsetAfterDays - i, "days")
                .valueOf(),
              isFestivalDay: true,
            });
            offsetAfterDays--;
          }
          baseTimeLine.push({
            time: moment()
              .startOf("day")
              .subtract(offsetAfterDays - i, "days")
              .valueOf(),
            isFestivalDay: false,
          });
        }
      });
      this.formatDay(baseTimeLine);
      this.setState({ baseTimeLen, festivalDateData: newData }, () => callBack && callBack());
    });
  }
  /**
   *
   * @returns 创建工位列表
   */
  renderStation() {
    const { stationInfo, hoverStation } = this.state;
    return (
      <>
        <div className={"title"}>{"工位"}</div>
        {stationInfo.map((item) => {
          return (
            <div className={`station-title${hoverStation?.stationId === item.stationId && this.props.isDraging ? " station-title-hovered" : ""}`} title={item.stationName}>
              {item.stationName}
            </div>
          );
        })}
      </>
    );
  }
  refreshColorSetting(stations) {
    const { blockColors } = this.state;
    stations?.forEach((station) => {
      station.tProdDispatchList?.forEach((block) => {
        if (block.compCode && !blockColors[block.compCode]) {
          // 以零件编号为属性值设定方块颜色
          let len = Object.keys(blockColors).length;
          blockColors[block.compCode] = [bgColors[(len + 1) % 12], borderColors[(len + 1) % 12]];
        }
      });
    });
    this.setState({
      blockColors,
    });
  }

  formatDay(baseTimeLine) {
    // 每天分成四个阶段，0点，6点，12点，18点四个时间点
    let formatTimeLine = cloneDeep(baseTimeLine).map((item) => {
      return [
        {
          isFestivalDay: item.isFestivalDay,
          time: moment(item.time).add(0, "h").valueOf(),
        },
        {
          isFestivalDay: item.isFestivalDay,
          time: moment(item.time).add(6, "h").valueOf(),
        },
        {
          isFestivalDay: item.isFestivalDay,
          time: moment(item.time).add(12, "h").valueOf(),
        },
        {
          isFestivalDay: item.isFestivalDay,
          time: moment(item.time).add(18, "h").valueOf(),
        },
      ];
    });
    formatTimeLine = formatTimeLine.flat();
    this.setState({ baseTimeLine: formatTimeLine });
  }

  /**
   * 编辑区渲染
   * @returns
   */
  renderSchedule() {
    const { stationInfo, baseTimeLine, blockColors, clickFlag } = this.state;
    const stepArr = ["一阶段", "二阶段", "三阶段", "四阶段"];
    let renderSchedule = stationInfo.map((item) => {
      let tProdDispatchList = cloneDeep(item?.tProdDispatchList) || [];
      let timeLine = cloneDeep(baseTimeLine);
      let mergedSchedules = cloneDeep(item);
      mergedSchedules.tProdDispatchList = [];
      while (timeLine.length) {
        let newObj = {
          dispFromTime: timeLine[0].time,
          status: "free",
          dispDoMemberId: "",
          dispDoMember: "",
          machiningTime: 1,
        };
        if (tProdDispatchList.length > 0) {
          // 根据日程信息更新工位默认状态
          let schedule = tProdDispatchList.filter((obj) => obj.dispFromTime === timeLine[0].time);
          if (schedule[0]) {
            newObj = Object.assign(newObj, {
              ...schedule[0],
              status: "used",
              partInfo: "",
              instInfo: "",
            });
          }
        }
        let { overflow, includedHolidays } = this.caculateFestivalTime(newObj.dispFromTime, newObj.machiningTime);
        newObj.includedHolidays = includedHolidays || [];
        let relMachiningTime = newObj.machiningTime;
        if (timeLine[0].isFestivalDay) {
          if (includedHolidays.length && newObj.status === "used") {
            relMachiningTime += newObj.includedHolidays.length;
          }
        } else {
          relMachiningTime += newObj.includedHolidays.length;
        }
        mergedSchedules.tProdDispatchList.push(newObj);
        overflow || (relMachiningTime && timeLine.splice(0, relMachiningTime));
      }
      return mergedSchedules;
    });

    return (
      <>
        <div className={"schedule-row"} style={{ width: "auto" }}>
          {baseTimeLine.map((timestamp, index) => {
            return (
              <div
                key={timestamp.time}
                className={`schedule-block-header${
                  this.state.hoverTime?.dispFromTime === timestamp.time && this.props.isDraging && !timestamp.isFestivalDay ? " schedule-block-header-hover" : ""
                }${timestamp.isFestivalDay ? " schedule-block-header-disabled" : ""}`}
                style={{ minWidth: "100px" }}
              >
                <div style={{ lineHeight: "25px" }}>{moment(timestamp.time).format("YYYY/MM/DD")}</div>
                <div style={{ lineHeight: "25px" }}>{stepArr[index % 4]}</div>
              </div>
            );
          })}
        </div>
        {renderSchedule.map((renderitem) => {
          return (
            <div className={"schedule-row"} style={{ width: "auto" }} key={renderitem.stationId}>
              {renderitem.tProdDispatchList.map((dispatchItem, index) => {
                if (!clickFlag[dispatchItem.processId]) {
                  clickFlag[dispatchItem.processId] = {};
                }
                let flag = clickFlag[dispatchItem.processId][dispatchItem.dispFromTime];
                if (dispatchItem.status === "used") {
                  return (
                    <div
                      key={dispatchItem.dispFromTime}
                      className={"schedule-block block-used"}
                      style={{
                        position: "relative",
                        display: "flex",
                        minWidth: 100 * (dispatchItem.machiningTime + dispatchItem.includedHolidays.length) + "px",
                        // backgroundColor: bgColors[index % 12],
                        // borderColor: borderColors[index % 12],
                      }}
                    >
                      {/* <div
                        className={"block-used-message"}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: "50%",
                          marginLeft: "-40px",
                        }}
                      >
                        {dispatchItem.compName + " " + dispatchItem.compCode}
                      </div>
                      <div
                        className={"block-used-message"}
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: "50%",
                          marginLeft: "-40px",
                        }}
                      >
                        {dispatchItem.processName + " " + dispatchItem.processNo}
                      </div> */}
                      <DropItemUsed
                        key={dispatchItem.dispFromTime}
                        station={renderitem}
                        dispatchInfo={dispatchItem}
                        dropNewOrder={this.dropNewOrder.bind(this)}
                        onTargetHover={this.onTargetHover.bind(this)}
                        setNowProStatus={this.setNowProStatus.bind(this)}
                        isHover={
                          this.state.hoverStation?.stationId === renderitem.stationId && this.state.hoverTime?.dispFromTime === dispatchItem.dispFromTime && this.props.isDraging
                        }
                      ></DropItemUsed>
                      {Array.from({
                        length: dispatchItem.machiningTime + dispatchItem.includedHolidays.length,
                      }).map((item, index) => {
                        let curTime = moment(dispatchItem.dispFromTime)
                          ?.subtract(0 - index, "days")
                          ?.valueOf();
                        return (
                          <div
                            key={dispatchItem.dispFromTime + index}
                            className={"schedule-block"}
                            style={
                              dispatchItem.includedHolidays.includes(curTime)
                                ? {
                                    flex: 1,
                                    display: "inline-block",
                                    background: "#ccc",
                                  }
                                : {
                                    flex: 1,
                                    display: "inline-block",
                                    backgroundColor: (blockColors[dispatchItem.compCode] && blockColors[dispatchItem.compCode][0]) || bgColors[0],
                                    borderColor: (blockColors[dispatchItem.compCode] && blockColors[dispatchItem.compCode][1]) || borderColors[1],
                                  }
                            }
                          >
                            {dispatchItem.includedHolidays.includes(curTime) ? "---" : ""}
                          </div>
                        );
                      })}
                      {(dispatchItem.dispStatus == "18" || dispatchItem.dispStatus == "19") && (
                        <div
                          className={`operator-layer ${isMobile ? (flag ? "" : "operator-layer-hidden") : "operator-layer-hover"}`}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            clickFlag[dispatchItem.processId][dispatchItem.dispFromTime] = !flag;
                            this.setState({ clickFlag });
                          }}
                          onMouseDown={(e) => {
                            if (!flag) {
                              clickFlag[dispatchItem.processId][dispatchItem.dispFromTime] = true;
                              this.setState({ clickFlag });
                            }
                          }}
                        >
                          <div
                            className={"operator"}
                            onClick={(e) => {
                              this.deleteBlockOrder(
                                e,
                                {
                                  stationId: renderitem.stationId,
                                  ...dispatchItem,
                                },
                                () => {
                                  clickFlag[dispatchItem.processId][dispatchItem.dispFromTime] = !flag;
                                  this.setState({ clickFlag });
                                }
                              );
                            }}
                          >
                            <DeleteOutlined />
                          </div>
                          <div
                            className={"operator"}
                            onClick={(e) => {
                              (dispatchItem.dispStatus == "18" || dispatchItem.dispStatus == "19") &&
                                this.editBlockOrder(dispatchItem, renderitem, () => {
                                  clickFlag[dispatchItem.processId][dispatchItem.dispFromTime] = !flag;
                                  this.setState({ clickFlag });
                                });
                            }}
                          >
                            <FormOutlined />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                } else if (dispatchItem.includedHolidays.length === 0) {
                  return (
                    <DropItem
                      key={dispatchItem.dispFromTime}
                      station={renderitem}
                      dispatchInfo={dispatchItem}
                      dropNewOrder={this.dropNewOrder.bind(this)}
                      onTargetHover={this.onTargetHover.bind(this)}
                      setNowProStatus={this.setNowProStatus.bind(this)}
                      isHover={
                        this.state.hoverStation?.stationId === renderitem.stationId && this.state.hoverTime?.dispFromTime === dispatchItem.dispFromTime && this.props.isDraging
                      }
                    />
                  );
                } else {
                  return (
                    <div key={dispatchItem.dispFromTime} className="schedule-block" style={{ minWidth: "100px", background: "#ccc" }}>
                      ---
                    </div>
                  );
                }
              })}
            </div>
          );
        })}
      </>
    );
  }

  caculateFestivalTime(dispFromTime, machiningTime) {
    const { baseTimeLine } = this.state;
    let includedHolidays = [];
    let endTime = baseTimeLine.find((line) => {
      if (!(line.time < dispFromTime)) {
        if (!line.isFestivalDay) {
          machiningTime--;
        } else {
          includedHolidays.push(line.time);
        }
      }
      return machiningTime === 0;
    });
    if (machiningTime > 0) {
      return {
        overflow: true,
        overflowTime: machiningTime,
        includedHolidays,
      };
    } else {
      return {
        overflow: false,
        endTime,
        includedHolidays,
      };
    }
  }
  dropNewOrder(dragsource, droptarget) {
    this.initWorkTime(dragsource?.instInfo?.compCode, dragsource?.proInfo?.processCode);
    this.setState({
      editblockInfoVisible: true,
      isEditing: false,
      neibuPerson: [],
      weituoPerson: [],
      workTypeInput: {},
      readyBlockInfo: {
        dragsource,
        droptarget,
      },
    });
    if (droptarget.dataId) {
      this.setState({
        workTypeInput: {
          key: 1,
          label: "委托派工",
        },
      });
      let message = this.state.nowStation.stationType;
      queryUserInfoByID(message, (res) => {
        this.setState({
          weituoPerson: res,
        });
      });
    }
  }
  onTargetHover(station, dispatchInfo) {
    if (station?.stationId !== this.state.hoverStation?.stationId) {
      this.setState({
        hoverStation: station,
      });
    }
    if (dispatchInfo?.dispFromTime !== this.state.hoverTime?.dispFromTime) {
      this.setState({
        hoverTime: dispatchInfo,
      });
    }
  }
  selectTypeChange(value) {
    if (value.key == "0") {
      insideDispatch((res) => {
        this.setState({
          neibuPerson: res,
        });
      });
    } else {
      let message = this.state.nowStation.stationType;
      queryUserInfoByID(message, (res) => {
        this.setState({
          weituoPerson: res,
        });
      });
    }
    this.setState({
      workTypeInput: value,
      personInput: {},
    });
  }
  editBlockOrder(block, renderitem, callback) {
    console.log("=========>编辑接收到的信息(单元格)", block);
    console.log("=========>编辑接收到的信息(工位)", renderitem);
    const { readyBlockInfo } = this.state;
    readyBlockInfo.dragsource = {
      proInfo: block.proInfo,
      instInfo: block.instInfo,
    };
    readyBlockInfo.droptarget = {
      dispFromTime: block.dispFromTime,
      status: block.status,
      dataId: block.dataId,
      machiningTime: block.machiningTime,
      dispDoMemberId: block.dispDoMemberId,
      dispDoMember: block.dispDoMember,
      stationId: block.dispWorkStationId,
      stationCode: block.dispWorkStationName,
      stationName: block.dispWorkStationNo,
      compCode: block.compCode,
      compName: block.compName,
      processNo: block.processNo,
      processName: block.processName,
      processId: block.processId,
    };
    this.initWorkTime(block?.instInfo?.compCode, block?.proInfo?.processCode);
    if (block.dispType == "0") {
      insideDispatch((res) => {
        this.setState({
          neibuPerson: res,
        });
      });
    } else {
      let message = block.stationType;
      queryUserInfoByID(message, (res) => {
        this.setState({
          weituoPerson: res,
        });
      });
    }
    this.setState(
      {
        readyBlockInfo,
        editblockInfoVisible: true,
        durtionInput: block.machiningTime,
        isEditing: true,
        workTypeInput: { key: block.dispType, label: block.dispType == "0" ? "内部派工" : "委托派工" },
        personInput: { key: block.dispDoMemberId, value: block.dispDoMember },
      },
      () => callback && callback()
    );
  }
  deleteBlockOrder(e, deleteblock, callback) {
    console.log("=======>删除拿到的数据", deleteblock);
    e.stopPropagation();
    const { stationInfo } = this.state;
    stationInfo.find(
      (stationItem, stationIndex) =>
        stationItem.stationId === deleteblock.stationId &&
        stationItem?.tProdDispatchList?.find(
          (dispatchItem, dispatchIndex) => dispatchItem.dispFromTime === deleteblock.dispFromTime && stationInfo[stationIndex].tProdDispatchList.splice(dispatchIndex, 1)
        )
    );

    this.props.relayoutSideList({
      delInfo: deleteblock?.proInfo || { processId: deleteblock.processId },
    });
    this.setState(
      {
        stationInfo,
      },
      () => callback && callback()
    );
    let message = {
      dataId: deleteblock.dataId,
      dispStatus: deleteblock.dispStatus,
      dispType: deleteblock.dispType,
    };
    console.log("=======>删除时的入参", message);
    logicDelete(message, (data) => {});
    this.loadData();
  }
  changeTimeFormat(time) {
    var date = new Date(time);
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var hh = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    var mm = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    return date.getFullYear() + "-" + month + "-" + currentDate + " " + hh + ":" + mm;
  }
  handleOk() {
    const { readyBlockInfo, durtionInput, personInput, nowStation, workTypeInput, isEditing } = this.state;
    console.log(readyBlockInfo);
    if (this.validateFormValues()) {
      readyBlockInfo.droptarget.machiningTime = durtionInput;
      readyBlockInfo.droptarget.dispDoMemberId = personInput.key;
      readyBlockInfo.droptarget.dispDoMember = personInput.value;
      this.setState(
        {
          editblockInfoVisible: false,
          readyBlockInfo,
          durtionInput: 1,
          personInput: {},
          hoverStation: {},
          hoverTime: {},
        },
        () => {
          this.setBlockOrder();
        }
      );
    }
    let message = {
      disp_do_member_id: personInput.key,
      disp_do_member: personInput.value,
      disp_work_Station_id: readyBlockInfo.droptarget.stationId,
      disp_work_Station_no: readyBlockInfo.droptarget.stationCode,
      disp_work_Station_name: readyBlockInfo.droptarget.stationName,
      machining_time: this.state.durtionInput,
      disp_starttime: this.changeTimeFormat(readyBlockInfo.droptarget.dispFromTime),
      disp_endtime: this.changeTimeFormat(readyBlockInfo.droptarget.dispFromTime + 3600000 * this.state.durtionInput * 6),
      disp_submit_time: this.changeTimeFormat(new Date() - 0),
      disp_num: 0,
      disp_stage: "",
    };
    // 内部派工
    if (workTypeInput.key == 0) {
      // 是否编辑
      if (isEditing) {
        message.dataId = readyBlockInfo.droptarget.dataId;
        message.compCode = readyBlockInfo.droptarget.compCode;
        message.compName = readyBlockInfo.droptarget.compName;
        message.processNo = readyBlockInfo.droptarget.processNo;
        message.processName = readyBlockInfo.droptarget.processName;
        message.processId = readyBlockInfo.droptarget.processId;
        message.disp_type = "0";
        console.log("=====》内部派工编辑出参", message);
        updateDispatchDate(message, (data) => {
          console.log(data);
        });
        return this.loadData();
      } else {
        message.dataId = readyBlockInfo.dragsource.proInfo.dataId;
        message.ins_id = readyBlockInfo.dragsource.proInfo.insId;
        message.compCode = readyBlockInfo.dragsource.proInfo.compCode;
        message.compName = readyBlockInfo.dragsource.proInfo.compName;
        message.processNo = readyBlockInfo.dragsource.proInfo.processCode;
        message.processName = readyBlockInfo.dragsource.proInfo.processName;
        message.processId = readyBlockInfo.dragsource.proInfo.processId;
        message.disp_status = 18;
        message.disp_type = "0";
        console.log("=====》内部派工新增出参", message);
        updateDispatchDate(message, (data) => {
          console.log(data);
        });
        return this.loadData();
      }
      //委托派工
    } else {
      // 是否编辑
      if (isEditing) {
        message.status = 1;
        message.dataId = readyBlockInfo.droptarget.dataId;
        message.compCode = readyBlockInfo.droptarget.processNo;
        message.compName = readyBlockInfo.droptarget.compName;
        message.processNo = readyBlockInfo.droptarget.processCode;
        message.processName = readyBlockInfo.droptarget.processName;
        message.processId = readyBlockInfo.droptarget.processId;
        message.disp_type = "1";
        console.log("=====》委托派工编辑出参", message);
        updateDispatchDate(message, (data) => {
          console.log(data);
        });
        return this.loadData();
      } else {
        message.dataId = readyBlockInfo.dragsource.proInfo.dataId;
        message.ins_id = readyBlockInfo.dragsource.proInfo.insId;
        message.compCode = readyBlockInfo.dragsource.proInfo.compCode;
        message.compName = readyBlockInfo.dragsource.proInfo.compName;
        message.processNo = readyBlockInfo.dragsource.proInfo.processCode;
        message.processName = readyBlockInfo.dragsource.proInfo.processName;
        message.processId = readyBlockInfo.dragsource.proInfo.processId;
        message.disp_status = 19;
        message.disp_type = "1";
        // 是否新增到委托1
        if (readyBlockInfo.droptarget.dataId) {
          message.entrust_parent_id = readyBlockInfo.droptarget.dataId;
          message.disp_status = 20;
        }
        console.log("=====》委托派工新增出参", message);
        insideDispatchInsert(
          message,
          (data) => {
            this.loadData();
            message.success("提交信息成功。");
          },
          (err) => {
            message.error("提交信息失败！");
            this.loadData();
          }
        );
      }
    }
  }
  cancelEditModel() {
    this.setState({
      editblockInfoVisible: false,
      durtionInput: 1,
      personInput: {},
      hoverStation: {},
      hoverTime: {},
      workTime: "",
    });
  }
  setBlockOrder() {
    const {
      stationInfo,
      readyBlockInfo: { dragsource, droptarget },
      blockColors,
    } = this.state;
    let isRender = false;
    for (let i = 0; i < stationInfo.length; i++) {
      if (stationInfo[i].stationId === droptarget.stationId) {
        // 工位对应
        let flag = "new";
        if (!stationInfo[i].tProdDispatchList) {
          stationInfo[i].tProdDispatchList = [];
        }
        for (let j = 0, blocks = stationInfo[i]?.tProdDispatchList || []; j < blocks.length; j++) {
          if (blocks[j].dispFromTime && blocks[j].dispFromTime === droptarget.dispFromTime) {
            // 编辑更新操作
            let { machiningTime, dispDoMemberId, dispDoMember } = droptarget;
            let oldMachiningTime = blocks[j].machiningTime;
            blocks[j].machiningTime = machiningTime;
            isRender = this.relayoutAllRowBlockOrders(blocks, droptarget.dispFromTime);
            if (isRender) {
              //正确则把其他属性加上
              blocks[j].dispDoMemberId = dispDoMemberId;
              blocks[j].dispDoMember = dispDoMember;
            } else {
              //错误则把时长撤销
              blocks[j].machiningTime = oldMachiningTime;
            }
            flag = "edit";
          }
        }
        if (flag === "new") {
          // 新增操作
          let newDispatch = {
            status: "used",
            machiningTime: droptarget.machiningTime,
            dispFromTime: droptarget.dispFromTime,
            dispDoMemberId: droptarget.dispDoMemberId,
            dispDoMember: droptarget.dispDoMember,
            compCode: dragsource.instInfo.compCode, //特殊处理 用于展示派工单相关信息
            compName: dragsource.instInfo.compName,
            processId: dragsource.proInfo.processId,
            processNo: dragsource.proInfo.processCode,
            processName: dragsource.proInfo.processName,
            proInfo: dragsource.proInfo,
            instInfo: dragsource.instInfo,
            isnew: 1,
          };
          isRender = this.relayoutAllRowBlockOrders([...stationInfo[i].tProdDispatchList, newDispatch], droptarget.dispFromTime);
          isRender && stationInfo[i].tProdDispatchList.push(newDispatch);
          // 新拖动工序，更新零件颜色配置
          if (isRender && dragsource?.instInfo?.compCode && !blockColors[dragsource.instInfo.compCode]) {
            let len = Object.keys(blockColors).length;
            blockColors[dragsource.instInfo.compCode] = [bgColors[(len + 1) % 12], borderColors[(len + 1) % 12]];
          }
          this.props.relayoutSideList({ addInfo: dragsource.proInfo });
        }
        this.isOverflowTime(stationInfo[i]?.tProdDispatchList[stationInfo[i]?.tProdDispatchList.length - 1]);
        break;
      }
    }
    isRender &&
      this.setState(
        {
          stationInfo,
          blockColors,
        },
        () => {
          this.renderSchedule();
        }
      );
  }
  relayoutAllRowBlockOrders(arr, dispFromTime) {
    let tProdDispatchList = cloneDeep(arr);
    let isRender = true;
    for (let i = 0; i < tProdDispatchList.length - 1; i++) {
      // 按起始时间从小到大排序
      for (let j = 0; j < tProdDispatchList.length - 1 - i; j++) {
        if (tProdDispatchList[j].dispFromTime > tProdDispatchList[j + 1].dispFromTime) {
          // 相邻元素两两对比
          let temp = tProdDispatchList[j + 1]; // 元素交换
          tProdDispatchList[j + 1] = tProdDispatchList[j];
          tProdDispatchList[j] = temp;
        }
      }
    }

    for (let k = 0; k < tProdDispatchList.length - 1; k++) {
      if (tProdDispatchList[k].dispFromTime < dispFromTime) {
        // 更改项前的block跳过
        continue;
      }
      let { overflow, endTime, overflowTime } = this.caculateFestivalTime(tProdDispatchList[k].dispFromTime, tProdDispatchList[k].machiningTime);
      if (overflow) {
        this.createTimeLine(overflowTime);
      } else {
        let compareRes = tProdDispatchList[k + 1].dispFromTime - endTime;
        if (compareRes > 0 || compareRes === 0) {
          // 前一个endtime小于后一个dispFromTime，后续block不用再变更位置
          break;
        }
        if (compareRes < 0) {
          message.error("时长超出，占用到已派发任务！");
          isRender = false;
        }
      }
    }
    return isRender;
  }

  durtionInputChange(value) {
    this.setState({
      durtionInput: value,
    });
  }
  personInputChange(key) {
    this.setState({
      personInput: key,
    });
  }

  validateFormValues() {
    const { durtionInput, personInput } = this.state;
    if (!durtionInput) {
      message.error("时长不能为空", 2);
      return false;
    }
    if (!personInput?.key) {
      message.error("加工人不能为空", 2);
      return false;
    }
    return true;
  }
  async submitAll() {
    const { stationInfo } = this.state;
    let allStation = cloneDeep(stationInfo);
    let addarr = [];
    allStation?.forEach((stationItem) => {
      stationItem?.tProdDispatchList?.forEach((item) => {
        // if (!item.dataId) {
        //   let block = {};
        //   block.tBsWorkStation = cloneDeep(stationItem); //工位信息
        //   block.tProdInstruction = cloneDeep(item.instInfo); //生产任务
        //   block.tProdInstructionProsroute = cloneDeep(item.proInfo); //工序信息
        //   const { dispDoMemberId, dispDoMember, dispFromTime, machiningTime } = item;
        //   block.tProdDispatch = {
        //     dispDoMemberId,
        //     dispDoMember,
        //     dispFromTime,
        //     machiningTime,
        //     dispEndTime: this.caculateFestivalTime(dispFromTime, machiningTime)?.endTime?.time,
        //   };
        if (item.dispStatus) {
          if (item.dispStatus == "18" || item.dispStatus == "19") {
            let block = {};
            block.dataId = item.dataId;
            if (item.workTypeId == "0") {
              block.status = 1;
            } else {
              if (item.dispStatus == "3") {
                block.status = 14;
              } else {
                block.status = 2;
              }
            }
            addarr.push(block);
          }
        }
      });
    });
    console.log("=======>删除提交的出参", addarr);
    updateDispStatus(
      addarr,
      (data) => {
        message.success("提交信息成功。");
        this.loadData();
        this.props.queryProInfo();

        // 返回上一个页面
        setTimeout(() => {
          // eslint-disable-next-line no-script-url
          window.location.href = "javascript:history.go(-1)";
        }, 200);
      },
      (err) => {
        message.error("提交信息失败！");
        this.loadData();
      }
    );
  }
  render() {
    const { editblockInfoVisible, durtionInput, personInput, stationInfo, workTime, workTypeInput, sourceInfo, isEditing } = this.state;
    const workTypeOption = [
      { key: 0, name: "内部派工" },
      // { key: 1, name: "委托派工" },
    ];
    const workTypeOptionOnly = [{ key: 1, name: "委托派工" }];
    return (
      <div className={"work-orders-edit-area-wrapper"}>
        <div className={"left-area"} style={{ height: (stationInfo.length + 1) * 50 + "px" }}>
          {this.renderStation()}
        </div>
        <div className={"area-content"} style={{ height: (stationInfo.length + 1) * 50 + "px" }}>
          {this.renderSchedule()}
        </div>

        <Modal
          title="编辑"
          visible={editblockInfoVisible}
          okText={"确认"}
          cancelText={"取消"}
          onOk={this.handleOk.bind(this)}
          onCancel={this.cancelEditModel.bind(this)}
          bodyStyle={{ marginBottom: 24 }}
        >
          <div style={{ lineHeight: "32px" }}>
            <Row style={{ marginBottom: "10px" }}>
              <Col span={6}>生产时长:</Col>
              <Col span={6}>
                <InputNumber min={1} value={durtionInput} onChange={this.durtionInputChange.bind(this)} />
              </Col>
              {workTime && (
                <Col offset={1} span={11}>
                  参考加工时长:
                  <span style={{ margin: "0 10px" }}>{workTime || 0}</span>
                  小时
                </Col>
              )}
            </Row>
            <Row style={{ marginBottom: "10px" }}>
              <Col span={6}>派工类型:</Col>
              <Col span={18}>
                <Select
                  disabled={isEditing ? true : false}
                  style={{ width: "100%", display: sourceInfo.proInfo.dispStatus !== "3" ? "block" : "none" }}
                  labelInValue
                  placeholder={"请选择"}
                  value={workTypeInput?.label}
                  onChange={this.selectTypeChange.bind(this)}
                >
                  {workTypeOption.map((item, index) => {
                    return (
                      <Option value={item.key} key={index}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
                <Select
                  disabled={isEditing ? false : true}
                  style={{ width: "100%", display: sourceInfo.proInfo.dispStatus == "3" ? "block" : "none" }}
                  labelInValue
                  placeholder={"请选择"}
                  value={workTypeInput?.label}
                  onChange={this.selectTypeChange.bind(this)}
                >
                  {workTypeOptionOnly.map((item, index) => {
                    return (
                      <Option value={item.key} key={index}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
            <Row>
              <Col span={6} style={{ display: workTypeInput.key == 1 && sourceInfo.proInfo.dispStatus !== "3" ? "block" : "none" }}>
                单元长:
              </Col>
              <Col
                span={6}
                style={{
                  display: workTypeInput.key == 0 || !workTypeInput.key || (sourceInfo.proInfo.dispStatus == "3" && workTypeInput.key == 1) ? "block" : "none",
                }}
              >
                加工人:
              </Col>
              <Col span={18}>
                <Select
                  style={{ width: "100%", display: workTypeInput.key == 0 || !workTypeInput.key ? "block" : "none" }}
                  labelInValue
                  placeholder={"请选择"}
                  value={personInput?.value}
                  onChange={this.personInputChange.bind(this)}
                >
                  {this.state.neibuPerson.map((item, index) => {
                    return (
                      <Option value={item.name} key={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
                <Select
                  style={{ width: "100%", display: workTypeInput.key == 1 ? "block" : "none" }}
                  labelInValue
                  placeholder={"请选择"}
                  value={personInput?.value}
                  onChange={this.personInputChange.bind(this)}
                >
                  {this.state.weituoPerson.map((item, index) => {
                    return (
                      <Option value={item.name} key={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

export default EditArea;

const targetObj = {
  hover(props, monitor, component) {
    const { station, onTargetHover, dispatchInfo } = props;
    onTargetHover(station, dispatchInfo);
  },
  drop(props, monitor, component) {
    const { station, dispatchInfo, dropNewOrder, setNowProStatus } = props;
    console.log("===============》接受源工位信息(空闲)", station);
    console.log("===============》接受源单元格信息(空闲)", dispatchInfo);
    let sourceInfo = monitor.getItem();
    console.log("===============》接受源接收到的左边工序所属任务信息", sourceInfo.instInfo);
    console.log("===============》接受源接收到的左边工序信息", sourceInfo.proInfo);
    setNowProStatus(sourceInfo, dispatchInfo, station);
    dropNewOrder(sourceInfo, {
      stationName: station.stationName,
      stationId: station.stationId,
      stationCode: station.stationCode,
      stationType: station.stationType,
      ...dispatchInfo,
    });
  },
  canDrop(props, monitor) {
    if (monitor.getItem().proInfo.dispStatus && monitor.getItem().proInfo.dispStatus == "3") {
      return false;
    } else {
      return true;
    }
    // 在此处可以获取到拖拽的组件类型，从而增加一些是否可以放置的条件
  },
};
@DropTarget("BOX", targetObj, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  hovered: monitor.isOver(),
}))
class DropItem extends Component {
  render() {
    const { connectDropTarget, isHover } = this.props;
    return connectDropTarget(
      <div className={`schedule-block${isHover ? " show-schedule-block" : ""}`} style={{ minWidth: "100px" }}>
        空闲
      </div>
    );
  }
}
const targetObjUsed = {
  hover(props, monitor, component) {
    const { station, onTargetHover, dispatchInfo } = props;
    onTargetHover(station, dispatchInfo);
  },
  drop(props, monitor, component) {
    const { station, dispatchInfo, dropNewOrder, setNowProStatus } = props;
    console.log("===============》接受源工位信息", station);
    console.log("===============》接受源单元格信息", dispatchInfo);
    let sourceInfo = monitor.getItem();
    console.log("===============》接受源接收到的左边工序所属任务信息", sourceInfo.instInfo);
    console.log("===============》接受源接收到的左边工序信息", sourceInfo.proInfo);
    setNowProStatus(sourceInfo, dispatchInfo, station);
    dropNewOrder(sourceInfo, {
      stationName: station.stationName,
      stationId: station.stationId,
      stationCode: station.stationCode,
      stationType: station.stationType,
      dataId: station.dataId,
      ...dispatchInfo,
    });
  },
  canDrop(props, monitor) {
    if (monitor.getItem().proInfo.dispStatus == "3") {
      return true;
    } else {
      return false;
    }
  },
};
@DropTarget("BOX", targetObjUsed, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  hovered: monitor.isOver(),
}))
class DropItemUsed extends Component {
  render() {
    const { connectDropTarget, isHover, dispatchInfo } = this.props;
    return connectDropTarget(
      <div
        className={`schedule-block${isHover ? " show-schedule-block" : ""}`}
        style={{ minWidth: "100px", width: "100%", zIndex: "100", wordBreak: "break-all", lineHeight: "25px", overflow: "hidden", position: "absolute" }}
      >
        <div style={{ textOverflow: "ellipsis", width: "100%", zIndex: "100", height: "25px", overflow: "hidden", whiteSpace: "nowrap" }}>
          {dispatchInfo.compName + dispatchInfo.compCode}
        </div>
        <div style={{ textOverflow: "ellipsis", width: "100%", zIndex: "100", height: "25px", overflow: "hidden", whiteSpace: "nowrap" }}>
          {dispatchInfo.processName + dispatchInfo.processNo}
        </div>
      </div>
    );
  }
}
