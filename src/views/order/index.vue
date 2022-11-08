<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 支付状态 -->
    <div class="article-status-menu">
      <span style="font-weight: bold;color: red">状态:</span>
      <span @click="changeStatus('all')" :class="isActive('all')">全部</span>
      <span @click="changeStatus('paying')" :class="isActive('paying')">
        未支付
      </span>
      <span @click="changeStatus('payed')" :class="isActive('payed')">
        已支付
      </span>
    </div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
        v-if="isDelete == 0"
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="orderIdList.length == 0"
        @click="updateIsDelete = true"
      >
        批量删除
      </el-button>
      <el-button
        v-else
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="orderIdList.length === 0"
        @click="remove = true"
      >
        批量删除
      </el-button>
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <!-- 商品查询 -->
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入商品名"
          style="width:200px"
          @keyup.enter.native="searchOrder"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="searchOrder"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
      border
      :data="orderBackList"
      @selection-change="selectionChange"
      v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <!-- 商品名 -->
      <el-table-column prop="articleTitle" label="商品名" align="center" />
      <!-- 订单号 -->
      <el-table-column prop="orderNo" label="订单号" align="center" />
      <!-- 商品价格 -->
      <el-table-column
        prop="totalFee"
        label="商品价格(￥)"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.totalFee">
            {{ scope.row.totalFee }}
          </span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <!-- 交易状态/方式 -->
      <el-table-column
        prop="payType"
        label="交易状态"
        width="120"
        align="center"
      >
        <template slot-scope="scope">
          <span v-if="scope.row.payType === 1">
            <el-button type="success">微信</el-button>
          </span>

          <span v-else-if="scope.row.payType === 2">
           <el-button type="primary">支付宝</el-button>
          </span>

          <span v-else>
            <el-button type="danger" disabled>未支付</el-button>
          </span>
        </template>
      </el-table-column>
      <!-- 用户 -->
      <el-table-column prop="userName" label="用户" width="170" align="center"/>
      <!-- 流水号 -->
      <el-table-column prop="transactionId" label="流水号" width="120" align="center"/>
      <!-- 交易时间 -->
      <el-table-column
        prop="createTime"
        label="交易时间"
        width="130"
        align="center"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="150">
        <template slot-scope="scope">
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left:10px"
            @onConfirm="updateOrderDelete(scope.row.id)"
          >
            <el-button size="mini" type="danger" slot="reference">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination-container"
      background
      @size-change="sizeChange"
      @current-change="currentChange"
      :current-page="current"
      :page-size="size"
      :total="count"
      :page-sizes="[10,30,50,100]"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 批量逻辑删除对话框 -->
    <el-dialog :visible.sync="updateIsDelete" width="30%" :close-on-click-modal="false">
      <div class="dialog-title-container" slot="title">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="updateIsDelete = false">取 消</el-button>
        <el-button type="primary" @click="updateOrderDelete(null)">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>

  export default {
    created() {
      this.orderList();
    },
    data: function() {
      return {
        loading: true,
        updateIsDelete: false,
        remove: false,
        activeStatus: "all",
        orderBackList: [],
        orderIdList: [],
        keywords: null,
        type: null,
        isDelete: 0,
        status: null,
        current: 1,
        size: 10,
        count: 0
      };
    },
    methods: {
      selectionChange(articleList) {
        this.orderIdList = [];
        articleList.forEach(item => {
          this.orderIdList.push(item.id);
        });
      },
      searchOrder() {
        this.current = 1;
        this.orderList();
      },
      updateOrderDelete(id) {
        let param = {};
        if (id != null) {
          param.idList = [id];
        } else {
          param.idList = this.orderIdList;
        }
        param.isDelete = this.isDelete === 0 ? 1 : 0;
        console.log("param", param)
        this.axios.post("/order/core/deleteBackOrder", param).then(({ data }) => {
          console.log("data", data)
          if (data.code === 200) {
            this.$notify.success({
              title: "成功",
              message: data.message
            });
            this.orderList();
          } else {
            this.$notify.error({
              title: "失败",
              message: data.message
            });
          }
          this.updateIsDelete = false;
        });
      },
      sizeChange(size) {
        this.size = size;
        this.listArticles();
      },
      currentChange(current) {
        this.current = current;
        this.listArticles();
      },
      changeStatus(status) {
        switch (status) {
          case "all":
            this.isDelete = 0;
            this.status = null;
            break;
          case "paying":
            this.isDelete = 0;
            this.status = 0;
            break;
          case "payed":
            this.isDelete = 0;
            this.status = 1;
            break;
        }
        this.activeStatus = status;
      },
      orderList() {
        const params = {
          current: this.current,
          size: this.size,
          keywords: this.keywords,
          status: this.status,
          isDelete: this.isDelete
        };
        this.axios.post("/order/core/orderBackList", params).then(({ data }) => {
          this.orderBackList = data.data.orderList;
          this.loading = false;
        });
      },
    },
    watch: {
      type() {
        this.current = 1;
        this.listArticles();
      },
      status() {
        this.current = 1;
        this.orderList();
      },
      isDelete() {
        this.current = 1;
        this.listArticles();
      }
    },
    computed: {
      isActive() {
        return function(status) {
          return this.activeStatus === status ? "active-status" : "status";
        };
      }
    }
  };
</script>

<style scoped>
  .operation-container {
    margin-top: 1.5rem;
  }
  .article-status-menu {
    font-size: 14px;
    margin-top: 40px;
    color: #999;
  }
  .article-status-menu span {
    margin-right: 24px;
  }
  .status {
    cursor: pointer;
  }
  .active-status {
    cursor: pointer;
    color: #333;
    font-weight: bold;
  }
  .article-cover {
    position: relative;
    width: 100%;
    height: 90px;
    border-radius: 4px;
  }
  .article-cover::after {
    content: "";
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .article-status-icon {
    color: #fff;
    font-size: 1.5rem;
    position: absolute;
    right: 1rem;
    bottom: 1.4rem;
  }
</style>
