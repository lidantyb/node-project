<template>
  <div class="type">
    <!-- 搜索商品类型 -->
    <div class="top clearfix">
      <div class="fl">商品类型</div>
      <div class="fl">
        <input
          type="text"
          class="form-control"
          placeholder="请输入查找的商品类型"
          v-model="typeTitle"
          @keyup.enter="search"
        />
      </div>
      <div class="fl">
        <button class="btn btn-primary" @click="search">查询</button>
      </div>
    </div>
    <!-- 添加商品类型 -->
    <div class="add">
      <button class="btn btn-warning" @click="showPopup(1)">
        添加商品类型
      </button>
      <van-dialog
        v-model="show"
        :title="title"
        show-cancel-button
        :beforeClose="beforeClose"
      >
        <div class="add-content clearfix">
          <div class="fl">类型名称</div>
          <input
            type="text"
            class="fr form-control"
            placeholder="请输入商品类型名称"
            v-model="typename"
          />
        </div>
      </van-dialog>
    </div>
    <!-- 商品类型的主要内容 -->
    <div class="content">
      <table class="table table-hover">
        <thead class="thead-dark">
          <tr>
            <th>序号</th>
            <th>类型名称</th>
            <th>状态</th>
            <th>添加时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in typeList" :key="index">
            <td>{{index + 1}}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.is_enable ? "正常" : "禁用" }}</td>
            <td>{{ item.createdAt }}</td>
            <td>{{ item.updatedAt }}</td>
            <td>
              <button
                class="btn btn-primary"
                @click="showPopup(2, index)"
                v-bind:disabled="item.is_enable ? false : true"
              >
                编辑
              </button>
              <button
                class="btn btn-danger"
                v-if="item.is_enable"
                @click="setTypeStatus(0, item.type_id, index)"
              >
                禁用
              </button>
              <button
                class="btn btn-secondary"
                v-else
                @click="setTypeStatus(1, item.type_id, index)"
              >
                启用
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- 底部分页 -->
    <div class="down" v-if="typeList.length > 0">
      <!-- vant -->
      <!-- <van-pagination
            v-model="currentPage"
            :total-items="24"
            :items-per-page="5"
            class="justify-content-center"
        /> -->
      <!-- bootstrap -->
      <nav aria-label="...">
        <ul class="pagination justify-content-center">
          <li
            class="page-item"
            :class="{ disabled: currentPage == 1 }"
            @click="togglePage()"
          >
            <a class="page-link" href="javascript:void(0);">上一页</a>
          </li>
          <li class="page-item active">
            <a class="page-link" href="javascript:void(0);">{{
              currentPage
            }}</a>
          </li>
          <li
            class="page-item"
            :class="{ disabled: currentPage == totalPage }"
            @click="togglePage(true)"
          >
            <a class="page-link" href="javascript:void(0);">下一页</a>
          </li>
          <li class="page-item disabled">
            <a class="page-link" href="javascript:void(0);"
              >共{{ totalPage }}页</a
            >
          </li>
        </ul>
      </nav>
    </div>

    <!-- 使用组件 -->
    <msg-box></msg-box>
  </div>
</template>

