//#region src/client.tsx
window.__ModuleLoader__.load({
	id: "dsh-onebot",
	factory: (require) => {
		const React = require("react");
		const { Button, IconCheckOutline16, IconChevronDownOutline14, Menu } = require("@deepseek-ai/dsh-client-ui-primitives");
		const h = React.createElement;
		const NS = "onebot.settings";
		const ENDPOINT = "/onebot/api";
		const zh = {
			title: "OneBot",
			description: "配置 OneBot v11 连接、消息回复与访问范围。",
			expand: "展开设置",
			collapse: "收起设置",
			loading: "正在加载设置…",
			retry: "重试",
			save: "保存",
			saving: "保存中…",
			discard: "放弃修改",
			unavailable: "无法加载 OneBot 设置，请检查连接后重试。",
			readOnly: "本部署的设置为只读。",
			saveFailed: "设置保存失败，请检查字段后重试。",
			invalid: "请输入有效值。",
			transport: "连接模式",
			transportHint: "选择正向 WebSocket、反向 WebSocket 或 HTTP Webhook。",
			transportForwardWs: "正向 WebSocket",
			transportReverseWs: "反向 WebSocket",
			transportHttp: "HTTP Webhook",
			url: "WebSocket 地址",
			urlHint: "正向模式连接的 OneBot WebSocket 地址。",
			listenHost: "监听地址",
			listenHostHint: "反向 WebSocket 或 HTTP 模式的监听地址。",
			listenPort: "监听端口",
			listenPortHint: "反向 WebSocket 或 HTTP 服务端口。",
			listenPath: "监听路径",
			listenPathHint: "反向 WebSocket 或 HTTP 请求路径。",
			accessTokenRef: "访问令牌凭据引用名",
			accessTokenRefHint: "仅编辑 DSH 凭据引用名；令牌不会显示或传输到浏览器。",
			webhookSecretRef: "Webhook 密钥凭据引用名",
			webhookSecretRefHint: "仅编辑 DSH 凭据引用名；密钥不会显示或传输到浏览器。",
			reconnectInterval: "重连间隔（毫秒）",
			reconnectIntervalHint: "正向连接断开后的等待时间。",
			requestTimeout: "请求超时（毫秒）",
			requestTimeoutHint: "等待匹配 OneBot echo 响应的最长时间。",
			heartbeatTimeout: "心跳超时（毫秒）",
			heartbeatTimeoutHint: "超过此时间未收到心跳则认为连接不可用。",
			commandPrefix: "命令前缀",
			commandPrefixHint: "移除此消息前缀后再投递给 DSH agent；留空表示不要求前缀。",
			respondToPrivate: "回复私聊消息",
			respondToPrivateHint: "将私聊交给 DSH agent，并回复 tools 驱动运行的最终助手消息。私聊会先攒一下：统一等最后一条之后静默 5 秒，把连发的几条合并成一轮、只回一次；单条也等满 5 秒才答，不秒回（秒回更像脚本，也更容易被风控）。",
			respondToGroup: "回复群聊消息",
			respondToGroupHint: "将群聊交给 DSH agent，并回复 tools 驱动运行的最终助手消息。",
			groupMentionOnly: "群聊仅响应提及",
			groupMentionOnlyHint: "仅处理包含当前 OneBot 账号 CQ at 的群聊消息。",
			userAccessMode: "用户访问模式",
			userAccessModeHint: "禁用限制、仅允许名单或拦截名单。",
			userIds: "用户 ID 列表",
			userIdsHint: "每行一个用户 ID；保存时去除空白和重复项。",
			masterIds: "master QQ 列表",
			masterIdsHint: "每行一个 QQ 号。只有名单里的人能让小号动手做事，其他人只能聊天；第一个号还会收到掉线私聊提醒。",
			groupAccessMode: "群聊访问模式",
			groupAccessModeHint: "禁用限制、仅允许名单或拦截名单。",
			groupIds: "群聊 ID 列表",
			groupIdsHint: "每行一个群聊 ID；保存时去除空白和重复项。",
			accessDisabled: "不限制",
			accessAllowlist: "仅允许名单",
			accessBlocklist: "拦截名单",
			runtimeLoading: "正在加载…",
			runtimeUnavailable: "加载失败，检查连接后重试。",
			runtimeSaveFailed: "保存失败：路径不合法或目录不存在。",
			runtimeSaved: "已保存，下一次调用就生效。",
			readRoot: "可读目录",
			readRootHint: "小号只能在这个目录及其子目录里活动。必须是真实存在的绝对路径；不允许盘符根、用户主目录、系统目录、.dsh 目录。",
			writeRoot: "写入目录",
			writeRootHint: "当前版本没有向本机写文件的工具，这一项先留空；将来加写入工具时只允许写这个目录。",
			napcatTitle: "NapCat 进程",
			napcatDesc: "DSH 启动时不再自动拉起 NapCat。需要时点下面的按钮，用保存的账号快速登录；登录态被踢之后的扫码仍然得你亲自来。",
			napcatChecking: "正在检查 NapCat 状态…",
			napcatOnline: "已在线（端口 {port}）",
			napcatOffline: "未运行",
			napcatStart: "启动 NapCat",
			napcatStarting: "启动中…",
			napcatAlready: "已经在运行",
			napcatBooting: "启动命令已发出，等待端口就绪…",
			napcatCooldown: "刚启动过，一分钟后再试",
			napcatUnsupported: "只有 Windows + NapCat 支持这个按钮",
			napcatNotLocal: "当前连接地址不是本机 NapCat，无法从这里启动",
			napcatMissing: "没有配置 NapCat 启动器（onebot-napcat.json 或 DSH_NAPCAT_LAUNCHER）",
			napcatUnavailable: "查不到 NapCat 状态，检查连接后重试",
			napcatFailed: "启动失败",
			napcatTimeout: "启动命令已发出，但 45 秒内端口还没起来；稍后再看，或检查 NapCat 窗口",
			healTitle: "掉线提醒",
			healDesc: "QQ 客户端会出这种故障：进程还在、端口还在、状态还报在线，账号其实已经收发全断。端口探测和登录接口都看不出来，只有真发一条消息才会暴露。",
			channelProbe: "通道探测（分钟）",
			channelProbeHint: "静默超过这个时长，就发一条消息给自己再撤回，确认通道还活着；连续两次报「网络连接异常」按掉线处理，提醒 master（只提醒，不自动重启）。这种「端口在、登录在、只是收发断」的故障不会动进程——登录态可能还活着，杀了就得重扫。填 0 关闭探测。",
			sayTitle: "主动搭话",
			sayDesc: "小号会自己找时机说话：时间随机，刷到什么好玩的也会顺手发一条。上一条发了没人回，隔 10 分钟它能再追一句，那一句不占额度。",
			sayInterval: "平均间隔（分钟）",
			sayIntervalHint: "实际间隔在这个值的 0.5–1.5 倍之间随机，全天都开口，不分昼夜（作息乱的人不该被插件规定时间）；master 刚说过话的 5 分钟内不插嘴。上一条主动消息 10 分钟没人回，可免费再追，一串最多 3 条（超过 2 小时就不算追了，当作新的一句）。改完当场重排，不用重启。填 0 关闭主动搭话。",
			qzonePoll: "空间巡检（分钟）",
			qzonePollHint: "每隔这么久拉一次 master 的说说列表，比对 tid。全天不分昼夜——评论区不是私聊，半夜回一句不算吵人。三种情况会叫醒它：master 发了新说说、master 在它评过的那条下面回了话、别人在评论区回复了它。没新东西就只花一次请求，不动模型。私聊里让它评论过的那条会记成已处理，巡检不会再重复评论。填 0 关闭巡检。",
			budgetsHint: "0 表示禁用该动作（联网三项设 0 = 断开联网）。改头像 / 改资料 / 改签名固定为终身一次，不在这里开放。改配额不会退还已经用掉的次数。",
			qzonePerDay: "发说说（条/天）",
			sayPerDay: "主动私聊 master（条/天）",
			qzoneCommentPerDay: "评论 / 回复 master 的说说（条/天）",
			qzoneLikePerDay: "给 master 的说说点赞（个/天）",
			friendRemarkPerDay: "改好友备注（次/天）",
			customFacePerDay: "存表情（次/天）",
			deleteQzonePerMinute: "删说说（次/分）",
			emojiLikePerMinute: "表情回应（次/分）",
			inputStatusPerMinute: "输入状态（次/分）",
			onlineStatusPerMinute: "在线状态（次/分）",
			diyOnlineStatusPerMinute: "自定义在线状态（次/分）",
			webSearchPerMinute: "联网搜索（次/分）",
			webFetchPerMinute: "抓网页（次/分）",
			webHttpPerMinute: "HTTP 请求（次/分）",
			defaultPerMinute: "其他写动作（次/分）",
			sectionLabel: "OneBot",
			masterLabel: "总开关",
			masterHint: "在插件列表里开 / 关 OneBot：关掉即整体停用，消息不再进来。这一页只管描述和数值。",
			pageTitle: "OneBot 小号",
			pageIntro: "让 DSH 通过 OneBot v11 在 QQ 上收发消息。下面只列它现在真会做的事，以及只有 master 能改的两组数值。",
			capsTitle: "它会做什么",
			capsDesc: "能力清单随版本更新；这里没有写的，就是它还不会。",
			compatNote: "标注为 NapCat 扩展的能力（QQ 空间、收藏表情、改资料/头像/签名、在线/输入状态、名片赞、好友分组等）需要接入端实现对应接口；换用其他 OneBot v11 实现时可能不可用，调用会报错而不是崩溃。收发消息、引用、撤回、群白名单与静默、联网、读本机文件不受影响。",
			capMessage: "消息",
			capMessageHint: "私聊与群聊应答。群里必须 @ 到小号，而且只在你放行的群里生效；只 @ 不说话也会当成一次呼叫，正常回一句。",
			capImage: "看图",
			capImageHint: "真实识图，不是读文件名。本条消息里的图、被引用那条里的图、以及群里刚发过但没 @ 你的图/视频都会自动看；gif / 动态 webp 按时间抽帧，视频抽帧看分镜（无声，没有音频）。",
			capFile: "本机文件",
			capFileHint: "具备读能力，只在你下面指定的目录及其子目录里活动，越界路径会被拒绝。写工具尚未提供。",
			capCall: "QQ 动作",
			capCallHint: "33 项：好友 / 群 / 成员查询、发说说、改头像资料签名、在线状态、好友备注、收藏表情。",
			capGroup: "群与互动",
			capGroupHint: "群白名单增删与模式切换、按群静默与解除（群里说「开启本群静默」，或私聊点名「开启<群名>的静默」/报群号；静默落盘，重启不丢）；戳一戳会回戳并开口回应，知道是谁戳的；同一个人短时间内连戳只回戳、不重复说话。",
			capWeb: "联网",
			capWebHint: "能搜网页（Bing 与搜狗并行，中文结果更全）、抓网页正文、直接打 HTTP 接口。默认只走公网；和你在私聊里说话时，本机与内网地址（localhost、127.0.0.1、192.168.x 这类）也能访问，群里或别人问你时不行。百度百科自动走词条接口，知乎/贴吧这类反爬站会明说读不到。搜索和抓取你授权的访客也能用，打接口只限你自己。",
			capSay: "主动开口",
			capSayHint: "不用你先说话，它也能发一条私聊过来：汇报进展、提醒额度将尽、看到有意思的东西顺手说一句。收件人固定是你本人，没有「发给别人」这个选项，每天有配额。",
			capQzone: "QQ 空间",
			capQzoneHint: "能拉你最近 10 条说说、把你的配图当画面真的看一遍，再决定怎么评论——只能看和互动你本人的说说，别人的空间看不到。评论按天配额，比发说说更容易触发风控，所以给得很小；点赞轻得多，单独一份宽松配额，评论时会顺手点一个。",
			capFace: "表情",
			capFaceHint: "回复里能带真正的 QQ 小黄脸（275 个，含捂脸 / doge / 笑哭），也能把图存进「我的表情」，和客户端右键「添加到表情」是同一个功能。超级表情 / 商城表情不支持。",
			capContext: "上下文",
			capContextHint: "群聊流水自动进上下文，回复时不用你复述前情。",
			capStable: "稳定性",
			capStableHint: "NapCat 不再跟随 DSH 启动，需要到这一页点「启动 NapCat」；掉线只提醒 master，不自动重试登录，并顺手结束掉空转的 NapCat 进程（登录态失效后它会每两分钟刷一次二维码），只认 NapCat 安装目录、不碰你自己的 QQ；master 还能限时授权访客。",
			capQuota: "配额",
			capQuotaHint: "每类动作有独立用量上限，就是下面那 15 个数字；联网那三项设成 0 等于断开联网。",
			dirTitle: "文件访问目录",
			dirDesc: "小号只能在这个目录及其子目录里活动，目前只开放读（列目录、读文本、看图/视频）。改完立即生效，不会断开 QQ 连接。",
			readRootEmpty: "未设置（文件工具暂不可用）",
			budgetCardTitle: "写动作配额",
			connHint: "连接参数（WebSocket 地址、令牌、回复开关、访问名单）在「内置插件 → OneBot」里改。",
			runtimeMovedHint: "目录与写动作配额已移到左栏「OneBot」页。",
			decrease: "减少",
			increase: "增加",
			unset: "未设置"
		};
		const en = {
			title: "OneBot",
			description: "Configure the OneBot v11 connection, replies, and access scope.",
			expand: "Show settings",
			collapse: "Hide settings",
			loading: "Loading settings…",
			retry: "Retry",
			save: "Save",
			saving: "Saving…",
			discard: "Discard",
			unavailable: "OneBot settings could not be loaded. Check the connection and retry.",
			readOnly: "This deployment stores settings read-only.",
			saveFailed: "The settings could not be saved. Check the fields and retry.",
			invalid: "Enter a valid value.",
			transport: "Connection mode",
			transportHint: "Choose forward WebSocket, reverse WebSocket, or HTTP webhook.",
			transportForwardWs: "Forward WebSocket",
			transportReverseWs: "Reverse WebSocket",
			transportHttp: "HTTP webhook",
			url: "WebSocket URL",
			urlHint: "OneBot WebSocket URL used in forward mode.",
			listenHost: "Listen host",
			listenHostHint: "Listen address for reverse WebSocket or HTTP mode.",
			listenPort: "Listen port",
			listenPortHint: "Server port for reverse WebSocket or HTTP mode.",
			listenPath: "Listen path",
			listenPathHint: "Request path for reverse WebSocket or HTTP mode.",
			accessTokenRef: "Access token credential reference",
			accessTokenRefHint: "Edit only the DSH credential reference name; the token is never shown or sent to the browser.",
			webhookSecretRef: "Webhook secret credential reference",
			webhookSecretRefHint: "Edit only the DSH credential reference name; the secret is never shown or sent to the browser.",
			reconnectInterval: "Reconnect interval (ms)",
			reconnectIntervalHint: "Delay after a forward connection disconnects.",
			requestTimeout: "Request timeout (ms)",
			requestTimeoutHint: "Maximum wait for a matching OneBot echo response.",
			heartbeatTimeout: "Heartbeat timeout (ms)",
			heartbeatTimeoutHint: "Treat the connection as unavailable after this long without a heartbeat.",
			commandPrefix: "Command prefix",
			commandPrefixHint: "Remove this prefix before delivering the message to the DSH agent; blank accepts messages without a prefix.",
			respondToPrivate: "Reply to private messages",
			respondToPrivateHint: "Send private messages to the DSH agent and reply with the final assistant message from its tools-driven run.",
			respondToGroup: "Reply to group messages",
			respondToGroupHint: "Send group messages to the DSH agent and reply with the final assistant message from its tools-driven run.",
			groupMentionOnly: "Require a group mention",
			groupMentionOnlyHint: "Only handle group messages containing a CQ at mention for this OneBot account.",
			userAccessMode: "User access mode",
			userAccessModeHint: "Disable filtering, allow only listed users, or block listed users.",
			userIds: "User IDs",
			userIdsHint: "One user ID per line; whitespace and duplicates are removed on save.",
			masterIds: "Master QQ IDs",
			masterIdsHint: "One QQ ID per line. Only these users can make the bot act; everyone else can only chat. The first ID also receives offline alerts.",
			groupAccessMode: "Group access mode",
			groupAccessModeHint: "Disable filtering, allow only listed groups, or block listed groups.",
			groupIds: "Group IDs",
			groupIdsHint: "One group ID per line; whitespace and duplicates are removed on save.",
			accessDisabled: "No filtering",
			accessAllowlist: "Allowlist only",
			accessBlocklist: "Blocklist",
			runtimeLoading: "Loading…",
			runtimeUnavailable: "Could not load. Check the connection and retry.",
			runtimeSaveFailed: "Save failed: invalid path or missing directory.",
			runtimeSaved: "Saved. Applies on the next call.",
			readRoot: "Read directory",
			readRootHint: "The bot stays inside this directory and its subdirectories. Must be an existing absolute path; drive roots, the home directory, system directories and .dsh are rejected.",
			writeRoot: "Write directory",
			writeRootHint: "This build has no local write tool, so leave it blank; a future write tool will be confined to this directory.",
			napcatTitle: "NapCat process",
			napcatDesc: "DSH no longer starts NapCat on boot. Use the button below when you need it: it launches with the saved account for fast login. If the login was kicked, scanning the QR code is still up to you.",
			napcatChecking: "Checking NapCat status…",
			napcatOnline: "Online (port {port})",
			napcatOffline: "Not running",
			napcatStart: "Start NapCat",
			napcatStarting: "Starting…",
			napcatAlready: "Already running",
			napcatBooting: "Launch command sent; waiting for the port…",
			napcatCooldown: "Just started — try again in a minute",
			napcatUnsupported: "This button only works with Windows + NapCat",
			napcatNotLocal: "The current endpoint is not a local NapCat instance, so it cannot be started here",
			napcatMissing: "No NapCat launcher configured (onebot-napcat.json or DSH_NAPCAT_LAUNCHER)",
			napcatUnavailable: "Could not read NapCat status. Check the connection and retry.",
			napcatFailed: "Failed to start",
			napcatTimeout: "The launch command was sent, but the port did not come up within 45 seconds. Check again later, or look at the NapCat window.",
			healTitle: "Drop alert",
			healDesc: "The QQ client can wedge like this: processes alive, port alive, status still says online — while the account can neither send nor receive. Port checks and login calls all look fine; only a real send exposes it.",
			channelProbe: "Channel probe (minutes)",
			channelProbeHint: "After this much silence, send one message to yourself and recall it to prove the channel still works. Two consecutive \"network error\" replies count as a drop and raise an alert to master — alert only, no automatic restart. 0 disables the probe.",
			sayTitle: "Saying hi on its own",
			sayDesc: "The bot picks its own moments at random, and speaks up when it stumbles on something fun. If a message of its own goes unanswered for 10 minutes it may follow up once — that one is free.",
			sayInterval: "Average interval (minutes)",
			sayIntervalHint: "The real gap lands between 0.5x and 1.5x this value, around the clock — no quiet hours, because irregular sleep should not be legislated by a plugin. It stays quiet for 5 minutes after master speaks. An unanswered message can be followed up after 10 minutes without spending quota, at most 3 in a row, and only within 2 hours — after that it counts as a new message. Changes apply immediately, no restart. 0 turns proactive messages off.",
			qzonePoll: "Qzone poll (minutes)",
			qzonePollHint: "Every so often it pulls master's post list and compares tids. Around the clock — the comment area is not a DM, a reply at 3am wakes nobody. Three things wake the model: a new post from master, master replying under a post it already commented on, or somebody else replying to it in the comments. Nothing new = one request, no model turn. A post it already commented on via a DM is marked handled, so the poll never double-comments. 0 turns polling off.",
			budgetsHint: "0 disables the action (all three web caps at 0 = networking off). Avatar, profile and long-nickname changes stay one-shot and are not exposed here. Lowering a quota does not refund uses already spent.",
			qzonePerDay: "Qzone posts (per day)",
			sayPerDay: "Proactive DMs to master (per day)",
			qzoneCommentPerDay: "Comments and replies on master's posts (per day)",
			qzoneLikePerDay: "Likes on master's posts (per day)",
			friendRemarkPerDay: "Friend remarks (per day)",
			customFacePerDay: "Saved stickers (per day)",
			deleteQzonePerMinute: "Delete Qzone post (per minute)",
			emojiLikePerMinute: "Emoji reactions (per minute)",
			inputStatusPerMinute: "Input status (per minute)",
			onlineStatusPerMinute: "Online status (per minute)",
			diyOnlineStatusPerMinute: "Custom online status (per minute)",
			webSearchPerMinute: "Web search (per minute)",
			webFetchPerMinute: "Page fetch (per minute)",
			webHttpPerMinute: "HTTP request (per minute)",
			defaultPerMinute: "Other write actions (per minute)",
			sectionLabel: "OneBot",
			masterLabel: "Master switch",
			masterHint: "Turn OneBot on or off from the plugin list; that switch disables the whole bridge. This page only holds the description and values.",
			pageTitle: "OneBot companion",
			pageIntro: "Lets DSH talk on QQ through OneBot v11. Below is only what it actually does today, plus the two groups of numbers only the master can change.",
			capsTitle: "What it does",
			capsDesc: "This list tracks releases; anything not listed here is not implemented yet.",
			compatNote: "Capabilities marked as NapCat extensions (QQ Zone, saved stickers, profile/avatar/signature edits, online/typing status, profile likes, friend groups, etc.) require the backend to implement those exact actions. On another OneBot v11 implementation they may be unavailable and will return an error instead of crashing. Sending messages, quotes, recalls, group allowlist/silence, web access, and local file reads are unaffected.",
			capMessage: "Messages",
			capMessageHint: "Private and group replies. In groups it must be mentioned and only works in groups you allow; a bare mention with no text is treated as a call too and gets a normal reply.",
			capImage: "Seeing images",
			capImageHint: "Real vision, not filename guessing. Images in the message, in the quoted one, and recent group media sent without @-ing the bot are all picked up. GIF / animated webp are sampled into frames; videos become silent storyboards with no audio.",
			capFile: "Local files",
			capFileHint: "Read access only, confined to the directory set below and its subdirectories; escaping paths are rejected. No write tool yet.",
			capCall: "QQ actions",
			capCallHint: "33 of them: friend / group / member lookups, Qzone posts, avatar and profile edits, online status, friend remarks.",
			capGroup: "Groups and pokes",
			capGroupHint: "Add or remove allowed groups, switch the mode, silence a group; a poke gets poked back and answered in the same turn, and repeated pokes from the same person within 15 seconds only get poked back, without starting another sentence.",
			capWeb: "Web",
			capWebHint: "Search the web (Bing and Sogou in parallel, better Chinese coverage), read page text, and call HTTP APIs. Public addresses only by default; in a private chat with you, loopback and LAN addresses (localhost, 127.0.0.1, 192.168.x) are allowed too — in groups or with anyone else they stay blocked. Baidu Baike goes through its lemma API; hard anti-bot sites like Zhihu tell you straight that they cannot be read. Search and fetch are open to granted users too; raw HTTP calls stay master-only.",
			capSay: "Speaking first",
			capSayHint: "It can DM you without waiting for you to speak — progress notes, low-credit reminders, or something interesting it ran into. The recipient is always you; there is no way to address anyone else. Daily quota applies.",
			capQzone: "Qzone",
			capQzoneHint: "It can pull your last 10 posts, actually look at your photos, and comment on them — only your own posts, never anyone else's space. Comments have a small daily quota because they trip risk control far more easily than posting; likes are much lighter, have their own looser cap, and are sent along with each comment.",
			capFace: "Stickers",
			capFaceHint: "Replies can carry real QQ faces (275 of them, including 捂脸 / doge / 笑哭), and images can be saved into My Stickers — the same thing as right-clicking 添加到表情 in the client. Super/market faces are not supported.",
			capContext: "Context",
			capContextHint: "Group chatter is folded into the context, so you never have to restate the thread.",
			capStable: "Stability",
			capStableHint: "NapCat no longer starts with DSH — use the Start NapCat button on this page. When it drops, the master gets one alert and nothing retries the login; the master can also grant time-boxed guest access.",
			capQuota: "Quotas",
			capQuotaHint: "Every action has its own cap: the fifteen numbers below. Setting the three web caps to 0 turns networking off.",
			dirTitle: "File access directory",
			dirDesc: "The bot stays inside this directory and its subdirectories. Read-only for now (list, read text, view images/videos). Changes apply immediately without dropping the QQ connection.",
			readRootEmpty: "Not set (file tools are unavailable)",
			budgetCardTitle: "Write action quotas",
			connHint: "Connection settings (WebSocket URL, token, reply switches, access lists) live in Built-in plugins → OneBot.",
			runtimeMovedHint: "Directories and write quotas moved to the OneBot page in the sidebar.",
			decrease: "Decrease",
			increase: "Increase",
			unset: "Not set"
		};
		const specs = [
			["transport", "transport"],
			["url", "text"],
			["listenHost", "text"],
			["listenPort", "integer"],
			["listenPath", "text"],
			["accessTokenRef", "text"],
			["webhookSecretRef", "text"],
			["reconnectInterval", "integer"],
			["requestTimeout", "integer"],
			["heartbeatTimeout", "integer"],
			["commandPrefix", "text"],
			["respondToPrivate", "boolean"],
			["respondToGroup", "boolean"],
			["groupMentionOnly", "boolean"],
			["userAccessMode", "accessMode"],
			["userIds", "textarea"],
			["masterIds", "textarea"],
			["groupAccessMode", "accessMode"],
			["groupIds", "textarea"]
		];
		const format = (value, kind) => kind === "boolean" ? Boolean(value) : kind === "textarea" ? Array.isArray(value) ? value.join("\n") : "" : value == null ? "" : String(value);
		const parse = (value, kind) => {
			if (kind === "boolean") return value;
			if (typeof value !== "string") return void 0;
			if (kind === "textarea") return [...new Set(value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean))];
			if (kind === "transport") return [
				"forward-ws",
				"reverse-ws",
				"http"
			].includes(value) ? value : void 0;
			if (kind === "accessMode") return [
				"disabled",
				"allowlist",
				"blocklist"
			].includes(value) ? value : void 0;
			if (kind === "text") return value;
			const number = Number(value);
			return value.trim() && Number.isSafeInteger(number) && number >= 0 ? number : void 0;
		};
		function controller() {
			let state = {
				status: "loading",
				config: {},
				writable: false
			};
			const listeners = /* @__PURE__ */ new Set();
			const publish = (next) => {
				state = next;
				for (const listener of listeners) listener();
			};
			const request = async (method, body) => {
				const response = await fetch(`${ENDPOINT}/${method}`, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(body)
				});
				const result = await response.json();
				if (!response.ok || !result.ok) throw new Error();
				return result.value;
			};
			const load = async () => {
				publish({
					...state,
					status: "loading"
				});
				try {
					const value = await request("get", {});
					publish({
						status: "ready",
						config: value.config,
						writable: value.writable === true
					});
				} catch {
					publish({
						...state,
						status: "unavailable",
						writable: false
					});
				}
			};
			const save = async (patch) => {
				const value = await request("set", { patch });
				publish({
					status: "ready",
					config: value.config,
					writable: value.writable === true
				});
			};
			load();
			return {
				getSnapshot: () => state,
				subscribe(fn) {
					listeners.add(fn);
					return () => listeners.delete(fn);
				},
				load,
				save
			};
		}
		const inputStyle = (bad) => ({
			boxSizing: "border-box",
			width: "100%",
			minHeight: 34,
			border: `1px solid ${bad ? "var(--dsw-alias-label-error)" : "var(--dsw-alias-border-l2)"}`,
			borderRadius: 8,
			background: "var(--dsw-alias-bg-layer-3)",
			color: "var(--dsw-alias-label-primary)",
			font: "inherit",
			fontSize: 13,
			lineHeight: 1.5,
			padding: "7px 12px"
		});
		function BooleanControl({ value, disabled, label, onChange }) {
			return /* @__PURE__ */ React.createElement("button", {
				type: "button",
				role: "checkbox",
				"aria-checked": Boolean(value),
				"aria-label": label,
				disabled,
				onClick: () => onChange(!value),
				style: {
					appearance: "none",
					width: 18,
					height: 18,
					flex: "none",
					display: "inline-flex",
					alignItems: "center",
					justifyContent: "center",
					padding: 0,
					border: "1px solid var(--dsw-alias-border-l2)",
					borderRadius: 5,
					background: value ? "var(--dsw-alias-button-primary-fill)" : "transparent",
					color: "var(--dsw-alias-label-primary-foreground)",
					cursor: disabled ? "default" : "pointer",
					opacity: disabled ? .4 : 1
				}
			}, value ? /* @__PURE__ */ React.createElement(IconCheckOutline16, { size: 14 }) : null);
		}
		function EnumMenu({ value, disabled, options, t, onChange }) {
			const [open, setOpen] = React.useState(false);
			return /* @__PURE__ */ React.createElement(Menu, {
				open,
				anchor: /* @__PURE__ */ React.createElement(Button, {
					variant: "toolbar",
					disabled,
					"aria-haspopup": "menu",
					"aria-expanded": open,
					onClick: () => setOpen(!open)
				}, t(options.find(([id]) => id === value)?.[1]), /* @__PURE__ */ React.createElement("span", { style: {
					flex: "none",
					display: "inline-flex",
					transform: open ? "rotate(180deg)" : "none",
					transition: "transform .16s"
				} }, /* @__PURE__ */ React.createElement(IconChevronDownOutline14, null))),
				items: options.map(([id, label]) => ({
					id,
					label: t(label)
				})),
				selectedId: value,
				onSelect: (id) => {
					onChange(id);
					setOpen(false);
				},
				onClose: () => setOpen(false),
				align: "start",
				portal: true
			});
		}
		function Card({ t, scope }) {
			const state = React.useSyncExternalStore(scope.subscribe, scope.getSnapshot, scope.getSnapshot);
			const [open, setOpen] = React.useState(false), [draft, setDraft] = React.useState({}), [saving, setSaving] = React.useState(false), [failed, setFailed] = React.useState(false);
			const dirty = Object.keys(draft).length > 0;
			const invalid = specs.some(([key, kind]) => Object.hasOwn(draft, key) && parse(draft[key], kind) === void 0);
			const edit = (key, value) => {
				setFailed(false);
				setDraft((old) => ({
					...old,
					[key]: value
				}));
			};
			const save = async () => {
				if (!dirty || invalid) return;
				setSaving(true);
				setFailed(false);
				try {
					const patch = {};
					for (const [key, kind] of specs) if (Object.hasOwn(draft, key)) patch[key] = parse(draft[key], kind);
					await scope.save(patch);
					setDraft({});
				} catch {
					setFailed(true);
				} finally {
					setSaving(false);
				}
			};
			const options = (kind) => kind === "transport" ? [
				["forward-ws", "transportForwardWs"],
				["reverse-ws", "transportReverseWs"],
				["http", "transportHttp"]
			] : [
				["disabled", "accessDisabled"],
				["allowlist", "accessAllowlist"],
				["blocklist", "accessBlocklist"]
			];
			const cardStyle = {
				listStyle: "none",
				border: "1px solid var(--dsw-alias-border-l2)",
				borderRadius: 12,
				background: open ? "var(--dsw-alias-bg-layer-2)" : "var(--dsw-alias-bg-layer-3)",
				transition: "border-color .16s, background .16s"
			};
			return /* @__PURE__ */ React.createElement("li", { style: cardStyle }, /* @__PURE__ */ React.createElement("button", {
				type: "button",
				"aria-expanded": open,
				"aria-label": `${t(open ? "collapse" : "expand")}: ${t("title")}`,
				onClick: () => setOpen(!open),
				style: {
					width: "100%",
					appearance: "none",
					border: 0,
					background: "none",
					font: "inherit",
					color: "inherit",
					textAlign: "left",
					cursor: "pointer",
					display: "flex",
					alignItems: "center",
					gap: 12,
					padding: "14px 16px",
					borderRadius: 12
				}
			}, /* @__PURE__ */ React.createElement("span", { style: {
				flex: 1,
				minWidth: 0,
				display: "flex",
				flexDirection: "column",
				gap: 4
			} }, /* @__PURE__ */ React.createElement("span", { style: {
				fontSize: 15,
				fontWeight: 600,
				lineHeight: 1.4,
				color: "var(--dsw-alias-label-primary)"
			} }, t("title")), /* @__PURE__ */ React.createElement("span", { style: {
				fontSize: 13,
				lineHeight: 1.5,
				color: "var(--dsw-alias-label-tertiary)"
			} }, t("description"))), dirty ? /* @__PURE__ */ React.createElement("span", { style: {
				borderRadius: 999,
				padding: "1px 8px",
				fontSize: 11,
				lineHeight: "17px",
				background: "var(--dsw-alias-bg-module-platform)",
				color: "var(--dsw-alias-label-secondary)"
			} }, "●") : null, /* @__PURE__ */ React.createElement(IconChevronDownOutline14, { className: `onebot-settings-chevron${open ? " onebot-settings-chevron-open" : ""}` })), open ? /* @__PURE__ */ React.createElement("div", { style: {
				borderTop: "1px solid var(--dsw-alias-border-l2)",
				margin: "0 16px",
				paddingBottom: 8
			} }, state.status === "loading" ? /* @__PURE__ */ React.createElement("p", { style: {
				fontSize: 12,
				color: "var(--dsw-alias-label-tertiary)"
			} }, t("loading")) : null, state.status === "unavailable" ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: {
				fontSize: 12,
				color: "var(--dsw-alias-state-warn-label)"
			} }, t("unavailable")), /* @__PURE__ */ React.createElement(Button, {
				variant: "outline",
				onClick: state.load
			}, t("retry"))) : null, state.status === "ready" ? specs.map(([key, kind], index) => {
				const value = Object.hasOwn(draft, key) ? draft[key] : format(state.config[key], kind), bad = Object.hasOwn(draft, key) && parse(draft[key], kind) === void 0;
				const title = t(key);
				const control = kind === "boolean" ? /* @__PURE__ */ React.createElement(BooleanControl, {
					value,
					disabled: !state.writable,
					label: title,
					onChange: (next) => edit(key, next)
				}) : kind === "textarea" ? /* @__PURE__ */ React.createElement("textarea", {
					rows: 4,
					value,
					disabled: !state.writable,
					onChange: (e) => edit(key, e.target.value),
					style: inputStyle(bad)
				}) : kind === "transport" || kind === "accessMode" ? /* @__PURE__ */ React.createElement(EnumMenu, {
					value,
					disabled: !state.writable,
					options: options(kind),
					t,
					onChange: (next) => edit(key, next)
				}) : /* @__PURE__ */ React.createElement("input", {
					type: kind === "integer" ? "number" : "text",
					min: kind === "integer" ? 0 : void 0,
					step: kind === "integer" ? 1 : void 0,
					value,
					disabled: !state.writable,
					onChange: (e) => edit(key, e.target.value),
					style: inputStyle(bad)
				});
				const text = /* @__PURE__ */ React.createElement("span", { style: {
					flex: kind === "boolean" ? 1 : void 0,
					minWidth: 0,
					display: "flex",
					flexDirection: "column",
					gap: 4
				} }, /* @__PURE__ */ React.createElement("span", { style: {
					fontSize: 13,
					fontWeight: 500,
					lineHeight: 1.5,
					color: "var(--dsw-alias-label-primary)"
				} }, title), kind === "boolean" ? /* @__PURE__ */ React.createElement("span", { style: {
					color: "var(--dsw-alias-label-tertiary)",
					fontSize: 12,
					lineHeight: 1.5
				} }, t(`${key}Hint`)) : null);
				return kind === "boolean" ? /* @__PURE__ */ React.createElement("div", {
					key,
					style: {
						display: "flex",
						flexDirection: "row",
						alignItems: "center",
						gap: 16,
						padding: "12px 0",
						borderTop: index ? "1px solid var(--dsw-alias-border-l2)" : "none"
					}
				}, text, control) : /* @__PURE__ */ React.createElement("label", {
					key,
					style: {
						display: "flex",
						flexDirection: "column",
						gap: 6,
						padding: "12px 0",
						borderTop: index ? "1px solid var(--dsw-alias-border-l2)" : "none"
					}
				}, text, control, /* @__PURE__ */ React.createElement("span", { style: {
					margin: 0,
					color: bad ? "var(--dsw-alias-label-error)" : "var(--dsw-alias-label-tertiary)",
					fontSize: 12,
					lineHeight: 1.5
				} }, bad ? t("invalid") : t(`${key}Hint`)));
			}) : null, state.status === "ready" && !state.writable ? /* @__PURE__ */ React.createElement("p", { style: {
				fontSize: 12,
				color: "var(--dsw-alias-label-tertiary)"
			} }, t("readOnly")) : null, state.status === "ready" ? /* @__PURE__ */ React.createElement("div", { style: {
				display: "flex",
				alignItems: "center",
				justifyContent: "flex-end",
				gap: 8,
				padding: "12px 0 4px",
				borderTop: "1px solid var(--dsw-alias-border-l2)"
			} }, failed ? /* @__PURE__ */ React.createElement("p", { style: {
				flex: 1,
				margin: 0,
				fontSize: 12,
				color: "var(--dsw-alias-label-error)"
			} }, t("saveFailed")) : null, /* @__PURE__ */ React.createElement(Button, {
				variant: "outline",
				disabled: !dirty || saving,
				onClick: () => {
					setDraft({});
					setFailed(false);
				}
			}, t("discard")), /* @__PURE__ */ React.createElement(Button, {
				variant: "primary",
				disabled: !dirty || invalid || saving || !state.writable,
				onClick: save
			}, saving ? t("saving") : t("save"))) : null, /* @__PURE__ */ React.createElement("p", {
				style: {
					margin: 0,
					padding: "2px 0 6px",
					textAlign: "right",
					fontSize: 12,
					lineHeight: 1.5,
					color: "var(--dsw-alias-label-tertiary)"
				}
			}, t("runtimeMovedHint"))) : null);
		}
		const BUDGET_KEYS = [
			"qzonePerDay",
			"sayPerDay",
			"qzoneCommentPerDay",
			"qzoneLikePerDay",
			"friendRemarkPerDay",
			"customFacePerDay",
			"deleteQzonePerMinute",
			"emojiLikePerMinute",
			"inputStatusPerMinute",
			"onlineStatusPerMinute",
			"diyOnlineStatusPerMinute",
			"webSearchPerMinute",
			"webFetchPerMinute",
			"webHttpPerMinute",
			"defaultPerMinute"
		];
		/**
		 * 目录和配额走 /runtime/*：后端写独立文件，下一次工具调用就生效，不重建插件、
		 * 不断 OneBot 连接。连接类字段仍旧走 /get 与 /set（那条路会重建插件）。
		 */
		function runtimeController() {
			let state = {
				status: "loading",
				runtime: {
					readRoot: "",
					writeRoot: "",
					channelProbeMinutes: 15,
					proactiveMinutes: 120,
					budgets: {}
				},
				napcat: { state: "loading" }
			};
			const listeners = /* @__PURE__ */ new Set();
			const publish = (next) => {
				state = next;
				for (const listener of listeners) listener();
			};
			const request = async (method, body) => {
				const response = await fetch(`${ENDPOINT}/${method}`, {
					method: "POST",
					headers: { "content-type": "application/json" },
					body: JSON.stringify(body)
				});
				const result = await response.json();
				if (!response.ok || !result.ok) throw new Error(result?.error?.message ?? "request failed");
				return result.value;
			};
			/** silent = 后台刷新：不清空成 loading，避免每次切页都闪一下骨架。 */
			const load = async (silent) => {
				if (!silent || state.status !== "ready") publish({
					...state,
					status: "loading"
				});
				try {
					const value = await request("runtime/get", {});
					publish({
						...state,
						status: "ready",
						runtime: value.runtime
					});
				} catch {
					if (silent && state.status === "ready") return;
					publish({
						...state,
						status: "unavailable"
					});
				}
			};
			const save = async (patch) => {
				const value = await request("runtime/set", { patch });
				publish({
					...state,
					status: "ready",
					runtime: value.runtime
				});
			};
			// NapCat 的进程状态单独查：它和 runtime 配置不是一回事，也不该因为保存
			// 配额而被重置成 loading。
			const napcatRefresh = async () => {
				try {
					const value = await request("napcat/status", {});
					publish({ ...state, napcat: value });
					return value;
				} catch {
					const value = { state: "unavailable" };
					publish({ ...state, napcat: value });
					return value;
				}
			};
			const napcatStart = async () => {
				const value = await request("napcat/start", {});
				publish({ ...state, napcat: value });
				return value;
			};
			load();
			return {
				getSnapshot: () => state,
				subscribe(fn) {
					listeners.add(fn);
					return () => listeners.delete(fn);
				},
				load,
				save,
				napcatRefresh,
				napcatStart
			};
		}
		/** 左栏「OneBot」页：能力说明 + 可读写目录 + 写动作配额。
		 *  数值走 /runtime/*：后端写独立文件，下一次工具调用就生效，不重建插件、不断连接。 */
		function OneBotPage({ t, scope }) {
			const state = React.useSyncExternalStore(scope.subscribe, scope.getSnapshot, scope.getSnapshot);
			const [draft, setDraft] = React.useState({}), [saving, setSaving] = React.useState(false), [error, setError] = React.useState(""), [saved, setSaved] = React.useState(false);
			const [napcatBusy, setNapcatBusy] = React.useState(false);
			const runtime = state.runtime ?? {};
			const budgets = runtime.budgets ?? {};
			const napcat = state.napcat ?? { state: "loading" };
			// 每次进这一页都悄悄拉一次：外部手改过 onebot-runtime.json 也能看到最新值；
			// NapCat 的端口状态也顺手查一次，按钮才不会拿旧状态骗人。
			React.useEffect(() => {
				void scope.load(true);
				void scope.napcatRefresh();
			}, [scope]);
			const dirty = Object.keys(draft).length > 0;
			const pathOf = (key) => Object.hasOwn(draft, key) ? draft[key] : String(runtime[key] ?? "");
			const countOf = (key) => Object.hasOwn(draft, `b:${key}`) ? draft[`b:${key}`] : String(budgets[key] ?? "");
			const probeOf = () => Object.hasOwn(draft, "channelProbeMinutes") ? draft.channelProbeMinutes : String(runtime.channelProbeMinutes ?? "");
			const intervalOf = () => Object.hasOwn(draft, "proactiveMinutes") ? draft.proactiveMinutes : String(runtime.proactiveMinutes ?? "");
			const pollOf = () => Object.hasOwn(draft, "qzonePollMinutes") ? draft.qzonePollMinutes : String(runtime.qzonePollMinutes ?? "");
			// writeRoot 允许清空（= 不启用写目录），只有 readRoot 不能空。
			const invalid = Object.keys(draft).some((key) => key.startsWith("b:") ? !/^\d+$/u.test(draft[key]) : key === "readRoot" ? draft[key].trim() === "" : key === "channelProbeMinutes" || key === "proactiveMinutes" || key === "qzonePollMinutes" ? !/^\d+$/u.test(draft[key]) || Number(draft[key]) > 1440 : false);
			const edit = (key, value) => {
				setSaved(false);
				setError("");
				setDraft((old) => ({
					...old,
					[key]: value
				}));
			};
			const save = async () => {
				if (!dirty || invalid || saving) return;
				const patch = {};
				if (Object.hasOwn(draft, "readRoot")) patch.readRoot = draft.readRoot;
				if (Object.hasOwn(draft, "writeRoot")) patch.writeRoot = draft.writeRoot;
				if (Object.hasOwn(draft, "channelProbeMinutes")) patch.channelProbeMinutes = Number(draft.channelProbeMinutes);
				if (Object.hasOwn(draft, "proactiveMinutes")) patch.proactiveMinutes = Number(draft.proactiveMinutes);
				if (Object.hasOwn(draft, "qzonePollMinutes")) patch.qzonePollMinutes = Number(draft.qzonePollMinutes);
				const nextBudgets = {};
				for (const key of BUDGET_KEYS) if (Object.hasOwn(draft, `b:${key}`)) nextBudgets[key] = Number(draft[`b:${key}`]);
				if (Object.keys(nextBudgets).length > 0) patch.budgets = nextBudgets;
				setSaving(true);
				setError("");
				try {
					await scope.save(patch);
					setDraft({});
					setSaved(true);
				} catch (err) {
					// 后端的拒绝理由比「保存失败」有用：路径不合法会说清是哪一条。
					setError(String(err?.message ?? "") || t("runtimeSaveFailed"));
				} finally {
					setSaving(false);
				}
			};
			/** 状态文案：ready 只代表查到了，online 才代表端口真的通。 */
			const napcatLine = () => {
				if (napcatBusy) return t("napcatStarting");
				switch (napcat.state) {
					case "ready":
						return napcat.online ? t("napcatOnline").replace("{port}", String(napcat.port ?? "")) : t("napcatOffline");
					case "already":
						return t("napcatAlready");
					case "booting":
						return t("napcatBooting");
					case "cooldown":
						return t("napcatCooldown");
					case "unsupported":
						return t("napcatUnsupported");
					case "not-local":
						return t("napcatNotLocal");
					case "launcher-missing":
						return t("napcatMissing");
					case "unavailable":
						return t("napcatUnavailable");
					case "failed":
						return napcat.message === void 0 ? t("napcatFailed") : `${t("napcatFailed")}: ${napcat.message}`;
					default:
						return t("napcatChecking");
				}
			};
			// already 不禁用：状态可能已经过期（进程随后挂了），点一下会重新探测并
			// 决定是启动还是再次返回「已经在运行」；禁用反而会把人锁在一个灰按钮上。
			const napcatLocked = napcatBusy || napcat.state === "loading" || napcat.state === "unsupported" || napcat.state === "not-local" || napcat.state === "launcher-missing" || napcat.state === "booting" || (napcat.state === "ready" && napcat.online === true);
			/** 启动器返回很快，端口要 ~30 秒才起来：点完在这里轮询 45 秒，别让按钮停在「已发出」。 */
			const startNapcat = async () => {
				if (napcatLocked) return;
				setNapcatBusy(true);
				setError("");
				try {
					const result = await scope.napcatStart();
					if (result?.state === "booting") {
						let online = false;
						for (let i = 0; i < 15; i += 1) {
							await new Promise((resolve) => {
								setTimeout(resolve, 3000);
							});
							const next = await scope.napcatRefresh();
							if (next?.online === true) {
								online = true;
								break;
							}
						}
						if (!online) setError(t("napcatTimeout"));
					}
				} catch (err) {
					setError(String(err?.message ?? "") || t("napcatFailed"));
				} finally {
					setNapcatBusy(false);
				}
			};
			const field = (key, title, hint, node) => h("label", {
				key,
				className: "onebot-field"
			}, h("span", { className: "onebot-label" }, title), node, hint === void 0 ? null : h("span", { className: "onebot-hint" }, hint));
			// 配额用步进器而不是裸输入框：改一格就点一下，不用先清空再敲数字。
			const stepper = (key) => {
				const value = countOf(key);
				const bump = (delta) => {
					const base = /^\d+$/u.test(value) ? Number(value) : 0;
					edit(`b:${key}`, String(Math.max(0, base + delta)));
				};
				return h("div", { className: "onebot-stepper" }, h("button", {
					type: "button",
					className: "onebot-step",
					"aria-label": t("decrease"),
					onClick: () => bump(-1)
				}, "−"), h("input", {
					className: "onebot-step-input",
					type: "text",
					inputMode: "numeric",
					value,
					"aria-label": t(key),
					onChange: (event) => edit(`b:${key}`, event.target.value.replace(/[^\d]/gu, ""))
				}), h("button", {
					type: "button",
					className: "onebot-step",
					"aria-label": t("increase"),
					onClick: () => bump(1)
				}, "+"));
			};
			const caps = [
				"capMessage",
				"capImage",
				"capFile",
				"capWeb",
				"capSay",
				"capQzone",
				"capCall",
				"capGroup",
				"capFace",
				"capContext",
				"capStable",
				"capQuota"
			];
			const ready = state.status === "ready";
			return h("div", { className: "onebot-page" }, h("div", { className: "onebot-head" }, h("h2", { className: "onebot-title" }, t("pageTitle")), h("p", { className: "onebot-intro" }, t("pageIntro")), h("div", { className: "onebot-meta" }, h("span", { className: "onebot-pill" }, t("masterLabel")), h("span", { className: "onebot-meta-text" }, t("masterHint")))), h("div", { className: "onebot-card" }, h("div", { className: "onebot-card-head" }, h("h3", { className: "onebot-card-title" }, t("capsTitle")), h("p", { className: "onebot-card-desc" }, t("capsDesc"))), caps.map((key) => h("div", {
				key,
				className: "onebot-cap"
			}, h("span", { className: "onebot-cap-label" }, t(key)), h("span", { className: "onebot-cap-text" }, t(`${key}Hint`)))), h("p", { className: "onebot-note" }, t("compatNote"))), state.status === "loading" ? h("div", { className: "onebot-card" }, h("p", { className: "onebot-hint" }, t("runtimeLoading"))) : null, state.status === "unavailable" ? h("div", { className: "onebot-card" }, h("p", { className: "onebot-hint" }, t("runtimeUnavailable")), h(Button, {
				variant: "outline",
				onClick: () => scope.load()
			}, t("retry"))) : null, ready ? h("div", { className: "onebot-card" }, h("div", { className: "onebot-card-head" }, h("h3", { className: "onebot-card-title" }, t("dirTitle")), h("p", { className: "onebot-card-desc" }, t("dirDesc"))), field("readRoot", t("readRoot"), Object.hasOwn(draft, "readRoot") && draft.readRoot.trim() === "" ? t("invalid") : t("readRootHint"), h("input", {
				type: "text",
				value: pathOf("readRoot"),
				placeholder: t("readRootEmpty"),
				onChange: (event) => edit("readRoot", event.target.value),
				style: inputStyle(false)
			}))) : null, ready ? h("div", { className: "onebot-card" }, h("div", { className: "onebot-card-head" }, h("h3", { className: "onebot-card-title" }, t("napcatTitle")), h("p", { className: "onebot-card-desc" }, t("napcatDesc"))), h("div", { className: "onebot-napcat" }, h("span", { className: "onebot-napcat-state" }, napcatLine()), h(Button, {
				variant: "outline",
				disabled: napcatLocked,
				onClick: startNapcat
			}, napcatBusy || napcat.state === "booting" ? t("napcatStarting") : t("napcatStart")))) : null, ready ? h("div", { className: "onebot-card" }, h("div", { className: "onebot-card-head" }, h("h3", { className: "onebot-card-title" }, t("healTitle")), h("p", { className: "onebot-card-desc" }, t("healDesc"))), field("channelProbeMinutes", t("channelProbe"), t("channelProbeHint"), h("input", {
				type: "text",
				inputMode: "numeric",
				value: probeOf(),
				"aria-label": t("channelProbe"),
				onChange: (event) => edit("channelProbeMinutes", event.target.value.replace(/[^\d]/gu, "")),
				style: inputStyle(Object.hasOwn(draft, "channelProbeMinutes") && (!/^\d+$/u.test(draft.channelProbeMinutes) || Number(draft.channelProbeMinutes) > 1440))
			}))) : null, ready ? h("div", { className: "onebot-card" }, h("div", { className: "onebot-card-head" }, h("h3", { className: "onebot-card-title" }, t("sayTitle")), h("p", { className: "onebot-card-desc" }, t("sayDesc"))), field("proactiveMinutes", t("sayInterval"), t("sayIntervalHint"), h("input", {
				type: "text",
				inputMode: "numeric",
				value: intervalOf(),
				"aria-label": t("sayInterval"),
				onChange: (event) => edit("proactiveMinutes", event.target.value.replace(/[^\d]/gu, "")),
				style: inputStyle(Object.hasOwn(draft, "proactiveMinutes") && (!/^\d+$/u.test(draft.proactiveMinutes) || Number(draft.proactiveMinutes) > 1440))
			})), field("qzonePollMinutes", t("qzonePoll"), t("qzonePollHint"), h("input", {
				type: "text",
				inputMode: "numeric",
				value: pollOf(),
				"aria-label": t("qzonePoll"),
				onChange: (event) => edit("qzonePollMinutes", event.target.value.replace(/[^\d]/gu, "")),
				style: inputStyle(Object.hasOwn(draft, "qzonePollMinutes") && (!/^\d+$/u.test(draft.qzonePollMinutes) || Number(draft.qzonePollMinutes) > 1440))
			}))) : null, ready ? h("div", { className: "onebot-card" }, h("div", { className: "onebot-card-head" }, h("h3", { className: "onebot-card-title" }, t("budgetCardTitle")), h("p", { className: "onebot-card-desc" }, t("budgetsHint"))), h("div", { className: "onebot-grid" }, BUDGET_KEYS.map((key) => field(key, t(key), void 0, stepper(key))))) : null, h("p", { className: "onebot-note" }, t("connHint")), ready ? h("div", { className: "onebot-foot" }, error !== "" ? h("p", {
				className: "onebot-note",
				style: { color: "var(--dsw-alias-label-error)" }
			}, error) : saved ? h("p", { className: "onebot-note" }, t("runtimeSaved")) : null, h(Button, {
				variant: "outline",
				disabled: !dirty || saving,
				onClick: () => {
					setDraft({});
					setError("");
					setSaved(false);
				}
			}, t("discard")), h(Button, {
				variant: "primary",
				disabled: !dirty || invalid || saving,
				onClick: save
			}, saving ? t("saving") : t("save"))) : null);
		}

		const inject = [
			"slots",
			"locale",
			"connection"
		];
		const styleId = "dsh-onebot-settings";
		if (!document.querySelector(`style[data-plugin-css="${styleId}"]`)) {
			const style = document.createElement("style");
			style.dataset.pluginCss = styleId;
			style.textContent = `.onebot-settings-chevron{flex:none;color:var(--dsw-alias-label-tertiary);transition:transform .16s}
.onebot-settings-chevron-open{transform:rotate(180deg)}
.onebot-page{display:flex;flex-direction:column;gap:18px;max-width:860px;margin:0 auto;padding:18px 22px 48px;box-sizing:border-box;color:var(--dsw-alias-label-primary)}
.onebot-head{display:flex;flex-direction:column;gap:6px;padding:0 2px}
.onebot-title{margin:0;font-size:18px;font-weight:650;line-height:1.4}
.onebot-intro{margin:0;font-size:12.5px;line-height:1.65;color:var(--dsw-alias-label-secondary)}
.onebot-meta{display:flex;align-items:flex-start;gap:8px;margin-top:2px}
.onebot-pill{flex:none;margin-top:1px;border-radius:999px;padding:1px 8px;font-size:11px;line-height:17px;background:var(--dsw-alias-bg-module-platform);color:var(--dsw-alias-label-secondary)}
.onebot-meta-text{flex:1;min-width:0;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-tertiary)}
.onebot-card{border:1px solid var(--dsw-alias-border-l2);border-radius:14px;background:var(--dsw-alias-bg-layer-2);padding:18px 20px}
.onebot-card-head{display:flex;flex-direction:column;gap:4px;margin-bottom:8px}
.onebot-card-title{margin:0;font-size:14.5px;font-weight:600;line-height:1.4}
.onebot-card-desc{margin:0;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-tertiary)}
.onebot-cap{display:flex;gap:12px;padding:9px 0;border-top:1px solid var(--dsw-alias-border-l2);font-size:12.5px;line-height:1.6}
.onebot-card-head+.onebot-cap{border-top:0}
.onebot-cap-label{flex:none;width:72px;font-weight:600;color:var(--dsw-alias-label-primary)}
.onebot-cap-text{flex:1;min-width:0;color:var(--dsw-alias-label-secondary)}
.onebot-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:0 20px}
.onebot-field{display:flex;flex-direction:column;gap:6px;padding:9px 0}
.onebot-label{font-size:13px;font-weight:500;line-height:1.5;color:var(--dsw-alias-label-primary)}
.onebot-hint{font-size:11.5px;line-height:1.55;color:var(--dsw-alias-label-tertiary)}
.onebot-stepper{display:flex;align-items:stretch;height:34px;border:1px solid var(--dsw-alias-border-l2);border-radius:8px;background:var(--dsw-alias-bg-layer-3);overflow:hidden}
.onebot-step{flex:none;width:34px;border:0;background:transparent;color:var(--dsw-alias-label-secondary);font:inherit;font-size:15px;line-height:1;cursor:pointer}
.onebot-step:hover{background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary)}
.onebot-step-input{flex:1;min-width:0;width:100%;border:0;border-left:1px solid var(--dsw-alias-border-l2);border-right:1px solid var(--dsw-alias-border-l2);background:transparent;color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;text-align:center;outline:none}
.onebot-napcat{display:flex;align-items:center;justify-content:space-between;gap:12px;padding-top:6px}
.onebot-napcat-state{flex:1;min-width:0;font-size:12.5px;line-height:1.6;color:var(--dsw-alias-label-secondary)}
.onebot-note{flex:1;margin:0;font-size:12px;line-height:1.6;color:var(--dsw-alias-label-tertiary)}
.onebot-foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding-top:2px}`;
			document.head.append(style);
		}
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "onebot: settings locale");
			const t = ctx.locale.bind(NS), scope = controller(), runtimeScope = runtimeController();
			ctx.effect(() => ctx.on("connection/reset", () => {
				void scope.load();
				void runtimeScope.load();
				void runtimeScope.napcatRefresh();
			}), "onebot: refresh settings after reconnect");
			ctx.slots.inject("settings.plugin.item", function* () {
				yield ctx.slots.register({
					name: "settings.plugin.item",
					key: "onebot",
					locale: NS
				}, () => /* @__PURE__ */ React.createElement(Card, {
					t,
					scope
				}));
			});
			// 左栏独立入口：能力说明 + 目录 + 配额。连接参数仍旧留在「内置插件 → OneBot」
			// 那张卡里——那条路会重建插件，和这里的即时生效不是一回事，不该混在一起。
			ctx.slots.inject("settings.section", function* () {
				yield ctx.slots.register({
					name: "settings.section",
					id: "onebot",
					order: 50,
					label: () => t("sectionLabel"),
					locale: NS
				}, () => /* @__PURE__ */ React.createElement(OneBotPage, {
					t,
					scope: runtimeScope
				}));
			});
		}
		return {
			inject,
			apply
		};
	}
});

//#endregion