<template>
  <div class="app-container">
    <div style="width: 100%;height: 2px;background-color: #ffffff;margin-top: 8px;margin-bottom: 0px"></div>
    <el-container>
      <el-main :width="300">
        <p> 选择的子网{{this.$route.params.device_list}}</p>
        <el-tree :data="data"
                 node-key="label"
                 props="defaultProps"
                 ref="tree"
                 @node-click="handleNodeClick">
        </el-tree>
        <el-button type="primary" icon="el-icon-check" size="mini" style="margin-left: 6px" @click="getHostData">确认选择
        </el-button>
      </el-main>
      <el-main>
        <p>设备指标</p>
        <el-table
          :data="tableData"
          width="540"
          style="width: 100%">
          <el-table-column
            prop="name"
            label="名称"
            width="180">
          </el-table-column>
          <el-table-column
            prop="data"
            label="数值"
            width="180">
          </el-table-column>
          <el-table-column
            prop="time"
            label="采集时间"
            width="180">
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </div>
</template>

<style>

</style>

<script>
  import {PostRequest} from '../utils/api'
  export default {
    name: 'multi_partical' ,
    data () {
      return {
        data: [
         {
          label: 'subnet',
          info: 'top subnet',
          children: [
            {
            label: 'openflow:1',
            info: 'switch1',
            children: [{
              label: 'openflow1:1',
              children: [{
                label: 'host:00:00:00:00:00:01',
                children: [{
                  label: 'port:80',
                  children: []
                },
                {
                  label: 'port:21'
                }]
              }]
            }]
          },
            {
            label: 'openflow:2',
            children: [{
              label: 'openflow:2:1'
            },
              {
              label: 'openflow:2:2'
            },
              {
              label: 'openflow:2:3'
            }]
          }]
        }],
        tableData: [{
          time: '2016-05-04',
          name: '发送字节数（byte/s）',
          data: '162'
        }, {
          time: '2016-05-04',
          name: '接收字节数(byte/s)',
          data: '146'
        }, {
          time: '2016-05-04',
          name: '发送数据包数目(n/s)',
          data: '146'
        }, {
          time: '2016-05-04',
          name: '接收数据包数目(n/s)',
          data: '146'
        }, {
          time: '2016-05-01',
          name: '平均数据包大小(byte)',
          data: '60.2'
        }] ,
        defaultProps: {
          children: 'children',
          label: 'label'
        }
      }
    },
    mounted: function () {
      this.updateSubnet()
    },
    methods: {
      setTable(data_set){
        this.tableData = [{
          time: '2016-05-04',
          name: '发送字节数（byte/s）',
          data: data_set['tx_byte']
        }, {
          time: '2016-05-04',
          name: '接收字节数(byte/s)',
          data: data_set['rx_byte']
        }, {
          time: '2016-05-04',
          name: '发送数据包数目(n/s)',
          data: data_set['tx_packet']
        }, {
          time: '2016-05-04',
          name: '接收数据包数目(n/s)',
          data: data_set['rx_packet']
        }, {
          time: '2016-05-01',
          name: '发送平均数据包大小(byte)',
          data: data_set['tx_packet_arv']
        }, {
          time: '2016-05-01',
          name: '接收平均数据包大小(byte)',
          data: data_set['rx_packet_arv']
        }]
      },
      updateSubnet(){
        let _this = this;
        let device_list = [];
        console.log(this.$route.params.device_list);
        for(let i=0; i<this.$route.params.device_list.length; i++){
            let device_info = this.$route.params.device_list[i];
            device_list.push({
              'name': device_info.name,
              'type': device_info.type,
              'info': device_info.info
            })
        }
        let device_list_string = JSON.stringify(device_list);
        console.log(typeof (device_list_string));
        console.log(device_list_string);
        let data = {"datatype": "get_subnet_structure", "content": device_list_string};
        PostRequest("127.0.0.1:8000", data).then(resp => {
          if (resp.status == 200) {
            this.data = resp.data;
            console.log(this.data)
            this.setTable(resp.data)
            // this.refreshCharts(TimeCharts, this.collect_time_history, this.time_cost_history)
            _this.$message({type: 'done', message: '数据加载成功!'});
          }else {
            _this.$message({type: 'error', message: '数据加载失败!'});
            console.log(resp.status);
          }
        }, resp => {
          _this.$message({type: 'error', message: '数据加载失败!'});
          console.log(resp.status);
        });
      },
      getSubnetData(){
        let _this = this;
        let device_list = [];
        console.log(this.$route.params.device_list);
        for(let i=0; i<this.$route.params.device_list.length; i++){
          let device_info = this.$route.params.device_list[i];
          device_list.push({
            'name': device_info.name,
            'type': device_info.type,
            'info': device_info.info
          })
        }
        let device_list_string = JSON.stringify(device_list);
        console.log(device_list_string);
        let data = {"datatype": "get_subnet_data", "content": device_list_string};
        PostRequest("127.0.0.1:8000", data).then(resp => {
          if (resp.status == 200) {
            console.log(resp.data);
            let data_set = resp.data
            this.setTable(data_set)
            // this.refreshCharts(TimeCharts, this.collect_time_history, this.time_cost_history)
            _this.$message({type: 'done', message: '数据加载成功!'});
          }else {
            _this.$message({type: 'error', message: '数据加载失败!'});
            console.log(resp.status);
          }
        }, resp => {
          _this.$message({type: 'error', message: '数据加载失败!'});
          console.log(resp.status);
        });
      },
      getSwitchData(switch_name){
        let _this = this;
        //let switch_name = "openflow:1";

        console.log('get data of ' + switch_name);
        let data = {"datatype": "get_switch_data", "content": switch_name};
        PostRequest("127.0.0.1:8000", data).then(resp => {
          if (resp.status == 200) {
            console.log(resp.data);
            this.setTable(resp.data)
            // this.refreshCharts(TimeCharts, this.collect_time_history, this.time_cost_history)
            _this.$message({type: 'done', message: '数据加载成功!'});
          }else {
            _this.$message({type: 'error', message: '数据加载失败!'});
            console.log(resp.status);
          }
        }, resp => {
          _this.$message({type: 'error', message: '数据加载失败!'});
          console.log(resp.status);
        });

      },
      getPortData(port_name){
        let _this = this;
        console.log('get data of ' + port_name);
        let data = {"datatype": "get_port_data", "content": port_name};
        PostRequest("127.0.0.1:8000", data).then(resp => {
          if (resp.status == 200) {
            console.log(resp.data);
            this.setTable(resp.data);
            // this.refreshCharts(TimeCharts, this.collect_time_history, this.time_cost_history)
            _this.$message({type: 'done', message: '数据加载成功!'});
          }else {
            _this.$message({type: 'error', message: '数据加载失败!'});
            console.log(resp.status);
          }
        }, resp => {
          _this.$message({type: 'error', message: '数据加载失败!'});
          console.log(resp.status);
        });

      },
      getHostData(host_name){
        let _this = this;
        //let host_name = "host:00:00:00:00:00:01";

        console.log('get data of ' + host_name);
        let data = {"datatype": "get_host_data", "content": host_name};
        PostRequest("127.0.0.1:8000", data).then(resp => {
          if (resp.status == 200) {
            console.log(resp.data);
            this.setTable(resp.data[0]);
            // this.refreshCharts(TimeCharts, this.collect_time_history, this.time_cost_history)
            _this.$message({type: 'done', message: '数据加载成功!'});
          }else {
            _this.$message({type: 'error', message: '数据加载失败!'});
            console.log(resp.status);
          }
        }, resp => {
          _this.$message({type: 'error', message: '数据加载失败!'});
          console.log(resp.status);
        });

      },
      getHostPortData(host_ip, port){
        let _this = this;
        port_data = {'ip': host_ip, 'port': port};
        let port_data = JSON.stringify(port_data);
        console.log(port_data);
        let data = {"datatype": "get_host_port_data", "content": port_data};
        PostRequest("127.0.0.1:8000", data).then(resp => {
          if (resp.status == 200) {
            console.log(resp.data);
            let data_set = resp.data;
            this.setTable(data_set);
            // this.refreshCharts(TimeCharts, this.collect_time_history, this.time_cost_history)
            _this.$message({type: 'done', message: '数据加载成功!'});
          }else {
            _this.$message({type: 'error', message: '数据加载失败!'});
            console.log(resp.status);
          }
        }, resp => {
          _this.$message({type: 'error', message: '数据加载失败!'});
          console.log(resp.status);
        });
      },
      handleNodeClick(data, node) {
        console.log(node.label);
        let device_name = node.label;
        let device_type = node.data.type;
        if (device_type == 'subnet'){
          this.getSubnetData()
        }
        else if (device_type == 'switch'){
          this.getSwitchData(device_name)
        }
        else if (device_type == 'port'){
          this.getPortData(device_name)
        }
        else if (device_type == 'host'){
          this.getHostData(device_name)
        }
        else if (device_type == 'host_port'){
          let host_port = device_name.substr(6);
          let host_ip = node.data.host_ip;
          console.log(host_ip);
          console.log(host_port);
          this.getHostPortData(host_ip, host_port)
        }


      },
      deviceCheck(){
        console.log(this.$refs.tree.getCheckedKeys());
      }
    }
  }
</script>
