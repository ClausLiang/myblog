---
title: 鸿蒙app编译构建的配置文件解析（鸿蒙六）
date: 2024-12-04 15:30:40
tags: harmony
categories: harmony
---
<script type="text/javascript" src="/myblog/custom.js"></script>

# build-profile.json5
> build-profile.json5文件分为工程级与模块级，其中buildOption在工程级文件和模块级文件均可配置，其中相同字段以模块级的字段为准，不同字段模块级的buildOption配置会继承工程级配置。
为什么记录这个，是在开发中涉及到混淆配置，所以记录下
## 工程级

```json
{
  "app": {
    // 签名
    "signingConfigs": [
      {
        "name": "release",
        "type": "HarmonyOS",
        "material": {
          "storePassword": "...", // 密钥库密码
          "certpath": "./signature/release/fc_release.cer", // 证书路径
          "keyAlias": "beeselect", // 密钥别名
          "keyPassword": "xxx", // 密钥密码
          "profile": "./signature/release/fc_release.p7b", // 证书profile文件路径
          "signAlg": "SHA256withECDSA", // 密钥库signAlg参数
          "storeFile": "./signature/release/fc_release.p12" // 密钥库文件路径
        }
      },
    ],
    // 产品品类
    "products": [
      {
        // 产品的名称，必须存在name为"default"的product。
        "name": "default",
        // 产品的签名名称，即signingConfigs中配置的某个签名方案名称。
        "signingConfig": "release",
        // 兼容的最低SDK版本
        "compatibleSdkVersion": "5.0.0(12)",
        "runtimeOS": "HarmonyOS",
        // bundleType值为app，表示产物为应用；bundleType值为atomicService，表示产物为元服务。
        "bundleType": "app",
        // 产品的编译构建配置
        "buildOption": {
          // 严格模式
          "strictMode": {
            // 集成态HSP需要使用标准化的OHMUrl格式
            "useNormalizedOHMUrl": true
          }
        }
      }
    ],
    // 构建模式合集
    "buildModeSet": [
      {
        "name": "debug",
      },
      {
        "name": "release"
      }
    ]
  },
  "modules": [
    {
      // 模块名称
      "name": "entry",
      // 模块的源码路径
      "srcPath": "./entry",
      // 模块的target信息，用于定制多目标构建产物。
      "targets": [
        // target名称
        "name": "default",
        // target关联的product。HAR模块无需配置。
        "applyToProducts": [
          "default"
        ]
      ]
    },
    {
      "name": "test_lib",
      "srcPath": "./test_lib"
    },
  ]
}
```

## 模块级
```json
{
  // API模型类型，推荐stage模型
  "apiType": "stageMode",
  // 每一个target均可以指定产物命名。
  "targets": [
    {
      "name": "default",
      // 需要定义runtimeOS表示是运行于HarmonyOS还是OpenHarmony。
      "runtimeOS": "HarmonyOS",
      // 定制产品生成的应用包的配置
      "output": {
        // 自定义产品生成的应用包名称
        "artifactName": "beeselect_harmony"
      }
    }
  ],
  // 模块在构建过程中的相关配置
  "buildOption": {
    // ArkTS编译配置。
    "arkOptions": {
    }
  },
  // 构建配置集，其中name字段必填，每个配置都是当前支持的编译过程中所有可用工具的通用配置选项集。
  "buildOptionSet": [
    {
      "name": "release",
      "arkOptions": {
        // 混淆配置
        "obfuscation": {
          "ruleOptions": {
            // true表示进行混淆；false表示不进行混淆。
            "enable": true,
            "files": [
              // 混淆规则文件
              "./obfuscation-rules.txt"
            ]
          },
          // 仅HAR模块可配置，配置传递给集成方的混淆规则文件的相对路径
          // 为保证HAR模块可被正确集成使用，若有不希望被集成方混淆的内容，建议在规则文件中配置对应的保留选项，例如HAR模块中导出的变量或函数。
          // 规则文件中配置的混淆选项会与集成方的混淆规则进行合并，进而影响集成方的编译混淆，因此，建议仅配置保留选项。
          "cunsumerFiles": [
            "./consumer-rules.txt"
          ]
        }
      }
    }
  ]
}
```
