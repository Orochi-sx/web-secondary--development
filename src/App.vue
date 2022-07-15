<template>
  <div class="login_all">
    <!-- 背景图1 -->
    <div class="login_bg1"></div>
    <!-- 背景图2 -->
    <div class="login_bg2"></div>
    <!-- 登录表单 -->
    <el-form class="login_frame" :rules="dataRule" ref="dataForm" :model="dataForm">
      <!-- 用户登录 -->
      <div class="frame_title"></div>
      <!-- 登录账号 -->
      <el-form-item class="frame_input" prop="account">
        <el-input v-model="dataForm.account"  placeholder="请输入登录账号">
          <img :src="frameIcon.account" slot="prefix" />
        </el-input>
      </el-form-item>
      <!-- 登录密码 -->
      <el-form-item class="frame_input" prop="password">
        <el-input v-model="dataForm.password"  placeholder="请输入您的密码" :type="passwordType">
          <img :src="frameIcon.password" slot="prefix" />
          <img v-if="!passwordShow" @click.stop="changeIcon(false)" :src="frameIcon.passwordOn" slot="suffix"/>
          <img v-if="passwordShow" @click.stop="changeIcon(true)" :src="frameIcon.passwordOff" slot="suffix"/>
        </el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item class="frame_input" prop="imageCode">
        <div class="frame_code">
          <el-input v-model="dataForm.imageCode"  placeholder="验证码">
            <img :src="frameIcon.code" slot="prefix" />
          </el-input>
          <div class="frame_verification">
            <img @click.stop="changeCode()" :src="frameIcon.verification" />
          </div>
        </div>
      </el-form-item>
      <!-- 登录按钮 -->
      <div class="frame_button">
        <el-button type="primary" @click="login()">登 录</el-button>
      </div>
      <!-- 记住密码 -->
      <div class="frame_remember">
        <el-checkbox v-model="rememberCheck">记住密码</el-checkbox>
        <span @click="anonymous()">匿名上报</span>
      </div>
    </el-form>
  </div>
</template>

<script>
// 逻辑控制
import eventActionDefine from "./components/msgCompConfig";
// 接口
import { getAuthPic, loginAccount, queryAll, loginAnonymous } from "./api/asset"
// 加密
import { Encrypt } from "./api/index";
// 样式
import "./index.css";
// 记住密码加密
const Base64 = require("js-base64").Base64

import Cookies from 'js-cookie'

