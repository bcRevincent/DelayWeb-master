import Vue from 'vue'
import Router from 'vue-router'
import Home from "@/components/Home";
import Subnet_Select from "../components/Subnet_Select";
import Multi_partical from "../components/Multi_partical";
import Basic_data from "../components/Basic_data";
import HistoryList from "@/components/HistoryList";
import DataCharts from "@/components/DataCharts";
import DefenceShow from "@/components/DefenceShow";
import DataAnalysis from "@/components/DataAnalysis";
import ReadFile from "@/components/ReadFile";
import initDelay from "../components/initDelay";
import DelayTime from "../components/DelayTime";
//import FlowControl from "../components/FlowControl";
import DrawPath from "../components/DrawPath";
import tempLevel from "@/components/tempLevel";
import historyLevel from "@/components/historyLevel";
import tempIndex from "@/components/tempIndex";
import historyIndex from "@/components/historyIndex";
import SwitchInfo from "../components/SwitchInfo";
import Ipshow from  "../components/IpShow";
import Networkeff from "../components/NeteffShow";
import tempLevelandIndex from "@/components/tempLevelandIndex";
import ToPo from "../components/ToPo";
import EventLog from "../components/EventLog";
import EventSearch from "../components/EventSearch"

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: '',
      component: Home,
      hidden: true
    }, {
      path: '/',
      component: Home,
      name: '网络元数据采集分析系统',
      iconCls: 'fa fa-reorder',
      children: [
        {
          path: '/basic-info',
          name: '数据采集信息',
          component: Basic_data ,
          meta: {
            keepAlive: false
          }
        }, {
          path: '/subnet',
          name: '子网选择',
          component: Subnet_Select,
          meta: {
            keepAlive: false
          }
        }, {
          path: '/multi-granularity',
          name: '不同粒度数据',
          component: Multi_partical
          // meta: {
          //   device_list: []
          // }
        }
      ]
    }, {
      path: '/',
      component: Home,
      name: '侧信道攻击抵御系统',
      iconCls: 'fa fa-reorder',
      children: [
        {
          path: '/historyList',
          name: '历史记录',
          component: HistoryList,
          meta: {
            keepAlive: false
          }
        }, {
          path: '/charts',
          name: '数据统计',
          component: DataCharts,
          meta: {
            keepAlive: false
          }
        }, {
          path: '/defenceShow',
          name: '防御效果',
          component: DefenceShow,
          meta: {
            keepAlive: false
          }
        }
      ]
    }, {
      path: '/',
      component: Home,
      name: '网络动态重构与平滑布防系统',
      iconCls: 'fa fa-file-text-o',
      children: [
        {
          path: '/drawPath',
          name: '路径展示',
          component: DrawPath,
          meta: {
            keepAlive: true
          }
        }, {
          path: '/initDelay',
          name: '重构时机',
          component: initDelay,
          meta: {
            keepAlive: false
          }
        }, {
          path: '/delayTime',
          name: '重构频率',
          component: DelayTime,
          meta: {
            keepAlive: false
          }
        }/*,{
          path: '/flowControl',
          name: '流量分布',
          component: FlowControl,
          meta: {
            keepAlive: true
          }
        }*/
      ]
    },

    {
      path: '/',
      component: Home,
      iconCls: 'fa fa-reorder',
      name: '威胁等级划分系统',
      children: [
      {
          path: '/tempLevelandIndex',
          iconCls: 'fa fa-reorder',
          name: '系统当前威胁等级',
          component: tempLevelandIndex,
          meta: {
            keepAlive: true
          }
        },
        {
          path: '/historyLevel',
          iconCls: 'fa fa-bar-chart',
          name: '系统历史威胁等级',
          component: historyLevel,
          meta: {
            keepAlive: false
          }
        },
        {
          path: '/historyIndex',
          iconCls: 'fa fa-bar-chart',
          name: '业务历史威胁指数',
          component: historyIndex
          ,
          meta: {
            keepAlive: true
          }
        }
      ]
    }
    ,
    {
      path:'/',
      component: Home,
      name: '网络僵化度评估系统',
      iconCls: 'fa fa-file-text-o',
      children:[
        {
          path:'/SwitchInfo',
          name:'交换机网络资源',
          component:SwitchInfo,
          meta:{
            keepAlive: false
          }
        },{
          path:'/IpShow',
          name:'网络地址使用量',
          component:Ipshow,
          meta:{
            keepAlive:false
          }
        },{
          path:'/NeteffShow',
          name:'网络策略效率',
          component:Networkeff,
          meta:{
            keepAlive:false
          }
        }
      ]
    },
    {
      path:'/',
      component: Home,
      name: '安全态势感知系统',
      iconCls: 'fa fa-file-text-o',
      children:[
        {
          path:'/ToPo',
          name:'交换机拓扑',
          component:ToPo,
          meta:{
            keepAlive: false
          }
        },{
          path:'/EventLog',
          name:'事件信息',
          component:EventLog,
          meta:{
            keepAlive:false
          }
        },{
          path:'/EventSearch',
          name:'事件查询',
          component:EventSearch,
          meta:{
            keepAlive:false
          }
        }
      ]
    }
  ]
})
