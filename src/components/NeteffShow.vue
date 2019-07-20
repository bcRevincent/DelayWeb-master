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
        eiffency : 0.0,
        historylistX :[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19],
        historylistY :[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
      }
    },
    mounted: function () {
      let _this = this;
      let myChart = _this.$echarts.init(document.getElementById('datacharts'))
      _this.initCharts(myChart);
      this.timer = setInterval(()=>{
        let url = 'http://localhost:4399/bench_war/getnetworkeff';
        getRequest(url).then(resp => {
        if (resp.status == 200) {
        for (let i = 18 ; i>=0 ; i--) {
          _this.historylistY[i + 1] = _this.historylistY[i];
          _this.historylistX[i+1] = _this.historylistX[i];
        }
        _this.eiffency = resp.data.eiffency;
        _this.historylistY[0] = _this.eiffency;
        let date = new Date();
        _this.historylistX[0] = date.getSeconds();
        myChart.setOption({
          xAxis: {
            data: _this.historylistX
          },
          series: [{
            name: '网络效率',
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
            min: 0.8,
            max: 1
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