export default {
  name: "App",

  props: {
    customConfig: Object,
  },

  mounted() {
    let { componentId } = this.customConfig || {};
    componentId && window.componentCenter?.register(componentId, "comp", this, eventActionDefine);

    this.changeCode()
    
    this.$nextTick( () => {
      localStorage.getItem('cdyx-account') ? this.dataForm.account = localStorage.getItem('cdyx-account') : this.dataForm.account = ''
      localStorage.getItem('cdyx-password') ? this.dataForm.password = Base64.decode(localStorage.getItem('cdyx-password')) : this.dataForm.password = ''
      localStorage.getItem('cdyx-rememberCheck') == 'on' ? this.rememberCheck = true : this.rememberCheck = false
    })

    this.getLoginInfo()
  },

  data() {
    return {
      // 登录框图标
      frameIcon: {
        account: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAcVJREFUOE+t000vK1EYB/D/c1QTL4mEjdiwRa6vUDVF4iVsiJi6udJOSVhJfABLCR9gTIWUFt2IICHV2si9q2tBWLjbu2BB4p0y80gnKkKnppjtPP/f/M+Zcwjf/JAdT1XV/IuCKufoz+brj+azglooVs2CJkHUSICDwf9gYCzQ5wlbwZagthirhi7+ACh5GyZg1C9LE5lQazAcXwfQkinE4HsiVCq9npMMH3sf6YpG85qSZbcg5FvuGYsexetesgWq6mqhKC68ApBlj4Vfkd3TtsDUkBaO7wH4YdXQYEfdgNe1bxuciiS6iXkxU0tmXgl4PZ05/RSz5fzWEIjGARQ9hxnAsri7+uXzdVzmDKYCweBGKRc46wlc9Mj8d9DrOcx2uG3dlI9ux+v3liAzk7awXQNdryUSFUxwgI0z1nGE0rvdgfb2G1tLnookXGQY/SBqA1Bm0S4JYIcICxfHp+GRke7b9NxLw5mZ7fJHpz4LUHMuSwTwn2H4A3LjZipngtHogfP84XgXQG2OWHo8yQbcgT7ptwlqoc0G5Dnin8TSsaAiS4oJqnOxViHE2hfBiCJLsgkG5xMSE4e+BtKyIjcMf/s5fAKOL5IVBsGuIQAAAABJRU5ErkJggg==',
        password: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAalJREFUOE+t0rFLW1EUx/HveVqJIC4ZupT2Dwhd28HJXBeHToW33IAUfaEUp1KwnbRbVexQKNS8goJ5Im9wskvJM3+BootLh9KldLCgBakQfadECOhLYm9a73rP+dzz4x7hho/csMe14MpKPde4pa9E0icgd4CvorI8PHC45Pv+eadhuoJxHPcdN/KfgSJKoqL7gjwERoDNwJrHPYHL1dqEJ7IqKjNTpeJCq7myliyKxwtVfVQujW1l0a4ThtXahoqMf//i5efmRs9aje/j+tBAIz0C+RDY4rQzWKnWtgS5H5TMvWxTGCVHwKfAGnst+DaOB4fP8mPnSk6UlyLcTeFZtslTXVVhV5F3fcLpr/6ftee+/7tZdyXyxyjZVhjtdZUU6mVrim1gGCVp9hFHXANrvE6gOgJtZYE1F2mvRA6jpBt4DOwAD4ChTo/2Ap4IFKas+VZZ3y6guifQn0WdQVUOyiVTaAFhlPwAbv8zCCjI01RkUzSdFHjzv5Gd/sk5spMGdAOb255zRS7VnQbWDLatTSVKZoBZgYtLl6PQHOJ12Zr5NtAF+FvNH0AOnRUrep03AAAAAElFTkSuQmCC',
        passwordOn: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAGZSURBVHgB7VTLbcJAEN01cKcEdxAQH4lToIKQCgIVBCrAVEBcQaCCQAXhhsRHdgkugTPfvGd20MaxSXJORhp5dmf27ZvPWqk/JzrLsVqtmo7jPJzP5zaWrtkOtdbhbrcbNhqN6EeAQRAUj8fjK8y2usVE63EasGMvFouFC7DAgG3BbghtVatVTT2dTmXohLHY7xQKhXeeSWVIBwNMevP9ft/NSsvEvsEs8WLEliVWW2mSmUsG9Xq9I4c3m80AbHqSZqVS6YtvuVyOUecnmFEulytDtnHKABkYZlECbAQwD2aRSmA0yxM/WPKikGcPh0PvWkPTSQXqLTs11imZLlg+i01GiOnb+9IUMlD5fN5VvxQwi4y5tRn65pYR62kx9FMwJvbCNJIyuwKC2Qs+EbSEeo4kuFarefj45vZ4jDA+PfGv12vOq6suTfFiUuI0o8BOk2GIej5+MzYEaxKMtf80NolAmcV4TDBOPjrPTspzvDdjVEyCfQEUUNI383VLpojrstP2ZubPwQK+U5cXQYmgMzCcor5z9S+UD3tu4fI7IaQzAAAAAElFTkSuQmCC',
        passwordOff: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAx9JREFUOE+tlE9oXUUUxr9v+vJsYlFoKiJF7EsQS6JBuZOXEBTycCNd2C5S66LipsRSFyLqwhLBjS2K4kZtFLuIotCApRX/V42ghPTeuWisDwRdCaIupNT7TPLMvfPJhJfwnkot1lmeOfObOd/55hD/82I7r16vlwcHB/+4nDs2gM65xwE8CWDSWjvzX6EbwDRNJyVNAxCAB6210865PZImSVoAvQAuSDpH8kSWZa/VarXGXy/uKDlN04clPReSSD7ivf+M5EcAtklaIbm5DfATgEPW2lPt0A5g2HDOHQTwYmBKeqIoipmenp7fh4aGztfr9S1LS0t3knwUwO2hGpJTURQdWYd2AJ1ze733vxhjKpKOk9xE8qkoiqbm5uY2j4+PN0kGScLFDwF4FkAJwGFr7dG1ytbJaZpGkr4A4IuiuLlUKlUlvQ6gi+Tz3vsXSL4h6dXh4eHj4Vwcx/cYY94EYLz3E9Vq9eQacHZ2dlNfX983AHaSfCWKogdCPEmS3aEBAK4AMO29P0LyjDHmUBRFn7ZyHiP5DIDz5XK5fw0Yx/GtxpgvAfycZVmlVquthPji4uKVzWbzDpInSXYDmDHGHPbe77bWHluvzjm3AGCE5L41oHOuH8D3JBuSBq21P7Ti95MsJP0I4G0AWySdaDQa+2u1Wh5yQqOWl5fPAdghadeGhkmSnCZ5t6R4dXV1fGxsbHlhYeGqUqn0FcmjRVHUjTHvAbgawKnu7u59AwMDq2maBkn2Avg6y7Ko/adsI5lI2gHg3d7e3olKpbIyPz+/vVwuT4WXGWMySR8Gk5P8IM/z/caYt0jeFkq21n7bYZskSW4i+TmAawCczfP8vtHR0e/ajeucuwXAGQDXAphrNpv3dnV13VCtVpMO27QJvBPAOwD6STaDCbz37wcdjTFbWyWfBfAxgO2S5knustZe+EdgCLa0e1rSAZLBuB0r2MR7/zLJT0IzSLo8z+8aGRn59W9fr/1kS78JAMOSgm6/SVoMNgp6xXF8vTEmQG8EcNpau+eiwEsZYc656yQdC0PEWvvSZQMvOr4u5UX/lvMnxblbUxZ/GzYAAAAASUVORK5CYII=',
        code: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAhNJREFUOE+t1D1oFEEUB/D/mzligtHiFKIIfoCmMoWNCAqSzEYlxEoiXHYFiTuWFmIaLfwobGKjoBBvq+M2oNhIEE7d86O4IlrYiI3phEgCBlTkksvdPLm7GG7P29srsuXMe7/ZffPeEjb5oU48L/vmOIjXXFt9iItvCz58+ra3q2RugXAVzAzQgyJWb15xRn5Fwf+BmczLrUUpjwqIcwCnACTDybwMJp+5EpAUc3rcWmzcD4HeTP45M84C6KgUVYiIXrjjQ6P/0FBi2s8XAXTH1Sm0z/itHbU9ClwBsKUDsLIeIwGsaFv1RIEchxHwA8AIg48BdB+MP9pRvXEgA/wZoIGmAxYTbIZLXfgpSiIPwsHqAa6tdsaB89pWhzw/P8XAtXowfVszq8M9QpoyZABgb32dF7Rt7YkCq59TaxMC7rm2mkz7wTRAVkIIVaqUtwmIVyDsanjzgrbVidZgNpgF0UYLGJjb378W7uzuP5lkwn5ZMTkQdoTLQHe1PXSjJfg4G4wS0WxjAjNfFwKfDOMJgTbaYz2GJfPhCcf60hKsLqb9IAfQ6bjbrpcPz7SjxiInpQbOBH1gmgOwrx3KzEtSmiOXUqcW2oI1NPP+AMtyjoD+CHSZmc9cdqyPzfuRM+t5uSR3Jx6B6HzTbBfIiIvuhcH5VofF/gSms68HBNEYiARIBDo1+K5dKWLBji6nIWjTwb9pm7YVnZncGgAAAABJRU5ErkJggg==',
        verification: '',
      },
      // 登录表单
      dataForm: {
        account: '',
        password: '',
        imageCode: '',
        username: ''
      },
      // 密码显示隐藏
      passwordShow: true,
      // 密码框类型
      passwordType: 'password',
      // 记住密码
      rememberCheck: true,
      // 跳转地址
      loginInfo: ''
    }
  },

  computed: {
    // 表单校验
    dataRule () {
      return {
        account: [{ required: true, message: '请输入您的用户名', trigger: 'submit' }],
        password: [{ required: true, message: '请输入登录密码', trigger: 'submit' }],
        imageCode: [{ required: true, message: '请输入验证码', trigger: 'submit' }]
      }
    }
  },

  methods: {
    // 切换密码框类型
    changeIcon(type) {
      if(type) {
        this.passwordShow = false
        this.passwordType = ''
      } else {
        this.passwordShow = true
        this.passwordType = 'password'
      }
    },
    // 切换验证码
    changeCode() {
      getAuthPic().then( response => {
        const url = 'data:image/png;base64,' + btoa(
          new Uint8Array(response.data).reduce( (data, byte) => data + String.fromCharCode(byte), '' )
        );
        this.frameIcon.verification = url
      }).catch( (err) => {
        const url = 'data:image/png;base64,' + btoa(
          new Uint8Array(err.data).reduce( (data, byte) => data + String.fromCharCode(byte), '' )
        );
        this.frameIcon.verification = url
      });
    },
    // 请求用户信息
    getLoginInfo() {
      queryAll().then( (res) => {
        this.loginInfo = JSON.parse(res.data.ANONYMOUS_LOGIN.current_value).anonymous
      })
    },
    // 登录
    login() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid)  return false
        let loginForm = {
          account: this.dataForm.account,
          username: this.dataForm.account,
          imageCode: this.dataForm.imageCode,
          password: Encrypt(this.dataForm.password)
        }
        // 跳转页面
        loginAccount(loginForm.imageCode, loginForm).then( (res) => {
          this.changeCode()
          // 记住密码
          if (this.rememberCheck) {
            let account = this.dataForm.account
            let password = Base64.encode(this.dataForm.password)
            localStorage.setItem('cdyx-account', account)
            localStorage.setItem('cdyx-password', password)
            localStorage.setItem('cdyx-rememberCheck', 'on')
          } else {
            localStorage.removeItem('cdyx-account')
            localStorage.removeItem('cdyx-password')
            localStorage.removeItem('cdyx-rememberCheck')
          }
          // 跳转页面
          window.location.href = `${window.location.origin}${this.loginInfo.route}`
        }).catch( (err) => {
          this.changeCode()
          if(err.data.message == "Picture verification code verification failed"){
            this.$message.error('图片验证码校验失败');
          } else if(err.data.message == "Wrong user name or password") {
            this.$message.error('用户名或密码错误');
          }
        })
      })
    },
    // 匿名登录
    anonymous() {
      // 请求账账号密码
      this.changeCode()
      let loginForm = {
        account: this.loginInfo.username,
        password: this.loginInfo.password,
      }
      loginAnonymous(loginForm).then( (res) => {
        // 跳转页面
        window.location.href = `${window.location.origin}${this.loginInfo.route}`
      })
    },

    triggerEvent() {
      let { componentId, appId } = this.customConfig || {};
      componentId &&
        appId && window.eventCenter?.triggerEventNew({
          objectId: appId,
          componentId: componentId,
          type: "app",
          event: "onImgClick",
          payload: { value: "" },
        });
    },
    do_EventCenter_messageSuccess() {
      alert("动作执行成功！");
    },
    Event_Center_getName() {
      return "成电医星";
    },
  },

  destroyed() {
    window.componentCenter?.removeInstance(this.customConfig?.componentId);
  },
};
</script>

