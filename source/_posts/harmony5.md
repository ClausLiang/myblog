---
title: hsp和har的转换
date: 2024-11-06 19:30:06
tags: harmony
categories: harmony
---
在一个项目中业务量比较大，会把一些功能分包，创建的时候分两种类型：share Library和static Library，前者创建出来的类型是hsp，后者是har。

开发过程中可能会遇到共享包转型场景，主要有hsp转har包和har转hsp包两种情况。共享包转换核心思路就是将配置文件统一，比如将hsp支持的配置文件转换为har的配置文件，主要涉及module.json5、hvigorfile.ts、(build-profile.json5文件)，以及路由方式切换等场景。

# hsp转har
1. 在hsp下的module.json5中，把"type": "shared"修改为"type": "har"，删除"deliveryWithInstall"、"pages"字段。
![image.png](/images/harmony1.png)
2. 然后再找到hsp下的hvigorfile.ts文件，将里面的hspTasks改为harTasks
![image.png](/images/harmony2.png)
3. 由于har中不能声明page，需要先删除原hsp中module.json5的page声明；har不能用router.pushurl路由方式，需要修改原有router.pushurl路由为navigation(推荐)或命名路由跳转方式(router.pushNamedRoute)

# har转hsp
1. 在har下的module.json5中，把"type": "har"修改为"type": "shared"，添加"deliveryWithInstall"。
2. 再找到har下的hvigorfile.ts文件，将里面的harTasks改为hspTasks。

参考：https://developer.huawei.com/consumer/cn/forum/topic/0203153748558045079?fid=0109140870620153026
