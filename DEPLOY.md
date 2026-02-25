# 如何发布并安装到手机

**✅ 代码已成功上传到 GitHub：** [https://github.com/DADADAGTH/caiya-app](https://github.com/DADADAGTH/caiya-app)

现在，您只需要将这个代码仓库变成一个可以访问的网址（部署），然后就可以在手机上安装了。

---

## 第一步：生成手机访问链接（部署到 Vercel）

推荐使用 **Vercel**，它免费、速度快，且完美支持我们的 PWA（渐进式 Web 应用）功能。

1. **注册/登录 Vercel**
   - 访问 [Vercel.com](https://vercel.com/)。
   - 选择 **"Continue with GitHub"** 并登录您的 GitHub 账号。

2. **导入项目**
   - 在 Vercel 控制台点击 **"Add New..."** -> **"Project"**。
   - 在左侧列表中找到 `caiya-app` 仓库，点击 **"Import"**。

3. **开始部署**
   - 在配置页面直接点击底部的 **"Deploy"** 按钮（无需修改任何设置）。
   - 等待约 1 分钟，屏幕上会出现满屏的彩带庆祝动画，表示部署成功！
   - 点击 **"Continue to Dashboard"**，然后点击 **"Visit"**，您会获得一个类似 `https://caiya-app.vercel.app` 的网址。

---

## 第二步：在手机上安装（像 App 一样使用）

1. **发送链接到手机**
   - 将上面的 `https://...` 网址通过微信/QQ 发送给您的手机。

2. **iPhone 用户安装方法**
   - **必须使用 Safari 浏览器** 打开该链接。
   - 点击底部中间的 **分享按钮** <span style="border:1px solid #ccc;padding:0 4px;border-radius:4px">⎋</span>。
   - 向下滑动，找到并点击 **"添加到主屏幕"**。
   - 点击右上角的 **"添加"**。
   - 现在，您的桌面上会出现"财芽"图标，点击它就像原生 App 一样全屏运行！

3. **Android 用户安装方法**
   - **推荐使用 Chrome 浏览器** 打开该链接。
   - 点击右上角的 **菜单按钮** <span style="border:1px solid #ccc;padding:0 4px;border-radius:4px">⋮</span>。
   - 选择 **"安装应用"** 或 **"添加到主屏幕"**。
   - 确认安装即可。

---

## 常见问题

- **为什么找不到"添加到主屏幕"？**
  - 请确保您使用的是 **Safari (iOS)** 或 **Chrome (Android)**。微信内置浏览器通常不支持此功能，请点击右上角选择"在浏览器打开"。

- **以后更新了代码怎么办？**
  - 只要您在本地运行 `git push` 推送了代码，Vercel 会自动检测并重新部署。
  - 用户下次打开 App 时，会自动更新到最新版本（我们已经配置了自动更新功能）。
