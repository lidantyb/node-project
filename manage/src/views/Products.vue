<template>
  <div class="products">
    <div class="header clearfix">
      <ul class="list fl clearfix">
        <li class="fl list-title">商品名称</li>
        <li class="fl list-input">
          <input type="text" class="form-control" v-model="searchInfo.name" />
        </li>
      </ul>
      <ul class="list fl clearfix">
        <li class="fl list-title">商品类型</li>
        <li class="fl list-input">
          <select class="form-control" v-model="searchInfo.type">
            <option :value="item.type_id" v-for="(item,index) in proTypeList" :key="index">{{item.type}}</option>
          </select>
        </li>
      </ul>
      <ul class="list fl clearfix">
        <li class="fl list-title">商品状态</li>
        <li class="fl list-input">
          <select class="form-control" v-model="searchInfo.status">
            <option value="default">请选择</option>
            <option value="1">上架</option>
            <option value="0">下架</option>
          </select>
        </li>
      </ul>
      <ul class="list fl clearfix">
        <li class="fl list-title">添加日期</li>
        <li class="fl list-input">
          <input type="date" class="form-control" v-model="searchInfo.date" />
        </li>
      </ul>
      <ul class="list fl clearfix">
        <li><button class="btn btn-primary" @click="search()">搜索</button></li>
      </ul>
    </div>
    <div class="btn-box">
      <button class="btn btn-warning" @click="goPro(2)">添加商品</button>
    </div>
    <div class="content">
      <table class="table table-hover">
        <thead class="thead-dark">
          <tr>
            <th>序号</th>
            <th>商品名称</th>
            <th>商品类型</th>
            <th>商品状态</th>
            <th>添加时间</th>
            <th>更新时间</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in productList" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.status == 1 ? "上架" : "下架" }}</td>
            <td>{{ item.created_at }}</td>
            <td>{{ item.updated_at }}</td>
            <td>
              <button class="btn btn-success btn-sm pro-btn" @click="goPro(1,item.pid)">查看</button>
              <button class="btn btn-info btn-sm pro-btn" @click="goPro(3,item.pid)">编辑</button>
              <button class="btn btn-warning btn-sm pro-btn" v-if="item.status == 0" @click="upDown(1,item)">上架</button>
              <button class="btn btn-secondary btn-sm pro-btn" v-else @click="upDown(0,item)">下架</button>
              <button class="btn btn-danger btn-sm" @click="remove(item.pid,index)">删除</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- 底部分页 -->
      <div class="down" v-if="productList.length > 0">
        <nav aria-label="...">
          <ul class="pagination justify-content-center">
            <li
              class="page-item"
              :class="{ disabled: currentPage == 1 }"
              @click="prevPage()"
            >
              <a class="page-link" href="javascript:void(0);">上一页</a>
            </li>
            <li class="page-item active">
              <a class="page-link" href="javascript:void(0);">{{currentPage}}</a>
            </li>
            <li
              class="page-item"
              :class="{ disabled: currentPage == totalPage }"
              @click="nextPage()"
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
    </div>
  </div>
</template>

