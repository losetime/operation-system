# jwschain-op

## 介绍
```
该项目是奉天承运-运营管理系统

2021/3/10
该项目目前变为了多页面系统，包括pc端和移动端，移动端主要是钉钉微应用使用
```

## 相关技术

```
React.js
Antd
zarm（移动端UI框架 https://zarm.design/）
Axios
env-cmd
moment
react-app-rewired
redux
style-resources-loader

```

## 开发构建步骤

``` bash
# 全局安装 yarn
$ npm install yarn --global

# 依赖所有安装
$ yarn

# 开发模式
$ yarn dev

# 构建项目
$ yarn qa             // qa环境
$ yarn production     // 生产环境
```

## 依赖管理工具:

项目采用 yarn，附常用命令：

``` bash
# 依赖安装
$ yarn add xxx

# 依赖移除
$ yarn remove xxx
```

+ 开发流程：

### 项目规范

+ 未经商榷不准将任何依赖包添加进项目，以减少 dist 体积
+ 不可擅自修改项目配置
+ 请注意新建文件的行尾序列为CRLF，如果是LF会导致格式化出错

### 框架及代码规范

+ 命名要求全部采用 `camelCase`，且不能使用缩写，如：getBtnView(X)，getButtonView(√)。在异步请求的函数内的变量命名则无此要求，你们可以随意使用 `under_score_case`，方便构建请求载荷
+ 普通函数的命名请使用 `动 + 宾` 的格式，如：getCategory。事件回调函数请使用 `on + 目标对象 + 事件`，如 `onTimerChange`
+ 尽量写注释，特别是一些业务逻辑比较繁琐的流程，方便回顾的时候快速 get 到当时的想法
+ 异步请求函数请加上注释
+ 未完成的功能写好功能结构后要加上 `TODO` 标志，格式为 `// TODO: @小5 - 主题颜色变更`
+ CSS 样式命名请采用 `BEM` 规范

### 项目主要结构

``` bash
├── src  项目文件
│   ├── assets  静态资源
│   ├── componets 组件（新建文件夹请与views内业务页面文件夹相对应）
│   ├── enums 枚举，变量
|   ├── middleware 中间件
|   ├── mobile 移动端
|   ├── router  路由
|   ├── service http封装以及api
|   ├── store 状态管理相关
|   ├── style 组件样式
|   ├── types ts接口(除了api的types单独创建文件，其他文件的接口都放在这)
|   ├── utils 工具函数
|   ├── validator 表单验证
|   ├── views 业务页面
│   ├── App.vue 初始化入口vue文件
│   └── main.js 入口js文件
├── .env-cmdrc 全局环境变量
├── .prettierrc 代码格式化规范
├── config-overrides webpack相关配置
├── .eslint 强制语法要求
└── package.json 包管理
```
