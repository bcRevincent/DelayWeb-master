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
    name: 'NeteffShow',
    data() {
      return {
        timer: '',
        remain : 0.0,
        historylistX :[0,1,2,3,4],
        historylistY :[0,0,0,0,0]
      }
    },
    mounted: function () {
      let _this = this;
      let myChart = _this.$echarts.init(document.getElementById('datacharts'))
      _this.initCharts(myChart);
      this.timer = setInterval(()=>{
          let url = 'http://localhost:4399/bench_war/getipv4remain';
          getRequest(url).then(resp => {
            if (resp.status == 200) {
              for (let i = 3 ; i>=0 ; i--)_this.historylistY[i+1] = _this.historylistY[i];
              _this.remain = resp.data.remain;
              _this.historylistY[0] = _this.remain;
              myChart.setOption({
                xAxis: {
                  data: _this.historylistX
                },
                series: [{
                  name: 'IPv4',
                  data: _this.historylistY
                }]
              });
            }else {
              _this.$message({type: 'error', message: '数据加载失败!'});
            }
          });
        }
        ,2000);
    },
    methods: {
      initCharts(myChart) {
        myChart.setOption({
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
            min: 0,
            max: 1
            // interval: 5,
            // axisLabel: {
            //   formatter: '{value} 次'
            // }
          },
          series: [
            {
              name: '网络效率',
              type: 'line',
              data: []
            }
          ],
          animationDuration: 1000
        });
      }
    },
    beforeDestroy() {
      clearInterval(this.timer);
    }
  }
</script>
