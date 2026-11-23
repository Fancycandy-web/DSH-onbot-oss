# dsh-onebot

DeepSeek Harness（DSH）的 OneBot v11 适配器，把 QQ 小号接进 Agent：
消息从 QQ 进来，回复通过工具发回 QQ。支持 HTTP、正向和反向 WebSocket。

> **它不能单独跑，必须配合一个 OneBot v11 实现。** 本插件只负责「把 OneBot 事件喂给 Agent、把 Agent 的话发回 OneBot」，自己**不登录 QQ、不带协议实现**。常见底座有 NapCat、LLOneBot、Lagrange.OneBot 等，任选一个登录小号、开 WebSocket / HTTP，再把地址和 token 填进本插件即可。

## 接入端兼容性（先看这里）

核心聊天只走标准 OneBot v11，换实现不用改代码。下面这些能力是按 NapCat 的扩展接口写的，**其他实现不保证有**；调用时会明确报「不支持的 action / retcode 错误」，不会崩，也不会假装成功。

| 功能 | 依赖的动作 | 换用非 NapCat 实现 |
| --- | --- | --- |
| QQ 空间 `onebot_qzone`（列表 / 评论 / 回复 / 点赞） | `get_cookies` + 空间 CGI + `send_qzone_msg` / `delete_qzone_msg` | **不可用**，NapCat 专有 |
| 收藏表情 `onebot_save_sticker` / `onebot_sticker_list` | `add_custom_face` / `fetch_custom_face` | 多数实现没有 |
| 改头像 / 改资料 / 改签名 | `set_qq_avatar` / `set_qq_profile` / `set_self_longnick` | NapCat 专有 |
| 在线状态 / 自定义在线状态 / 输入状态 | `set_online_status` / `set_diy_online_status` / `set_input_status` | NapCat 专有 |
| 名片赞 / 表情回应 | `get_profile_like` / `set_msg_emoji_like` / `fetch_emoji_like` / `get_emoji_likes` | NapCat 专有 |
| 好友分组 / 单向好友 / 群资料扩展 / 群荣誉 / 精华 / 最近会话 | `get_friends_with_category` / `get_unidirectional_friend_list` / `get_group_info_ex` / `get_group_honor_info` / `get_essence_msg_list` / `get_recent_contact` | 多数实现没有 |
| 好友备注 | `set_friend_remark` | 常见扩展，多数实现有；标准里没有 |
| 好友/群消息历史 | `get_friend_msg_history` / `get_group_msg_history` | go-cqhttp 系多数有，标准里没有 |
| 单条消息、合并转发 | `get_msg` / `get_forward_msg` | 标准动作，换实现也有 |
| 戳一戳 | `friend_poke` / `group_poke` | 常见扩展，多数实现有；标准里没有 |
| 启动 / 守护 / 掉线收进程 / 启动日志打码 / WebUI 收 loopback | `napcat-launch.vbs` + NapCat 安装目录 | **仅 Windows + NapCat**；没配置 `onebot-napcat.json` 时整块不生效。注意「WebUI 收 loopback」会**就地改写** NapCat 的 `config/webui.json`（下次启动生效），不是只读加固 |
| 新表情自动补全 | 读 NapCat 的 `qface-*.js` | 没有就只用内置 275 项 |

不依赖上述扩展、换实现照常工作的：收发文字 / 图片 / 视频、@、引用、撤回、群白名单与静默、会话与本地日志、联网三件套、读本机文件、`onebot_authorize`。

**新增能力时，同步改三处**：本文件的「它会做什么」、`package.json` 的 `description`（插件详情页显示它）、`lib/index.js` 里对应的系统提示。

## 它会做什么

### 聊天

