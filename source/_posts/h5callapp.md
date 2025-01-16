---
title: h5调用原生app的方法
date: 2020-10-13 17:49:35
tags: h5
categories: h5
---

分安卓和IOS，安卓可以直接调用，iso需要通过桥来调用
```
var u = navigator.userAgent;
if(u.indexOf('Android') > -1 || u.indexOf('Adr') > -1){ //android终端
  let appData = window.android.原生方法(参数);
  if (appData) {//返回值
      
  }
}else if(!!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){ //ios终端
  utils.setupWebViewJavascriptBridge((bridge)=>{
    bridge.callHandler('原生方法',参数, function (response) {
    	// response返回值
    });
  })
}
```
ISO的桥
```
function setupWebViewJavascriptBridge(callback) {
   if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
   if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
   window.WVJBCallbacks = [callback]; // 创建一个 WVJBCallbacks 全局属性数组，并将 callback 插入到数组中。
   var WVJBIframe = document.createElement('iframe'); // 创建一个 iframe 元素
   WVJBIframe.style.display = 'none'; // 不显示
   WVJBIframe.src = 'https://__bridge_loaded__';
   // WVJBIframe.src = 'wvjbscheme://__BRIDGE_LOADED__'; // 设置 iframe 的 src 属性
   document.documentElement.appendChild(WVJBIframe); // 把 iframe 添加到当前文导航上。
   setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
}



```
