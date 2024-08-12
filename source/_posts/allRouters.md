---
title: ant-design-vue的admin-pro项目是怎么做权限控制的
date: 2023-11-17 11:56:57
tags: antd
categories: vue
---
公司的后台管理系统是基于ant-design-vue的vip收费版搭建的项目。下载地址是https://store.antdv.com/items/admin-pro, 收费版和免费版的区别是收费版用的vue3 ts开发的，而免费版用的是vue2开发的。

# 项目初始化后是怎么创建页面组件（路由）的，权限控制又是怎么做的？

我们的项目基于pro-vip做了一些改动，但是架子跟pro-vip是基本差不多的。

在router.beforeEach中获取用户信息及权限信息，并将（路由）权限存到userStore里，下次路由跳转判断userStore中有权限信息就不重新获取用户信息及权限信息了
```js
router.beforeEach(async to => {
  //....

  // 判断userStore中有allowRouters，直接返回true
  if (userStore.allowRouters && userStore.allowRouters.length > 0) {
    return true;
  } else {
    const info = await userStore.GET_INFO();
    // 使用当前用户的 权限信息 生成 对应权限的路由表
    const allowRouters = await userStore.GENERATE_ROUTES(info);
    if (allowRouters) {
      return { ...to, replace: true };
    }
    return false;
  }
});
```
userStore.GENERATE_ROUTES()方法内，调用接口请求用户的菜单权限，拿到值后动态地添加路由，动态添加路由的具体方法为：router.addRoute(route)，添加之前router是包含一些如/404、/login等静态路由的路由对象。
要添加的route对象结构如下：
```js
// router结构
{
  path: '/'
  redirect: '/home',
  name: 'index',
  component: () => import('/src/layouts/index.vue?t=...'),
  children: [
    {path: '/home', name: 'home', component: () => import('/src/views/home/home.vue')},
    {}
  ]
}
```

# 项目中加了顶部切换体系，不同体系展示不同权限菜单的功能
![图片](/images/allRouters-2023-11-17.png)

按照需求，我们项目的实现方式如下：

## a.后端返回的菜单权限是全部的菜单，树形菜单的每个节点上有体系ID数组，结构如下：
```js
// 接口返回的菜单权限数据
[
  {
    name: '采购名录管理',
    manageSystemIds: [64,3], // 有该权限体系ID
    url: '...',
    type: 1,
    children: [
      {
        name: '名录准入管理',
        manageSystemIds: [64,3], // 有该权限体系ID
        url: '',
        // ...
      }
    ]
  }
]
```
## b.当页面切换体系时，前端对树形菜单进行过滤，返回有该体系有权限的菜单树。

前端要做的事情有两点：
`1.根据用户选择的体系id，过滤菜单`
由于切换体系的功能是在顶部，是在框架上，而不是某个页面中，故这块dom及逻辑就放在了basic-layout.vue中。
根据id切换过滤菜单的代码略

`2.对该体系下没有权限的菜单进行拦截`
```js
/**
 * 1.如果是当前页面跳转没有权限的路由，在router.beforeEach里就能拦住无权限的路由
 */
/**
 * 2.如果是新打开页面，router.beforeEach跑两遍，
 * 第一遍userStore.allowRouters为空，需要去调接口动态创建路由，此时并进入basic-layout页面
 * 第二遍userStore.allowRouters不为空，且是全部的路由，开始加载basic-layout页面
 * 根据体系ID完成的路由过滤是写在basic-layout中的，此时router.beforeEach的拦截已经执行完了
 * 故需要在basic-layout中再写一遍路由拦截
 * 
 */

// 不需要进行权限管理的路由
const permitList = ['/404', '/','/a4print','/a5print','/a4printM','/a5printM'];
// 定义一个递归函数，给permitList塞数据
const filterRouterPath = routes => {
  routes.forEach(item => {
    permitList.push(item.path);
    item.children?.length > 0 ? filterRouterPath(item.children) : '';
  });
};

if (userStore.allowRouters && userStore.allowRouters.length > 0) {
  // 执行递归，得到完整的permitList
  filterRouterPath(userStore.allowRouters);
  // 如果不允许跳转，就跳404
  if (!permitList.includes(route.path)) {
    setTimeout(() => {
      router.replace('/404');
    }, 300);
  }
}
```
这块是需要重点理解的：`打开新页面并访问没权限的菜单时，router.beforeEach()执行两遍，第一遍并不会进入basic-layout页面，第二遍才会进入`
根据上面的业务场景及逻辑需要在basic-layout.vue，及router.beforeEach中，写两次。