- 私聊：默认响应所有私信；只有 master（`masterIds` 里的号）能让它动手做事
- 群聊：必须 @ 它才回，且只回白名单里的群；群里没 @ 的消息也会记进当日流水
- 静默：master 在群里说「要干活了，停止回复」→ 该群静默（必须出现「要干活了」，且不能是「不要干活了」这类否定；后面 16 个字内命中「停止回复 / 静默 / 别回 / 不要回 / 闭嘴 / 禁言 / 别说话」任一即可）；说「解除 / 解除静默 / 恢复 / 恢复回复 / 干活去吧」→ 解除。群里这句只作用于当前群；私聊里说这句不会静默任何人，只会反问「要静默哪个群」，点名群名或群号才行
- 戳一戳：**一戳即应**。群里任何人戳它都回应（该群必须已放行且没被静默），私聊只响应 master。每次戳都会尝试回戳一下（同一个人 3 秒内、或全局 400 毫秒内不重复发），随后让模型说一句——同一个人在同一个群里 15 秒内再戳，只回戳、不重复开口（防双击头像和两边互戳的回声）
- 回复：`onebot_reply` 是唯一出口，支持文本、图片、引用卡片；群里别人插话 3 句以上时自动带引用
- 私聊节奏：等对方停下来满 5 秒再回，把这期间连着发的几条（含图/视频）合并成一轮，不会一句一句回，也降低风控；一直发就一直往后顺延，单条消息同样等满 5 秒。群聊 @ 仍然即时响应
- 群里只 @ 不说话也不会被忽略：纯 @ 会补一句「谁 @ 了你，没再说别的话」，模型照常接话

### 看图、看视频

- 别人发来的图片自动读取并附给模型；gif / 动态 webp 自动按时间抽帧；视频自动抽帧
- 图不在触发消息里也能看到，三种情况会自动补：
  - 对方**引用**了一条带图/带视频的消息 → 按引用 id 反查那条消息，图和文字一起附上
  - 群里刚发过、但**没 @ 小号**的图（这类消息整条会被接入控制丢掉）→ 记在按群分开的缓存里，小号下次在该群开口时补看，同一张只补一次
  - 刚发完视频再 @ 小号 → 缓存里补位抽帧（有图时优先图，避免上下文爆炸）
- 群流水里的图/视频记成 `[图片]` / `[动画表情]` / `[视频]` / `[语音]`，模型读历史时知道「这里有人发过图」，不会以为群里一直只有文字
- 图片太大或链接过期时降级成一句说明，整轮照常回复；不会因为一张图挂了就一句话都不回
- `onebot_view_image`：png / jpeg / webp / gif，一次最多 4 个文件，动图可指定抽 2-8 帧（默认 6）
- `onebot_view_video`：mp4 / mov / mkv / webm / avi / gif 等，默认抽 8 帧（最多 12，实际上限还受宿主单条消息图片上限约束），可指定起点和时长，单次最多看 180 秒。只有画面，没有声音

### 表情

- **发表情**：`onebot_reply` 的 `text` 里写 `[face:名字]`，发送时会变成真正的 QQ 表情（face 消息段），不是 `[表情]` 文字占位。可以和文字混排，例如 `行吧[face:捂脸]`
- 内置 275 个 QQ 小黄脸（微笑 / 呲牙 / 捂脸 / doge / 笑哭 / 玫瑰 / 抱拳 …），id 用的是 QQ 老表情编号（`QSid`），和 NapCat 表情面板同一份数据；名字写不出来时可以直接写数字 id，如 `[face:264]`
- 名字认不出**不会让整条消息失败**：该标记按原文字发出去，工具返回值里告诉模型哪个名字不对
- **NapCat 专属**：升级后新增的表情会自动跟上——优先读 `versions/*/resources/app/napcat/static/assets/qface-*.js`，读不到就用内置表；换实现只会用内置的 275 项
- **存表情（NapCat 扩展 `add_custom_face`）**：`onebot_save_sticker`（仅 master，默认 30 次/天）把最近收到的图存进「我的表情」——走的是 `add_custom_face` → `MsgApi.addFavEmoji`，和客户端右键「添加到表情」是同一个后端方法，不模拟点击。`index` 选第几张（1 = 最新），也可直接给 `url`。单张上限 **11 MB**（超了直接说太大，不硬试）
- **看收藏（NapCat 扩展 `fetch_custom_face`）**：`onebot_sticker_list`（仅 master）列收藏总数和前若干张图片地址，地址可以直接填进 `onebot_reply.images` 发出去
- 存表情要先落盘：`add_custom_face` 的 `file` 要本地路径，而聊天图只在内存里。临时文件按文件头判断 png / jpeg / gif / webp，存完即删；存失败会退还配额
- **不支持**超级表情 / 商城表情（`mface`）：它要服务端签发的 `key`，伪造不了。别人发来的可以原样转发
- Unicode emoji（😂👍）本来就跟着文本走，不需要任何处理

