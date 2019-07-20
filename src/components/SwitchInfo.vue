<template>
  <div class="app-container">
    <div style="width: 100%;height: 2px;background-color: #ffffff;margin-top: 8px;margin-bottom: 0px"></div>

    <div style="display: flex;justify-content: flex-start">
      <el-input
        placeholder="查询历史记录"
        prefix-icon="el-icon-search"
        v-model="keywords" style="width: 400px" size="mini">
      </el-input>
      <el-button type="primary" icon="el-icon-search" size="mini" style="margin-left: 3px" @click="searchClick">搜索
      </el-button>
      <el-button type="primary" icon="el-icon-download" size="mini" style="margin-left: 6px" @click="reLoading">加载最新数据
      </el-button>
    </div>

    <div style="width: 100%;height: 1px;background-color: #ffffff;margin-top: 8px;margin-bottom: 0px"></div>

    <el-table :data="articles" v-loading="loading" element-loading-text="拼命加载中" border fit
              highlight-current-row
              ref="multipleTable"
              tooltip-effect="dark"
              style="width: 100%;overflow-x: hidden; overflow-y: hidden;">

      <el-table-column align="center" label="序号" width="60">
        <template slot-scope="scope">
          <span v-text="getIndex(scope.$index)"> </span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="switchname" label="交换机名称" width="150"></el-table-column>
      <el-table-column align="center" prop="throughout" label="吞吐量" width="150"></el-table-column>
      <el-table-column align="center" prop="rx_packet" label="流入包" width="150"></el-table-column>
      <el-table-column align="center" prop="rx_byte" label="流入比特" width="150"></el-table-column>
      <el-table-column align="center" prop="tx_packet" label="流出包" width="150"></el-table-column>
      <el-table-column align="center" prop="tx_byte" label="流出比特" width="150"></el-table-column>
      <el-table-column align="center" prop="throughoutspeed" label="throughoutspeed" width="150"></el-table-column>
      <el-table-column align="center" prop="rx_packet_speed" label="rx_packet_speed" width="150"></el-table-column>
      <el-table-column align="center" prop="rx_byte_speed" label="rx_byte_speed" width="150"></el-table-column>
      <el-table-column align="center" prop="tx_packet_speed" label=tx_packet_speed width="150"></el-table-column>
      <el-table-column align="center" prop="tx_byte_speed" label="tx_byte_speed" width="150"></el-table-column>

    </el-table>
  </div>
</template>
<script>
  import {putRequest} from '../utils/api'
  import {getRequest} from '../utils/api'

  export default{
    data() {
      return {
        articles: [],
        loading: false,
        currentPage: 1,
        pageSize: 5,
        totalCount: -1,
        keywords: ''
      }
    },
    mounted: function () {
      var _this = this;
      this.loading = true;
      this.loadBlogs(1, this.pageSize);
      var _this = this;
      window.bus.$on('blogTableReload', function () {
        _this.loading = true;
        _this.loadBlogs(_this.currentPage, _this.pageSize);
      })
    },
    methods: {
      searchClick(){
        this.loadBlogs(1, this.pageSize);
      },
      reLoading(){
        // 刷新
        this.loading = true;
        this.currentPage = 1;
        this.loadBlogs(this.currentPage, this.pageSize);
      },
      getIndex($index) {
        //表格序号
        return (this.currentPage - 1) * this.pageSize + $index + 1
      },
      //翻页
      handlePageChange(currentPage){
        this.currentPage = currentPage;
        this.loading = true;
        this.loadBlogs(this.currentPage, this.pageSize);
      },
      handleSizeChange(val) {
        //改变每页数量
        this.pageSize = val
        this.currentPage = 1
        this.loadBlogs(this.currentPage,this.pageSize)
      },
      loadBlogs(page, count){
        var _this = this;
        var url = 'http://localhost:4399/bench_war/getswitchinfo';

        getRequest(url).then(resp=> {
          _this.loading = false;
          if (resp.status == 200) {
            _this.articles = resp.data.articles;
            _this.totalCount = resp.data.totalCount;
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }, resp=> {
          _this.loading = false;
          if (resp.response.status == 403) {
            _this.$message({type: 'error', message: resp.response.data});
          } else {
            _this.$message({type: 'error', message: '数据加载失败!'});
          }
        }).catch(resp=> {
          //压根没见到服务器
          _this.loading = false;
          _this.$message({type: 'error', message: '数据加载失败!'});
        })
      }
    },
    props: ['state', 'showEdit', 'showDelete', 'activeName']
  }
</script>
<style type="text/css">
  .blog_table_footer {
    display: flex;
    box-sizing: content-box;
    padding-top: 10px;
    padding-bottom: 0px;
    margin-bottom: 0px;
    justify-content: space-between;
  }
</style>
