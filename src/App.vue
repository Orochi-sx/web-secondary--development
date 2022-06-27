<template>
  <div class="mainbox" :style="{ height: mainHeight + 'px' }">
    <div class="workGroupLeft">
      <div class="searchBox">
        <el-input
          placeholder="请输入内容"
          prefix-icon="el-icon-search"
          v-model="searchInput"
          class="menuSearch"
          @keyup.enter.native="searchFilter"
        >
        </el-input>
        <div class="plusBox" @click="newSon">+</div>
      </div>
      <el-menu default-active="1" class="el-menu-vertical-demo">
        <!-- ----右键菜单 -->
        <div
          v-show="visible"
          class="menuRight"
          :style="{ left: left + 'px', top: top + 'px' }"
          @click.left.stop
        >
          <el-button
            icon="el-icon-user"
            @click="newSonMenu()"
            v-show="addShow"
            class="menuButton"
            >添加成员</el-button
          >
          <el-button icon="el-icon-edit" class="menuButton" @click="editRow"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            class="menuButton"
            @click="deleteWork"
            >删除</el-button
          >
        </div>
        <!-- ----右键菜单 -->
        <template v-for="(item, index) in menuData">
          <el-submenu
            v-if="item.children && item.children.length > 0"
            :index="item.id"
            :key="index"
            @click="hanleSelect(item)"
          >
            <template slot="title">
              <div @contextmenu.prevent="openMenu($event, item)">
                <i class="el-icon-s-grid"></i>
                <span>{{ item.name }}</span>
              </div>
            </template>
            <el-menu-item
              v-for="(itemSon, indexSon) in item.children"
              :key="indexSon"
              :index="itemSon.id"
              @click="hanleSelect(itemSon)"
            >
              <template>
                <div @contextmenu.prevent="openMenu($event, itemSon, item)">
                  <i class="el-icon-s-custom"></i>
                  <span>{{ itemSon.name }}</span>
                </div>
              </template>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else @click="hanleSelect(item)" :index="item.id">
            <template>
              <div @contextmenu.prevent="openMenu($event, item)">
                <i class="el-icon-s-custom"></i>
                <span>{{ item.name }}</span>
              </div>
            </template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
    <!-- 右表部分 -->
    <div class="workGroupRight" ref="workGroupRight">
      <el-table
        :data="tableData"
        style="width: 100%"
        :header-cell-style="{
          background: 'rgba(0, 44, 71, 0.9)',
          color: '#01B6E6',
        }"
        :max-height="maxHeight"
        :cell-style="{
          borderColor: '#004465',
          background: 'transparent',
          color: '#ffffff',
        }"
      >
        <el-table-column prop="avatar" label="">
          <template slot-scope="scope">
            <el-avatar
              size="medium"
              shape="square"
              :src="scope.row.avatar"
            ></el-avatar>
          </template>
        </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="post" label="岗位"> </el-table-column>
        <el-table-column prop="company" label="单位"> </el-table-column>
        <el-table-column prop="department" label="部门"> </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="deleteRow(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 右表部分 -->
    <!-- 弹出层 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        :model="dialogFormData"
        ref="dialogForm"
        label-width="100px"
        class="dialogForm"
        :rules="rules"
      >
        <el-form-item label="工作组名称" prop="workName">
          <el-input
            v-model.number="dialogFormData.workName"
            placeholder="请输入工作组名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="选择成员" prop="workUser">
          <el-select
            v-model="dialogFormData.workUser"
            placeholder="请选择"
            style="width: 100%"
            multiple
            value-key="userId"
            @change="doSelectChange($event, workUserOptions)"
          >
            <el-checkbox
              :style="{ paddingLeft: '20px' }"
              :indeterminate="dialogFormData.isIndeterminate"
              v-model="dialogFormData.checkAll"
              @change="handleCheckAllChange(workUserOptions, $event)"
            >
              全选
            </el-checkbox>
            <el-option
              v-for="item in workUserOptions"
              :key="item.userId"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上级工作组" prop="lastWork">
          <el-select
            v-model="dialogFormData.lastWork"
            placeholder="请选择"
            style="width: 100%"
            value-key="id"
          >
            <el-option
              v-for="item in lastWorkOptions"
              :key="item.id"
              :label="item.name"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel" size="mini">取 消</el-button>
        <el-button type="primary" @click="dialogSure" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 弹出层 -->
  </div>
