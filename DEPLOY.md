# 如何发布并安装到手机

## 1. 上传代码到 GitHub

由于我无法直接访问您的 GitHub 账户，请按以下步骤操作：

1. 登录 [GitHub](https://github.com/)，点击右上角的 **+** 号，选择 **New repository**。
2. 输入仓库名称（例如 `caiya-app`），选择 **Public**（公开）或 **Private**（私有），然后点击 **Create repository**。
3. 在创建完成的页面中，找到 **"…or push an existing repository from the command line"** 这一栏。
4. 复制那段代码，它看起来像这样（请使用您自己的 URL）：

```bash
git remote add origin https://github.com/您的用户名/caiya-app.git
git branch -M main
git push -u origin main
```

5. 在 VS Code 的终端中粘贴并运行上述命令。

---

## 2. 生成手机安装链接（推荐使用 Vercel）

代码上传到 GitHub 后，需要部署成网站才能在手机上安装。推荐使用 **Vercel**（免费、速度快、支持 PWA）。

1. 访问 [Vercel](https://vercel.com/) 并使用 GitHub 账号登录。
2. 点击 **Add New...** -> **Project**。
3. 在列表里找到刚才上传的 `caiya-app`，点击 **Import**。
4. 在配置页面直接点击 **Deploy**（无需修改任何设置）。
5. 等待约 1 分钟，部署完成后，您会获得一个类似 `https://caiya-app.vercel.app` 的域名。

## 3. 在手机上安装

1. **复制域名**：将获得的 `https://...` 链接发送到手机（微信/QQ）。
2. **iPhone 用户**：
   - 使用 **Safari 浏览器** 打开链接。
   - 点击底部中间的 **分享按钮**。
   - 下滑找到 **"添加到主屏幕"**。
3. **Android 用户**：
   - 使用 **Chrome 浏览器** 打开链接。
   - 点击右上角菜单，选择 **"安装应用"** 或 **"添加到主屏幕"**。

这样，您的手机桌面上就会出现财芽的图标，打开后就像原生 App 一样使用！
