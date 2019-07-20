<template>
  <div style="display: flex;height: 500px;width: 100%;align-items: center;justify-content: center;">
    <!--图表-->
    <div id="dsChart" :style="{width: '80%', height: '500px',marginLeft:'0px', marginTop:'150px'}"></div>
  </div>
</template>

<style>
</style>
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
        pre_axis_x: ['5月1日', '5月2日', '5月3日', '5月4日', '5月5日',
            '5月6日', '5月7日', '5月8日', '5月9日', '5月10日'],
        pre_axis_y: [1,3,2,1,2,4,1,3,2,3],
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted: function () {
      let myChart = this.$echarts.init(document.getElementById('dsChart'))
      this.initCharts(myChart);

      setInterval(this.updateCharts, 3000, myChart)
      // this.updateCharts(myChart)
    },
    methods: {
      updateCharts(myChart)
      {
        getRequest("./../static/historyLevel.json").then(resp => {
      // this.$http.get("./../static/historyLevel.json").then(resp => {
        if (resp.status == 200) {
          console.log(resp.data);
          this.pre_axis_x = resp.data["axis_x"];
          this.pre_axis_y = resp.data["axis_y"];
          myChart.setOption({        //加载数据图表
            xAxis: {
            data: resp.data["axis_x"]
          },
            series: [
              {
                data: resp.data["axis_y"]
              }
            ]
          });
        } else {
          this.$message({type: 'error', message: '数据加载失败!'});
        }
      });
      },
      initCharts(myChart) {
        myChart.setOption({title: {
            // 标题
            text: '系统历史威胁等级'
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
          //   data: ['威胁等级']
          // },
          xAxis: {
            type: 'category',
            data: this.pre_axis_x,
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis : {
            min: 0,
            max: 5,
                    type : 'value',
                                axisLabel:{
                                    formatter: function (value) {
                                    var texts = [];
                                    if(value==1){
                                    texts.push('优');
                                    }
                                    else if (value==2) {
                                    texts.push('良');
                                    }
                                    else if (value==3) {
                                    texts.push('中');
                                    }
                                    else if(value==4){
                                    texts.push('差');
                                    }
                                    else  if(value==5){
                                    texts.push('危');
                                    }
                                    return texts;
                                    }
                                },
                            },
          series: [
            {
            name: '威胁等级',
            type: 'line',
            data: this.pre_axis_y,
            }
          ],
          animationDuration: 1000
        }
        );
      }
    }
  }
</script>
