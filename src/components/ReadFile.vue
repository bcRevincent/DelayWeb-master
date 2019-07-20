<template>
  <div class="app-container">
    <div style="width: 100%;height: 2px;background-color: #ffffff;margin-top: 8px;margin-bottom: 0px"></div>

    <el-upload :show-file-list=false action="" drag :before-upload="acceptFile">
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>

    <!--图表-->
    <div style="display: flex;align-items: center;justify-content: center;">
      <div id="datacharts" :style="{width: '100%', height: '500px',marginTop:'50px'}"></div>
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
        rtts: []
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
        let index = 0;
        for (let d of data) {
          if (d != ' ') {
            this.rtts.push(Number(d));
            index = index + 1;
          }
        }

        this.initChart();
      },
      initChart() {
        let myChart = this.$echarts.init(document.getElementById('datacharts'))

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
          x.push("RTT:"+key);
          y.push({value: value, name: "RTT:"+key});
        }

        myChart.setOption({
          title: {
            text: '同一数据流中数据包RTT的分布情况',
            // subtext: '纯属虚构',
            x: 'center'
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
