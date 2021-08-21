# Ninja

一次对于 koa2 vue3 vite 的简单尝试

## 说明

Ninja 仅供学习参考使用，请于下载后的 24 小时内删除，本人不对使用过程中出现的任何问题负责，包括但不限于 `数据丢失` `数据泄露`。

Ninja 仅支持 qinglong 2.8+

必要声明:
本文中涉及的部署方法或者链接，仅用于测试和学习研究，禁止用于商业用途，不能保证其合法性，准确性，完整性和有效性，请根据情况自行判断.
所有使用者在使用本程序的任何部分时，需先遵守法律法规。对于一切使用不当所造成的后果，须自行承担对任何脚本或有关部署教程的问题概不负责，包括但不限于由任何教程/程序或者脚本错误导致的任何损失或损害.
间接使用本教程的任何用户，包括但不限于建立VPS或在某些行为违反国家/地区法律或相关法规的情况下进行传播, 本人对于由此引起的任何隐私泄漏或其他后果概不负责.
如果任何单位或个人认为该教程可能涉嫌侵犯其权利，则应及时通知并提供身份证明，所有权证明，我们将在收到认证文件后删除相关内容.
文中用到的脚本和部署方法来源于互联网，并非本人撰写，本人仅撰写了部分代码和教程，如果有侵犯脚本开发者或者其他人的权利，请联系作者删除！谢谢！
任何以任何方式查看此教程的人或直接或间接使用该教程的任何内容的使用者都应仔细阅读此声明。本人保留随时更改或补充此免责声明的权利。一旦使用并复制了任何相关与本程序有关内容，则视为您已接受此免责声明.
您必须在下载后的24小时内从计算机或手机中完全删除以上内容.

您使用或者复制了本文任何相关内容，则视为已接受此声明，请仔细阅读

[TG 频道](https://t.me/joinchat/sHKuteb_lfdjNmZl)

## 特性

- [x] 扫码，跳转登录添加/更新 cookie
- [x] 添加/更新 cookie 后发送通知
- [x] 扫码发送通知可关闭
- [x] 添加备注并将通知中的 pt_pin nickName 修改为备注
- [x] 默认备注为昵称
- [x] 添加扫码推送卡片
- [ ] 替换 cookie 失效通知
- [ ] 登录界面展示自定义标语
- [ ] 支持多容器，多面板
- [ ] 采用自己的数据库，实现无视面板替换通知备注
- [ ] 账号管理面板

## 文档

### 容器内

1. 容器映射 5701 端口，ninja 目录至宿主机

   例（docker-compose）：

   ```diff
   version: "3"
   services:
     qinglong:
       image: whyour/qinglong:latest
       container_name: qinglong
       restart: unless-stopped
       tty: true
       ports:
         - 5700:5700
   +      - 5701:5701
       environment:
         - ENABLE_HANGUP=true
         - ENABLE_WEB_PANEL=true
       volumes:
         - ./config:/ql/config
         - ./log:/ql/log
         - ./db:/ql/db
         - ./repo:/ql/repo
         - ./raw:/ql/raw
         - ./scripts:/ql/scripts
         - ./jbot:/ql/jbot
   +      - ./ninja:/ql/ninja
   ```

   例（docker-run）：

   ```diff
   docker run -dit \
     -v $PWD/ql/config:/ql/config \
     -v $PWD/ql/log:/ql/log \
     -v $PWD/ql/db:/ql/db \
     -v $PWD/ql/repo:/ql/repo \
     -v $PWD/ql/raw:/ql/raw \
     -v $PWD/ql/scripts:/ql/scripts \
     -v $PWD/ql/jbot:/ql/jbot \
   + -v $PWD/ql/ninja:/ql/ninja \
     -p 5700:5700 \
   + -p 5701:5701 \
     --name qinglong \
     --hostname qinglong \
     --restart unless-stopped \
     whyour/qinglong:latest
   ```

2. 进容器内执行以下命令

   **进容器内执行以下命令**

   ```bash
   git clone https://github.com/MoonBegonia/ninja.git /ql/ninja
   cd /ql/ninja/backend
   pnpm install
   pm2 start
   cp sendNotify.js /ql/scripts/sendNotify.js
   ```

3. 将以下内容粘贴到 `extra.sh`（重启后自动更新并启动 Ninja）

   ```bash
   cd /ql/ninja/backend
   git checkout .
   git pull
   pnpm install
   pm2 start
   cp sendNotify.js /ql/scripts/sendNotify.js
   ```

### 容器外

此种方式需要宿主机安装 `node` `pnpm` 等环境，不做过多介绍。

使用此种方法无法跟随青龙一起启动，**无法发送扫码通知**，请知悉。

```bash
git clone git clone https://github.com/MoonBegonia/ninja.git
cd ninja/backend
pnpm install
# 复制 sendNotify.js 到容器内 scripts 目录，`qinglong` 为容器名
sudo docker cp sendNotify.js qinglong:/ql/scripts/sendNotify.js
cp .env.example .env
# 修改env文件
vi .env
node app.js
```

在 `.env` 文件中添加以下内容：

```bash
QL_DIR=qinglong 容器的本地路径
QL_URL=http://localhost:5700
```

`node app.js` 想要在后台运行可以使用 `&` `nohup` `screen` 等命令。

### Ninja 环境变量

目前支持的环境变量有：

- `ALLOW_ADD`: 是否允许添加账号 不允许添加时则只允许已有账号登录（默认 `true`）
- `ALLOW_NUM`: 允许添加账号的最大数量（默认 `40`）
- `NINJA_PORT`: Ninja 运行端口（默认 `5701`）
- `NINJA_NOTIFY`: 是否开启通知功能（默认 `true`）
- `NINJA_UA`: 自定义 UA，默认为随机

配置方式：

```bash
cd /ql/ninja/backend
cp .env.example .env
vi .env
pm2 start
```

**修改完成后需要 `pm2 start` 重启生效 ！！！**

### SendNotify 环境变量

**此环境变量在青龙中配置！！！**

- `NOTIFY_SKIP_LIST`: 通知黑名单，使用 `&` 分隔，例如 `东东乐园&东东萌宠`;

### Ninja 自定义

自定义推送二维码：将 `push.jpg` 文件添加到 `/ql/ninja/backend/static/` 目录下刷新网页即可。

自定义常见活动：修改 `/ql/backend/static/activity.json` 即可

## 注意事项

- 重启后务必执行一次 `ql extra` 保证 Ninja 配置成功。

- 更新 Ninja 只需要在**容器**中 `ninja/backend` 目录执行 `git pull` 然后 `pm2 start`

- Qinglong 需要在登录状态（`auth.json` 中有 token）

## 常见问题

Q：为什么我 `git pull` 失败？  
A：一般是修改过文件，先运行一次 `git checkout .` 再 `git pull`。还是不行就删了重拉。

Q：为什么访问不了？  
A：一般为端口映射错误/失败，请自行检查配置文件。

Q：为什么访问白屏？  
A：使用现代的浏览器，而不是古代的。