### 读本机文件

- **文件目录由 master 在插件设置里指定**（左栏 `OneBot` 页），小号只在这个目录及其子目录内活动，且**只能读、不能写**；用 realpath 解析，符号链接/junction 不能逃逸。没填目录时文件工具直接拒绝并提示去设置，不会回退到任何默认路径
- 目录填写有硬校验：必须是真实存在的绝对路径；盘符根、用户主目录及其上级、Windows / Program Files / ProgramData、回收站、任何层级出现 `.dsh` 的路径一律拒绝
- `onebot_list_dir`：列单层目录，目录在前，最多显示 200 项
- `onebot_read_file`：文本类扩展名，单文件上限 2 MB，超出 30000 字截断，GBK 自动回退
- 读图、看视频分别用上面两个工具，不是 read_file
- 写入目录（`writeRoot`）目前只是预留：当前版本没有任何向本机写文件的工具，配置它不会开启写能力，留空即可

### 联网

- `onebot_web_search`：搜网页，返回标题、链接、摘要。中文查询**同时打 Bing 与搜狗**、交替合并去重（每条注明来自哪家），纯英文只打 Bing，**不需要任何 API key**；同一句话 3 分钟内重复搜会复用上一次结果。某个源连续失败或被站点拒绝（403）会熔断十分钟，期间既不请求也不在结果里刷错误。中文多词查询如果被搜索站拆成单字（典型症状：搜「奶蛋 是什么梗」回来一堆「奶」的字典页），会自动把主词加引号重搜一次并注明
- `onebot_fetch`：打开一个网址，去掉标签后返回可读正文（标题 + 正文），默认 8000 字，用 `offset` 续读；HTML 按 `<meta>` / 响应头里的 charset 解码（GBK 站点不会变乱码），JSON 自动格式化
- 反爬处理：百度百科的词条链接自动走官方词条接口拿摘要（原站对无登录态的请求只返「百度安全验证」）；知乎、百度贴吧、小红书这类硬反爬站会明确回「拒绝访问」，不会把验证页当正文塞给模型
- `onebot_http_request`（仅 master）：直接发 GET / POST / PUT / PATCH / DELETE / HEAD，返回状态码、响应头和原始正文，用来查 API 或复现接口问题
- 出站默认只允许公网地址：字面 IP 必须是公网，域名必须经 DNS 解析且每个结果都是公网（`undici` 自定义 `lookup` 在 DNS 层拦），重定向每一跳重新校验。`127.0.0.1`、`localhost`、`192.168.x`、`169.254.169.254`、`.local` / `.internal` 一律拒绝——插件和 QQ 底座同机，放行等于把 NapCat 的 HTTP API 和 WebUI 交出去
- **唯一例外是 master 私聊那一轮**：这时本机与内网地址全部放行（`127.0.0.1`、`10.x`、`192.168.x` 等），方便 master 自己查内网服务；群聊和对已授权访客仍然只走公网，被挡的地址会明确回「非公网地址已拒绝」
- 只支持 http / https，不带账号密码；单次最多读 3 MB，超过就截断
- 配额：搜索 10 次/分，抓网页 20 次/分，HTTP 请求 20 次/分，可在设置页逐项调整；三项都设 0 等于断开联网
- 权限：搜索和抓取对 master + 已授权访客开放，HTTP 请求只对 master 开放

### 主动开口与 QQ 空间

> **QQ 空间这一整块依赖 NapCat 专有接口**（`get_cookies` + 空间 CGI + `send_qzone_msg` / `delete_qzone_msg`）。`onebot_say` 走标准私聊，不受影响。

