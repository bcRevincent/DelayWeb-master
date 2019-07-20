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
  </div>
</template>

<script>
    import {getRequest} from '../utils/api'
    export default {
      name: "whole",
      data(){
          return{
            level: 3,
            spendTime: 1.5
          }
      },
      created() {
            getRequest('./../static/tempLevel.json').then(response =>
            {
                this.level = 6 - response.data['tempLevel'];
                this.spendTime = response.data['spendTime'];
                // this.$router.go(1);
            });
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
    margin-top:150px;
    font-size:30px;
    font-family:STKaiti;
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
    margin-top:-40px;
    /*height:30px;*/
    font-size:25px;
    font-family:STKaiti;
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }
  #grad1 #cursor_2{
    margin-left:11.2%;
    margin-top:-40px;
    height:80px;
    font-size:25px;
    font-family:STKaiti;
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }
  #grad1 #cursor_3{
    margin-left:19.2%;
    margin-top:-40px;
    height:80px;
    font-size:25px;
    font-family:STKaiti;
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }
  #grad1 #cursor_4{
    margin-left:27.2%;
    margin-top:-40px;
    height:80px;
    font-size:25px;
    font-family:STKaiti;
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }
  #grad1 #cursor_5{
    margin-left:35.2%;
    margin-top:-40px;
    height:80px;
    font-size:25px;
    font-family:STKaiti;
    color:#FF0000;
    position:absolute;
    text-align:center;
    z-index:10;
  }

  #grad1 #child1{
    width:20%;
    height:20px;
    font-size:30px;
    font-family:STKaiti;
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #grad1 #child2{
    width:20%;
    height:20px;
    font-family:STKaiti;
    font-size:30px;
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #grad1 #child3{
    width:20%;
    font-family:STKaiti;
    height:20px;
    font-size:30px;
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #grad1 #child4{
    width:20%;
    font-family:STKaiti;
    height:20px;
    font-size:30px;
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #grad1 #child5{
    width:20%;
    height:20px;
    font-family:STKaiti;
    font-size:30px;
    color:black;
    text-align:center;
    float:left;
    z-index:1;
  }
  #showTime{
    margin-top:150px;
    font-size:30px;
    font-family:STKaiti;
  }
</style>
