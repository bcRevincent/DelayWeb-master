<template>
  <div class="app-container">
    <div id = whole>
      <div id = "title">安全等级</div>
      <div id="grad1" style="margin-top:50px;margin-left:25%;font-weight:bold">
        <div v-if="level==1">
          <div id ="cursor_1">&#9660</div>
        </div>
         <div v-else-if="level==2">
          <div id ="cursor_2">&#9660</div>
        </div>
         <div v-else-if="level==3">
          <div id ="cursor_3">&#9660</div>
        </div>
         <div v-else-if="level==4">
          <div id ="cursor_4">&#9660</div>
        </div>
         <div v-else="level==5">
          <div id ="cursor_5">&#9660</div>
        </div>
        <div id = "child1">危</div>
        <div id = "child2">差</div>
        <div id = "child3">中</div>
        <div id = "child4">良</div>
        <div id = "child5">优</div>
      </div>
      <div id = "showTime">
        此次威胁等级划分时间为： {{spendTime}} 秒
      </div>
    </div>
    <div style="display: flex;height: 500px;width: 100%;align-items: center;justify-content: center;">
    <!--图表-->
    <div id="dsChart" :style="{width: '80%', height: '450px',marginLeft:'0px', marginTop:'50px'}"></div>
  </div>
  </div>
</template>

<script>
  import {getRequest} from '../utils/api'
    export default {
      name: "whole",
      data(){
          return{
            level: 4,
            spendTime: 2.78,
          }
      },
      mounted: function () {
      let myChart = this.$echarts.init(document.getElementById('dsChart'));
      this.initCharts(myChart);
      this.updateCharts(myChart);
      setInterval(this.updateCharts, 3000, myChart);
      setInterval(this._alert, 5000)
    },
    methods: {
      _alert(){
        if(this.level <= 3){
          var _level = "";
          if(this.level == 1)
            _level = "危";
          if(this.level == 2)
            _level = "差";
          if(this.level == 3)
            _level = "中";
          if(this.level == 4)
            _level = "良";
          if(this.level == 5)
            _level = "优";
                  this.$message({type: 'alert', message: "当前系统威胁等级为： 【"+_level+"】，\n"+"请注意排查网络潜在隐患！"});
                  // var cookie = document.cookie.indexOf("alert_message");
                  // if(cookie == -1)
                  // {
                  //   this.$alert("当前威胁等级");
                  //   var exp = new Date();
                  //   exp.setTime(exp.getTime() + 10 * 1000);//过期时间
                  //   document.cookie = "alert_message = yes" + ";expires=" + exp.toGMTString();
                  // }
                  // if(cookie >= 0){
                  //   this.setCookie("alert_message", "", -1);
                  // }
                }
      },
      updateCharts(myChart)
      {
        let _this = this;
      getRequest("./../static/tempIndex.json").then(resp => {
      // this.$http.get("./../static/tempIndex.json").then(resp => {
        if (resp.status == 200) {
          console.log(resp.data);
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
          _this.$message({type: 'error', message: '数据加载失败!'});
        }
      });

      getRequest('./../static/tempLevel.json').then(response =>
            // this.$http.get('./../static/tempLevel.json').then(response =>
            {
                this.level = 6 - response.data['tempLevel'];
                this.spendTime = response.data['spendTime'];
                // this.$router.go(1);
            });
      },
      initCharts(myChart) {
        myChart.setOption({
          title: {
            // 标题
            text: '各业务当前威胁指数'
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
                type: ['bar', 'line']
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
            data: ['流氏流', '弹性流', 'UDP流', '其它业务流'],
            axisPointer: {
              type: 'shadow'
            }
          },
          yAxis: {
            type: 'value',
            // name: '受攻击次数',
            min: 0,
            //max: 3000,
            //max: 5,
            // interval: 5,
            // axisLabel: {
            //   formatter: '{value} 次'
            // }
          },
          series: [
            {
            name: '业务威胁指数',
            type: 'bar',
            data: [],
            }
          ],
          animationDuration: 1000
        }
        );
      }
    }
    }
</script>

<style type="text/css">
  .div_style{
    /*确保两个div能并列*/
    width:50%;
    /*height:300px;*/
    float:left;
  }
  #title{
    margin-top:30px;
    font-size:30px;
    /*font-family:STKaiti;*/
  }
  #grad1 {
    border-radius:30px;
    height: 70px;
    display: flex;width: 50%;align-items: center;justify-content: center;
    background: -webkit-linear-gradient(left, red, orange, yellow, #0066CC, #02DF82); /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(left, red, orange, yellow, #0066CC, #02DF82); /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(left, red, orange, yellow, #0066CC, #02DF82); /* Firefox 3.6 - 15 */
    background: linear-gradient(to right, red, orange, yellow, #0066CC, #02DF82); /* 标准的语法（必须放在最后） */
}
  #grad1 #cursor_1{
    margin-left:3.2%;
    margin-top:-43px;
    /*height:30px;*/
    font-size:25px;
    /*font-family:STKaiti;*/
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }
  #grad1 #cursor_2{
    margin-left:11.2%;
    margin-top:-43px;
    height:80px;
    font-size:25px;
    /*font-family:STKaiti;*/
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }
  #grad1 #cursor_3{
    margin-left:19.2%;
    margin-top:-43px;
    height:80px;
    font-size:25px;
    /*font-family:STKaiti;*/
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }
  #grad1 #cursor_4{
    margin-left:27.2%;
    margin-top:-43px;
    height:80px;
    font-size:25px;
    /*font-family:STKaiti;*/
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }
  #grad1 #cursor_5{
    margin-left:35.2%;
    margin-top:-43px;
    height:80px;
    font-size:25px;
    /*font-family:STKaiti;*/
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }

  #grad1 #child1{
    width:20%;
    height:30px;
    font-size:30px;
    /*font-family:STKaiti;*/
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #grad1 #child2{
    width:20%;
    height:30px;
    /*font-family:STKaiti;*/
    font-size:30px;
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #grad1 #child3{
    width:20%;
    /*font-family:STKaiti;*/
    height:30px;
    font-size:30px;
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #grad1 #child4{
    width:20%;
    /*font-family:STKaiti;*/
    height:30px;
    font-size:30px;
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #grad1 #child5{
    width:20%;
    height:30px;
    font-family:STKaiti;
    font-size:30px;
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #showTime{
    margin-top:50px;
    font-size:20px;
    /*font-family:STKaiti;*/
  }
</style>