- `onebot_say`（仅 master）：不等 master 先说话，主动发一条 QQ 私聊——汇报进展、提醒额度将尽、看到有意思的东西顺手说一句。收件人写死成 `masterIds` 的第一个号，参数里没有 `user_id`，模型没有办法指定别人；可带最多 3 张图。默认 6 条/天，发送失败会退还配额
- 主动搭话的时机（`onebot-runtime.json` 里的 `proactiveMinutes`，默认 120）：
  - 插件自己随机醒一次（实际间隔在设定值的 0.5–1.5 倍之间），给模型一段「自己的时间」，翻本机、刷 B 站、上网都行，看到好玩的就 `onebot_say`，没什么可说的就什么都不发
  - **全天都开口，不分昼夜**（master 作息乱，不按钟点拉闸）；master 在任何聊天里刚说过话的 5 分钟内不插嘴
  - **追一句**：上一条主动私聊过了 10 分钟还没人回，可以再发一条，**这条不占当天配额**；同一串最多免费追 3 条，之后要么等 master 开口，要么走正常配额。追话只在 2 小时内成立——隔夜那句不算追，按新的一句走正常额度
  - 设置页改完间隔**当场重排**，不用重启（日志里有 `[say] re-armed`）
  - 填 0 关闭主动搭话，`onebot_say` 只在对话里可以手动用
- `onebot_qzone`（仅 master）：只看、只互动 **master 本人**的说说，没有「看谁的」这个参数
  - `action=list`：拉最近 1–10 条（时间、正文、配图张数、评论区默认最近 **6 条主评论**、楼中楼的回复跟在各自的主评论下面，标出哪句是 master、哪句是自己）。每条评论后面带 `c=`（评论在说说内的序号）和 `u=`（作者 QQ），`action=reply` 就是靠这两个定位。主评论更多时输出会写「另外 N 条也在手上」，要看全给 `comments=20`。最新一条的配图会下载并作为画面附进对话——模型是真的看见图再开口，不是照着文字脑补
  - 评论区是**完整**的：列表接口的 `num` 同时也是「每条说说最多回几条评论」，按说说条数传会把评论截成最旧的前几条（看起来像「陌生人的评论时有时无」）。现在凡是需要评论的调用（list / comment / reply / 巡检）都固定多要 25 条再截回；`photos` 和 `like` 不看评论，就按原条数拉，省一半流量。`cmtnum` 比拿到的多时还会补一次详情接口（一次最多补 3 条）；真补不到会在输出里写「接口只给到 N/M 条」，不假装全看到
  - 注意区分两种「看不到」：**接口没给**（写「只给到 N/M 条」）和**拿到了但没列出来**（写「另外 N 条也在手上」）。后者加 `comments` 就能看到，别当成回不了。`comments` 调大时，每条主评论下面留的回复会自动从 8 条收紧到 3–2 条，免得 5 条说说撑出几万字符；被收掉的回复会写「更早的 N 条回复没列」，真要回其中的人直接给昵称也能定位
  - `action=photos`：单独看某条说说的配图
  - `action=comment`：给某条说说写一条**新的顶层评论**，**同时给这条点一个赞**。发之前会重新拉列表核对 `tid` 确实属于 master 的最近 10 条；接口没回可判断结果时只说「不确定」，不说「已评论」
  - `action=reply`：**回复评论区里某条具体的评论**，挂在那条评论下面并 `@` 那个人——这才是「回应别人说的话」，不会在说说下面另起一条。参数用 `tid` + `commentId`（列表里的 `c=`）+ `text`，想定点回某一串里的某个人再加 `uin`（`u=` 或昵称）
  - 评论规矩：同一条最多来回 3 句；第二条起必须**有人**（master 或别人）先接你的话，否则直接拒绝——评论区来回不算刷屏，自说自话才算。回复同一个人时，他之后没再说话就不重复回
  - 同一时刻同一条只允许一个评论 / 回复在飞（进程内锁）。私聊让它评论和巡检同时判定「还没评过」时，第二条会被挡下
  - `action=like`：只点赞，不评论。同样先核对 `tid` 属于 master
  - 凭据走 NapCat 的 `get_cookies`（cookie 串 + bkn）。那份 cookie 只在插件内部流动，不进日志、不进工具返回值、也不进错误信息
  - 默认评论 5 条/天、点赞 20 个/天：空间评论比发说说更容易触发风控，配额给得比 `qzonePerDay` 还小；点赞是幂等的、风控轻，给得宽松些
  - 点赞接口回的是 HTML 壳子里的 `{"ret":0,"msg":"succ"}`，抠不出结构就只说「不确定」；重复点同一条也回 `succ`，所以文案只说「赞了」，不说「新增一个赞」
  - 依赖 NapCat 的 `get_cookies`。底座不支持、或小号不在登录态时，工具会直接说明拿不到凭据，不会假装看到了
