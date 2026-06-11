# 创建 Valaxy 博客

示例站点：https://daily.yybb.us

## 使用方法

```bash
# 安装依赖
npm i
# 或
pnpm i

# 启动开发服务器
npm run dev
# 或
pnpm dev
```

启动后访问：

```text
http://localhost:4859/
```

开始愉快地创作吧！

## 配置

修改 `valaxy.config.ts` 文件来自定义你的博客配置。

中文版与英文版文档正在完善中，敬请期待！

> 稍等一下，文档马上就来。

## Docker 部署

```bash
docker build . -t your-valaxy-blog-name:latest
```

## Netlify 部署

### 一键部署

1. 将项目推送到 GitHub。
2. 登录 Netlify。
3. 点击 **Add new site → Import an existing project**。
4. 选择你的 GitHub 仓库。
5. 配置构建参数：

```text
Build command: npm run build
Publish directory: dist
```

### 环境变量

在：

```text
Site settings → Environment variables
```

添加：

```text
WEBDAV_PASSWORD=你的密码
```

### 部署

点击 **Deploy site** 即可完成部署。

后续每次推送到 GitHub，Netlify 都会自动重新构建。

---

## Cloudflare Pages 部署

### 创建项目

1. 将项目推送到 GitHub。
2. 登录 Cloudflare Dashboard。
3. 进入：

```text
Workers & Pages → Create → Pages → Connect to Git
```

4. 选择你的 GitHub 仓库。

### 构建配置

填写：

```text
Framework preset: None
Build command: npm run build
Build output directory: dist
```

Node.js 版本建议：

```text
22
```

### 环境变量

在：

```text
Settings → Environment Variables
```

添加：

```text
WEBDAV_PASSWORD=你的密码
```

### 部署

点击 **Save and Deploy**。

Cloudflare Pages 会自动完成构建并生成访问地址：

```text
https://你的项目名.pages.dev
```

后续 GitHub Push 会自动触发重新部署。

---

## 项目结构

大多数情况下，你只需要关注 `pages` 文件夹即可。

### 主要目录

* `pages`：存放网站的所有页面

  * `posts`：在这里编写博客文章，文件会自动被识别为文章
* `styles`：覆盖主题样式，`index.scss`、`vars.css`、`index.css` 会自动加载
* `components`：自定义 Vue 组件（自动加载）
* `layouts`：自定义布局（在 Markdown 中通过 `layout: xxx` 使用）
* `locales`：自定义国际化（i18n）语言文件

### 其他目录与文件

* `.vscode`：推荐的 VS Code 插件与配置，可预览图标、国际化文本、CSS 类等内容
* `.github`：GitHub Actions 自动构建与部署到 GitHub Pages 的配置
* `netlify.toml`：Netlify 部署配置
* `vercel.json`：Vercel 部署配置
