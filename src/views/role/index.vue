<template>
  <el-card class="main-card">
    <div class="title">{{ this.$route.name }}</div>
    <!-- 表格操作 -->
    <div class="operation-container">
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="openMenuModel(null)"
      >
        新增
      </el-button>
      <el-button
        type="danger"
        size="small"
        icon="el-icon-delete"
        :disabled="this.roleIdList.length == 0"
        @click="isDelete = true"
      >
        批量删除
      </el-button>
      <!-- 条件筛选 -->
      <div style="margin-left:auto">
        <el-input
          v-model="keywords"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="请输入角色名"
          style="width:200px"
          @keyup.enter.native="searchRoles"
        />
        <el-button
          type="primary"
          size="small"
          icon="el-icon-search"
          style="margin-left:1rem"
          @click="searchRoles"
        >
          搜索
        </el-button>
      </div>
    </div>
    <!-- 表格展示 -->
    <el-table
      border
      :data="roleList"
      @selection-change="selectionChange"
      v-loading="loading"
    >
      <!-- 表格列 -->
      <el-table-column type="selection" width="55" />
      <el-table-column prop="roleName" label="角色名" align="center" />
      <el-table-column prop="roleLabel" label="权限标签" align="center">
        <template slot-scope="scope">
          <el-tag>
            {{ scope.row.roleLabel }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="isDisable" label="禁用" align="center" width="100">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.isDisable"
            active-color="#13ce66"
            inactive-color="#F4F4F5"
            :active-value="1"
            :inactive-value="0"
            @change="changeDisable(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        label="创建时间"
        width="150"
        align="center"
      >
        <template slot-scope="scope">
          <i class="el-icon-time" style="margin-right:5px" />
          {{ scope.row.createTime | date }}
        </template>
      </el-table-column>
      <!-- 列操作 -->
      <el-table-column label="操作" align="center" width="220">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="openMenuModel(scope.row)">
            <i class="el-icon-edit" /> 菜单权限
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="openResourceModel(scope.row)"
          >
            <i class="el-icon-folder-checked" /> 资源权限
          </el-button>
          <el-popconfirm
            title="确定删除吗？"
            style="margin-left:10px"
            @onConfirm="deleteRoles(scope.row.id)"
          >
            <el-button size="mini" type="text" slot="reference">
              <i class="el-icon-delete" /> 删除
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
      :page-sizes="[10, 20]"
      layout="total, sizes, prev, pager, next, jumper"
    />
    <!-- 菜单对话框 -->
    <el-dialog :visible.sync="roleMenu" width="30%" :close-on-click-modal="false">
      <div class="dialog-title-container" slot="title" ref="roleTitle" />
      <el-form label-width="80px" size="medium" :model="roleForm">
        <el-form-item label="角色名">
          <el-input v-model="roleForm.roleName" style="width:250px" />
        </el-form-item>
        <el-form-item label="权限标签">
          <el-input v-model="roleForm.roleLabel" style="width:250px" />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuList"
            :default-checked-keys="roleForm.menuIdList"
            check-strictly
            show-checkbox
            node-key="id"
            ref="menuTree"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="roleMenu = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateRoleMenu">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 资源对话框 -->
    <el-dialog :visible.sync="roleResource" width="30%" top="9vh" :close-on-click-modal="false">
      <div class="dialog-title-container" slot="title">修改资源权限</div>
      <el-form label-width="80px" size="medium" :model="roleForm">
        <el-form-item label="角色名">
          <el-input v-model="roleForm.roleName" style="width:250px" />
        </el-form-item>
        <el-form-item label="权限标签">
          <el-input v-model="roleForm.roleLabel" style="width:250px" />
        </el-form-item>
        <el-form-item label="资源权限">
          <el-tree
            :data="resourceList"
            :default-checked-keys="roleForm.resourceIdList"
            show-checkbox
            node-key="id"
            ref="resourceTree"
          />
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="roleResource = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdateRoleResource">
          确 定
        </el-button>
      </div>
    </el-dialog>
    <!-- 批量删除对话框 -->
    <el-dialog :visible.sync="isDelete" width="30%" :close-on-click-modal="false">
      <div class="dialog-title-container" slot="title">
        <i class="el-icon-warning" style="color:#ff9900" />提示
      </div>
      <div style="font-size:1rem">是否删除选中项？</div>
      <div slot="footer">
        <el-button @click="isDelete = false">取 消</el-button>
        <el-button type="primary" @click="deleteRoles(null)">
          确 定
        </el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
  import {generaMenu} from "../../assets/js/menu";

  export default {
    created() {
      this.listRoles();
    },
    data: function() {
      return {
        loading: true,
        isDelete: false,
        roleList: [],
        roleIdList: [],
        keywords: null,
        current: 1,
        size: 10,
        count: 0,
        roleMenu: false,
        roleResource: false,
        resourceList: [],
        menuList: [],
        roleForm: {
          roleName: "",
          roleLabel: "",
          resourceIdList: [],
          menuIdList: []
        }
      };
    },
    methods: {
      changeDisable(row) {
        console.log("row", row)
        let params = {
          isDisable: row.isDisable,
          id: row.id,
          roleName: row.roleName,
          roleLabel: row.roleLabel
        }
        console.log("params", params)
        this.axios.put("/role/core/disableRole", params).then(res => {
          if (res.data.code === 200) {
            this.$notify.success({
              title: "成功",
            });
            this.listRoles();
          } else {
            this.$notify.error({
              title: "失败",
            });
          }
          this.isDelete = false;
        })
      },
      searchRoles() {
        this.current = 1;
        this.listRoles();
      },
      sizeChange(size) {
        this.size = size;
        this.listRoles();
      },
      currentChange(current) {
        this.current = current;
        this.listRoles();
      },
      selectionChange(roleList) {
        this.roleIdList = [];
        roleList.forEach(item => {
          this.roleIdList.push(item.id);
        });
      },
      listRoles() {
        const params = {
          current: this.current,
          size: this.size,
          keywords: this.keywords
        };
        this.axios.get("/role/core/roleList", {params: params}).then(res => {
          console.log(res)
          this.roleList = res.data.data.roleList;
          this.count = res.data.data.count;
          this.loading = false;
        });
        this.axios.get("/resource/core/labelOptionDTOList").then(res => {
          this.resourceList = res.data.data.labelOptionDTOList;
        });
        this.axios.get("/menu/core/menuOptionsList").then(res => {
          console.log("menu", res)
          this.menuList = res.data.data.labelOptionDTOList;
        });
      },
      deleteRoles(id) {
        console.log("delete")
        let param = {};
        if (id == null) {
          param = { data: this.roleIdList };
        } else {
          param = { data: [id] };
        }
        this.axios.delete("/role/core/deleteRole", param).then(res => {
          if (res.data.code === 200) {
            this.$notify.success({
              title: "成功",
            });
            this.listRoles();
          } else {
            this.$notify.error({
              title: "失败",
              message: "该角色下存在用户！"
            });
          }
          this.isDelete = false;
        });
      },
      openMenuModel(role) {
        console.log("role", role)
        this.$nextTick(function() {
          this.$refs.menuTree.setCheckedKeys([]);
        });
        this.$refs.roleTitle.innerHTML = role ? "修改角色" : "新增角色";
        if (role != null) {
          this.roleForm = JSON.parse(JSON.stringify(role));
          console.log("this.roleForm", this.roleForm)
        } else {
          this.roleForm = {
            roleName: "",
            roleLabel: "",
            resourceIdList: [],
            menuIdList: []
          };
        }
        this.roleMenu = true;
      },
      openResourceModel(role) {
        console.log("role", role)
        this.$nextTick(function() {
          this.$refs.resourceTree.setCheckedKeys([]);
        });
        this.roleForm = JSON.parse(JSON.stringify(role));
        this.roleResource = true;
      },
      saveOrUpdateRoleResource() {
        this.roleForm.menuIdList = null;
        this.roleForm.resourceIdList = this.$refs.resourceTree.getCheckedKeys();
        this.axios.post("/role/core/saveOrUpdateRole", this.roleForm).then(res => {
          if (res.data.code === 200) {
            this.$notify.success({
              title: "成功",
            });
            this.listRoles();
          } else {
            this.$notify.error({
              title: "失败",
            });
          }
          this.roleResource = false;
        });
      },
      saveOrUpdateRoleMenu() {
        if (this.roleForm.roleName.trim() === "") {
          this.$message.error("角色名不能为空");
          return false;
        }
        if (this.roleForm.roleLabel.trim() === "") {
          this.$message.error("权限标签不能为空");
          return false;
        }
        this.roleForm.resourceIdList = null;
        this.roleForm.menuIdList = this.$refs.menuTree
          .getCheckedKeys()
          .concat(this.$refs.menuTree.getHalfCheckedKeys());
        console.log("key", this.roleForm)
        this.axios.post("/role/core/saveOrUpdateRole", this.roleForm).then(res => {
          if (res.data.code === 200) {
            this.$notify.success({
              title: "成功",
            });
            generaMenu();
            this.listRoles();
          } else {
            this.$notify.error({
              title: "失败",
            });
          }
          this.roleMenu = false;
        });
      }
    }
  };
</script>
