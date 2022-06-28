<template>
    <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="handleClose" @opened="openFn"
        :append-to-body="true">
        <div class="dialog_title" slot="title">
            <div class="title_zhu">事件档案</div>
            <div class="title_fu">{{ sj.sjlx }}档案</div>
        </div>
        <div class="qzsj_main">
            <div class="geti ">
                <div class="qunb_title title_public">档案基础信息</div>
                <div class="qunb_main ">
                    <div class="qbm_t qbm_publ">
                        <div class="qbm_pubtitle   tes" style="width:300px">
                            <span class="q_publable">事件编号：</span>
                            {{ sj.sjid }}
                            <div class="q_log">风险事件</div>
                        </div>
                        <div class="qbm_pubtitle" style="margin-left:-150px;width:300px">
                            <span class="q_publable">事件类型：</span>
                            {{ sj.sjyjfl }}
                        </div>
                        <div class="qbm_pubtitle" style="width:100px">
                            <span class="q_publable">事件来源：</span>
                            {{ sj.sjid }}
                        </div>
                    </div>
                    <div class="qbm_m qbm_publ">
                        <div class="qbm_pubtitle   qbm_qtou">
                            <span class="q_publable">牵头人：</span>
                            {{ num.sjry }}
                        </div>
                        <div class="qbm_pubtitle">
                            <span class="q_publable">初次上报时间：</span>
                            {{ moment(sj.ccsbsj).format('YYYY-MM-DD') }}
                        </div>
                        <div class="qbm_pubtitle">
                            <span class="q_publable">初次发生地点：</span>
                            {{ sj.ccfsdd }}
                        </div>
                    </div>
                    <div class="qbm_b qbm_publ">
                        <div class="qbm_pubtitle   qbm_sjnr">
                            <span class="q_publable">事件内容：</span>
                            {{ sj.sjnr }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="qunz_sj">
                <div class="qut_l">
                    <div class="qunt_title  title_public">事件涉及人员</div>
                    <div class="qunt_table">
                        <div class="qtbl_title">
                            <div class="qtbl_gs">涉及人员个数</div>
                            <div class="qtbl_num">{{ num.rynum }}个</div>

                        </div>
                        <div class="table_sec">
                            <div class="sec_font">姓名</div>
                            <input type="text" v-model="ryname" placeholder="请输入">
                            <button @click="secrahFn('totalrytable')">查询</button>
                        </div>
                        <div class="qunbm_right  main_public">


                            <el-table :data="ryTable" style="width: 100%" border @row-click="eventFn"
                                :cell-style="changeCellStyle">
                                <el-table-column type="index" label="序号">
                                </el-table-column>
                                <el-table-column prop="name" label="姓名" style="color:green;">
                                </el-table-column>
                                <el-table-column prop="sex" label="性别">
                                </el-table-column>
                                <el-table-column prop="iphone" label="手机号">
                                </el-table-column>
                                <el-table-column prop="eventNum" label="事件数量" class-name="hover">
                                </el-table-column>
                                <el-table-column prop="classification" label="人群分类" style="color:orange;">
                                </el-table-column>
                            </el-table>
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange1"
                                :current-page="currentPage1" :page-sizes="[1, 2, 3, 4]" :page-size="size"
                                layout="total, prev, pager, next, jumper" :total="totalrytable.length">
                            </el-pagination>
                        </div>
                    </div>
                </div>
                <div :class="{ qut_r: true }">
                    <div class="qunt_title  title_public">事件涉及主体</div>
                    <div class="qunt_table">
                        <div class="qtbl_title">
                            <div class="qtbl_gs">涉及主体个数</div>
                            <div class="qtbl_num">{{ num.ztnum }}个</div>
                        </div>
                        <div class="table_sec">
                            <div class="sec_font">主体名称</div>
                            <input type="text" v-model="ztname" placeholder="请输入">
                            <button @click="secrahFn('totalzttable')">查询</button>
                        </div>
                        <div class="qunbm_right  main_public">
                            <el-table :data="ztTable" style="width: 100%" border @row-click="eventFn2">
                                <el-table-column type="index" label="序号">
                                </el-table-column>
                                <el-table-column prop="subjectName" label="主体名称">
                                </el-table-column>
                                <el-table-column prop="eventNum" label="事件数量">
                                </el-table-column>
                            </el-table>
                            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange2"
                                :current-page="currentPage2" :page-sizes="[1, 2, 3, 4]" :page-size="size"
                                layout="total, prev, pager, next, jumper" :total="totalzttable.length">
                            </el-pagination>
                        </div>
                    </div>
                </div>

            </div>

            <div class="qunz_top" v-if="dialogVisible">
                <div class="qut_l">
                    <div class="qunt_title  title_public">事件烈度趋势</div>
                    <div class="qunt_main  main_public" ref="echart"></div>
                </div>


            </div>
            <div class="qunz_top" v-if="dialogVisible && (sj.sjlx == '个体')">

                <div :class="{ qut_r: true, qut_gr: sj.sjlx == '个体' }">
                    <div class="qunt_title  title_public">事件等级分析</div>
                    <div class="qunt_main  main_public" ref="echarts"></div>
                </div>

            </div>
            <div class="qunz_bottom">
                <div class="qunb_title title_public">相关事件清单</div>
                <div class="qunb_main ">
                    <div style="display:flex;" v-if="dialogVisible">
                        <div>
                            <el-select clearable v-model="Typevalue" placeholder="请选择事件类型">
                                <el-option v-for="item in selectOptions" :key="item.事件类型" :label="item.事件类型"
                                    :value="item.事件类型">
                                </el-option>
                            </el-select>
                        </div>
                        <div style="margin-left:10px;margin-right:10px">
                            <el-select clearable v-model="laiYuanvalue" placeholder="请选择事件来源">
                                <el-option v-for="item in typeSelectOption" :key="item.事件来源" :label="item.事件来源"
                                    :value="item.事件来源">
                                </el-option>
                            </el-select>
                        </div>
                        <el-date-picker v-model="dateValue" type="daterange" range-separator="至"
                            start-placeholder="开始日期" end-placeholder="结束日期">
                        </el-date-picker>
                        <button class="reset" style="margin-top:5px" @click="resetFn">重置</button>
                        <button class="confirm" style="margin-top:5px" @click="confirmFn">确认</button>
                    </div>
                    <div class="qunbm_right  main_public">
                        <el-table :data="qdTable" style="width: 100%" border>
                            <el-table-column type="index" label="序号" min-width="5%">
                            </el-table-column>
                            <el-table-column prop="事件内容" label="事件内容" min-width="60%">
                            </el-table-column>
                            <el-table-column prop="事件类型" label="事件类型" min-width="10%">
                            </el-table-column>
                            <el-table-column prop="事件来源" label="事件来源" min-width="10%">
                            </el-table-column>
                            <el-table-column prop="sj" label="上报时间" min-width="15%">
                            </el-table-column>
                        </el-table>
                        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                            :current-page="currentPage" :page-sizes="[1, 2, 3, 4]" :page-size="size"
                            layout="total, prev, pager, next, jumper" :total="result.length">
                        </el-pagination>
                    </div>
                </div>
            </div>
        </div>

    </el-dialog>
</template>

<script>
import { json } from 'body-parser'
import axios from './api/asset'
export default {
    props: ['dialogVisible', 'sj', 'Assetid'],
    data() {
        return {
            num: {
            },
            ztname: '',
            dateValue: '',
            Typevalue: '',
            laiYuanvalue: '',
            ryname: '',
            selectOptions: [],
            typeSelectOption: [],
            size: 4,
            option: {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    textStyle: {
                        color: "#fdfdfe"
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '关联事件',
                        type: 'line',
                        stack: 'Total',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                ]
            },
            option1: {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    textStyle: {
                        color: "#fdfdfe"
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name: '关联事件',
                        type: 'line',
                        stack: 'Total',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                ]
            },
            tableData: [],
            result: [],
            Dfilter: [],
            temp: [],
            tableTemp: [],
            ryTemp: [],
            ryTable: [],
            ztTemp: [],
            ztTable: [],
            qldTemp: [],
            qldTable: [],
            currentPage: 1,
            currentPage1: 1,
            currentPage2: 1,
            totalrytable: [],
            totalzttable: [],
            qdTemp: [],
            qdTable: [],
            tempTable: {
                ry: [],
                zt: []
            }
        }
    },
    watch: {
        sj: {
            handler(newVal) {
                // this.totalzttable = []
                this.ztTable = this.ztTemp.filter(x => {
                    // if (x.sjid == this.sj.sjid) this.totalzttable.push(x)
                    return x.sjid == this.sj.sjid
                })
                this.totalzttable = JSON.parse(JSON.stringify(this.ztTable))
                this.tempTable.zt = JSON.parse(JSON.stringify(this.ztTable))
                if (this.temp.length == 0) return
                //===========人员
                // this.totalrytable = []
                this.ryTable = this.ryTemp.filter(x => {
                    // if (x.sjid == this.sj.sjid) this.totalrytable.push(x)
                    return x.sjid == this.sj.sjid
                })
                this.totalrytable = JSON.parse(JSON.stringify(this.ryTable))
                this.tempTable.ry = JSON.parse(JSON.stringify(this.ryTable))
                this.num.rynum = this.ryTable.length
                this.qdTable = this.qdTemp.filter(x => {
                    x.sj = this.moment(x.上报时间).format('YYYY-MM-DD')
                    return x.sjid == this.sj.sjid
                })
                this.result = JSON.parse(JSON.stringify(this.qdTable))
                this.filterT = JSON.parse(JSON.stringify(this.qdTable))
                //=============主体

                this.num.ztnum = this.ztTable.length
                this.Dfilter = this.temp.filter(x => {
                    return x.sjid == this.sj.sjid
                })
                let temp = this.qldTemp.map((x) => {
                    return this.moment(x.日期).format("YYYY-MM-DD")
                })
                temp = new Set(temp)
                let temp2 = { name: '关联事件', data: [] }
                let temp3 = { name: '其他事件', data: [] }
                this.Dfilter.forEach(x => {
                    if (x.eventLevel == '关联事件') {
                        temp2.data.push(x.数量)
                    } else {
                        temp3.data.push(x.数量)
                    }
                })
                console.log(this.Dfilter);
                const temp4 = [temp2, temp3]
                let op = { name: '高', data: [] }
                let op2 = { name: '中', data: [] }
                let op1 = { name: '低', data: [] }
                this.qldTemp.forEach(x => {
                    if (x.eventLevel == '高') {
                        op.data.push(x.数量)

                    } if (x.eventLevel == '中') {
                        op2.data.push(x.数量)
                    } if (x.eventLevel == '低') {
                        op1.data.push(x.数量)
                    }
                })
                const op3 = [op, op2, op1]
                this.option.xAxis.data = temp
                this.option.series = temp4.map(x => {
                    return { name: x.name, type: 'line', data: x.data, smooth: true }
                })
                this.option1.xAxis.data = temp
                this.option1.series = op3.map(x => {
                    return { name: x.name, type: 'line', data: x.data, areaStyle: {}, smooth: true }
                })
                // =====================================================echarts

                this.tableData = this.tableTemp.filter(x => {
                    return x.sjid == this.sj.sjid
                })
                // this.tableData.forEach(x => {
                //     x.sjdate = this.moment(x.sjdate).format('YYYY-MM-DD')
                // })
                // this.num.sjry = JSON.parse(JSON.stringify(this.tableData[0].sjry))
                this.handleCurrentChange(1)
                this.handleCurrentChange1(1)
                this.handleCurrentChange2(1)

            },
            deep: true,
            immediate: true
        },
        qdTable: {
            handler() {
                this.selectOptions = this.ridding(this.filterT, '事件类型')

                this.typeSelectOption = this.ridding(this.filterT, '事件来源')
            },
            deep: true,
            // immediate: true

        },

    },
    created() {
        //日期
        // axios.queryAssetById(this.Assetid.rqid, []).then(res => {
        //     this.temp = this.transformationtda(res)
        // })
        // axios.queryAssetById(this.Assetid.sjldid, []).then(res => {
        //     this.temp = this.transformationtda(res)
        // })
        axios.queryAssetById('64a7a876-66b0-4faa-803f-a71822f9c4cf', []).then(res => {
            this.temp = this.transformationtda(res)
        })

        // axios.queryAssetById(this.Assetid.ryid, []).then(res => {
        //     this.tableTemp = this.transformationtda(res)
        // })
        axios.queryAssetById('a7cdbd73-35f9-4d03-9d5e-7585eaa64760', []).then(res => {
            this.tableTemp = this.transformationtda(res)
        })
        // 涉及人员
        // axios.queryAssetById(this.Assetid.sjryid, []).then(res => {
        //     this.ryTemp = this.transformationtda(res)
        // })
        axios.queryAssetById('4ac7d6cf-c3d4-4502-a2c6-00d3f9d78bf5', []).then(res => {
            this.ryTemp = this.transformationtda(res)
        })
        // 涉及主体
        // axios.queryAssetById(this.Assetid.sjztid, []).then(res => {
        //     this.ztTemp = this.transformationtda(res)
        //     console.log(this.ztTemp, '==========================================主体');
        // })
        axios.queryAssetById('b6dd3232-b67c-447b-8d28-832eeee1cc6d', []).then(res => {
            this.ztTemp = this.transformationtda(res)
            // console.log(this.ztTemp, '==========================================主体');
        })
        //事件等级趋势
        // axios.queryAssetById(this.Assetid.sjdjid, []).then(res => {
        //     this.qldTemp = this.transformationtda(res)
        // })
        axios.queryAssetById('b7655b55-a260-49f1-ab02-345b9da1cf3f', []).then(res => {
            this.qldTemp = this.transformationtda(res)
        })

        //事件清单
        axios.queryAssetById('ade02275-e23d-4219-8b03-717540f0d285', []).then(res => {
            this.qdTemp = this.transformationtda(res)
        })
    },
    methods: {
        eventFn(row, column) {
            if (column.label == '事件数量') {
                this.handleClose()
                window._peopleJD.rowClickTwo(row)
            } if (column.label == '姓名') {
                this.handleClose()
                window.open('https://www.bilibili.com')
            }
            // console.log(row, column.label, '=======sdahi');
            // this.handleClose()
            // window._peopleJD.rowClickTwo(row)
        },
        eventFn2(row, column) {
            if (column.label == '主体名称') {
                this.handleClose()
                this.$emit('tabk', row)
            }
        },
        ridding(tempArr, str) {
            let map = new Map()
            let arr = []
            for (let item of tempArr) {
                if (!map.has(item[str])) {
                    map.set(item[str], item)
                }
            }
            arr = [...map.values()]
            return arr
        },
        handleSizeChange(val) {
            this.size = val
        },
        handleCurrentChange(val) {
            this.qdTable = this.result.slice((val - 1) * this.size, val * this.size)

            console.log(`当前页: ${val}`, this.result);
        },
        handleCurrentChange1(val) {
            this.ryTable = this.totalrytable.slice((val - 1) * this.size, val * this.size)
        },
        handleCurrentChange2(val) {
            this.ztTable = this.totalzttable.slice((val - 1) * this.size, val * this.size)
        },
        secrahFn(val) {
            let name = val == 'totalrytable' ? 'name' : 'subjectName'
            let text = val == 'totalrytable' ? this.ryname : this.ztname
            if (val == 'totalrytable') {
                this[val] = this.tempTable.ry.filter((x) => {
                    return !text || x[name].indexOf(text) != -1
                })
                this.handleCurrentChange1(1)
            } else {
                this[val] = this.tempTable.zt.filter((x) => {
                    console.log(x[name].indexOf(text) != -1);
                    return !text || x[name].indexOf(text) != -1
                })
                this.handleCurrentChange2(1)
            }

        },
        openFn() {
            this.initFn()
        },
        handleClose(done) {
            this.dateValue = ''
            this.ryname = ''
            this.ztname = ''
            this.$emit('close')
        },
        changeCellStyle(row, column, rowIndex, columnIndex) {
            if (row.column.label == "人群分类") {
                return "color: orange"; // 修改的样式
            } else if (row.column.label === "姓名") {
                return "color: green"; // 修改的样式
            }

        },
        initFn() {
            if (this.sj.sjlx == '群体') {
                let Gechart = this.$echarts.init(this.$refs.echart);

                Gechart.setOption(this.option);
                return

            }
            let Gecharts = this.$echarts.init(this.$refs.echarts);
            Gecharts.setOption(this.option1);
            let Gechart = this.$echarts.init(this.$refs.echart);

            Gechart.setOption(this.option);

        },
        resetFn() {
            this.Typevalue = ''
            this.laiYuanvalue = ''
            this.qdTable = JSON.parse(JSON.stringify(this.result))
            this.result = JSON.parse(JSON.stringify(this.filterT))
            this.handleCurrentChange(1)
        },
        confirmFn() {
            if (this.filterT.length == 0) return
            let ks = this.dateValue && this.dateValue[0].getTime()
            let js = this.dateValue && this.dateValue[1].getTime() + 1000 * 60 * 60 * 24
            this.result = this.filterT.filter(x => {
                console.log(this.moment(x.上报时间).format('YYYY-MM-DD hh:mm'), ks <= x.上报时间 && js >= x.上报时间);
                return (this.Typevalue == '' || this.Typevalue == x.事件类型) && (this.laiYuanvalue == x.事件来源 || this.laiYuanvalue == '') && (!this.dateValue || (ks <= x.上报时间 && js >= x.上报时间))
            })
            this.handleCurrentChange(1)
        },
        transformationtda(originTableData) {
            let originTableHeader = originTableData[0];
            let tableHeader = [];
            originTableHeader.forEach((item) => {
                tableHeader.push(item.col_name);
            });
            let tableBody = originTableData[1];
            let tableData = [];
            tableBody.forEach((tableItem) => {
                let temp = {};
                tableItem.forEach((item, index) => {
                    temp[tableHeader[index]] = item;
                });
                tableData.push(temp);
            });
            return tableData;
        },
    }
}
</script>

<style lang="less" scoped>
/deep/ .el-dialog__body::-webkit-scrollbar {
    display: none;
}

/deep/.hover {
    cursor: pointer !important;

    &:hover {
        color: #4a80d9;
    }
}

/deep/ .el-dialog__body {
    height: 750px;
    overflow-y: scroll;
    overflow-x: hidden;
}

/deep/ .el-dialog {
    background: #103260;
    margin: 5vh auto 50px !important;
    z-index: 2500;
    width: 1300px !important;


    .dialog_title {
        display: flex;
        align-items: center;

        .title_zhu {
            font-size: 24px;
            font-weight: 900;
            margin-right: 10px;
        }

        .title_fu {
            font-size: 12px;
            color: #68e2fc
        }
    }
}

/deep/ .el-table,
.el-table__expanded-cell {
    background: transparent;
    color: #fdfdfe;

    tr {
        color: #fdfdfe;
        background: transparent !important;
    }


}

/deep/ tr:hover>td {
    background: transparent !important;
}

/deep/ .el-table th.el-table__cell {
    background: transparent !important;
}

/deep/ .el-dialog__header {
    background: #0d4394;
    color: #fdfdfe;
    padding: 10px 20px 10px;

    .el-dialog__title {
        color: #fdfdfe;
    }
}

.qzsj_main {
    display: flex;
    flex-direction: column;

    .title_public {
        color: #fdfdfe;
        font-size: 20px;
        line-height: 30px;
        font-weight: 900;
        padding-left: 24px;
        background: url('./img/top.png') no-repeat;
    }

    .main_public {
        background: url('./img/bg.png') no-repeat;
        background-size: 100% 100%;
    }

    .qunz_top {
        display: flex;
        justify-content: space-between;

        .qut_l {
            width: 100%;
        }

        .qut_r {
            width: 100%;
        }

        .qut_gr {
            width: 100%;
        }

        div {
            margin-bottom: 10px
        }

        .qunt_main {
            width: 100%;
            height: 350px;
        }
    }

    .qunz_sj {
        display: flex;
        justify-content: space-between;

        .table_sec {
            display: flex;
            color: #fff;


            input {
                outline: none;
                border: none;
                border-radius: 3px;
                margin-left: 10px;
                margin-right: 20px;
            }

            button {
                border: 1px solid #5087EC;
                background: #5087EC;
                color: #fff;
                width: 60px;
                border-radius: 4px;
            }
        }

        .qut_l {
            width: 49%;

            .qtbl_title {
                display: flex;
                color: #fff;
                justify-content: space-around;
                align-items: center;

                .qtbl_num {

                    width: 265px;
                    background: #5087EC;
                    line-height: 38px;
                    text-align: center;
                }
            }

        }

        .qut_r {
            width: 49%;

            .qtbl_title {
                display: flex;
                color: #fff;
                justify-content: space-around;
                align-items: center;

                .qtbl_num {

                    width: 265px;
                    background: #5087EC;
                    line-height: 38px;
                    text-align: center;
                }
            }
        }

        .qut_gr {
            width: 100%;
        }

        div {
            margin-bottom: 10px
        }

        .qunt_main {
            width: 100%;
            height: 350px;
        }

        /deep/ .el-pagination button {
            background-color: transparent;
        }

        /deep/ .el-pagination {
            float: right;
        }

        /deep/ .el-pager li {
            background-color: transparent;
            color: #C0C4CC;
        }

        /deep/ .el-pager li.active {

            color: #409EFF;
            cursor: default;
        }

        /deep/.el-input__inner,
        .el-select-dropdown__item.is-disabled:hover {
            background-color: transparent;
        }

        /deep/ .el-pagination .btn-next {
            color: #C0C4CC;

            :hover {

                color: #409EFF;
            }
        }

        /deep/ .el-pagination .btn-prev {
            color: #C0C4CC;

            :hover {

                color: #409EFF;
            }
        }
    }

    .qunz_bottom {
        div {
            margin-bottom: 10px
        }

        .qunb_main {
            width: 100%;
            height: 350px;
            // display: flex;
            justify-content: space-between;

            .reset {
                margin-left: 20px;
                background: #bbd3fb;
                color: #fdfdfe;
                line-height: 30px;
                height: 30px;
                border: none;
                border-radius: 2px;
            }

            .confirm {
                margin-left: 20px;
                border-radius: 2px;
                background: #5087EC;
                color: #fdfdfe;
                line-height: 30px;
                height: 30px;
                border: none;

            }

            .qunbm_left {
                width: 20%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;

                .qunbm_public {
                    display: flex;

                    // justify-content: center;
                    .qb_pub {
                        width: 60px;
                        height: 60px;
                        background: rgba(29, 77, 118) no-repeat;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .qbd_pub {
                        color: #fdfdfe;
                        margin-left: 10px;
                        width: 84px;

                        div {
                            margin: 0
                        }

                        .qbd_num {
                            color: #4783e5;

                            span {
                                font-size: 20px;
                                font-weight: 900px;
                            }
                        }
                    }
                }
            }

            .qunbm_right {
                // width: 78%;
                height: 100%;

                /deep/ .el-table {
                    border: 1px solid #4a80d9;
                }

                /deep/ .el-table th {
                    border: 1px solid #4a80d9;
                }

                /deep/ .el-table td {
                    border: 1px solid #4a80d9;
                }

                /deep/ .el-table__empty-block {
                    border-left: 1px solid #4a80d9;
                    border-top: 1px solid #4a80d9;
                }


                /deep/ .el-table--border::after,
                .el-table--group::after,
                .el-table::before {
                    background-color: transparent;
                }

                /deep/ .el-pagination button {
                    background-color: transparent;
                }

                /deep/ .el-pagination {
                    float: right;
                }

                /deep/ .el-pager .number {
                    background-color: transparent;
                    color: #C0C4CC;
                }

                /deep/ .el-pager li.active {

                    color: #409EFF;
                    cursor: default;
                }

                /deep/.el-input__inner,
                .el-select-dropdown__item.is-disabled:hover {
                    background-color: transparent;
                }

                /deep/ .el-pagination .btn-next {
                    color: #C0C4CC;

                    :hover {

                        color: #409EFF;
                    }
                }

                /deep/ .el-pagination .btn-prev {
                    color: #C0C4CC;

                    :hover {

                        color: #409EFF;
                    }
                }
            }

            .gtbm_left {
                width: 49%;
                height: 100%;

                div {
                    margin: 0;
                }

                .comm_box {
                    border: 2px solid rgba(204, 204, 204, 0.1);
                    margin: 5px 0;
                    line-height: 50px;
                    display: flex;
                    padding-left: 10px;
                    align-items: center;
                }

                .bgComm {
                    width: 20px;
                    height: 20px;
                    background-size: 100% 100%;
                }

                .headImg {
                    background-image: url(./img/bh.png);
                }

                .nameComm {
                    color: #7ed7e3;
                    font-size: 15px;
                    font-weight: bold;
                    margin-left: 10px;
                }

                .nameVComm {
                    color: #fdfdfe;
                    font-size: 15px;
                    font-weight: bold;
                    margin-left: 10px;
                }

                .cardBox {
                    background-image: url(./img/fl.png);
                }

                .phoneBox {
                    background-image: url(./img/time.png);
                }

                .sexImg {
                    background-image: url(./img/did.png);
                }

                .addressImg {
                    background-image: url(./img/ry.png);
                }

                .subjectImg {
                    background-image: url(./img/zt.png);
                }
            }

            .gtbm_right {
                width: 49%;
                height: 100%;
                padding: 8px 5px;
                box-sizing: border-box;
                color: #fdfdfe;

                .gtbmr_title {
                    margin: 5px 0;
                    line-height: 50px;
                    padding-left: 10px;
                    font-size: 20px;
                    font-weight: 900;
                    color: rgb(110, 229, 253);
                    background: rgba(110, 229, 253, .1);
                }

            }
        }

    }

    .geti {
        div {
            margin-bottom: 10px
        }

        .qunb_main {
            width: 100%;
            // height: 200px;

            // display: flex;
            // justify-content: space-between;
            .qbm_publ {
                display: flex;
                justify-content: space-between;

                .qbm_pubtitle {
                    color: #fff;
                    line-height: 40px;

                    .q_publable {
                        color: #FF9502;
                    }

                    .q_log {
                        text-align: center;
                        background: red;
                        border-radius: 3px;
                        // width: 40px;
                        color: #fdfdfe;
                        line-height: 24px;
                        margin-left: 10px;
                        margin-bottom: 5px;
                    }
                }

                .qbm_qtou {
                    width: 140px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                .qbm_sjnr {
                    height: 110px;
                    overflow: hidden;
                    -webkit-line-clamp: 3;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                }

                .tes {
                    display: flex;
                    align-items: center;
                }

                // align-items: center;
            }

            .qunbm_left {
                width: 20%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                align-items: center;

                .qunbm_public {
                    display: flex;

                    // justify-content: center;
                    .qb_pub {
                        width: 60px;
                        height: 60px;
                        background: rgba(29, 77, 118) no-repeat;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    .qbd_pub {
                        color: #fdfdfe;
                        margin-left: 10px;
                        width: 84px;

                        div {
                            margin: 0
                        }

                        .qbd_num {
                            color: #4783e5;

                            span {
                                font-size: 20px;
                                font-weight: 900px;
                            }
                        }
                    }
                }
            }

            .qunbm_right {
                width: 100%;
                height: 100%;

                /deep/ .el-table {
                    border: 1px solid #4a80d9;
                }

                /deep/ .el-table th {
                    border: 1px solid #4a80d9;
                }

                /deep/ .el-table td {
                    border: 1px solid #4a80d9;
                }

                /deep/ .el-table__empty-block {
                    border-left: 1px solid #4a80d9;
                    border-top: 1px solid #4a80d9;
                }


                /deep/ .el-table--border::after,
                .el-table--group::after,
                .el-table::before {
                    background-color: transparent;
                }

                /deep/ .el-pagination button {
                    background-color: transparent;
                }

                /deep/ .el-pagination {
                    float: right;
                }

                /deep/ .el-pager li {
                    background-color: transparent;
                    color: #C0C4CC;
                }

                /deep/.el-input__inner,
                .el-select-dropdown__item.is-disabled:hover {
                    background-color: transparent;
                }

                /deep/ .el-pagination .btn-next .el-icon-arrow-right {
                    color: #C0C4CC;
                }
            }

            .gtbm_left {
                width: 49%;
                height: 100%;

                div {
                    margin: 0;
                }

                .comm_box {
                    border: 2px solid rgba(204, 204, 204, 0.1);
                    margin: 5px 0;
                    line-height: 50px;
                    display: flex;
                    padding-left: 10px;
                    align-items: center;
                }

                .bgComm {
                    width: 20px;
                    height: 20px;
                    background-size: 100% 100%;
                }

                .headImg {
                    background-image: url(./img/bh.png);
                }

                .nameComm {
                    color: #7ed7e3;
                    font-size: 15px;
                    font-weight: bold;
                    margin-left: 10px;
                }

                .nameVComm {
                    color: #fdfdfe;
                    font-size: 15px;
                    font-weight: bold;
                    margin-left: 10px;
                }

                .cardBox {
                    background-image: url(./img/fl.png);
                }

                .phoneBox {
                    background-image: url(./img/time.png);
                }

                .sexImg {
                    background-image: url(./img/did.png);
                }

                .addressImg {
                    background-image: url(./img/ry.png);
                }

                .subjectImg {
                    background-image: url(./img/zt.png);
                }
            }

            .gtbm_right {
                width: 49%;
                height: 100%;
                padding: 8px 5px;
                box-sizing: border-box;
                color: #fdfdfe;

                .gtbmr_title {
                    margin: 5px 0;
                    line-height: 50px;
                    padding-left: 10px;
                    font-size: 20px;
                    font-weight: 900;
                    color: rgb(110, 229, 253);
                    background: rgba(110, 229, 253, .1);
                }

            }
        }

    }
}
</style>