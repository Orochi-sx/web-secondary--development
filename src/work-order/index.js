// import React, { useEffect, useState } from 'react';
import React, { Component } from "react";
import PropTypes from "prop-types";
import { Layout, Collapse, Button, Select } from "antd";
import "./index.less";
import EditArea from "./editarea/edit-area";
import SelectViewModal from "./modal";
import { prodInsById, prodInsNoId } from "../api/index";
import qs from "querystringify";
import DragItem from "./dragItem";
const { Sider, Content } = Layout;
const { Panel } = Collapse;

class WorkOrders extends Component {
  static propTypes = {
    height: PropTypes.number,
  };
  state = {
    sideListData: {}, //展现的所有零件工序信息
    sideListFilter: [],
    modalVisible: false,
    stationInfo: [],
    selectedRows: [], //所选的生产任务信息
    selectedStation: [],
    dragRow: {},
  };
  search = qs.parse(window.location.search);
  myRef = React.createRef();

  componentDidMount() {
    if (this.search.insId) {
    // if (!this.search.insId) {//这里方便调试用的
      this.queryData([]);
      this.getData([{ dataId: this.search.insId }]);
      // this.getData([{ dataId:'226263f61b56bb2ed4077f58fc9fdfdb' }]);//这里方便调试用的
    }
  }
  queryData(queryParams) {
    let params = {
      pageNum: 1,
      pageSize: 999,
      orderBy: "create_time",
      orderSort: "DESC",
      queryParams: queryParams || [],
    };
    prodInsNoId(params, (data) => {
      let newData = [];
      data?.forEach((item, index) => {
        newData.push({ ...item, key: index });
      });
      this.setState({ selectedRows: newData });
    });
  }

  async getData(selectedRows) {
    if (!selectedRows) {
      return;
    }
    let list = [];
    selectedRows?.forEach((item) => {
      list.push(item.dataId);
    });
    prodInsById(list, (data) => {
      this.setState({
        sideListData: data || {},
      });
    });
  }
  relayoutSideList({ addInfo, delInfo }) {
    const { sideListData, sideListFilter } = this.state;
    sideListFilter.find(
      (item, index) =>
        item.processId === delInfo?.processId && sideListFilter.splice(index, 1)
    );
    // eslint-disable-next-line array-callback-return
    Object.keys(sideListData).forEach((item, i) => {
      // eslint-disable-next-line array-callback-return
      sideListData[item]?.find((obj, index) => {
        if (obj.processId === addInfo?.processId) {
          sideListFilter.push(obj);
          return true;
        }
      });
    });
    this.setState({ sideListData, sideListFilter });
  }
  renderLeftSide() {
    const { sideListData, selectedRows, sideListFilter } = this.state;
    const header = (headerItem) => {
      return (
        <div>
          <span>{headerItem[0].compName}</span>
          <span>{headerItem[0].compCode}</span>
        </div>
      );
    };

    const defaultActiveKey = [];
    Object.keys(sideListData)?.forEach((item) => defaultActiveKey.push(item));
    if(this.search?.insId && defaultActiveKey.length === 0) {
      return;
    }
    return (
      <div className="left-side-content">
        <Collapse
          expandIconPosition="right"
          defaultActiveKey={defaultActiveKey}
        >
          {Object.keys(sideListData).map((item, i) => {
            return (
              <Panel header={header(sideListData[item])} key={item}>
                {sideListData[item]?.map((obj, index) => {
                  let flag =
                    sideListFilter.find(
                      (filterItem) => filterItem.processId === obj.processId
                    ) !== undefined;
                  return flag ? (
                    false
                  ) : (
                    <DragItem
                      proInfo={obj}
                      key={index}
                      instInfo={selectedRows.find(
                        (row) => row.dataId === obj.insId
                      )}
                      onDragItem={(source) => {
                        this.setState({
                          dragRow: source,
                        });
                      }}
                      isDraging={
                        this.state.dragRow?.processId === obj?.processId
                      }
                    />
                  );
                })}
              </Panel>
            );
          })}
        </Collapse>
      </div>
    );
  }
  stationChange(valArr, optArr) {
    this.setState({ selectedStation: optArr || [], sideListFilter: [] }, () =>
      this.myRef.current.loadData()
    );
  }
  submit() {
    this.myRef.current.submitAll();
  }

  render() {
    const { stationInfo, modalVisible, selectedStation } = this.state;
    return (
      <Layout
        className={"work-orders-components-wrapper"}
        style={{ height: `${this.props.height}px` }}
      >
        <Sider theme={"light"} width={280}>
          <div className={"left-side-wrap"}>
            {this.search.insId ? (
              <></>
            ) : (
              <div className={"side-header-top"}>
                <Button
                  type="primary"
                  onClick={() => this.setState({ modalVisible: true })}
                >
                  请选择
                </Button>
              </div>
            )}
            {this.renderLeftSide()}
          </div>
        </Sider>
        <Content className={"content-wrap"}>
          <div className={"content-side-top"}>
            <div>
              <span>工位：</span>
              <Select
                allowClear
                style={{ width: 200, display: "inline-block" }}
                value={selectedStation?.map((item) => item.value) || []}
                mode="multiple"
                onChange={this.stationChange.bind(this)}
              >
                {stationInfo.map((item) => {
                  return (
                    <Select.Option
                      value={item?.stationName}
                      key={item?.stationId}
                    >
                      {item?.stationName}
                    </Select.Option>
                  );
                })}
              </Select>
            </div>
            <Button
              type="primary"
              onClick={(e) => {
                this.submit();
              }}
            >
              确认提交
            </Button>
          </div>
          <div className={"content-main"}>
            <EditArea
              ref={this.myRef}
              queryProInfo={this.getData.bind(this, this.state.selectedRows)}
              relayoutSideList={this.relayoutSideList.bind(this)}
              selectedStation={this.state.selectedStation}
              setStationInfo={this.setState.bind(this)}
              isDraging={!!this.state.dragRow?.processId}
            />
          </div>
        </Content>
        {modalVisible && (
          <SelectViewModal
            onClose={(selectedRows) => {
              selectedRows instanceof Array || (selectedRows = []);
              this.setState({ modalVisible: false, selectedRows });
              this.getData(selectedRows);
            }}
          />
        )}
      </Layout>
    );
  }
}
export default WorkOrders;
