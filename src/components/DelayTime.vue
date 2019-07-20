<template>
  <div style="display: flex;align-items: center;justify-content: center;">
    <!--图表-->
    <div id="aliveCountCharts" :style="{width: '50%', height: '500px',marginTop:'100px',float:left}"></div>
    <div id="delayTimeCharts" :style="{width: '50%', height: '500px',marginTop:'100px',float: left,}"></div>
  </div>
</template>

<style>
</style>
<script>
  import {getRequest} from '../utils/api'

  export default {
    name: 'delayTime',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted: function () {
      let myChart = this.$echarts.init(document.getElementById('aliveCountCharts'))
      let myChart1 = this.$echarts.init(document.getElementById('delayTimeCharts'))
      this.initCharts(myChart);
      this.init(myChart1);
      const time = [];
      const aliveCount = [];
      const delayTime = [];
      let _this = this;
      getRequest("/show/initDelay").then(resp => {
        if (resp.status == 200) {
          for(let i=0; i<resp.data.length; i++){
            time.push(resp.data[i].date);
            aliveCount.push(resp.data[i].aliveCount);
            delayTime.push(resp.data[i].delayTime);
          }
          myChart.setOption({
            xAxis: {
              data: time
            },
            series: [{
              // 根据名字对应到相应的系列
              name: '当前存活流数',
              data: aliveCount
            }]
          });
          myChart1.setOption({
            xAxis: {
              data: time
            },
            series: [{
              // 根据名字对应到相应的系列
              name: '重构频率',
              data: delayTime
            }]
          });
        } else {
          _this.$message({type: 'error', message: '数据加载失败!'});
        }
      }, resp => {
        _this.$message({type: 'error', message: '数据加载失败!'});
      });
    },
    methods: {
      initCharts(myChart) {
        myChart.setOption({
          title: {
            // 标题
            text: '当前存活流的大小',
            x:'center',
            y:0
            //textAlign:'auto',
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {
                readOnly: true
              },
              magicType: {
                type: ['line', 'bar']
              },
              restore: {},
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          // legend: {
          //   data: ['当前存活流数']
          // },
          xAxis: {
            type: 'category',
            data: [],
            //name: '同时请求流数(个)',
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value} 个'
            }
          },
          series: [
            {
              name: '当前存活流数',
              type: 'line',
              data: []
            }
          ],
          animationDuration: 3000
        });
      },
      init(myChart1) {
        myChart1.setOption({
          title: {
            // 标题
            text: '重构频率动态调整',
            x:'center',
            y:0
          },
          toolbox: {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {
                readOnly: true
              },
              magicType: {
                type: ['line', 'bar']
              },
              restore: {},
              saveAsImage: {}
            }
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross',
              crossStyle: {
                color: '#999'
              }
            }
          },
          // legend: {
          //   data: ['重构频率']
          // },
          xAxis: {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '隔{value} s'
            }
          },
          series: [
            {
              name: '重构频率',
              type: 'line',
              data: []
            }
          ],
          animationDuration: 3000
        });
      }
    }
  }
</script>
