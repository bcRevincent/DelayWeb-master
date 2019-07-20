<template>
  <div style="display: flex;align-items: center;justify-content: center;">
    <!--图表-->
    <div id="datacharts" :style="{width: '100%', height: '500px',marginTop:'50px'}"></div>
  </div>
</template>

<style>
</style>
<script>
  import {getRequest} from '../utils/api'

  export default {
    name: 'DataCharts',
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted: function () {
      let myChart = this.$echarts.init(document.getElementById('datacharts'))
      this.initCharts(myChart);

      var _this = this;
      getRequest("/attackInfo/dataStatistics").then(resp => {
      // getRequest("/attackInfo/dataStatistics").then(resp => {
        if (resp.status == 200) {
          myChart.setOption({
            xAxis: {
              data: resp.data.categories
            },
            series: [{
              // 根据名字对应到相应的系列
              name: '每小时受攻击次数',
              data: resp.data.ds
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
            text: '最近12小时的攻击历史'
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
          legend: {
            data: ['每小时受攻击次数']
          },
          xAxis: {
            type: 'category',
            data: [],
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis: {
            type: 'value',
            // name: '受攻击次数',
            // min: 0,
            // max: 250,
            // interval: 5,
            // axisLabel: {
            //   formatter: '{value} 次'
            // }
          },
          series: [
            {
              name: '每小时受攻击次数',
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