- **空间巡检**（`onebot-runtime.json` 里的 `qzonePollMinutes`，默认 60，0 = 关闭）
  - 每隔这么久拉一次 master 的说说列表（10 条），比对 `tid`。**没新东西就只花一次 HTTP，不醒模型、不耗 token**
  - 只有三种情况会叫醒模型：master 发了新说说（一天内的）、master 在它评过的那条下面又说了话、**别人（不是 master）在评论区回复了它**（`@` 了它，或者挂在它那条评论下面）。最后一类醒来后会用 `action=reply` 挂在那个人的评论下面接话，不会另起一条
  - **全天，不分昼夜**。评论区不是私聊，半夜回一句不算吵人
  - 同一拍最多叫一次，一天最多 12 次；master 刚在任何地方说过话的 2 分钟内先让路
  - 手动评论 / 点赞过的那条会记成「已处理」（`onebot-state.json` 的 `qzone.feeds[tid]`），巡检看到就跳过——**私聊让它评论和巡检不会重复评论**
  - 第一次跑只记基线，不会把手上十条老说说当成十条新动态一起评
  - 设置页改完当场重排，不用重启（日志里有 `[qzone] re-armed`）
  - 为什么不用 QQ 官方的「特别关注」提醒：实测两次，主号发完说说，机器人这边 `message` / `notice` / `request` 三类事件一条都没来。NapCat 只把消息层翻译成 OneBot 事件，空间提醒不在那一层，再强的提醒也变不成事件

### QQ 动作（`onebot_call`，白名单 33 项）

> 下面标了 NapCat 的条目是扩展动作，换实现时按上面的兼容性表处理；工具会把「不支持的 action」原样报错，不会崩，也不会假装做成。

- 只读 17 项（master + 已授权）：账号/版本/状态、好友列表与分组、陌生人资料、单向好友、群列表/群信息/群成员列表/群成员资料、资料赞、精华消息、群荣誉、表情回应（好友分组、单向好友、群资料扩展、资料赞、精华、群荣誉、表情回应是 NapCat 扩展）
- 私密 5 项（仅 master）：好友消息历史、群消息历史、单条消息、合并转发、最近会话（消息历史与最近会话是 go-cqhttp / NapCat 扩展）
- 写 11 项（仅 master）：发说说、删说说、改头像、改资料、改签名、在线状态、自定义在线状态、好友备注、表情回应、输入状态、收藏表情（`add_custom_face`，要本地路径，通常应该直接用 `onebot_save_sticker`；除发/删说说、好友备注外基本都是 NapCat 扩展）
- 配额默认：发说说 2 条/天；主动私聊 master 6 条/天；评论 master 的说说 5 条/天、点赞 20 个/天；存表情 30 次/天；改头像、改资料、改签名各终身一次；删说说/表情回应/输入状态 10 次/分；在线状态 2 次/分；好友备注 10 次/天；联网搜索 10 次/分、抓网页与 HTTP 请求各 20 次/分；其余默认 60 次/分。调用失败会退还配额，一次性动作不退
- 除一次性动作外，各项配额都能在插件设置里逐项调整（填 0 等于禁用该动作）。改配额不会退还已经用掉的次数；一次性动作的三项固定不可改，这是防止模型反复改人设的唯一闸门

### 群管理

- `onebot_group_access` 仅 master：`list` 查看、`add`/`remove` 增删群号、`mode` 切 `allowlist` / `blocklist` / `disabled`
- 改动写进 `cordis.patch.yml` 并立即生效，不需要重启 DSH；改完会等连接重连完成再返回
- `onebot_group_mute` 仅 master：`list` 看现在静默了哪些群，`mute` / `unmute` 配 `group`（群号或群名）开关某一个群。静默只影响那一个群——不回该群任何人（含 master；master 自己在群里说「解除静默」这类口令除外，否则就永远解不开），私聊和其他群照常；写自己的状态文件，立即生效、重启后仍在，也不会断开 OneBot 连接
- 只想让某个群安静一会儿就用 `onebot_group_mute`，别用 `onebot_group_access`：后者是把整群踢出白名单，连记录和戳一戳一起停掉
- 群里能不能戳它，同样受白名单和静默约束，戳不能绕过接入控制

