<template>
  <!--<div class="app-container">-->
    <!--<div style="width: 100%;height: 2px;background-color: #ffffff;margin-top: 8px;margin-bottom: 0px"></div>-->



    <!--<div id="line">-->
      <!--<div id="container" :style="{width: '100%', height: '500px',marginTop:'50px'}"></div>-->

    <!--</div>-->

  <!--</div>-->
  <div style="display: flex;align-items: center;justify-content: center;">
    <!--图表-->
    <div id="container" :style="{width: '900px', height: '600px',marginTop:'50px'}"></div>
  </div>
</template>
<script>
  import {putRequest} from '../utils/api'
  import {getRequest} from '../utils/api'
  import data from '../../topo.json'

  export default{
    data() {
      return {
        topo: '',
        articles: [],
        loading: false,
        currentPage: 1,
        pageSize: 5,
        totalCount: -1,
        keywords: ''
      }
    },
    mounted(){
      this.topo = data
      this.drawLine();
    },
    methods: {
      drawLine() {

        // 基于准备好的dom，初始化echarts实例
        let myChart = this.$echarts.init(document.getElementById('container'))
        // 绘制图表
        var end_obj = [];
        var end_obj2 = [];
        var end_links = [];
        var layer = 0;


        myChart.showLoading();  //显示loading动画
        // $.getJSON("./topo.json").done(function(res) {  //读取json文件
        console.log(this.topo.Switch.length);
        for (var k = 0; k < this.topo.Switch.length; k++) {
          var obj = {
            name : '',
            // x : 0,  //交换机显示的x坐标
            // y : 300,  //交换机显示的y坐标
            symbol : '',
            symbolSize : [ 75, 75 ]
          }; //switch
          obj.name = this.topo.Switch[k].name;
          if (layer ==this.topo.Switch[k].layer) {
            count++;
          } else {
            var count =1;
          }
          if (this.topo.Switch[k].layer ==1) {
            obj.x = 4250 * (count);
          } else {
            obj.x = 2500 * (count);
          }
          // obj.x = 2500 * (count);
          obj.y = 300 * (this.topo.Switch[k].layer + 1);
          obj.symbol = 'image://https://i.ibb.co/MC3SGGn/switch1.png';
          end_obj.push(obj);  //把交换机元素压入队尾
          layer = this.topo.Switch[k].layer;
        }
        ;
        layer = 0;
        for (var v = 0; v < this.topo.PC.length; v++) {
          var obj2 = {
            name : '',
            x : 0,  //交换机显示的x坐标
            y : 500,  //交换机显示的y坐标
            symbol : '',
            symbolSize : [ 75, 75 ]
          }; //switch
          obj2.name = this.topo.PC[v].name;
          if (layer ==this.topo.PC[v].layer) {
            count++;
          } else {
            var count =1;
          }
          if (this.topo.PC[v].layer ==5) {
            obj2.x = 2500 * (count);
          } else {
            obj2.x = 1500 * (count);
          }
          obj2.y = 300 * (this.topo.PC[v].layer + 1);
          obj2.symbol = 'image://https://i.ibb.co/j85bq1H/host.png';
          end_obj.push(obj2);  //把交换机元素压入队尾
          layer = this.topo.PC[v].layer;
        }
        ;
        for (var a = 0; a < this.topo.Links.length; a++) {
          var links = {
            value : 0,
            source : '',
            target : ''
          };
          links.value = this.topo.Links[a].value;
          links.source = this.topo.Links[a].source;
          links.target = this.topo.Links[a].target;
          end_links.push(links); //把交换机的连接关系压入队尾
        }
        ;

        myChart.hideLoading(); //隐藏lodaing动画
        myChart.setOption({
          title : {
            // text : '网络拓扑'
          },
          animationDurationUpdate : 1500,
          animationEasingUpdate : 'quinticInOut',
          series : [
            {
              type : 'graph',
              layout : 'none',  //图的布局
              symbolSize : 50,  //箭头的大小
              roam : true,      //开启鼠标缩放和平移漫游
              label : {
                normal : {
                  show : true
                }
              },
              edgeSymbol : [ 'circle', 'circle' ], //边两端的标记形状，circle，arrow
              edgeSymbolSize : [ 4, 10 ],         //边两端的标记大小
              edgeLabel : {
                normal : {
                  textStyle : {
                    fontSize : 20
                  }
                }
              },
              data : end_obj,
              // data : end_obj2,
              links : end_links,
              lineStyle : {
                color : 'source',
                // curveness : 0.1
              }
            }
          ]
        })
        ;


        myChart.setOption({
          tooltip : {
            trigger : 'item',
            formatter : function(params) {   // 设置标签
              if (params.data.value) {
                return params.data.source + '到' + params.data.target + '的流量为' + params.data.value;
              } else {
                return params.name;
              }
            }
          },
        });

      }
    }
  }
</script>
<style type="text/css">

</style>