<script>
// 引入消息提示组件
import MsgBox from "../components/MsgBox";
// 引入格式化日期
import { tool } from "../assets/js/tool";
export default {
  data() {
    return {
      currentPage: 1, // 底部分页
      show: false, // 添加数据类型页面显示隐藏
      typename: "", // 添加数据类型的具体数据
      typeList: [], // 所有商品类型数据
      typeTitle: "", // 搜索商品类型
      //编辑商品类型的id
      typeId: "",
      //添加或者编辑商品类型标题
      title: "添加商品类型",
      //记录编辑的商品类型下标
      index: -1,
      //当前页
      currentPage: 1,
      // 每页显示8条数据
      pageCount: 8,
      // 总页数
      totalPage: 1,
    };
  },
  created() {
    // 初始化数据时调用获取商品类型方法
    this.getTypeData();
    // 获取数据表的数据数量
    this.getTypeDateRows();
  },
  methods: {
    // 显示添加数据类型
    showPopup(flag, index) {
      this.show = true;
      if (flag == 2) {
        // 编辑
        this.typeId = this.typeList[index].type_id;
        this.typename = this.typeList[index].type;
        this.title = "编辑商品类型";
        this.index = index;
      } else {
        // 添加
        this.typeId = "";
        this.typename = "";
        this.title = "添加商品类型";
        this.index = -1;
      }
    },
    // 判断确定取消
    beforeClose(action, done) {
      // action  点击的目标名称，confirm为确定，cancel为取消
      // done   执行关闭的操作

      if (action === "confirm") {
        if (
          (typeof this.typename === "string" && this.typename.trim() == "") ||
          this.typename == null
        ) {
          this.$children[2].a("请输入商品类型");
          done(false); //不关闭弹框
        } else {
          // setTimeout(done, 1000);

          // 
          if (!this.typeId) {
            
            // 将输入的商品类型添加到数据库中
            this.axios({
              method: "POST",
              url: "/addType",
              data: {
                typename: this.typename,
              },
            })
              .then((result) => {
                
                if (result.data.msg == "添加数据类型成功") {
                  // 将输入框数据和搜索框数据清空
                  this.typename = "";
                  this.typeTitle = "";
                  done(true); // 关闭弹框
                  this.currentPage = 1
                  // 初始化数据时调用获取商品类型方法
                  this.getTypeData();
                  // 获取数据表的数据数量
                  this.getTypeDateRows();
                } else {
                  // 错误提示信息
                  this.$children[2].a(result.data.msg);
                }
              })
              .catch((err) => {
                
              });
          } else {
            
            // 修改商品类型
            this.axios({
              method: "POST",
              url: "/type",
              data: {
                type_id: this.typeId,
                type: this.typename,
              },
            })
              .then((result) => {
                
                done(true); // 关闭弹框
                this.getTypeData();
              })
              .catch((err) => {
                
              });
          }
        }
      } else if (action === "cancel") {
        done(true);
      }
    },
    // 获取商品类型数据
    getTypeData() {
      this.axios({
        method: "GET",
        url: "/getType",
        params: {
          // 偏移数据量
          offset: (this.currentPage - 1) * this.pageCount,
          // 查询数据量
          limit: this.pageCount,
        },
      })
        .then((result) => {
          
          // 日期格式化
          result.data.result.forEach((v) => {
            v.createdAt = tool.formatDate(
              new Date(v.createdAt),
              "yyyy-MM-dd hh:mm:ss"
            );
            v.updatedAt = tool.formatDate(
              new Date(v.updatedAt),
              "yyyy-MM-dd hh:mm:ss"
            );
          });
          this.typeList = result.data.result;
        })
        .catch((err) => {
          
        });
    },
    // 搜索商品类型数据
    search() {
      if (
        (typeof this.typeTitle === "string" && this.typeTitle.trim() == "") ||
        this.typeTitle == null
      ) {
        // this.$children[2].a('请输入查找的商品类型');
        // 刷新当前页面
        this.$router.go(0);
        return;
      } else {
        this.currentPage = 1;
        // 调用搜索商品类型
        this.searchType();
        // 调用搜索商品类型
        this.searchRows();
      }
    },
    // 搜素商品类型
    searchType() {
      this.axios({
        method: "GET",
        url: "/searchType",
        params: {
          type: this.typeTitle,
          offset: (this.currentPage - 1) * this.pageCount,
          limit: this.pageCount,
        },
      })
        .then((result) => {
          
          // 处理时间
          result.data.result.forEach((v) => {
            v.createdAt = tool.formatDate(
              new Date(v.createdAt),
              "yyyy-MM-dd hh:mm:ss"
            );
            v.updatedAt = tool.formatDate(
              new Date(v.updatedAt),
              "yyyy-MM-dd hh:mm:ss"
            );
          });
          // 修改数据
          this.typeList = result.data.result;
        })
        .catch((err) => {
          
        });
    },
    //搜索商品类型数据数量
    searchRows() {
      this.axios({
        method: "GET",
        url: "/searchRows",
        params:{
          type:this.typeTitle
        }
      })
        .then((result) => {
          
          // 分页
          this.totalPage = Math.ceil(result.data.result / this.pageCount);
        })
        .catch((err) => {
          
        });
    },
    // 禁用和启用
    setTypeStatus(status, type_id, index) {
      this.axios({
        method: "POST",
        url: "/typeStatus",
        data: {
          status,
          type_id,
        },
      })
        .then((result) => {
          
          // 判断操作是否成功，高边状态
          if (result.data.msg == "操作成功") {
            this.typeList[index].is_enable = status;
          } else {
            this.$children[0].a(result.data.msg);
          }
        })
        .catch((err) => {
          
        });
    },
    // 获取数据表的数据数量,用于分页
    getTypeDateRows() {
      this.axios({
        method: "GET",
        url: "/typeRows",
      })
        .then((result) => {
          
          // 分页
          this.totalPage = Math.ceil(result.data.result / this.pageCount);
        })
        .catch((err) => {
          
        });
    },
    // 点击上下页
    togglePage(isNext) {
      // 下一页
      if (isNext) {
        if (this.currentPage < this.totalPage) {
          this.currentPage++;
          // 
          if (this.typeTitle == "") {
            this.getTypeData();
          } else {
            this.searchType();
          }
        }
      } else {
        // 上一页
        if (this.currentPage > 1) {
          this.currentPage = 1;
          if (this.typeTitle == "") {
            this.getTypeData();
          } else {
            this.searchType();
          }
        }
      }
    },
  },
  components: {
    MsgBox,
  },
};
</script>

<style lang="less" scoped>
.page-item {
  user-select: none;
}
.top {
  line-height: 38px;
  .fl {
    padding-right: 20px;
  }
}

/deep/ .van-dialog__header {
  font-weight: 800;
}
.add {
  padding: 20px 0;
}
.add-content {
  line-height: 38px;
  padding: 20px;
  input {
    width: 200px;
  }
}

.content {
  .btn {
    margin-right: 10px;
  }
}

/deep/ .van-pagination__item {
  max-width: 50px;
}
</style>