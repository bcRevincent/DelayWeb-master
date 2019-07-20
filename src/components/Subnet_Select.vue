<template>
  <div class="app-container">
    <div style="width: 100%;height: 2px;background-color: #ffffff;margin-top: 8px;margin-bottom: 0px"></div>
    <div style="display: flex;justify-content: flex-start">
      <el-input
        placeholder="输入设备名称"
        prefix-icon="el-icon-search"
        v-model="device" style="width: 400px" size="mini">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 3px" @click="searchClick">搜索
      </el-button>
      <el-button type="success" icon="el-icon-check" size="mini" style="margin-left: 6px" @click="select_one">确定
      </el-button>
    </div>
    <!--设备列表-->
    <el-table
      :data="device_found"
      highlight-current-row
      @current-change="Chosedevice"
      height="200"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="种类"
        width="180">
      </el-table-column>
      <el-table-column
        prop="info"
        label="地址">
      </el-table-column>
    </el-table>
<!--    <p>device {{this.currentRow}} is chosen</p>-->
    <el-button type="primary" icon="el-icon-check" size="mini" style="margin-left: 6px" marginTop="5px" @click="remove_selected">清除所选
    </el-button>
    <el-table
      :data="device_chosen"
      highlight-current-row
      height= "250"
      style="width: 100%">
      <el-table-column
        prop="name"
        label="名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="type"
        label="种类"
        width="180">
      </el-table-column>
      <el-table-column
        prop="info"
        label="地址">
      </el-table-column>
    </el-table>
    <el-button type="primary" icon="el-icon-check" size="mini" style="margin-left: 6px" @click="select_confirm">确认选择
    </el-button>
  </div>
</template>

<style>
</style>

<script>
import {PostRequest} from '../utils/api'
export default {
  name: 'subnet_select',
  data() {
    return {
      currentRow : '',
      device: '',
      device_found: [
      // , {
      //   name: 'host1',
      //   type: 'host',
      //   address: '10.0.0.1'
      // }, {
      //   name: 'host2',
      //   type: 'host',
      //   address: '10.0.0.2'
      // }
      ],
      device_chosen: [
        // {
        //   name: 'openflow:1',
        //   type: 'switch',
        //   info: ''
        // }, {
        //   name: 'openflow:2',
        //   type: 'switch',
        //   info: ''
        // }
        // , {
        //   name: 'host1',
        //   type: 'host',
        //   info: '10.0.0.1'
        // }
      ]
    }
  },
  methods: {
    searchClick(){
      console.log(this.device);
      let _this = this;
      let data = {"datatype": "search_devices", "content": this.device};
      PostRequest("127.0.0.1:8000", data).then(resp => {
        if (resp.status == 200) {
          for(let i=0; i<resp.data.length; i++) {
            // let name = resp.data[i].name;
            // let type = resp.data[i].type;
            // let info = resp.data[i].info;
            // console.log([name, type, info]);
            this.device_found = resp.data
          }
          // this.refreshCharts(TimeCharts, this.collect_time_history, this.time_cost_history)
          _this.$message({type: 'done', message: '数据加载成功!'});
        } else {
          _this.$message({type: 'error', message: '数据加载失败!'});
          console.log(resp.status)
        }
      }, resp => {
        _this.$message({type: 'error', message: '数据加载失败!'});
        console.log(resp.status)
      });
    },
    Chosedevice(val) {
      this.currentRow = val;
    },
    remove_selected() {
      this.device_chosen = [];
    },
    select_one() {
      if (this.device_chosen.indexOf(this.currentRow) == -1){
        this.device_chosen.push(this.currentRow)
      }
    },
    select_confirm(){
      this.$router.push({
        name: '不同粒度数据',
        path: '/multi-granularity',
        params: {
          device_list : this.device_chosen
        }
      })
    }
  }
}
</script>
