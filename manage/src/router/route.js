export const routes = [
    {
      path:'/register',
      name:'Register',
  
      // 懒加载
      component:r => {require(['../views/Register.vue'],r)}
    },
    {
      path:'/login',
      name:'Login',
      component:r => {require(['../views/Login.vue'],r)}
    },
    {
      path: '/forgotPwd',
      name: 'ForgotPwd',
  
      //懒加载组件
      component: r => require(['../views/ForgotPwd.vue'], r)
    },
    {
      path:'/main',
      name:'Main',
      component:r => {require(['../views/Main.vue'],r)},
      children:[
        {
          path:'type',
          name:'Type',
          component:r => {require(['../views/Type.vue'],r)},
        },
        {
          path:'products',
          name:'Products',
          component:r => {require(['../views/Products.vue'],r)},
        },
        {
          // ?表示修饰前面一个参数可有可无，有只有一个
          path:'pro/:id/:pid?',
          name:'Pro',
          component:r => {require(['../views/Pro.vue'],r)},
        }
      ]
    },
    // 重定向
    {
      path:'*',
      redirect:{
        name:'Register'
      }
    }
  ]