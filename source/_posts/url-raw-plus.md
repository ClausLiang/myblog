---
title: 前端如何正确接收 URL 里的「裸 +」参数
date: 2026-06-24 15:49:49
updated: 2026-06-24 15:49:49
tags: vue
categories: vue
---
<script type="text/javascript" src="/myblog/custom.js"></script>

> 适用场景：从 URL query 里接收 base64（或其它含 `+` `/` `=` 的）参数，且这条链接由**第三方/后端生成**、
> 前端无法控制其编码方式时。本文是通用版，不依赖任何具体框架的项目封装。

# 问题是怎么来的

base64 字符集里有 `+`。生成链接的一方如果**没有**把 `+` 转义成 `%2B`，发出来的就是**裸 `+`**：

```
https://example.com/confirm?key=ab+cd/ef==
```

浏览器点这种链接时，对 `+` `/` `=` 这些 URL 合法字符**不会主动再编码**，原样发出去。
于是前端拿到的 query string 里就是裸 `+`。

# 为什么不能直接用框架的 query 解析(route.query.key)

vue-router、以及很多按 **form-urlencoded** 语义解析 query 的库，都会先把 `+` 替换成空格、再 `decodeURIComponent`：

```js
const PLUS_RE = /\+/g
// ...
value.replace(PLUS_RE, ' ')   // + → 空格，发生在 decode 之前
```

所以裸 `+` 经过这类 query 解析会变成**空格**，base64 失真，后端校验必然失败。

> 注意区分两种情况：
> - 链接规范编码（`+` → `%2B`）：框架也能正确解回 `+`，**无需特殊处理**。
> - 链接发裸 `+`：才需要下面的绕开方案。
>
> 如果你在代码里看到了这类防御逻辑，通常意味着上游发的就是**裸 `+`**。

# 正确接收姿势：绕开框架解析 + `decodeURIComponent`

关键点：`decodeURIComponent` **不会**把 `+` 当空格（那是 form-urlencoded / `decodeURI` 才有的行为），
所以直接从原始 `location.search` 正则取值再 `decodeURIComponent`，就能保住 `+`。

```js
// 直接从原始 search 取 key，避开框架的 + → 空格
function readRawKey() {
  try {
    const m = (window.location.search || '').match(/[?&]key=([^&]*)/)
    // decodeURIComponent 不把 + 当空格，裸 + 得以保留
    return m ? decodeURIComponent(m[1]) : (route.query?.key || '')
  } catch {
    return ''
  }
}
```

要点：

- 用 `window.location.search` 拿**原始串**，不要走框架已处理过的 query 对象。
- 用 `decodeURIComponent` 而非 `decodeURI`：前者不动 `+`，后者会还原 form-urlencoded 的 `+`→空格语义。
- 框架的 query 值仅作兜底（如果需要的话）。

# 回传时注意双重编码

接收端解出来的 key 再发回服务端时，**确认你的 HTTP 客户端会做 `encodeURIComponent`**（绝大多数 axios / fetch 的 query 序列化都会，`+` 会被编成 `%2B`），**不要再手动编码一次**，否则会出现双重编码（`+` → `%2B` → `%252B`）。
"接收端手动解码（保 `+`）" 和 "发送端自动编码（`+`→`%2B`）" 应是一进一出的对称关系。

# 概念澄清

| 概念 | 说明 |
| --- | --- |
| `encodeURIComponent` / `decodeURIComponent` | 组件级编解码，`+` 是**普通字符**，不当空格 |
| `encodeURI` / `decodeURI` | 整 URI 级，配合 form-urlencoded 时 `+`↔空格 |
| form-urlencoded | `application/x-www-form-urlencoded` 编码规则：`+`=空格，`%2B`=字面加号。很多框架的 query 解析沿用这套语义 |
| 浏览器「自动编码」 | 只对明显非法字符（空格、非 ASCII 等）补救式编码；`+` `/` `=` 等合法字符**不动** |

# 一句话总结

上游发的是**裸 `+`**，浏览器不会替你编码，按 form-urlencoded 解析又会把 `+` 吃成空格——
所以接收端必须**绕开框架的 query 解析**，从原始 `location.search` 取值并用 `decodeURIComponent` 还原，才能拿到完整的 base64 key。
