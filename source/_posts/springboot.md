---
title: springboot学习记录
date: 2026-11-08 14:32:27
tags: java
categories: java
---
<script type="text/javascript" src="/myblog/custom.js"></script>

本人13年毕业，做了三年的Java开发，后转战前端。目前又想把Java捡起来。
AI给我建议的学习路径，springboot--mybatis--构建restful api--理解微服务与springcloud--学习docker k8s
当年是SSH（struts spring hibernate），现在是springboot，据说中间有过ssm（springMVC mybatis）
有一定的Java基础，但是可能有一些知识点也是记不清了。目前计划先从Spring Boot开始着手。
# 先准备环境
## 安装java
当年的Java是1.6 1.7，现在得装17以上，因为springboot3要求17起步。JAVA从1.8开始就不这样命名了，成Java8了。9 10 11 17 25这几个版本是lts版，也就是长期维护版，其他版本是短期版，市场占有率不高，可以忽略。
oracle把sun公司收购以后，JDK从8开始有了收费版，尽管从 JDK 17 开始，Oracle JDK 采用了 Oracle 免费条款和条件（NFTC） 许可证，但考虑到许可条款可能会变化，Java 生态更普遍的做法是使用由第三方维护的、完全开源的 OpenJDK 构建版本。
所以需要装一个开源版本，
Eclipse Temurin 官方下载地址：https://adoptium.net/
OpenJDK 官方下载地址：https://jdk.java.net/archive/

### 下载openjdk压缩包，解压
把下载的 ZIP 包解压到你专门存放开发工具的路径下，注意选择没有中文和空格的目录，避免后续出现路径识别问题。
Windows: 例如 D:\Java\jdk-21 或 C:\Program Files\Java\jdk-21
macOS / Linux: 例如 /usr/local/jdk-21 或 ~/Java/jdk-21
下的时候看对版本，mac m芯片要下载Mac/AArch64
### 配置环境变量
Windows的忽略，教程太多。记录一下mac的方式，编辑~/.zshrc加入以下两行
```bash
export JAVA_HOME= ~/java/jdk-17.0.2.jdk/Contents/Home #/你的/解压/路径/jdk-21
export PATH=$JAVA_HOME/bin:$PATH
```
注意：在 macOS 上，如果 JDK 解压后是 .jdk 包的形式，JAVA_HOME 需要指向包内的 Contents/Home 目录。
保存文件后，执行 source ~/.zshrc（或对应的配置文件）让设置立即生效。

### 验证是否配置成功
```zsh
java -version
```

## 安装maven
Maven 是 Apache 软件基金会下的开源项目，基于 Apache License 2.0 协议发布，没有任何收费版本或付费功能。你可以自由地将其用于个人学习或商业项目。Maven类比前端npm。
但Maven 比 npm 管得更宽。 可以这样说：在“依赖管理”这件事上，Maven 很像 npm；但 Maven 同时还是一套“项目构建和生命周期管理工具”，这部分 npm 只做了一小部分。
Maven 的核心是“约定优于配置的项目模型 + 构建生命周期 + 插件体系”。它管的事情更多。
npm ≈ 包管理器 + 脚本运行器
Maven ≈ 包管理器 + 标准项目模型 + 构建生命周期 + 插件平台
### 下载安装包，解压到合适位置
官方下载页：https://maven.apache.org/download.cgi
Windows：下载 `apache-maven-<version>-bin.zip`
macOS / Linux：下载 `apache-maven-<version>-bin.tar.gz`
### 配置环境变量
依然只记录mac
```bash
export MAVEN_HOME=~/java/apache-maven-3.10.0  # /你的/解压/路径/apache-maven-3.9.9
export PATH=$MAVEN_HOME/bin:$PATH
```
保存后，执行 source ~/.zshrc（或对应的配置文件）让设置立即生效。
### 验证是否成功
```bash
mvn -v
```
### 修改配置
#### 依赖的下载路径
进入 Maven 目录下的 conf 文件夹，用文本编辑器打开 settings.xml，找到 `<localRepository>` 标签（可能在注释里），取消注释并填入你想要的路径，如
```bash
<localRepository>/Users/clausliang/java/apache-maven-3.10.0/repo</localRepository>
```
必须是全路径，~识别不了
不改的话就会把依赖的jar包装到默认路径`.m2/repository`
#### 在mirrors标签里添加阿里云镜像
配置国内镜像后，依赖下载速度可以提升5到10倍。
```bash
<mirrors>
    <!-- 阿里云公共仓库镜像 -->
    <mirror>
        <id>aliyunmaven</id>
        <name>阿里云公共仓库</name>
        <url>https://maven.aliyun.com/repository/public</url>
        <mirrorOf>central</mirrorOf>
    </mirror>
</mirrors>
```
这里的 `<mirrorOf>central</mirrorOf>` 表示这个镜像将替代Maven默认的中央仓库。
#### 统一JDK编译版本
有时候Maven默认会用较低的JDK版本（如1.5）编译项目，导致代码报错。你可以在 settings.xml 的 `<profiles>` 标签里配置全局JDK版本。
```
<profiles>
    <profile>
        <id>jdk-17</id>
        <activation>
            <activeByDefault>true</activeByDefault>
            <jdk>17</jdk>
        </activation>
        <properties>
            <maven.compiler.source>17</maven.compiler.source>
            <maven.compiler.target>17</maven.compiler.target>
            <maven.compiler.compilerVersion>17</maven.compiler.compilerVersion>
        </properties>
    </profile>
</profiles>
```
#### 私服
如果进入公司，需要连接公司内部的Maven私服（如Nexus），则需要在 `<servers>` 标签中配置用户名和密码进行认证。
```bash
# mirror
<mirror>
    <id>nexus</id>
    <name>Nexus Public</name>
    <url>xxxx</url>
    <mirrorOf>*</mirrorOf>
</mirror>

# 用户名密码
<servers>
	<server>
		<id>nexus</id>
		<username>claus</username>
		<password>xxx</password>
	</server>
	<server>
		<id>nexus-releases</id>
		<username>claus</username>
		<password>xxx</password>
	</server>
</server>
```
#### IDEA 虽然内置了 Maven，但为了和命令行环境保持一致，建议在 IDEA 中指向你独立安装的版本：
打开 IDEA 设置（Ctrl+Alt+S），搜索 Maven。
将 “Maven home path” 设置为你解压的 Maven 目录。

## 安装idea
官网下载最新版，然后想办法破解，或者不破解。最新版的idea免费部分已经支持创建springboot项目了。
创建springboot项目时，注意有个服务器url，可以改成阿里云https://start.aliyun.com ，原路径https://start.spring.io 可能访问较慢，下载不了依赖。