<style scoped lang="less">
  .login_all {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: rgb(40, 148, 252);
    line-height: 1.5715;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;
    // 背景图1
    .login_bg1 {
      position: absolute;
      left: 4%;
      top: 7%;
      width: 510px;
      height: 70px;
      background: url('./assets/login_bg1.png') no-repeat;
      background-repeat: no-repeat;
    }
    // 背景图2
    .login_bg2 {
      position: absolute;
      left: 10%;
      top: 10%;
      width: 929px;
      height: 929px;
      background: url('./assets/login_bg2.png') no-repeat;
      background-repeat: no-repeat;
    }
    // 用户登录
    .frame_title {
      width: 100%;
      height: 50px;
      background: url('./assets/login_bg1.png') no-repeat;
      background-size: 100% 100%;
      margin-bottom: 24px;
    }
    // 登录框整体
    .login_frame {
      box-sizing: border-box;
      position: absolute;
      margin-right: 20%;
      top: 20%;
      width: 480px;
      height: 500px;
      z-index: 1;
      right: 0%;
      background: #ffffff;
      border-radius: 12px;
      text-align: center;
      padding: 33px 32px;
    }
    // 账号密码框
    .frame_input {
      margin-bottom: 24px;
      /deep/ .el-input__inner {
        box-sizing: border-box;
        height: 64px;
        line-height: 64px;
        font-size: 16px;
        padding-top: 2px;
        padding-left: 91px;
        &:hover{
          border-color: #2e7bff;
        }
        &:focus{
          box-shadow: 0 0 0 2px #cdddfc;
        }
      }
      // 左槽
      /deep/ .el-input__prefix {
        display: flex;
        align-items: center;
        padding-left: 7px;
        margin-right: 4px;
      }
      // 右槽
      /deep/ .el-input__suffix-inner {
        display: flex;
        align-items: center;
        height: 100%;
        margin-left: 4px;
        padding-right: 7px;
        cursor: pointer;
      }
    }
    // 验证码
    .frame_code {
      display: flex;
    }
    // 验证码图标
    .frame_verification {
      height: 64px;
      display: flex;
      align-items: center;
      img {
        width: 100px;
        height: 40px;
        cursor: pointer;
        margin-left: 15px;
      }
    }
    // 登录按钮
    .frame_button {
      width: 100%;
      height: 54px;
      line-height: 54px;
      /deep/ .el-button {
        width: 100%;
        height: 100%;
        margin-top: 20px;
        padding-top: 16px;
        border-radius: 27px;
        border-color: #2c97dd;
        background-color: #2c97dd;
        font-size: 16px;
      }
    }
    // 记住密码
    .frame_remember {
      width: 100%;
      text-align: center;
      margin-top: 35px;
      font-family: PingFang SC Regular,PingFang SC Regular-Regular;
      letter-spacing: 2px;
      /deep/ .el-checkbox__input.is-checked+.el-checkbox__label {
        color: #5e605f;
      }
      span {
        letter-spacing: 0px;
        margin-left: 13px;
        cursor: pointer;
        color: blue;
        font-size: 14px;
        line-height: 20px;
      }
    }
  }
</style>