</template>

<script>
// import appService from "@njsdata/app-sdk";
import eventActionDefine from "./components/msgCompConfig";
import "./index.css";
export default {
  name: "App",
  props: {
    customConfig: Object,
  },
  data() {
    return {
      dialogVisible: false, //控制提示框
      searchInput: "", //左侧搜索
      dialogFormData: {
        //弹出框数据
        isIndeterminate: false, //全选框状态
        workName: "", //工作组名称
        workUser: [], //选择的成员
        lastWork: {}, //上级工作组
        checkAll: false, //全选
      },
      visible: false, //右键菜单的显示
      addShow: false, //添加成员显示
      top: "", //右键菜单位置
      left: "", //右键菜单位置
      rules: {
        //校验规则
        workName: [
          { required: true, message: "请输入工作组名称", trigger: "blur" },
        ],
        lastWork: [
          {
            required: true,
            validator: (rule, value, callback) => {
              if (JSON.stringify(value) == "{}") {
                return callback(new Error("请选择上级工作组"));
              } else {
                callback();
              }
            },
            trigger: "change",
          },
        ],
      },
      workUserOptions: [
        {
          post: "岗位",
          name: "严正明",
          company: "单位",
          department: "部门",
          userId: 20226241,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "樊梨花",
          company: "单位",
          department: "部门",
          userId: 20226242,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "范海霞",
          company: "单位",
          department: "部门",
          userId: 20226243,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "卢玉霞",
          company: "单位",
          department: "部门",
          userId: 20226244,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "刘小二",
          company: "单位",
          department: "部门",
          userId: 20226245,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张素珍",
          company: "单位",
          department: "部门",
          userId: 20226246,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "刘晓芒",
          company: "单位",
          department: "部门",
          userId: 20226247,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
      ],
      lastWorkOptions: [
        {
          name: "根目录",
          id: "0",
        },
        {
          name: "重要工作组",
          id: "1",
        },
        {
          name: "其他工作组",
          id: "5",
        },
      ],
      dizhenzhuanjia: [
        {
          post: "岗位",
          name: "地震专家1",
          company: "单位",
          department: "地震预测部门",
          userId: 20226261,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "地震专家2",
          company: "单位",
          department: "地震预测部门",
          userId: 20226262,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "地震专家3",
          company: "单位",
          department: "地震预测部门",
          userId: 20226263,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "地震专家4",
          company: "单位",
          department: "地震预测部门",
          userId: 20226264,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
      ],
      gesijulingdao: [
        {
          post: "岗位",
          name: "北司局领导",
          company: "单位",
          department: "部门",
          userId: 20226271,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "东司局领导",
          company: "单位",
          department: "部门",
          userId: 20226272,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "南司局领导",
          company: "单位",
          department: "部门",
          userId: 20226273,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "西司局领导",
          company: "单位",
          department: "部门",
          userId: 20226274,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
      ],
      gesijuzhiban: [
        {
          post: "岗位",
          name: "北司局值班",
          company: "值班",
          department: "巡检部门",
          userId: 20226281,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "东司局值班",
          company: "值班",
          department: "巡检部门",
          userId: 20226282,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "南司局值班",
          company: "值班",
          department: "巡检部门",
          userId: 20226283,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "西司局值班",
          company: "值班",
          department: "巡检部门",
          userId: 20226284,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
      ],
      zhihuijia: [
        {
          post: "岗位",
          name: "指挥专家1",
          company: "单位",
          department: "指挥部",
          userId: 20226251,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "指挥专家2",
          company: "单位",
          department: "指挥部",
          userId: 20226252,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "指挥专家3",
          company: "单位",
          department: "指挥部",
          userId: 20226253,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "指挥专家4",
          company: "单位",
          department: "指挥部",
          userId: 20226254,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
      ],
      tableData: [
        //右表数据
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226221,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226222,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226223,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226224,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226225,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226226,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226227,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226228,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226229,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226230,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226231,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226232,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226233,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226234,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226235,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226236,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张三",
          company: "单位",
          department: "部门",
          userId: 20226237,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
        {
          post: "岗位",
          name: "张4",
          company: "单位",
          department: "部门",
          userId: 20226238,
          avatar:
            "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png",
        },
      ],
      newTableData: [],
      menuData: [
        //左侧菜单数据
        {
          name: "重要工作组",
          id: "1",
          children: [
            {
              name: "各司局领导",
              id: "1-1",
            },
            {
              name: "各司局值班人员",
              id: "1-2",
            },
          ],
        },
        {
          name: "其他工作组",
          id: "5",
          children: [
            {
              name: "其他工作组领导",
              id: "5-1",
            },
          ],
        },
        {
          name: "指挥中心保障专班",
          id: "2",
        },
        {
          name: "地震地质专家组",
          id: "3",
        },
      ],
      maxHeight: null, //右表高度
      rightMenuData: {}, //右键菜单选中的数据
      itemFather: {}, //右键菜单选中的父节点数据
      dialogTitle: "新增下级组织", //弹窗标题
      mainHeight: null, //组件高度
    };
  },
  computed: {},
  mounted() {
    //组件在平台的高度
    this.mainHeight = document.getElementsByClassName(
      "application-content-wrap"
    )[0].offsetHeight;
    let { componentId } = this.customConfig || {};
    componentId &&
      window.componentCenter?.register(
        componentId,
        "comp",
        this,
        eventActionDefine
      );
    // 右键点击
    window.addEventListener("click", this.clickOther);
    // this.maxHeight = this.$refs.workGroupRight.offsetHeight - 50 + "px";
    // 右表高度
    this.maxHeight = this.mainHeight - 40 + "px";
  },
  updated() {},
  methods: {
    hanleSelect(item) {
      switch (item.name) {
        case "指挥中心保障专班":
          this.tableData = this.zhihuijia;
          break;
        case "地震地质专家组":
          this.tableData = this.dizhenzhuanjia;
          break;
        case "各司局领导":
          this.tableData = this.gesijulingdao;
          break;
        case "各司局值班人员":
          this.tableData = this.gesijuzhiban;
          break;
        case "领导班子":
          this.tableData = this.newTableData;
          break;
        case "其他工作组领导":
          this.tableData = [];
          break;
        default:
          this.tableData = this.newTableData;
      }
    },
    handleClose(done) {
      done();
    },
    // 搜索功能
    searchFilter() {
      let search = this.searchInput;
      this.tableData = this.tableData.filter(function (item) {
        let searchField = {
          name: item.name,
        };
        return Object.keys(searchField).some(function (key) {
          console.log("key值", key);
          return String(item[key]).toLowerCase().indexOf(search) > -1;
        });
      });
    },
    // 删除右表红
    deleteRow(row) {
      this.$confirm("确定删除此条数据？", {
        customClass: "myClass",
      })
        .then((_) => {
          this.tableData.forEach((item, index) => {
            if (item.userId == row.userId) {
              this.tableData.splice(index, 1);
              return this.$message.success("删除成功");
            }
          });
          done();
        })
        .catch((_) => {});
    },
    // 弹出层确认按钮
    dialogSure() {
      this.$refs["dialogForm"].validate((valid) => {
        if (valid) {
          this.dialogVisible = false;
          this.newTableData = this.dialogFormData.workUser;
          this.tableData = this.newTableData;
          if (this.dialogTitle == "新增下级工作组") {
            if (this.dialogFormData.lastWork.name == "根目录") {
              this.menuData.push({
                name: this.dialogFormData.workName,
                id: 555,
              });
            } else {
              this.menuData.forEach((item, index) => {
                if (item.id == this.dialogFormData.lastWork.id) {
                  if (!item.children) {
                    item.children = [];
                  }
                  item.children.push({
                    name: this.dialogFormData.workName,
                    id: 555,
                  });
                  return this.$message.success("操作成功");
                }
              });
            }
          } else {
            this.rightMenuData.name = this.dialogFormData.workName;
            if (this.dialogFormData.lastWork.name == "根目录") {
              let flag = 0;
              this.menuData.forEach((item, index) => {
                if (item.id == this.rightMenuData.id) {
                  item.name = this.rightMenuData.name;
                  flag = 1;
                  return this.$message.success("操作成功");
                }
              });
              if (flag == 0) {
                this.menuData.forEach((item, index) => {
                  if (item.children) {
                    item.children.forEach((itemSon, indexSon) => {
                      if (itemSon.id == this.rightMenuData.id) {
                        item.children.splice(indexSon, 1);
                      }
                    });
                  }
                });
                this.menuData.push({
                  name: this.dialogFormData.workName,
                  id: this.rightMenuData.id,
                });
              }
            } else {
              this.menuData.forEach((item, index) => {
                if (item.id == this.rightMenuData.id) {
                  this.menuData.splice(index, 1);
                } else {
                  if (item.children) {
                    item.children.forEach((itemSon, indexSon) => {
                      if (itemSon.id == this.rightMenuData.id) {
                        item.children.splice(indexSon, 1);
                      }
                    });
                  }
                }
                console.log(this.dialogFormData);
                if (item.id == this.dialogFormData.lastWork.id) {
                  item.children.push({
                    name: this.dialogFormData.workName,
                    id: this.rightMenuData.id,
                  });
                }
              });
            }
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 弹出层取消按钮
    dialogCancel() {
      this.dialogVisible = false;
    },
    // 全选
    handleCheckAllChange(options, value) {
      this.dialogFormData.workUser = value ? options : [];
      this.dialogFormData.isIndeterminate = false;
    },
    // 添加成员
    doSelectChange(event, options) {
      const checkLength = this.dialogFormData.workUser.length;
      this.dialogFormData.isIndeterminate =
        checkLength > 0 && checkLength < options.length;
      this.dialogFormData.checkAll = checkLength === options.length;
    },
    // 左侧加号事件
    newSon() {
      this.dialogFormData = {
        isIndeterminate: false,
        checkAll: false,
        workName: "",
        workUser: [],
        lastWork: {},
      };
      this.rightMenuData = {};
      this.$nextTick(() => {
        this.$refs["dialogForm"].clearValidate();
      });
      this.dialogTitle = "新增下级工作组";
      this.dialogVisible = true;
    },
    // 右键菜单添加成员
    newSonMenu() {
      this.dialogFormData = {
        isIndeterminate: false,
        checkAll: false,
        workName: "",
        workUser: [],
        lastWork: this.rightMenuData,
      };
      this.itemFather = {};
      this.$nextTick(() => {
        this.$refs["dialogForm"].clearValidate();
      });
      this.visible = false;
      this.dialogTitle = "新增下级工作组";
      this.dialogVisible = true;
    },
    //右键菜单编辑
    editRow() {
      this.dialogFormData = {
        isIndeterminate: false,
        checkAll: false,
        workName: this.rightMenuData.name,
        workUser: [],
        lastWork: this.itemFather
          ? this.itemFather
          : {
              name: "根目录",
              id: 0,
            },
      };
      this.$nextTick(() => {
        this.$refs["dialogForm"].clearValidate();
      });
      this.visible = false;
      this.dialogTitle = "编辑工作组";
      this.dialogVisible = true;
    },
    // 右键菜单删除
    deleteWork() {
      this.visible = false;
      this.$confirm("确定删除此条工作组所有内容？", {
        customClass: "myClass",
      })
        .then((_) => {
          this.menuData.forEach((item, index) => {
            if (item.id == this.rightMenuData.id) {
              this.menuData.splice(index, 1);
              this.tableData = [];
              return this.$message.success("删除成功");
            } else if (item.id == this.itemFather.id) {
              item.children.forEach((itemSon, indexSon) => {
                if (itemSon.id == this.rightMenuData.id) {
                  item.children.splice(indexSon, 1);
                  this.tableData = [];
                  return this.$message.success("删除成功");
                }
              });
            }
          });
          done();
        })
        .catch((_) => {});
    },
    // 右键菜单隐藏
    clickOther() {
      this.visible = false;
    },
    //点开右键菜单
    openMenu(event, item, itemFather) {
      this.itemFather = {};
      if (itemFather) {
        this.itemFather = itemFather;
      }
      this.rightMenuData = item;
      if (item.children && item.children.length > 0) {
        this.addShow = true;
      } else {
        this.addShow = false;
      }
      this.visible = true;
      this.top = event.pageY - 180;
      this.left = event.pageX - 300;
      window.click;
    },
    // triggerEvent() {
    //   let { componentId, appId } = this.customConfig || {};
    //   componentId &&
    //     appId &&
    //     window.eventCenter?.triggerEventNew({
    //       objectId: appId,
    //       componentId: componentId,
    //       type: "app",
    //       event: "onImgClick",
    //       payload: {
    //         value: "sasdasd",
    //       },
    //     });
    // },
    // do_EventCenter_messageSuccess() {
    //   alert("动作执行成功！");
    // },
    // Event_Center_getName() {
    //   return "应用二开测试";
    // },
  },
  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>
<style lang="less" scoped>
.mainbox {
  width: 100%;
  display: flex;
  justify-content: space-between;
  background: #03152b;
}
.workGroupLeft {
  width: 23%;
  height: calc(100%-20px);
  border: 1px solid #004465;
  padding: 20px 20px 0px 20px;
  // background: #031329;
  .searchBox {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    .menuSearch {
      width: 85%;
    }
    .plusBox {
      font-size: 40px;
      text-align: center;
      line-height: 32px;
      height: 38px;
      width: 38px;
      color: #00bbf0;
      border: 1px solid #004465;
      cursor: pointer;
    }
    /deep/.el-input__inner {
      border-radius: 0px;
      background: transparent;
      border: 1px solid #004465;
    }
    /deep/.el-input__prefix {
      top: -4px;
    }
  }
  .el-menu-vertical-demo > .el-menu-item {
    margin-top: 10px;
    background: linear-gradient(
      90deg,
      rgba(45, 113, 163, 0.4) 5%,
      rgba(45, 132, 222, 0) 100%
    );
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
  }
  /deep/.el-submenu .el-submenu__title {
    background: linear-gradient(
      90deg,
      rgba(45, 113, 163, 0.4) 5%,
      rgba(45, 132, 222, 0) 100%
    );
    margin-top: 10px;
    span {
      color: #ffffff;
      font-size: 16px;
      font-weight: 700;
    }
  }
  /deep/.el-submenu .el-menu-item {
    color: #ffffff;
    font-size: 16px;
    font-weight: 700;
    background: transparent !important;
  }
  /deep/.el-menu-item:hover,
  /deep/.el-submenu__title:hover,
  /deep/.el-submenu .el-menu-item :hover {
    background: linear-gradient(
      90deg,
      rgba(45, 113, 163, 0.7) 5%,
      rgba(45, 132, 222, 0) 100%
    );
  }
  /deep/.el-submenu .el-menu-item span:hover {
    background: transparent;
  }
}
.workGroupRight {
  width: 71%;
  height: calc(100%-20px);
  border: 1px solid #004465;
  padding: 20px 20px 20px 20px;
}

/deep/.el-menu {
  position: relative;
  border: 0px;
  background: transparent;
  .el-icon-s-custom,
  .el-icon-s-grid {
    color: #00bbf0;
  }
}
/deep/.el-table::before {
  background-color: transparent !important;
}
/deep/ .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}
/deep/ .el-table {
  height: 100%;
}
/deep/ .el-table tr {
  background-color: transparent !important;
}
/deep/.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid #00aadb !important;
}
/deep/.el-table .el-table__cell.gutter {
  background: rgba(0, 44, 71, 0.9);
  border-bottom: 1px solid #00aadb !important;
}
/deep/.el-table__body-wrapper::-webkit-scrollbar-thumb {
  background: #004465;
  width: 1px;
  border: none;
}
/* 滚动条 */

/deep/.el-table__body-wrapper::-webkit-scrollbar {
  color: #02d8fa;
  width: 4px;
}

/deep/.el-dialog {
  border-radius: 4px;
  background: rgba(0, 44, 71, 0.9);
  border: 2px solid #00aadb;
  .el-dialog__title {
    color: #ffffff;
  }
  .el-form-item__label {
    color: #ffffff;
  }
}
.is-active {
  color: #02d8fa !important;
}

.menuRight {
  position: absolute;
  z-index: 100000;
  // height: 30px;
  width: 120px;
  color: #ffffff;
  background: rgba(0, 44, 71, 0.7);
  border: 2px solid #00aadb;
  font-size: 15px;
  cursor: pointer;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .menuButton {
    height: 30px;
    border: 0px;
    display: flex;
    background: transparent;
    margin: 0;
    padding: 0 0 0 10px;
    line-height: 30px;
    border-radius: 0px;
    color: #ffffff;
    /deep/.el-icon-edit,
    /deep/.el-icon-delete,
    /deep/.el-icon-user {
      margin-top: 8px;
      color: #00bbf0;
    }
  }
  .menuButton:hover {
    color: #ffffff;
    background: rgba(0, 187, 240, 0.5);
  }
}
.menuRight:hover {
  .menuButton {
    color: #ffffff;
  }
}
</style>
<style lang="less">
.myClass {
  background: rgba(0, 44, 71, 0.9);
  border: 2px solid #00aadb;
}
.el-message-box__message {
  color: #ffffff;
}
</style>