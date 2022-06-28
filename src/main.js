/*
 * @Author: zhangzhuo
 * @Email: zhangzhuo@njsdata.com
 * @LastEditors: Do not edit
 * @Date: 2021-10-21 19:40:39
 * @LastEditTime: 2021-10-22 10:34:09
 * @Description: 请描述文件作用
 */
import Vue from "vue";
import App from "./App.vue";
import './index.css'
// 无缝滚动插件
import scroll from 'vue-seamless-scroll'
Vue.use(scroll)

import { Table, TableColumn, Dialog, MessageBox, Pagination, Select, Option, DatePicker } from "element-ui";
import * as echarts from 'echarts'
import moment from "moment";
Vue.prototype.moment = moment
Vue.config.productionTip = false;
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Dialog);
Vue.use(Pagination);
Vue.use(Select);
Vue.use(DatePicker);
Vue.use(Option);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$echarts = echarts
import config from "../pluginTemp/config.json";

let { domId } = Object.values(config)[0];

let dom = document.getElementById(domId);

if (dom) {
  if (dom.childNodes.length > 0) {
    dom.removeChild(dom.childNodes[0]);
  }

  const App = require("./App.vue").default;
  let wrapper = document.createElement("div");
  wrapper.style = "width: 100%; height: 100%";
  dom.appendChild(wrapper);

  new Vue({
    render: h => h(App),
  }).$mount(wrapper);
} else {
  if (process.env.NODE_ENV !== "production") {
    const dataSource = JSON.parse(
      '[["sjbq","sj_num","sjid","sjlx","sjnr","sjyjfl","sjzt"], ["大苏打","18","1","群体","原来庙观真的曾是不清不净的危险地带，尤其明朝，也就是那些小说和戏曲诞生的年代。《大明律》甚至还有这样的条例：“若有官及军民之家，纵令妻女于寺观神庙烧香者，笞四十，罪坐夫男。无夫男者，罪坐本妇。”时人雷梦麟解释道：“纵容妻女于寺观神庙烧香祈福者，则男女混杂，而奸淫之渐矣。”其实真正的问题还不在男女混杂，而在于当时寺观中的“出家人”不是一般的男女。有许多逃兵贼盗遁入寺中，把清净之地弄得乌烟瘴气，喝酒吃肉穿金戴银，甚至还诱拐良家妇女，开设妓寨。于是有些人外表像尼姑，职业却是性工作，别有用心的烧香客看了要是喜欢，可以直接带到后面的禅房办事。难怪后人都说明末是中国佛教最堕落的时期","市民热线","深圳"],["撒旦","27","2","个体","中国人的宗教观念很世俗，所以中国人的宗教场所也很江湖。就算不为寻春，庙门观前也是个吃喝玩乐的好去处。我们现在过年过节喜欢逛商场，古人的相应活动就是逛庙会了。那里头什么都有，耍猴的，变魔术的，表演功夫卖膏药的，凡是江湖上的行当，全都集中到庙前去了。至于卖杂货做小吃，那就更不用说了。","市民热线","北京"],["刚刚","54","77","群体","虽然我也很受不了寺院兼营妓院的古风，但我对“庙口”这种神奇热闹的传统空间却是很向往的，特别是它的小吃。就说江苏一带，上海城隍庙、南京夫子庙、苏州玄妙观，这些地名几乎等同某种小吃的流派了，过去要找地道好小吃，非去这些庙前的空间不可。我还说得苏州玄妙观前面的“观前路”，什么五香排骨、酱螺蛳、鸭血汤、玫瑰糕、梅花糕、酒酿饼……这一路吃下来，你就知道什么叫做苏州的“香甜软糯”了。可惜时代变了，那一带的地价太高，小吃做不住，反而开了麦当劳。","市民热线","重庆"], ["阿大撒f","12","18","个体","很多人都以为香港保留了不少传统中国文化的特色，我也同意，唯独“庙口”这一点竟是相当罕见。譬如车公庙，每年农历新年车公诞前后数日，它附近的球场都会有架起一行行帐篷的小摊贩，卖风车看掌相。可是受制于政府的卫生观念，这里就是没一家卖吃的。“食环署”全力灭绝港式大排档数十年之后，近日终于醒悟，准许硕果仅存的二十多家人传承家业。他们能不能善心大发，再多放出一些经营牌照呢？如果可以，拿了牌照的业者又该去何处维生？蔡澜建议在天水围设一片小吃摊，我则以为最好的地方莫过“庙口”，比方说黄大仙。","市民热线","南湖"], ["啊手动阀二位","34","39","个体","大陆的“庙口”渐渐走味，香港的“庙口”根本不存在，只有台湾还保留了这套庶民的善美风俗，而且东西真的好吃。吃新竹的贡丸米粉，没有比新竹城隍庙更好的所在了；其他地方亦然。有一趟我在台南，朋友说晚上要带我们吃海鲜，我以为一定是要到海滨河口了，没想到下了车竟是市区里的一座庙。夜凉似水，小城灯静，我们坐在贴地极近的低矮板凳上，前面是一行小卖车展示鱼获，背后则是庙门两侧的红灯笼（上书大字“肃静”）。烹调简单得不能再简单了，白水湛湛煮熟的海产，一人一小碟酱油蘸料。但看附近桌子零落三四张，食客不出十来人，大家吃得也慢话声也低，我居然意外地感受到了一股神圣。","市民热线","大庆"],["确认去","8","781","个体","我把刚来的退稿信胡乱地和以前的退稿信放在了一起。望着这沓足足十厘米厚的废纸，我突然觉得一阵绝望，也许我真的就不是当科幻作家的料——不管怎么说，我还在给一家新兴的量子计算公司干活呢，这活儿本身就几乎是科幻了，虽然我实际做的只不过是管理网站。也许我离科幻最近也只能到这地步了。","市民热线","大连"],["阿斯顿如果","46","452","群体","第二天，在办公室附近的一个餐馆，我一边舀着薄荷奶昔，一边对卡勒布（我的同事，一位量子回路专家）说：“我觉得这辈子甭想指望我的名字上杂志了。”","市民热线","花果山"],["工会人体","7","111","个体","我耸耸肩，“如果我不写编辑想要的东西，再棒也白搭。”","市民热线","水帘洞"], ["违法q","35","1","个体","“没错。”卡勒布从口袋里掏出一支笔，随手在纸巾上画了条曲线，“这事儿是个概率函数。正确的文字组合能让他们买下你的小说，而错误的组合意味着他们不买。”","市民热线","拉沙"],["二万人去二十fd","7","222","个体","然后另一个人打开他手中的同一本书，而这本书对他而言也是完美的。可是如果你比较两本书的话，二者的词句是不一样的，连故事情节和人物都不一样。","市民热线","西双版纳"],["废弃物而非我去饿f","5","4","群体","对于那个使之坍缩的人而言，书就会变成有史以来最好的书。这真是天才的主意！”卡勒布身体前倾，“你愿意成为有史以来最伟大的科幻小说的作者吗？”","市民热线","合肥"], ["去微软q","8","545","群体","我扫过我的姓名，念出声来，“在我看来，这是有史以来最伟大的科幻小说。”我的心脏要跳出嗓子眼了，“这无疑是你投过的所有小说中最好的一篇，可是你到底发什么昏，居然以为你能一字不动地把阿西莫夫的《日暮》照抄过来还不被发现吗？”","市民热线","台湾"], ["asdasdasd","9","88","个体","不过，出租车在市区里跑还是容易碰到以前商场上的客户或对手，“熟人不收费，自己倒贴时间和油钱这不算什么……，最怕遇到的是以前的对手，车资两百三给你三百块，奉送一句：不必找啦，留着用！外加一个奇怪的眼神和笑容，那种窝囊感够你低荡个一整天！","市民热线","香港"]]'
    );
    const options = {
      externalVariables: {
        fontSize: "20px",
      },
    };
    const props = {
      dataSource,
      options,
    };
    const App = require("./App.vue").default;
    new Vue({
      render: h => <App {...{ props }} />,
    }).$mount("#app");
  } else {
    if (!window.CUSTOM_PLUGIN) {
      window.CUSTOM_PLUGIN = new Map();
    }

    window.CUSTOM_PLUGIN.set(
      process.env.VUE_APP_CUSTOM_PLUGIN_ID,
      (dom, props) => {
        if (dom.childNodes.length > 0) {
          dom.removeChild(dom.childNodes[0]);
        }
        const div = document.createElement("div");
        dom.appendChild(div);
        new Vue({
          render: h => <App {...{ props }} />,
        }).$mount(div);
      }
    );
  }
}
