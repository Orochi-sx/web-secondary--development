import React, { useEffect } from "react";
import { useState } from 'react';

import { Calendar, ConfigProvider, Popover, Tabs, Badge } from 'antd';
import { InsertRowAboveOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';

import solarLunar from 'solarLunar-es';
import './index.css'

import { queryAssetById, queryUserId, updateReading } from '../../api/asset.js'

const List = ( props ) => {
  // 获取资产ID
  const assetId = props.pluginConfig ? props.pluginConfig.assetId : ''
  // 标签页
  const { TabPane } = Tabs;
  // 农历日期对应节日转化
  const getlunarDayCn = (year_, month_, day_) => {
    let lunar = solarLunar.solar2lunar(year_, month_ + 1, day_);
    let JudgeLunar = solarLunar.solar2lunar(year_, month_ + 1, day_ + 1);
    let { isTerm, term, monthCn, dayCn } = lunar
    let showDay = isTerm ? term : dayCn;
    if (showDay === '初一')  showDay = monthCn
    if (JudgeLunar.monthCn === '正月' && JudgeLunar.dayCn === '初一') return '除夕';
    return showDay;
  }
  // 数据转换
  const translatePlatformDataToJsonArray = (originTableData) => {
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

  // 初始数据
  const [monthData, setMonthData] = useState([])
  const [year, setYear] = useState(new Date().getFullYear())
  const [month, setMonth] = useState(new Date().getMonth() + 1)

  // 初始化数据
  useEffect( () => {
    getListDate(year, month)
  },[])

  // 获取年份
  const getDateYear = (value) => {
    return new Date(Date.parse(value)).getFullYear()
  }
  // 获取月份
  const getDateMonth = (value) => {
    return new Date(Date.parse(value)).getMonth() + 1
  }
  // 获取日期
  const getDateDate = (value) => {
    return new Date(Date.parse(value)).getDate()
  }

  // 请求数据
  const getListDate = (_year, _month) => {
    queryUserId().then( (res1) => {
      // 生成查询数据
      let dataForm = {
        column: 'id',
        compareObj: res1.data.id,
        datatype: 0,
        type: 10
      }
      // 获取查询数据
      queryAssetById(assetId, dataForm).then( (res2) => {
        // 数据转换
        let resData = translatePlatformDataToJsonArray(res2)
        // 单元格数据
        let _cellData = []
        // 月份数据
        let _monthData = []

        // 处理数据 0是true 1是false
        resData.forEach( (item, index) => {
          item.gzsj = item.gzsj ? item.gzsj.split(' ') : null
          item.xxsj = item.xxsj ? item.xxsj.split(' ') : null
          if(getDateYear(item.gzsj[0]) == _year && getDateMonth(item.gzsj[0]) == _month) {
            // 修改数据格式
            item.schedule = item.schedule ? item.schedule.split(',') : null
            item.schedule_time = item.schedule_time ? item.schedule_time.split(',') : null
            item.applicant_name = item.applicant_name ? item.applicant_name.split(',') : null
            item.shiftee_name = item.shiftee_name ? item.shiftee_name.split(',') : null
            item.shiftee_classes = item.shiftee_classes ? item.shiftee_classes.split(',') : null
            item.shift_reason = item.shift_reason ? item.shift_reason.split(',') : null
            item.apply_classes = item.apply_classes ? item.apply_classes.split(',') : null
            item.change_date = item.change_date ? new Date(item.change_date).toLocaleString().replace(/\//g, '-') : null
            // 添加最终数据
            _cellData.push(item)
          }
        })
        // 生成月份数据
        for(let i = 1; i < 31; i ++) {
          _monthData[i] = null
          _cellData.forEach( (item) => {
            if( i == getDateDate(new Date(item.gzsj[0])) ) {
              return _monthData[i] = item
            }
          })
        }
        // 同步单元格数据
        return setMonthData(_monthData)
      })
    })
  }

  // 已读未读
  const changeBadge = (value) => {
    let dataId = value.data_id_s
    let reading = '0'
    updateReading(dataId, reading)
  }
  
  // 生成日历单元格
  const dateCellRender = (value) => {

    // 当前年份
    let yearIndex = value.year()
    // 当前月份
    let monthIndex = value.month() + 1
    // 当前日期下标
    let dateIndex = value.date()
    // 当日数据
    let dateValue = monthData[dateIndex]
    // 阳历日期转农历
    let lunarCalendar = getlunarDayCn(value.year(), value.month(), value.date())
    // 存放页面结构数据
    let dateCellInfo;

    // 生成页面
    dateCellInfo = <>
      <Popover
        trigger = "click"
        content = {
          yearIndex == year && monthIndex == month && dateValue && 
          <Tabs defaultActiveKey = "1" onChange={ () => { dateValue.reading = '0'; changeBadge(dateValue); } }>
            <TabPane tab="今日日程" key="1">
              {/* 班次名称 */}
              <div className='tabs_toady_top'>
                <InsertRowAboveOutlined style={{ marginRight: '10px' }}/>
                { dateValue.shift_name }
              </div>
              {/* 班次时间 */}
              <div className='tabs_toady_workShift'>
                { dateValue.gzsj[1] + dateValue.gzsj[2] + dateValue.gzsj[3] } 
              </div>
              {/* 日程明细 */}
              <div className='tabs_toady_bottom'>
                <InsertRowAboveOutlined style={{ marginRight: '10px' }}/>日程明细
              </div>
              {/* 日程信息 */}
              {
                <div className='tabs_toady_workShift'>
                  {
                    dateValue.schedule ? dateValue.schedule.map( (item, index) => {
                      return(
                        <div className='tabs_wroShift_content' key={ index }>
                          <div>{ yearIndex == year && monthIndex == month && dateValue.schedule && dateValue.schedule[index] }</div>
                          <div>{ yearIndex == year && monthIndex == month && dateValue.xxsj && dateValue.xxsj[1] + dateValue.xxsj[2] + dateValue.xxsj[3] }</div>
                        </div>
                      )
                    }) : <div className='noNotice'>暂无明细</div>
                  }  
                </div>
              }
            </TabPane>

            <TabPane tab={ <Badge dot={ dateValue.reading == '1' }>通知</Badge> } key="2" >
              {
                dateValue.applicant_name ? dateValue.applicant_name.map( (item, index) => {
                  return (
                    <div className='notice' key={ index }>
                      {/* 通知名称 */}
                      <div className='notice_content1'>
                        <span className='notice_type'>{ dateValue.shift_reason && dateValue.shift_reason[index] }</span>
                        <div className="notice_update">
                          <div className='notice_newWorkShift'>【{ dateValue.apply_classes && dateValue.apply_classes[index] }】</div>更新为<div className='notice_newWorkShift'>【{ dateValue.shiftee_classes && dateValue.shiftee_classes[index] }】</div>
                        </div>
                      </div>
                      {/* 换班信息 */}
                      <div className='notice_content2'>
                        <div>换班人: { dateValue.applicant_name && dateValue.applicant_name[index] }</div>
                        <div className='notice_to'> &gt;&gt; </div>
                        <div>换班人: { dateValue.shiftee_name && dateValue.shiftee_name[index] }</div>
                      </div>
                      {/* 通知时间 */}
                      <div className='notice_content3'>
                        { dateValue.change_date && dateValue.change_date }
                      </div>
                    </div>
                  )
                }) : <div className='noNotice'>暂无通知</div>
              }
            </TabPane>
          </Tabs>
        }
      >
        {/* 生成单元格 */}
        <div className='tag_calendar' style={ dateValue && { background: yearIndex == year && monthIndex == month && dateValue.background_color }}>
          { yearIndex == year && monthIndex == month && dateValue && dateValue.reading == '1' && <div className='tag_badge'></div> }
          { yearIndex == year && monthIndex == month && dateValue && dateValue.type_application == '1' && <div className='tag_rest'><div>假</div></div> }
          <div className="tag_date">{ value.date() } { lunarCalendar }</div>
          <div className = 'tag_shift'>
            <div className = 'tag_shift'>
              <div style={{ color: '#fff' }}>{ yearIndex == year && monthIndex == month && dateValue && dateValue.shift_name }</div>
              <div style={{ color: '#fff' }}>{ yearIndex == year && monthIndex == month && dateValue && dateValue.gzsj[1] + dateValue.gzsj[2] + dateValue.gzsj[3] } </div>
            </div>
          </div>
        </div>
      </Popover>
    </>

    return dateCellInfo
  }

  // 数据切换
  const dateChange = (value) => {
    setYear(value.year())
    setMonth(value.month() + 1)
    getListDate(value.year(), value.month() + 1)
  }
  
  return (
    <ConfigProvider locale={zhCN}>
      <Calendar dateFullCellRender={ dateCellRender } onChange={ dateChange }/>
    </ConfigProvider>
  );
};

export default List;
