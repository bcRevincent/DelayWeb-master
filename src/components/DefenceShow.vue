<template>
  <div class="app-container">
    <!--    <div style="width: 100%;height: 2px;background-color: #ffffff;margin-top: 8px;margin-bottom: 0px"></div>-->

    <div style="display: flex;align-items: center;justify-content: center;">
      <el-upload :show-file-list=false action="" drag :before-upload="acceptFile">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>

      <el-upload :show-file-list=false action="" drag :before-upload="acceptAfterFile">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
    </div>

    <!--图表-->
    <div>
      <div style="display: flex;align-items: center;justify-content: center;">
        <div id="datacharts" :style="{width: '1000px', height: '500px'}"></div>
        <div id="pieGraph" :style="{width: '500px', height: '300px'}"></div>
      </div>
      <div style="display: flex;align-items: center;justify-content: center;">
        <div id="datacharts_after" :style="{width: '1000px', height: '500px'}"></div>
        <div id="pieGraph_after" :style="{width: '500px', height: '300px'}"></div>
      </div>
    </div>
  </div>
</template>

<style>
</style>
<script>
  export default {
    name: 'DataAnalysis',
    data() {
      return {
        rtts: [],
        rtts_atfer:[]
      }
    },
    mounted: function () {

    },
    methods: {
      acceptFile(f) {
        //获取到文件名最后一个"."的位置
        let extStart = f.name.lastIndexOf(".");
        //通过未知 获取文件后缀名
        let filetype = f.name.substring(extStart, f.name.length).toUpperCase();
        //如果后缀名不是 excel文件 提示上传指定文件
        if (filetype != ".log" && filetype != ".LOG") {
          alert("请上传正确的文件格式(txt)");
          return;
        }
        //格式正确后 开始对文件进行操作
        this.handleFile(f);
      },
      handleFile(f) {
        if (window.FileReader) {
          //如果浏览器支持 创建fileReader
          var reader = new FileReader();
        } else {
          this.$message.error('你的浏览器不支持fileReader,请升级您的浏览器！');
        }
        reader.onload = (e) => {
          let data = e.target.result;
          this.getDate(data);
        };
        // reader.onload = function (e) {
        //   alert(e.target.result);
        // }
        reader.readAsText(f);
      },
      getDate(data) {
        while (this.rtts.length > 0) {
          this.rtts.pop();
        }

        let index = 0;
        for (let d of data) {
          if (d != ' ') {
            this.rtts.push(Number(d));
            index = index + 1;
          }
        }

        this.initChart();
        this.initPieGraph();
      },
      initChart() {
        let myChart = this.$echarts.init(document.getElementById('datacharts'))

        let data = [];

        let a = 1;
        for (let d of this.rtts) {
          data.push([a, d]);
          a = a + 1;
        }

        let myRegression = this.$ecStat.regression('polynomial', data, 6);

        myRegression.points.sort(function (a, b) {
          return a[0] - b[0];
        });

        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          title: {
            text: '同一数据流中各数据包RTT随数据包序号的分布情况',
            // subtext: 'By ecStat.regression',
            // sublink: 'https://github.com/ecomfe/echarts-stat',
            left: 'center',
            top: 16
          },
          xAxis: {
            type: 'value',
            interval: 1,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            splitNumber: 20
          },
          yAxis: {
            type: 'value',
            interval: 1,
            min: -1,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          grid: {
            top: 90
          },
          series: [{
            name: 'scatter',
            type: 'scatter',
            label: {
              emphasis: {
                show: true,
                position: 'right',
                textStyle: {
                  color: 'blue',
                  fontSize: 16
                }
              }
            },
            data: data
          }, {
            name: 'line',
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: myRegression.points,
            markPoint: {
              itemStyle: {
                normal: {
                  color: 'transparent'
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'left',
                  formatter: myRegression.expression,
                  textStyle: {
                    color: '#333',
                    fontSize: 14
                  }
                }
              },
              data: [{
                coord: myRegression.points[myRegression.points.length - 1]
              }]
            }
          }]
        });
      },
      initPieGraph() {
        let myChart = this.$echarts.init(document.getElementById('pieGraph'))

        const map = new Map();
        for (let d of this.rtts) {
          if (map.has(d)) {
            let newValue = map.get(d) + 1;
            map.delete(d);
            map.set(d, newValue);
          } else {
            map.set(d, 1);
          }
        }

        let x = [];
        let y = [];
        for (let [key, value] of map) {
          x.push("RTT:" + key);
          y.push({value: value, name: "RTT:" + key});
        }

        myChart.setOption({
          title: {
            // text: '同一数据流中数据包RTT的分布情况',
            // subtext: '纯属虚构',
            // x: 'center'
          },
          tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {c} ({d}%)"
            formatter: "{d}%"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: x
          },
          series: [
            {
              name: '占比',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: y,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      },

      acceptAfterFile(f) {
        //获取到文件名最后一个"."的位置
        let extStart = f.name.lastIndexOf(".");
        //通过未知 获取文件后缀名
        let filetype = f.name.substring(extStart, f.name.length).toUpperCase();
        //如果后缀名不是 excel文件 提示上传指定文件
        if (filetype != ".log" && filetype != ".LOG") {
          alert("请上传正确的文件格式(txt)");
          return;
        }
        //格式正确后 开始对文件进行操作
        this.handleAfterFile(f);
      },
      handleAfterFile(f) {
        if (window.FileReader) {
          //如果浏览器支持 创建fileReader
          var reader = new FileReader();
        } else {
          this.$message.error('你的浏览器不支持fileReader,请升级您的浏览器！');
        }
        reader.onload = (e) => {
          let data = e.target.result;
          this.getAfterDate(data);
        };
        // reader.onload = function (e) {
        //   alert(e.target.result);
        // }
        reader.readAsText(f);
      },
      getAfterDate(data) {
        while (this.rtts_atfer.length > 0) {
          this.rtts_atfer.pop();
        }

        let index = 0;
        for (let d of data) {
          if (d != ' ') {
            this.rtts_atfer.push(Number(d));
            index = index + 1;
          }
        }

        this.initAfterChart();
        this.initAfterPieGraph();
      },
      initAfterChart() {
        let myChart = this.$echarts.init(document.getElementById('datacharts_after'))

        let data = [];

        let a = 1;
        for (let d of this.rtts_atfer) {
          data.push([a, d]);
          a = a + 1;
        }

        let myRegression = this.$ecStat.regression('polynomial', data, 6);

        myRegression.points.sort(function (a, b) {
          return a[0] - b[0];
        });

        myChart.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'cross'
            }
          },
          title: {
            text: '同一数据流中各数据包RTT随数据包序号的分布情况',
            // subtext: 'By ecStat.regression',
            // sublink: 'https://github.com/ecomfe/echarts-stat',
            left: 'center',
            top: 16
          },
          xAxis: {
            type: 'value',
            interval: 1,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            },
            splitNumber: 20
          },
          yAxis: {
            type: 'value',
            interval: 1,
            min: -1,
            splitLine: {
              lineStyle: {
                type: 'dashed'
              }
            }
          },
          grid: {
            top: 90
          },
          series: [{
            name: 'scatter',
            type: 'scatter',
            label: {
              emphasis: {
                show: true,
                position: 'right',
                textStyle: {
                  color: 'blue',
                  fontSize: 16
                }
              }
            },
            data: data
          }, {
            name: 'line',
            type: 'line',
            smooth: true,
            showSymbol: false,
            data: myRegression.points,
            markPoint: {
              itemStyle: {
                normal: {
                  color: 'transparent'
                }
              },
              label: {
                normal: {
                  show: true,
                  position: 'left',
                  formatter: myRegression.expression,
                  textStyle: {
                    color: '#333',
                    fontSize: 14
                  }
                }
              },
              data: [{
                coord: myRegression.points[myRegression.points.length - 1]
              }]
            }
          }]
        });
      },
      initAfterPieGraph() {
        let myChart = this.$echarts.init(document.getElementById('pieGraph_after'))

        const map = new Map();
        for (let d of this.rtts_atfer) {
          if (map.has(d)) {
            let newValue = map.get(d) + 1;
            map.delete(d);
            map.set(d, newValue);
          } else {
            map.set(d, 1);
          }
        }

        let x = [];
        let y = [];
        for (let [key, value] of map) {
          x.push("RTT:" + key);
          y.push({value: value, name: "RTT:" + key});
        }

        myChart.setOption({
          title: {
            // text: '同一数据流中数据包RTT的分布情况',
            // subtext: '纯属虚构',
            // x: 'center'
          },
          tooltip: {
            trigger: 'item',
            // formatter: "{a} <br/>{b} : {c} ({d}%)"
            formatter: "{d}%"
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: x
          },
          series: [
            {
              name: '占比',
              type: 'pie',
              radius: '55%',
              center: ['50%', '60%'],
              data: y,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        });
      }
    }
  }
</script>
