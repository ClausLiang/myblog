---
title: vscode配置解读
date: 2023-01-29 23:08:53
updated: 2023-01-29
tags: vscode
categories: 基础
---
```json
{
    "breadcrumbs.enabled": true, // 面包屑
    "editor.renderControlCharacters": false, // 控制编辑器是否显示控制字符
    "editor.fontSize": 16, // 字体大小
    "editor.tabSize": 4,  // tab大小
    "editor.wordWrapColumn": 120,// 在 #editor.wordWrap# 为 wordWrapColumn 或 bounded 时，控制编辑器的折行列。
    "editor.detectIndentation": false,//控制在基于文件内容打开文件时是否自动检测 #editor.tabSize# 和 #editor.insertSpaces#。
    "editor.insertSpaces": true, // 按 Tab 时插入空格。当 #editor.detectIndentation# 打开时，将根据文件内容替代此设置。
    "files.exclude": { // 隐藏文件
        "**/node_modules": true,
        "**/.idea": true,
        "**/.vscode": true,
        "**/.git": true,
        "**/.svn": true,
    },
    "files.autoSave": "off", // off关闭自动保存 afterDelay自动保存  onWindowChange窗口失去焦点保存 onFocusChange编辑器失去焦点保存
    "vetur.format.defaultFormatter.html": "js-beautify-html", // vetur插件的相关配置
    "vetur.format.defaultFormatter.js": "vscode-typescript",
    "vetur.format.defaultFormatterOptions": {
        "js-beautify-html": {
            "wrap_line_length": 120,
            "wrap_attributes": "auto",
            "end_with_newline": false
        },
        "prettier": {
            "singleQuote": true,
            "printWidth": 120,
            "semi": false
        }
    },
    "vetur.format.options.tabSize": 4,
    "vetur.validation.template": false,
    "workbench.startupEditor": "newUntitledFile",//在没有从上一会话中恢复出信息的情况下，控制启动时显示的编辑器。
    "workbench.iconTheme": "vscode-great-icons", // 指定工作台使用的文件图标主题
    "workbench.tree.indent": 20,//控制树缩进(以像素为单位)。
    "[jsonc]": {
        "editor.defaultFormatter": "vscode.json-language-features"
    },
    "[javascript]": {
        "editor.defaultFormatter": "vscode.typescript-language-features"
    },
    "[json]": {
        "editor.defaultFormatter": "vscode.json-language-features"
    },
    "[vue]": {
        "editor.defaultFormatter": "octref.vetur"
    },
    "[html]": {
        "editor.defaultFormatter": "vscode.html-language-features"
    },
    
    "explorer.confirmDelete": false,//控制资源管理器是否应在通过回收站删除文件时要求确认。
    "javascript.updateImportsOnFileMove.enabled": "always",//启用或禁用在 VS Code 中重命名或移动文件时自动更新导入路径的功能。 always: 始终自动更新路径。
    "emmet.triggerExpansionOnTab": true,//启用后，在按 Tab 时会展开 Emmet 缩写，即使未显示完成。禁用后，仍可通过按 TAB 接受显示的完成。
    "security.workspace.trust.untrustedFiles": "open",//控制如何处理在受信任的工作区中打开不受信任的文件。此设置也适用于通过 `#security.workspace.trust.emptyWindow#" 打开的空窗口中的文件。open: 始终允许不受信任的文件引入受信任的工作区，而不显示提示。
    "terminal.integrated.defaultProfile.osx": "zsh",//在 macOS 上使用的默认配置文件。如果设置了 terminal.integrated.shell.osx 或 terminal.integrated.shellArgs.osx，则当前将忽略此设置。
    "diffEditor.ignoreTrimWhitespace": false,//启用后，差异编辑器将忽略前导空格或尾随空格中的更改
}
```
