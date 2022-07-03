import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Table, Form, Input, Button, DatePicker } from "antd";
import { prodInsNoId } from "../../api/index";
import moment from "moment";

import "./index.less";

const columns = [
  {
    title: "策划号",
    dataIndex: "ordPrograme",
    key: "ordPrograme",
  },
  {
    title: "生产订单编号",
    dataIndex: "ordCode",
    key: "ordCode",
  },
  {
    title: "工作订单编号",
    dataIndex: "insCode",
    key: "insCode",
  },
  {
    title: "下料任务编号",
    dataIndex: "mattskCode",
    key: "mattskCode",
  },
  {
    title: "零件编号",
    dataIndex: "compCode",
    key: "compCode",
  },
  {
    title: "零件名称",
    dataIndex: "compName",
    key: "compName",
  },
  {
    title: "需求时间",
    dataIndex: "reqTime",
    key: "reqTime",
    render: time => moment(time).format('YYYY-MM-DD'),
  },
];
class SelectViewModal extends Component {
  static propTypes = {
    onClose: PropTypes.func,
  };

  formRef = React.createRef();

  state = {
    dataSource: [],
    selectedRows: [],
    pagination: {
      current: 1,
      pageSize: 10,
    }
  };
  handleOk = () => {
    this.props.onClose(this.state.selectedRows);
  };

  componentDidMount() {
    this.queryData();
  }
  queryData(queryParams) {
    let params = {
      pageNum: this.state.pagination.pageNum,
      pageSize: this.state.pagination.pageSize,
      orderBy: 'create_time',
      orderSort: "DESC",
      queryParams: queryParams || [],
    };
    prodInsNoId(params, (data) => {
      let newData = [];
      data?.forEach((item, index) => {
        newData.push({ ...item, key: index });
      });
      this.setState({ dataSource: newData });
    });
  }

  onFinish = (formData) => {
    let queryParams = [];
    Object.keys(formData).forEach(item => {
      if (item === 'plan_ord_endtime') {
        formData[item] && queryParams.push({
          colName: item,
          type: 2,
          datatype: 5,
          value: moment(formData[item]).startOf("day").valueOf(),
        });
      } else {
        formData[item] && queryParams.push({
          colName: item,
          type: 0,
          value: formData[item],
        });

      }
    })
    this.queryData(queryParams);
  };
  onReset = () => {
    this.formRef.current.resetFields();
    this.queryData();
  };
  handleTableChange = (pagination) => {
    this.setState({ pagination }, () => this.queryData())
  };
  render() {
    const { onClose } = this.props;
    const { dataSource } = this.state;

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRows });
      },
    };

    const layout = {
      labelCol: {
        span: 8,
      },
      wrapperCol: {
        span: 16,
      },
    };

    return (
      <Modal
        className="select-view-modal"
        visible
        okText="确定"
        cancelText="取消"
        onOk={this.handleOk}
        onCancel={onClose}
        destroyOnClose={true}
        width={1200}
        title="工作订单"
      >
        <Form
          {...layout}
          ref={this.formRef}
          name="control-ref"
          className="select-view-modal-form"
          layout="inline"
          onFinish={this.onFinish}
        >
          <Form.Item name="ord_programe" label="策划号" >
            <Input />
          </Form.Item>
          <Form.Item name="plan_ord_endtime" label="计划完工时间" >
            <DatePicker placeholder="请选择日期"/>
          </Form.Item>
          <Form.Item name="comp_code" label="零件编号" >
            <Input />
          </Form.Item>
          <Form.Item name="comp_name" label="零件名称" >
            <Input />
          </Form.Item>
          <Form.Item name="ord_code" label="生产订单编号" >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button htmlType="button" onClick={this.onReset}>
              重置
            </Button>
          </Form.Item>
        </Form>
        <Table
          rowSelection={{
            type: "checkbox",
            ...rowSelection,
          }}
          pagination={this.state.pagination}
          dataSource={dataSource}
          columns={columns}
          onChange={this.handleTableChange}
        />
      </Modal>
    );
  }
}

export default SelectViewModal;