<script>
// 引入格式化日期
import { tool } from "../assets/js/tool";
export default {
  data() {
    return {
      // 搜索信息
      searchInfo:{
        name:'',
        type:'default',
        status:'default',
        date:''
      },
      // 商品类型列表
      proTypeList:[],
      // 商品列表数据
      productList: [],
      //当前页
      currentPage: 1,
      // 每页显示10条数据
      pageCount: 10,
      // 总页数
      totalPage: 1,
    };
  },
  created() {
    // 调用获取商品类型
    this.getProType();
    // 获取商品列表数据
    this.getProductList();
    // 获取商品列表数量
    this.getProductListRows();
  },
  methods: {
    // 查看：1、添加：2、编辑：3
    goPro(id,pid){
      let params = {
        id
      };
      if(pid){
        params.pid = pid;
      }
      this.$router.push({name: 'Pro', params});
    },

    // 获取商品类型
    getProType() {
      this.axios({
        method: 'GET',
        url: '/proType'
      }).then(result => {
        // 
        result.data.result.unshift({
          type_id: 'default',
          type: '请选择'
        });
        this.proTypeList = result.data.result;
        // 
      }).catch(err => {
        
      })
    },

    // 获取搜索条件
    getSearchCondition(){
      // 获取搜索条件
      let searchCondition = this.searchInfo;
      // 

      // 过滤条件
      // 商品名称、日期不能为空
      // 商品状态、商品不能为default
      let condition = {};
      
      if(searchCondition.name != ''){
        condition.name = searchCondition.name;
      }
      if(searchCondition.date != ''){
        condition.date = searchCondition.date;
      }
      if(searchCondition.type != 'default'){
        condition.type = searchCondition.type;
      }
      if(searchCondition.status != 'default'){
        condition.status = searchCondition.status;
      }

      return condition;

      // 
    },

    // 搜索点击事件
    search(){
      this.currentPage = 1;
      // 获取商品列表数据
      this.getProductList();
      // 获取商品列表数量
      this.getProductListRows();
    },

    // 获取商品列表数量记录数量
    getProductListRows(){

      let condition = this.getSearchCondition();

      this.axios({
        method:'GET',
        url:'/productListRows',
        params:condition
      }).then(result => {
        // 
        this.totalPage = Math.ceil(result.data.result / this.pageCount);
        // 
      }).catch(err => {
        
      })
    },

    // 获取商品列表数据
    getProductList(){

      let condition = this.getSearchCondition();

      // 

      // 偏移数据量
      condition.offset = (this.currentPage - 1) * this.pageCount;

      // 查询数据量
      condition.limit = this.pageCount;

      // 发起请求
      this.axios({
        method:'GET',
        url:'/productList',
        params:condition
      }).then(result => {
        // 
        // 
        result.data.result.forEach((v) => {
          v.created_at = tool.formatDate(
            new Date(v.created_at),
            "yyyy-MM-dd hh:mm:ss"
          );
          v.updated_at = tool.formatDate(
            new Date(v.updated_at),
            "yyyy-MM-dd hh:mm:ss"
          );
        });
        this.productList = result.data.result
      }).catch(err => {
        
      })
    },

    // 上一页
    prevPage(){
      if(this.currentPage == 1){
        return;
      }
      this.currentPage --;
      this.getProductList();
    },

    // 下一页
    nextPage(){
      if(this.currentPage == this.totalPage){
        return;
      }
      this.currentPage ++;
      this.getProductList();
    },

    // 上下架
    upDown(status,item){

      // 
      // 
      this.axios({
        method:'POST',
        url:'/status',
        data:{
          status,
          pid:item.pid
        }
      }).then(result => {
        // 
        if(result.data.result[0] == 1){
          item.status = status
        }
      }).catch(err => {
        
      })
    },

    // 删除商品
    remove(pid, index){
      
      this.axios({
        method:'POST',
        url:'/removeProduct',
        data: {
          pid
        }
      }).then(result => {
        

        if(result.data.result == 1){
          // 如果存在下一页数据，则补全当前页数据
          // 判断是否存在下一页
          if(this.currentPage < this.totalPage){
            this.getProductList();
            this.getProductListRows();
          }
          else {
            //如果是最后一页，存在两种可能
            //1--删除后，最后一页仍然存在数据，则只是删除当前数组数据，不换页码
            if (this.productList.length >= 2) {
              this.productList.splice(index, 1);
            } else {
              //2--删除后，最后一页不存在数据，判断是否存在上一页数据，如果存在上一页数据，则跳到上一页，否则隐藏分页控件

              //判断是否存在上一页数据
              if (this.currentPage > 1) {
                this.currentPage--;
                this.getProductList();
                this.getProductListRows();
              } else {
                this.productList.splice(index, 1);
              }
            }

          }
        }

      }).catch(err => {
        
      })
    },

  },
};
</script>

<style lang="less" scoped>
.page-item{
  user-select: none;
}
.products {
  padding: 20px;
}
.header {
  .list {
    line-height: 38px;
    margin-right: 20px;
  }
  .list-title {
    width: 80px;
  }
  .list-input {
    width: 200px;
  }
}
.pro-btn {
  margin-right: 10px;
}
.content {
  margin-top: 20px;
}
</style>