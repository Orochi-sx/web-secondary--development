import React, { Component } from "react";
import { Button, Row, Col } from "antd";
import { queryAssetById } from "./api/asset";
import "./app.less";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dataList: [],
    };
  }

  async componentDidMount() {
    
    let dataList = [];
    
    let assetList = JSON.parse(this.props.data)

    // let assetList = [
    //   {
    //     name: "社会组织服务",
    //     displayField: "displayField",
    //     link: "linkField",
    //     assetId: "2d805cdf-fc6f-49be-9d13-4741e806f74a",
    //     url: "jss_zgh_gxpt/form/application/list?view_id=5b697cd916d8484ea91ab5f781768584",
    //     linkurl: 'jss_zgh_gxpt/form/application/detail?view_id=5b697cd916d8484ea91ab5f781768584&form_id=30946c0c2d7e4076921bd8167ea9ec02&type=1&related=0&id='
    //   },
    //   {
    //     name: "社会组织服务",
    //     displayField: "displayField",
    //     link: "linkField",
    //     assetId: "2d805cdf-fc6f-49be-9d13-4741e806f74a",
    //     url: "jss_zgh_gxpt/form/application/list?view_id=5b697cd916d8484ea91ab5f781768584",
    //     linkurl: 'jss_zgh_gxpt/form/application/detail?view_id=5b697cd916d8484ea91ab5f781768584&form_id=30946c0c2d7e4076921bd8167ea9ec02&type=1&related=0&id='
    //   },
    //   {
    //     name: "社会组织服务",
    //     displayField: "displayField",
    //     link: "linkField",
    //     assetId: "2d805cdf-fc6f-49be-9d13-4741e806f74a",
    //     url: "jss_zgh_gxpt/form/application/list?view_id=5b697cd916d8484ea91ab5f781768584",
    //     linkurl: 'jss_zgh_gxpt/form/application/detail?view_id=5b697cd916d8484ea91ab5f781768584&form_id=30946c0c2d7e4076921bd8167ea9ec02&type=1&related=0&id='
    //   },
    //   {
    //     name: "社会组织服务",
    //     displayField: "displayField",
    //     link: "linkField",
    //     assetId: "2d805cdf-fc6f-49be-9d13-4741e806f74a",
    //     url: "jss_zgh_gxpt/form/application/list?view_id=5b697cd916d8484ea91ab5f781768584",
    //     linkurl: 'jss_zgh_gxpt/form/application/detail?view_id=5b697cd916d8484ea91ab5f781768584&form_id=30946c0c2d7e4076921bd8167ea9ec02&type=1&related=0&id='
    //   },
    //   {
    //     name: "社会组织服务",
    //     displayField: "displayField",
    //     link: "linkField",
    //     assetId: "2d805cdf-fc6f-49be-9d13-4741e806f74a",
    //     url: "jss_zgh_gxpt/form/application/list?view_id=5b697cd916d8484ea91ab5f781768584",
    //     linkurl: 'jss_zgh_gxpt/form/application/detail?view_id=5b697cd916d8484ea91ab5f781768584&form_id=30946c0c2d7e4076921bd8167ea9ec02&type=1&related=0&id='
    //   },
    //   {
    //     name: "社会组织服务",
    //     displayField: "displayField",
    //     link: "linkField",
    //     assetId: "2d805cdf-fc6f-49be-9d13-4741e806f74a",
    //     url: "jss_zgh_gxpt/form/application/list?view_id=5b697cd916d8484ea91ab5f781768584",
    //     linkurl: 'jss_zgh_gxpt/form/application/detail?view_id=5b697cd916d8484ea91ab5f781768584&form_id=30946c0c2d7e4076921bd8167ea9ec02&type=1&related=0&id='
    //   },
    // ];

    for (let i = 0; i < assetList.length; i++) {
      let e = assetList[i];
      let res = await queryAssetById(e.assetId);
      let data = this.translatePlatformDataToJsonArray(res);
      dataList.push(data);
    }
    this.setState({
      assetList: assetList,
      dataList: dataList
    });
  }

  // 过滤数据
  translatePlatformDataToJsonArray(originTableData) {
    let originTableHeader = originTableData.data[0];
    let tableHeader = [];
    originTableHeader.forEach((item) => {
      tableHeader.push(item.col_name);
    });
    let tableBody = originTableData.data[1];
    let tableData = [];
    tableBody.forEach((tableItem) => {
      let temp = {};
      tableItem.forEach((item, index) => {
        temp[tableHeader[index]] = item;
      });
      tableData.push(temp);
    });
    return tableData;
  }

  // 跳转页面
  routerPush = (url) => {
    window.location.href=`${window.location.origin}/${url}`;
  };

  render() {
    let titleList = ['社会组织服务', '工会项目', '职工需求', '政策法规', '工作动态', '公告通告']
    return (
      <div className="platform_home">
        <Row className="platform_home">
          {
            this.state.dataList && this.state.dataList.map( (item, index) => {
              return (
                <Col span={8} key={index}>
                  <div className="platform_title">
                    <div className="platform_titleText">{ titleList[index] }</div>
                    <Button className="platform_titleButton" type="text" onClick={() => {this.routerPush(`${this.state.assetList[index].url}`)}}>更多</Button>
                  </div>
                  <div className="platform_content">
                    {
                      item.map( (elem, ind) => {
                        return (
                          <div key={ind} className="platform_contentDiv">
                            <div onClick={ () => {this.routerPush(`${this.state.assetList[index].linkurl}${elem[this.state.assetList[index].link]}`)}}>{ elem[this.state.assetList[index].displayField] }</div>
                          </div>
                        )
                      })
                    }
                  </div>
                </Col>
              )
            })
          }
        </Row>
      </div>
    );
  }
}
