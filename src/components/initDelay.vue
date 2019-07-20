<template>
  <div style="display: flex;align-items: center;justify-content: center;">
    <!--图表-->
    <div id="requestCountCharts" :style="{width: '50%', height: '500px',marginTop:'100px',float:left}"></div>
    <div id="initDelayCharts" :style="{width: '50%', height: '500px',marginTop:'100px',float: left,}"></div>
  </div>
</template>

<style>
</style>
<script>
  import {getRequest} from '../utils/api'

  export default {
    name: 'initDelay',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted: function () {
      let myChart = this.$echarts.init(document.getElementById('requestCountCharts'))
      let myChart1 = this.$echarts.init(document.getElementById('initDelayCharts'))
      this.initCharts(myChart);
      this.init(myChart1);
      const time = [];
      const requestCount = [];
      const initDelay = [];
      let _this = this;
      getRequest("/show/initDelay").then(resp => {
        if (resp.status == 200) {
          for(let i=0; i<resp.data.length; i++){
            time.push(resp.data[i].date);
            requestCount.push(resp.data[i].requestCount);
            initDelay.push(resp.data[i].initDelay);
          }
          myChart.setOption({
            xAxis: {
              data: time
            },
            series: [{
              // 根据名字对应到相应的系列
              name: '同时请求流数',
              data: requestCount
            }]
          });
          myChart1.setOption({
            xAxis: {
              data: time
            },
            series: [{
              // 根据名字对应到相应的系列
              name: '重构时机',
              data: initDelay
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
            text: '同时请求流数',
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
          //   data: ['同时请求流数']
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
             name: '同时请求流数(个)',
             //interval: 1,
             axisLabel: {
               formatter: '{value} '
             }
          },
          series: [
            {
              name: '同时请求流数',
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
            text: '重构时机动态调整',
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
          //   data: ['重构时机']
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
            interval: 1,

            axisLabel: {
                 formatter: '延迟{value} s'
            }
          },
          series: [
            {
              name: '重构时机',
              type: 'scatter',
              data: []
            }
          ],
          animationDuration: 3000
        });
      }
    }
  }
</script>
