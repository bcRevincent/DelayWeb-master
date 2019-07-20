<template>
  <div class="app-container">
    <div style="width: 100%;height: 2px;background-color: #ffffff;margin-top: 8px;margin-bottom: 0px"></div>
    <div style="display: flex;justify-content: flex-start">

      <el-container direction="vertical">
        <h1>基本信息</h1>
        <el-table
          :data="tableData"
          width="440"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="data"
            label="内容"
            width="80">
          </el-table-column>
          <el-table-column
            prop="time"
            label="数据更新时间"
            width="180">
          </el-table-column>
        </el-table>
      </el-container>
      <el-main>
        <el-container direction="vertical">
          <div id="memorychart" :style="{width: '600px', height: '300px',marginTop:'15px'}"></div>
          <div id="timechart" :style="{width: '600px', height: '300px',marginTop:'15px'}"></div>
        </el-container>
      </el-main>
      <!--      <el-button type="primary" icon="el-icon-check" size="mini" style="margin-left: 6px" @click="select_confirm">发送-->
      <!--      </el-button>-->
    </div>
  </div>
</template>

<style>
</style>


<script>
  import {PostRequest} from '../utils/api'
  export default {
    name: 'basic_data',
    data() {
      return {
        time_cost : '',
        before_compress: '',
        after_compress: '',
        compress_rate: '',
        memory_cost: '',
        collect_time: '',
        memory_history: [],
        time_cost_history: [],
        collect_time_history: [],
        tableData: [
          {
            time: '2016-05-07：10:34:05',
            name: '数据库使用大小（Byte）',
            data: this.memory_cost
          }, {
            time: '2016-05-07：10:34:05',
            name: '压缩前字段大小（Byte）',
            data: this.before_compress
          }, {
            time: '2016-05-07：10:34:05',
            name: '压缩后字段大小（Byte）',
            data: this.after_compress
          }, {
            time: '2016-05-07：10:34:05',
            name: '字段压缩比率（%）',
            data: this.compress_rate
          }, {
            time: '2016-05-07：10:34:05',
            name: '数据采集分析时间（s）',
            data: this.time_cost
          }],
        x : [],
        data: []
      }
    },
    mounted: function () {
      let MemoryChart = this.$echarts.init(document.getElementById('memorychart'));
      let TimeChart = this.$echarts.init(document.getElementById('timechart'));
      this.initMemoryCharts(MemoryChart);
      this.initTimeCharts(TimeChart);



      let x =[2,3,4,5]
      let data = [12,51,90,19]
      //this.refreshCharts(MemoryChart,x,data)
      setInterval(this.data_update, 3000, MemoryChart, TimeChart)
    },
    methods:{
      initMemoryCharts(MemoryChart) {
        MemoryChart.setOption({
          title: {
            // 标题
            text: '数据库使用情况'
          },
          toolbox: {
            show: false,
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
            data: ['存储大小']
          },
          xAxis: {
            type: 'category',
            data: ["10:33:44","10:33:47","10:33:50","10:33:53","10:33:56","10:33:59","10:34:02","10:34:05"],
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
              name: '存储空间使用',
              type: 'line',
              data: [5489,5495,5512,5501,5516,5529,5557,5534]
            }
          ],
          animationDuration: 3000
        });
      },
      initTimeCharts(TimeChart) {
        TimeChart.setOption({
          title: {
            // 标题
            text: '数据采集分析时间'
          },
          toolbox: {
            show: false,
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
            data: ['采集时间']
          },
          xAxis: {
            type: 'category',
            data: ["10:33:44","10:33:47","10:33:50","10:33:53","10:33:56","10:33:59","10:34:02","10:34:05"],
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
              name: '采集时间',
              type: 'line',
              data: [0.17,0.26,0.31,0.24,0.29,0.18,0.21,0.26]
            }
          ],
          animationDuration: 3000
        });
      },
      refreshCharts(chart, x, data){
        chart.setOption({
          xAxis:{
            data: x
          },
          series: [
            {
              data: data
            }
          ]
        });
        // console.log("refresh success")
      },
      updateCharts(chart, x, data){
        let new_x = Math.random() * 10 ;
        let new_data = Math.random() * 50 + 50 ;
        if (x.length > 4) {
          x.shift() ;
          data.shift();
        }
        x.push(new_x);
        data.push(new_data);
        this.refreshCharts(chart, x, data)
        console.log("cal")
      },
      data_update (MemoryCharts, TimeCharts){
        console.log ("send a request");
        let _this = this;
        let data = {"datatype": "basic_data", "content":"{}"};
        PostRequest("127.0.0.1:8080", data).then(resp => {
          if (resp.status == 200) {
            // _this.$message({type: 'done', message: '数据加载成功!'});
            this.time_cost = resp.data.time_cost;
            this.before_compress = resp.data.before_compress;
            this.after_compress = resp.data.after_compress;
            this.compress_rate = resp.data.compress_rate;
            this.collect_time = resp.data.collect_time;
            this.memory_cost = resp.data.storage_consume;
            if (this.time_cost_history.length > 7){
              this.time_cost_history.shift();
            }
            this.time_cost_history.push(this.time_cost);
            if (this.collect_time_history.length > 7){
              this.collect_time_history.shift();
            }
            this.collect_time_history.push(this.collect_time);
            if (this.memory_history.length > 7){
              this.memory_history.shift();
            }
            this.memory_history.push(this.memory_cost);

            this.tableData = [
              {
                time: this.collect_time,
                name: '数据库使用大小（Byte）',
                data: this.memory_cost
              }, {
                time: this.collect_time,
                name: '压缩前字段大小（Byte）',
                data: 6328
              }, {
                time: this.collect_time,
                name: '压缩后字段大小（Byte）',
                data: 2956
              }, {
                time: this.collect_time,
                name: '字段压缩比率（%）',
                data: 46.7
              }, {
                time: this.collect_time,
                name: '数据采集分析时间（s）',
                data: this.time_cost
              }]
            this.refreshCharts(TimeCharts, this.collect_time_history, this.time_cost_history)
            this.refreshCharts(MemoryCharts, this.collect_time_history, this.memory_history)
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
            console.log(resp.status)
          }
        }, resp => {
          _this.$message({type: 'error', message: '数据加载失败!'});
          console.log(resp.status)
        });
      },
      show(){
        console.log("123")
      }
    }
  }
</script>
