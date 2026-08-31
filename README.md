# 传讯（二改版）— GitHub Pages 源码

这份项目已经从 APK 中提取并整理为普通静态网页，可以直接二改，也可以直接部署到 GitHub Pages。

## 项目结构

```text
├─ index.html                 页面结构
├─ css/
│  ├─ main.css               全局样式、聊天页和设置页
│  ├─ together.css           “在一起”模块
│  ├─ delivery.css           外卖模块
│  ├─ moments.css            朋友圈模块
│  ├─ quick-quiz.css         快问快答模块
│  ├─ journey.css            旅程模块
│  └─ confession.css         倾诉模块
├─ js/
│  ├─ app.js                 主程序、字卡和聊天逻辑
│  ├─ together.js            “在一起”模块
│  ├─ delivery.js            外卖模块
│  ├─ moments.js             朋友圈模块
│  ├─ typewriter.js          静室打字机模块
│  ├─ quick-quiz.js          快问快答模块
│  ├─ journey.js             旅程模块
│  └─ confession.js          倾诉模块
├─ assets/                   以后可放本地图片、音频和字体
└─ legacy/                   原 APK/HBuilder 配置，仅作备份
```

## 从哪里开始修改

- 修改页面文字或按钮结构：编辑 `index.html`。
- 修改颜色、尺寸、排版：先编辑对应的 `css` 文件。
- 修改字卡、聊天行为、导入导出：编辑 `js/app.js`。
- 修改某个高级功能：编辑与该功能同名的 CSS 和 JS 文件。

推荐使用 Visual Studio Code，并用“在文件中查找”搜索页面上现有的文字，能最快找到对应代码。

## 本地预览

Windows 可以双击 `start-local.bat`，然后访问：

`http://127.0.0.1:8000/`

也可以在项目目录运行：

```bash
python -m http.server 8000
```

不要长期直接双击 `index.html` 测试，一些浏览器功能在 `file://` 环境下会受限制。

## 部署到 GitHub Pages

1. 在 GitHub 新建一个公开仓库。
2. 把本压缩包内的文件和文件夹上传到仓库根目录。不要额外套一层文件夹。
3. 打开仓库的 `Settings` → `Pages`。
4. 在 `Build and deployment` 中选择 `Deploy from a branch`。
5. 分支选择 `main`，目录选择 `/ (root)`，点击 `Save`。
6. 等待一两分钟，GitHub 会在 Pages 页面显示网站地址。

## 说明

- 核心 CSS 和 JavaScript 已从原本约 4.3 万行的单个 HTML 中按功能拆分。
- 文件加载顺序与原 APK 保持一致。
- 页面仍通过网络加载 Google Fonts、Font Awesome、外部图片和音频。
- AI 与语音 API Key 由访问者自行填写并保存在其浏览器本地，源码中没有作者预置的 API Key。
- `legacy/hbuilder-manifest.json` 不是 GitHub Pages 必需文件，可以保留或删除。
