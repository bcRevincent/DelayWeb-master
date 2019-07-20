<template>
  <div style="display: flex;height: 500px;width: 100%;align-items: center;justify-content: center;">
    <!--图表-->
    <div id="dsChart" :style="{width: '80%', height: '500px',marginLeft:'0px', marginTop:'150px'}"></div>
  </div>
</template>

<script>
  import ECharts from 'vue-echarts/components/ECharts.vue'
  import 'echarts/lib/chart/line'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/polar'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/title'
  import 'echarts/theme/dark'
  import 'echarts/lib/chart/bar'

  import {getRequest} from '../utils/api'

  export default {
    data() {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted: function () {
      let myChart = this.$echarts.init(document.getElementById('dsChart'))
      this.initCharts(myChart);

      setInterval(this.updateCharts, 3000, myChart)
    },
    methods: {
      updateCharts(myChart)
      {
        getRequest("./../static/historyIndex.json").then(resp => {
      // this.$http.get("./../static/historyIndex.json").then(resp => {
        if (resp.status == 200) {
          console.log(resp.data);
          myChart.setOption({        //加载数据图表
            xAxis: {
            data: resp.data["axis_x"]
          },
            series: [
              {
                data: resp.data["0"]
              },
              {
                data: resp.data["1"]
              },
              {
                data: resp.data["2"]
              },
              {
                data: resp.data["3"]
              }
            ]
          });
        } else {
          _this.$message({type: 'error', message: '数据加载失败!'});
        }
      });
      },
      initCharts(myChart) {
        myChart.setOption({
          title: {
            // 标题
            text: '业务历史威胁指数'
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
          color: ['#01B468', '#FF8040', '#4cabce', '#e5323e'],
          legend: {
            data: ['流氏流', '弹性流', 'UDP流', '其它业务流']
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
            max: 3000,
            //max: 5,
            // interval: 5,
            // axisLabel: {
            //   formatter: '{value} 次'
            // }
          },
          series: [
        {
            name: '流氏流',
            type: 'bar',
            barGap: 0,
            data: []
        },
        {
            name: '弹性流',
            type: 'bar',
            data: []
        },
        {
            name: 'UDP流',
            type: 'bar',
            data: []
        },
        {
            name: '其它业务流',
            type: 'bar',
            data: []
        }
    ],
          animationDuration: 1000
        }
        );
      }
    }
  }
</script>