### 会话与记录

- 私聊按人隔离，群聊群内共享上下文；同一会话当天内续接
- 群流水落盘到 `group-log/<群号>/<YYYY-MM-DD>.md`，回复时自动注入最近 30 条作为背景
- 聊天日志落盘到 `chat-log/`，master 可用 `onebot_recall` 按日期或关键词检索

### 掉线处理（可选，仅 Windows + NapCat；没有 NapCat 时整节不生效）

- 这套托管默认关闭：`onebot-napcat.json` 或环境变量 `DSH_NAPCAT_LAUNCHER` 指向 `napcat-launch.vbs` 才会启用；没配置时插件只做普通 OneBot 连接
- NapCat 独立进程保活，DSH 重启不会带走 QQ 登录
- **DSH 启动时不会自动拉起 NapCat**：需要它起来时，到 **设置 → OneBot** 点「启动 NapCat」——用保存的账号快速登录，启动器约 30 秒后端口才就绪，按钮会自己轮询状态并显示「已在线 / 未运行 / 启动中」。登录态被踢之后仍然要人扫码
- **掉线不会自动重启，也不会重试登录**：`[KickedOffLine]` 是腾讯服务端踢下线（风控 / 别处登录），自动重登只会不停回落到二维码，既空转又给风控加分。判定掉线后只做两件事——提醒 master，以及结束 `NAPCAT_DIR` 下的空转进程，等人扫码（扫之前先点一次设置页的「启动 NapCat」）。进程名同为 `QQ.exe` 的主号一个不碰，按可执行文件路径区分
- 区分两种死法：端口 / `get_login_info` 都不通 = 掉线，执行上面的提醒 + 收进程；端口还在、登录态还在但收发全断（通道探测）= 只提醒，**不动进程**——登录态可能还活着，强杀等于把可恢复故障变成必须扫码
- 前提：这次 DSH 运行里得先见过它在线。从没起来过就只是「还没点按钮」，不报警；点过按钮却一直没就绪（多半停在扫码页）会单独提醒一次，但不收进程
- 掉线时两条提醒：Windows 桌面通知（短句）+ 给 `masterIds` 第一个号发私聊（完整说明）；`masterIds` 为空时只发桌面通知
- 心跳守护脚本 `napcat-guard.vbs`：心跳 300 秒没更新才关闭无头 QQ，避免重启 DSH 时误杀
- 通道探测（`onebot-runtime.json` 里的 `channelProbeMinutes`，默认 15）：QQ 客户端会有一种「进程还在、端口还在、状态还报在线，账号其实已收发全断」的静默掉线，端口探测和 `get_login_info` 都看不出，只有真发一条消息才暴露。静默超过设定分钟数后，插件会发一条消息给自己再撤回，连续两次报「网络连接异常」就按掉线处理——只提醒、不动进程；填 0 关闭探测

### 权限

| 角色 | 判定 | 能用的工具 |
| --- | --- | --- |
| MASTER | `masterIds` 里的号 | 全部 17 个 |
| GRANTED | master 用 `onebot_authorize` 临时授权（默认 120 分，上限 1440） | reply、call 只读、list_dir、read_file、view_image、view_video、web_search、fetch |
| GUEST | 其他所有人 | 只有 `onebot_reply`，纯聊天 |

- 受保护账号：`masterIds` 里的号，加上小号自己（收到第一个事件后自动纳入）。任何动作的参数里出现它们都会被直接拒绝
- 工具白名单与角色检查在每次派发时实时执行，不依赖提示词自觉

## Transport

- `forward-ws`（默认）：连接 OneBot 正向 WebSocket，事件和 action 共用连接
- `reverse-ws`：监听 WebSocket，等待 OneBot 反向连接
- `http`：以 `url` 调用标准 HTTP API，同时在配置的监听地址提供 HTTP POST webhook

