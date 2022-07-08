import React, { useEffect, useState } from "react";
import { Table, Popover } from "antd";

import '../list/index.css'

const List = ({ data, columns, pluginConfig, handleClick, lineButtons, getRecordCellStyle }) => {

  // 时间戳转换中文
  const dateToChinese = (value) => {
    let weekName = ["日", "一", "二", "三", "四", "五", "六"]

    let date = new Date(value)
    let month = date.getMonth() + 1
    let day = date.getDate()
    let week = weekName[date.getDay()]

    month = month.toString().length < 2 ? '0' + month : month
    day = day.toString().length < 2 ? '0' + day : day

    return `${month}/${day}(${week})`
  }

  let [tableColumns, setTableColumns] = useState(null)
  let [tableData, setTableData] = useState([])

  // 存放表格行数据
  let _tableRowData = []
  // 存放表格列数据
  let _tableColData = []
  // 存放表格列去重后工号
  let _tableJobIDList = []
  // 存放表格列去重后日期
  let _tableDateList = []
  // 存放表格列去重后列名
  let _tableNameList = ['工号', '所属群组', '所属组织', '业务线']

  useEffect(( () => {
    creatTable()
  }),[data])

  const creatTable = () => {
    // 存放渲染表格数据
    let dataArray = []
    // 处理表格列数据
    data?.forEach( (item, index) => {
      // 保存数据
      let dataList = {}
      // 去除默认字段
      if(item.length > 9) {
        item.splice(-9, 9)
      }
      // 获取所需数据
      item.forEach( (e, i) => {
        switch (e.label) {
          case "工号":
            dataList.employee_num = e.value.display || ''; break;
          case "所属群组":
            dataList._group = e.value.display || ''; break;
          case "所属组织":
            dataList.organization = e.value.display || ''; break;
          case "业务线":
            dataList.line_of_business = e.value.display || ''; break;
          case "日期":
            _tableDateList.push(e.value.display)
            dataList.date = e.value.display || ''; break;
          case "班次":
            dataList.shift = e.value.display || ''; break;
          case "班次时间":
            dataList.shift_time = e.value.display || ''; break;
          case "明细":
            dataList.schedule = e.value.display || ''; break;
          case "明细时间":
            dataList.schedule_time = e.value.display || ''; break;
        }
      })
      // 重置格式
      let endDataList = {
        // 日期集合
        dateList: dataList.shift && dataList.date && dataList.shift_time
                  ? [
                      { 
                        label: dataList.date, 
                        value: dataList.shift,
                        shift_time: dataList.shift_time,
                        schedule: dataList.schedule ? dataList.schedule.split(',') : '',
                        schedule_time: dataList.schedule_time ? dataList.schedule_time.split(',') : ''
                      }
                    ] 
                  : {},
        // 工号
        employee_num: dataList.employee_num,
        // 业务线
        line_of_business: dataList.line_of_business,
        // 所属组织	
        organization: dataList.organization,
        // 所属群组
        _group: dataList._group
      }
      // 生成新数组
      _tableColData.push(endDataList)
    })
    // 数据合并去重
    _tableColData.forEach( (item, index) => {
      // 判断是否初次去重
      if(_tableRowData.length == 0) {
        _tableRowData.push(item)
        _tableJobIDList.push(item.employee_num)
      } else {
        // 判断是否存在相同工号
        if (_tableJobIDList.includes(item.employee_num)) {
          for(let i = 0; i < _tableRowData.length; i++) {
            let element = _tableRowData[i]
            if (element.employee_num == item.employee_num) {
              element.dateList.push(item.dateList[0])
            }
          }
        } else {
          _tableRowData.push(item)
          _tableJobIDList.push(item.employee_num)
        }
      }
    })
    // 日期数组去重
    _tableDateList = [...new Set(_tableDateList)]
    // 日期数组正序排列
    _tableDateList.sort( (a, b) => {
      return a - b
    })
    // 动态添加列名
    _tableDateList.forEach( (item, index) => {
      _tableNameList.push(dateToChinese(item))
    })
    // 数据日期数组正序排列
    _tableRowData.forEach( (item, index) => {
      item.dateList.sort( (a, b) => {
        return a.label - b.label
      })
    })
    // 数组日期数组对照日期列名排序
    _tableRowData.forEach( (item, index) => {
      let dateArrary = []
      _tableDateList.forEach( (x, y) => {
        dateArrary[y] = {}
        item.dateList.forEach( (z) => {
          if(z.label == x) dateArrary[y] = z
        })
      })
      item.dateList = dateArrary
    })
    // 处理表格行数据
    _tableRowData.forEach( (item, index) => {
      let rowArrary = []
      _tableNameList.forEach( (e, i) => {
        let rowObj = { label: e }
        if(i < 4) {
          switch(e) {
            case '工号':
              rowObj.value = item.employee_num
              break;
            case '所属群组':
              rowObj.value = item._group
              break;
            case '所属组织':
              rowObj.value = item.organization
              break;
            case '业务线':
              rowObj.value = item.line_of_business
              break;
          }
          rowArrary.push(rowObj)
        } else {
          if(item.dateList[i - 4].label == _tableDateList[i - 4]) {
            rowObj.value = item.dateList[i - 4].value
            rowObj.shift_time = item.dateList[i - 4].shift_time
            rowObj.schedule = item.dateList[i - 4].schedule
            rowObj.schedule_time = item.dateList[i - 4].schedule_time
          } else {
            rowObj.value = ''
          }
          rowArrary.push(rowObj)
        }
      })
      dataArray.push(rowArrary)
    })
    // 渲染行
    setTableData(dataArray)
    // 渲染列
    setTableColumns(_tableNameList.map( (item, index) => ({
      title: item,
      fixed: index < 4 ? 'left' : '',
      align: 'center',
      width: 100,
      onCell: (_, rowIndex) => getRecordCellStyle(rowIndex),
      render: (_, record) => (
        <>
          { 
            index < 4 
            ? record.find(k => k.label == item) && record.find(k => k.label == item).value 
            : <Popover
                overlayClassName="popover_background"
                trigger = "hover"
                content = {
                  <div className="popover_dialog">
                    <div>{ record.find(k => k.label == item) && `${record.find(k => k.label == item).value} : ${record.find(k => k.label == item).shift_time}` }</div>
                    {
                      record.find(k => k.label == item).schedule && record.find(k => k.label == item).schedule.map( (e, i) => {
                        return (
                          <div>{ `${record.find(k => k.label == item).schedule[i]} : ${record.find(k => k.label == item).schedule_time[i]}` }</div>
                        )
                      })
                    }
                  </div>
                }
            >
              <a>{ record.find(k => k.label == item).value }</a>
            </Popover>
          }
        </>
      )
    })))
  }
  
  return (
    <>
      {
        tableColumns && tableData && <Table columns={ tableColumns } dataSource={ tableData } scroll={{ x: 1500 }} pagination={false} bordered/>
      }
    </>
  );
};

export default List;