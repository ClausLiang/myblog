---
title: 前端导出word文档
date: 2023-03-08 20:41:22
updated: 2023-03-08
tags: h5
categories: 基础
---
```js
function exportWord(css, html, fname, type='application/msword'){
    const htmlDom = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
    <div id="app">${html}</div>
</body>
</html>`
    if(isIE()){
        const blob = new Blob([htmlDom])
        if(type == 'application/msword') {
            window.navigator.msSaveOrOpenBlob(blob, fname+'.doc')
        } else {
            window.navigator.msSaveOrOpenBlob(blob, fname+'.xls')
        }
    } else {
        const blob = new Blob([htmlDom], {type: type})
        const objectUrl = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = objectUrl
        link.download = fname
        document.body.appendChild(link)
        link.click()
    }
}
function isIE(){
    if(!!window.ActiveXObject || 'ActiveXObject' in window){
        return true
    } else {
        return false
    }
}
```
以下为一个完整的前端导出word文档的例子，创建一个html文件将其复制进去就可运行。
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>前端导出word示例</title>
    <style>
        table{
            border-collapse: collapse;
        }
        td{
            padding: 5px 10px;
            border: 1px solid #ccc;
        }
    </style>
</head>

<body>

    <body>
        <button onclick="exoprtHandle()">导出word</button>
        <h2 style="color: green">个人信息</h2>
        <table>
            <tr>
                <td>姓名：</td><td>张三</td><td>年龄：</td><td>18</td>
            </tr>
            <tr>
                <td>身高：</td><td>180cm</td><td>体重：</td><td>70kg</td>
            </tr>
            <tr>
                <td>学历：</td><td>本科</td><td>专业：</td><td>计科</td>
            </tr>
        </table>
    </body>
    <script>
        function exoprtHandle(){
            const css = `
table{
    border-collapse: collapse;
}
td{
    padding: 5px 10px;
    border: 1px solid #ccc;
}`
            const html = `
<h2 style="color: green">个人信息</h2>
<table>
    <tr>
        <td>姓名：</td><td>张三</td><td>年龄：</td><td>18</td>
    </tr>
    <tr>
        <td>身高：</td><td>180cm</td><td>体重：</td><td>70kg</td>
    </tr>
    <tr>
        <td>学历：</td><td>本科</td><td>专业：</td><td>计科</td>
    </tr>
</table>`
            exportWord(css,html,'导出word示例')
        }
        function exportWord(css, html, fname, type = 'application/msword') {
            const htmlDom = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${css}</style>
</head>
<body>
    <div id="app">${html}</div>
</body>
</html>`
            if (isIE()) {
                const blob = new Blob([htmlDom])
                if (type == 'application/msword') {
                    window.navigator.msSaveOrOpenBlob(blob, fname + '.doc')
                } else {
                    window.navigator.msSaveOrOpenBlob(blob, fname + '.xls')
                }
            } else {
                const blob = new Blob([htmlDom], { type: type })
                const objectUrl = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = objectUrl
                link.download = fname
                document.body.appendChild(link)
                link.click()
            }
        }
        function isIE() {
            if (!!window.ActiveXObject || 'ActiveXObject' in window) {
                return true
            } else {
                return false
            }
        }
    </script>
</body>

</html>
```