四种标准 `post_type` 是 `message`、`notice`、`request`、`meta_event`；消息进入 Agent，notice 里只处理戳一戳。

## 安装

### 第一步：准备一个 OneBot v11 实现（以 NapCat 为例）

> LLOneBot、Lagrange.OneBot 等也可以：只要它能开正向 WebSocket（或反向 WS / HTTP）并设置 access token，把地址换成它的即可。QQ 空间、收藏表情、改资料等 NapCat 专属能力会不可用，见上面的兼容性表。

插件本身不登录 QQ。完整链路是：

```
QQ 小号  ←→  OneBot v11 实现（NapCat / LLOneBot / Lagrange …）  ←→  dsh-onebot  ←→  DSH Agent
```

1. 装 [NapCat](https://github.com/NapNeko/NapCatQQ)，用它登录**小号**（不是主号）。小号只是收发的那个号，不用填进插件
2. 在 NapCat 的「网络配置」里加一个 **WebSocket 服务器**（正向 WS）：
   - 插件和 NapCat 在同一台机器上时，监听地址填 `127.0.0.1`、端口 `3001` 就够；只有要跨机器连才需要 `0.0.0.0`
   - **一定要设 Token**（对应插件的 `accessToken`）。监听 `0.0.0.0` 又不设 Token，等于把 QQ 的控制权交给整个局域网
3. 记下端口和 Token，下一步要用

> NapCat 与插件一般跑在同一台机器上，所以默认 `ws://127.0.0.1:3001` 就够。插件里的 `onebot_http_request` 在群聊和非 master 会话里会**主动拒绝** `127.0.0.1` / `192.168.*` 这类内网地址，避免群友借它碰到 NapCat 的 HTTP API 和 WebUI；**master 私聊那一轮是例外**（方便你自己查内网服务）。这是有意为之，不是配置错误。

### 第二步：装插件

从 1.4.0 起要求 DSH `^0.2.1-rc.2`。桌面版：

```bash
dsh plugin --profile desktop add dsh-onebot
```

### 第三步：填连接参数

在 **设置 → 内置插件 → OneBot** 里填三样：

- `url`：`ws://127.0.0.1:3001`
- `accessTokenRef`：默认 `ONEBOT_ACCESS_TOKEN`。注意这是**凭据名**，不是 token 本身——要去 DSH 的凭据管理里建一条同名凭据，值填 NapCat 里设的那个 Token
- `masterIds`：你自己的 QQ 号（主号），每行一个

### 第四步：验证

保存后插件会重连几秒，NapCat 面板里「已连接的客户端数」这时应该变成 1，就说明通了；之后 `onebot-debug.log` 里出现 `[receive]` 行表示消息确实进来了。

## 配置

设置分两处，职责不同：

- **总开关**：插件列表里的 OneBot 开关（运行中 / 已停用）。关掉即整体停用，消息不再进来
- **设置 → OneBot**（左栏独立页）：能力描述 + 文件目录 + 写动作配额 + NapCat 启动按钮。改完立即生效，不断连接
- **设置 → 内置插件 → OneBot**：连接参数（传输方式、地址、令牌、回复开关、访问名单）。保存会重建插件并重连几秒

| 字段                | 默认值                  | 说明                                 |
| ------------------- | ----------------------- | ------------------------------------ |
| `transport`         | `forward-ws`            | `forward-ws`、`reverse-ws` 或 `http` |
| `url`               | `ws://127.0.0.1:3001`   | 正向 WS 地址或 HTTP API base URL     |
| `listenHost`        | `127.0.0.1`             | 反向 WS / webhook 监听地址           |
| `listenPort`        | `3002`                  | 监听端口                             |
| `listenPath`        | `/onebot`               | 监听路径                             |
| `accessTokenRef`    | `ONEBOT_ACCESS_TOKEN`   | 访问令牌的 DSH credential ref        |
| `webhookSecretRef`  | `ONEBOT_WEBHOOK_SECRET` | webhook secret 的 DSH credential ref |
| `reconnectInterval` | `5000`                  | 重连间隔（毫秒）                     |
| `requestTimeout`    | `30000`                 | action 请求超时（毫秒）              |
| `heartbeatTimeout`  | `120000`                | 心跳超时（毫秒），`0` 禁用           |
| `commandPrefix`     | 空                      | 非空时要求此前缀，并从 prompt 移除   |
| `cwd`               | 空                      | 会话工作目录与 `AGENTS.local.md` 落点；空 = DSH 进程当前目录（仅配置文件可改，界面不提供） |
| `respondToPrivate`  | `true`                  | 响应私聊                             |
| `respondToGroup`    | `true`                  | 响应群聊                             |
| `groupMentionOnly`  | `true`                  | 群聊要求提及机器人                   |
| `userAccessMode`    | `disabled`              | `disabled`、`allowlist`、`blocklist` |
| `userIds`           | `[]`                    | 用户 ID 列表                         |
| `masterIds`         | `[]`                    | 主号 QQ 列表，界面里每行一个；第一个号也接收掉线私聊 |
| `groupAccessMode`   | `disabled`              | `disabled`、`allowlist`、`blocklist` |
| `groupIds`          | `[]`                    | 群 ID 列表                           |

数组在设置 UI 中每行一个 ID，保存时去空白并且去重。token/secret 存入 DSH credentials，配置只保存引用名称。

设置通过 DSH Loader 的 volatile 配置实时生效，保存后重连传输，不重建已有 Agent 会话。也可用本地接口读写：`POST /onebot/api/get`、`POST /onebot/api/set`（DSH webServer 的动态端口）。

**目录与配额不在这份配置里**。它们存在插件目录下的 `onebot-runtime.json`，通过 `POST /onebot/api/runtime/get`、`POST /onebot/api/runtime/set` 读写，在设置左栏的 `OneBot` 页里编辑（连接参数仍在「内置插件 → OneBot」卡片）。分开的理由：连接类字段一旦保存就会重建插件、断开 OneBot 几秒，而目录和配额是会被反复调的东西；走独立文件后改完下一次工具调用就生效，不断连接，也不会被换 profile 或重装插件冲掉。

```json
{
  "readRoot": "D:\\你的目录",
  "writeRoot": "",
  "channelProbeMinutes": 15,
  "proactiveMinutes": 120,
  "qzonePollMinutes": 60,
  "budgets": {
    "qzonePerDay": 2,
    "sayPerDay": 6,
    "qzoneCommentPerDay": 5,
    "qzoneLikePerDay": 20,
    "friendRemarkPerDay": 10,
    "customFacePerDay": 30,
    "deleteQzonePerMinute": 10,
    "emojiLikePerMinute": 10,
    "inputStatusPerMinute": 10,
    "onlineStatusPerMinute": 2,
    "diyOnlineStatusPerMinute": 2,
    "webSearchPerMinute": 10,
    "webFetchPerMinute": 20,
    "webHttpPerMinute": 20,
    "defaultPerMinute": 60
  }
}
```

### 本地文件（不进仓库）

| 文件 | 作用 |
| --- | --- |
| `onebot-runtime.json` | 文件目录 + 动作配额（含联网三项）+ 主动搭话间隔 + 空间巡检间隔；缺失时目录为空、其余用默认值 |
| `onebot-napcat.json` | NapCat 启动器路径，设置页的「启动 NapCat」按钮要用；也可用 `DSH_NAPCAT_LAUNCHER` |
| `onebot-state.json` / `onebot-limits.json` | 会话续接状态、配额用量，运行时自动生成 |
| `onebot-debug.log` / `.log.1` | 诊断日志（NapCat 启动、掉线探测、收到的消息、戳一戳、工具范围）。超过 2 MB 自动轮转成 `.log.1`，只留一份历史，不会无限长 |
| `chat-log/` / `group-log/` | 聊天与群流水，供 `onebot_recall` 检索 |
| `vendor/` | 自带的 ffmpeg，不随源码分发；查找顺序是 `DSH_FFMPEG` → `vendor/` → PATH |

仓库里不含以上任何文件，也不含账号、群号、目录路径。

## 开发

本目录是构建产物（`lib/` 由上游源码用 rolldown 打包），不含 `src/` 和测试目录：
直接改 `lib/`，用 `node --check lib/index.js` 做语法校验，再重启 DSH 验证。
`yarn build` / `yarn test` 只在完整源码仓库里可用。

许可证：MPL-2.0
