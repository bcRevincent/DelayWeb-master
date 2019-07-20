<template>
  <div style="display: flex;align-items: center;justify-content: center;">
    <!--图表-->
    <div id="drawPath" :style="{width: '100%', height: '500px',marginTop:'50px'}"></div>
  </div>
</template>

<style>
</style>
<script>
  import {getRequest} from '../utils/api'

  export default {
    name: 'drawPath',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted() {
      this.initCharts();
      this.timer = setInterval(this.initCharts, 5000);
    },
    methods: {
      initCharts() {
        let myChart = this.$echarts.init(document.getElementById('drawPath'));
        myChart.setOption({
            title: {
              text: '交换机拓扑'
            },
            tooltip: {//定位到点就是显示点,定位到边就是显示边,待补充
              formatter: function (param) {
                if (param.data.name != undefined) {//触发节点

                  if (param.data.name.indexOf("h")) {
                    return "openflow:" + param.name;
                  } else {
                    return param.data.name;
                  }
                } else { //触发边
                  if (param.data.value == 1) {
                    return param.data.source + "-->" + param.data.target;
                  } else {
                    return "";
                  }
                }

              }
            },
            animationDurationUpdate: 1500,
            animationEasingUpdate: 'quinticInOut',
            series: [
              {
                type: 'graph',
                layout: 'none',
                //symbol:'image://./assets/logo.png',
                symbolSize: 50,
                roam: true,
                label: {
                  normal: {
                    show: true,
                    position: 'right',
                    formatter: function (param) {        // 标签内容
                      if (param.data.name.indexOf("h")) {
                        return "openflow:" + param.name;
                      } else {
                        return param.data.name;
                      }

                    }
                  },

                },
                //   edgeSymbol: ['circle', 'arrow'], //加箭头的
                //   edgeSymbolSize: [4, 10],
                edgeLabel: {
                  normal: {
                    textStyle: {
                      fontSize: 20
                    }

                  }
                },
                //  data:data,
                // links: [],


              }
            ]
          }
        );
        this.request(myChart);
      },
      request(myChart) {
        let _this = this;
        let links = [];
        let srcIP = [];
        let srcHost = [];
        let dstIP = [];
        let dstHost = [];
        let data = [{name: '1', x: 100, y: 100},
          {name: '2', x: 300, y: 100},
          {name: '3', x: 50, y: 150},
          {name: '4', x: 150, y: 150},
          {name: '5', x: 250, y: 150},
          {name: '6', x: 350, y: 150},
          {name: '7', x: 55, y: 200},
          {name: '8', x: 145, y: 200},
          {name: '9', x: 255, y: 200},
          {name: '10', x: 345, y: 200},
          {name: 'h1', x: 20, y: 250},
          {name: 'h2', x: 80, y: 250},
          {name: 'h3', x: 120, y: 250},
          {name: 'h4', x: 180, y: 250},
          {name: 'h5', x: 220, y: 250},
          {name: 'h6', x: 280, y: 250},
          {name: 'h7', x: 320, y: 250},
          {name: 'h8', x: 380, y: 250},
          {name: 'h9', x: 50, y: 290},
          {name: 'h10', x: 150, y: 290},
          {name: 'h11', x: 250, y: 290},
          {name: 'h12', x: 350, y: 290},

        ];
        //给交换机和主机分别给予不同的图像
        for (let i = 0; i < data.length; i++) {
          if (data[i].name.indexOf("h")) {
            data[i].symbol = 'image://https://i.ibb.co/MC3SGGn/switch1.png';
            //data[i].symbol="image://../assets/switch1.png";
          } else {
            data[i].symbol = 'image://https://i.ibb.co/j85bq1H/host.png';

          }
        }
        let linestyle = {
          normal: {
            opacity: 0.9,
            width: 2,
            curveness: 0,
            color: "#00BFFF"
          }
        };
        let linestyle1 = {
          normal: {
            opacity: 0.9,
            width: 1,
            curveness: 0,
            color: "#000"
          }
        };
        getRequest("/OdlInfo/drawPath").then(resp => {
          if (resp.status == 200) {
            links = resp.data["Link"];
            srcIP = resp.data["srcIP"];
            srcHost = resp.data["srcHost"];
            dstIP = resp.data["dstIP"];
            dstHost = resp.data["dstHost"];
            for (let i = 0; i < links.length; i++) {
              if (links[i].value == 1) {
                links[i].lineStyle = linestyle;
              } else {
                links[i].lineStyle = linestyle1;

              }
            }
            console.log(data);

            console.log(links);
            myChart.setOption({        //加载数据图表
              series: [
                {
                  type: 'graph',
                  links: links,
                  data: data,
                  label: {
                    normal: {
                      show: true,
                      position: 'bottom',
                      formatter: function (param) {        // 标签内容
                        if (param.data.name.indexOf("h")) {
                          return "openflow:" + param.name;
                        } else {
                          if (param.data.name==srcHost) {
                            return param.data.name + "(" + srcIP + ")";
                          } else if (param.data.name==dstHost) {
                            return param.data.name + "(" + dstIP + ")";
                          } else {
                            return param.data.name;
                          }
                        }

                      }
                    },

                  },

                }
              ]
            });
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }, resp => {
          _this.$message({type: 'error', message: '数据加载失败!'});
        });
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }

  }
</script>
