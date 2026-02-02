/*:
 * @target MZ
 * @plugindesc v2.1.09 TPBリアルタイム(AP)操作 + 戦闘トリガー(味方/敵/回避/敗北/逃走)コモンイベント + 特定行動トリガー(可変/パラメータ/前後コモン) + 直前行動コンテキスト + パリィ + BBW(行動別) (ログ強化)
 * @author M.I.P

 * @param StallRescueMode
 * @text 充填停止RESCUE方式
 * @type select
 * @option 即時行動（actNow）
 * @value actNow
 * @option 充填リセット（chargeReset）
 * @value chargeReset
 * @desc 敵が charged のまま行動開始しない稀な停止を検出したときの回復方式。
 * @default actNow
 *
 * @command SetUIVisible
 * @text 各UIの表示ON/OFF
 * @desc 戦闘中のみ有効。戦闘終了時に自動でONに戻ります。
 *
 * @arg ui
 * @text 対象UI
 * @type select
 * @option 全UI
 * @value all
 * @option コマンドアイコン
 * @value icons
 * @option ターゲットヒント
 * @value hint
 * @default all
 *
 * @arg visible
 * @text 表示する
 * @type boolean
 * @on ON
 * @off OFF
 * @default true
 *
 * @command AdjustAp
 * @text AP増減
 * @desc 戦闘中のみ有効。操作対象アクターのAPを増減します。
 *
 * @arg mode
 * @text 増減
 * @type select
 * @option 増加
 * @value add
 * @option 減少
 * @value sub
 * @default add
 *
 * @arg value
 * @text 数値
 * @type number
 * @min 0
 * @default 0
 *
 * @command SetParryAnimation
 * @text パリィ成功時アニメ変更
 * @desc パリィ成功時に「パリィされた敵」に再生するアニメIDを変更します(永続)。0で無効。
 *
 * @arg animationId
 * @text アニメID
 * @type animation
 * @default 0
 *
 * @command SetParryCommonEvent
 * @text パリィ成功時コモンイベント変更
 * @desc パリィ成功時に予約するコモンイベントIDを変更します(永続)。被ダメージ処理より先に予約されます。0で無効。
 *
 * @arg commonEventId
 * @text コモンイベントID
 * @type common_event
 * @default 0
 *

 * @command DebugCopyLog
 * @text デバッグログをコピー
 * @desc 収集したデバッグログをクリップボードへコピーします（NW.js環境）。
 *
 * @command DebugClearLog
 * @text デバッグログをクリア
 * @desc 収集したデバッグログをクリアします。
*
* @command SetActionEndDelayedCommon
* @text アクション後遅延コモン設定
* @desc プレイヤーに対するアクション(攻撃/防御/被弾など)終了後、TBPが指定フレーム進行したらコモンイベントを実行します（戦闘中のみ）。
*
* @arg enabled
* @text 有効
* @type boolean
* @on ON
* @off OFF
* @default true
*
* @arg frames
* @text 遅延フレーム
* @type number
* @min 0
* @default 60
*
* @arg commonEventId
* @text コモンイベントID
* @type common_event
* @default 0
*
* @arg writeToVariable
* @text 変数へ書き込む
* @type boolean
* @on 書き込む
* @off 書き込まない
* @default true
*
*
*
* @param === Guard Skill Override ===
* @default
*
* @param GuardSkillId
* @text 防御コマンド用スキルID
* @type skill
* @default 0
* @desc 防御コマンド(Xキー/ガード)で使用するスキルID。0でデフォルト(ツクールの防御/クラス設定)を使用。設定はセーブデータに保存されます。
*
* @param === Frame State Control ===
* @default
*
* @param StateKeepFrameTagEnable
* @text <StateKeepFrame:n>を有効
* @type boolean
* @on 有効
* @off 無効
* @default true
* @desc ステートのメモ欄に<StateKeepFrame:n>がある場合、TBPがnフレーム進むまで自然消滅(ターン/行動終了)しません。
*
* @param === ActionEnd Delayed Common ===
* @default
*
* @param ActionEndDelayEnable
* @text アクション後遅延コモンを有効
* @type boolean
* @on 有効
* @off 無効
* @default false
*
* @param ActionEndDelayFrames
* @text アクション後遅延フレーム
* @type number
* @min 0
* @default 60
*
* @param ActionEndDelayCommonEventVarId
* @text 遅延コモンIDの変数
* @type variable
* @default 0
* @desc ここで指定した変数の値を「実行するコモンイベントID」として使用します。0なら固定ID(プラグインコマンドで指定)を使用。
*
* @param ActionEndDelayCommonEventId
* @text 遅延コモンID(固定)
* @type common_event
* @default 0
* @desc 変数IDが0のときに使用する固定コモンイベントID。
 * @param === AP & Realtime Control ===
 * @default
 *
 * @param EnableRealtimeControl
 * @text リアルタイム操作を有効
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 *
 * @param DebugLog
 * @text デバッグログ出力
 * @type boolean
 * @on 出す
 * @off 出さない
 * @default false
 * @desc trueで起動時に主要設定をconsoleに出力します。
 *

 * @param AttackCommandSkillId
 * @text 攻撃コマンド用スキルID
 * @type skill
 * @default 0
 * @desc 0なら従来通り。1以上で「攻撃」実行時のスキルIDをこの値に置換します（安定性優先で最終段で差し替え）。
 *
 * @param SelectingSpeedVarId
 * @text 選択中速度の変数
 * @desc ウィンドウ選択中（スキル/アイテム/対象選択など）の戦闘速度を、変数の値(%)で上書きします。0ならプラグイン内設定を使用。
 * @type variable
 * @default 0
 * @param ApVariableId
 * @text AP格納変数
 * @type variable
 * @default 0
 * @desc APを格納するゲーム変数ID。
 *
 * @param MaxApVariableId
 * @text 最大AP格納変数
 * @type variable
 * @default 0
 * @desc 最大APを格納するゲーム変数ID。

 * @param ApRegenVariableId
 * @text AP回復量の変数
 * @type variable
 * @default 0
 * @desc 1ターン(=TPB満タン到達)につき1回だけAPに加算する回復量を格納したゲーム変数ID。
 *
 * @param BattleStartApVariableId
 * @text 戦闘開始時AP数の変数
 * @type variable
 * @default 0
 * @desc 戦闘開始時にAP格納変数へ代入する「開始AP数」を格納したゲーム変数ID。0なら0で開始。
 *

 * @param ControlActorIndex
 * @text 操作対象の味方インデックス
 * @type number
 * @min 1
 * @default 1
 * @desc 1=先頭メンバー。指定した味方のみAP・リアルタイム操作の対象。
 *
 * @param ShowApInName
 * @text 名前にAPを表示
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default false
 *
 * @param AttackApCost
 * @text 攻撃APコスト
 * @type number
 * @min 0
 * @default 2
 *
 * @param GuardApCost
 * @text 防御APコスト
 * @type number
 * @min 0
 * @default 1

 * @param GuardSeMode
 * @text 防御SE種別
 * @type select
 * @option 無音
 * @value none
 * @option OK
 * @value ok
 * @option 回復
 * @value recovery
 * @option カスタム
 * @value custom
 * @default ok
 * @desc 防御(X)実行時に鳴らすSEの種別。

 * @param GuardSeName
 * @text 防御SEファイル
 * @type file
 * @dir audio/se
 * @default 
 * @desc GuardSeModeがcustomのときに使用するSEファイル名。

 * @param GuardSeVolume
 * @text 防御SE音量
 * @type number
 * @min 0
 * @max 100
 * @default 90

 * @param GuardSePitch
 * @text 防御SEピッチ
 * @type number
 * @min 50
 * @max 150
 * @default 100

 * @param GuardSePan
 * @text 防御SEパン
 * @type number
 * @min -100
 * @max 100
 * @default 0

 * @param AttackHardStopEnable
 * @text 攻撃のHardStop有効
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * @desc Z長押し派生検知中のHardStop(時間停止)を有効にします。

 * @param GuardHardStopEnable
 * @text 防御のHardStop有効
 * @type boolean
 * @on 有効
 * @off 無効
 * @default false
 * @desc 防御(X)実行時に短いHardStop(時間停止)を行います。

 * @param GuardHardStopFrames
 * @text 防御HardStopフレーム
 * @type number
 * @min 1
 * @default 6
 * @desc GuardHardStopEnableが有効のとき、停止させるフレーム数。

 * @param === Parry ===
 * @text === パリィ ===
 * @default

 * @param ParryWindowFrames
 * @text パリィ受付フレーム
 * @type number
 * @min 1
 * @default 10
 * @desc 防御(X)を実行した直後、このフレーム数だけパリィ受付を行います。

 * @param ParryWindowVarId
 * @text パリィ受付フレーム変数
 * @type variable
 * @default 0
 * @desc 0以外なら、この変数の値をパリィ受付フレームとして使用します(スキル等で強化可能)。

 
 *
 * @param ParryFrameCounterEnable
 * @text パリィ残フレーム表示
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default false
 * @desc パリィ受付中(残フレーム>0)のとき、残りフレーム数を画面に表示します。
 *
 * @param ParryFrameCounterX
 * @text パリィ残フレーム表示 X
 * @type number
 * @min -9999
 * @default 0
 * @desc 画面基準のX座標。
 *
 * @param ParryFrameCounterY
 * @text パリィ残フレーム表示 Y
 * @type number
 * @min -9999
 * @default 0
 * @desc 画面基準のY座標。
 *
 * @param ParryFrameCounterFontSize
 * @text パリィ残フレーム表示 フォントサイズ
 * @type number
 * @min 6
 * @default 20
* @param ParryDamageRate
 * @text パリィ成功 被ダメージ率
 * @type number
 * @decimals 2
 * @min 0
 * @max 1
 * @default 0.25
 * @desc パリィ成功時の被ダメージ倍率(0.25=25%)。防御より優先して適用されます。

 * @param ParrySuccessCommonEvent
 * @text パリィ成功 コモンイベント
 * @type common_event
 * @default 0
 * @desc パリィ成功時に予約するコモンイベントID。被ダメージ処理より先に予約されます。0で無効。

 * @param ParryApRecover
 * @text パリィ成功 AP回復量
 * @type number
 * @min 0
 * @default 0
 * @desc 将来用：パリィ成功時にAPへ加算する量。

 * @param ParrySuccessAnimationId
 * @text パリィ成功 敵アニメID
 * @type animation
 * @default 0
 * @desc パリィ成功時に「パリィされた敵(=攻撃者)」へ再生するアニメID。0で無効。

 *
 
 *
 * @param ParryCounterSkillVariableId
 * @text パリィ成功 カウンタースキルID変数
 * @type variable
 * @default 0
 * @desc パリィ成功時に「カウンターとして強制発動するスキルID」を入れておく変数ID。0で無効。APは消費しません(既存挙動は維持)。
* @param ZLongPressDeriveFrames
 * @text Z長押し派生フレーム
 * @type number
 * @min 1
 * @default 20
 * @desc Z(OK)をこのフレーム数以上長押しした場合、Z長押し派生スキルを使用します。
 *
 * @param ZLongPressDeriveSkill
 * @text Z長押し派生スキル
 * @type skill
 * @default 0
 * @desc 長押しで発動するスキルID。0なら長押し派生を無効(従来通りZ即攻撃)。

 *
 * @param ZLongPressDeriveApCost
 * @text Z長押し派生APコスト
 * @type number
 * @min 0
 * @default 2
 * @desc Z長押し派生スキルのAPコスト。消費は対象決定時(既存仕様)。
 *
 * @param EnableEscapeKey
 * @text ESCで逃走(確認なし)
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true


 * @param === Command Icons ===
 * @text === コマンドアイコン ===
 * @default
 *
 * @param IconPressScale
 * @text 押下時縮小率
 * @type number
 * @decimals 2
 * @min 0.1
 * @max 1.0
 * @default 0.90
 * @desc 対応キー/クリックで押した瞬間にこの倍率まで縮小します。
 *
 * @param IconPressFrames
 * @text 押下縮小フレーム
 * @type number
 * @min 1
 * @default 6
 * @desc 縮小状態を維持するフレーム数。
 *
 * @param AttackIconImage
 * @text 攻撃アイコン画像
 * @type file
 * @dir img/pictures/
 * @default
 *
 * @param AttackIconX
 * @text 攻撃X
 * @type number
 * @default 0
 *
 * @param AttackIconY
 * @text 攻撃Y
 * @type number
 * @default 0
 *
 * @param AttackIconDisableR
 * @text 攻撃 無効色R
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param AttackIconDisableG
 * @text 攻撃 無効色G
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param AttackIconDisableB
 * @text 攻撃 無効色B
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param AttackIconClickSizeOffsetX
 * @text 攻撃 クリックサイズオフセットX
 * @type number
 * @default 0
 * @desc 画像幅からこの数値を減算します。
 *
 * @param AttackIconClickSizeOffsetY
 * @text 攻撃 クリックサイズオフセットY
 * @type number
 * @default 0
 * @desc 画像高さからこの数値を減算します。
 *
 * @param AttackIconClickPosOffsetX
 * @text 攻撃 クリック位置オフセットX
 * @type number
 * @default 0
 *
 * @param AttackIconClickPosOffsetY
 * @text 攻撃 クリック位置オフセットY
 * @type number
 * @default 0
 *
 * @param AttackIconShowOnlyWhenExecutable
 * @text 攻撃 実行可能時のみ表示
 * @type boolean
 * @on はい
 * @off いいえ
 * @default false
 * @desc ONの場合、実行可能な時だけ表示します（不可なら非表示）。OFFの場合、常に表示します。
 *
 * @param GuardIconImage
 * @text 防御アイコン画像
 * @type file
 * @dir img/pictures/
 * @default
 *
 * @param GuardIconX
 * @text 防御X
 * @type number
 * @default 0
 *
 * @param GuardIconY
 * @text 防御Y
 * @type number
 * @default 0
 *
 * @param GuardIconDisableR
 * @text 防御 無効色R
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param GuardIconDisableG
 * @text 防御 無効色G
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param GuardIconDisableB
 * @text 防御 無効色B
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param GuardIconClickSizeOffsetX
 * @text 防御 クリックサイズオフセットX
 * @type number
 * @default 0
 *
 * @param GuardIconClickSizeOffsetY
 * @text 防御 クリックサイズオフセットY
 * @type number
 * @default 0
 *
 * @param GuardIconClickPosOffsetX
 * @text 防御 クリック位置オフセットX
 * @type number
 * @default 0
 *
 * @param GuardIconClickPosOffsetY
 * @text 防御 クリック位置オフセットY
 * @type number
 * @default 0
 *
 * @param GuardIconShowOnlyWhenExecutable
 * @text 防御 実行可能時のみ表示
 * @type boolean
 * @on はい
 * @off いいえ
 * @default false
 * @desc ONの場合、実行可能な時だけ表示します（不可なら非表示）。OFFの場合、常に表示します。
 *
 * @param SkillIconImage
 * @text スキルアイコン画像
 * @type file
 * @dir img/pictures/
 * @default
 *
 * @param SkillIconX
 * @text スキルX
 * @type number
 * @default 0
 *
 * @param SkillIconY
 * @text スキルY
 * @type number
 * @default 0
 *
 * @param SkillIconDisableR
 * @text スキル 無効色R
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param SkillIconDisableG
 * @text スキル 無効色G
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param SkillIconDisableB
 * @text スキル 無効色B
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param SkillIconClickSizeOffsetX
 * @text スキル クリックサイズオフセットX
 * @type number
 * @default 0
 *
 * @param SkillIconClickSizeOffsetY
 * @text スキル クリックサイズオフセットY
 * @type number
 * @default 0
 *
 * @param SkillIconClickPosOffsetX
 * @text スキル クリック位置オフセットX
 * @type number
 * @default 0
 *
 * @param SkillIconClickPosOffsetY
 * @text スキル クリック位置オフセットY
 * @type number
 * @default 0
 *
 * @param SkillIconShowOnlyWhenExecutable
 * @text スキル 実行可能時のみ表示
 * @type boolean
 * @on はい
 * @off いいえ
 * @default false
 * @desc ONの場合、実行可能な時だけ表示します（不可なら非表示）。OFFの場合、常に表示します。
 *
 * @param ItemIconImage
 * @text アイテムアイコン画像
 * @type file
 * @dir img/pictures/
 * @default
 *
 * @param ItemIconX
 * @text アイテムX
 * @type number
 * @default 0
 *
 * @param ItemIconY
 * @text アイテムY
 * @type number
 * @default 0
 *
 * @param ItemIconDisableR
 * @text アイテム 無効色R
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param ItemIconDisableG
 * @text アイテム 無効色G
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param ItemIconDisableB
 * @text アイテム 無効色B
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param ItemIconClickSizeOffsetX
 * @text アイテム クリックサイズオフセットX
 * @type number
 * @default 0
 *
 * @param ItemIconClickSizeOffsetY
 * @text アイテム クリックサイズオフセットY
 * @type number
 * @default 0
 *
 * @param ItemIconClickPosOffsetX
 * @text アイテム クリック位置オフセットX
 * @type number
 * @default 0
 *
 * @param ItemIconClickPosOffsetY
 * @text アイテム クリック位置オフセットY
 * @type number
 * @default 0
 *
 * @param ItemIconShowOnlyWhenExecutable
 * @text アイテム 実行可能時のみ表示
 * @type boolean
 * @on はい
 * @off いいえ
 * @default false
 * @desc ONの場合、実行可能な時だけ表示します（不可なら非表示）。OFFの場合、常に表示します。
 *
 * @param TargetIconImage
 * @text ターゲット選択アイコン画像
 * @type file
 * @dir img/pictures/
 * @default
 *
 * @param TargetIconX
 * @text ターゲットX
 * @type number
 * @default 0
 *
 * @param TargetIconY
 * @text ターゲットY
 * @type number
 * @default 0
 *
 * @param TargetIconDisableR
 * @text ターゲット 無効色R
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param TargetIconDisableG
 * @text ターゲット 無効色G
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param TargetIconDisableB
 * @text ターゲット 無効色B
 * @type number
 * @min 0
 * @max 255
 * @default 128
 *
 * @param TargetIconClickSizeOffsetX
 * @text ターゲット クリックサイズオフセットX
 * @type number
 * @default 0
 *
 * @param TargetIconClickSizeOffsetY
 * @text ターゲット クリックサイズオフセットY
 * @type number
 * @default 0
 *
 * @param TargetIconClickPosOffsetX
 * @text ターゲット クリック位置オフセットX
 * @type number
 * @default 0
 *
 * @param TargetIconClickPosOffsetY
 * @text ターゲット クリック位置オフセットY
 * @type number
 * @default 0
 *

 * @param === Focus Target Hint ===
 * @text === ターゲットヒント表示 ===
 * @default
 *
 * @param FocusHintEnabled
 * @text ターゲットヒント表示ON/OFF
 * @type boolean
 * @on 表示する
 * @off 表示しない
 * @default true

 *
 * @param FocusHintLabelText
 * @text ラベル文言
 * @type string
 * @default TARGET:
 * @desc 表示するラベル文言。例: TARGET: / 対象:
 *
 * @param FocusHintAutoAdvance
 * @text フォーカス敵が死亡したら自動で次へ
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 *
 * @param FocusHintAutoFit
 * @text ヒント枠の自動拡張
 * @type boolean
 * @on 有効
 * @off 無効
 * @default true
 * @desc 文字が見切れる場合、必要最小サイズまで自動でウィンドウを拡張します(縮小はしません)。
 *
 * @param FocusHintFontSize
 * @text ヒント文字サイズ
 * @type number
 * @min 1
 * @default 22
 * @desc TARGET/敵名の文字サイズ(px)。
 *
 * @param FocusHintTargetX
 * @text TARGET X
 * @type number
 * @min -9999
 * @default 0
 *
 * @param FocusHintTargetY
 * @text TARGET Y
 * @type number
 * @min -9999
 * @default 0
 *
 * @param FocusHintEnemyX
 * @text 敵名 X
 * @type number
 * @min -9999
 * @default 120
 *
 * @param FocusHintEnemyY
 * @text 敵名 Y
 * @type number
 * @min -9999
 * @default 0
 *
 * @param FocusHintWindowX
 * @text ヒントウィンドウ X
 * @type number
 * @min -9999
 * @default 0
 *
 * @param FocusHintWindowY
 * @text ヒントウィンドウ Y
 * @type number
 * @min -9999
 * @default 0
 *
 * @param FocusHintWindowW
 * @text ヒントウィンドウ 幅
 * @type number
 * @min 1
 * @default 240
 *
 * @param FocusHintWindowH
 * @text ヒントウィンドウ 高さ
 * @type number
 * @min 1
 * @default 48
 * @desc 1行表示が収まる高さを指定してください。
 *
 * @param === Common Events (Actors) ===
 * @default
 *
 * @param ActorAttackCommonEvent
 * @text [味方]攻撃時
 * @type common_event
 * @default 0
 *
 * @param ActorGuardCommonEvent
 * @text [味方]防御時
 * @type common_event
 * @default 0
 *
 * @param ActorSkillCommonEvent
 * @text [味方]スキル使用時(攻撃/防御以外)
 * @type common_event
 * @default 0
 *
 * @param ActorItemCommonEvent
 * @text [味方]アイテム使用時
 * @type common_event
 * @default 0
 *
 * @param ActorDamagedCommonEvent
 * @text [味方]被ダメージ時(HP減少)
 * @type common_event
 * @default 0
 *
 * @param ActorKnockoutCommonEvent
 * @text [味方]戦闘不能時
 * @type common_event
 * @default 0
 *
 * @param ActorEvadeCommonEvent
 * @text [味方]回避時
 * @type common_event
 * @default 0
 *
 * @param === Common Events (Enemies) ===
 * @default
 *
 * @param EnemyAttackCommonEvent
 * @text [敵]攻撃時
 * @type common_event
 * @default 0
 *
 * @param EnemyGuardCommonEvent
 * @text [敵]防御時
 * @type common_event
 * @default 0
 *
 * @param EnemySkillCommonEvent
 * @text [敵]スキル使用時(攻撃/防御以外)
 * @type common_event
 * @default 0
 *
 * @param EnemyItemCommonEvent
 * @text [敵]アイテム使用時
 * @type common_event
 * @default 0
 *
 * @param EnemyDamagedCommonEvent
 * @text [敵]被ダメージ時(HP減少)
 * @type common_event
 * @default 0
 *
 * @param EnemyKnockoutCommonEvent
 * @text [敵]戦闘不能時
 * @type common_event
 * @default 0
 *
 * @param EnemyEvadeCommonEvent
 * @text [敵]回避時
 * @type common_event
 * @default 0
 *
 * @param === Common Events (Battle Result) ===
 * @default
 *
 * @param BattleLoseCommonEvent
 * @text 敗北時
 * @type common_event
 * @default 0
 *
 * @param EscapeSuccessCommonEvent
 * @text 逃走成功時
 * @type common_event
 * @default 0
 *
 * @param === Special Action Triggers ===
 * @default
 *
 * @param SpecialUseTriggers
 * @text 特定行動トリガー(使用時)
 * @type struct<SpecialUseTrigger>[]
 * @default []
 * @desc 行動「使用時」に一致したらコモンイベントを呼びます（行動1回につき1回）。スキルID/アイテムID/攻撃/防御などで条件を増やせます。
 *
 * @param SpecialResultTriggers
 * @text 特定行動トリガー(結果/命中・回避)
 * @type struct<SpecialResultTrigger>[]
 * @default []
 * @desc 行動結果に一致したらコモンイベントを呼びます（対象ごとに判定＝全体攻撃は複数回の可能性）。命中/回避/クリティカル等で分岐可能。
 *
 * 
 * @param === Battle Wait (Per Action) ===
 * @text === バトルウェイト（行動別）===
 * @desc keke_SpeedStarBattle の「基本バトルウェイト」相当を、行動別に適用します。0で停止しません。既存演出を壊さないため、デフォルトは全てOFFです。
 *
 * @param BBW_AttackEnabled
 * @text 攻撃に適用
 * @parent === Battle Wait (Per Action) ===
 * @type boolean
 * @on ON
 * @off OFF
 * @default false
 *
 * @param BBW_AttackFrames
 * @text 攻撃 基本バトルウェイト(フレーム)
 * @parent === Battle Wait (Per Action) ===
 * @type number
 * @min 0
 * @default 0
 *
 * @param BBW_GuardEnabled
 * @text 防御に適用
 * @parent === Battle Wait (Per Action) ===
 * @type boolean
 * @on ON
 * @off OFF
 * @default false
 *
 * @param BBW_GuardFrames
 * @text 防御 基本バトルウェイト(フレーム)
 * @parent === Battle Wait (Per Action) ===
 * @type number
 * @min 0
 * @default 0
 *
 * @param BBW_SkillEnabled
 * @text スキルに適用
 * @parent === Battle Wait (Per Action) ===
 * @type boolean
 * @on ON
 * @off OFF
 * @default false
 *
 * @param BBW_SkillFrames
 * @text スキル 基本バトルウェイト(フレーム)
 * @parent === Battle Wait (Per Action) ===
 * @type number
 * @min 0
 * @default 0
 *
 * @param BBW_ItemEnabled
 * @text アイテムに適用
 * @parent === Battle Wait (Per Action) ===
 * @type boolean
 * @on ON
 * @off OFF
 * @default false
 *
 * @param BBW_ItemFrames
 * @text アイテム 基本バトルウェイト(フレーム)
 * @parent === Battle Wait (Per Action) ===
 * @type number
 * @min 0
 * @default 0

@help
 * APRealtimeBattle_AllInOne.js
 *
 * ■全部入り内容
 * 1) 指定アクターにAP(行動力)を持たせ、TPB相対速度に応じてチャージ
 * 2) リアルタイム入力
 *    - ←→：敵フォーカス切り替え（敵が2体以上の時）
 *    - Z(OK)：攻撃（AP消費）
 *    - X(CANCEL)：防御（AP消費）
 *    - ESC：逃走（確認なし、100%成功。ただし逃走不可戦闘は不可）
 * 3) 味方/敵の以下トリガーでコモンイベントを予約
 *    - 攻撃/防御/スキル/アイテム
 *    - 被ダメージ（HP減少）
 *    - 戦闘不能
 *    - 回避
 *    - 敗北 / 逃走成功
 * 4) 直前の行動情報を BattleActionCE に保存（コモンイベント内スクリプトで参照）
 * 5) 「特定の行動に反応」＝プラグインパラメータで増やせる SpecialUseTriggers / SpecialResultTriggers
 *
 * ■BattleActionCE（コモンイベントから参照）
 *  BattleActionCE.lastUserType()          // "actor"/"enemy"/null
 *  BattleActionCE.lastUserActorId()
 *  BattleActionCE.lastUserEnemyIndex()
 *  BattleActionCE.lastTargetType()        // "actor"/"enemy"/null
 *  BattleActionCE.lastTargetActorId()
 *  BattleActionCE.lastTargetEnemyIndex()
 *  BattleActionCE.lastSkillId()
 *  BattleActionCE.lastItemId()
 *  BattleActionCE.lastIsSkill()
 *  BattleActionCE.lastIsItem()
 *  BattleActionCE.lastIsHit()
 *  BattleActionCE.lastIsEvaded()
 *  BattleActionCE.lastIsCritical()
 *
 * ■特定行動トリガーの使い方（例）
 *  - 敵がスキルID15を「使用した瞬間」にコモンイベント20：
 *    SpecialUseTriggers に
 *      Side=enemy, UseType=skill, SkillKind=any, DataId=15, CommonEventId=20
 *
 *  - 味方アクターID3が「攻撃(通常攻撃)」した瞬間にコモンイベント21：
 *    Side=actor, ActorId=3, UseType=skill, SkillKind=attack, DataId=0, CommonEventId=21
 *
 *  - 敵のスキルID15が「回避された(対象が回避)」時にコモンイベント30：
 *    SpecialResultTriggers に
 *      Side=enemy, UseType=skill, SkillKind=any, DataId=15, Result=evaded, CommonEventId=30
 *
 * ■注意
 * - SpecialResultTriggers は「対象ごと」に判定します。全体攻撃は対象人数分呼ばれる可能性があります。
 * - 敗北/逃走成功のコモンイベントは画面遷移が早い構成だと見えない場合があります。
 *
 * ■利用規約
 * - 商用・非商用・18禁可、クレジット任意
 
 *
 * @param BeforeCommon_StopTime
 * @text 発動前/後コモン中 時間停止
 * @type boolean
 * @default true
 *
 * @param BeforeCommon_DisableInput
 * @text 発動前/後コモン中 入力無効化
 * @type boolean
 * @default true
 *
 * @param BeforeCommon_DebugLog
 * @text 発動前/後コモン ログ出力
 * @type boolean
 * @default false

*/
/*~struct~SpecialUseTrigger:
 * @param Side
 * @text 行動者サイド
 * @type select
 * @option actor
 * @option enemy
 * @option any
 * @default any
 *
 * @param ActorId
 * @text 行動者アクターID(任意)
 * @type number
 * @min 0
 * @default 0
 * @desc 0=指定なし。Side=actorの時だけ意味があります。
 *
 * @param EnemyId
 * @text 行動者エネミーID(任意)
 * @type number
 * @min 0
 * @default 0
 * @desc 0=指定なし。Side=enemyの時だけ意味があります（敵キャラのデータベースID）。
 *
 * @param UseType
 * @text 使用種別
 * @type select
 * @option skill
 * @option item
 * @option any
 * @default any
 *
 * @param SkillKind
 * @text スキル種別
 * @type select
 * @option any
 * @option attack
 * @option guard
 * @option other
 * @default any
 * @desc UseType=skill のときに使用。attack=通常攻撃、guard=防御、other=それ以外。
 *
 * @param DataId
 * @text スキル/アイテムID
 * @type number
 * @min 0
 * @default 0
 * @desc 0=指定なし(任意)。UseType=skillならスキルID、itemならアイテムID。
 *
 * @param BeforeCommonEventId
 * @text 発動前コモンイベント
 * @type common_event
 * @default 0
 * @desc 条件一致時、**ダメージ表示/ログ表示より前**（結果表示の直前）に実行します。0で無効。
 *
 * @param AfterCommonEventId
 * @text 発動後コモンイベント
 * @type common_event
 * @default 0
 * @desc 条件一致時、結果表示の後（安定性のため次フレーム）に予約します。0で無効。
 *
 * @param CommonEventId
 * @text 呼び出すコモンイベント(互換/発動前)
 * @type common_event
 * @default 0
 * @desc 旧仕様。発動前コモンイベントと同じタイミングで予約します。
*/
/*~struct~SpecialResultTrigger:
 * @param Side
 * @text 行動者サイド
 * @type select
 * @option actor
 * @option enemy
 * @option any
 * @default any
 *
 * @param ActorId
 * @text 行動者アクターID(任意)
 * @type number
 * @min 0
 * @default 0
 *
 * @param EnemyId
 * @text 行動者エネミーID(任意)
 * @type number
 * @min 0
 * @default 0
 *
 * @param TargetSide
 * @text 対象サイド(任意)
 * @type select
 * @option any
 * @option actor
 * @option enemy
 * @default any
 *
 * @param TargetActorId
 * @text 対象アクターID(任意)
 * @type number
 * @min 0
 * @default 0
 *
 * @param TargetEnemyId
 * @text 対象エネミーID(任意)
 * @type number
 * @min 0
 * @default 0
 *
 * @param UseType
 * @text 使用種別
 * @type select
 * @option skill
 * @option item
 * @option any
 * @default any
 *
 * @param SkillKind
 * @text スキル種別
 * @type select
 * @option any
 * @option attack
 * @option guard
 * @option other
 * @default any
 *
 * @param DataId
 * @text スキル/アイテムID
 * @type number
 * @min 0
 * @default 0
 *
 * @param Result
 * @text 結果条件
 * @type select
 * @option any
 * @option hit
 * @option parry
 * @option miss
 * @option evaded
 * @option critical
 * @default any
 * @desc hit=命中(パリィ除外),parry=パリィ成功、miss=ミス(命中しない)、evaded=回避、critical=クリティカル。
 *
 * @param BeforeCommonEventId
 * @text 発動前コモンイベント
 * @type common_event
 * @default 0
 * @desc 条件一致時、結果判定が終わった直後（Game_Action.apply完了直後）に予約します。既存の「呼び出すコモンイベント(互換)」と同タイミングです。
 *
 * @param AfterCommonEventId
 * @text 発動後コモンイベント
 * @type common_event
 * @default 0
 * @desc 条件一致時、結果判定の後で“次フレーム”に予約します（安定優先のため遅延実行）。対象ごとに判定されます。
 *
 * @param CommonEventId
 * @text 呼び出すコモンイベント(互換/発動前)
 * @type common_event
 * @default 0
 * @desc 旧仕様。発動前コモンイベントと同じタイミングで予約します。
 */

(() => {
  "use strict";

// NOTE:
//  - In RPGツクールMZ, plugin commands are looked up by "plugin name" (= the file base name).
//  - Users often rename plugin files for versioning, which breaks PluginManager.registerCommand
//    if we hardcode the name.
//  - Therefore we resolve PLUGIN_NAME from the currently executing script file name.
function _aprbResolvePluginName(defaultName) {
  try {
    const cs = document.currentScript;
    if (cs && cs.src) {
      const src = decodeURIComponent(cs.src);
      const m = src.match(/([^\/\\]+)\.js(?:\?.*)?$/i);
      if (m && m[1]) return String(m[1]);
    }
  } catch (e) {}
  return defaultName;
}
const PLUGIN_NAME = _aprbResolvePluginName("APRealtimeBattle_AllInOne");
  const _APRB_VERSION = 'v2.1.09-fix6x-r47-uiVisibilityLatch5-stallActNowKick1-forceBmAlwaysIfNotCalled-cinMsgInputFix1-iconHideLatch8';
  const _APRB_BUILD_DATE = "2026-01-23";
  const _APRB_BUILD = _APRB_BUILD_DATE;
  const _APRB_AUTHOR = "M.I.P";
  let _aprbVersionLogged = false;
  let _aprbEnvLogged = false;
  const p = PluginManager.parameters(PLUGIN_NAME);

  // ============================================================
  // Debug Log Buffer (No DevTools required)
  //  - Stores plain text lines (no collapsible objects).
  //  - Can be copied to clipboard via plugin command.
  // ============================================================

  const _APRB_DEBUG_ENABLED = String(p["DebugLog"] || "false") === "true";

  const _APRB_ATTACK_CMD_SKILL_ID = Number(p["AttackCommandSkillId"] || 0);

  // ============================================================
  // Attack Command Skill Override (final, stability-first)
  //  - If AttackCommandSkillId >= 1, replace "Attack" (skill #1) with the specified skill
  //  - Apply at the last moment (Game_Action.apply) so other plugins can't overwrite it easily
  //  - If 0:完全ノータッチ
  // ============================================================
  function _aprb_isForcedTurnSafe() {
    try {
      if (typeof BattleManager !== "undefined" && BattleManager && typeof BattleManager.isForcedTurn === "function") {
        return !!BattleManager.isForcedTurn();
      }
    } catch (e) {}
    return false;
  }

  function _aprb_forceAttackSkillIfNeeded(action) {
    try {
      if (!_APRB_ATTACK_CMD_SKILL_ID || _APRB_ATTACK_CMD_SKILL_ID <= 0) return;
      if (typeof $gameParty === "undefined" || !$gameParty || !$gameParty.inBattle()) return;
      if (!action || typeof action.isSkill !== "function" || !action.isSkill()) return;
      const item = (typeof action.item === "function") ? action.item() : null;
      if (!item || item.id !== 1) return; // only normal attack
      const subject = (typeof action.subject === "function") ? action.subject() : null;
      if (!subject || !subject.isActor || !subject.isActor()) return; // actor only
      if (_aprb_isForcedTurnSafe()) return;

      const newSkill = (typeof $dataSkills !== "undefined") ? $dataSkills[_APRB_ATTACK_CMD_SKILL_ID] : null;
      if (!newSkill) return; // safety fallback
      if (typeof action.setSkill === "function") action.setSkill(_APRB_ATTACK_CMD_SKILL_ID);
      // Keep internal Game_Item intact (avoid breaking action._item.object())
      if (action._item && typeof action._item.setObject === "function") action._item.setObject(newSkill);
    } catch (e) {}
  }

  (function() {
    if (typeof Game_Action === "undefined" || !Game_Action.prototype) return;
    if (Game_Action.prototype._aprbAttackCmdSkillPatched) return;
    Game_Action.prototype._aprbAttackCmdSkillPatched = true;

    const _APRB_Game_Action_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
      _aprb_forceAttackSkillIfNeeded(this);
      return _APRB_Game_Action_apply.call(this, target);
    };
  })();


  function _aprbDebugBuffer() {
    const w = (typeof window !== 'undefined') ? window : globalThis;
    if (!w.__APRB_DEBUG_BUFFER) w.__APRB_DEBUG_BUFFER = [];
    return w.__APRB_DEBUG_BUFFER;
  }

  function _aprbDbg(line) {
    if (!_APRB_DEBUG_ENABLED) return;
    const buf = _aprbDebugBuffer();
    // keep size reasonable
    if (buf.length > 6000) buf.splice(0, buf.length - 6000);
    buf.push(String(line));
  }
// HALT系ログは DebugLog=false でも必ずバッファに残す（原因特定の最短ルート）
function _aprbHaltLog(line) {
  const buf = _aprbDebugBuffer();
  if (buf.length > 6000) buf.splice(0, buf.length - 6000);
  const s0 = String(line);
  const s = (s0.startsWith('[APRB-HALT]') || s0.startsWith('[APRB-HALT]['))
    ? s0.replace('[APRB-HALT]', '[APRB-HALT ' + _APRB_VERSION + ']')
    : s0;
  buf.push(s);
  try { console.log(s); } catch (e) {}
}


function _aprbLogVersionOnce() {
  if (_aprbVersionLogged) return;
  _aprbVersionLogged = true;
  _aprbHaltLog("[APRB][VERSION] name=" + PLUGIN_NAME +
    " version=" + _APRB_VERSION + " build=" + _APRB_BUILD + " author=" + _APRB_AUTHOR);
}
_aprbLogVersionOnce();

// --- Stall watchdog (enemy charged but never starts action) -----------------

const _APRB_STALL_WD_MODE = String(p["StallRescueMode"] || "actNow");
const _APRB_STALL_WD_THRESHOLD = 30; // frames (~0.5s at 60fps) - recovery trigger for rare stall
let _aprbStallWdUidSeq = 1;
function _aprbStallWdUid(battler) {
  if (!battler) return 0;
  if (battler._aprbStallWdUid == null) battler._aprbStallWdUid = (_aprbStallWdUidSeq++);
  return battler._aprbStallWdUid;
}
function _aprbStallWatchdog(BM) {
  try {
    if (!BM) return;
    // Skip during battle-end processing or explicit time stop.
    if (BM._phase === "battleEnd") return;
    if (BM._aprbTimeStop) return;

    const enemies = ($gameTroop && $gameTroop.members) ? $gameTroop.members() : null;
    if (!enemies || !enemies.length) return;

    // Avoid forcing while another action is actively being processed.
    // (If other plugins return true too aggressively, we still won't touch in that case.)
    if (BM._subject) return;
    if (BM.isBusy && BM.isBusy()) return;

    if (!BM._aprbStallWd) BM._aprbStallWd = { c: Object.create(null), lastKickF: 0 };
    const st = BM._aprbStallWd;

    for (const e of enemies) {
      if (!e || !e.isAlive || !e.isAlive()) continue;

      const uid = _aprbStallWdUid(e);
      const charged = !!(e.isTpbCharged && e.isTpbCharged());
      const acting  = !!(e.isActing && e.isActing());
      const canMove = !!(e.canMove && e.canMove());
      const restricted = !!(e.isRestricted && e.isRestricted());

      if (charged && !acting && canMove && !restricted) {
        st.c[uid] = (st.c[uid] || 0) + 1;

        if (st.c[uid] >= _APRB_STALL_WD_THRESHOLD) {
          // Stall detected: enemy is charged but never starts action (rare TPB stall).
          // Recovery is best-effort and guarded.
          st.c[uid] = 0;
          st.lastKickF = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Graphics.frameCount : 0;

          const _aprbMode = (_APRB_STALL_WD_MODE || "actNow");
          if (_aprbMode === "actNow") {
            // Kick-start the action immediately (do NOT parry-cancel / do NOT reset charge).
            // This is the "least surprise" recovery: if the action was about to happen, make it happen now.
            try {
              if (e._actions && e._actions.length === 0 && e.makeActions) e.makeActions();
            } catch (err) {}
            try {
              if (typeof BattleManager !== "undefined" && BattleManager && BattleManager.startTpbAction) {
                BattleManager.startTpbAction(e);
              } else if (e.startTpbAction) {
                e.startTpbAction();
              }
            } catch (err) {}

            // Lightweight log (throttled)
            try {
              const nowF = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Graphics.frameCount : 0;
              if (!st._lastLogF || nowF - st._lastLogF > 120) {
                st._lastLogF = nowF;
                _aprbHaltLog("[APRB][STALLRESCUE] mode=actNow enemy=" + (e.name ? e.name() : "?") + " uid=" + uid + " frame=" + nowF);
              }
            } catch (err) {}
          } else {
          // Stall detected: kick-start the enemy's intended action, then immediately treat it as a parry success
                    // (visual: enemy "tries to act" -> parried; recovery: no deadlock, charge resets).
                    // This path is guarded and best-effort, to avoid loops under edge cases.
                    st.c[uid] = 0;
                    st.lastKickF = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Graphics.frameCount : 0;

                    // Try to start the enemy TPB action once (so it "moves" as intended), then immediately parry-cancel.
                    let _aprbStarted = false;
                    try {
                      if (typeof BattleManager !== "undefined" && BattleManager && BattleManager.startTpbAction) {
                        BattleManager.startTpbAction(e);
                        _aprbStarted = true;
                      }
                    } catch (err) {}

                    // Best-effort: play the same parry success effects (CE + animation on the "parried enemy").
                    // This is a recovery path, so we keep it lightweight and fully safe-guarded.
                    try {
                      const ceId = _aprbParryCommonEventId ? _aprbParryCommonEventId() : 0;
                      if (ceId > 0) aprbRunCommonEventImmediate(ceId);
                    } catch (err) {}
                    try {
                      const animId = _aprbParryAnimationId ? _aprbParryAnimationId() : 0;
                      if (animId > 0) aprbStartBattlerAnimation(e, animId);
                    } catch (err) {}

                    // If we managed to start the action, end it immediately to prevent damage / further progression.
                    // (We still show "attempted action" + parry effects; then we reset the charge.)
                    try {
                      if (_aprbStarted && typeof BattleManager !== "undefined" && BattleManager) {
                        if (BattleManager._subject === e && BattleManager.endAction) BattleManager.endAction();
                      }
                    } catch (err) {}

                    // Reset the enemy TPB charge immediately (so it can resume charging and act later).
                    try { if (e.clearActions) e.clearActions(); } catch (err) {}
                    try { if (e.clearTpbChargeTime) e.clearTpbChargeTime(); } catch (err) {}
                    try { e._tpbState = "charging"; } catch (err) {}
                    try { e._tpbChargeTime = 0; } catch (err) {}
                    try { e._tpbCastTime = 0; } catch (err) {}

          
          }// Optional lightweight log (only once per ~120 frames) to help future debugging.
          try {
            const nowF = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Graphics.frameCount : 0;
            if (!st._lastLogF || nowF - st._lastLogF > 120) {
              st._lastLogF = nowF;
              _aprbHaltLog("[APRB][STALLPR] force-parry-reset enemy=" + (e.name ? e.name() : "?") + " uid=" + uid + " frame=" + nowF);
            }
          } catch (err) {}
        }
      } else {
        if (st.c[uid]) st.c[uid] = 0;
      }
    }
  } catch (e) {}
}
// --------------------------------------------------------------------------

function _aprbLogEnvOnce() {
  if (_aprbEnvLogged) return;
  _aprbEnvLogged = true;
  try {
      let _aprbImmediateStarted = false;
      const list = (globalThis.$plugins || []).map(p => ({ name: p.name, status: !!p.status }));
    const enabled = list.filter(p => p.status).map(p => p.name);
    _aprbHaltLog("[APRB][ENV] enabledPlugins=" + enabled.join(","));
    const key = ["APRB_SlowDebug", "InvokeCommon_MIP", "FilterControllerMZ"];
    for (const k of key) {
      const hit = list.find(p => p.name === k);
      if (hit) _aprbHaltLog("[APRB][ENV] " + k + "=" + (hit.status ? "ON" : "OFF"));
    }
  } catch (e) {
    _aprbHaltLog("[APRB][ENV] (failed) " + String(e));
  }
}
_aprbLogEnvOnce();



  function _aprbDbgFrame() {
    try {
      if (SceneManager && SceneManager._scene && SceneManager._scene._aprbFrameCount != null) return SceneManager._scene._aprbFrameCount;
    } catch (e) {}
    return -1;
  }

  function _aprbDebugDumpText() {
    return _aprbDebugBuffer().join('\n');
  }

  function _aprbDebugCopyToClipboard() {
    const text = _aprbDebugDumpText();
    try {
      if (typeof nw !== 'undefined' && nw.Clipboard && nw.Clipboard.get) {
        nw.Clipboard.get().set(text, 'text');
        _aprbDbg('[APRB][DBG] copied to clipboard. lines=' + _aprbDebugBuffer().length);
        return true;
      }
    } catch (e) {}
    // Fallback: print as plain text (still copyable, no objects)
    try {
      console.log(text);
    } catch (e) {}
    return false;
  }


  // ============================================================
  // UI Visibility (Plugin Command)
  //  - Effective only during battle.
  //  - Automatically resets to ON at the end of each battle.
  // ============================================================

  function _aprbEnsureUiVis() {
    // NOTE:
    // BattleManager.endBattle/processAbort reset BattleManager._aprbUiVis immediately.
    // However, creators often run victory/defeat common events while Scene_Battle is still active.
    // To make the plugin command "各UIの表示ON/OFF" stable (no flicker / no unintended re-enable),
    // we keep a Scene_Battle-local latch in $gameTemp that survives BattleManager resets.
    //
    // - Default behavior remains "visible" unless user issues the plugin command.
    // - The latch is cleared automatically when leaving Scene_Battle (terminate) and when a new battle starts.
    const bm = (typeof BattleManager !== "undefined" && BattleManager) ? BattleManager : null;

    // Ensure BattleManager storage (used as default + for next battle reset compatibility).
    if (bm) {
      if (!bm._aprbUiVis) {
        bm._aprbUiVis = { all: true, icons: true, hint: true };
      } else {
        if (bm._aprbUiVis.all == null) bm._aprbUiVis.all = true;
        if (bm._aprbUiVis.icons == null) bm._aprbUiVis.icons = true;
        if (bm._aprbUiVis.hint == null) bm._aprbUiVis.hint = true;
      }
    }

    // Prefer scene-local latch if it exists.
    try {
      if (typeof $gameTemp !== "undefined" && $gameTemp && $gameTemp._aprbUiVisScene) {
        const v = $gameTemp._aprbUiVisScene;
        if (v.all == null) v.all = true;
        if (v.icons == null) v.icons = true;
        if (v.hint == null) v.hint = true;
        return v;
      }
    } catch (e) {}

    // Fall back to BattleManager storage.
    return bm ? bm._aprbUiVis : null;
  }

  function _aprbEnsureUiVisScene() {
    // Create / return Scene_Battle-local latch (stored in $gameTemp).
    // Seed from BattleManager._aprbUiVis if available; otherwise defaults to ON.
    if (typeof $gameTemp === "undefined" || !$gameTemp) return _aprbEnsureUiVis();
    if (!$gameTemp._aprbUiVisScene) {
      const src = (typeof BattleManager !== "undefined" && BattleManager && BattleManager._aprbUiVis) ? BattleManager._aprbUiVis : null;
      $gameTemp._aprbUiVisScene = {
        all:  src ? (src.all  !== false) : true,
        icons:src ? (src.icons!== false) : true,
        hint: src ? (src.hint !== false) : true,
      };
    } else {
      const v = $gameTemp._aprbUiVisScene;
      if (v.all == null) v.all = true;
      if (v.icons == null) v.icons = true;
      if (v.hint == null) v.hint = true;
    }
    return $gameTemp._aprbUiVisScene;
  }

  function _aprbClearUiVisScene() {
    try {
      if (typeof $gameTemp !== "undefined" && $gameTemp) $gameTemp._aprbUiVisScene = null;
    } catch (e) {}
  }

function _aprbIsUiVisible(uiKey) {
    const vis = _aprbEnsureUiVisScene();
    if (!vis) return true;
    if (vis.all === false) return false;
    if (!uiKey || uiKey === "all") return vis.all !== false;
    return vis[uiKey] !== false;
  }

  // Parry settings are stored in $gameSystem (persistent across saves).
  // Defaults come from plugin parameters.
  const _APRB_PARRY_CE_DEFAULT_PARAM = Math.max(0, Number(p["ParrySuccessCommonEvent"] || 0));
  const _APRB_PARRY_ANIM_DEFAULT_PARAM = Math.max(0, Number(p["ParrySuccessAnimationId"] || 0));

  const _APRB_PARRY_COUNTER_VAR_DEFAULT_PARAM = Math.max(0, Number(p["ParryCounterSkillVariableId"] || 0));

  function _aprbEnsureParrySettings() {
    if (typeof $gameSystem === 'undefined' || !$gameSystem) return null;
    if (!$gameSystem._aprbParrySettings) {
      $gameSystem._aprbParrySettings = {
        commonEventId: _APRB_PARRY_CE_DEFAULT_PARAM,
        animationId: _APRB_PARRY_ANIM_DEFAULT_PARAM,
        counterSkillVarId: _APRB_PARRY_COUNTER_VAR_DEFAULT_PARAM,
      };
    } else {
      if ($gameSystem._aprbParrySettings.commonEventId == null) $gameSystem._aprbParrySettings.commonEventId = _APRB_PARRY_CE_DEFAULT_PARAM;
      if ($gameSystem._aprbParrySettings.animationId == null) $gameSystem._aprbParrySettings.animationId = _APRB_PARRY_ANIM_DEFAULT_PARAM;

      if ($gameSystem._aprbParrySettings.counterSkillVarId == null) $gameSystem._aprbParrySettings.counterSkillVarId = _APRB_PARRY_COUNTER_VAR_DEFAULT_PARAM;    }
    return $gameSystem._aprbParrySettings;
  }

  function _aprbParryCommonEventId() {
    const st = _aprbEnsureParrySettings();
    const v = st ? st.commonEventId : _APRB_PARRY_CE_DEFAULT_PARAM;
    return Math.max(0, Number(v || 0));
  }

  function _aprbParryAnimationId() {
    const st = _aprbEnsureParrySettings();
    const v = st ? st.animationId : _APRB_PARRY_ANIM_DEFAULT_PARAM;
    return Math.max(0, Number(v || 0));
  }


  function _aprbParryCounterSkillVariableId() {
    const st = _aprbEnsureParrySettings();
    const v = st ? st.counterSkillVarId : _APRB_PARRY_COUNTER_VAR_DEFAULT_PARAM;
    return Math.max(0, Number(v || 0));
  }

  function _aprbParryCounterSkillIdFromVariable() {
    const varId = _aprbParryCounterSkillVariableId();
    if (varId <= 0) return 0;
    try {
      if (typeof $gameVariables === "undefined" || !$gameVariables || typeof $gameVariables.value !== "function") return 0;
      const v = Number($gameVariables.value(varId) || 0);
      return Math.max(0, v);
    } catch (e) {
      return 0;
    }
  }

  function _aprbTryForceParryCounter(defenderActor, attackerEnemy) {
    try {
      if (!defenderActor || !defenderActor.isActor || !defenderActor.isActor()) return;
      if (!attackerEnemy || !attackerEnemy.isEnemy || !attackerEnemy.isEnemy() || !attackerEnemy.isAlive || !attackerEnemy.isAlive()) return;

      const skillId = _aprbParryCounterSkillIdFromVariable();
      if (skillId <= 0) return;
      if (typeof $dataSkills !== "undefined" && $dataSkills && !$dataSkills[skillId]) return;

      // Force immediate counter (AP is not consumed; this is an extra reward action)
      defenderActor.forceAction(skillId, attackerEnemy.index());
      if (typeof BattleManager !== "undefined" && BattleManager && typeof BattleManager.forceAction === "function") {
        BattleManager.forceAction(defenderActor);
      }
    } catch (e) {
      // fail-safe
    }
  }

  // Plugin command: show/hide UI during battle (auto reset at battle end)
  if (PluginManager && PluginManager.registerCommand) {
    PluginManager.registerCommand(PLUGIN_NAME, "SetUIVisible", function(args) {
      try {
        if (!$gameParty || !$gameParty.inBattle || !$gameParty.inBattle()) {
          // Allow use during victory/defeat processing while still in Scene_Battle.
          const inBattleScene = (typeof SceneManager !== "undefined" && SceneManager && SceneManager._scene &&
            ( (typeof Scene_Battle !== "undefined" && Scene_Battle && SceneManager._scene instanceof Scene_Battle) ||
              (SceneManager._scene.constructor && SceneManager._scene.constructor.name === "Scene_Battle") ));
          if (!inBattleScene) return;
        }
        const ui = String(args.ui || "all");
        const visible = (args.visible === true || args.visible === "true");
        const vis = _aprbEnsureUiVis();
        if (!vis) return;
        if (ui === "all") {
          vis.all = visible;
          // If turning ALL back on, also restore sub-flags to on for convenience.
          if (visible) {
            vis.icons = true;
            vis.hint = true;
          }
        } else if (ui === "icons") {
          vis.icons = visible;
        } else if (ui === "hint") {
          vis.hint = visible;
        }
      } catch (eUiCmd) {
        // Silent fail (do not disrupt battle)
      }
    });

    PluginManager.registerCommand(PLUGIN_NAME, "AdjustAp", function(args) {
      try {
        if (!$gameParty || !$gameParty.inBattle || !$gameParty.inBattle()) return;
        if (typeof APRB === 'undefined' || !APRB) return;
        const mode = String(args.mode || 'add');
        const v = Math.max(0, Number(args.value || 0));
        const delta = (mode === 'sub') ? -v : v;
        APRB.gainAp(delta);
      } catch (e) {
        // silent
      }
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetParryAnimation", function(args) {
      try {
        const st = _aprbEnsureParrySettings();
        if (!st) return;
        st.animationId = Math.max(0, Number(args.animationId || 0));
      } catch (e) {
        // silent
      }
    });

    PluginManager.registerCommand(PLUGIN_NAME, "SetParryCommonEvent", function(args) {
      try {
        const st = _aprbEnsureParrySettings();
        if (!st) return;
        st.commonEventId = Math.max(0, Number(args.commonEventId || 0));
      } catch (e) {
        // silent
      }
    });

    // Debug: copy/clear debug logs (no DevTools required)
    PluginManager.registerCommand(PLUGIN_NAME, "DebugCopyLog", function() {
      try {
        const ok = _aprbDebugCopyToClipboard();
        if (typeof $gameMessage !== 'undefined' && $gameMessage) {
          $gameMessage.add(ok ? '[APRB] デバッグログをクリップボードへコピーしました。' : '[APRB] クリップボードコピーに失敗しました（consoleに出力しました）');
        }
      } catch (e) {}
    });

    PluginManager.registerCommand(PLUGIN_NAME, "DebugClearLog", function() {
      try {
        const buf = _aprbDebugBuffer();
        buf.length = 0;
        if (typeof $gameMessage !== 'undefined' && $gameMessage) {
          $gameMessage.add('[APRB] デバッグログをクリアしました。');
        }
      } catch (e) {}
    });
PluginManager.registerCommand(PLUGIN_NAME, "SetActionEndDelayedCommon", function(args) {
  try {
    const en = String(args.enabled ?? "true") === "true";
    const fr = Math.max(0, Number(args.frames ?? 0));
    const ce = Math.max(0, Number(args.commonEventId ?? 0));
    const wv = String(args.writeToVariable ?? "true") === "true";

    APRB_ensureActionEndDelayConfig();
    // runtime overrides (persist in $gameSystem)
    const cfg = APRB_getActionEndDelayConfig();
    if (cfg) {
      cfg.enabled = en;
      cfg.frames = fr;
      cfg.fixedCommonEventId = ce;

      // write to variable if requested
      if (wv && cfg.commonEventVarId > 0 && typeof $gameVariables !== "undefined" && $gameVariables) {
        $gameVariables.setValue(cfg.commonEventVarId, ce);
      }
    }

    if (typeof $gameMessage !== 'undefined' && $gameMessage) {
      const varId = cfg ? cfg.commonEventVarId : 0;
      $gameMessage.add(`[APRB] 遅延コモン設定: enabled=${en?1:0} frames=${fr} ce=${ce} var=${varId}`);
    }
    if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE] set enabled=${en?1:0} frames=${fr} ce=${ce} writeVar=${wv?1:0}`);
  } catch (e) {
    try { if (DEBUG_LOG) console.error(e); } catch (_) {}
  }
});
  }

// ============================================================
// ActionEnd Delayed Common (config)
//  - Stored in $gameSystem (save-safe) + defaults from plugin params
// ============================================================
function APRB_ensureActionEndDelayConfig() {
  try {
    if (typeof $gameSystem === "undefined" || !$gameSystem) return;
    if (!$gameSystem._aprbActionEndDelay) {
      $gameSystem._aprbActionEndDelay = {
        enabled: ACTION_END_DELAY_ENABLE_DEFAULT,
        frames: ACTION_END_DELAY_FRAMES_DEFAULT,
        commonEventVarId: ACTION_END_DELAY_CE_VAR_ID_DEFAULT,
        fixedCommonEventId: ACTION_END_DELAY_CE_FIXED_DEFAULT,
      };
    } else {
      const c = $gameSystem._aprbActionEndDelay;
      if (c.enabled == null) c.enabled = ACTION_END_DELAY_ENABLE_DEFAULT;
      if (c.frames == null) c.frames = ACTION_END_DELAY_FRAMES_DEFAULT;
      if (c.commonEventVarId == null || (Number(c.commonEventVarId || 0) === 0 && ACTION_END_DELAY_CE_VAR_ID_DEFAULT > 0)) c.commonEventVarId = ACTION_END_DELAY_CE_VAR_ID_DEFAULT;
      if (c.fixedCommonEventId == null || (Number(c.fixedCommonEventId || 0) === 0 && ACTION_END_DELAY_CE_FIXED_DEFAULT > 0)) c.fixedCommonEventId = ACTION_END_DELAY_CE_FIXED_DEFAULT;
    }
  } catch (e) {}
}

function APRB_getActionEndDelayConfig() {
  APRB_ensureActionEndDelayConfig();
  try { return ($gameSystem && $gameSystem._aprbActionEndDelay) ? $gameSystem._aprbActionEndDelay : null; } catch (e) {}
  return null;
}

function APRB_getActionEndDelayCommonEventId() {
  const cfg = APRB_getActionEndDelayConfig();
  if (!cfg) return 0;
  const varId = Number(cfg.commonEventVarId || 0);
  if (varId > 0 && typeof $gameVariables !== "undefined" && $gameVariables) {
    const v = Number($gameVariables.value(varId) || 0);
    if (v > 0) return Math.max(0, v);
    // If variable slot is configured but empty/0, fall back to fixed id for safety.
  }
  return Math.max(0, Number(cfg.fixedCommonEventId || 0));
}

  

// ============================================================
// ActionEnd Delayed Common (runtime, simple & battle-safe)
//  - After an action ends, wait N frames then run a common event
//  - Execute directly on BattleManager._interpreter (battle-safe)
// ============================================================
let _aprbAED_pending = false;
let _aprbAED_timer = 0;
let _aprbAED_lastArmStamp = -1;

function APRB_AED_arm(reason) {
  try {
    const cfg = APRB_getActionEndDelayConfig();
    if (!cfg || !cfg.enabled) return;
    const ceId = APRB_getActionEndDelayCommonEventId();
    if (!ceId || ceId <= 0) return;
    const fr = Math.max(0, Number(cfg.frames || 0));

    const stamp = (typeof Graphics !== "undefined" && Graphics && typeof Graphics.frameCount === "number") ? Graphics.frameCount : Date.now();
    if (_aprbAED_lastArmStamp === stamp) return; // avoid duplicate arm in same frame
    _aprbAED_lastArmStamp = stamp;

    _aprbAED_pending = true;
    _aprbAED_timer = fr;
    if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE2] arm reason=${reason || ""} frames=${fr} ce=${ceId}`);
    if (fr === 0) {
      // run immediately on next update tick to avoid re-entrancy
      _aprbAED_timer = 0;
    }
  } catch (e) {}
}

function APRB_AED_runCommonEventBattle(ceId, tag) {
  try {
    if (!ceId || ceId <= 0) return false;
    if (typeof $dataCommonEvents === "undefined" || !$dataCommonEvents) return false;
    const ce = $dataCommonEvents[ceId];
    if (!ce || !ce.list) return false;
    if (typeof BattleManager === "undefined" || !BattleManager) return false;
    const itp = BattleManager._interpreter;
    if (!itp) return false;

    if (itp.isRunning && itp.isRunning()) {
      if (typeof $gameTemp !== "undefined" && $gameTemp) {
        if (!$gameTemp._aprbAED_queue) $gameTemp._aprbAED_queue = [];
        $gameTemp._aprbAED_queue.push(ceId);
        if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE2] queue(busy) ce=${ceId} tag=${tag || ""}`);
        return true;
      }
      return false;
    }

    itp.setup(ce.list, 0);
    if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE2] run ce=${ceId} tag=${tag || ""}`);
    return true;
  } catch (e) {}
  return false;
}

function APRB_AED_flushQueue() {
  try {
    if (typeof $gameTemp === "undefined" || !$gameTemp || !$gameTemp._aprbAED_queue) return;
    const q = $gameTemp._aprbAED_queue;
    if (!q.length) return;
    const itp = (typeof BattleManager !== "undefined" && BattleManager) ? BattleManager._interpreter : null;
    if (!itp || (itp.isRunning && itp.isRunning())) return;
    const ceId = q.shift();
    APRB_AED_runCommonEventBattle(ceId, "queue");
  } catch (e) {}
}

function APRB_AED_update(tag) {
  try {
    if (!_aprbAED_pending) {
      APRB_AED_flushQueue();
      return;
    }
    const cfg = APRB_getActionEndDelayConfig();
    if (!cfg || !cfg.enabled) {
      _aprbAED_pending = false;
      _aprbAED_timer = 0;
      return;
    }
    const ceId = APRB_getActionEndDelayCommonEventId();
    if (!ceId || ceId <= 0) {
      _aprbAED_pending = false;
      _aprbAED_timer = 0;
      return;
    }

    if (_aprbAED_timer > 0) _aprbAED_timer--;

    if (_aprbAED_timer <= 0) {
      _aprbAED_pending = false;
      APRB_AED_runCommonEventBattle(ceId, tag || "timer");
    }
    APRB_AED_flushQueue();
  } catch (e) {}
}
// --- AP & Control ---
  const ENABLE_CONTROL = (p["EnableRealtimeControl"] ?? "true") === "true";

  // --- Basic Battle Wait (Per Action) ---
  const BBW_ATTACK_ENABLED = (p["BBW_AttackEnabled"] ?? "false") === "true";
  const BBW_ATTACK_FRAMES = Number(p["BBW_AttackFrames"] || 0);

  const BBW_GUARD_ENABLED = (p["BBW_GuardEnabled"] ?? "false") === "true";
  const BBW_GUARD_FRAMES = Number(p["BBW_GuardFrames"] || 0);

  const BBW_SKILL_ENABLED = (p["BBW_SkillEnabled"] ?? "false") === "true";
  const BBW_SKILL_FRAMES = Number(p["BBW_SkillFrames"] || 0);

  const BBW_ITEM_ENABLED = (p["BBW_ItemEnabled"] ?? "false") === "true";
  const BBW_ITEM_FRAMES = Number(p["BBW_ItemFrames"] || 0);

  // Debug: dump BBW config (helps verify PluginManager parameter is actually applied)
  if ((p["DebugLog"] ?? "false") === "true") {
    try {
      _aprbDbg(
        `[APRB][BBW] config attack=${BBW_ATTACK_ENABLED ? 1 : 0}/${BBW_ATTACK_FRAMES} ` +
        `guard=${BBW_GUARD_ENABLED ? 1 : 0}/${BBW_GUARD_FRAMES} ` +
        `skill=${BBW_SKILL_ENABLED ? 1 : 0}/${BBW_SKILL_FRAMES} ` +
        `item=${BBW_ITEM_ENABLED ? 1 : 0}/${BBW_ITEM_FRAMES}`
      );
    } catch (e) {}
  }

  // --- BBW helpers (must exist before BattleManager hooks) ---
  // Return frames number when enabled; otherwise null.
  function APRB_getBBWFramesForKind(kind) {
    switch (kind) {
      case "attack":
        return BBW_ATTACK_ENABLED ? BBW_ATTACK_FRAMES : null;
      case "guard":
        return BBW_GUARD_ENABLED ? BBW_GUARD_FRAMES : null;
      case "skill":
        return BBW_SKILL_ENABLED ? BBW_SKILL_FRAMES : null;
      case "item":
        return BBW_ITEM_ENABLED ? BBW_ITEM_FRAMES : null;
      default:
        return null;
    }
  }

  function APRB_isBBWAnyEnabled() {
    return !!(BBW_ATTACK_ENABLED || BBW_GUARD_ENABLED || BBW_SKILL_ENABLED || BBW_ITEM_ENABLED);
  }

  // AP is stored in game variables (global for the controlled actor)
  const AP_VAR_ID = Number(p["ApVariableId"] || 0);
  const MAX_AP_VAR_ID = Number(p["MaxApVariableId"] || 0);
  const AP_REGEN_VAR_ID = Number(p["ApRegenVariableId"] || 0);
  const BATTLE_START_AP_VAR_ID = Number(p["BattleStartApVariableId"] || 0);

  const CONTROL_ACTOR_INDEX = Number(p["ControlActorIndex"] || 1) - 1;
  const SHOW_AP_IN_NAME = (p["ShowApInName"] ?? "false") === "true";
  const ATTACK_AP_COST = Number(p["AttackApCost"] || 2);
  const GUARD_AP_COST = Number(p["GuardApCost"] || 1);

  // --- Guard Skill Override (saved per savefile) ---
  const DEFAULT_GUARD_SKILL_ID = Number(p["GuardSkillId"] || 0);


// ============================================================
// Guard Skill Override: auto-initialize from plugin parameter
//  - Stored in $gameSystem (per savefile)
//  - If the save has no value yet, it is seeded from DEFAULT_GUARD_SKILL_ID
// ============================================================
function aprbSeedGuardSkillIdIfNeeded() {
  try {
    if (!$gameSystem) return;
    const defId = Number(DEFAULT_GUARD_SKILL_ID || 0);
    const cur = $gameSystem._aprbGuardSkillId;
    // If not set yet, or was left as 0 while plugin parameter now specifies a skill, sync from default.
    if (cur === undefined || cur === null || Number.isNaN(Number(cur)) || (Number(cur) === 0 && defId > 0)) {
      $gameSystem._aprbGuardSkillId = defId;
    }
  } catch (e) {}
}

function aprbGetGuardSkillId(actor) {
  try {
    const sysId = ($gameSystem && typeof $gameSystem.aprbGuardSkillId === 'function')
      ? Number($gameSystem.aprbGuardSkillId() || 0)
      : Number(($gameSystem && $gameSystem._aprbGuardSkillId) || 0);
    if (sysId > 0) return sysId;
  } catch (e) {}
  try {
    const aId = actor && actor.guardSkillId ? Number(actor.guardSkillId() || 0) : 0;
    return aId;
  } catch (e2) {}
  return 0;
}

// Extend Game_System without removing any existing methods
if (typeof Game_System !== 'undefined') {
  if (!Game_System.prototype.aprbGuardSkillId) {
    Game_System.prototype.aprbGuardSkillId = function() {
      return Number(this._aprbGuardSkillId || 0);
    };
  }
  if (!Game_System.prototype.setAprbGuardSkillId) {
    Game_System.prototype.setAprbGuardSkillId = function(skillId) {
      this._aprbGuardSkillId = Math.max(0, Number(skillId || 0));
    };
  }

  // Seed on new game / battle test start
  const _aprb_GameSystem_initialize = Game_System.prototype.initialize;
  Game_System.prototype.initialize = function() {
    _aprb_GameSystem_initialize.apply(this, arguments);
    aprbSeedGuardSkillIdIfNeeded();
  };
}

// Seed on load
if (typeof DataManager !== 'undefined' && DataManager) {
  const _aprb_DataManager_extractSaveContents = DataManager.extractSaveContents;
  if (typeof _aprb_DataManager_extractSaveContents === 'function') {
    DataManager.extractSaveContents = function(contents) {
      _aprb_DataManager_extractSaveContents.apply(this, arguments);
      aprbSeedGuardSkillIdIfNeeded();
    };
  }
}
// ============================================================
// Guard skill override (use GuardSkillId for "Guard" command)
//  - Do NOT rely on plugin commands; read from $gameSystem (save-safe)
// ============================================================
(function() {
  if (typeof Game_Actor === "undefined") return;
  const _aprb_guardSkillId = Game_Actor.prototype.guardSkillId;
  Game_Actor.prototype.guardSkillId = function() {
    try {
      const gs = (typeof $gameSystem !== "undefined") ? $gameSystem : null;
      let id = 0;
      if (gs && gs.aprbGuardSkillId) id = Number(gs.aprbGuardSkillId() || 0);
      else if (gs && gs._aprbGuardSkillId != null) id = Number(gs._aprbGuardSkillId || 0);
      if (id > 0) return id;
    } catch (e) {}
    return _aprb_guardSkillId ? _aprb_guardSkillId.call(this) : 2;
  };
})();



  // --- Guard SE & HardStop ---
  const GUARD_SE_MODE = String(p["GuardSeMode"] || "ok");
  const GUARD_SE_NAME = String(p["GuardSeName"] || "");
  const GUARD_SE_VOL = Math.max(0, Math.min(100, Number(p["GuardSeVolume"] ?? 90)));
  const GUARD_SE_PITCH = Math.max(50, Math.min(150, Number(p["GuardSePitch"] ?? 100)));
  const GUARD_SE_PAN = Math.max(-100, Math.min(100, Number(p["GuardSePan"] ?? 0)));
  const ATTACK_HARDSTOP_ENABLE = (p["AttackHardStopEnable"] ?? "true") === "true";
  const GUARD_HARDSTOP_ENABLE = (p["GuardHardStopEnable"] ?? "false") === "true";
  const GUARD_HARDSTOP_FRAMES = Math.max(1, Number(p["GuardHardStopFrames"] || 6));

  // --- Parry ---
  const PARRY_WINDOW_FRAMES = Math.max(1, Number(p["ParryWindowFrames"] || 10));
  const PARRY_WINDOW_VAR_ID = Math.max(0, Number(p["ParryWindowVarId"] || 0));


  const PARRY_FRAME_COUNTER_ENABLE = (p["ParryFrameCounterEnable"] ?? "false") === "true";
  const PARRY_FRAME_COUNTER_X = Number(p["ParryFrameCounterX"] || 0);
  const PARRY_FRAME_COUNTER_Y = Number(p["ParryFrameCounterY"] || 0);
  const PARRY_FRAME_COUNTER_FONT_SIZE = Math.max(6, Number(p["ParryFrameCounterFontSize"] || 20));
  const PARRY_DAMAGE_RATE = Math.max(0, Math.min(1, Number(p["ParryDamageRate"] ?? 0.25)));
  const PARRY_CE_DEFAULT = Math.max(0, Number(p["ParrySuccessCommonEvent"] || 0));
  const PARRY_AP_RECOVER = Math.max(0, Number(p["ParryApRecover"] || 0));
  const PARRY_ANIM_DEFAULT = Math.max(0, Number(p["ParrySuccessAnimationId"] || 0));
  const BEFORECOMMON_STOPTIME = (p["BeforeCommon_StopTime"] ?? "true") === "true";
  const BEFORECOMMON_DISABLE_INPUT = (p["BeforeCommon_DisableInput"] ?? "true") === "true";
  const BEFORECOMMON_DEBUG_LOG = (p["BeforeCommon_DebugLog"] ?? "false") === "true";

// --- Frame State Control / ActionEnd Delayed Common ---
const STATE_KEEPFRAME_TAG_ENABLE = (p["StateKeepFrameTagEnable"] ?? "true") === "true";

const ACTION_END_DELAY_ENABLE_DEFAULT = (p["ActionEndDelayEnable"] ?? "false") === "true";
const ACTION_END_DELAY_FRAMES_DEFAULT = Math.max(0, Number(p["ActionEndDelayFrames"] || 60));
const ACTION_END_DELAY_CE_VAR_ID_DEFAULT = Math.max(0, Number(p["ActionEndDelayCommonEventVarId"] || 0));
const ACTION_END_DELAY_CE_FIXED_DEFAULT = Math.max(0, Number(p["ActionEndDelayCommonEventId"] || 0));


  // Z long-press derive (attack -> specific skill)
  const Z_LONGPRESS_FRAMES = Math.max(1, Number(p["ZLongPressDeriveFrames"] || 20));
  const Z_LONGPRESS_SKILL_ID = Number(p["ZLongPressDeriveSkill"] || 0);
  const Z_LONGPRESS_AP_COST = Math.max(0, Number(p["ZLongPressDeriveApCost"] ?? 2));


  // --- Command Icons ---
  const ICON_PRESS_SCALE = Math.max(0.1, Math.min(1.0, Number(p["IconPressScale"] || 0.90)));
  const ICON_PRESS_FRAMES = Math.max(1, Number(p["IconPressFrames"] || 6));

  function _aprb_rgbToTint(r,g,b){
    r = Math.max(0, Math.min(255, Number(r||0)));
    g = Math.max(0, Math.min(255, Number(g||0)));
    b = Math.max(0, Math.min(255, Number(b||0)));
    return (r<<16) + (g<<8) + b;
  }

  function _aprb_readIconConfig(prefix){
    const img = String(p[prefix + 'Image'] || '');
    const isTarget = (prefix === 'TargetIcon');
    const cfg = {
      prefix,
      image: img,
      x: Number(p[prefix + 'X'] || 0),
      y: Number(p[prefix + 'Y'] || 0),
      disableTint: _aprb_rgbToTint(p[prefix + 'DisableR'], p[prefix + 'DisableG'], p[prefix + 'DisableB']),
      clickSizeOffsetX: Number(p[prefix + 'ClickSizeOffsetX'] || 0),
      clickSizeOffsetY: Number(p[prefix + 'ClickSizeOffsetY'] || 0),
      clickPosOffsetX: Number(p[prefix + 'ClickPosOffsetX'] || 0),
      clickPosOffsetY: Number(p[prefix + 'ClickPosOffsetY'] || 0),
      // Target icon is independent from "can/can't" state: always shown (except forced-hide timings).
      showOnlyWhenExecutable: isTarget ? false : ((p[prefix + 'ShowOnlyWhenExecutable'] ?? 'false') === 'true'),
      // v2.0.71: Allow target icon tinting by default (requested: change color when opening skill/item).
      // If you want to keep the previous behavior (never change color), set TargetIconNoTint=true.
      noTint: ((p[prefix + 'NoTint'] ?? 'false') === 'true'),
    };
    return cfg;
  }

  const ICON_CFG_ATTACK = _aprb_readIconConfig('AttackIcon');
  const ICON_CFG_GUARD  = _aprb_readIconConfig('GuardIcon');
  const ICON_CFG_SKILL  = _aprb_readIconConfig('SkillIcon');
  const ICON_CFG_ITEM   = _aprb_readIconConfig('ItemIcon');
  const ICON_CFG_TARGET = _aprb_readIconConfig('TargetIcon');
  const ENABLE_ESCAPE_KEY = (p["EnableEscapeKey"] ?? "true") === "true";
  const DEBUG_LOG = (p["DebugLog"] ?? "false") === "true";
  const APRB_DEBUG_LOG = DEBUG_LOG; // alias for BBW debug (fix v2.0.83)
  const SLOW_SPEED_VAR_ID = Number(p["SkillTargetSlowSpeedVarId"] || 0);
  const SLOW_SPEED_DEFAULT_PCT = Number(p["SkillTargetSlowSpeedPercent"] || 30);
// ------------------------------------------------------------
  // Sound suppression helper
  //  - Used to mute cursor/ok sounds when starting a derived-skill
  //    via Z long-press (requested behavior).
  // ------------------------------------------------------------
  (function() {
    const _playCursor = SoundManager.playCursor;
    SoundManager.playCursor = function() {
      try {
        if (typeof BattleManager !== "undefined" && BattleManager && BattleManager._aprbMuteCursorOkSe) return;
      } catch (e) {}
      if (_playCursor) return _playCursor.call(this);
    };
    const _playOk = SoundManager.playOk;
    SoundManager.playOk = function() {
      try {
        if (typeof BattleManager !== "undefined" && BattleManager && BattleManager._aprbMuteCursorOkSe) return;
      } catch (e) {}
      if (_playOk) return _playOk.call(this);
    };
  })();


  // ------------------------------------------------------------
  // Command Icons (screen-based)
  //  - Show clickable icons for Attack/Guard/Skill/Item/TargetSelect
  //  - Disabled tint is applied by multiplicative tint
  //  - On key/click trigger: momentary shrink
  // ------------------------------------------------------------

  function Sprite_APRB_CommandIcon(cfg) {
    this.initialize(cfg);
  }

  Sprite_APRB_CommandIcon.prototype = Object.create(Sprite.prototype);
  Sprite_APRB_CommandIcon.prototype.constructor = Sprite_APRB_CommandIcon;

  Sprite_APRB_CommandIcon.prototype.initialize = function(cfg) {
    Sprite.prototype.initialize.call(this);
    this._cfg = cfg;
    this._pressCount = 0;
    this._enabled = true;
    this._visibleByRule = true;

    // Base position is treated as TOP-LEFT (screen-based).
    this._baseX = Number(cfg.x||0);
    this._baseY = Number(cfg.y||0);

    this.anchor.x = 0;
    this.anchor.y = 0;
    if (cfg && cfg.image) {
      this.bitmap = ImageManager.loadPicture(cfg.image);
    } else {
      this.bitmap = new Bitmap(1,1);
      this.visible = false;
    }
    this.x = this._baseX;
    this.y = this._baseY;
    this.scale.x = 1.0;
    this.scale.y = 1.0;
    this.tint = 0xFFFFFF;
  };

  Sprite_APRB_CommandIcon.prototype._rect = function() {
    const bmp = this.bitmap;
    const bw = (bmp && bmp.width) ? bmp.width : 0;
    const bh = (bmp && bmp.height) ? bmp.height : 0;
    const w = Math.max(0, bw - Number(this._cfg.clickSizeOffsetX||0));
    const h = Math.max(0, bh - Number(this._cfg.clickSizeOffsetY||0));
    const rx = this._baseX + Number(this._cfg.clickPosOffsetX||0);
    const ry = this._baseY + Number(this._cfg.clickPosOffsetY||0);
    return {x:rx, y:ry, w:w, h:h};
  };

  Sprite_APRB_CommandIcon.prototype._hitTest = function() {
    if (!this.visible) return false;
    const r = this._rect();
    const mx = TouchInput.x;
    const my = TouchInput.y;
    return mx >= r.x && mx < r.x + r.w && my >= r.y && my < r.y + r.h;
  };


  Sprite_APRB_CommandIcon.prototype._applyCenteredScale = function(s) {
    const bmp = this.bitmap;
    const w = (bmp && bmp.width) ? bmp.width : 0;
    const h = (bmp && bmp.height) ? bmp.height : 0;
    this.scale.x = s;
    this.scale.y = s;
    // Keep center fixed (baseX/baseY are top-left)
    this.x = this._baseX + (w * (1.0 - s)) / 2;
    this.y = this._baseY + (h * (1.0 - s)) / 2;
  };

  Sprite_APRB_CommandIcon.prototype._startPressAnim = function() {
    this._pressCount = ICON_PRESS_FRAMES;
    this._applyCenteredScale(ICON_PRESS_SCALE);
  };

  Sprite_APRB_CommandIcon.prototype._updatePressAnim = function() {
    if (this._pressCount > 0) {
      this._pressCount--;
      if (this._pressCount <= 0) {
        this._applyCenteredScale(1.0);
      }
    }
  };

  Sprite_APRB_CommandIcon.prototype.updateState = function(enabled, visibleByRule) {
    // Keep state updated even when hidden, so that when UI is re-enabled the correct tint/visibility applies.
    this._enabled = !!enabled;
    this._visibleByRule = !!visibleByRule;

    const intendedVisible = !!(this._visibleByRule && this._cfg.image);

    // [r39] UI visibility latch: NEVER allow updateState to re-show icons while hidden.
    // This is critical because updateState sets `visible` directly (bypassing show()).
    if (!_aprbIsUiVisible("icons")) {
      this.visible = false;
      return;
    }

    this.visible = intendedVisible;
    if (!this.visible) return;

    if (this._cfg.noTint) {
      this.tint = 0xFFFFFF;
    } else {
      this.tint = this._enabled ? 0xFFFFFF : (this._cfg.disableTint || 0x808080);
    }
  };

  Sprite_APRB_CommandIcon.prototype.update = function() {
    Sprite.prototype.update.call(this);
    // v2.0.60+: "押している間ずっと縮小" に変更。
    // 押下縮小フレーム(ICON_PRESS_FRAMES)による自動復帰は行わない。
  };


  // [r38] UI visibility latch hard-guard:
  // Prevent internal logic (or other plugins) from reviving APRB UI via show() while hidden by plugin command.
  (function(){
    try {
      const _showIcon = Sprite_APRB_CommandIcon.prototype.show;
      Sprite_APRB_CommandIcon.prototype.show = function() {
        if (!_aprbIsUiVisible("icons")) return;
        return _showIcon.call(this);
      };
    } catch(_e) {}
  })();

  // Scene helpers
  Scene_Battle.prototype._aprb_createCommandIcons = function() {
    this._aprbCommandIcons = null;
    // Create only if at least one icon has an image.
    const cfgs = [ICON_CFG_ATTACK, ICON_CFG_GUARD, ICON_CFG_SKILL, ICON_CFG_ITEM, ICON_CFG_TARGET];
    if (!cfgs.some(c=>c && c.image)) return;

    this._aprbCommandIcons = {
      attack: new Sprite_APRB_CommandIcon(ICON_CFG_ATTACK),
      guard:  new Sprite_APRB_CommandIcon(ICON_CFG_GUARD),
      skill:  new Sprite_APRB_CommandIcon(ICON_CFG_SKILL),
      item:   new Sprite_APRB_CommandIcon(ICON_CFG_ITEM),
      target: new Sprite_APRB_CommandIcon(ICON_CFG_TARGET),
    }

    // [r38] Respect UI visibility latch on creation (prevents a one-frame flash / reappearance).
    if (!_aprbIsUiVisible("icons")) {
      this._aprbCommandIcons.attack.visible = false;
      this._aprbCommandIcons.guard.visible  = false;
      this._aprbCommandIcons.skill.visible  = false;
      this._aprbCommandIcons.item.visible   = false;
      this._aprbCommandIcons.target.visible = false;
    }

;

    // Screen-based: add above battle sprites, below windows.
    // Using addChild puts it on the scene root (screen coordinates).
    this.addChild(this._aprbCommandIcons.attack);
    this.addChild(this._aprbCommandIcons.guard);
    this.addChild(this._aprbCommandIcons.skill);
    this.addChild(this._aprbCommandIcons.item);
    this.addChild(this._aprbCommandIcons.target);
  };

  // [M.I.P][IconFlickerFix] BattleLog activity detector.
  //  - State add/remove logs can make inputEnabled fluctuate for a few frames.
  //  - We treat the log as "active" not only when isBusy() is true, but also when it has queued methods / waits.
  Scene_Battle.prototype._aprb_isBattleLogActive = function() {
    const lw = this._logWindow;
    if (!lw) return false;
    try { if (lw.isBusy && lw.isBusy()) return true; } catch (_e) {}
    try { if (Array.isArray(lw._methods) && lw._methods.length > 0) return true; } catch (_e) {}
    try { if (lw._waitCount && lw._waitCount > 0) return true; } catch (_e) {}
    try { if (lw._waitMode) return true; } catch (_e) {}
    return false;
  };



  Scene_Battle.prototype._aprb_commandIconKeyTriggered = function(kind) {
    if (kind === 'attack') return Input.isTriggered('ok');
    if (kind === 'guard')  return Input.isTriggered('x');
    if (kind === 'skill')  return Input.isTriggered('up') || Input.isTriggered('pageup');
    if (kind === 'item')   return Input.isTriggered('down');
    if (kind === 'target') return Input.isTriggered('ok');
    return false;
  };

  Scene_Battle.prototype._aprb_tryCommandByIcon = function(kind) {
    // Use the same runtime checks as realtime input.
    if (!ENABLE_CONTROL) return false;
    if (!this._rt_isInputEnabled || !this._rt_isInputEnabled()) return false;

    // If Z-hold detection is active, ignore icon clicks.
    if (this._rt_zHoldActive) return false;

    const actor = this._rt_controlActor && this._rt_controlActor();
    const enemyWinActive = this._enemyWindow && this._enemyWindow.isOpenAndActive && this._enemyWindow.isOpenAndActive();
    const actorWinActive = this._actorWindow && this._actorWindow.isOpenAndActive && this._actorWindow.isOpenAndActive();

    if (kind === 'target') {
      // Confirm current target selection when target window is active
      if (enemyWinActive && this._enemyWindow.processOk) {
        this._enemyWindow.processOk();
        return true;
      }
      if (actorWinActive && this._actorWindow.processOk) {
        this._actorWindow.processOk();
        return true;
      }
      return false;
    }

    if (!actor || !actor.canMove || !actor.canMove()) return false;

    if (kind === 'attack') { BattleManager._aprbBbwLastIssuedKind = 'attack'; BattleManager._aprbBbwLastIssuedFrame = (Graphics && Graphics.frameCount) || 0; this._rt_doAttack(actor); return true; }
    if (kind === 'guard')  { BattleManager._aprbBbwLastIssuedKind = 'guard'; BattleManager._aprbBbwLastIssuedFrame = (Graphics && Graphics.frameCount) || 0; this._rt_doGuard(actor);  return true; }
    if (kind === 'skill')  { BattleManager._aprbBbwLastIssuedKind = 'skill'; this._rt_openSkill(actor); return true; }
    if (kind === 'item')   { BattleManager._aprbBbwLastIssuedKind = 'item'; this._rt_openItem(actor);  return true; }
    return false;
  };

  

  Scene_Battle.prototype._aprb_shouldForceHideCommandIcons = function() {
    // During action/animation presentation, icons are unnecessary and can flicker.
    try {
      if (typeof BattleManager !== 'undefined' && BattleManager && BattleManager.isBusy && BattleManager.isBusy()) return true;
      if (typeof BattleManager !== 'undefined' && BattleManager && BattleManager._phase === 'action') return true;
    } catch (e) {}
    return false;
  };

  // ------------------------------------------------------------
  // Target UI visibility helpers (v2.0.71)
  //  - Hide target hint / target icon when there is only one selectable target.
  Scene_Battle.prototype._aprb_targetCandidateCount = function() {
    try {
      // If selecting a target via windows, use window item counts (most accurate).
      // IMPORTANT: In MZ, target windows can remain "open" (openness>0) even when not actually selecting.
      // We must require "active" (or isOpenAndActive) here, otherwise the count becomes stale and UI won't hide
      // when enemies drop to 1 during battle.
      const ew = this._enemyWindow;
      const aw = this._actorWindow;

      const ewActive = !!(ew && ((ew.isOpenAndActive && ew.isOpenAndActive()) || ew.active));
      const awActive = !!(aw && ((aw.isOpenAndActive && aw.isOpenAndActive()) || aw.active));

      if (ewActive) {
        if (typeof ew.maxItems === "function") return Number(ew.maxItems() || 0);
      }
      if (awActive) {
        if (typeof aw.maxItems === "function") return Number(aw.maxItems() || 0);
      }

      // Otherwise, fall back to alive enemy count (focus target context).
      if (typeof $gameTroop !== "undefined" && $gameTroop && typeof $gameTroop.aliveMembers === "function") {
        const n = $gameTroop.aliveMembers().length;
        return Number(n || 0);
      }
    } catch (e) {}
    return 0;
  };

  Scene_Battle.prototype._aprb_shouldShowTargetUi = function() {
    const n = this._aprb_targetCandidateCount ? this._aprb_targetCandidateCount() : 0;
    return n >= 2;
  
    // Plugin command UI visibility (latch)
    if (!_aprbIsUiVisible("icons")) {
      try {
        this._aprbCommandIcons.attack.visible = false;
        this._aprbCommandIcons.guard.visible  = false;
        this._aprbCommandIcons.skill.visible  = false;
        this._aprbCommandIcons.item.visible   = false;
        this._aprbCommandIcons.target.visible = false;
      } catch(_e) {}
    }
};

Scene_Battle.prototype._aprb_updateCommandIcons = function() {
    if (!this._aprbCommandIcons) return;

    // [M.I.P][IconFlickerFix] During BattleLog (state add/remove etc.), do not "generate/refresh" icons at all.
    // This prevents one-frame reappearance caused by visibility toggles inside the APRB realtime loop.
    if (this._aprb_isBattleLogActive && this._aprb_isBattleLogActive()) {
      this._aprbCommandIcons.attack.visible = false;
      this._aprbCommandIcons.guard.visible  = false;
      this._aprbCommandIcons.skill.visible  = false;
      this._aprbCommandIcons.item.visible   = false;
      this._aprbCommandIcons.target.visible = false;
      return;
    }


    // Plugin command UI visibility
    if (!_aprbIsUiVisible("icons")) {
      this._aprbCommandIcons.attack.visible = false;
      this._aprbCommandIcons.guard.visible  = false;
      this._aprbCommandIcons.skill.visible  = false;
      this._aprbCommandIcons.item.visible   = false;
      this._aprbCommandIcons.target.visible = false;
      return;
    }

    // [M.I.P][IconFlickerFix] Latch visibility when BattleManager becomes busy/action
    //  - APRB forceAction (guard/attack/etc.) can toggle isBusy/_phase only for 1 frame, causing one-frame "blink".
    //  - We keep icons hidden for a few frames once hiding is triggered, smoothing the transition.
    const _aprbForceHideNow = (this._aprb_shouldForceHideCommandIcons && this._aprb_shouldForceHideCommandIcons());
    const _aprbMinHideFrames = 8; // tweak if needed (6-12 recommended)
    this._aprbForceHideIconsLatch = this._aprbForceHideIconsLatch || 0;
    if (_aprbForceHideNow) {
      this._aprbForceHideIconsLatch = Math.max(this._aprbForceHideIconsLatch, _aprbMinHideFrames);
    } else if (this._aprbForceHideIconsLatch > 0) {
      this._aprbForceHideIconsLatch -= 1;
    }
    if (_aprbForceHideNow || this._aprbForceHideIconsLatch > 0) {
      this._aprbCommandIcons.attack.visible = false;
      this._aprbCommandIcons.guard.visible  = false;
      this._aprbCommandIcons.skill.visible  = false;
      this._aprbCommandIcons.item.visible   = false;
      this._aprbCommandIcons.target.visible = false;
      return;
    }

    const actor = this._rt_controlActor && this._rt_controlActor();
    const inBattle = isBattleInProgressCompat();
    const inputEnabled = (this._rt_isInputEnabled && this._rt_isInputEnabled());
    const enemyWinActive = this._enemyWindow && this._enemyWindow.isOpenAndActive && this._enemyWindow.isOpenAndActive();
    const actorWinActive = this._actorWindow && this._actorWindow.isOpenAndActive && this._actorWindow.isOpenAndActive();
    const inTargetSelect = !!(enemyWinActive || actorWinActive);

    const ap = (actor && actor.ap) ? actor.ap() : 0;
    const canMove = !!(actor && actor.canMove && actor.canMove());

    // Enabled checks
    const hasTarget = !!(this._rt_focusedEnemy && this._rt_focusedEnemy());
    const enAttack = inBattle && inputEnabled && canMove && hasTarget && ap >= ATTACK_AP_COST;
    const enGuard  = inBattle && inputEnabled && canMove && ap >= GUARD_AP_COST;
    const enSkill  = inBattle && inputEnabled && canMove && ap >= SKILL_AP_COST;
    const enItem   = inBattle && inputEnabled && canMove && ap >= ITEM_AP_COST;
    const rtMode2 = this._rt_menuMode;
    // v2.0.72: Target icon represents quick target switching via [←][→] while no window is open.
    // Disabled while any battle menu/window is open.
    const menuOpen2 = !!rtMode2; // falsy when no battle menu is open
    const enTarget = inBattle && inputEnabled && canMove && !menuOpen2 && (enAttack || enGuard) &&
      (this._aprb_shouldShowTargetUi ? this._aprb_shouldShowTargetUi() : true);

    const showAttack = inBattle && (!ICON_CFG_ATTACK.showOnlyWhenExecutable || enAttack);
    const showGuard  = inBattle && (!ICON_CFG_GUARD.showOnlyWhenExecutable  || enGuard);
    const showSkill  = inBattle && (!ICON_CFG_SKILL.showOnlyWhenExecutable  || enSkill);
    const showItem   = inBattle && (!ICON_CFG_ITEM.showOnlyWhenExecutable   || enItem);
    // Target icon is typically only meaningful during target selection
    // Also hide when only one target exists (no need to show target UI).
    const showTarget = inBattle && (this._aprb_shouldShowTargetUi ? this._aprb_shouldShowTargetUi() : true);

    this._aprbCommandIcons.attack.updateState(enAttack, showAttack);
    this._aprbCommandIcons.guard.updateState(enGuard, showGuard);
    this._aprbCommandIcons.skill.updateState(enSkill, showSkill);
    this._aprbCommandIcons.item.updateState(enItem, showItem);
    this._aprbCommandIcons.target.updateState(enTarget, showTarget);

    // Mouse click triggers (execute command once on trigger)
    if (TouchInput.isTriggered()) {
      const order = [
        ['target', this._aprbCommandIcons.target],
        ['skill',  this._aprbCommandIcons.skill],
        ['item',   this._aprbCommandIcons.item],
        ['guard',  this._aprbCommandIcons.guard],
        ['attack', this._aprbCommandIcons.attack],
      ];
      for (const [k, spr] of order) {
        if (spr && spr._hitTest && spr._hitTest()) {
          // respect enabled flag; if disabled, do nothing (no buzzer)
          if (spr._enabled) {
            this._aprb_tryCommandByIcon(k);
          }
          break;
        }
      }
    }

    // Hold-shrink (v2.0.60+)
    //  - While each key is held down, keep the corresponding icon scaled.
    //  - While a mouse press is held on an icon, keep it scaled.
    //  - While battle menu (skill/item/target selection) is open, do NOT shrink.
    const menuOpen = aprbIsSlowModeActive();
    const mouseHeld = TouchInput.isPressed();

    function applyHeldScale(sprite, held) {
      if (!sprite) return;
      if (!sprite.visible) return;
      sprite._applyCenteredScale(held ? ICON_PRESS_SCALE : 1.0);
    }

    if (menuOpen) {
      applyHeldScale(this._aprbCommandIcons.attack, false);
      applyHeldScale(this._aprbCommandIcons.guard,  false);
      applyHeldScale(this._aprbCommandIcons.skill,  false);
      applyHeldScale(this._aprbCommandIcons.item,   false);
      applyHeldScale(this._aprbCommandIcons.target, false);
    } else {
      const holdAttack = Input.isPressed('ok') || (mouseHeld && this._aprbCommandIcons.attack && this._aprbCommandIcons.attack._hitTest && this._aprbCommandIcons.attack._hitTest());
      const holdGuard  = Input.isPressed('x')  || (mouseHeld && this._aprbCommandIcons.guard  && this._aprbCommandIcons.guard._hitTest  && this._aprbCommandIcons.guard._hitTest());
      const holdSkill  = (Input.isPressed('up') || Input.isPressed('pageup')) || (mouseHeld && this._aprbCommandIcons.skill  && this._aprbCommandIcons.skill._hitTest  && this._aprbCommandIcons.skill._hitTest());
      const holdItem   = Input.isPressed('down') || (mouseHeld && this._aprbCommandIcons.item   && this._aprbCommandIcons.item._hitTest   && this._aprbCommandIcons.item._hitTest());
      const holdTarget = (!menuOpen && enTarget && (Input.isPressed("left") || Input.isPressed("right"))) ||
        (mouseHeld && this._aprbCommandIcons.target && this._aprbCommandIcons.target._hitTest && this._aprbCommandIcons.target._hitTest());

      applyHeldScale(this._aprbCommandIcons.attack, holdAttack);
      applyHeldScale(this._aprbCommandIcons.guard,  holdGuard);
      applyHeldScale(this._aprbCommandIcons.skill,  holdSkill);
      applyHeldScale(this._aprbCommandIcons.item,   holdItem);
      applyHeldScale(this._aprbCommandIcons.target, holdTarget);
    }
  };

  // --- Focus Target Hint ---
  const FOCUS_HINT_ENABLED = (p["FocusHintEnabled"] ?? "true") === "true";
  const FOCUS_HINT_LABEL_TEXT = String(p["FocusHintLabelText"] || "TARGET:");
  const FOCUS_HINT_AUTO_ADVANCE = (p["FocusHintAutoAdvance"] ?? "true") === "true";
  const FOCUS_HINT_AUTO_FIT = (p["FocusHintAutoFit"] ?? "true") === "true";

  const FOCUS_HINT_FONT_SIZE = Number(p["FocusHintFontSize"] || 22);
  const FOCUS_HINT_TARGET_X = Number(p["FocusHintTargetX"] || 0);
  const FOCUS_HINT_TARGET_Y = Number(p["FocusHintTargetY"] || 0);
  const FOCUS_HINT_ENEMY_X = Number(p["FocusHintEnemyX"] || 120);
  const FOCUS_HINT_ENEMY_Y = Number(p["FocusHintEnemyY"] || 0);
  const FOCUS_HINT_WIN_X = Number(p["FocusHintWindowX"] || 0);
  const FOCUS_HINT_WIN_Y = Number(p["FocusHintWindowY"] || 0);
  const FOCUS_HINT_WIN_W = Number(p["FocusHintWindowW"] || 240);
  const FOCUS_HINT_WIN_H = Number(p["FocusHintWindowH"] || 48);

  // --- Common Events (Actors) ---
  const CE_ACTOR_ATTACK = Number(p["ActorAttackCommonEvent"] || 0);
  const CE_ACTOR_GUARD = Number(p["ActorGuardCommonEvent"] || 0);
  const CE_ACTOR_SKILL = Number(p["ActorSkillCommonEvent"] || 0);
  const CE_ACTOR_ITEM = Number(p["ActorItemCommonEvent"] || 0);
  const CE_ACTOR_DAMAGED = Number(p["ActorDamagedCommonEvent"] || 0);
  const CE_ACTOR_KO = Number(p["ActorKnockoutCommonEvent"] || 0);
  const CE_ACTOR_EVADE = Number(p["ActorEvadeCommonEvent"] || 0);

  // --- Common Events (Enemies) ---
  const CE_ENEMY_ATTACK = Number(p["EnemyAttackCommonEvent"] || 0);
  const CE_ENEMY_GUARD = Number(p["EnemyGuardCommonEvent"] || 0);
  const CE_ENEMY_SKILL = Number(p["EnemySkillCommonEvent"] || 0);
  const CE_ENEMY_ITEM = Number(p["EnemyItemCommonEvent"] || 0);
  const CE_ENEMY_DAMAGED = Number(p["EnemyDamagedCommonEvent"] || 0);
  const CE_ENEMY_KO = Number(p["EnemyKnockoutCommonEvent"] || 0);
  const CE_ENEMY_EVADE = Number(p["EnemyEvadeCommonEvent"] || 0);

  // --- Battle Result ---
  const CE_LOSE = Number(p["BattleLoseCommonEvent"] || 0);
  const CE_ESCAPE = Number(p["EscapeSuccessCommonEvent"] || 0);

  function reserveCE(id, tag) {
    if (String(tag || '') === 'SResultPre' || String(tag || '') === 'SResultPreLegacy') {
      if (DEBUG_LOG) _aprbDbg('[APRB][CE][Reserve-IGNORED] id=' + id + (tag ? (' tag=' + tag) : ''));
      return;
    }
    if (!(id > 0)) return;
    try {
      // Dedupe: avoid double reservation in same frame (common in heavily-modded environments)
      const f = (typeof Graphics !== 'undefined' && Graphics && typeof Graphics.frameCount === 'number')
        ? Graphics.frameCount
        : Date.now();
      if (!BattleManager._aprbCEReserveOnce) BattleManager._aprbCEReserveOnce = new Map();
      const k = String(id) + '|' + String(tag || '');
      const last = BattleManager._aprbCEReserveOnce.get(k);
      if (last === f) {
        if (DEBUG_LOG) _aprbDbg('[APRB][CE][Reserve-SKIP] id=' + id + (tag ? (' tag=' + tag) : '') + ' frame=' + f);
        return;
      }
      BattleManager._aprbCEReserveOnce.set(k, f);

      if (DEBUG_LOG) _aprbDbg('[APRB][CE][Reserve] id=' + id + (tag ? (' tag=' + tag) : ''));
    } catch (e) {
      // ignore
    }
    $gameTemp.reserveCommonEvent(id);
  }

  // Defer a common event reservation to the next BattleManager.update (stability-first).
  // This is used for "After" common events where we want to avoid interfering with the current apply/startAction flow.
  function aprbDeferReserveCE(id) {
    try {
      const n = Number(id || 0);
      if (!(n > 0)) return;
      if (!BattleManager._aprbDeferredCommonEvents) BattleManager._aprbDeferredCommonEvents = [];
      BattleManager._aprbDeferredCommonEvents.push(n);
    } catch (e) {
      // fallback to immediate reservation
      reserveCE(Number(id || 0));
    }
  }

  // Run a common event immediately (best-effort).
  // - This is intended for logic-only common events (switch/variable/etc.).
  // - If the event contains waits/messages, it will not fully finish in the same frame.
  function aprbRunCommonEventImmediate(id, tag) {
    try {
      if (!(id > 0)) return;
      if (!$dataCommonEvents || !$dataCommonEvents[id]) return;
      const list = $dataCommonEvents[id].list;
      if (!list) {
        reserveCE(id, tag || "immediate-no-list");
        return;
      }

      // Dedupe (same CE+tag in same frame): prevents accidental double-run.
      const f = (typeof Graphics !== 'undefined' && Graphics && typeof Graphics.frameCount === 'number')
        ? Graphics.frameCount
        : Date.now();
      if (!BattleManager._aprbCEImmediateOnce) BattleManager._aprbCEImmediateOnce = new Map();
      const k = String(id) + '|' + String(tag || '');
      const last = BattleManager._aprbCEImmediateOnce.get(k);
      if (last === f) {
        if (DEBUG_LOG) _aprbDbg('[APRB][CE][Immediate-SKIP] id=' + id + (tag ? (' tag=' + tag) : '') + ' frame=' + f);
        return;
      }
      BattleManager._aprbCEImmediateOnce.set(k, f);

      // Run with a fresh interpreter (no "busy" issues). We simulate waits up to a safe cap.
      const itp = new Game_Interpreter();
// For SResultPre: force-skip waits/movement/animation waits to guarantee "before damage popups" and avoid partial-run+reserve double execution.
      if (String(tag || '') === 'SResultPre' || String(tag || '') === 'SResultPreLegacy') {
        try {
          itp.updateWait = function() { return false; };
          itp.updateChild = function() { return false; };
        } catch (e) {}
      }

      if (DEBUG_LOG) {
        try { _aprbDbg('[APRB][CE][Immediate] id=' + id + (tag ? (' tag=' + tag) : '')); } catch (e) {}
      }

      itp.setup(list, 0);

      // Execute immediately with a hard cap to avoid hangs.
      // Note: waits are also processed in this loop (fast-forward). If it still doesn't finish, fallback to reserve ONCE.
      const STEP_CAP = 2000;
      for (let i = 0; i < STEP_CAP && itp.isRunning(); i++) {
        itp.update();
      }

      if (itp.isRunning()) {
        // Couldn't finish within cap -> fallback to reservation (deduped).
        if (String(tag || '') === 'SResultPre' || String(tag || '') === 'SResultPreLegacy') {
          if (DEBUG_LOG) _aprbDbg('[APRB][CE][Immediate-ABORT] id=' + id + (tag ? (' tag=' + tag) : '') + ' reason=cap');
        } else {
          reserveCE(id, tag || "immediate-cap");
        }
      }
    } catch (e) {
      try {
        if (DEBUG_LOG) _aprbDbg('[APRB][CE][Immediate-ERR] id=' + id + (tag ? (' tag=' + tag) : '') + ' err=' + String(e));
      } catch (e2) {}
      // fallback (deduped)
      if (String(tag || '') === 'SResultPre' || String(tag || '') === 'SResultPreLegacy') {
        // Do not reserve: would run after damage and can duplicate partially executed effects.
      } else {
        reserveCE(Number(id || 0), tag || "immediate-ex");
      }
    }
  }

  // Start animation on a battler (fallback to spriteset lookup if needed)
  function aprbStartBattlerAnimation(battler, animationId) {
    try {
      if (!(animationId > 0) || !battler) return;
      if (battler.startAnimation) {
        battler.startAnimation(animationId, false, 0);
        if (DEBUG_LOG) {
          try { _aprbDbg('[APRB][ParryAnim] battler.startAnimation id=' + animationId + ' battler=' + (battler && battler.name ? battler.name() : String(battler))); } catch (e) {}
        }
        return;
      }
    } catch (e0) {}
    try {
      const s = (typeof SceneManager !== 'undefined') ? SceneManager._scene : null;
      const ss = s && s._spriteset;
      if (!ss) return;
      let sprites = null;
      try {
        if (typeof ss.findTargetSprite === 'function') {
          const t = ss.findTargetSprite(battler);
          if (t) sprites = [t];
        }
      } catch (eFind) {}
      if (!sprites) {
        try {
          if (typeof ss.battlerSprites === 'function') sprites = ss.battlerSprites();
        } catch (eBS) {}
      }
      if (!sprites) {
        sprites = [];
        if (ss._enemySprites && Array.isArray(ss._enemySprites)) sprites.push.apply(sprites, ss._enemySprites);
        if (ss._actorSprites && Array.isArray(ss._actorSprites)) sprites.push.apply(sprites, ss._actorSprites);
      }
      const spr = (sprites && sprites.find) ? sprites.find(sp => sp && sp._battler === battler) : null;
      if (spr && spr.startAnimation) {
        // Sprite.startAnimation expects an animation data object, not an id.
        const anim = ($dataAnimations && $dataAnimations[animationId]) ? $dataAnimations[animationId] : null;
        if (anim) spr.startAnimation(anim, false, 0);
        if (DEBUG_LOG) {
          try { _aprbDbg('[APRB][ParryAnim] sprite.startAnimation id=' + animationId + ' hasAnim=' + (!!anim) + ' sprite=' + (spr && spr.constructor ? spr.constructor.name : '')); } catch (e) {}
        }
      } else if (DEBUG_LOG) {
        try { _aprbDbg('[APRB][ParryAnim] sprite not found for battler=' + (battler && battler.name ? battler.name() : String(battler)) + ' animId=' + animationId); } catch (e) {}
      }
    } catch (e1) {}
  }

  // ------------------------------------------------------------
  // Parry (Guard X + within window)
  //  - When the controlled actor performs Guard, a parry window opens.
  //  - If an enemy action hits during the window, parry triggers:
  //      * Damage rate override (guard is ignored)
  //      * Optional common event reserved BEFORE damage is applied
  //      * Optional AP recover (future use)
  //      * Optional animation on the attacker ("parried enemy")
  // ------------------------------------------------------------
  (function() {
    if (typeof Game_Action === 'undefined' || !Game_Action.prototype) return;

    // NOTE:
    //  We use a per-action flag (this._aprbParryTriggered) instead of a target flag.
    //  This is more robust against other plugins and avoids timing issues where the
    //  target flag may be cleared before applyGuard() runs.

    const _APRB_GA_applyGuard = Game_Action.prototype.applyGuard;
    Game_Action.prototype.applyGuard = function(damage, target) {
      try {
        if (this && this._aprbParryTriggered) return damage; // ignore guard reduction on parry-hit
      } catch (e) {}
      return _APRB_GA_applyGuard ? _APRB_GA_applyGuard.call(this, damage, target) : damage;
    };

    const _APRB_GA_makeDamageValue = Game_Action.prototype.makeDamageValue;
    Game_Action.prototype.makeDamageValue = function(target, critical) {
      let value = _APRB_GA_makeDamageValue ? _APRB_GA_makeDamageValue.call(this, target, critical) : 0;
      try {
        if (this && this._aprbParryTriggered) {
          value = Math.round(value * PARRY_DAMAGE_RATE);
        }
      } catch (e) {}
      return value;
    };

    const _APRB_GA_apply = Game_Action.prototype.apply;
    Game_Action.prototype.apply = function(target) {
      try {
        // Clear any stale flag from a reused action object (safety)
        this._aprbParryTriggered = false;
        this._aprbParryAttacker = null;

        if (target && target.isActor && target.isActor() && Number(target._aprbParryFrames || 0) > 0) {
          const subject = this.subject && this.subject();
          const item = this.item && this.item();
          const dmgType = item && item.damage ? Number(item.damage.type || 0) : 0;
          const isHpMpDamage = (dmgType === 1 || dmgType === 2); // HP/MP damage only
          if (subject && subject.isEnemy && subject.isEnemy() && isHpMpDamage) {
            // Parry success
            this._aprbParryTriggered = true;
            this._aprbParryAttacker = subject;
            if (DEBUG_LOG) {
              try {
                const fc = (Graphics && Graphics.frameCount != null) ? Number(Graphics.frameCount) : -1;
                _aprbDbg('[APRB][Parry] SUCCESS pre-damage frame=' + _aprbDbgFrame() + ' target=' + (target && target.name ? target.name() : '') + ' subject=' + (subject && subject.name ? subject.name() : '') + ' dmgRate=' + parryRate);
              } catch (e0) {}
            }
            // keep window open (受付中なら何度でも成功)
            // target._aprbParryFrames = 0;

            // Run common event BEFORE damage (best-effort immediate)
            const ceId = _aprbParryCommonEventId();
            if (ceId > 0) aprbRunCommonEventImmediate(ceId);

            // AP recover (future)
            if (PARRY_AP_RECOVER > 0 && target.gainAp) target.gainAp(PARRY_AP_RECOVER);

            // Animation on attacker (the parried enemy)
            const animId = _aprbParryAnimationId();
            if (animId > 0) aprbStartBattlerAnimation(subject, animId);

            // Parry counter (immediate, target the attacker)
            _aprbTryForceParryCounter(target, subject);
          }
        }
      } catch (e) {
        // ignore
      }

      const __aprbWasParry = !!this._aprbParryTriggered;
      const __aprbParryAttacker = this._aprbParryAttacker || null;

      const r = _APRB_GA_apply ? _APRB_GA_apply.call(this, target) : undefined;

      // APRB: expose parry as an action result flag for SpecialResultTrigger
      try {
        if (__aprbWasParry && target && target.result) {
          const res = target.result();
          if (res) {
            res._aprbParry = true;
            // Keep reference to the attacker if you want it later (optional)
            res._aprbParryAttacker = __aprbParryAttacker;
          }
        }
      } catch (e) {}

      // Clear per-action flags
      try {
        this._aprbParryTriggered = false;
        this._aprbParryAttacker = null;
      } catch (e) {}

      return r;
    };
  })();

  // Battle progress compatibility (some cores/plugins may not define isBattleInProgress)
  function isBattleInProgressCompat() {
    if (BattleManager && typeof BattleManager.isBattleInProgress === "function") {
      return BattleManager.isBattleInProgress();
    }
    return !!($gameParty && typeof $gameParty.inBattle === "function" && $gameParty.inBattle());
  }

  // ------------------------------------------------------------
  // Battle slow-down during skill/item selection and their target selection
  //  - Controlled via a variable: 0/未指定なら100%
  // ------------------------------------------------------------
  function aprbSlowPercent() {
  // Priority: variable (if configured and valid), otherwise default param percent.
  let v = NaN;
  try {
    if (SLOW_SPEED_VAR_ID && $gameVariables && $gameVariables.value) {
      v = Number($gameVariables.value(SLOW_SPEED_VAR_ID));
    }
  } catch (e) {}
  if (isFinite(v) && v > 0) {
    v = Math.floor(v);
  } else {
    v = Number(SLOW_SPEED_DEFAULT_PCT);
  }
  if (!isFinite(v) || v <= 0) v = 100;
  v = Math.floor(v);
  if (v < 1) v = 1;
  if (v > 100) v = 100;
  return v;
}

  function aprbGetParryWindowFrames() {
    var frames = PARRY_WINDOW_FRAMES;
    try {
      if (PARRY_WINDOW_VAR_ID > 0 && $gameVariables && $gameVariables.value) {
        var v = Number($gameVariables.value(PARRY_WINDOW_VAR_ID));
        if (isFinite(v)) frames = Math.floor(v);
      }
    } catch (e) {}
    if (!isFinite(frames) || frames < 1) frames = 1;
    // Safety clamp (avoid accidental huge windows that feel like "always parry")
    if (frames > 600) frames = 600;
    return frames;
  }

  function aprbPlayGuardSe() {
    try {
      var m = GUARD_SE_MODE;
      if (m === 'none') return;
      if (m === 'recovery') { if (SoundManager.playRecovery) SoundManager.playRecovery(); return; }
      if (m === 'ok') { if (SoundManager.playOk) SoundManager.playOk(); return; }
      if (m === 'custom') {
        if (!GUARD_SE_NAME) return;
        if (AudioManager && AudioManager.playSe) {
          AudioManager.playSe({name: GUARD_SE_NAME, volume: GUARD_SE_VOL, pitch: GUARD_SE_PITCH, pan: GUARD_SE_PAN});
        }
        return;
      }
      // fallback
      if (SoundManager.playOk) SoundManager.playOk();
    } catch (e) {
      try { if (SoundManager.playOk) SoundManager.playOk(); } catch (e2) {}
    }
  }

  function aprbIsSlowModeActive() {
    if (typeof SceneManager === "undefined") return false;
    var s = SceneManager._scene;
    if (!s) return false;
    if (typeof Scene_Battle !== "undefined" && !(s instanceof Scene_Battle)) return false;

    // Strong primary: our own menu-flow flag (survives UI/window recreation by other plugins)
    if (typeof BattleManager !== "undefined" && BattleManager && BattleManager._aprbMenuOpen) return true;

    // Primary: our own realtime menu mode flag (stable)
    if (s._rt_menuMode === "skill" || s._rt_menuMode === "item") return true;
    if ((s._rt_menuMode === "enemyTarget" || s._rt_menuMode === "actorTarget") &&
        (s._rt_returnMenuMode === "skill" || s._rt_returnMenuMode === "item")) return true;

    // Secondary: window open state (robust across plugins)
    //  - Do NOT rely on only .visible (some plugins keep visible=true even when closed)
    //  - Do NOT rely on only openness (some windows keep openness>0 even after hide())
    //  - Prefer: "shown" (visible or active) AND "open" (isOpen/openness/active)
    function isOpenVisible(w) {
      // v2.0.69: Make slow depend on "currently interactive" windows only.
      // Some battle UI windows remain visible/open all the time (openness=255) even when not in use,
      // which caused slow to stay ON forever. We therefore require active (or isOpenAndActive).
      if (!w) return false;

      // Preferred API in MZ
      if (typeof w.isOpenAndActive === "function") {
        try { return !!w.isOpenAndActive(); } catch (e) {}
      }

      // Fallback: require active, and (open if possible)
      if (!w.active) return false;

      var open = true;
      if (typeof w.isOpen === "function") {
        try { open = !!w.isOpen(); } catch (e2) { open = true; }
      } else if (w.openness != null) {
        open = (w.openness > 0);
      }
      return !!open;
    }

    var selectingList = isOpenVisible(s._skillTypeWindow) || isOpenVisible(s._skillWindow) || isOpenVisible(s._itemWindow);
    if (selectingList) {
      try { if (typeof BattleManager !== 'undefined' && BattleManager) BattleManager._aprbSlowSticky = true; } catch (e) {}
      return true;
    }

    // Target selection opened from skill/item (or still returning to them)
    var selectingTarget = isOpenVisible(s._enemyWindow) || isOpenVisible(s._actorWindow);
    if (selectingTarget) {
      // Primary signals
      if (s._rt_menuMode === "enemyTarget" || s._rt_menuMode === "actorTarget") return true;
      if (s._rt_returnMenuMode === "skill" || s._rt_returnMenuMode === "item") return true;
      // Fallback: if list windows are still around/open, we are effectively in selection flow.
      if (isOpenVisible(s._skillWindow) || isOpenVisible(s._itemWindow) || isOpenVisible(s._skillTypeWindow)) return true;
    }

    // Extra robust fallback:
    // Some UI plugins replace Scene_Battle's window references (e.g. skill/item windows)
    // but still place them on the windowLayer. Detect active/open battle selection windows
    // by scanning windowLayer children.
    try {
      const wl = s._windowLayer;
      const kids = wl && wl.children ? wl.children : null;
      if (kids && kids.length) {
        for (let i = 0; i < kids.length; i++) {
          const w = kids[i];
          if (!w) continue;
          const name = (w.constructor && w.constructor.name) ? String(w.constructor.name) : '';
          const isBattleList = (name.includes('Window_BattleSkill') || name.includes('Window_BattleItem') ||
                               name.includes('Window_BattleEnemy') || name.includes('Window_BattleActor') ||
                               name.includes('Window_SkillList') || name.includes('Window_ItemList'));
          if (!isBattleList) continue;
          if (isOpenVisible(w)) {
            try { if (typeof BattleManager !== 'undefined' && BattleManager) BattleManager._aprbSlowSticky = true; } catch (e) {}
            return true;
          }
        }
      }
    } catch (e2) {}

    // Sticky: keep slow while we are in (or returning from) skill/item selection,
    // even if windows get temporarily deactivated by enemy actions.
    // However, if everything is already closed and no menu state remains, drop sticky.
    if (typeof BattleManager !== "undefined" && BattleManager._aprbSlowSticky) {
      var anyOpen = selectingList || selectingTarget ||
                   (s._rt_menuMode === "skill" || s._rt_menuMode === "item" ||
                    s._rt_menuMode === "enemyTarget" || s._rt_menuMode === "actorTarget") ||
                   (s._rt_returnMenuMode === "skill" || s._rt_returnMenuMode === "item");
      if (anyOpen) return true;
      BattleManager._aprbSlowSticky = false;
    }

    return false;
  }

  // -------- Parse special trigger arrays --------
  function parseStructArray(raw) {
    if (!raw) return [];
    try {
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return [];
      return arr.map(s => {
        if (typeof s !== "string") return null;
        try { return JSON.parse(s); } catch { return null; }
      }).filter(Boolean);
    } catch {
      return [];
    }
  }
  const SPECIAL_USE = parseStructArray(p["SpecialUseTriggers"]);
  const SPECIAL_RESULT = parseStructArray(p["SpecialResultTriggers"]);
  if (DEBUG_LOG) {
    _aprbDbg('[APRT] loaded pluginName=' + PLUGIN_NAME +
      ' enableRealtimeControl=' + ENABLE_CONTROL +
      ' apVarId=' + AP_VAR_ID +
      ' maxApVarId=' + MAX_AP_VAR_ID +
      ' apRegenVarId=' + AP_REGEN_VAR_ID +
      ' controlActorIndex=' + CONTROL_ACTOR_INDEX +
      ' specialUseTriggers=' + SPECIAL_USE.length +
      ' specialResultTriggers=' + SPECIAL_RESULT.length);
  }


  // ============================================================
  // BattleActionCE: last action context
  // ============================================================
  window.BattleActionCE = {
    _c: {
      userType: null, // "actor" / "enemy"
      userActorId: 0,
      userEnemyIndex: -1,
      userEnemyId: 0,
      targetType: null,
      targetActorId: 0,
      targetEnemyIndex: -1,
      targetEnemyId: 0,
      skillId: 0,
      itemId: 0,
      isSkill: false,
      isItem: false,
      isHit: false,
      isEvaded: false,
      isCritical: false,
    },
    setContext(user, target, item, result) {
      const c = this._c;

      if (user && user.isActor && user.isActor()) {
        c.userType = "actor";
        c.userActorId = user.actorId();
        c.userEnemyIndex = -1;
        c.userEnemyId = 0;
      } else if (user && user.isEnemy && user.isEnemy()) {
        c.userType = "enemy";
        c.userActorId = 0;
        c.userEnemyIndex = user.index();
        c.userEnemyId = user.enemyId();
      } else {
        c.userType = null;
        c.userActorId = 0;
        c.userEnemyIndex = -1;
        c.userEnemyId = 0;
      }

      if (target && target.isActor && target.isActor()) {
        c.targetType = "actor";
        c.targetActorId = target.actorId();
        c.targetEnemyIndex = -1;
        c.targetEnemyId = 0;
      } else if (target && target.isEnemy && target.isEnemy()) {
        c.targetType = "enemy";
        c.targetActorId = 0;
        c.targetEnemyIndex = target.index();
        c.targetEnemyId = target.enemyId();
      } else {
        c.targetType = null;
        c.targetActorId = 0;
        c.targetEnemyIndex = -1;
        c.targetEnemyId = 0;
      }

      c.skillId = 0;
      c.itemId = 0;
      c.isSkill = false;
      c.isItem = false;
      if (item) {
        if (DataManager.isSkill(item)) {
          c.skillId = item.id;
          c.isSkill = true;
        } else if (DataManager.isItem(item)) {
          c.itemId = item.id;
          c.isItem = true;
        }
      }

      if (result) {
        c.isHit = result.isHit ? result.isHit() : false;
        c.isEvaded = !!result.evaded;
        c.isCritical = !!result.critical;
      } else {
        c.isHit = false;
        c.isEvaded = false;
        c.isCritical = false;
      }
    },

    lastUserType() { return this._c.userType; },
    lastUserActorId() { return this._c.userActorId; },
    lastUserEnemyIndex() { return this._c.userEnemyIndex; },
    lastUserEnemyId() { return this._c.userEnemyId; },
    lastTargetType() { return this._c.targetType; },
    lastTargetActorId() { return this._c.targetActorId; },
    lastTargetEnemyIndex() { return this._c.targetEnemyIndex; },
    lastTargetEnemyId() { return this._c.targetEnemyId; },
    lastSkillId() { return this._c.skillId; },
    lastItemId() { return this._c.itemId; },
    lastIsSkill() { return this._c.isSkill; },
    lastIsItem() { return this._c.isItem; },
    lastIsHit() { return this._c.isHit; },
    lastIsEvaded() { return this._c.isEvaded; },
    lastIsCritical() { return this._c.isCritical; },
  };



  // ============================================================
  // SpecialResultTriggers BEFORE: hook into BattleLog result display
  // (so it runs before damage popups / result messages)
  // ============================================================
  if (Window_BattleLog && Window_BattleLog.prototype) {
    const _APRB_WBL_displayActionResults = Window_BattleLog.prototype.displayActionResults;
    Window_BattleLog.prototype.displayActionResults = function(subject, target) {
      try {
        // Resolve action/item robustly (some battlelog plugins may not set this._action)
        let action = null;
        try { action = this._action; } catch (e0) {}
        if (!action) {
          try { action = BattleManager && BattleManager._action; } catch (e1) {}
        }
        if (!action) {
          try {
            if (subject && subject.currentAction) action = subject.currentAction();
          } catch (e2) {}
        }

        const item = action && action.item ? action.item() : null;
        const user = subject;
        const result = target ? target.result() : null;

        if (user && item && target && result) {
          runSpecialResultTriggersBefore(user, target, item, result);
        }
      } catch (e) {
        // fail-safe: never block battle flow
        if (DEBUG_LOG) _aprbDbg('[APRB][SpecialResultTriggers][Before] ' + (e && e.stack ? e.stack : String(e)));
      }
      return _APRB_WBL_displayActionResults.call(this, subject, target);
    };
  }


  // ============================================================
  // AP System (variables)
  //   - AP can be negative
  //   - AP is clamped to MaxAP on the upper side only
  // ============================================================

  function _num(v) {
    v = Number(v);
    return isNaN(v) ? 0 : v;
  }

  const APRB = {
    apVarId() { return AP_VAR_ID; },
    maxApVarId() { return MAX_AP_VAR_ID; },
    apRegenVarId() { return AP_REGEN_VAR_ID; },

    ap() {
      if (AP_VAR_ID <= 0) return 0;
      return _num($gameVariables.value(AP_VAR_ID));
    },
    setAp(v) {
      if (AP_VAR_ID <= 0) return;
      v = _num(v);
      // Safety clamp (upper only)
      const max = this.maxAp();
      if (v > max) v = max;
      $gameVariables.setValue(AP_VAR_ID, v);
    },
    maxAp() {
      if (MAX_AP_VAR_ID <= 0) return 0;
      const v = _num($gameVariables.value(MAX_AP_VAR_ID));
      return v < 0 ? 0 : v;
    },
    setMaxAp(v) {
      if (MAX_AP_VAR_ID <= 0) return;
      v = Math.max(0, _num(v));
      $gameVariables.setValue(MAX_AP_VAR_ID, v);
      // If AP is already over, normalize
      if (this.ap() > v) this.setAp(v);
    },
    apRegen() {
      if (AP_REGEN_VAR_ID <= 0) return 0;
      return _num($gameVariables.value(AP_REGEN_VAR_ID));
    },
    setApRegen(v) {
      if (AP_REGEN_VAR_ID <= 0) return;
      $gameVariables.setValue(AP_REGEN_VAR_ID, _num(v));
    },

    gainAp(delta) {
      delta = _num(delta);
      if (delta === 0) return;
      const cur = this.ap();
      const max = this.maxAp();

      // Upper clamp only
      if (delta > 0) {
        if (cur >= max) return; // 超過する計算は無効化
        let next = cur + delta;
        if (next > max) next = max; // それでも超えたときは最大APに均す
        this.setAp(next);
      } else {
        // negative allowed
        const next = cur + delta;
        this.setAp(next);
      }
    },
    consumeAp(cost) {
      this.gainAp(-_num(cost));
    },
  };

  // New Game: (v2.0.53+) ここでは一切初期化しません。
  //  - 初期化（初期最大AP/初期AP回復量）は本体では行いません。必要ならユーザー側で変数へ設定してください。
  //  - 旧バージョン互換のため一部パラメータは残していますが、
  //    初期最大AP/初期AP回復量に関するものは使用しません。
  //
  // NOTE:
  // DataManager.setupNewGame を上書きしないことで、セーブロード/テストプレイ/タイトル復帰などの
  // タイミング差異による「勝手な再代入」を完全に排除します。

  // Battle start: (v2.0.53+) APはここで初期化しません。
  const _BattleManager_setup = BattleManager.setup;
  BattleManager.setup = function(troopId, canEscape, canLose) {
    _BattleManager_setup.call(this, troopId, canEscape, canLose);


    // Ensure ActionEndDelay config exists
    APRB_ensureActionEndDelayConfig();

    // Realtime input lock (post-battle): reset on every battle start.
    // When true, Scene_Battle realtime keys (attack/guard/skill/item/escape) are ignored.
    this._aprbPostBattleInputLocked = false;

    // Slow-down sticky flag: reset on every battle start.
    this._aprbSlowSticky = false;

    // Slow-down cached state: reset on every battle start.
    this._aprbSlowActive = false;
    this._aprbSlowCachedPct = null;
    this._aprbSlowRate = 1.0;
    this._aprbTpbAcc = 0;
    // v2.0.53+: 戦闘開始時APを、指定変数(BATTLE_START_AP_VAR_ID)からAP_VAR_IDへ代入します。
    // 初期最大AP/初期AP回復量の自動初期化は行いません。
    if (BATTLE_START_AP_VAR_ID > 0 && AP_VAR_ID > 0 && typeof $gameVariables !== 'undefined') {
      var v = Number($gameVariables.value(BATTLE_START_AP_VAR_ID) || 0);
      $gameVariables.setValue(AP_VAR_ID, v);
    }
    this._aprbPassiveQueue = [];

    // ActionEndDelay timer reset
    this._aprbActionEndDelayTimer = 0;

    // Seed ActionEndDelay config from plugin parameters (if save has 0 / undefined)
    try { APRB_ensureActionEndDelayConfig(); } catch (e) {}
  };

  // Actor API surface (for UI/other plugins)
  Game_Actor.prototype.ap = function() {
    const a = $gameParty && $gameParty.battleMembers ? $gameParty.battleMembers()[CONTROL_ACTOR_INDEX] : null;
    if (a && a.actorId && this.actorId && a.actorId() === this.actorId()) return APRB.ap();
    return 0;
  };
  Game_Actor.prototype.maxAp = function() {
    const a = $gameParty && $gameParty.battleMembers ? $gameParty.battleMembers()[CONTROL_ACTOR_INDEX] : null;
    if (a && a.actorId && this.actorId && a.actorId() === this.actorId()) return APRB.maxAp();
    return 0;
  };
  Game_Actor.prototype.gainAp = function(v) {
    const a = $gameParty && $gameParty.battleMembers ? $gameParty.battleMembers()[CONTROL_ACTOR_INDEX] : null;
    if (a && a.actorId && this.actorId && a.actorId() === this.actorId()) APRB.gainAp(v);
  };
  Game_Actor.prototype.consumeAp = function(v) {
    this.gainAp(-_num(v));
  };

  if (SHOW_AP_IN_NAME) {
    const _Game_Battler_name = Game_Battler.prototype.name;
    Game_Battler.prototype.name = function() {
      const base = _Game_Battler_name.call(this);
      if (this.isActor && this.isActor() && this.ap) {
        return base + " [AP:" + this.ap() + "/" + this.maxAp() + "]";
      }
      return base;
    };
  }

  // ------------------------------------------------------------
  // Turn hook: on actor input start
  //  - controlled actor: auto AP recovery + passive skills, no player command
  // ------------------------------------------------------------

  function isControlledActor(actor) {
    if (!actor || !(actor.isActor && actor.isActor())) return false;
    const members = $gameParty ? $gameParty.battleMembers() : [];
    const a = members[CONTROL_ACTOR_INDEX] || members[0];
    return a && a.actorId && actor.actorId && a.actorId() === actor.actorId();
  }

  // Return the controlled actor instance (battle member at CONTROL_ACTOR_INDEX; fallback: first).
  // This helper MUST NOT depend on BattleManager.actor(), because in our realtime flow
  // the engine's "current input actor" can be null or point elsewhere.
  function getControlledActor() {
    const members = ($gameParty && $gameParty.battleMembers) ? $gameParty.battleMembers() : [];
    return members[CONTROL_ACTOR_INDEX] || members[0] || null;
  }

  function parsePassiveSkills(actor) {
    const list = [];
    if (!actor || !actor.skills) return list;
    const skills = actor.skills();
    for (let i = 0; i < skills.length; i++) {
      const s = skills[i];
      if (!s) continue;
      const note = s.note || "";
      if (note.indexOf("<APRB_passive>") >= 0) list.push(s.id);
    }
    return list;
  }

  function pickTargetsForSkill(actor, skill) {
    // Use Game_Action's built-in target resolution when possible.
    const action = new Game_Action(actor, true);
    action.setSkill(skill.id);

    // Opponent target: use focused enemy if any
    if (action.isForOpponent && action.isForOpponent()) {
      const enemies = $gameTroop ? $gameTroop.aliveMembers() : [];
      if (enemies.length <= 0) return [];
      const idx = Math.max(0, Math.min(BattleManager._aprbFocusEnemyIndex || 0, enemies.length - 1));
      return [enemies[idx]];
    }

    // Friend targets: let makeTargets decide (self/allies)
    if (action.makeTargets) {
      return action.makeTargets();
    }
    return [actor];
  }

  function queuePassiveActions(actor) {
    const ids = parsePassiveSkills(actor);
    if (!ids.length) return;
    BattleManager._aprbPassiveQueue = BattleManager._aprbPassiveQueue || [];
    for (let i = 0; i < ids.length; i++) {
      BattleManager._aprbPassiveQueue.push({ actorId: actor.actorId(), skillId: ids[i] });
    }
  }

  function tryStartNextPassiveAction() {
    const q = BattleManager._aprbPassiveQueue;
    if (!q || !q.length) return false;

    const top = q.shift();
    const actor = $gameActors ? $gameActors.actor(top.actorId) : null;
    if (!actor || !actor.isAlive || !actor.isAlive()) return false;

    const skill = $dataSkills ? $dataSkills[top.skillId] : null;
    if (!skill) return false;
    if (actor.canUse && !actor.canUse(skill)) return false;

    // Determine a target index (for forceAction API)
    let targetIndex = actor.index ? actor.index() : 0;
    const targets = pickTargetsForSkill(actor, skill);
    if (targets && targets.length) {
      const t = targets[0];
      if (t && t.isEnemy && t.isEnemy()) targetIndex = t.index();
      else if (t && t.isActor && t.isActor()) targetIndex = t.index();
    }

    actor.forceAction(skill.id, targetIndex);
    BattleManager.forceAction(actor);
    return true;
  }

  const _BattleManager_startActorInput = BattleManager.startActorInput;
  BattleManager.startActorInput = function() {
    _BattleManager_startActorInput.call(this);
    const actor = this.actor && this.actor();
    if (!isControlledActor(actor)) return;

    // Do NOT end actor input or clear TPB charge here.
    // We handle AP regen/passives and end the cycle in BattleManager.updateTpb
  };


  // ------------------------------------------------------------
  // AP regen & passives: stable turn-start hook (controlled actor)
  //
  // ★最優先修正: AP回復の安定化
  //
  // 要件:
  //   - 『TPB満タン＝自分のターン』を、**1ターンにつき必ず1回だけ** に固定する
  //   - 攻撃/防御/スキル/アイテム/強制行動(ForceAction)の有無に影響されない
  //
  // 方針:
  //   - isTpbCharged() の "trueになった瞬間" をトリガーにする
  //   - ただし、他プラグインや強制行動の絡みで charged が一瞬だけ外れて
  //     同じターン内に再び true になるケースがあり得るため、
  //     "エッジ" ではなく "ロック" で 1回/サイクル を保証する。
  //
  // ロック解除条件:
  //   - 我々が charge を消費した後(= charging に戻った後)、
  //     _tpbChargeTime が十分に小さい状態(<= 0.01)になったら解除する。
  //     ※ clearTpbChargeTime() を呼ぶので通常はすぐ 0 になる。
  //
  // これにより:
  //   - 1回の満タン到達につき AP回復は必ず1回だけ
  //   - 「回復しないターン」「まとめて全回復」(多重トリガー)を潰す
  // ------------------------------------------------------------

  // NOTE:
  //  v2.0.39 まで「updateTpb の呼び出し頻度を落とす」方式でスローを実現していましたが、
  //  MZ の TPB は内部で経過時間(delta)を参照するため、呼び出し回数を減らしても
  //  次回呼び出し時に delta が大きくなり相殺され、結果として速度が落ちません。
  //
  //  v2.0.43 では「TPB加速度(tpbAcceleration)そのものをn%にスケール」する方式に変更し、
  //  アクティブTPB中でも確実に速度が反映されるようにします。

  // Update slow rate from current Scene_Battle state.
  // This is the single source of truth for BattleManager._aprbSlowRate.
  function aprbUpdateSlowRateFromScene(bm) {
    // Hard time-stop (e.g. Z hold detection)
    if (bm && bm._aprbTimeStop) {
      bm._aprbSlowActive = true;
      bm._aprbSlowRate = 0.0;
      return 0.0;
    }

    bm = bm || BattleManager;
    if (!bm) return 1.0;
    // Determine slow mode.
    // NOTE:
    //  Some plugin stacks can temporarily disturb our menu-state flags when the actor
    //  takes damage or forced actions run. If we "cache" the percent, it can get
    //  stuck at 100 until another action resets the state. To make it deterministic,
    //  we always re-read the percent while slow mode is active.
    var slowActive = aprbIsSlowModeActive();
    if (slowActive) {
      bm._aprbSlowActive = true;
      var pct = Number(aprbSlowPercent());
      if (!isFinite(pct) || pct <= 0) pct = 100;
      if (pct > 100) pct = 100;
      bm._aprbSlowRate = Math.max(0, Math.min(1, pct / 100));
    } else {
      bm._aprbSlowActive = false;
      bm._aprbSlowRate = 1.0;
    }

    // Debug: if slow is not active but windows/menu look open, dump info.
    if (DEBUG_LOG) {
      try {
        const fc = (typeof Graphics !== 'undefined' && Graphics.frameCount != null) ? Number(Graphics.frameCount) : -1;
        if (fc >= 0 && fc % 30 === 0) {
          const s = SceneManager && SceneManager._scene ? SceneManager._scene : null;
          if (s && (typeof Scene_Battle === 'undefined' || (s instanceof Scene_Battle))) {
            const rt = { menuOpen: bm._aprbMenuOpen, rt_menuMode: s._rt_menuMode, rt_returnMenuMode: s._rt_returnMenuMode };
            const wl = s._windowLayer;
            const kids = wl && wl.children ? wl.children : [];
            const openWins = [];
            for (let i = 0; i < kids.length; i++) {
              const w = kids[i];
              if (!w) continue;
              const cname = (w.constructor && w.constructor.name) ? String(w.constructor.name) : '';
              if (!(cname.includes('Window_Battle') || cname.includes('Window_Skill') || cname.includes('Window_Item'))) continue;
              const shown = !!w.visible || !!w.active || (w.openness != null && w.openness > 0);
              const open = (typeof w.isOpen === 'function') ? !!w.isOpen() : (w.openness != null ? w.openness > 0 : shown);
              // v2.0.69: For debugging, highlight windows that are interactive (active).
              if (shown && open) openWins.push({ name: cname, visible: !!w.visible, active: !!w.active, openness: w.openness });
            }
            // If something looks open but slowActive is false, output.
            if (!slowActive && openWins.length) {
              _aprbDbg('[APRB][Slow] looks-open-but-not-slow frame=' + fc + ' rt=' + rt + ' openWins=' + openWins.map(w=>w.name).join(','));
            }
            if (slowActive && openWins.length) {
              _aprbDbg('[APRB][Slow] slow-active frame=' + fc + ' rate=' + bm._aprbSlowRate + ' rt=' + rt + ' openWins=' + openWins.slice(0,6).map(w=>w.name).join(','));
            }
          }
        }
      } catch (eDbg) {}
    }
    return bm._aprbSlowRate;
  }

// ============================================================
// TBP-frame progress hook (used by StateKeepFrame / ActionEndDelay)
//  - We treat a "TBP-frame" as one BattleManager.updateTpb tick where time is progressing.
//  - When hard-stopped (_aprbTimeStop) or slowRate==0, TBP does not progress.
// ============================================================
function APRB_allBattlers() {
  const a = ($gameParty && $gameParty.battleMembers) ? $gameParty.battleMembers() : [];
  const e = ($gameTroop && $gameTroop.members) ? $gameTroop.members() : [];
  
// --- BattleLog safe enqueue (for removed states outside action flow) ---
function APRB_getBattleLogWindow() {
  try {
    if (BattleManager && BattleManager._logWindow) return BattleManager._logWindow;
  } catch (e) {}
  try {
    if (typeof SceneManager !== "undefined" && SceneManager._scene && SceneManager._scene._logWindow) return SceneManager._scene._logWindow;
  } catch (e) {}
  return null;
}

function APRB_enqueueBattleLogCommands(cmds) {
  try {
    const lw = APRB_getBattleLogWindow();
    if (lw && lw.push) {
      for (let i = 0; i < cmds.length; i++) {
        const c = cmds[i];
        lw.push.apply(lw, c);
      }
      return true;
    }
  } catch (e) {}
  // defer until logWindow is ready
  try {
    if (!BattleManager._aprbPendingBattleLog) BattleManager._aprbPendingBattleLog = [];
    BattleManager._aprbPendingBattleLog.push(cmds);
  } catch (e2) {}
  return false;
}

function APRB_flushPendingBattleLog() {
  const pending = BattleManager._aprbPendingBattleLog;
  if (!pending || !pending.length) return;
  const lw = APRB_getBattleLogWindow();
  if (!lw || !lw.push) return;
  // flush oldest first
  while (pending.length) {
    const cmds = pending.shift();
    for (let i = 0; i < cmds.length; i++) {
      lw.push.apply(lw, cmds[i]);
    }
  }
}

function APRB_emitRemovedStateLog(battler, stateId) {
  const sid = Number(stateId || 0);
  const nm = (battler && battler.name && typeof battler.name === "function") ? battler.name() : "";
  // Always log to debug buffer so we can confirm it fired.
  try { _aprbLog(`[APRB][SKF-REMOVE] battler=${nm} stateId=${sid}`); } catch (e) {}

  if (!battler || !isFinite(sid) || sid <= 0) return;
  const st = (typeof $dataStates !== "undefined") ? $dataStates[sid] : null;
  const msg = st && st.message4 ? String(st.message4) : "";
  try { _aprbLog(`[APRB][SKF-REMOVE] message4=${msg ? JSON.stringify(msg) : "<EMPTY>"}`); } catch (e) {}
  if (!msg) return;

  // engine-like formatting: many states use "の～" without %1
  const line = (/%\d/.test(msg) || msg.includes("%1")) ? msg.format(nm) : (nm + msg);

  // We MUST NOT rely on Window_BattleLog command queue processing.
  // In some environments (BM-NOT-CALLED / spriteset busy), SmoothBattleLog routes addText
  // into sprites and can also be stalled. So we directly inject into Window_BattleLog lines.
  const tryForceInject = (lw) => {
    if (!lw) return false;
    // Ensure visible/open
    try { if (typeof lw.show === "function") lw.show(); } catch (e) {}
    try { if (typeof lw.open === "function") lw.open(); } catch (e) {}
    try { lw.visible = true; } catch (e) {}

    // Bypass any addText override (e.g. MPP_SmoothBattleLog) by touching internal lines.
    try {
      if (Array.isArray(lw._lines)) {
        lw._lines.push(line);
        // keep size reasonable if maxLines exists
        if (typeof lw.maxLines === "function") {
          const ml = lw.maxLines();
          if (isFinite(ml) && ml > 0 && lw._lines.length > ml) {
            lw._lines.splice(0, lw._lines.length - ml);
          }
        }
        if (typeof lw.refresh === "function") lw.refresh();
        return true;
      }
    } catch (e) {}

    return false;
  };

  try {
    const lw = APRB_getBattleLogWindow();
    if (lw) {
      const injected = tryForceInject(lw);
      // Also try normal routes (harmless if overridden)
      try { if (typeof lw.addText === "function") lw.addText(line); } catch (e1) {}
      try { if (typeof lw.push === "function") lw.push("addText", line); } catch (e2) {}
      try { if (typeof lw.refresh === "function") lw.refresh(); } catch (e3) {}
      try { _aprbLog(`[APRB][SKF-REMOVE] logEmit=OK injected=${injected}`); } catch (e) {}
      return;
    }
  } catch (e0) {}

  // Fallback: enqueue for later when logWindow becomes available
  APRB_enqueueBattleLogCommands([
    ["addText", line]
  ]);
  try { _aprbLog(`[APRB][SKF-REMOVE] logEmit=QUEUED`); } catch (e) {}
}

// --- APRB: KeepFrame-expire removeState hook (no endAction dependency) ---
(function APRB_SKF_removeStateHook(){
  if (typeof Game_BattlerBase === "undefined") return;
  const _GB_removeState = Game_BattlerBase.prototype.removeState;
  Game_BattlerBase.prototype.removeState = function(stateId) {
    const sid = Number(stateId || 0);
    const markSid = Number(this._aprbSKF_removeSid || 0);
    const markFrame = Number(this._aprbSKF_removeFrame || 0);
    const nowFrame = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Number(Graphics.frameCount) : 0;
    const isSKF = (sid > 0 && sid === markSid && (markFrame === 0 || nowFrame === 0 || Math.abs(nowFrame - markFrame) <= 1));
    _GB_removeState.call(this, sid);
    if (isSKF) {
      // Clear mark first to avoid double logging if emit triggers another remove.
      this._aprbSKF_removeSid = 0;
      this._aprbSKF_removeFrame = 0;
      try { APRB_emitRemovedStateLog(this, sid); } catch (e) {}
    }
  };
})();
return a.concat(e);
}

// Queue a common event to run safely when no other common event is reserved/running.
// (RPGツクールの reserveCommonEvent は1枠上書きのため、トリガーが多い環境だと消えることがある)
function APRB_queueCommonEvent(ceId, reason) {
  try {
    const id = Math.max(0, Number(ceId || 0));
    if (id <= 0) return;
    const bm = BattleManager;
    if (!bm) return;
    if (!bm._aprbQueuedCommonEvents) bm._aprbQueuedCommonEvents = [];
    bm._aprbQueuedCommonEvents.push(id);
    bm._aprbCinematicAfterCommonActive = true; // reuse existing cinematic flag for input/time-stop control
    if (DEBUG_LOG) _aprbDbg(`[APRB][QueueCE] push id=${id}${reason ? " reason=" + reason : ""} qlen=${bm._aprbQueuedCommonEvents.length}`);
  } catch (e) {}
}

// Flush queued common events even if other plugins bypass BattleManager.update.
// We call this from updateTpb / Scene_Battle as a fallback so queued events won't stall.
function APRB_flushQueuedCommonEventsFallback(bm, tag) {
  try {
    if (!bm || !bm._aprbQueuedCommonEvents || bm._aprbQueuedCommonEvents.length <= 0) return;
    const running = ($gameTroop && $gameTroop.isEventRunning && $gameTroop.isEventRunning());
    const reserved = ($gameTemp && $gameTemp.isCommonEventReserved && $gameTemp.isCommonEventReserved());
    if (!running && !reserved) {
      const qid = bm._aprbQueuedCommonEvents.shift();
      if (qid > 0 && $gameTemp) {
        $gameTemp.reserveCommonEvent(qid);
        if (DEBUG_LOG) _aprbDbg(`[APRB][QueueCE] fallback-pop(${tag || "?"}) -> reserve CE ${qid} remain=${bm._aprbQueuedCommonEvents.length}`);
      }
    }
  } catch (e) {}
}


function APRB_processTbpFrameProgress(bm) {
  try {
    if (!bm) bm = BattleManager;
    if (!bm) return;

    // gate: once per graphics frame
    const fc = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Number(Graphics.frameCount) : -1;
    if (fc >= 0) {
      if (bm._aprbLastTbpProgressFrame === fc) return;
      bm._aprbLastTbpProgressFrame = fc;
    }

    // --- StateKeepFrame decrement ---
    if (STATE_KEEPFRAME_TAG_ENABLE) {
      const list = APRB_allBattlers();
      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        if (!b || !b._aprbStateKeepFrames) continue;
        const m = b._aprbStateKeepFrames;

// [r10] Seed keep-frame map for states that were applied without addState hook (e.g., some passive/conditional plugins)
try {
  if (b && typeof b.states === "function") {
    const curStates = b.states();
    if (curStates && Array.isArray(curStates)) {
      for (let si = 0; si < curStates.length; si++) {
        const st0 = curStates[si];
        const sid0 = st0 && st0.id ? Number(st0.id) : 0;
        if (!sid0 || !isFinite(sid0)) continue;
        const n0 = APRB_stateKeepFramesFor(sid0);
        if (n0 > 0 && m[sid0] == null) {
          m[sid0] = n0;
          try { _aprbLog(`[APRB][SKF-SEED] battler=${(b.name?b.name():"")} stateId=${sid0} frames=${n0}`); } catch(eSeedLog){}
        }
      }
    }
  }
} catch(eSeed){}

        const keys = Object.keys(m);
        for (let k = 0; k < keys.length; k++) {
          const sid = Number(keys[k]);
          if (!isFinite(sid) || sid <= 0) continue;
          let left = Number(m[sid] || 0);
          left -= 1;
          if (left <= 0) {
            delete m[sid];
            // remove with message (battlelog) even when removed by keepframe
            try {
              if (b.isStateAffected && b.isStateAffected(sid)) {
                // Ensure "removedStates" is populated so BattleLog can print message4 reliably
                try {
                  const r0 = (b && b.result && typeof b.result === "function") ? b.result() : (b ? b._result : null);
                  if (r0 && r0.removedStates && Array.isArray(r0.removedStates)) {
                    if (!r0.removedStates.includes(sid)) r0.removedStates.push(sid);
                  }
                } catch (e0) {}

                try { b._aprbSKF_removeSid = sid; b._aprbSKF_removeFrame = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Number(Graphics.frameCount) : 0; } catch (eMark) {}

                b.removeState(sid);

                // Some builds/plugins may clear result; re-ensure for compatibility
                try {
                  const r1 = (b && b.result && typeof b.result === "function") ? b.result() : (b ? b._result : null);
                  if (r1 && r1.removedStates && Array.isArray(r1.removedStates)) {
                    if (!r1.removedStates.includes(sid)) r1.removedStates.push(sid);
                  }
                } catch (e1) {}

                // KeepFrame expired: output a battle log line directly (do NOT rely on ActionResult timing),
// so it works even when other plugins clear results or bypass BattleManager.endAction.
APRB_emitRemovedStateLog(b, sid); // emit directly at expiry (robust vs removeState overrides)
              }
            } catch (e) {}
          } else {
            m[sid] = left;
          }
        }
      }
    }

        // flush any deferred battle log entries
    try { APRB_flushPendingBattleLog(); } catch (e) {}
    // flush any deferred common events (AfterCommonEventId etc.)
    try {
      const q = BattleManager._aprbDeferredCommonEvents;
      if (q && q.length) {
        while (q.length) {
          const id = q.shift();
          reserveCE(id);
        }
      }
    } catch (e) {}


// --- ActionEndDelay timer ---
    const cfg = APRB_getActionEndDelayConfig();
    if (cfg && cfg.enabled) {
      if (bm._aprbActionEndDelayTimer != null && bm._aprbActionEndDelayTimer > 0) {
        bm._aprbActionEndDelayTimer -= 1;
        if (bm._aprbActionEndDelayTimer <= 0) {
          bm._aprbActionEndDelayTimer = 0;
          const ceId = APRB_getActionEndDelayCommonEventId();
if (ceId > 0) {
  // Use queue to avoid being overwritten by other reserveCommonEvent calls.
  APRB_queueCommonEvent(ceId, "ActionEndDelay");
  if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE] fire -> queue CE ${ceId}`);
}}
      }
    }
  } catch (e) {}
}

  const _BattleManager_updateTpb_APRB = BattleManager.updateTpb;
  BattleManager.updateTpb = function() {
    aprbUpdateSlowRateFromScene(this);
    // Optional frame-based hard stop (e.g. guard)
    if (this._aprbTimeStopFrames && this._aprbTimeStopFrames > 0) {
      this._aprbTimeStopFrames--;
      if (this._aprbTimeStopFrames <= 0) {
        this._aprbTimeStopFrames = 0;
        this._aprbTimeStop = false;
        // Note: Z長押し派生がHardStopを使う場合は、その処理側で再度trueにします。
      }
    }
    const _aprbTbpProgressing = !this._aprbTimeStop; // progress even when slowRate is 0/undefined
    _BattleManager_updateTpb_APRB.call(this);
    if (_aprbTbpProgressing) { try { APRB_processTbpFrameProgress(this); } catch (e) {} }
    try { _aprbStallWatchdog(this); } catch (e) {}

    if (!ENABLE_CONTROL) return;

    const actor = getControlledActor();
    if (!actor || !actor.isAlive || !actor.isAlive()) return;

    // Initialize lock flags
    if (actor._aprbRegenLocked == null) actor._aprbRegenLocked = false;

    // Unlock: after we consumed the charge and the gauge restarted from ~0.
    // (Use raw charge time when available; it is the most stable signal.)
    const ct = (actor._tpbChargeTime != null) ? Number(actor._tpbChargeTime) : null;
    if (actor._aprbRegenLocked) {
      if (ct != null) {
        if (ct <= 0.01) actor._aprbRegenLocked = false;
      } else {
        // Fallback unlock: not charged anymore.
        const chargedNow0 = !!(actor.isTpbCharged && actor.isTpbCharged());
        if (!chargedNow0) actor._aprbRegenLocked = false;
      }
      if (actor._aprbRegenLocked) return;
    }

    const chargedNow = !!(actor.isTpbCharged && actor.isTpbCharged());
    if (!chargedNow) return;

    // Per-frame safety gate (in case updateTpb is called multiple times per frame)
    const fc = (typeof Graphics !== "undefined" && Graphics.frameCount != null)
      ? Number(Graphics.frameCount)
      : -1;
    if (BattleManager._aprbLastRegenFrame === fc) return;
    BattleManager._aprbLastRegenFrame = fc;

    // Lock immediately: guarantees 1 regen per charge cycle
    actor._aprbRegenLocked = true;

    // AP recovery (upper clamp inside APRB)
    APRB.gainAp(APRB.apRegen());

    // Passive skills
    queuePassiveActions(actor);
    tryStartNextPassiveAction();

    // End player input cycle & consume the charge so the gauge continues
    try { if (BattleManager.endActorInput) BattleManager.endActorInput(); } catch (e1) {}
    // Allow our controlled turn-cycle to consume the TPB charge.
    // (We block other charge-consume calls triggered by action execution.)
    BattleManager._aprbAllowChargeClear = true;
    try {
      if (actor.clearTpbChargeTime) actor.clearTpbChargeTime();
    } finally {
      BattleManager._aprbAllowChargeClear = false;
    }

    // Force charging state/time (prevents being stuck as charged)
    if (actor._tpbState != null) actor._tpbState = "charging";
    if (actor._tpbChargeTime != null) actor._tpbChargeTime = 0;
    if (actor.setActionState) actor.setActionState("undecided");
  
    // Fallback: ensure queued common events can run even if BattleManager.update is bypassed
    APRB_flushQueuedCommonEventsFallback(this, "updateTpb");
};

  // ------------------------------------------------------------
  // Player-only: prevent TPB gauge from dropping when taking actions.
  //
  // Requirement:
  //   - Only the controlled actor should keep the time gauge (TPB meter)
  //     from being consumed by action execution.
  //   - Enemies... etc
  //
  // Implementation:
  //   - Some plugins (e.g. timeline) visualize the TPB charge directly.
  //     MZ consumes the charge when an action is taken...
  //   - We intercept clearTpbChargeTime() for the controlled actor and
  //     ignore it unless we are in our own turn-cycle (BattleManager._aprbAllowChargeClear).
  // ------------------------------------------------------------
  if (typeof Game_Battler !== "undefined" && Game_Battler.prototype && Game_Battler.prototype.clearTpbChargeTime) {
    const _Game_Battler_clearTpbChargeTime_APRB = Game_Battler.prototype.clearTpbChargeTime;
    Game_Battler.prototype.clearTpbChargeTime = function() {
      try {
        if (ENABLE_CONTROL && isControlledActor(this)) {
          if (!BattleManager._aprbAllowChargeClear) {
            // Block charge consume caused by action execution.
            // Keep the gauge as-is.
            return;
          }
        }
      } catch (e0) {}
      return _Game_Battler_clearTpbChargeTime_APRB.call(this);
    };
  }


// ============================================================
// StateKeepFrame: <StateKeepFrame:n>
//  - States with this note tag do not naturally expire (turn/action end).
//  - They expire only after TBP has progressed n "TBP-frames" (see updateTpb hook).
// ============================================================
function APRB_stateKeepFramesFor(stateId) {
  try {
    if (!STATE_KEEPFRAME_TAG_ENABLE) return 0;
    const st = $dataStates ? $dataStates[stateId] : null;
    if (!st) return 0;
    // MZ note meta: <StateKeepFrame:60>
    const meta = st.meta || {};
    // Accept multiple casings/legacy tags: <StateKeepFrame:n>, <stateKeepFrame:n>, <statekeepframe:n>, <stateframekeep:n>
    let n0 = (meta.StateKeepFrame != null) ? meta.StateKeepFrame
          : (meta.stateKeepFrame != null) ? meta.stateKeepFrame
          : (meta.statekeepframe != null) ? meta.statekeepframe
          : (meta.stateframekeep != null) ? meta.stateframekeep
          : (meta.StateFrameKeep != null) ? meta.StateFrameKeep
          : null;
    if (n0 == null) {
      try {
        const keys = Object.keys(meta);
        for (let i = 0; i < keys.length; i++) {
          const k = String(keys[i] || "");
          const kl = k.toLowerCase();
          if (kl === "statekeepframe" || kl === "stateframekeep") { n0 = meta[k]; break; }
        }
      } catch (e) {}
    }
    const n = Number(n0 || 0);
    if (!isFinite(n) || n <= 0) return 0;
    return Math.floor(n);
  } catch (e) {}
  return 0;
}

function APRB_ensureBattlerKeepMap(battler) {
  if (!battler) return null;
  if (!battler._aprbStateKeepFrames) battler._aprbStateKeepFrames = {};
  return battler._aprbStateKeepFrames;
}

if (typeof Game_BattlerBase !== "undefined" && Game_BattlerBase.prototype) {
  const _GBB_addState_APRB = Game_BattlerBase.prototype.addState;
  Game_BattlerBase.prototype.addState = function(stateId) {
    const r = _GBB_addState_APRB.apply(this, arguments);
    try {
      const n = APRB_stateKeepFramesFor(stateId);
      if (n > 0) {
        const m = APRB_ensureBattlerKeepMap(this);
        if (m) {
          m[stateId] = n; // reset on add
          try { _aprbLog(`[APRB][SKF-ADD] battler=${(this.name?this.name():"")} stateId=${Number(stateId)} frames=${n}`); } catch(eAddLog){}
        }
      }
    } catch (e) {}
    return r;
  };

  const _GBB_removeState_APRB = Game_BattlerBase.prototype.removeState;
  Game_BattlerBase.prototype.removeState = function(stateId) {
    const r = _GBB_removeState_APRB.apply(this, arguments);
    try {
      if (this && this._aprbStateKeepFrames && this._aprbStateKeepFrames[stateId] != null) {
        delete this._aprbStateKeepFrames[stateId];
      }
    } catch (e) {}
    return r;
  };

  // Prevent natural turn decrement for keep-frame states
  if (Game_BattlerBase.prototype.updateStateTurns) {
    const _GBB_updateStateTurns_APRB = Game_BattlerBase.prototype.updateStateTurns;
    Game_BattlerBase.prototype.updateStateTurns = function() {
      try {
        if (STATE_KEEPFRAME_TAG_ENABLE && this && this._states && this._states.length) {
          // Temporarily exclude keep-frame states from the engine's turn decrement.
          const keep = this._aprbStateKeepFrames || null;
          if (keep) {
            const savedStates = this._states.slice();
            const savedTurns = Object.assign({}, this._stateTurns || {});
            // Remove keep states from _states so engine won't touch their turns
            this._states = this._states.filter(id => keep[id] == null);
            const r = _GBB_updateStateTurns_APRB.apply(this, arguments);
            // Restore and keep original turn counts for keep states
            this._states = savedStates;
            this._stateTurns = savedTurns;
            return r;
          }
        }
      } catch (e) {}
      return _GBB_updateStateTurns_APRB.apply(this, arguments);
    };
  }

  // Prevent natural removal at action/turn end for keep-frame states
  if (Game_BattlerBase.prototype.removeStatesAuto) {
    const _GBB_removeStatesAuto_APRB = Game_BattlerBase.prototype.removeStatesAuto;
    Game_BattlerBase.prototype.removeStatesAuto = function(timing) {
      try {
        if (STATE_KEEPFRAME_TAG_ENABLE && this && this._states && this._states.length) {
          const keep = this._aprbStateKeepFrames || null;
          if (keep) {
            const savedStates = this._states.slice();
            const savedTurns = Object.assign({}, this._stateTurns || {});
            this._states = this._states.filter(id => keep[id] == null);
            const r = _GBB_removeStatesAuto_APRB.apply(this, arguments);
            this._states = savedStates;
            this._stateTurns = savedTurns;
            return r;
          }
        }
      } catch (e) {}
      return _GBB_removeStatesAuto_APRB.apply(this, arguments);
    };
  }
}

  

// Additional safety: some engine versions define removeStatesAuto / updateStateTurns on Game_Battler (not Base).
// Ensure keep-frame states are excluded there as well.
if (typeof Game_Battler !== "undefined" && Game_Battler.prototype) {
  if (Game_Battler.prototype.updateStateTurns) {
    const _GB_updateStateTurns_APRB = Game_Battler.prototype.updateStateTurns;
    Game_Battler.prototype.updateStateTurns = function() {
      try {
        if (STATE_KEEPFRAME_TAG_ENABLE && this && this._states && this._states.length) {
          const keep = this._aprbStateKeepFrames || null;
          if (keep) {
            const savedStates = this._states.slice();
            const savedTurns = Object.assign({}, this._stateTurns || {});
            this._states = this._states.filter(id => keep[id] == null);
            const r = _GB_updateStateTurns_APRB.apply(this, arguments);
            this._states = savedStates;
            this._stateTurns = savedTurns;
            return r;
          }
        }
      } catch (e) {}
      return _GB_updateStateTurns_APRB.apply(this, arguments);
    };
  }

  if (Game_Battler.prototype.removeStatesAuto) {
    const _GB_removeStatesAuto_APRB = Game_Battler.prototype.removeStatesAuto;
    Game_Battler.prototype.removeStatesAuto = function(timing) {
      try {
        if (STATE_KEEPFRAME_TAG_ENABLE && this && this._states && this._states.length) {
          const keep = this._aprbStateKeepFrames || null;
          if (keep) {
            const savedStates = this._states.slice();
            const savedTurns = Object.assign({}, this._stateTurns || {});
            this._states = this._states.filter(id => keep[id] == null);
            const r = _GB_removeStatesAuto_APRB.apply(this, arguments);
            this._states = savedStates;
            this._stateTurns = savedTurns;
            return r;
          }
        }
      } catch (e) {}
      return _GB_removeStatesAuto_APRB.apply(this, arguments);
    };
  }
}

// Scale TPB speed itself (robust for Active TPB)
  // - We scale Game_Battler.tpbAcceleration() by BattleManager._aprbSlowRate.
  // - This affects both allies and enemies, so the whole battle runs at n% during selection.
  //
  // v2.0.47 fix:
  //  After killing an enemy with a skill, some plugin stacks can temporarily disturb
  //  the Scene_Battle/window state checks during BattleManager.updateTpb() timing,
  //  resulting in _aprbSlowRate staying at 1.0 when a window is actually open.
  //  To make slow mode deterministic, we also refresh the slow rate inside
  //  tpbAcceleration() (which is called frequently for every battler).
  //  This keeps slow mode correct even if updateTpb() was skipped or evaluated
  //  before the window state settled.
  if (typeof Game_Battler !== "undefined" && Game_Battler.prototype && Game_Battler.prototype.tpbAcceleration) {
    const _Game_Battler_tpbAcceleration_APRB = Game_Battler.prototype.tpbAcceleration;
    Game_Battler.prototype.tpbAcceleration = function() {
      var a = _Game_Battler_tpbAcceleration_APRB.call(this);
      if (typeof BattleManager !== "undefined" && BattleManager) {
        // Refresh from scene state (see note above)
        var rr = aprbUpdateSlowRateFromScene(BattleManager);
        rr = Number(rr);
        if (isFinite(rr) && rr >= 0 && rr < 0.999) return a * rr;
      }
      return a;
    };
  }

  // ------------------------------------------------------------------------
  // v2.0.51 fix (MOG + MPP_TpbTimeline 対策)
  //
  // MPP_TpbTimeline は Game_Battler.tpbAcceleration を上書きして
  // Battle Speed Rate(%) を掛けます。
  // プラグイン順で MPP が APRB より下だと、上のフックが消されて
  // APRB のスロー倍率が一切適用されません。
  //
  // そこで戦闘開始時に "現時点の tpbAcceleration" を必ずラップし直し、
  // APRB の倍率が常に "最後に" 掛かるようにします。
  // ------------------------------------------------------------------------
  function aprbEnsureTpbAccelerationHook() {
    if (typeof Game_Battler === "undefined" || !Game_Battler.prototype) return;
    if (!Game_Battler.prototype.tpbAcceleration) return;

    var current = Game_Battler.prototype.tpbAcceleration;

    // If already wrapped by APRB, keep it.
    if (current && current._aprb_isWrapper) return;

    var base = current;
    function wrapper() {
      var a = base.apply(this, arguments);
      if (typeof BattleManager !== "undefined" && BattleManager) {
        var rr = aprbUpdateSlowRateFromScene(BattleManager);
        rr = Number(rr);
        if (isFinite(rr) && rr >= 0 && rr < 0.999) return a * rr;
      }
      return a;
    }
    wrapper._aprb_isWrapper = true;
    wrapper._aprb_base = base;
    Game_Battler.prototype.tpbAcceleration = wrapper;
  }

  if (typeof Scene_Battle !== "undefined" && Scene_Battle.prototype) {
    const _Scene_Battle_start_APRB_SLOWFIX = Scene_Battle.prototype.start;
    Scene_Battle.prototype.start = function() {
      // Ensure our slow multiplier is applied last, even if other plugins overwrote it.
      aprbEnsureTpbAccelerationHook();
      _Scene_Battle_start_APRB_SLOWFIX.call(this);
    };
  }




  // Continue passive queue after each action
  const _BattleManager_endAction = BattleManager.endAction;
  BattleManager.endAction = function() {
    _BattleManager_endAction.call(this);
    if (tryStartNextPassiveAction()) {
      // keep chaining
    }
  };

  // ============================================================
  // Common Event Hooks (base)
  // ============================================================

  function classifySkillKind(user, skillId) {
    if (!user || !user.attackSkillId) return "other";
    if (skillId === user.attackSkillId()) return "attack";
    if (skillId === user.guardSkillId()) return "guard";
    return "other";
  }

  // ------------------------------------------------------------
  // Special trigger matching helpers
  // ------------------------------------------------------------
  function matchSide(user, side) {
    if (side === "any") return true;
    if (side === "actor") return user && user.isActor && user.isActor();
    if (side === "enemy") return user && user.isEnemy && user.isEnemy();
    return false;
  }

  function matchUserId(user, rule) {
    const actorId = Number(rule.ActorId || 0);
    const enemyId = Number(rule.EnemyId || 0);
    if (user && user.isActor && user.isActor()) {
      return actorId === 0 || user.actorId() === actorId;
    }
    if (user && user.isEnemy && user.isEnemy()) {
      return enemyId === 0 || user.enemyId() === enemyId;
    }
    return true;
  }

  function matchTargetId(target, rule) {
    const tSide = (rule.TargetSide || "any");
    if (tSide !== "any") {
      if (tSide === "actor" && !(target && target.isActor && target.isActor())) return false;
      if (tSide === "enemy" && !(target && target.isEnemy && target.isEnemy())) return false;
    }
    const tActorId = Number(rule.TargetActorId || 0);
    const tEnemyId = Number(rule.TargetEnemyId || 0);
    if (target && target.isActor && target.isActor()) {
      return tActorId === 0 || target.actorId() === tActorId;
    }
    if (target && target.isEnemy && target.isEnemy()) {
      return tEnemyId === 0 || target.enemyId() === tEnemyId;
    }
    return true;
  }

  function matchUse(user, item, rule) {
    const useType = (rule.UseType || "any");
    const dataId = Number(rule.DataId || 0);
    const skillKindRule = (rule.SkillKind || "any");

    const isSkill = item && DataManager.isSkill(item);
    const isItem = item && DataManager.isItem(item);

    if (useType === "skill" && !isSkill) return false;
    if (useType === "item" && !isItem) return false;

    if (isSkill) {
      const sid = item.id;
      const kind = classifySkillKind(user, sid);
      if (skillKindRule !== "any" && kind !== skillKindRule) return false;
      if (dataId !== 0 && sid !== dataId) return false;
    } else if (isItem) {
      const iid = item.id;
      if (dataId !== 0 && iid !== dataId) return false;
    } else {
      // any でも item が無いケースは基本無視
      return false;
    }
    return true;
  }

  function runSpecialUseTriggers(user, item, phase) {
    const ph = (phase || "pre");
    for (const rule of SPECIAL_USE) {
      const cePreLegacy = Number(rule.CommonEventId || 0); // backward compatible (pre)
      const cePre = Number(rule.BeforeCommonEventId || 0);
      const cePost = Number(rule.AfterCommonEventId || 0);

      const side = (rule.Side || "any");
      if (!matchSide(user, side)) continue;
      if (!matchUserId(user, rule)) continue;
      if (!matchUse(user, item, rule)) continue;

      if (ph === "post") {
        if (cePost > 0) reserveCE(cePost);
      } else {
        if (cePre > 0) reserveCE(cePre);
        if (cePreLegacy > 0) reserveCE(cePreLegacy);
      }
    }
  }

  
// ------------------------------------------------------------
// SpecialUseTriggers "発動前" を本当に行動前に割り込ませる（BeforeCommon.js方式）
// - startAction の手前でコモンを予約し、そのフレームの startAction を中断する
// - コモン実行後、同じ行動で startAction が再度呼ばれたら行動開始
// - removeCurrentAction で行動が消費されないよう抑止
// ------------------------------------------------------------
function aprbCollectSpecialUsePreCommonIds(user, item) {
  var ids = [];
  for (var i = 0; i < SPECIAL_USE.length; i++) {
    var rule = SPECIAL_USE[i];
    var cePreLegacy = Number(rule.CommonEventId || 0); // backward compatible (pre)
    var cePre = Number(rule.BeforeCommonEventId || 0);

    var side = (rule.Side || "any");
    if (!matchSide(user, side)) continue;
    if (!matchUserId(user, rule)) continue;
    if (!matchUse(user, item, rule)) continue;

    if (cePre > 0) ids.push(cePre);
    if (cePreLegacy > 0) ids.push(cePreLegacy);
  }
  return ids;
}

// BattleManager helper
BattleManager.aprbCheckSpecialUseBeforeCommon = function() {
  try {
    var subject = this._subject;
    if (!subject || !subject.currentAction) return false;

    // already in cinematic pre-common: keep startAction interrupted
    if (this._aprbExecSpecialUseBeforeCommon) return true;

    var action = subject.currentAction();
    if (!action || !action.item) return false;
    var item = action.item();
    if (!item) return false;

    // この行動は既に「発動前コモン」を消化済みならスキップ（再入防止）
    if (action._aprbBeforeCommonDone) return false;

    // 発動前コモン候補を収集し、あれば割り込む
    var ids = aprbCollectSpecialUsePreCommonIds(subject, item);
    if (ids && ids.length > 0) {
      // 同一行動に対して二度と発火させない
      action._aprbBeforeCommonDone = true;

      this._aprbExecSpecialUseBeforeCommon = true;
      this._aprbPreCommonQueue = ids.slice(); // copy
      this._aprbCinematicCommonActive = true;

      if ($gameTemp) {
        var firstId = this._aprbPreCommonQueue.shift();
        if (firstId > 0) {
          $gameTemp.reserveCommonEvent(firstId);
          if (BEFORECOMMON_DEBUG_LOG) console.log(`[APRB] BeforeCommon fire -> reserve CE ${firstId}`);
        }
      }
      return true;
    }
  } catch (e) {
    try { if (BEFORECOMMON_DEBUG_LOG) console.error(e); } catch (_) {}
  }
  return false;
};

// Cinematic common event update (pre/post)
// - progresses queued common events
// - ends cinematic flags safely
// - resumes action without requiring Enter
BattleManager.aprbUpdateCinematicCommon = function() {
  try {
    var running = false;
    var reserved = false;
    try { running = !!($gameTroop && $gameTroop._interpreter && $gameTroop._interpreter.isRunning && $gameTroop._interpreter.isRunning()); } catch (e) {}
    try { reserved = !!($gameTemp && $gameTemp.isCommonEventReserved && $gameTemp.isCommonEventReserved()); } catch (e) {}

    // Pre-common queue
    if (this._aprbExecSpecialUseBeforeCommon) {
      // If nothing is running/reserved, either reserve next or finish
      if (!running && !reserved) {
        if (this._aprbPreCommonQueue && this._aprbPreCommonQueue.length > 0) {
          var nextId = this._aprbPreCommonQueue.shift();
          if (nextId > 0 && $gameTemp) {
            $gameTemp.reserveCommonEvent(nextId);
            if (BEFORECOMMON_DEBUG_LOG) console.log(`[APRB] BeforeCommon queued -> reserve CE ${nextId}`);
          }
        } else {
          // finish
          this._aprbExecSpecialUseBeforeCommon = false;
          this._aprbPreCommonQueue = null;
          this._aprbCinematicCommonActive = false;

          if (BEFORECOMMON_DEBUG_LOG) console.log(`[APRB] BeforeCommon end -> resume action`);

          // resume action automatically on next BattleManager.update tick (no manual startAction)
          this._aprbResumeStartActionRequested = true;
        }
      }
    } else {
      // If pre-common is not active, make sure the flag doesn't stick.
      if (!running && !reserved) {
        this._aprbCinematicCommonActive = false;
      }
    }

    // Post-common (after triggers)
    if (this._aprbCinematicAfterCommonActive) {
      if (!running && !reserved) {
        this._aprbCinematicAfterCommonActive = false;
      }
    }


// Generic queued common events (ActionEndDelay etc.)
if (this._aprbQueuedCommonEvents && this._aprbQueuedCommonEvents.length > 0) {
  if (!running && !reserved) {
    var qid = this._aprbQueuedCommonEvents.shift();
    if (qid > 0 && $gameTemp) {
      $gameTemp.reserveCommonEvent(qid);
      reserved = true;
      if (DEBUG_LOG) _aprbDbg(`[APRB][QueueCE] pop -> reserve CE ${qid} remain=${this._aprbQueuedCommonEvents.length}`);
    }
  }
}

// If nothing else is pending, release after-common cinematic flag
if (this._aprbCinematicAfterCommonActive) {
  const hasQueued = !!(this._aprbQueuedCommonEvents && this._aprbQueuedCommonEvents.length > 0);
  if (!running && !reserved && !hasQueued) {
    this._aprbCinematicAfterCommonActive = false;
  }
}
  } catch (e) {
    try { if (BEFORECOMMON_DEBUG_LOG) console.error(e); } catch (_) {}
  }
};


function matchResult(rule, result) {
    const cond = (rule.Result || "any");
    if (cond === "any") return true;
    if (!result) return false;

    const isHit = result.isHit ? result.isHit() : false;
    const isEvaded = !!result.evaded;
    const isCritical = !!result.critical;
    const isParry = !!result._aprbParry;

    if (cond === "hit") return isHit && !isEvaded && !isParry;
    if (cond === "parry") return isParry;
    if (cond === "miss") return !isHit;
    if (cond === "evaded") return isEvaded;
    if (cond === "critical") return isCritical;
    return true;
  }

  function runSpecialResultTriggersBefore(user, target, item, result) {
    // Called at the beginning of Window_BattleLog.displayActionResults
    // so that common events can run before damage popups / result messages.
    for (const rule of SPECIAL_RESULT) {
      const cePreLegacy = Number(rule.CommonEventId || 0); // backward compatible (pre)
      const cePre = Number(rule.BeforeCommonEventId || 0);

      if (!(cePreLegacy > 0 || cePre > 0)) continue;

      const side = (rule.Side || "any");
      if (!matchSide(user, side)) continue;
      if (!matchUserId(user, rule)) continue;
      if (!matchTargetId(target, rule)) continue;
      if (!matchUse(user, item, rule)) continue;
      if (!matchResult(rule, result)) continue;

      // Run immediately (best-effort) before damage popups / result log.
      if (cePre > 0) aprbRunCommonEventImmediate(cePre, 'SResultPre');
      if (cePreLegacy > 0) aprbRunCommonEventImmediate(cePreLegacy, 'SResultPreLegacy');
    }
  }

  
  // SpecialResultTriggers "Before" (robust): run from Game_Action.apply wrapper.
  // This point is reached before damage popups / battle log result visuals are processed,
  // even when other plugins replace Window_BattleLog behavior.
  
  // --- SpecialResultTriggers (Pre) duplicate guard: per-action uid (robust across startAction re-hooks) ---
  const _aprbSrPreFiredByAction = new Map(); // uid -> Set(key)
  let _aprbSrActionUidCounter = 1;
  function _aprbSrGetActionUid(action) {
    if (!action) return 0;
    if (!action._aprbSrActionUid) {
      action._aprbSrActionUid = _aprbSrActionUidCounter++;
    }
    return action._aprbSrActionUid;
  }
  function _aprbSrCleanupPreFiredMapIfNeeded() {
    // avoid unbounded growth in long battles
    const limit = 400;
    const shrinkTo = 250;
    if (_aprbSrPreFiredByAction.size <= limit) return;
    const keys = Array.from(_aprbSrPreFiredByAction.keys());
    for (let i = 0; i < keys.length && _aprbSrPreFiredByAction.size > shrinkTo; i++) {
      _aprbSrPreFiredByAction.delete(keys[i]);
    }
  }

function runSpecialResultTriggersBeforeFromApply(action, user, target, item, result) {
    // Guard: prevent double-fire within the same action/target even if apply() is called more than once.
    // NOTE: Game_ActionResult.clear() does not delete custom properties, so we must NOT rely on result flags.
    const __aprbSrUid = _aprbSrGetActionUid(action);
    const __aprbSrUKey = user ? (user.isActor && user.isActor() ? ("A" + user.actorId()) : ("E" + (user.enemyId ? user.enemyId() : 0))) : "null";
    const __aprbSrTKey = target ? (target.isActor && target.isActor() ? ("A" + target.actorId()) : ("E" + (target.enemyId ? target.enemyId() : 0))) : "null";
    const __aprbSrItemId = item ? Number(item.id || 0) : 0;
    const __aprbSrHit = result ? (result.isHit && result.isHit() ? 1 : 0) : 0;
    const __aprbSrEv = result ? (result.evaded ? 1 : 0) : 0;
    const __aprbSrCr = result ? (result.critical ? 1 : 0) : 0;
    const __aprbSrKey = __aprbSrUKey + "->" + __aprbSrTKey + ":" + __aprbSrItemId + ":h" + __aprbSrHit + "e" + __aprbSrEv + "c" + __aprbSrCr;
    // Robust recent-duplicate guard (handles cases where apply() is invoked twice by other plugins with a different Game_Action instance)
    const __aprbSrFrame = (typeof Graphics !== "undefined" && Graphics && typeof Graphics.frameCount === "number")
      ? Graphics.frameCount
      : Date.now();
    const __aprbSrRecent = BattleManager._aprbSrPreRecent || (BattleManager._aprbSrPreRecent = new Map());
    const __aprbSrLast = __aprbSrRecent.get(__aprbSrKey);
    if (__aprbSrLast != null) {
      const __aprbSrDelta = __aprbSrFrame - __aprbSrLast;
      if (__aprbSrDelta >= 0 && __aprbSrDelta <= 1) {
        if (DEBUG_LOG) { try { _aprbDbg("[APRB][SResult][Pre] skip recent-dup key=" + __aprbSrKey + " delta=" + __aprbSrDelta); } catch (e) {} }
        return;
      }
    }
    __aprbSrRecent.set(__aprbSrKey, __aprbSrFrame);
    // lightweight cleanup
    if (__aprbSrRecent.size > 200) {
      for (const [k, v] of __aprbSrRecent) {
        if ((__aprbSrFrame - v) > 10) __aprbSrRecent.delete(k);
      }
    }


    let __aprbSrSet = _aprbSrPreFiredByAction.get(__aprbSrUid);
    if (!__aprbSrSet) {
      __aprbSrSet = new Set();
      _aprbSrPreFiredByAction.set(__aprbSrUid, __aprbSrSet);
      _aprbSrCleanupPreFiredMapIfNeeded();
    }
    if (__aprbSrSet.has(__aprbSrKey)) {
      if (DEBUG_LOG) { try { _aprbDbg("[APRB][SResult][Pre] skip duplicate uid=" + __aprbSrUid + " key=" + __aprbSrKey); } catch (e) {} }
      return;
    }
    __aprbSrSet.add(__aprbSrKey);
let anyRule = false;
    let fired = false;
    if (!item || !result) {
      if (DEBUG_LOG) {
        try { _aprbDbg('[APRB][SResult][Pre] skip item/result null item=' + (!!item) + ' result=' + (!!result)); } catch (e) {}
      }
    }
    for (const rule of SPECIAL_RESULT) {
      const cePreLegacy = Number(rule.CommonEventId || 0); // backward compatible (pre)
      const cePre = Number(rule.BeforeCommonEventId || 0);
      if (!(cePreLegacy > 0 || cePre > 0)) continue;
      anyRule = true;

      const side = (rule.Side || "any");
      if (!matchSide(user, side)) continue;
      if (!matchUserId(user, rule)) continue;
      if (!matchTargetId(target, rule)) continue;
      if (!matchUse(user, item, rule)) continue;
      if (!matchResult(rule, result)) continue;

      if (DEBUG_LOG) {
        try {
          _aprbDbg('[APRB][SResult][Pre] fire name=' + (rule.Name || '') +
            ' user=' + (user ? user.name() : 'null') +
            ' target=' + (target ? target.name() : 'null') +
            ' item=' + (item ? (item.name || item.id) : 'null') +
            ' cePre=' + cePre + ' ceLegacy=' + cePreLegacy +
            ' hit=' + (result && result.isHit ? result.isHit() : 'n/a') +
            ' evaded=' + (result ? !!result.evaded : 'n/a') +
            ' crit=' + (result ? !!result.critical : 'n/a'));
        } catch (e) {}
      }

      fired = true;
      // Run immediately (best-effort)
      if (cePre > 0) aprbRunCommonEventImmediate(cePre, 'SResultPre');
      if (cePreLegacy > 0) aprbRunCommonEventImmediate(cePreLegacy, 'SResultPreLegacy');
    }
    if (!fired && anyRule && DEBUG_LOG) {
      try { _aprbDbg('[APRB][SResult][Pre] no match user=' + (user ? user.name() : 'null') + ' target=' + (target ? target.name() : 'null') + ' item=' + (item ? (item.name || item.id) : 'null') + ' cond=' + (result ? ('hit=' + (result.isHit ? result.isHit() : 'n/a') + ',ev=' + !!result.evaded + ',cr=' + !!result.critical) : 'n/a')); } catch (e) {}
    }
  }
function runSpecialResultTriggersAfter(user, target, item, result) {
    // Called in Game_Action.apply (after result is decided).
    for (const rule of SPECIAL_RESULT) {
      const cePost = Number(rule.AfterCommonEventId || 0);
      if (!(cePost > 0)) continue;

      const side = (rule.Side || "any");
      if (!matchSide(user, side)) continue;
      if (!matchUserId(user, rule)) continue;
      if (!matchTargetId(target, rule)) continue;
      if (!matchUse(user, item, rule)) continue;
      if (!matchResult(rule, result)) continue;

      // "After" : defer to next frame (stability-first)
      aprbDeferReserveCE(cePost);
    }
  }

  // ============================================================
  // useItem: base common events (actor/enemy use)
  // ============================================================
  const _Game_Battler_useItem = Game_Battler.prototype.useItem;
  Game_Battler.prototype.useItem = function(item) {
    if (item) {
      if (this.isActor && this.isActor()) {
        if (DataManager.isItem(item)) {
          reserveCE(CE_ACTOR_ITEM);
        } else if (DataManager.isSkill(item)) {
          const id = item.id;
          if (id === this.attackSkillId()) reserveCE(CE_ACTOR_ATTACK);
          else if (id === this.guardSkillId()) reserveCE(CE_ACTOR_GUARD);
          else reserveCE(CE_ACTOR_SKILL);
        }
      } else if (this.isEnemy && this.isEnemy()) {
        if (DataManager.isItem(item)) {
          reserveCE(CE_ENEMY_ITEM);
        } else if (DataManager.isSkill(item)) {
          const id = item.id;
          if (id === this.attackSkillId()) reserveCE(CE_ENEMY_ATTACK);
          else if (id === this.guardSkillId()) reserveCE(CE_ENEMY_GUARD);
          else reserveCE(CE_ENEMY_SKILL);
        }
      }
    }
        // SpecialUseTriggers: 行動「使用時」判定（useItemは行動1回につき基本1回）
    if (this && item) {
    // SpecialUseTriggers: startAction 側で発動前コモンを割り込ませた場合は、useItem(pre) で二重予約しない
    try {
      const ca = (this && this.currentAction) ? this.currentAction() : null;
      if (ca && ca._aprbBeforeCommonDone && ca.item && ca.item() === item) {
        // skip
      } else {
        runSpecialUseTriggers(this, item, "pre");
      }
    } catch (e) {
      runSpecialUseTriggers(this, item, "pre");
    }
    }

    _Game_Battler_useItem.call(this, item);
  };


  // ============================================================
  // apply: set context + run special result triggers (per target)
  // ============================================================
  const _Game_Action_apply = Game_Action.prototype.apply;
  Game_Action.prototype.apply = function(target) {
    const user = this.subject();
    const item = this.item();

    _Game_Action_apply.call(this, target);

    const result = target ? target.result() : null;
    window.BattleActionCE.setContext(user, target, item, result);

    if (user && item && target) {
      // SpecialResultTriggers:
      // "Before" must run before damage popups / result log. The most reliable point
      // across battlelog variants is here (apply completes before visuals are queued).
      try {
        runSpecialResultTriggersBeforeFromApply(this, user, target, item, result);
      } catch (e) {}

      // "After" : stability-first (next frame)
      runSpecialResultTriggersAfter(user, target, item, result);
    }
  };



  // ============================================================
  // applyGlobal: special use triggers (post / after action resolved)
  // ============================================================
  if (Game_Action.prototype.applyGlobal) {
    const _Game_Action_applyGlobal = Game_Action.prototype.applyGlobal;
    Game_Action.prototype.applyGlobal = function() {
      const user = this.subject ? this.subject() : null;
      const item = this.item ? this.item() : null;

      _Game_Action_applyGlobal.call(this);

      if (user && item) {
                try { BattleManager._aprbCinematicAfterCommonActive = true; } catch (e) {}
        if (BEFORECOMMON_DEBUG_LOG) console.log(`[APRB] AfterCommon reserve (post)`);
        runSpecialUseTriggers(user, item, "post");
      }
    };
  }
  // ============================================================
  // HP change: damaged/KO
  // ============================================================
  const _Game_Battler_gainHp = Game_Battler.prototype.gainHp;
  Game_Battler.prototype.gainHp = function(value) {
    const beforeHp = this.hp;
    const wasAlive = this.isAlive();
    _Game_Battler_gainHp.call(this, value);
    const afterHp = this.hp;
    const isDownNow = wasAlive && !this.isAlive();

    if (this.isActor && this.isActor()) {
      if (afterHp < beforeHp) reserveCE(CE_ACTOR_DAMAGED);
      if (isDownNow) reserveCE(CE_ACTOR_KO);
    } else if (this.isEnemy && this.isEnemy()) {
      if (afterHp < beforeHp) reserveCE(CE_ENEMY_DAMAGED);
      if (isDownNow) reserveCE(CE_ENEMY_KO);
    }
  };

  // ============================================================
  // Evasion
  // ============================================================
  const _Game_Battler_performEvasion = Game_Battler.prototype.performEvasion;
  Game_Battler.prototype.performEvasion = function() {
    if (this.isActor && this.isActor()) reserveCE(CE_ACTOR_EVADE);
    else if (this.isEnemy && this.isEnemy()) reserveCE(CE_ENEMY_EVADE);
    _Game_Battler_performEvasion.call(this);
  };

  // ============================================================
  // Defeat / Escape success
  // ============================================================

  // Post-battle realtime input lock
  //  - Prevents realtime keys (attack/guard/skill/item/escape) from firing
  //    while battle-end common events are being reserved/executed.
  //  - Especially important when using plugins like InvokeCommon_MIP.
  const _BattleManager_processVictory = BattleManager.processVictory;
  BattleManager.processVictory = function() {
    this._aprbPostBattleInputLocked = true;
    _BattleManager_processVictory.call(this);
  };

  const _BattleManager_processDefeat = BattleManager.processDefeat;
  BattleManager.processDefeat = function() {
    this._aprbPostBattleInputLocked = true;
    reserveCE(CE_LOSE);
    _BattleManager_processDefeat.call(this);
  };

  const _BattleManager_processAbort = BattleManager.processAbort;
  BattleManager.processAbort = function() {
    this._aprbPostBattleInputLocked = true;
    // Reset UI visibility after battle
    this._aprbUiVis = { all: true, icons: true, hint: true };
    _BattleManager_processAbort.call(this);
  };

  const _BattleManager_endBattle_APRB_UI = BattleManager.endBattle;
  if (_BattleManager_endBattle_APRB_UI) {
    BattleManager.endBattle = function(result) {
      // Reset UI visibility after battle
      this._aprbUiVis = { all: true, icons: true, hint: true };
      return _BattleManager_endBattle_APRB_UI.call(this, result);
    };
  }

  const _BattleManager_processEscape = BattleManager.processEscape;
  BattleManager.processEscape = function() {
    const success = _BattleManager_processEscape.call(this);
    if (success) {
      this._aprbPostBattleInputLocked = true;
      reserveCE(CE_ESCAPE);
    }
    return success;
  };

  // ============================================================
  // Scene_Battle: AP update & realtime input
  // ============================================================
  function aliveEnemies() {
    return $gameTroop ? $gameTroop.aliveMembers() : [];
  }



  // ------------------------------------------------------------
  // Focus Target Hint (v2.0.36)
  //  - Attack focus cursor is hidden after execution (deselect), but players still
  //    need to know the current focused target.
  //  - We show a small hint window with the focused enemy name.
  // ------------------------------------------------------------

  function Window_APRB_FocusHint() {
    this.initialize.apply(this, arguments);
  }

  Window_APRB_FocusHint.prototype = Object.create(Window_Base.prototype);
  Window_APRB_FocusHint.prototype.constructor = Window_APRB_FocusHint;

  // [r38] UI visibility latch hard-guard for focus hint window.
  (function(){
    try {
      const _showHint = Window_APRB_FocusHint.prototype.show;
      Window_APRB_FocusHint.prototype.show = function() {
        if (!_aprbIsUiVisible("hint")) return;
        return _showHint.call(this);
      };
    } catch(_e) {}
  })();



  Window_APRB_FocusHint.prototype.initialize = function(rect) {
    Window_Base.prototype.initialize.call(this, rect);
    this._lastName = "";
    this._lastIndex = -999;
    this.opacity = 0;
    this.contentsOpacity = 255;
    // Use game's main font and configurable size
    try {
      if (this.contents) {
        this.contents.fontFace = ($gameSystem && $gameSystem.mainFontFace) ? $gameSystem.mainFontFace() : this.contents.fontFace;
        this.contents.fontSize = FOCUS_HINT_FONT_SIZE;
      }
    } catch (eFH1) {}
    this.refresh(null);
  };

  Window_APRB_FocusHint.prototype.refresh = function(enemy) {
    // Determine texts
    if (!enemy) {
      this.contents.clear();
      this._lastName = "";
      this._lastIndex = -999;
      this.hide();
      return;
    }

    var name = enemy.name ? enemy.name() : "";
    this._lastName = name;
    this._lastIndex = enemy.index ? enemy.index() : -1;

    var label = FOCUS_HINT_LABEL_TEXT || "TARGET:";

    // Apply font settings
    try {
      this.contents.fontFace = ($gameSystem && $gameSystem.mainFontFace) ? $gameSystem.mainFontFace() : this.contents.fontFace;
      this.contents.fontSize = FOCUS_HINT_FONT_SIZE;
    } catch (eFH2) {}

    // Auto-fit window size to avoid clipping (expand only)
    if (FOCUS_HINT_AUTO_FIT) {
      try {
        var lh = this.lineHeight();
        var pad = this.padding;
        var reqW = 1;
        var reqH = 1;

        // width: max(labelX+labelWidth, enemyX+nameWidth) + padding*2 + margin
        var lw = this.textWidth(label);
        var nw = this.textWidth(name);
        reqW = Math.max(FOCUS_HINT_TARGET_X + lw, FOCUS_HINT_ENEMY_X + nw) + pad * 2 + 8;

        // height: max(Y)+lineHeight + padding*2 + margin
        var maxY = Math.max(FOCUS_HINT_TARGET_Y, FOCUS_HINT_ENEMY_Y);
        reqH = maxY + lh + pad * 2 + 8;

        var newW = Math.max(this.width, reqW);
        var newH = Math.max(this.height, reqH);
        if (newW !== this.width || newH !== this.height) {
          this.move(this.x, this.y, newW, newH);
          // When window size changes, contents bitmap must be recreated to avoid clipping
          if (typeof this.createContents === "function") {
            this.createContents();
            try {
              this.contents.fontFace = ($gameSystem && $gameSystem.mainFontFace) ? $gameSystem.mainFontFace() : this.contents.fontFace;
              this.contents.fontSize = FOCUS_HINT_FONT_SIZE;
            } catch (eFH3) {}
          }
        }
      } catch (eFit) {}
    }

    this.contents.clear();

    // Draw with correct remaining widths (avoid clipping when X offset is used)
    var cw = this.contentsWidth();
    this.changeTextColor(ColorManager.systemColor());
    var lw2 = Math.max(0, cw - FOCUS_HINT_TARGET_X);
    this.drawText(label, FOCUS_HINT_TARGET_X, FOCUS_HINT_TARGET_Y, lw2, "left");
    this.resetTextColor();
    var nw2 = Math.max(0, cw - FOCUS_HINT_ENEMY_X);
    this.drawText(name, FOCUS_HINT_ENEMY_X, FOCUS_HINT_ENEMY_Y, nw2, "left");

    this.show();
  };

  Window_APRB_FocusHint.prototype.needsRefresh = function(enemy) {
    if (!enemy) return this._lastIndex !== -999;
    var idx = enemy.index ? enemy.index() : -1;
    var name = enemy.name ? enemy.name() : "";
    return idx !== this._lastIndex || name !== this._lastName;
  };

  Scene_Battle.prototype._aprb_createFocusHintWindow = function() {
    if (!FOCUS_HINT_ENABLED) return;
    var ww = Math.max(1, FOCUS_HINT_WIN_W);
    var wh = Math.max(1, FOCUS_HINT_WIN_H);
    // Screen-based coordinates (top-left origin): X/Y are always treated as screen offsets.
    // If you want top-right placement, set FocusHintWindowX = Graphics.boxWidth - W manually.
    var wx = FOCUS_HINT_WIN_X;
    var wy = FOCUS_HINT_WIN_Y;
    var rect = new Rectangle(wx, wy, ww, wh);
    this._aprbFocusHintWindow = new Window_APRB_FocusHint(rect);
    this.addWindow(this._aprbFocusHintWindow);
    this._aprbFocusHintWindow.hide();
  };

  Scene_Battle.prototype._aprb_updateFocusHint = function() {
    if (!this._aprbFocusHintWindow) return;
    // Plugin command UI visibility
    if (!_aprbIsUiVisible("hint")) { this._aprbFocusHintWindow.hide(); return; }
    if (!FOCUS_HINT_ENABLED) { this._aprbFocusHintWindow.hide(); return; }
    if (!isBattleInProgressCompat()) { this._aprbFocusHintWindow.hide(); return; }

    // Hide hint when there is only one selectable target.
    try {
      if (this._aprb_targetCandidateCount && this._aprb_targetCandidateCount() <= 1) { this._aprbFocusHintWindow.hide(); return; }
    } catch (e) {}

    var enemy = this._rt_focusedEnemy ? this._rt_focusedEnemy() : null;
    if (!enemy) { this._aprbFocusHintWindow.refresh(null); return; }

    // If the enemy is dead, try to refresh focus selection first.
    if (enemy.isAlive && !enemy.isAlive()) {
      if (this._rt_refreshFocusSelection) this._rt_refreshFocusSelection();
      enemy = this._rt_focusedEnemy ? this._rt_focusedEnemy() : null;
    }

    if (this._aprbFocusHintWindow.needsRefresh(enemy)) {
      this._aprbFocusHintWindow.refresh(enemy);
    } else {
      // Ensure visible while cursor is hidden
      if (_aprbIsUiVisible("hint")) this._aprbFocusHintWindow.show();
      else this._aprbFocusHintWindow.hide();
    }
  };
  const _Scene_Battle_createAllWindows = Scene_Battle.prototype.createAllWindows;
  Scene_Battle.prototype.createAllWindows = function() {
    _Scene_Battle_createAllWindows.call(this);
    this._rt_focusEnemyIndex = 0;
    BattleManager._aprbFocusEnemyIndex = 0;
    this._aprbChargedHandled = false;
    this._rt_focusInitPending = true;
    // Reset UI visibility every battle (plugin commands are battle-local)
    if (typeof BattleManager !== "undefined" && BattleManager) {
      BattleManager._aprbUiVis = { all: true, icons: true, hint: true };
      _aprbClearUiVisScene();
    }
    this._aprb_createFocusHintWindow();
    this._aprb_createCommandIcons();
    if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = false;
  

  // ------------------------------------------------------------
  // Time Progress during skill/item selection (v2.0.36)
  //  - Default MZ stops TPB when any input window is active, even in Active TPB.
  //  - We allow TPB to continue (scaled by our slow percent) during skill/item
  //    list selection and their target selection.
  // ------------------------------------------------------------
  const _Scene_Battle_isTimeActive_APRB = Scene_Battle.prototype.isTimeActive;
  Scene_Battle.prototype.isTimeActive = function() {
    // Keep original behavior when not Active TPB
    if (!(BattleManager && BattleManager.isActiveTpb && BattleManager.isActiveTpb())) {
      return _Scene_Battle_isTimeActive_APRB ? _Scene_Battle_isTimeActive_APRB.call(this) : true;
    }
    // During APRB slow-mode windows, allow time to progress.
    if (aprbIsSlowModeActive()) {
      // Still pause time while messages/animations are blocking.
      if (this._messageWindow && this._messageWindow.isBusy && this._messageWindow.isBusy()) return false;
      if (this._logWindow && this._logWindow.isBusy && this._logWindow.isBusy()) return false;
      return true;
    }
    return _Scene_Battle_isTimeActive_APRB ? _Scene_Battle_isTimeActive_APRB.call(this) : true;
  };

    if (PARRY_FRAME_COUNTER_ENABLE) this._aprb_createParryFrameCounter();
};

  // ------------------------------------------------------------
  // Suppress default command windows on the controlled actor's TPB turn.
  // (We auto-handle AP recovery + passives and end the turn immediately.)
  // ------------------------------------------------------------
  const _Scene_Battle_startActorCommandSelection = Scene_Battle.prototype.startActorCommandSelection;
  Scene_Battle.prototype.startActorCommandSelection = function() {
    const actor = BattleManager.actor && BattleManager.actor();
    if (isControlledActor(actor)) {
      // Ensure windows are not shown even if the engine tries to open them.
      if (this._actorCommandWindow) {
        this._actorCommandWindow.deactivate();
        this._actorCommandWindow.close();
        this._actorCommandWindow.hide();
      }
      if (this._partyCommandWindow) {
        this._partyCommandWindow.deactivate();
        this._partyCommandWindow.close();
        this._partyCommandWindow.hide();
      }
      return;
    }
    _Scene_Battle_startActorCommandSelection.call(this);
  };

  // ------------------------------------------------------------
  // Keep Party/Actor command windows fully inactive while realtime control is enabled.
  // NOTE: Even if we hide them, if they stay "active" they will still consume arrow inputs
  //       and play cursor sounds. We forcibly deactivate them after every input-window refresh.
  // ------------------------------------------------------------
  const _Scene_Battle_changeInputWindow = Scene_Battle.prototype.changeInputWindow;
  Scene_Battle.prototype.changeInputWindow = function() {
    // If our realtime menus are open, DO NOT call the default changeInputWindow.
    // The default implementation may reset selections (refresh/select) every time,
    // which causes the cursor to snap back to the initial item immediately.
    // We only maintain visibility/activation while our menus are open.
    const rtMode = this._rt_menuMode;
    const skipDefault = (rtMode === "skill" || rtMode === "item" || rtMode === "enemyTarget" || rtMode === "actorTarget");
    if (!skipDefault) {
      _Scene_Battle_changeInputWindow.call(this);
    }

    if (!ENABLE_CONTROL) return;

    // Party command (Fight/Escape)
    if (this._partyCommandWindow) {
      this._partyCommandWindow.deactivate();
      this._partyCommandWindow.close();
      this._partyCommandWindow.hide();
    }

    // Actor command (only suppress for the controlled actor)
    const actor = BattleManager.actor && BattleManager.actor();
    if (isControlledActor(actor) && this._actorCommandWindow) {
      this._actorCommandWindow.deactivate();
      this._actorCommandWindow.close();
      this._actorCommandWindow.hide();
    }
    // If we are forcing our own Skill/Item/Target menu open, the default changeInputWindow
    // may immediately hide them (because TPB is not in "inputting" phase).
    // We ONLY enforce visibility/activation here (NO refresh/select), otherwise
    // the cursor selection can snap back every frame.
    if (rtMode === "skill") {
      if (this._skillTypeWindow) {
      if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = true;
      if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "skill"; BattleManager._aprbMenuStage = "list"; }

      if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = true;
      if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "skill"; BattleManager._aprbMenuStage = "list"; }

      if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = true;
      if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "skill"; BattleManager._aprbMenuStage = "list"; }
        if (!this._skillTypeWindow.parent) {
          try { this.addWindow(this._skillTypeWindow); } catch (eSI) {}
        }
        if (!this._skillTypeWindow.visible) this._skillTypeWindow.show();
        this._skillTypeWindow.open && this._skillTypeWindow.open();
        if (!this._skillTypeWindow.active && this._skillTypeWindow.activate) this._skillTypeWindow.activate();
      } else if (this._skillWindow) {
        if (!this._skillWindow.parent) {
          try { this.addWindow(this._skillWindow); } catch (eSW) {}
        }
        if (!this._skillWindow.visible) this._skillWindow.show();
        this._skillWindow.open && this._skillWindow.open();
        if (!this._skillWindow.active && this._skillWindow.activate) this._skillWindow.activate();
      }
    } else if (rtMode === "item") {
      if (this._itemWindow) {
        if (!this._itemWindow.parent) {
          try { this.addWindow(this._itemWindow); } catch (eIW) {}
        }
        if (!this._itemWindow.visible) this._itemWindow.show();
        this._itemWindow.open && this._itemWindow.open();
        if (!this._itemWindow.active && this._itemWindow.activate) this._itemWindow.activate();
      }
    } else if (rtMode === "enemyTarget") {
      if (this._enemyWindow) {
        if (!this._enemyWindow.visible) this._enemyWindow.show();
        this._enemyWindow.open && this._enemyWindow.open();
        if (!this._enemyWindow.active && this._enemyWindow.activate) this._enemyWindow.activate();
      }
    } else if (rtMode === "actorTarget") {
      if (this._actorWindow) {
        if (!this._actorWindow.visible) this._actorWindow.show();
        this._actorWindow.open && this._actorWindow.open();
        if (!this._actorWindow.active && this._actorWindow.activate) this._actorWindow.activate();
      }
    }
  };

  // ------------------------------------------------------------
  // Suppress Party Command (Fight/Escape)
  //  - With realtime control, we don't use the default party command flow.
  //  - Escape is handled by the ESC key (plugin option).
  // ------------------------------------------------------------
  const _Scene_Battle_startPartyCommandSelection = Scene_Battle.prototype.startPartyCommandSelection;
  Scene_Battle.prototype.startPartyCommandSelection = function() {
    if (ENABLE_CONTROL) {
      // Let the engine set up the party command flow, then immediately auto-select "Fight"
      // while keeping the window hidden.
      _Scene_Battle_startPartyCommandSelection.call(this);

      if (this._partyCommandWindow) {
        this._partyCommandWindow.deactivate();
        this._partyCommandWindow.close();
        this._partyCommandWindow.hide();
      }

      // Equivalent to choosing "Fight".
      if (this.commandFight) {
        this.commandFight();
      } else if (BattleManager && BattleManager.selectNextCommand) {
        BattleManager.selectNextCommand();
      }
      return;
    }
    _Scene_Battle_startPartyCommandSelection.call(this);
  };

  const _Scene_Battle_start = Scene_Battle.prototype.start;
  Scene_Battle.prototype.start = function() {
    _Scene_Battle_start.call(this);

    // Reset realtime menu state (safety)
    this._rt_menuMode = null;
    this._rt_returnMenuMode = null;

    // ------------------------------------------------------------
    // Key separation (battle-only)
    //  - RPGツクールMZの標準では X(88) が escape/cancel 相当になっているため、
    //    戦闘中だけ 88 を固有キー "x" に割り当て直します。
    //  - 戦闘終了時に元へ戻します。
    // ------------------------------------------------------------
    // X(88) => "x" (battle only)
    this._aprb_prevKeyMapper88 = Input.keyMapper ? Input.keyMapper[88] : undefined;
    if (Input.keyMapper) Input.keyMapper[88] = "x";

    this._rt_focusEnemyIndex = 0;
    BattleManager._aprbFocusEnemyIndex = 0;
    this._rt_focusInitPending = true;
    this._rt_refreshFocusSelection();

    // ------------------------------------------------------------
    // Parry safety reset
    //  - Avoid carrying parry window across battles (can cause a CE at battle start)
    // ------------------------------------------------------------
    try {
      if ($gameParty && $gameParty.battleMembers) {
        $gameParty.battleMembers().forEach(b => { if (b) b._aprbParryFrames = 0; });
      }
    } catch (e) {}
  };

  const _Scene_Battle_terminate = Scene_Battle.prototype.terminate;
  Scene_Battle.prototype.terminate = function() {
    // Clear Scene-local UI visibility latch
    _aprbClearUiVisScene();
    // Parry safety reset (battle end)
    try {
      if ($gameParty && $gameParty.battleMembers) {
        $gameParty.battleMembers().forEach(b => { if (b) b._aprbParryFrames = 0; });
      }
    } catch (e) {}
    // restore key mapping
    if (Input.keyMapper) {
      if (this._aprb_prevKeyMapper88 === undefined) {
        delete Input.keyMapper[88];
      } else {
        Input.keyMapper[88] = this._aprb_prevKeyMapper88;
      }
    }
    _Scene_Battle_terminate.call(this);
  };

  const _Scene_Battle_update = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function() {
    try { APRB_ensureBBWHooks(); APRB_ensureBBWNoStopHook(); } catch (e) {}

    _Scene_Battle_update.call(this);
    if (!isBattleInProgressCompat()) return;

    // ------------------------------------------------------------
    // TBP-frame progress / queued CE processing even while Scene_Battle is "busy"
    // (message/log/spriteset busy can suppress BattleManager.update in the core engine)
    // ------------------------------------------------------------
    try {
      const bm = (typeof BattleManager !== "undefined") ? BattleManager : null;
      if (bm) {
        // Keep slowRate in sync with current scene state (mirrors updateTpb hook)
        try { aprbUpdateSlowRateFromScene(bm); } catch (e) {}
        // Progress frame-based features when "battle time" is progressing
        const progressing = (!!bm._aprbSlowRate && Number(bm._aprbSlowRate) > 0) && !bm._aprbTimeStop;
        if (progressing) {
          try { APRB_processTbpFrameProgress(bm); } catch (e) {}
        }
        // Also process cinematic/queued common events without requiring Enter
        try { if (bm.aprbUpdateCinematicCommon) bm.aprbUpdateCinematicCommon(); } catch (e) {}
        // --- Robust fallbacks ---
        // Even if other plugins bypass BattleManager.update/updateTpb, keep ActionEndDelay timer and queued common events moving.
        try {
          const cfg2 = APRB_getActionEndDelayConfig();
          if (cfg2 && cfg2.enabled && bm._aprbActionEndDelayTimer != null && bm._aprbActionEndDelayTimer > 0) {
            bm._aprbActionEndDelayTimer -= 1;
            if (bm._aprbActionEndDelayTimer <= 0) {
              bm._aprbActionEndDelayTimer = 0;
              const ceId2 = APRB_getActionEndDelayCommonEventId();
              if (ceId2 > 0) {
                APRB_queueCommonEvent(ceId2, "ActionEndDelay(SceneFallback)");
                if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE] fire(SceneFallback) -> queue CE ${ceId2}`);
              }
            }
          }
        
        // --- StateKeepFrame decrement (Scene fallback) ---
        // If another plugin bypasses BattleManager.update/updateTpb, the TBP hook won't run.
        // In that case, keep-frame states would never expire. So we decrement them once per rendered frame here.
        try {
          if (STATE_KEEPFRAME_TAG_ENABLE) {
            const fc2 = (Graphics && Graphics.frameCount != null) ? Graphics.frameCount : 0;
            if (bm._aprbLastKeepFrameSceneFallback !== fc2) {
              bm._aprbLastKeepFrameSceneFallback = fc2;
              const list2 = APRB_allBattlers();
              for (let i2 = 0; i2 < list2.length; i2++) {
                const b2 = list2[i2];
                if (!b2 || !b2._aprbStateKeepFrames) continue;
                const m2 = b2._aprbStateKeepFrames;
                const keys2 = Object.keys(m2);
                for (let k2 = 0; k2 < keys2.length; k2++) {
                  const sid2 = Number(keys2[k2]);
                  if (!isFinite(sid2) || sid2 <= 0) continue;
                  let left2 = Number(m2[sid2] || 0);
                  left2 -= 1;
                  if (left2 <= 0) {
                    delete m2[sid2];
                    try { b2._aprbSKF_removeSid = sid2; b2._aprbSKF_removeFrame = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Number(Graphics.frameCount) : 0; } catch (eMark) {}
                    try { if (b2.isStateAffected && b2.isStateAffected(sid2)) b2.removeState(sid2); } catch (e3) {}
// 
                    // try { APRB_emitRemovedStateLog(b2, sid2); } catch (e4) {} // moved to removeState hook
                  } else {
                    m2[sid2] = left2;
                  }
                }
              }
            }
          }
        } catch (e) {}

} catch (e) {}
        try { APRB_flushQueuedCommonEventsFallback(bm, "SceneFallback"); } catch (e) {}
      }
    } catch (e) {}


    if (ENABLE_CONTROL) this._rt_updateRealtimeInput();
    if (ENABLE_CONTROL) this._aprb_updateFocusHint();
      if (ENABLE_CONTROL) this._aprb_updateCommandIcons();
    if (ENABLE_CONTROL) this._aprb_updateParryWindow();
    if (PARRY_FRAME_COUNTER_ENABLE) this._aprb_updateParryFrameCounter();
    try { APRB_bbwClampCoreWaits(this); } catch (e) {}
  };

  Scene_Battle.prototype._aprb_updateParryWindow = function() {
// Update all party members (safer with multi-actor and plugin stacks).
const members = ($gameParty && $gameParty.battleMembers) ? $gameParty.battleMembers() : [];
if (!members || !members.length) return;

const fc = (typeof Graphics !== 'undefined' && Graphics.frameCount != null) ? Number(Graphics.frameCount) : -1;

// Battle-time delta: tie parry window to battle time (affected by slow/hard stop),
// NOT to real frames. This prevents desync between "実戦闘時間" and the parry window.
const bm = (typeof BattleManager !== 'undefined') ? BattleManager : null;
let dt = 1.0;
try {
  if (bm && bm._aprbSlowActive && bm._aprbSlowRate != null) dt = Number(bm._aprbSlowRate);
} catch (e) {}
if (!isFinite(dt)) dt = 1.0;
if (dt < 0) dt = 0;
if (dt > 1) dt = 1;

// Do NOT advance while battle time is effectively stopped.
// NOTE: We intentionally do NOT pause during menu slow-mode.
if (bm && bm._aprbTimeStop) return;
if (dt <= 0) return;

// Accumulate fractional frames to keep behavior stable across slow rates.
if (bm) bm._aprbParryAcc = Number(bm._aprbParryAcc || 0) + dt;
const acc = bm ? Number(bm._aprbParryAcc || 0) : dt;
const steps = Math.floor(acc);
if (steps <= 0) return;
if (bm) bm._aprbParryAcc = acc - steps;

for (let step = 0; step < steps; step++) {
  for (let i = 0; i < members.length; i++) {
    const a = members[i];
    if (!a) continue;
    const f = Number(a._aprbParryFrames || 0);
    if (f > 0) {
      a._aprbParryFrames = f - 1;
      if (a._aprbParryFrames <= 0) a._aprbParryFrames = 0;
      if (DEBUG_LOG && (fc % 10 === 0)) {
        try {
          _aprbDbg('[APRB][Parry] window tick frame=' + fc + ' dt=' + dt.toFixed(3) + ' ' + (a.name ? a.name() : '') + ' ' + f + '->' + Number(a._aprbParryFrames||0));
        } catch (e0) {}
      }
    }
  }
}

  };

  

  // ------------------------------------------------------------
  // Parry remaining frames display (screen coordinates)
  // ------------------------------------------------------------
  Scene_Battle.prototype._aprb_createParryFrameCounter = function() {
    try {
      if (!PARRY_FRAME_COUNTER_ENABLE) return;
      if (this._aprbParryFrameSprite) return;
      if (typeof Sprite === "undefined" || typeof Bitmap === "undefined") return;

      const bmp = new Bitmap(240, 48);
      bmp.fontSize = PARRY_FRAME_COUNTER_FONT_SIZE;

      const spr = new Sprite(bmp);
      spr.x = PARRY_FRAME_COUNTER_X;
      spr.y = PARRY_FRAME_COUNTER_Y;
      spr.visible = false;
      spr._aprbLastFrames = -1;

      this.addChild(spr);
      this._aprbParryFrameSprite = spr;
    } catch (e) {}
  };

  Scene_Battle.prototype._aprb_updateParryFrameCounter = function() {
    try {
      if (!PARRY_FRAME_COUNTER_ENABLE) return;
      const spr = this._aprbParryFrameSprite;
      if (!spr || !spr.bitmap) return;

      spr.x = PARRY_FRAME_COUNTER_X;
      spr.y = PARRY_FRAME_COUNTER_Y;

      let frames = 0;
      const members = ($gameParty && $gameParty.battleMembers) ? $gameParty.battleMembers() : [];
      for (let i = 0; i < members.length; i++) {
        const a = members[i];
        const f = a ? Number(a._aprbParryFrames || 0) : 0;
        if (f > frames) frames = f;
      }

      if (frames > 0) {
        if (spr._aprbLastFrames !== frames) {
          spr._aprbLastFrames = frames;
          spr.bitmap.clear();
          spr.bitmap.fontSize = PARRY_FRAME_COUNTER_FONT_SIZE;
          spr.bitmap.drawText(String(frames), 0, 0, spr.bitmap.width, spr.bitmap.height, "left");
        }
        spr.visible = true;
      } else {
        spr.visible = false;
        spr._aprbLastFrames = -1;
      }
    } catch (e) {}
  };
Scene_Battle.prototype._rt_controlActor = function() {
    const members = $gameParty.battleMembers();
    return members[CONTROL_ACTOR_INDEX] || members[0];
  };

  Scene_Battle.prototype._rt_focusedEnemy = function() {
    var enemies = aliveEnemies();
    if (enemies.length === 0) return null;
    var idx = Math.max(0, Math.min(this._rt_focusEnemyIndex || 0, enemies.length - 1));
    var e = enemies[idx];
    if (FOCUS_HINT_AUTO_ADVANCE && e && e.isAlive && !e.isAlive()) {
      // Update focus to next alive immediately
      this._rt_refreshFocusSelection();
      enemies = aliveEnemies();
      if (enemies.length === 0) return null;
      idx = Math.max(0, Math.min(this._rt_focusEnemyIndex || 0, enemies.length - 1));
      e = enemies[idx];
    }
    return e;
  };

  
  Scene_Battle.prototype._rt_tryInitFocusSelection = function() {
    // enemyWindow が存在し、データが構築されたタイミングでのみ選択反映
    if (!this._enemyWindow) return;
    // MZの Window_Selectable は maxItems() を参照できる
    if (typeof this._enemyWindow.maxItems === "function" && this._enemyWindow.maxItems() <= 0) return;
    const enemies = aliveEnemies();
    if (enemies.length <= 0) return;

    this._rt_focusInitPending = false;
    this._rt_refreshFocusSelection();
  };

Scene_Battle.prototype._rt_refreshFocusSelection = function() {
    var enemiesAll = $gameTroop ? $gameTroop.members() : [];
    var enemies = aliveEnemies();

    if (!enemies || enemies.length === 0) {
      this._rt_focusEnemyIndex = 0;
      BattleManager._aprbFocusEnemyIndex = 0;
      this._rt_focusInitPending = true;
      return;
    }

    // Keep index within range of alive list
    var i0 = this._rt_focusEnemyIndex || 0;
    var i = i0;
    if (i >= enemies.length) i = (FOCUS_HINT_AUTO_ADVANCE ? 0 : (enemies.length - 1));

    // Auto-advance when the currently focused enemy died/vanished
    if (FOCUS_HINT_AUTO_ADVANCE) {
      var cur = enemies[i];
      if (!cur || (cur.isAlive && !cur.isAlive())) {
        // Find next alive (wrap)
        var found = -1;
        for (var step = 1; step <= enemies.length; step++) {
          var j = (i + step) % enemies.length;
          var e = enemies[j];
          if (e && (!e.isAlive || e.isAlive())) { found = j; break; }
        }
        if (found >= 0) i = found;
      }
    }

    this._rt_focusEnemyIndex = i;
    BattleManager._aprbFocusEnemyIndex = i;

    if (this._enemyWindow) {
      var enemy = enemies[i];
      if (enemy) {
        this._enemyWindow.select(i);
      }
    }
  };

  Scene_Battle.prototype._rt_changeFocus = function(delta) {
    const enemies = aliveEnemies();
    if (enemies.length <= 1) return;
    const len = enemies.length;
    let i = this._rt_focusEnemyIndex || 0;
    i = (i + delta + len) % len;
    this._rt_focusEnemyIndex = i;
    BattleManager._aprbFocusEnemyIndex = this._rt_focusEnemyIndex;
    this._rt_refreshFocusSelection();
  };

  Scene_Battle.prototype._rt_isInputEnabled = function() {
    if (!this.isActive()) return false;
    // After battle end (victory/defeat/abort), disable realtime inputs immediately.
    // This prevents players from accidentally opening windows / consuming AP while
    // battle-end common events (e.g. InvokeCommon_MIP) are running.
    if (BattleManager && BattleManager._aprbPostBattleInputLocked) return false;
    if (this._messageWindow && typeof this._messageWindow.isBusy === "function" && this._messageWindow.isBusy()) return false;
    // When any selection window is active, let the default window logic consume inputs.
    if (this._partyCommandWindow && this._partyCommandWindow.active) return false;
    if (this._actorCommandWindow && this._actorCommandWindow.active) return false;
    if (this._skillTypeWindow && this._skillTypeWindow.active) return false;
    if (this._skillWindow && this._skillWindow.active) return false;
    if (this._itemWindow && this._itemWindow.active) return false;
    if (BattleManager.isInputting()) return false;
    if (BattleManager.isBusy && BattleManager.isBusy()) return false;
    return true;
  };

  

  // ------------------------------------------------------------
  // APRB: X as Cancel in UI
  //  When skill/item/target selection windows are open, treat X key
  //  as Escape/Cancel. When no battle UI is open, X remains Guard.
  // ------------------------------------------------------------
  (function() {
    var _aprb_WS_processHandling = Window_Selectable.prototype.processHandling;
    Window_Selectable.prototype.processHandling = function() {
      try {
        var sc = SceneManager._scene;
        if (sc && sc instanceof Scene_Battle) {
          var uiActive = false;
          if (sc._skillWindow && sc._skillWindow.active) uiActive = true;
          else if (sc._itemWindow && sc._itemWindow.active) uiActive = true;
          else if (sc._enemyWindow && sc._enemyWindow.active) uiActive = true;
          else if (sc._actorWindow && sc._actorWindow.active) uiActive = true;
          else if (sc._skillTypeWindow && sc._skillTypeWindow.active) uiActive = true;

          if (uiActive && Input.isTriggered('x') && this.isOpenAndActive && this.isOpenAndActive() && this.isCancelEnabled && this.isCancelEnabled()) {
            this.processCancel();
            return;
          }
        }
      } catch (e) {
        // ignore
      }
      _aprb_WS_processHandling.call(this);
    };
  })();

Scene_Battle.prototype._rt_updateRealtimeInput = function() {
    // Z hold-detection state is battle-only.
    // While detecting, we hard-stop TPB time for the whole battle.

    if (!this._rt_isInputEnabled()) {
      if (this._rt_zHoldActive) {
        this._rt_abortZHold();
      }
      return;
    }

    const actor = this._rt_controlActor();
    if (!actor) {
      if (this._rt_zHoldActive) {
        this._rt_abortZHold();
      }
      return;
    }

    // While the actor is "locked" by an action animation, we still allow tapping X to
    // open a new parry window (for consecutive parries). This does NOT force a guard action,
    // it only opens the parry timing window and consumes AP like normal Guard.
    if (!actor.canMove()) {
      if (Input.isTriggered("x")) {
        try { this._rt_tryParryTap(actor); } catch (e) {}
      }
      if (this._rt_zHoldActive) {
        this._rt_abortZHold();
      }
      return;
    }

    // If Z-hold derive failed and the player is still holding Z,
    // ignore all inputs until Z is released (must press again to try).
    if (this._rt_zHoldIgnoreUntilRelease) {
      if (!Input.isPressed('ok')) {
        this._rt_zHoldIgnoreUntilRelease = false;
      }
      return;
    }

    // Hold detection has priority.
    if (this._rt_zHoldActive) {
      this._rt_updateZHold(actor);
      return;
    }

    if (Input.isTriggered("left")) this._rt_changeFocus(-1);
    else if (Input.isTriggered("right")) this._rt_changeFocus(1);

    // Z(OK)
    // - If long-press derive is enabled (skillId>0):
    //    release before threshold => normal attack
    //    hold >= threshold        => derive skill
    //   (battle time is stopped while detecting)
    // - If disabled (skillId<=0): immediate attack as before.
    if (Input.isTriggered("ok")) {
      if (Z_LONGPRESS_SKILL_ID > 0) {
        this._rt_startZHold(actor);
        return;
      } else {
        this._rt_doAttack(actor);
        return;
      }
    }

    if (Input.isTriggered("x")) this._rt_doGuard(actor);

    // Skill / Item menus (turn-independent)
    if (Input.isTriggered("up") || Input.isTriggered("pageup")) {
      this._rt_openSkill(actor);
    }
    if (Input.isTriggered("down")) this._rt_openItem(actor);

    if (ENABLE_ESCAPE_KEY && (Input.isTriggered("escape") || Input.isTriggered("menu"))) {
      this._rt_doEscape();
    }
  };

  // ------------------------------------------------------------
  // Z Hold -> Derive Skill
  //  - While holding Z(OK), battle time is stopped (TPB accel = 0)
  //  - Release before threshold: normal attack
  //  - Hold >= threshold frames: use the specified skill (standard target UI)
  // ------------------------------------------------------------

  Scene_Battle.prototype._rt_startZHold = function(actor) {
    this._rt_zHoldActive = true;
    this._rt_zHoldFrames = 0;
    this._rt_zHoldActor = actor;
    this._rt_zHoldDerivedOk = false;
    this._rt_zHoldDeriveFailed = false;
    // If a previous attempt failed while holding, require a full release before next attempt.
    this._rt_zHoldIgnoreUntilRelease = false;
    try { if (ATTACK_HARDSTOP_ENABLE && typeof BattleManager !== 'undefined' && BattleManager) BattleManager._aprbTimeStop = true; } catch (e) {}
  };

  Scene_Battle.prototype._rt_abortZHold = function() {
    this._rt_zHoldActive = false;
    this._rt_zHoldFrames = 0;
    this._rt_zHoldActor = null;
    this._rt_zHoldDerivedOk = false;
    this._rt_zHoldDeriveFailed = false;
    try { if (typeof BattleManager !== 'undefined' && BattleManager) BattleManager._aprbTimeStop = false; } catch (e) {}
  };

  Scene_Battle.prototype._rt_updateZHold = function(actor) {
    // When released: if derive was not successfully executed, do normal attack.
    if (!Input.isPressed('ok')) {
      const derivedOk = !!this._rt_zHoldDerivedOk;
      this._rt_abortZHold();
      if (!derivedOk) this._rt_doAttack(actor);
      return;
    }

    this._rt_zHoldFrames = (this._rt_zHoldFrames || 0) + 1;

    // If already attempted derive and failed, just wait for release (which becomes attack).
    if (this._rt_zHoldDeriveFailed) return;

    if (!this._rt_zHoldDerivedOk && this._rt_zHoldFrames >= Z_LONGPRESS_FRAMES) {
      const ok = this._rt_doDerivedSkillByZHold(actor);
      if (ok) {
        this._rt_zHoldDerivedOk = true;
        this._rt_abortZHold();
      } else {
        // Derive condition met but cannot execute (e.g. AP不足):
        //  - Resume time immediately
        //  - Treat as "not holding" state
        //  - Ignore all inputs until Z is released (player must press again)
        this._rt_abortZHold();
        this._rt_zHoldIgnoreUntilRelease = true;
      }
      return;
    }
  };

  Scene_Battle.prototype._rt_doDerivedSkillByZHold = function(actor) {
    const skillId = Number(Z_LONGPRESS_SKILL_ID || 0);
    if (!actor || !skillId || !($dataSkills && $dataSkills[skillId])) {
      SoundManager.playBuzzer();
      return false;
    }

    // AP rule for Z long-press derived skill (configurable).
    if (Z_LONGPRESS_AP_COST > 0 && actor.ap && actor.ap() < Z_LONGPRESS_AP_COST) {
      // No buzzer on AP不足（要求仕様）
      return false;
    }

    // Prepare an inputting action and open standard target selection / execute.
    this._rt_menuMode = 'skill';
    this._rt_setBattleManagerActor(actor);

    var action = this._rt_prepareInputtingAction(actor);
    if (!action) {
      SoundManager.playBuzzer();
      return false;
    }
    if (action.setSkill) action.setSkill(skillId);

    // Defer AP consumption until target is confirmed (same rule as skill list).
    this._rt_pendingApCost = Z_LONGPRESS_AP_COST;
    this._rt_pendingApType = 'skill';
    this._rt_pendingApActor = actor;

    // Ensure slow mode stays active during target selection.
    if (typeof BattleManager !== 'undefined' && BattleManager) BattleManager._aprbSlowSticky = true;

    // Suppress cursor/ok sounds that would normally play during target selection.
    // (Requested: no cursor movement / decision sound when using Z long-press derived skill)
    if (typeof BattleManager !== 'undefined' && BattleManager) BattleManager._aprbMuteCursorOkSe = true;

    // Move to standard target selection (or immediate execution for non-select skills).
    this._rt_returnMenuMode = null;
    this._rt_openTargetSelectionForAction(actor, action);

    // If the skill does not require target selection (immediate execution),
    // clear suppression right away.
    const enemyActive = this._enemyWindow && this._enemyWindow.isOpenAndActive && this._enemyWindow.isOpenAndActive();
    const actorActive = this._actorWindow && this._actorWindow.isOpenAndActive && this._actorWindow.isOpenAndActive();
    if (!enemyActive && !actorActive) {
      try { if (typeof BattleManager !== 'undefined' && BattleManager) BattleManager._aprbMuteCursorOkSe = false; } catch (e) {}
    }
    return true;
  };



  // ------------------------------------------------------------
  // Skill / Item menus (turn-independent)
  //  - up   : skill selection (AP 2 + MP)
  //  - down : item selection (AP 1)
  // ------------------------------------------------------------

  // Costs (fixed; matches your basic spec)
  const SKILL_AP_COST = 2;
  const ITEM_AP_COST = 1;

  Scene_Battle.prototype._rt_setBattleManagerActor = function(actor) {
    if (!actor) return;
    const members = $gameParty ? $gameParty.battleMembers() : [];
    const idx = members.indexOf(actor);
    if (idx >= 0) BattleManager._actorIndex = idx;
    if (this._statusWindow && this._statusWindow.select) this._statusWindow.select(idx);
  };

  // Ensure the skill-related windows exist (some UI replacement plugins may not create them).
  Scene_Battle.prototype._rt_ensureSkillWindows = function() {
    // MZ default provides these creators.
    // Call in the same order as Scene_Battle.createAllWindows (skillType -> skill).
    if (!this._skillTypeWindow && this.createSkillTypeWindow) {
      try { this.createSkillTypeWindow(); } catch (e) {}
    }
    if (!this._skillWindow && this.createSkillWindow) {
      try { this.createSkillWindow(); } catch (e2) {}
    }

    // If creators exist but didn't add the windows for some reason, add them defensively.
    // NOTE: In MZ, addWindow attaches to the windowLayer, so the parent is NOT the Scene.
    //       We only need to add when the parent is missing.
    if (this._skillTypeWindow && !this._skillTypeWindow.parent) {
      try { this.addWindow(this._skillTypeWindow); } catch (e3) {}
    }
    if (this._skillWindow && !this._skillWindow.parent) {
      try { this.addWindow(this._skillWindow); } catch (e4) {}
    }
  };

  Scene_Battle.prototype._rt_openSkill = function(actor) {
    if (!actor) return;
    // Skill windows may exist even when the default actor command flow is disabled.
    // Some plugins can override Scene_Battle.commandSkill or make it unusable in TPB.
    // So we try the original commandSkill first, then fall back to opening the skill windows directly.

    if (SKILL_AP_COST > 0 && actor.ap && actor.ap() < SKILL_AP_COST) {
      // No buzzer on AP不足（要求仕様）
      return;
    }

    this._rt_menuMode = "skill";
    this._rt_setBattleManagerActor(actor);

    // Make sure the windows exist before trying to open them.
    this._rt_ensureSkillWindows();

    // NOTE: We intentionally DO NOT call Scene_Battle.commandSkill().
    // Many battle/UI replacement setups (and our realtime flow that skips actor commands)
    // can make BattleManager.actor() null at this point. The default commandSkill()
    // will then do: this._skillWindow.setActor(null) and crash inside selectLast().
    // Instead, we always open the skill windows directly using the provided actor.
    var openedByCommand = false;

    // Open directly: set actor first.
    if (!openedByCommand) {
      if (this._skillTypeWindow && this._skillTypeWindow.setActor) {
        this._skillTypeWindow.setActor(actor);
      }
      if (this._skillWindow && this._skillWindow.setActor) {
        this._skillWindow.setActor(actor);
      }
      if (this._skillTypeWindow && this._skillTypeWindow.select) {
        this._skillTypeWindow.select(0);
      }
      if (this._skillTypeWindow && this._skillTypeWindow.refresh) {
        this._skillTypeWindow.refresh();
      }
    }


    // Prefer skill type window if available; otherwise open skill list directly using the first skill type.
    if (this._skillTypeWindow) {
      if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = true;
      if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "skill"; BattleManager._aprbMenuStage = "list"; }
      if (!this._skillTypeWindow.parent) {
        try { this.addWindow(this._skillTypeWindow); } catch (e5) {}
      }
      this._skillTypeWindow.show();
      this._skillTypeWindow.open && this._skillTypeWindow.open();
      this._skillTypeWindow.activate();
    } else if (this._skillWindow && this._skillWindow.setStypeId) {
      if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = true;
      if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "skill"; BattleManager._aprbMenuStage = "list"; }

      var stypes = actor.addedSkillTypes ? actor.addedSkillTypes() : [];
      var stypeId = stypes && stypes.length ? stypes[0] : 1;
      this._skillWindow.setActor(actor);
      this._skillWindow.setStypeId(stypeId);
      if (this._skillWindow.refresh) this._skillWindow.refresh();
      if (!this._skillWindow.parent) {
        try { this.addWindow(this._skillWindow); } catch (e6) {}
      }
      this._skillWindow.show();
      this._skillWindow.open && this._skillWindow.open();
      this._skillWindow.activate();
    } else {
      // No skill windows exist; nothing to open.
      SoundManager.playBuzzer();
      this._rt_menuMode = null;
      if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = false;
      if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = null; BattleManager._aprbMenuStage = null; }
      return;
    }

    // In case something hid the windows in the same frame, enforce in changeInputWindow hook.
    if (SoundManager.playCursor) SoundManager.playCursor();
  };

  Scene_Battle.prototype._rt_openItem = function(actor) {
    if (!actor) return;
    // NOTE: We intentionally avoid Scene_Battle.commandItem(). It relies on
    // BattleManager.actor() being non-null and can break in our realtime flow.
    // We open the item window directly instead.
    if (ITEM_AP_COST > 0 && actor.ap && actor.ap() < ITEM_AP_COST) {
      // No buzzer on AP不足（要求仕様）
      return;
    }


    // Ensure the window exists.
    if (!this._itemWindow && this.createItemWindow) {
      try { this.createItemWindow(); } catch (e0) {}
    }
    if (!this._itemWindow) {
      SoundManager.playBuzzer();
      if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = false;
      if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = null; BattleManager._aprbMenuStage = null; }
      return;
    }

    if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = true;
    if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "item"; BattleManager._aprbMenuStage = "list"; }

    // Mark that we are forcing our own menu open (so changeInputWindow won't hide it).
    this._rt_menuMode = "item";
    this._rt_setBattleManagerActor(actor);

    if (this._itemWindow.setActor) this._itemWindow.setActor(actor);
    if (this._itemWindow.refresh) this._itemWindow.refresh();
    if (!this._itemWindow.parent && this.addWindow) {
      try { this.addWindow(this._itemWindow); } catch (e1) {}
    }
    this._itemWindow.show();
    this._itemWindow.open && this._itemWindow.open();
    this._itemWindow.activate();
    if (this._itemWindow.selectLast) {
      try { this._itemWindow.selectLast(); } catch (e2) {}
    }
    if (SoundManager.playCursor) SoundManager.playCursor();
  };

  // Clear forced menu flag when leaving skill/item windows.
  const _Scene_Battle_onSkillCancel = Scene_Battle.prototype.onSkillCancel;
  if (_Scene_Battle_onSkillCancel) {
    Scene_Battle.prototype.onSkillCancel = function() {
      this._rt_menuMode = null;
      if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = false;
      if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = null; BattleManager._aprbMenuStage = null; }
      _Scene_Battle_onSkillCancel.call(this);
    };
  }

  const _Scene_Battle_onItemCancel = Scene_Battle.prototype.onItemCancel;
  if (_Scene_Battle_onItemCancel) {
    Scene_Battle.prototype.onItemCancel = function() {
      this._rt_menuMode = null;
      if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = false;
      if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = null; BattleManager._aprbMenuStage = null; }
      _Scene_Battle_onItemCancel.call(this);
    };
  }

  // Ensure target selection windows exist.
  // In our realtime setup we suppress party/actor commands, and depending on
  // plugin/environment the default createActorWindow/createEnemyWindow may not
  // have been called yet. If these are missing, Scene_Battle.onSkillOk/onItemOk
  // will crash when trying to call setSkill/setItem on a null window.
  Scene_Battle.prototype._rt_ensureTargetWindows = function() {
    // Actor/Enemy target windows are normally created in createAllWindows().
    // In our realtime setup we may bypass standard command flows, so the
    // default windows might never be instantiated.

    // --- Actor target window (ally targets) ---
    if (!this._actorWindow) {
      if (this.createActorWindow) {
        try { this.createActorWindow(); } catch (e) { /* ignore */ }
      }
      // Fallback: create manually
      if (!this._actorWindow && typeof Window_BattleActor === "function") {
        var rect = this.actorWindowRect ? this.actorWindowRect() : null;
        if (!rect && typeof Rectangle === "function") rect = new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._actorWindow = new Window_BattleActor(rect);
        if (this._actorWindow.setHandler) {
          this._actorWindow.setHandler("ok", this.onActorOk.bind(this));
          this._actorWindow.setHandler("cancel", this.onActorCancel.bind(this));
        }
      }
      if (this._actorWindow && this.addWindow && !this._actorWindow.parent) {
        this.addWindow(this._actorWindow);
      }
    }

    // --- Enemy target window (opponent targets) ---
    if (!this._enemyWindow) {
      if (this.createEnemyWindow) {
        try { this.createEnemyWindow(); } catch (e2) { /* ignore */ }
      }
      // Fallback: create manually
      if (!this._enemyWindow && typeof Window_BattleEnemy === "function") {
        var rect2 = this.enemyWindowRect ? this.enemyWindowRect() : null;
        if (!rect2 && typeof Rectangle === "function") rect2 = new Rectangle(0, 0, Graphics.boxWidth, Graphics.boxHeight);
        this._enemyWindow = new Window_BattleEnemy(rect2);
        if (this._enemyWindow.setHandler) {
          this._enemyWindow.setHandler("ok", this.onEnemyOk.bind(this));
          this._enemyWindow.setHandler("cancel", this.onEnemyCancel.bind(this));
        }
      }
      if (this._enemyWindow && this.addWindow && !this._enemyWindow.parent) {
        this.addWindow(this._enemyWindow);
      }
    }
  };

  // Ensure BattleManager.inputtingAction() exists.
  // In standard battle flow, onSkillOk/onItemOk assumes an "inputting" action
  // has already been prepared via actor command selection. Our realtime flow
  // can bypass that, which makes BattleManager.inputtingAction() return null
  // and causes "Cannot read property 'setSkill/setItem' of null".
  Scene_Battle.prototype._rt_ensureInputAction = function(actor) {
    // Prefer caller-provided actor; BattleManager.actor() may be null in realtime flow.
    actor = actor || (BattleManager.actor && BattleManager.actor()) || null;
    if (!actor) return null;

    // First, try actor-local API, then BattleManager API.
    var action = (actor.inputtingAction && actor.inputtingAction()) || (BattleManager.inputtingAction && BattleManager.inputtingAction());
    if (action) return action;

    // Try to create actions using the engine's standard flow.
    if (actor.makeActions) {
      try { actor.makeActions(); } catch (e) { /* ignore */ }
    }
    if (actor.setActionState) actor.setActionState("inputting");
    if (actor._actionInputIndex == null) actor._actionInputIndex = 0;
    if (!actor._actions) actor._actions = [];

    // Hard fallback: ensure at least one Game_Action instance exists.
    if (!actor._actions[actor._actionInputIndex] && typeof Game_Action === "function") {
      actor._actions[actor._actionInputIndex] = new Game_Action(actor);
    }

    // Re-check via API if possible.
    action = (actor.inputtingAction && actor.inputtingAction()) || actor._actions[actor._actionInputIndex] || null;
    return action;
  };

  // Consume AP on Skill/Item confirm.
  // NOTE: We DO NOT call the default Scene_Battle.onSkillOk/onItemOk here,
  // because default logic assumes BattleManager.inputtingAction() already exists
  // (created via actor-command flow). In this plugin, that flow is skipped, so we
  // build the inputting action ourselves and then jump into the standard
  // target-selection flow via onSelectAction().

  Scene_Battle.prototype._rt_prepareInputtingAction = function(actor) {
    if (!actor) return null;
    // Sync BattleManager actor index so BattleManager.actor() becomes valid.
    var members = $gameParty && $gameParty.battleMembers ? $gameParty.battleMembers() : [];
    var idx = members.indexOf(actor);
    if (idx >= 0) BattleManager._actorIndex = idx;

    // Ensure actor has an inputting action slot.
    actor._actionInputIndex = 0;
    if (!actor._actions) actor._actions = [];
    if (!actor._actions[0] && typeof Game_Action === "function") {
      actor._actions[0] = new Game_Action(actor);
    }
    if (actor.setActionState) actor.setActionState("inputting");
    return (actor.inputtingAction && actor.inputtingAction()) || actor._actions[0] || null;
  };

  // Decide and open standard target selection for the prepared action.
  // We avoid Scene_Battle.onSelectAction() because it depends on the default
  // command/phase flow, which we bypass in realtime.
  Scene_Battle.prototype._rt_openTargetSelectionForAction = function(actor, action) {
    if (!action) return;
    if (this._rt_ensureTargetWindows) this._rt_ensureTargetWindows();

    // If no selection needed (self/all/random), execute immediately.
    if (!action.needsSelection || !action.needsSelection()) {
      this._rt_executePreparedAction(actor);
      this._rt_menuMode = null;
      this._rt_returnMenuMode = null;

      // NOTE:
      // Self-only / all-target items (and similar actions) do not open the target
      // selection windows. In this flow we must also clear our menu-flow flags;
      // otherwise the slow-down controller keeps thinking a menu is open and the
      // TPB speed never returns to normal.
      if (typeof BattleManager !== "undefined" && BattleManager) {
        BattleManager._aprbMenuOpen = null;
        BattleManager._aprbMenuStage = null;
        BattleManager._aprbSlowSticky = false;
      }
      return;
    }

    // Opponent target selection
    if (action.isForOpponent && action.isForOpponent()) {
      this._rt_menuMode = "enemyTarget";
      if (this._enemyWindow) {
        if (this._enemyWindow.refresh) this._enemyWindow.refresh();
        if (this._enemyWindow.show) this._enemyWindow.show();
        if (this._enemyWindow.activate) this._enemyWindow.activate();
        var alive = ($gameTroop && $gameTroop.aliveMembers) ? $gameTroop.aliveMembers() : [];
        var sel = 0;

        // Single-target skills: align initial cursor to the current attack focus target, if still alive.
        if (action && action.isForOne && action.isForOne()) {
          var focused = (this._rt_focusedEnemy && this._rt_focusedEnemy()) || null;
          var idx = focused ? alive.indexOf(focused) : -1;
          if (idx >= 0) {
            sel = idx;
          } else {
            // Focused target is not alive anymore: fall back to the first alive target.
            sel = 0;
            this._rt_focusEnemyIndex = 0;
          }
        }

        // Clamp selection to a valid alive index to avoid undefined target errors (e.g., RestrictionTargetSkill).
        var maxItems = (this._enemyWindow.maxItems && this._enemyWindow.maxItems()) || alive.length;
        if (maxItems <= 0) {
          if (this._enemyWindow.select) this._enemyWindow.select(-1);
          if (this._enemyWindow.deactivate) this._enemyWindow.deactivate();
        } else {
          if (sel < 0) sel = 0;
          if (sel >= maxItems) sel = maxItems - 1;
          if (this._enemyWindow.select) this._enemyWindow.select(sel);
        }
      }
      return;
    }

    // Friend target selection
    if (action.isForFriend && action.isForFriend()) {
      this._rt_menuMode = "actorTarget";
      if (this._actorWindow) {
        if (this._actorWindow.setActor) this._actorWindow.setActor(actor);
        if (this._actorWindow.refresh) this._actorWindow.refresh();
        if (this._actorWindow.show) this._actorWindow.show();
        if (this._actorWindow.activate) this._actorWindow.activate();
        if (this._actorWindow.select) this._actorWindow.select(0);
      }
      return;
    }

    // Fallback
    this._rt_executePreparedAction(actor);
  };


  Scene_Battle.prototype.onSkillOk = function() {
    var skill = this._skillWindow ? this._skillWindow.item() : null;
    var actor = (this._skillWindow && this._skillWindow._actor) ||
                (BattleManager.actor && BattleManager.actor()) ||
                (this._rt_controlActor && this._rt_controlActor()) || null;

    if (ENABLE_CONTROL && isControlledActor(actor)) {
      if (SKILL_AP_COST > 0 && actor.ap && actor.ap() < SKILL_AP_COST) {
        SoundManager.playBuzzer();
        if (this._skillWindow) this._skillWindow.activate();
        return;
      }
      if (SKILL_AP_COST > 0) {
        this._rt_pendingApCost = SKILL_AP_COST;
        this._rt_pendingApType = "skill";
        this._rt_pendingApActor = actor;
      }
    }

    if (!skill || !actor) {
      SoundManager.playBuzzer();
      if (this._skillWindow) this._skillWindow.activate();
      return;
    }

    if (this._rt_ensureTargetWindows) this._rt_ensureTargetWindows();

    var action = this._rt_prepareInputtingAction(actor);
    if (!action || !action.setSkill) {
      SoundManager.playBuzzer();
      if (this._skillWindow) this._skillWindow.activate();
      return;
    }

    action.setSkill(skill.id);
    if (actor.setLastBattleSkill) actor.setLastBattleSkill(skill);

    // Close list and go to standard target selection.
    if (this._skillWindow) {
      this._skillWindow.hide();
      this._skillWindow.deactivate();
    }
    // Return to the same list (skill) when canceling target selection.
    // NOTE: Older builds mistakenly inverted this (skill <-> item).
    this._rt_returnMenuMode = "skill";
    if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "skill"; BattleManager._aprbMenuStage = "target"; }

    if (this._rt_openTargetSelectionForAction) this._rt_openTargetSelectionForAction(actor, action);
  };

  Scene_Battle.prototype.onItemOk = function() {
    var item = this._itemWindow ? this._itemWindow.item() : null;
    var actor = (this._itemWindow && this._itemWindow._actor) ||
                (BattleManager.actor && BattleManager.actor()) ||
                (this._rt_controlActor && this._rt_controlActor()) || null;

    if (ENABLE_CONTROL && isControlledActor(actor)) {
      if (ITEM_AP_COST > 0 && actor.ap && actor.ap() < ITEM_AP_COST) {
        SoundManager.playBuzzer();
        if (this._itemWindow) this._itemWindow.activate();
        return;
      }
      if (ITEM_AP_COST > 0) {
        this._rt_pendingApCost = ITEM_AP_COST;
        this._rt_pendingApType = "item";
        this._rt_pendingApActor = actor;
      }
    }

    if (!item || !actor) {
      SoundManager.playBuzzer();
      if (this._itemWindow) this._itemWindow.activate();
      return;
    }

    if (this._rt_ensureTargetWindows) this._rt_ensureTargetWindows();

    var action = this._rt_prepareInputtingAction(actor);
    if (!action || !(action.setItem || action.setItemObject)) {
      SoundManager.playBuzzer();
      if (this._itemWindow) this._itemWindow.activate();
      return;
    }

    if (action.setItemObject) action.setItemObject(item);
    else action.setItem(item.id);

    if ($gameParty && $gameParty.setLastItem) $gameParty.setLastItem(item);

    if (this._itemWindow) {
      this._itemWindow.hide();
      this._itemWindow.deactivate();
    }
    // Return to the same list (item) when canceling target selection.
    // NOTE: This was mistakenly inverted in older builds (skill <-> item).
    this._rt_returnMenuMode = "item";
    if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "item"; BattleManager._aprbMenuStage = "target"; }

    if (this._rt_openTargetSelectionForAction) this._rt_openTargetSelectionForAction(actor, action);
  };


  // ------------------------------------------------------------
  // Target OK: execute prepared skill/item immediately
  // (Standard target selection UI, realtime execution)
  // ------------------------------------------------------------

  Scene_Battle.prototype._rt_executePreparedAction = function(actor) {
    actor = actor || (BattleManager.actor && BattleManager.actor()) || (this._rt_controlActor && this._rt_controlActor()) || null;
    if (!actor) return;

    var action = (BattleManager.inputtingAction && BattleManager.inputtingAction()) ||
                 (actor.inputtingAction && actor.inputtingAction()) ||
                 (actor._actions && actor._actions[0]) || null;
    if (!action) return;

    // Ensure action is stored
    actor._actions = actor._actions || [];
    actor._actions[0] = action;
    actor._actionInputIndex = 0;

    // Run immediately as a forced action
    if (BattleManager.forceAction) {
      BattleManager.forceAction(actor);
      if (BattleManager.processForcedAction) {
        try { BattleManager.processForcedAction(); } catch (e) { /* ignore */ }
      }
    }
  };
      if (BattleManager._aprbClearInputtingAction) BattleManager._aprbClearInputtingAction();

  Scene_Battle.prototype._rt_consumePendingApIfNeeded = function(actor, action) {
    actor = actor || (BattleManager.actor && BattleManager.actor()) || null;
    if (!actor) return;
    if (!this._rt_pendingApCost || this._rt_pendingApCost <= 0) return;
    // Ensure this pending cost belongs to this actor
    if (this._rt_pendingApActor && this._rt_pendingApActor !== actor) return;

    // Only the controlled actor has AP
    if (!(ENABLE_CONTROL && isControlledActor(actor))) {
      this._rt_pendingApCost = 0;
      this._rt_pendingApType = null;
      this._rt_pendingApActor = null;
      return;
    }

    var type = this._rt_pendingApType;
    var cost = this._rt_pendingApCost;
    var ok = false;
    if (type === "skill") {
      ok = !action || !action.isSkill || action.isSkill();
    } else if (type === "item") {
      ok = !action || !action.isItem || action.isItem();
    }

    if (ok && cost > 0 && actor.consumeAp) {
      // Re-check (in case AP changed while selecting)
      if (actor.ap && actor.ap() < cost) {
        // Not enough anymore: cancel execution gracefully
        SoundManager.playBuzzer();
      } else {
        actor.consumeAp(cost);
      }
    }

    this._rt_pendingApCost = 0;
    this._rt_pendingApType = null;
    this._rt_pendingApActor = null;
  };

  Scene_Battle.prototype._rt_consumePendingApIfNeeded = function(actor, action) {
    actor = actor || (BattleManager.actor && BattleManager.actor()) || null;
    if (!actor) return;
    if (!this._rt_pendingApCost || this._rt_pendingApCost <= 0) return;
    if (this._rt_pendingApActor && this._rt_pendingApActor !== actor) return;

    var cost = this._rt_pendingApCost;
    var type = this._rt_pendingApType || "";

    // Consume only when the action type matches
    if (type === "skill") {
      if (!(action && action.isSkill && action.isSkill())) return;
    } else if (type === "item") {
      if (!(action && action.isItem && action.isItem())) return;
    } else {
      return;
    }

    if (ENABLE_CONTROL && isControlledActor(actor)) {
      if (cost > 0 && actor.consumeAp) actor.consumeAp(cost);
    }

    // Clear pending info
    this._rt_pendingApCost = 0;
    this._rt_pendingApType = null;
    this._rt_pendingApActor = null;
  };

  // Consume AP only when target is confirmed (skill/item).
  Scene_Battle.prototype._rt_consumePendingApIfNeeded = function(actor, action) {
    actor = actor || (BattleManager.actor && BattleManager.actor()) || null;
    if (!actor) return;
    if (!this._rt_pendingApCost || this._rt_pendingApCost <= 0) return;
    if (this._rt_pendingApActor && this._rt_pendingApActor !== actor) return;

    var cost = this._rt_pendingApCost;
    var type = this._rt_pendingApType;
    // Safety: check action type
    if (type === "skill" && action && action.isSkill && !action.isSkill()) return;
    if (type === "item" && action && action.isItem && !action.isItem()) return;

    if (ENABLE_CONTROL && isControlledActor(actor)) {
      if (cost > 0 && actor.consumeAp) actor.consumeAp(cost);
    }

    this._rt_pendingApCost = 0;
    this._rt_pendingApType = null;
    this._rt_pendingApActor = null;
  };

  // Override target OK handlers to run action immediately
  Scene_Battle.prototype.onEnemyOk = function() {
    try { if (typeof BattleManager !== "undefined" && BattleManager) BattleManager._aprbMuteCursorOkSe = false; } catch (e) {}
    if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = false;
    if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = null; BattleManager._aprbMenuStage = null; }
    var enemy = this._enemyWindow && this._enemyWindow.enemy ? this._enemyWindow.enemy() : null;
    var actor = (BattleManager.actor && BattleManager.actor()) ||
                (this._skillWindow && this._skillWindow._actor) ||
                (this._itemWindow && this._itemWindow._actor) ||
                (this._rt_controlActor && this._rt_controlActor()) || null;

    var action = this._rt_prepareInputtingAction ? this._rt_prepareInputtingAction(actor) : null;
    if (!action) action = (BattleManager.inputtingAction && BattleManager.inputtingAction()) || (actor && actor._actions ? actor._actions[0] : null);

    if (action && enemy && action.setTarget) action.setTarget(enemy.index());

    if (this._enemyWindow) { this._enemyWindow.hide(); this._enemyWindow.deactivate(); }
    if (this._rt_menuMode === "enemyTarget") this._rt_menuMode = null;
    if (this._actorWindow) { this._actorWindow.hide(); this._actorWindow.deactivate(); }
    if (this._rt_menuMode === "actorTarget") this._rt_menuMode = null;

    this._rt_menuMode = null;
    this._rt_returnMenuMode = null;


    // Defer AP consumption until target is confirmed (skill/item)
    if (this._rt_pendingApCost && this._rt_pendingApCost > 0 && (!this._rt_pendingApActor || this._rt_pendingApActor === actor)) {
      var _aprbType = this._rt_pendingApType;
      var _aprbOk = (_aprbType === "skill" && action && action.isSkill && action.isSkill()) ||
                    (_aprbType === "item" && action && action.isItem && action.isItem());
      if (_aprbOk && ENABLE_CONTROL && isControlledActor(actor) && actor.consumeAp) actor.consumeAp(this._rt_pendingApCost);
      this._rt_pendingApCost = 0; this._rt_pendingApType = null; this._rt_pendingApActor = null;
    }

    this._rt_executePreparedAction(actor);

    // Hide the focus cursor after executing skill/item (same behavior as normal attack)
    // Keep _rt_focusEnemyIndex as-is; cursor will re-appear when player changes focus again.
    if (this._enemyWindow && this._enemyWindow.deselect) this._enemyWindow.deselect();
  };

  Scene_Battle.prototype.onActorOk = function() {
    try { if (typeof BattleManager !== "undefined" && BattleManager) BattleManager._aprbMuteCursorOkSe = false; } catch (e) {}
    if (typeof BattleManager !== "undefined") BattleManager._aprbSlowSticky = false;
    if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = null; BattleManager._aprbMenuStage = null; }
    var target = this._actorWindow && this._actorWindow.actor ? this._actorWindow.actor() : null;
    var actor = (BattleManager.actor && BattleManager.actor()) ||
                (this._skillWindow && this._skillWindow._actor) ||
                (this._itemWindow && this._itemWindow._actor) ||
                (this._rt_controlActor && this._rt_controlActor()) || null;

    var action = this._rt_prepareInputtingAction ? this._rt_prepareInputtingAction(actor) : null;
    if (!action) action = (BattleManager.inputtingAction && BattleManager.inputtingAction()) || (actor && actor._actions ? actor._actions[0] : null);

    if (action && target && action.setTarget) action.setTarget(target.index());

    if (this._actorWindow) { this._actorWindow.hide(); this._actorWindow.deactivate(); }
    if (this._rt_menuMode === "actorTarget") this._rt_menuMode = null;
    if (this._enemyWindow) { this._enemyWindow.hide(); this._enemyWindow.deactivate(); }
    if (this._rt_menuMode === "enemyTarget") this._rt_menuMode = null;

    this._rt_menuMode = null;
    this._rt_returnMenuMode = null;


    // Defer AP consumption until target is confirmed (skill/item)
    if (this._rt_pendingApCost && this._rt_pendingApCost > 0 && (!this._rt_pendingApActor || this._rt_pendingApActor === actor)) {
      var _aprbType = this._rt_pendingApType;
      var _aprbOk = (_aprbType === "skill" && action && action.isSkill && action.isSkill()) ||
                    (_aprbType === "item" && action && action.isItem && action.isItem());
      if (_aprbOk && ENABLE_CONTROL && isControlledActor(actor) && actor.consumeAp) actor.consumeAp(this._rt_pendingApCost);
      this._rt_pendingApCost = 0; this._rt_pendingApType = null; this._rt_pendingApActor = null;
    }

    this._rt_executePreparedAction(actor);

    // Hide the focus cursor after executing skill/item (same behavior as normal attack)
    if (this._enemyWindow && this._enemyWindow.deselect) this._enemyWindow.deselect();
  };

  // On cancel, return to list
  Scene_Battle.prototype.onEnemyCancel = function() {

    try { if (typeof BattleManager !== "undefined" && BattleManager) BattleManager._aprbMuteCursorOkSe = false; } catch (e) {}

    this._rt_pendingApCost = 0; this._rt_pendingApType = null; this._rt_pendingApActor = null;
    this._rt_pendingApCost = 0; this._rt_pendingApType = null; this._rt_pendingApActor = null;
    if (this._enemyWindow) { this._enemyWindow.hide(); this._enemyWindow.deactivate(); }
    // Ensure a valid current actor exists before returning to list windows.
    // Some setups (hidden party/actor command) can leave BattleManager.actor() null,
    // and Window_BattleSkill.show() calls selectLast() which would crash.
    var _rtActor = (BattleManager.actor && BattleManager.actor()) || (this._rt_controlActor && this._rt_controlActor()) || null;
    if (!_rtActor && $gameParty && $gameParty.battleMembers) _rtActor = $gameParty.battleMembers()[0] || null;
    if (_rtActor && BattleManager) BattleManager._currentActor = _rtActor;
    if (_rtActor) {
      if (this._skillWindow && this._skillWindow.setActor) this._skillWindow.setActor(_rtActor);
      if (this._itemWindow && this._itemWindow.setActor) this._itemWindow.setActor(_rtActor);
    }
    if (this._rt_menuMode === "enemyTarget") this._rt_menuMode = null;
    if (this._rt_returnMenuMode === "skill" && this._skillWindow) { this._skillWindow.show(); this._skillWindow.activate(); this._rt_menuMode = "skill"; if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "skill"; BattleManager._aprbMenuStage = "list"; } }
    if (this._rt_returnMenuMode === "item" && this._itemWindow) { this._itemWindow.show(); this._itemWindow.activate(); this._rt_menuMode = "item"; if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "item"; BattleManager._aprbMenuStage = "list"; } }
  };

  Scene_Battle.prototype.onActorCancel = function() {

    try { if (typeof BattleManager !== "undefined" && BattleManager) BattleManager._aprbMuteCursorOkSe = false; } catch (e) {}

    this._rt_pendingApCost = 0; this._rt_pendingApType = null; this._rt_pendingApActor = null;
    this._rt_pendingApCost = 0; this._rt_pendingApType = null; this._rt_pendingApActor = null;
    if (this._actorWindow) { this._actorWindow.hide(); this._actorWindow.deactivate(); }
    // Ensure a valid current actor exists before returning to list windows.
    var _rtActor = (BattleManager.actor && BattleManager.actor()) || (this._rt_controlActor && this._rt_controlActor()) || null;
    if (!_rtActor && $gameParty && $gameParty.battleMembers) _rtActor = $gameParty.battleMembers()[0] || null;
    if (_rtActor && BattleManager) BattleManager._currentActor = _rtActor;
    if (_rtActor) {
      if (this._skillWindow && this._skillWindow.setActor) this._skillWindow.setActor(_rtActor);
      if (this._itemWindow && this._itemWindow.setActor) this._itemWindow.setActor(_rtActor);
    }
    if (this._rt_menuMode === "actorTarget") this._rt_menuMode = null;
    if (this._rt_returnMenuMode === "skill" && this._skillWindow) { this._skillWindow.show(); this._skillWindow.activate(); this._rt_menuMode = "skill"; if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "skill"; BattleManager._aprbMenuStage = "list"; } }
    if (this._rt_returnMenuMode === "item" && this._itemWindow) { this._itemWindow.show(); this._itemWindow.activate(); this._rt_menuMode = "item"; if (typeof BattleManager !== "undefined" && BattleManager) { BattleManager._aprbMenuOpen = "item"; BattleManager._aprbMenuStage = "list"; } }
  };

  
  // ------------------------------------------------------------
  // [APRB][fix] Prevent AP loss on key spam
  // - Consume AP only when an immediate action (forceAction) is successfully queued.
  // - While a forced action is pending/processing, ignore new attack/guard inputs.
  // ------------------------------------------------------------
  function _aprbRtIsActionPendingForActor(actor) {
    try {
      const bm = BattleManager;
      if (!bm) return false;
      // Our own lock
      if (bm._aprbRtQueuedActor && bm._aprbRtQueuedActor === actor) return true;
      // Engine-level forced action markers (best-effort; not all builds expose all fields)
      if (bm._actionForcedBattler && bm._actionForcedBattler === actor) return true;
      if (bm._forcedBattler && bm._forcedBattler === actor) return true;
      // If the subject is currently acting, don't accept another immediate action.
      if (bm._subject && bm._subject === actor) {
        if (bm._phase && bm._phase !== 'turn') return true;
        // Even if phase is ambiguous, treat as pending.
        return true;
      }
    } catch (e) {}
    return false;
  }
  function _aprbRtLockQueuedActor(actor) {
    try {
      const bm = BattleManager;
      if (!bm) return;
      bm._aprbRtQueuedActor = actor;
      bm._aprbRtQueuedFrame = (typeof Graphics !== 'undefined' && Graphics.frameCount != null) ? Number(Graphics.frameCount) : 0;
    } catch (e) {}
  }
  function _aprbRtUnlockQueuedActorIfMatches(actor) {
    try {
      const bm = BattleManager;
      if (!bm) return;
      if (!bm._aprbRtQueuedActor) return;
      if (!actor || bm._aprbRtQueuedActor === actor) {
        bm._aprbRtQueuedActor = null;
        bm._aprbRtQueuedFrame = 0;
      }
    } catch (e) {}
  }
  // Clear our lock when the engine actually starts/ends an action.
  (function(){
    try {
      const _bmStartAction = BattleManager.startAction;
      if (_bmStartAction && !_bmStartAction.__APRB_RTLOCK_PATCHED) {
        BattleManager.startAction = function() {
          try { _aprbRtUnlockQueuedActorIfMatches(this._subject); } catch (e) {}
          return _bmStartAction.apply(this, arguments);
        };
        BattleManager.startAction.__APRB_RTLOCK_PATCHED = true;
      }
    } catch (e) {}
    try {
      const _bmEndAction = BattleManager.endAction;
      if (_bmEndAction && !_bmEndAction.__APRB_RTLOCK_PATCHED) {
        BattleManager.endAction = function() {
          try { _aprbRtUnlockQueuedActorIfMatches(null); } catch (e) {}
          return _bmEndAction.apply(this, arguments);
        };
        BattleManager.endAction.__APRB_RTLOCK_PATCHED = true;
      }
    } catch (e) {}
    try {
      const _bmProcessForced = BattleManager.processForcedAction;
      if (_bmProcessForced && !_bmProcessForced.__APRB_RTLOCK_PATCHED) {
        BattleManager.processForcedAction = function() {
          // If a forced action just got processed, allow next input.
          try { _aprbRtUnlockQueuedActorIfMatches(null); } catch (e) {}
          return _bmProcessForced.apply(this, arguments);
        };
        BattleManager.processForcedAction.__APRB_RTLOCK_PATCHED = true;
      }
    } catch (e) {}
  })();
Scene_Battle.prototype._rt_doAttack = function(actor) {
    if (!actor) return;
    // If an immediate action is already pending for this actor, ignore input (no AP loss).
    if (_aprbRtIsActionPendingForActor(actor)) return;

    if (ATTACK_AP_COST > 0 && actor.ap() < ATTACK_AP_COST) {
      // No buzzer on AP不足（要求仕様）
      return;
    }
    const target = this._rt_focusedEnemy();
    if (!target) {
      SoundManager.playBuzzer();
      return;
    }

    // Decide skill id (supports AttackCmdSkillId override)
    let skillId = actor.attackSkillId();
    try {
      if (typeof _APRB_ATTACK_CMD_SKILL_ID !== "undefined" && _APRB_ATTACK_CMD_SKILL_ID > 0) {
        const s = (typeof $dataSkills !== "undefined") ? $dataSkills[_APRB_ATTACK_CMD_SKILL_ID] : null;
        if (s) skillId = _APRB_ATTACK_CMD_SKILL_ID;
      }
    } catch (e) {}

    // Queue forced action first; consume AP only if we actually queued.
    try {
      _aprbRtLockQueuedActor(actor);
      actor.forceAction(skillId, target.index());
      BattleManager.forceAction(actor);
    } catch (e) {
      _aprbRtUnlockQueuedActorIfMatches(actor);
      return;
    }

    if (ATTACK_AP_COST > 0) actor.consumeAp(ATTACK_AP_COST);

    // Hide the focus cursor after executing attack (it will re-appear when player changes focus again)
    if (this._enemyWindow && this._enemyWindow.deselect) this._enemyWindow.deselect();
    if (SoundManager.playActorAttack) SoundManager.playActorAttack();
    else if (SoundManager.playEnemyAttack) SoundManager.playEnemyAttack();
    else if (SoundManager.playOk) SoundManager.playOk();
  };

  Scene_Battle.prototype._rt_doGuard = function(actor) {
    if (!actor) return;
    // If an immediate action is already pending for this actor, ignore input (no AP loss).
    if (_aprbRtIsActionPendingForActor(actor)) return;

    if (GUARD_AP_COST > 0 && actor.ap() < GUARD_AP_COST) {
      // No buzzer on AP不足（要求仕様）
      return;
    }

    // We will consume AP only after the guard action is successfully queued.

    // Open parry window (frame-based)
    try {
      const frames = aprbGetParryWindowFrames();
      actor._aprbParryFrames = frames;
      if (DEBUG_LOG) {
        try {
          const fc = (Graphics && Graphics.frameCount != null) ? Number(Graphics.frameCount) : -1;
          const v = (PARRY_WINDOW_VAR_ID > 0 && $gameVariables && $gameVariables.value) ? $gameVariables.value(PARRY_WINDOW_VAR_ID) : null;
          _aprbDbg('[APRB][Parry] open window by Guard frame=' + fc + ' actor=' + (actor.name ? actor.name() : '') + ' frames=' + frames + ' varId=' + PARRY_WINDOW_VAR_ID + ' varValue=' + v);
        } catch (e0) {}
      }
    } catch (e) {}

    // Optional short HardStop on guard
    if (GUARD_HARDSTOP_ENABLE) {
      try { if (typeof BattleManager !== 'undefined' && BattleManager) {
        BattleManager._aprbTimeStop = true;
        BattleManager._aprbTimeStopFrames = GUARD_HARDSTOP_FRAMES;
      }} catch (e2) {}
    }

    // Choose guard skill id with stronger preference order:
//  1) Plugin parameter GuardSkillId (DEFAULT_GUARD_SKILL_ID)
//  2) Saved value $gameSystem._aprbGuardSkillId
//  3) Actor default guardSkillId()
let _skillId = 0;
try {
  const defId = Number(DEFAULT_GUARD_SKILL_ID || 0);
  if (defId > 0) _skillId = defId;
} catch (e) {}
if (_skillId <= 0) {
  try {
    const gs = (typeof $gameSystem !== "undefined") ? $gameSystem : null;
    if (gs && gs._aprbGuardSkillId != null) _skillId = Number(gs._aprbGuardSkillId || 0);
  } catch (e) {}
}
if (_skillId <= 0) {
  try { if (actor && actor.guardSkillId) _skillId = Number(actor.guardSkillId() || 0); } catch (e) {}
}
if (_skillId <= 0) return;
// Keep save synced (per-save, do not overwrite non-zero)
try {
  if (typeof $gameSystem !== "undefined" && $gameSystem) {
    if ($gameSystem._aprbGuardSkillId == null || Number($gameSystem._aprbGuardSkillId || 0) === 0) {
      if (Number(DEFAULT_GUARD_SKILL_ID || 0) > 0) $gameSystem._aprbGuardSkillId = Number(DEFAULT_GUARD_SKILL_ID || 0);
    }
  }
} catch (e) {}

    // Queue guard action first; consume AP only if we actually queued.
    try {
      _aprbRtLockQueuedActor(actor);
      actor.forceAction(_skillId, actor.index());
    BattleManager.forceAction(actor);
    } catch (e) {
      _aprbRtUnlockQueuedActorIfMatches(actor);
      return;
    }

    if (GUARD_AP_COST > 0 && actor.consumeAp) actor.consumeAp(GUARD_AP_COST);

    aprbPlayGuardSe();
  };

  // Open a parry window without forcing the guard action (used while the actor is locked).
  // This enables consecutive parries (tap X in time) even when actor.canMove() is false.
  Scene_Battle.prototype._rt_tryParryTap = function(actor) {
    if (!actor) return false;
    if (GUARD_AP_COST > 0 && actor.ap && actor.ap() < GUARD_AP_COST) return false;
    if (GUARD_AP_COST > 0 && actor.consumeAp) actor.consumeAp(GUARD_AP_COST);
    try {
      const frames = aprbGetParryWindowFrames();
      actor._aprbParryFrames = frames;
      if (DEBUG_LOG) {
        try {
          const fc = (Graphics && Graphics.frameCount != null) ? Number(Graphics.frameCount) : -1;
          const v = (PARRY_WINDOW_VAR_ID > 0 && $gameVariables && $gameVariables.value) ? $gameVariables.value(PARRY_WINDOW_VAR_ID) : null;
          _aprbDbg('[APRB][Parry] open window by Tap frame=' + fc + ' actor=' + (actor.name ? actor.name() : '') + ' frames=' + frames + ' varId=' + PARRY_WINDOW_VAR_ID + ' varValue=' + v);
        } catch (e0) {}
      }
    } catch (e) {}
    return true;
  };

  Scene_Battle.prototype._rt_doEscape = function() {
    if (!BattleManager.canEscape()) {
      SoundManager.playBuzzer();
      return;
    }
    BattleManager._escapeRatio = 9999;
    BattleManager.processEscape();
  };


  // ------------------------------------------------------------
  // v2.0.19 hotfix
  //  - In APRealtimeBattle, we bypass the default actor/command flow.
  //    Some environments (and/or other plugins) make BattleManager.inputtingAction()
  //    return null in this flow. Default Scene_Battle.onSkillOk/onItemOk then crash
  //    at setSkill/setItem.
  //  - Fix: wrap BattleManager.inputtingAction() to return a fallback action when we
  //    provide one, and provide that fallback action on skill/item OK.
  // ------------------------------------------------------------

  if (typeof BattleManager !== "undefined" && !BattleManager._aprbInputWrap) {
    BattleManager._aprbInputWrap = true;
    var _APRB_BM_inputtingAction = BattleManager.inputtingAction;
    BattleManager.inputtingAction = function() {
      return this._aprbInputtingAction || (_APRB_BM_inputtingAction ? _APRB_BM_inputtingAction.call(this) : null);
    };
    BattleManager._aprbClearInputtingAction = function() {
      this._aprbInputtingAction = null;
    };
  }

  Scene_Battle.prototype._aprb_ensureFallbackInputtingAction = function(actor) {
    // Recover actor as defensively as possible.
    var members = ($gameParty && $gameParty.battleMembers) ? $gameParty.battleMembers() : [];
    if (!actor) actor = (BattleManager.actor && BattleManager.actor()) || members[0] || null;
    if (!actor) return null;

    // Sync actor index (some BattleManager implementations rely on index state).
    if (members && members.length) {
      var idx = members.indexOf(actor);
      if (idx >= 0) BattleManager._actorIndex = idx;
    }

    // Make sure the actor has an action to input.
    if (actor._actionInputIndex == null) actor._actionInputIndex = 0;
    if (!actor._actions) actor._actions = [];
    if (!actor._actions[actor._actionInputIndex] && typeof Game_Action === "function") {
      actor._actions[actor._actionInputIndex] = new Game_Action(actor);
    }

    // Provide our fallback regardless of how BattleManager derives inputtingAction.
    BattleManager._aprbInputtingAction = actor._actions[actor._actionInputIndex] || null;
    return BattleManager._aprbInputtingAction;
  };

  // Re-wrap onSkillOk/onItemOk so the fallback is ALWAYS provided before default logic.
  (function() {
    var _APRB_prev_onSkillOk = Scene_Battle.prototype.onSkillOk;
    Scene_Battle.prototype.onSkillOk = function() {
      var actor = (this._skillWindow && this._skillWindow._actor) || (BattleManager.actor && BattleManager.actor()) || (this._rt_controlActor && this._rt_controlActor()) || null;
      this._aprb_ensureFallbackInputtingAction(actor);
      return _APRB_prev_onSkillOk.call(this);
    };

    var _APRB_prev_onItemOk = Scene_Battle.prototype.onItemOk;
    Scene_Battle.prototype.onItemOk = function() {
      var actor = (this._itemWindow && this._itemWindow._actor) || (BattleManager.actor && BattleManager.actor()) || (this._rt_controlActor && this._rt_controlActor()) || null;
      this._aprb_ensureFallbackInputtingAction(actor);
      return _APRB_prev_onItemOk.call(this);
    };

    // Clear fallback on cancel to avoid leaving BattleManager in "input" state.
    var _APRB_prev_onSkillCancel = Scene_Battle.prototype.onSkillCancel;
    if (_APRB_prev_onSkillCancel) {
      Scene_Battle.prototype.onSkillCancel = function() {
        if (BattleManager._aprbClearInputtingAction) BattleManager._aprbClearInputtingAction();
        return _APRB_prev_onSkillCancel.call(this);
      };
    }

    var _APRB_prev_onItemCancel = Scene_Battle.prototype.onItemCancel;
    if (_APRB_prev_onItemCancel) {
      Scene_Battle.prototype.onItemCancel = function() {
        if (BattleManager._aprbClearInputtingAction) BattleManager._aprbClearInputtingAction();
        return _APRB_prev_onItemCancel.call(this);
      };
    }
  })();


  // APRB_TIME_STOP_CLEAR: safety - always resume time when leaving battle scene
  if (typeof Scene_Battle !== 'undefined' && Scene_Battle.prototype) {
    const _Scene_Battle_terminate_APRB_TIME_STOP_CLEAR = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
      try { if (typeof BattleManager !== 'undefined' && BattleManager) BattleManager._aprbTimeStop = false; } catch (e) {}
      try { this._rt_zHoldActive = false; this._rt_zHoldFrames = 0; } catch (e2) {}
      return _Scene_Battle_terminate_APRB_TIME_STOP_CLEAR.call(this);
    };
  }

  // APRB: clear time-stop flag when leaving battle
  (function() {
    if (typeof Scene_Battle === 'undefined' || !Scene_Battle.prototype) return;
    const _aprb_term = Scene_Battle.prototype.terminate;
    Scene_Battle.prototype.terminate = function() {
      try { if (typeof BattleManager !== 'undefined' && BattleManager) BattleManager._aprbTimeStop = false; } catch (e) {}
      try { this._rt_zHoldActive = false; this._rt_zHoldFrames = 0; this._rt_zHoldActor = null; } catch (e2) {}
      return _aprb_term.call(this);
    };
  })();

    // ============================================================
  // Basic Battle Wait (Per Action)  (keke_SpeedStarBattle「基本バトルウェイト」移植)
  //
  // 重要:
  //  - RPGツクールMZ側の「止まり」は、Window_BattleLog.wait() だけでなく
  //    setWaitCount() 直叩きでも発生します。
  //  - そのため、本移植は wait() ではなく setWaitCount() を主戦場にします。
  //
  // 仕様:
  //  - 攻撃/防御/スキル/アイテムごとに ON/OFF + フレーム値
  //  - 値が 0 の場合、その行動中の BattleLog 待ちを全て 0 にします（止まらない）
  //  - 値が 1 以上の場合、その行動中の BattleLog 待ちを指定値に揃えます
  //    (既に設定済みの待ちが長い場合でも、指定値を優先します)
  // ============================================================
  function aprbBasicBattleWaitFrames(kind) {
    switch (kind) {
      case "attack":
        return BBW_ATTACK_ENABLED ? Math.max(0, BBW_ATTACK_FRAMES | 0) : null;
      case "guard":
        return BBW_GUARD_ENABLED ? Math.max(0, BBW_GUARD_FRAMES | 0) : null;
      case "skill":
        return BBW_SKILL_ENABLED ? Math.max(0, BBW_SKILL_FRAMES | 0) : null;
      case "item":
        return BBW_ITEM_ENABLED ? Math.max(0, BBW_ITEM_FRAMES | 0) : null;
      default:
        return null;
    }
  }


  // 現在の「行動種別」をできるだけ確実に推定する（startAction を経由しない環境対策）
  function aprbCurrentActionKindForWait() {
    // 1) BattleManager._action（標準経路）
    try {
      const k1 = aprbDetectActionKind(BattleManager._action);
      if (k1) return k1;
    } catch (e) {}

    // 2) subject.currentAction（標準/拡張の一部でこちらが先に立つ）
    try {
      const subj = BattleManager._subject;
      const act = subj && subj.currentAction ? subj.currentAction() : null;
      const k2 = aprbDetectActionKind(act);
      if (k2) return k2;
    } catch (e) {}

    // 3) Scene_Battle のコマンド発火時に記録した last kind（APRB独自経路の保険）
    try {
      const k3 = BattleManager._aprbLastCommandKind;
      if (k3) return k3;
    } catch (e) {}

    return null;
  }


  function aprbDetectActionKind(action) {
    if (!action) return null;
// 最下層での明示（他プラグインによる item 判定の揺れ対策）
// Game_Action.setAttack / setGuard で設定される
if (action._aprbForcedKind === "attack") return "attack";
if (action._aprbForcedKind === "guard")  return "guard";

    const item = action.item?.();
    if (!item) return null;

    if (DataManager.isSkill(item)) {
      const atkId = Game_BattlerBase.prototype.attackSkillId();
      const grdId = Game_BattlerBase.prototype.guardSkillId();
      if (item.id === atkId) return "attack";
      if (item.id === grdId) return "guard";
      return "skill";
    }
    if (DataManager.isItem(item)) return "item";
    return null;
  }

  

  
// ------------------------------------------------------------
// BBW kind mark at the lowest layer
//  - ensure BBW=0 判定を最下層で確実に拾う
// ------------------------------------------------------------
if (typeof Game_Action !== "undefined" && Game_Action.prototype) {
  const _APRB_Game_Action_setAttack = Game_Action.prototype.setAttack;
  Game_Action.prototype.setAttack = function() {
    this._aprbForcedKind = "attack";
    return _APRB_Game_Action_setAttack.apply(this, arguments);
  };

  const _APRB_Game_Action_setGuard = Game_Action.prototype.setGuard;
  Game_Action.prototype.setGuard = function() {
    this._aprbForcedKind = "guard";
    return _APRB_Game_Action_setGuard.apply(this, arguments);
  };
}

// ============================================================
  // Halt Reason Full Dump (Freeze Detector)
  //  - "止まったフレーム"で、止めうる理由を可能な限り全列挙する。
  //  - 低侵襲: 毎フレーム大量ログは出さず、"BBW=0(攻撃/防御)中に updateActionMain が進まない"時のみ出す。
  //  - 目的: どの栓（busy / message / troop event / phase 等）が効いているかを一発で確定する。
  // ============================================================
  const _APRB_HALTDUMP_ENABLED = !!_APRB_DEBUG_ENABLED;
  const _APRB_HALTDUMP_FREEZE_FRAMES = 2; // 何フレーム updateActionMain が進まなければ "停止" とみなすか

  function _aprbHaltState() {
    const w = (typeof window !== 'undefined') ? window : globalThis;
    if (!w.__APRB_HALT_STATE) {
      w.__APRB_HALT_STATE = {
        lastActionMainFrame: 0,
        lastLoggedFrame: -1,
        lastPhase: null,
        lastKind: null,
      };
    }
    return w.__APRB_HALT_STATE;
  }

  function _aprbSafeName(battler) {
    try { return battler && battler.name ? String(battler.name()) : ""; } catch (e) { return ""; }
  }
  function _aprbSafeId(battler) {
    try { return battler && battler.isActor && battler.isActor() ? ("A" + battler.actorId()) : ("E" + battler.enemyId()); } catch (e) { return ""; }
  }
  function _aprbSafeItem(act) {
    try {
      const it = act && act.item ? act.item() : null;
      if (!it) return null;
      return { id: it.id, name: it.name, type: DataManager.isSkill(it) ? "skill" : (DataManager.isItem(it) ? "item" : "unknown") };
    } catch (e) { return null; }
  }

  function APRB_haltDumpTick() {
    if (!_APRB_HALTDUMP_ENABLED) return;
    try { if (!$gameParty || !$gameParty.inBattle || !$gameParty.inBattle()) return; } catch (e) { return; }

    const st = _aprbHaltState();
    const frame = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Graphics.frameCount : 0;

    // "今"の行動種別と BBW 設定値
    let kind = null;
    let bbwFrames = null;
    var bbw0 = false;
    try {
      kind = aprbCurrentActionKindForWait();
      bbwFrames = kind ? aprbBasicBattleWaitFrames(kind) : null;
    } catch (e) {}

    bbw0 = (bbwFrames === 0) && (kind === "attack" || kind === "guard");

    // BBW0 対象でないならログ条件も解除
    if (!bbw0) {
      st.lastLoggedFrame = -1;
      st.lastKind = kind;
      st.lastPhase = BattleManager && BattleManager._phase;
      return;
    }

    // updateActionMain が進んでいないフレーム数
    const delta = frame - (st.lastActionMainFrame || 0);
    if (delta <= _APRB_HALTDUMP_FREEZE_FRAMES) return;

    // 同一フレーム多重出力防止
    if (st.lastLoggedFrame === frame) return;
    st.lastLoggedFrame = frame;

    const reasons = [];

    // 代表的な "栓" を全部評価して列挙
    let logBusy = null;
    let spritesetBusy = null;
    let bmBusy = null;
    let msgBusy = null;
    let troopEvent = null;
    let phase = null;

    try { phase = BattleManager && BattleManager._phase; } catch (e) {}

    try {
      logBusy = BattleManager && BattleManager._logWindow && BattleManager._logWindow.isBusy ? BattleManager._logWindow.isBusy() : null;
      if (logBusy) reasons.push("logWindow.isBusy");
    } catch (e) {}

    try {
      const spr = SceneManager && SceneManager._scene && SceneManager._scene._spriteset ? SceneManager._scene._spriteset : null;
      spritesetBusy = spr && spr.isBusy ? spr.isBusy() : null;
      if (spritesetBusy) reasons.push("spriteset.isBusy");
    } catch (e) {}

    try {
      bmBusy = BattleManager && BattleManager.isBusy ? BattleManager.isBusy() : null;
      if (bmBusy) reasons.push("BattleManager.isBusy");
    } catch (e) {}

    try {
      msgBusy = $gameMessage && $gameMessage.isBusy ? $gameMessage.isBusy() : null;
      if (msgBusy) reasons.push("$gameMessage.isBusy");
    } catch (e) {}

    try {
      troopEvent = $gameTroop && $gameTroop.isEventRunning ? $gameTroop.isEventRunning() : null;
      if (troopEvent) reasons.push("$gameTroop.isEventRunning");
    } catch (e) {}

    try {
      if (phase && phase !== "action") reasons.push("phase!=" + phase);
    } catch (e) {}

    // subject / action 情報
    const subj = (BattleManager && BattleManager._subject) ? BattleManager._subject : null;
    let act = null;
    try { act = BattleManager && BattleManager._action ? BattleManager._action : null; } catch (e) {}
    try {
      if (!act && subj && subj.currentAction) act = subj.currentAction();
    } catch (e) {}

    const itemInfo = _aprbSafeItem(act);

    // waitCount など
    let logWait = null;
    try { logWait = BattleManager && BattleManager._logWindow ? (BattleManager._logWindow._waitCount != null ? BattleManager._logWindow._waitCount : null) : null; } catch (e) {}

    // 出力（1〜数行。全部コピー可能）
    _aprbHaltLog("[APRB-HALT] frame=" + frame +
      " delta=" + delta +
      " phase=" + phase +
      " kind=" + kind +
      " bbw=" + bbwFrames +
      " subj=" + _aprbSafeId(subj) + ":" + _aprbSafeName(subj) +
      " item=" + (itemInfo ? (itemInfo.type + "#" + itemInfo.id + ":" + itemInfo.name) : "null") +
      " logWait=" + logWait
    );
    _aprbHaltLog("[APRB-HALT] STOP=" + (reasons.length ? reasons.join(", ") : "(none)") +
      " logBusy=" + logBusy +
      " sprBusy=" + spritesetBusy +
      " bmBusy=" + bmBusy +
      " msgBusy=" + msgBusy +
      " troopEvent=" + troopEvent
    );
  }

  // Hook: updateActionMain が進んだフレームを記録
  (function() {
    const st = _aprbHaltState();
    const _BM_updateActionMain = BattleManager.updateActionMain;
    BattleManager.updateActionMain = function() {
      try {
        const frame = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Graphics.frameCount : 0;
        st.lastActionMainFrame = frame;
      } catch (e) {}
      return _BM_updateActionMain.apply(this, arguments);
    };

    // Hook: Scene_Battle.update の最後で freeze 判定
    const _SB_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
      _SB_update.apply(this, arguments);
      APRB_haltDumpTick();
    };

    // Hook: 戦闘終了で状態リセット
    const _BM_endBattle = BattleManager.endBattle;
    BattleManager.endBattle = function(result) {
      try {
        st.lastActionMainFrame = 0;
        st.lastLoggedFrame = -1;
        st.lastPhase = null;
        st.lastKind = null;
      } catch (e) {}
      return _BM_endBattle.apply(this, arguments);
    };
  })();

  // --- BBW hook resilience ---
  // 他プラグインが後から BattleManager.startAction / Window_BattleLog.setWaitCount を上書きしても
  // “毎フレーム検査して再フック”することで BBW を最終的に有効化する。
  function APRB_ensureBBWHooks() {
    if (!APRB_isBBWAnyEnabled()) return;

    // 1) BattleManager.startAction: 行動種別を確実に記録
    const bm = BattleManager;
    if (bm && bm.startAction && !bm.startAction.__aprb_bbw_wrapped) {
      const _orig = bm.startAction;
      const wrapped = function() {
        try {
          this._aprbActionKindForWait = aprbDetectActionKind(this._action) || this._aprbBbwLastIssuedKind || null;
          if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] startAction kind=${this._aprbActionKindForWait || "none"}`);
        } catch (e) {}
        return _orig.apply(this, arguments);
      };
      wrapped.__aprb_bbw_wrapped = true;
      wrapped.__aprb_bbw_orig = _orig;
      bm.startAction = wrapped;
    }

    
// 1.5) Game_Action.setAttack / setGuard: 攻撃・防御入力の“事実”を最下層で捕捉（コマンド差し替え系対策）
// Scene_Battle.commandAttack/Guard が通らない構成でも、Game_Action 側ならほぼ確実に通る。
try {
  const ga = Game_Action && Game_Action.prototype;
  if (ga) {
    if (ga.setAttack && !ga.setAttack.__aprb_bbw_wrapped) {
      const _origSetAttack = ga.setAttack;
      const wrappedSetAttack = function() {
        try {
          if (BattleManager) {
            BattleManager._aprbBbwLastIssuedKind = "attack";
            BattleManager._aprbBbwLastIssuedFrame = (Graphics && Graphics.frameCount) || 0;
          }
          if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] issued kind=attack (via Game_Action.setAttack)`);
        } catch (e) {}
        return _origSetAttack.apply(this, arguments);
      };
      wrappedSetAttack.__aprb_bbw_wrapped = true;
      wrappedSetAttack.__aprb_bbw_orig = _origSetAttack;
      ga.setAttack = wrappedSetAttack;
    }
    if (ga.setGuard && !ga.setGuard.__aprb_bbw_wrapped) {
      const _origSetGuard = ga.setGuard;
      const wrappedSetGuard = function() {
        try {
          if (BattleManager) {
            BattleManager._aprbBbwLastIssuedKind = "guard";
            BattleManager._aprbBbwLastIssuedFrame = (Graphics && Graphics.frameCount) || 0;
          }
          if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] issued kind=guard (via Game_Action.setGuard)`);
        } catch (e) {}
        return _origSetGuard.apply(this, arguments);
      };
      wrappedSetGuard.__aprb_bbw_wrapped = true;
      wrappedSetGuard.__aprb_bbw_orig = _origSetGuard;
      ga.setGuard = wrappedSetGuard;
    }
  }
} catch (e) {}

// 2) Window_BattleLog.setWaitCount: waitCount を行動別 frames にクランプ
    const wbl = Window_BattleLog && Window_BattleLog.prototype;
    if (wbl && wbl.setWaitCount && !wbl.setWaitCount.__aprb_bbw_wrapped) {
      const _orig = wbl.setWaitCount;
      const wrapped = function(count) {
        const kind = (BattleManager && BattleManager._aprbActionKindForWait) || (BattleManager && BattleManager._aprbBbwLastIssuedKind) || null;
        const frames = aprbBasicBattleWaitFrames(kind);
        if (frames != null) {
          if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] setWaitCount kind=${kind || "none"} req=${count} -> ${frames}`);
          return _orig.call(this, frames);
        }
        // 有効化しているのに kind が取れない場合の観測
        if (APRB_DEBUG_LOG && APRB_isBBWAnyEnabled() && kind == null && count > 0) {
          console.log(`[APRB][BBW] setWaitCount kind=none req=${count} (pass-through)`);
        }
        return _orig.apply(this, arguments);
      };
      wrapped.__aprb_bbw_wrapped = true;
      wrapped.__aprb_bbw_orig = _orig;
      wbl.setWaitCount = wrapped;
    }

    // 3) Window_BattleLog.updateWaitCount: setWaitCount を経由しない場合の保険（直接 _waitCount をクランプ）
    if (wbl && wbl.updateWaitCount && !wbl.updateWaitCount.__aprb_bbw_wrapped) {
      const _orig = wbl.updateWaitCount;
      const wrapped = function() {
        const res = _orig.apply(this, arguments);
        try {
          const kind = (BattleManager && BattleManager._aprbActionKindForWait) || (BattleManager && BattleManager._aprbBbwLastIssuedKind) || null;
          const frames = aprbBasicBattleWaitFrames(kind);
          if (frames != null && typeof this._waitCount === "number" && this._waitCount > frames) {
            if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] clamp(_waitCount) kind=${kind || "none"} req=${this._waitCount} -> ${frames}`);
            this._waitCount = frames;
          } else if (APRB_DEBUG_LOG && APRB_isBBWAnyEnabled() && typeof this._waitCount === "number" && this._waitCount > 0 && frames == null) {
            // 観測：待機はあるが frames が決まらない
            console.log(`[APRB][BBW] observe _waitCount=${this._waitCount} kind=${kind || "none"} frames=${frames}`);
          }
        } catch (e) {}
        return res;
      };
      wrapped.__aprb_bbw_wrapped = true;
      wrapped.__aprb_bbw_orig = _orig;
      wbl.updateWaitCount = wrapped;
    }
  }
  // --- BBW core clamp (override-proof) ---
  // 他プラグインが BattleLog / BattleManager の wait 系を上書きして BBW フックが呼ばれなくても、
  // “実体の wait カウンタを毎フレーム直接クランプ”して効果を担保する。
  function APRB_bbwClampCoreWaits(scene) {
    if (!APRB_isBBWAnyEnabled()) return;

    const kind = (BattleManager && (BattleManager._aprbActionKindForWait || BattleManager._aprbBbwLastIssuedKind)) || null;
    const frames = aprbBasicBattleWaitFrames(kind);
    if (frames == null) return;

    // BattleManager 側の waitCount（環境によっては存在）
    try {
      if (BattleManager && typeof BattleManager._waitCount === "number" && BattleManager._waitCount > frames) {
        if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] clamp(BM._waitCount) kind=${kind || "none"} req=${BattleManager._waitCount} -> ${frames}`);
        BattleManager._waitCount = frames;
      }
    } catch (e) {}

    // BattleLog の waitCount（実際に演出停止の原因になりやすい）
    try {
      const w = (scene && scene._logWindow) ? scene._logWindow : (BattleManager && BattleManager._logWindow);
      if (w && typeof w._waitCount === "number" && w._waitCount > frames) {
        if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] clamp(WBL._waitCount) kind=${kind || "none"} req=${w._waitCount} -> ${frames}`);
        w._waitCount = frames;
  

  // --- BBW(基本バトルウェイト) “停止しない” モードの最終担保 ---
  // waitCount を 0 にしても、MZ標準は BattleManager.update / updateAction 内で
  //  _logWindow.isBusy() / _spriteset.isBusy() を理由に return しうる。
  // そこで「BBW=0 かつ 攻撃/防御 の行動中」だけ、BattleManager 進行レイヤで
  //  log/spriteset の busy 判定を“そのフレームだけ無視”して更新を継続する。
  //
  // 要件:
  //  - 攻撃/防御: 一切止まらない
  //  - スキル/アイテム: 従来通り止まってよい（BBW=0対象外運用を前提）
  function APRB_getBBWZeroKindNow() {
    if (!APRB_isBBWAnyEnabled()) return null;

    const bm = BattleManager;
    let kind = null;

    // 1) トラッキング（startActionでセットされる）
    try { kind = (bm && (bm._aprbActionKindForWait || bm._aprbBbwLastIssuedKind)) || null; } catch (e) {}

    // 2) フェーズ/現在行動から推定（割り込みや一瞬のnullを拾う）
    if (!kind) {
      try {
        if (bm && bm._phase === "action") {
          const a = bm._action || (bm._subject && bm._subject.currentAction && bm._subject.currentAction());
          kind = aprbDetectActionKind(a) || null;
        }
      } catch (e) {}
    }

    // 3) それでも取れない場合は対象外
    if (kind !== "attack" && kind !== "guard") return null;

    const frames = aprbBasicBattleWaitFrames(kind);
    return frames === 0 ? kind : null;
  }

  function APRB_isBBWZeroActive() {
    return !!APRB_getBBWZeroKindNow();
  }

  function APRB_ensureBBWNoStopHook() {
    if (!APRB_isBBWAnyEnabled()) return;

    const bm = BattleManager;
    if (!bm || !bm.update) return;
    if (bm.update.__aprb_bbw_nostop_wrapped) return;

    const _orig = bm.update;
    const wrapped = function() {
      const __bbwKindNow = APRB_getBBWZeroKindNow();
      if (!__bbwKindNow) {
        return _orig.apply(this, arguments);
      }

      // [DBG] BBW=0 active during {"attack/guard"} -> force-no-stop
      try { if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] nostop active kind=${__bbwKindNow} phase=${this._phase}`); } catch (e) {}

      // 1フレームだけ busy 判定を無視（後で必ず元に戻す）
      const lw = this._logWindow;
      const ss = this._spriteset;

      const lwIsBusy = lw && lw.isBusy;
      const ssIsBusy = ss && ss.isBusy;

      let lwPatched = false;
      let ssPatched = false;

      try {
        if (lw && typeof lwIsBusy === "function") {
          lw.isBusy = function() { return false; };
          lwPatched = true;
        }
      } catch (e) {}

      try {
        if (ss && typeof ssIsBusy === "function") {
          ss.isBusy = function() { return false; };
          ssPatched = true;
        }
      } catch (e) {}

      try {
        return _orig.apply(this, arguments);
      } finally {
        try { if (lw && lwPatched) lw.isBusy = lwIsBusy; } catch (e) {}
        try { if (ss && ssPatched) ss.isBusy = ssIsBusy; } catch (e) {}
      }
    };
    wrapped.__aprb_bbw_nostop_wrapped = true;
    bm.update = wrapped;


    // 追加担保: MZ標準の updateAction が _logWindow/_spriteset の busy で return して止まる場合があるため、
    // BBW=0(attack/guard) の行動中だけ busyチェックを無視して updateActionMain を進める。
    if (bm.updateAction && !bm.updateAction.__aprb_bbw_nostop_updateAction_wrapped) {
      const _origUpdateAction = bm.updateAction;
      bm.updateAction = function() {
        const k = APRB_getBBWZeroKindNow();
        if (k && this._phase === "action" && this._action && typeof this.updateActionMain === "function") {
          try { if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] force updateActionMain (ignore busy) kind=${k}`); } catch (e) {}
          return this.updateActionMain();
        }
        return _origUpdateAction.apply(this, arguments);
      };
      bm.updateAction.__aprb_bbw_nostop_updateAction_wrapped = true;
    }
  }
    }
    } catch (e) {}
  }


  // 行動種別のトラッキング（BattleLog が参照）
  const _APRB_BattleManager_startAction_BBW = BattleManager.startAction;
  BattleManager.startAction = function() {
    try { this._aprbActionSerial = (this._aprbActionSerial || 0) + 1; BattleManager._aprbActionSerial = this._aprbActionSerial; } catch (e) {}
    // Mark player action in progress for ActionEndDelay fallback (if endAction is bypassed by other plugins)
    try {
      const subj = this._subject;
      const ca = ($gameParty && $gameParty.members) ? $gameParty.members()[CONTROL_ACTOR_INDEX] : null;
      if (subj && ca && subj === ca) {
        this._aprbPlayerActionWaitEnd = true;
        this._aprbLastActionInvolvedPlayer = true;
      }
    } catch (e) {}
    // SpecialUseTriggers: resume request (set by cinematic common end)
    if (this._aprbResumeStartActionRequested) {
      this._aprbResumeStartActionRequested = false;
    }

    // SpecialUseTriggers: allow resuming action after cinematic common without re-enter
    if (this._aprbBypassBeforeCommonOnce) {
      this._aprbBypassBeforeCommonOnce = false;
      return _APRB_BattleManager_startAction_BBW.apply(this, arguments);
    }

    try {
      this._aprbActionKindForWait = aprbDetectActionKind(this._action) || this._aprbBbwLastIssuedKind || null;
    } catch (e) {
      this._aprbActionKindForWait = this._aprbBbwLastIssuedKind || null;
    }
    if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] startAction kind=${this._aprbActionKindForWait || 'none'}`);

    // SpecialUseTriggers: 発動前コモン（本当に行動前で割り込み）
// Track whether this action involves the controlled actor (as subject or target)
try {
  const ca = getControlledActor ? getControlledActor() : null;
  let involved = false;
  if (ca) {
    const subj = this._subject || null;
    if (subj && subj === ca) involved = true;
    // Targets are usually prepared by BattleManager before startAction; fall back to action targets
    const ts = this._targets || null;
    if (!involved && ts && ts.length) {
      for (let i = 0; i < ts.length; i++) { if (ts[i] === ca) { involved = true; break; } }
    }
    if (!involved && this._action && this._action.makeTargets) {
      const t0 = this._action.makeTargets();
      if (t0 && t0.length) {
        for (let i = 0; i < t0.length; i++) { if (t0[i] === ca) { involved = true; break; } }
      }
    }
  }
  this._aprbLastActionInvolvedPlayer = involved;
} catch (e) { this._aprbLastActionInvolvedPlayer = false; }

    if (this.aprbCheckSpecialUseBeforeCommon && this.aprbCheckSpecialUseBeforeCommon()) return;

    return _APRB_BattleManager_startAction_BBW.apply(this, arguments);
  };

  // SpecialUseTriggers: 発動前コモン割り込み中は currentAction を消費しない（BeforeCommon.js方式）
  (function(){
    var _aprb_removeCurrentAction = Game_Battler.prototype.removeCurrentAction;
    Game_Battler.prototype.removeCurrentAction = function() {
      try {
        if (BattleManager && BattleManager._aprbExecSpecialUseBeforeCommon) {
          return;
        }
      } catch (e) {}
      return _aprb_removeCurrentAction.apply(this, arguments);
    };
  })();

  const _APRB_BattleManager_endAction_BBW2 = BattleManager.endAction;
  BattleManager.endAction = function() {
    _APRB_BattleManager_endAction_BBW2.apply(this, arguments);
    this._aprbActionKindForWait = null;
    this._aprbBbwLastIssuedKind = null;
  };

  // --- BBW: clamp BattleManager waitCount during enabled action kinds (robust; works even if BattleLog wait isn't used)
  const _APRB_BattleManager_updateWaitCount_BBW = BattleManager.updateWaitCount;
  BattleManager.updateWaitCount = function() {
    const result = _APRB_BattleManager_updateWaitCount_BBW.apply(this, arguments);

    // apply clamp AFTER engine has set waitCount
    const kind = this._aprbActionKindForWait || this._aprbBbwLastIssuedKind || null;
    const frames = APRB_getBBWFramesForKind(kind);
    if (APRB_DEBUG_LOG && frames == null) {
      const req0 = this._waitCount | 0;
      if (req0 > 0 && this._aprbBbwLastSeenWait !== req0) {
        this._aprbBbwLastSeenWait = req0;
        console.log(`[APRB][BBW] observe waitCount=${req0} kind=${kind || 'none'} frames=null`);
      }
    }
    if (frames != null) {
      const req = this._waitCount | 0;
      const cap = frames | 0;
      if (req > cap) {
        this._waitCount = cap;
        if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] clamp waitCount kind=${kind || "none"} req=${req} -> ${cap}`);
      }
    }
    return result;
  };

  // --- BBW: safety net clamp in BattleManager.update (works even if other plugins overwrite updateWaitCount later)
  
// ------------------------------------------------------------
// BBW=0 (attack/guard) special: keep BattleManager progression even when busy
//
// 移植目的:
//  - keke_SpeedStarBattle の「基本バトルウェイト(BBW)」挙動を再現
//  - 攻撃/防御 かつ BBW=0 の区間だけ、BattleManager.update 内で isBusy 等を無視して updatePhase を進める
//
// 注意:
//  - スキル/アイテムは従来通り（止まってOK）
//  - wait/waitCount ではなく BattleManager 進行レイヤで解決する
// ------------------------------------------------------------
function APRB_isBBW0AttackGuard_BM(bm) {
  try {
    if (!bm) return false;
    const kind = bm._aprbActionKindForWait || bm._aprbBbwLastIssuedKind || null;
    if (kind !== "attack" && kind !== "guard") return false;
    const frames = APRB_getBBWFramesForKind(kind);
    return frames === 0;
  } catch (e) {
    return false;
  }
}

const _APRB_BattleManager_update_BBW = BattleManager.update;
  BattleManager.update = function() {
// BBW=0 (attack/guard) の間だけ、isBusy 等に邪魔されても updatePhase を進める（keke式）
if (APRB_isBBW0AttackGuard_BM(this)) {
  this.updatePhase();
  return;
}

    const result = _APRB_BattleManager_update_BBW.apply(this, arguments);
    const kind = this._aprbActionKindForWait || this._aprbBbwLastIssuedKind || null;
    const frames = APRB_getBBWFramesForKind(kind);
    if (frames != null) {
      const req = this._waitCount | 0;
      const cap = frames | 0;
      if (req > cap) {
        this._waitCount = cap;
        // avoid log spam: log only when a clamp actually happens (and req differs from last logged)
        if (APRB_DEBUG_LOG && this._aprbBbwLastLoggedReq !== req) {
          this._aprbBbwLastLoggedReq = req;
          console.log(`[APRB][BBW] clamp(waitCount) kind=${kind || "none"} req=${req} -> ${cap}`);
        }
      }
    }
    return result;
  };


  // Window_BattleLog の待ち制御
  if (typeof Window_BattleLog !== "undefined" && Window_BattleLog.prototype) {
    // setWaitCount を行動別の基本バトルウェイトに置き換える（本命）
    const _APRB_Window_BattleLog_setWaitCount = Window_BattleLog.prototype.setWaitCount;
    Window_BattleLog.prototype.setWaitCount = function(count) {
      const kind = aprbCurrentActionKindForWait();
      const frames = aprbBasicBattleWaitFrames(kind);
      if (frames != null) {
        if (APRB_DEBUG_LOG) console.log(`[APRB][BBW] setWaitCount kind=${kind || "none"} req=${count} -> ${frames}`);
        return _APRB_Window_BattleLog_setWaitCount.call(this, frames);
      } else {
        // 有効化しているのに kind が取れない場合の切り分けログ（設定ミス/経路差分）
        if (APRB_DEBUG_LOG) {
          const anyEnabled = !!(BBW_ATTACK_ENABLED || BBW_GUARD_ENABLED || BBW_SKILL_ENABLED || BBW_ITEM_ENABLED);
          if (anyEnabled && kind == null) console.log(`[APRB][BBW] setWaitCount kind=none req=${count} (pass-through)`);
        }
      }
      return _APRB_Window_BattleLog_setWaitCount.apply(this, arguments);
    };

    // wait() 経由も念のため（setWaitCount が効けばこちらは不要だが保険）
    const _APRB_Window_BattleLog_wait2 = Window_BattleLog.prototype.wait;
    Window_BattleLog.prototype.wait = function(frames) {
      const kind = aprbCurrentActionKindForWait();
      const f = aprbBasicBattleWaitFrames(kind);
      if (f != null) {
        if (APRB_DEBUG_LOG && kind) console.log(`[APRB][BBW] wait kind=${kind} req=${frames} -> ${f}`);
        return this.setWaitCount(f);
      }
      return _APRB_Window_BattleLog_wait2.apply(this, arguments);
    };

    // 0 のときは「待ち関数」を即抜け（保険）
    const _APRB_Window_BattleLog_waitForMovement2 = Window_BattleLog.prototype.waitForMovement;
    Window_BattleLog.prototype.waitForMovement = function() {
      const kind = aprbCurrentActionKindForWait();
      const frames = aprbBasicBattleWaitFrames(kind);
      if (frames === 0) {
        if (APRB_DEBUG_LOG && kind) console.log(`[APRB][BBW] waitForMovement skip kind=${kind}`);
        return;
      }
      return _APRB_Window_BattleLog_waitForMovement2.apply(this, arguments);
    };

    const _APRB_Window_BattleLog_waitForAnimation2 = Window_BattleLog.prototype.waitForAnimation;
    Window_BattleLog.prototype.waitForAnimation = function() {
      const kind = aprbCurrentActionKindForWait();
      const frames = aprbBasicBattleWaitFrames(kind);
      if (frames === 0) {
        if (APRB_DEBUG_LOG && kind) console.log(`[APRB][BBW] waitForAnimation skip kind=${kind}`);
        return;
      }
      return _APRB_Window_BattleLog_waitForAnimation2.apply(this, arguments);
    };
  }


  // =============================================================================
  // Override Watch (debug only)
  //  - Detects runtime overwrites of core functions by other plugins.
  //  - Does NOT change battle behavior.
  //  - Enabled only when DebugLog is true.
  // =============================================================================

  const _APRB_OVERRIDE_WATCH_TARGETS = [
    [BattleManager, 'startAction'],
    [BattleManager, 'update'],
    [BattleManager, 'updateWaitCount'],    [Scene_Battle.prototype, 'update'],

  ];

  try {
    if (Window_BattleLog && Window_BattleLog.prototype) {
      _APRB_OVERRIDE_WATCH_TARGETS.push(
        [Window_BattleLog.prototype, 'wait'],
        [Window_BattleLog.prototype, 'waitForAnimation'],
        [Window_BattleLog.prototype, 'waitForMovement'],
        [Window_BattleLog.prototype, 'setWaitCount'],
        [Window_BattleLog.prototype, 'updateWaitCount'],
      );
    }
  } catch (e) {}

  function _aprbOverrideStack() {
    try { return (new Error('APRB_OVERRIDE')).stack || ''; } catch (e) { return ''; }
  }

  function _aprbOverrideExtractJsLine(stack) {
    // Try to extract the first *.js:line hint (NW.js/Chromium stack format)
    const s = String(stack || '');
    const lines = s.split(/\n+/);
for (const ln of lines) {
      const m = ln.match(/([A-Za-z0-9_\-\.\/\\]+\.js):(\d+):(\d+)/);
      if (m) return m[1] + ':' + m[2];
    }
    return '';
  }

  function _aprbInstallOverrideWatch() {
    if (!_APRB_DEBUG_ENABLED) return;
    const w = (typeof window !== 'undefined') ? window : globalThis;
    if (w.__APRB_OVERRIDE_WATCH_INSTALLED) return;
    w.__APRB_OVERRIDE_WATCH_INSTALLED = true;

    if (!w.__APRB_OVERRIDE_WATCH_STATE) w.__APRB_OVERRIDE_WATCH_STATE = {};
    const state = w.__APRB_OVERRIDE_WATCH_STATE;

    // Enforce APRB wrapper for Scene_Battle.update so we can detect early returns reliably.
    function _aprbWrapSceneBattleUpdate(fn) {
      try {
        if (!fn || fn.__APRB_SCENE_UPDATE_WRAPPED) return fn;
        const wrapped = function() {
          _aprbLogVersionOnce();
          const w2 = (typeof window !== 'undefined') ? window : globalThis;
          w2.__APRB_BM_CALLED_THIS_FRAME = false;
          // call original
          const ret = fn.apply(this, arguments);

          // APRB FORCE: ensure BattleManager.update is called at least once per frame in battle.
          // Some combinations (e.g. battle wait / spriteset busy) can bypass BM.update and stall TPB state transitions.
          try {
            const scene = this;
            const fc = (Graphics && Graphics.frameCount != null) ? Graphics.frameCount : 0;
            if (SceneManager && SceneManager._scene === scene && scene instanceof Scene_Battle) {
              const inBattle = ($gameParty && $gameParty.inBattle && $gameParty.inBattle());
              if (inBattle && typeof BattleManager !== "undefined" && BattleManager && BattleManager.update && !w2.__APRB_BM_CALLED_THIS_FRAME) {
                if (w2.__APRB_FORCE_BM_GUARD_FC !== fc) {
                  w2.__APRB_FORCE_BM_GUARD_FC = fc;
                  // Mark as called before invoking to prevent recursive double-call patterns.
                  w2.__APRB_BM_CALLED_THIS_FRAME = true;
                  const sprBusy = scene._spriteset && scene._spriteset.isBusy ? !!scene._spriteset.isBusy() : null;
                  const logBusy = scene._logWindow && scene._logWindow.isBusy ? !!scene._logWindow.isBusy() : null;
                  _aprbDbg('[APRB][FORCEBM] reason=not-called fc=' + fc + ' sprBusy=' + sprBusy + ' logBusy=' + logBusy);
                  try { BattleManager.update(); } catch (e0) { _aprbDbg('[APRB][FORCEBM] failed ' + (e0 && e0.message ? e0.message : e0)); }
                }
              }
            }
          } catch (e) {}
          // If BattleManager.update wasn't called this frame while in battle, log once per stall window.
          try {
            const scene = this;
            if (SceneManager && SceneManager._scene === scene && scene instanceof Scene_Battle) {
              const fc = Graphics && Graphics.frameCount != null ? Graphics.frameCount : 0;
              // Debounce: only check every 15 frames to avoid spam
              if ((fc % 15) === 0 && !w2.__APRB_BM_CALLED_THIS_FRAME) {
                const key = 'stall_' + String(fc - (fc % 60));
                if (w2.__APRB_LAST_STALL_KEY !== key) {
                  w2.__APRB_LAST_STALL_KEY = key;
                  const logBusy = scene._logWindow && scene._logWindow.isBusy ? !!scene._logWindow.isBusy() : null;
                  const sprBusy = scene._spriteset && scene._spriteset.isBusy ? !!scene._spriteset.isBusy() : null;
                  const msgBusy = scene._messageWindow && scene._messageWindow.isBusy ? !!scene._messageWindow.isBusy() : null;
                  const interp = $gameTroop && $gameTroop._interpreter ? ($gameTroop._interpreter.isRunning ? !!$gameTroop._interpreter.isRunning() : null) : null;
                  const phase = BattleManager ? BattleManager._phase : null;
                  const subject = BattleManager && BattleManager._subject ? BattleManager._subject.name ? BattleManager._subject.name() : BattleManager._subject.constructor.name : null;
                  const st = (new Error('aprb_scene_update')).stack;
                  _aprbHaltLog('[APRB-HALT][BM-NOT-CALLED] phase=' + phase + ' logBusy=' + logBusy + ' sprBusy=' + sprBusy + ' msgBusy=' + msgBusy + ' interp=' + interp + ' subject=' + subject);
                  if (st) _aprbHaltLog('[APRB-HALT][BM-NOT-CALLED] stack=' + String(st).split(/\n+/).slice(0,6).join(' | '));
                }
              }
            }
          // APRB ActionEndDelay fallback: if other plugins bypass BattleManager.endAction,
          // arm the delay when the battle spriteset finishes being busy.
          try {
            const inBattle = ($gameParty && $gameParty.inBattle && $gameParty.inBattle());
            if (inBattle && typeof BattleManager !== "undefined" && BattleManager && BattleManager._aprbPlayerActionWaitEnd) {
              const sprBusyNow = !!(this && this._spriteset && this._spriteset.isBusy && this._spriteset.isBusy());
              if (!sprBusyNow) {
                const cfg3 = APRB_getActionEndDelayConfig();
                const ceId3 = APRB_getActionEndDelayCommonEventId();
                const fr3 = Math.max(0, Number(cfg3 && cfg3.frames || 0));
                if (cfg3 && cfg3.enabled && ceId3 > 0) {
                  if (fr3 > 0) {
                    BattleManager._aprbActionEndDelayTimer = fr3;
                    if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE] arm(fallback-spriteset) frames=${fr3} ce=${ceId3}`);
                  } else {
                    APRB_queueCommonEvent(ceId3, "ActionEndDelay(fallback)");
                    if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE] fire(fallback-spriteset) -> queue CE ${ceId3}`);
                  }
                }
                BattleManager._aprbPlayerActionWaitEnd = false;
              }
            }
          } catch (e) {}

          // APRB fallback: progress frame-based systems even if BattleManager.update is bypassed by other plugins.
          try {
            const w3 = (typeof window !== 'undefined') ? window : globalThis;
            const bmCalled = !!(w3 && w3.__APRB_BM_CALLED_THIS_FRAME);
            if (!bmCalled) {
              // Battle-only guard
              const inBattle = (typeof $gameParty !== "undefined" && $gameParty && $gameParty.inBattle && $gameParty.inBattle());
              if (inBattle && typeof BattleManager !== "undefined" && BattleManager) {
                // Drive delayed common + state keep frames by graphics frame (APRB_processTbpFrameProgress has its own once-per-frame guard)
                try { APRB_AED_update("Scene_Battle.update/fallback"); } catch (e0) {}
                try { APRB_processTbpFrameProgress(BattleManager); } catch (e1) {}
              }
            }
          } catch (e) {}

          } catch (e) {}
          return ret;
        };
        wrapped.__APRB_SCENE_UPDATE_WRAPPED = true;
        wrapped.__APRB_SCENE_UPDATE_ORIG = fn;
        return wrapped;
      } catch (e) { return fn; }
    }

    function _aprbEnsureSceneBattleUpdateWrapped(obj, prop) {
      try {
        if (!Scene_Battle || obj !== Scene_Battle.prototype || prop !== 'update') return;
        const cur = obj[prop];
        const wcur = _aprbWrapSceneBattleUpdate(cur);
        if (wcur !== cur) obj[prop] = wcur;
      } catch (e) {}
    }

    function logDetected(phase, objName, prop, prevFn, nextFn, stack) {
      const hint = _aprbOverrideExtractJsLine(stack);
      _aprbDbg('[APRB][OVERRIDE] ' + phase + ' target=' + objName + '.' + prop + (hint ? (' by=' + hint) : ''));
      // Also log the first few stack lines for full context (kept short)
      if (stack) {
        const lines = String(stack).split(/\n+/).slice(0, 8).join(' | ');
        _aprbDbg('[APRB][OVERRIDE] stack=' + lines);
      }
      try {
        // mirror to console for readability when DevTools is open
        if (console && console.warn) console.warn('[APRB][OVERRIDE]', phase, objName + '.' + prop, hint, stack);
      } catch (e) {}
    }

    function objLabel(obj) {
      if (obj === BattleManager) return 'BattleManager';
      try {
        if (Window_BattleLog && obj === Window_BattleLog.prototype) return 'Window_BattleLog.prototype';
      try { if (Scene_Battle && obj === Scene_Battle.prototype) return 'Scene_Battle.prototype'; } catch (e) {}
      } catch (e) {}
      return (obj && obj.constructor && obj.constructor.name) ? obj.constructor.name : 'Object';
    }

    // Install setter-based interceptors where possible.
    for (const [obj, prop] of _APRB_OVERRIDE_WATCH_TARGETS) {
      const key = objLabel(obj) + '.' + prop;
      if (state[key] && state[key].installed) continue;

      let current;
      try { current = obj[prop]; } catch (e) { current = undefined; }
      state[key] = state[key] || {};
      state[key].installed = false;
      state[key].baseline = current;
      state[key].lastSeen = current;

      try {
        const desc = Object.getOwnPropertyDescriptor(obj, prop);
        // If non-configurable, we cannot intercept assignments; use fallback compare.
        if (desc && desc.configurable === false) throw new Error('non-configurable');

        let val = current;
        Object.defineProperty(obj, prop, {
          configurable: true,
          enumerable: desc ? !!desc.enumerable : true,
          get() { return val; },
          set(next) {
            const prev = val;
            if (prev !== next) {
              const st = _aprbOverrideStack();
              logDetected('SET', objLabel(obj), prop, prev, next, st);
            }
            val = next;
            _aprbEnsureSceneBattleUpdateWrapped(obj, prop);
            state[key].lastSeen = next;
          }
        });
        state[key].installed = true;
      } catch (e) {
        // Fallback: cannot defineProperty here.
        state[key].installed = false;
        _aprbDbg('[APRB][OVERRIDE] watch-fallback target=' + key + ' reason=' + (e && e.message ? e.message : String(e)));
      }
    }

        try { if (Scene_Battle && Scene_Battle.prototype) _aprbEnsureSceneBattleUpdateWrapped(Scene_Battle.prototype, 'update'); } catch (e) {}

// Periodic diff check (catches overrides when defineProperty wasn't possible)
    state._tick = 0;
    const _bmUpdate = BattleManager.update;
    BattleManager.update = function() {
      try {
        state._tick = (state._tick || 0) + 1;
        if ((state._tick % 30) === 0) {
          for (const [obj, prop] of _APRB_OVERRIDE_WATCH_TARGETS) {
            const k = objLabel(obj) + '.' + prop;
            const stt = state[k];
            if (!stt) continue;
            let now;
            try { now = obj[prop]; } catch (e) { now = undefined; }
            if (stt.lastSeen !== now) {
              const stack = _aprbOverrideStack();
              logDetected('DIFF', objLabel(obj), prop, stt.lastSeen, now, stack);
              stt.lastSeen = now;
            }
          }
        }
      } catch (e) {}
      return _bmUpdate.apply(this, arguments);
    };

    _aprbDbg('[APRB][OVERRIDE] watch-installed targets=' + _APRB_OVERRIDE_WATCH_TARGETS.length);
  }


  // Install Override Watch as early as possible (debug only)
  try { _aprbInstallOverrideWatch(); } catch (e) {}

  // Mark BattleManager.update called each frame (for stall detection in Scene_Battle.update wrapper)
  (function(){
    try {
      const _bmUpdate_aprb = BattleManager.update;
      if (_bmUpdate_aprb && !_bmUpdate_aprb.__APRB_MARKS_CALLED) {
        BattleManager.update = function() {
          try {
            const w = (typeof window !== 'undefined') ? window : globalThis;
            w.__APRB_BM_CALLED_THIS_FRAME = true;
          } catch (e) {}
          return _bmUpdate_aprb.apply(this, arguments);
        };
        BattleManager.update.__APRB_MARKS_CALLED = true;
        BattleManager.update.__APRB_ORIG = _bmUpdate_aprb;
      }
    } catch (e) {}
  })();



// ================================================================
// [v2.0.90] BBW No-Wait Mode (attack/guard) - override-proof
//  - When BBW frames for current kind is 0, treat BattleLog as never busy.
//  - This matches "no stop at all" behavior, without affecting skill/item unless configured.
// ================================================================
(function(){
  const _APRB_WBL_isBusy = Window_BattleLog.prototype.isBusy;

  function _aprbGetScene() {
    return (typeof SceneManager !== 'undefined') ? SceneManager._scene : null;
  }

  function APRB_isNoWaitNow() {
    // Need BBW enabled and set to 0 for the current kind.
    if (typeof APRB_isBBWAnyEnabled === 'function' && !APRB_isBBWAnyEnabled()) return false;

    const kind = BattleManager._aprbBbwLastIssuedKind;
    const frames = (typeof APRB_getBBWFramesForKind === 'function') ? APRB_getBBWFramesForKind(kind) : null;
    if (frames !== 0) return false;

    // Only for player actor actions; do not affect enemies.
    const subject = BattleManager._subject;
    if (!subject || !subject.isActor || !subject.isActor()) return false;

    // During menu/input windows, we allow normal busy handling so timings don't break.
    const scene = _aprbGetScene();
    if (scene && scene._rt_menuMode) return false;

    return true;
  }

  Window_BattleLog.prototype.isBusy = function() {
    if (APRB_isNoWaitNow()) {
      if (DEBUG_LOG) console.log(`[APRB][BBW] noWait isBusy=false kind=${BattleManager._aprbBbwLastIssuedKind}`);
      return false;
    }
    return _APRB_WBL_isBusy.call(this);
  };
})();

})();



// ============================================================================
// v2.0.90: keke_SpeedStarBattle「基本バトルウェイト」挙動の本命移植（行動別）
// 目的: 攻撃/防御/スキル/アイテムごとに「止めない(=0)」を“戦闘進行レイヤ”で保証する。
// 方針:
//  - Window_BattleLog 側の wait 系だけでなく、BattleManager.isBusy() を行動別にバイパスする。
//  - BBW(行動別)が有効かつフレーム=0の間だけ、BattleManager.isBusy() を false とみなす。
//  - 併せて BattleLog.wait / waitForMovement / waitForAnimation を行動別に無効化（keke同様）。
//  - 既存機能・既存パラメータ削除なし（挙動変更は BBW=0 をONにした行動のみ）。
// ============================================================================
(function() {
  if (typeof BattleManager === "undefined") return;

  // --- helper: current BBW kind (prefer running action; fallback to last issued kind) ---
  function aprbBBW_getKindNow() {
    try {
      // running action (most reliable when available)
      if (BattleManager._action && BattleManager._action.item) {
        const item = BattleManager._action.item();
        if (item) {
          if (DataManager && DataManager.isSkill && DataManager.isSkill(item)) {
            const atkId = Game_BattlerBase.prototype.attackSkillId();
            const grdId = Game_BattlerBase.prototype.guardSkillId();
            if (item.id === atkId) return "attack";
            if (item.id === grdId) return "guard";
            return "skill";
          }
          if (DataManager && DataManager.isItem && DataManager.isItem(item)) return "item";
        }
      }
    } catch (e) {}

    // fallback: APRB recorded kind (icon / command)
    try { if (BattleManager._aprbActionKindForWait) return BattleManager._aprbActionKindForWait; } catch (e) {}
    try { if (BattleManager._aprbBbwLastIssuedKind) return BattleManager._aprbBbwLastIssuedKind; } catch (e) {}
    try { if (BattleManager._aprbLastCommandKind) return BattleManager._aprbLastCommandKind; } catch (e) {}
    return null;
  }

  function aprbBBW_framesForKind(kind) {
    try {
      // Prefer existing function if present (keeps compatibility with earlier BBW section)
      if (typeof APRB_getBBWFramesForKind === "function") return APRB_getBBWFramesForKind(kind);
    } catch (e) {}
    try {
      // Or use existing internal helper if present
      if (typeof aprbBasicBattleWaitFrames === "function") return aprbBasicBattleWaitFrames(kind);
    } catch (e) {}
    return null;
  }

  function aprbBBW_noWaitNow() {
    const kind = aprbBBW_getKindNow();
    const frames = aprbBBW_framesForKind(kind);
    return frames === 0;
  }

  // --- record last issued kind from standard battle commands (window-based) ---
  if (typeof Scene_Battle !== "undefined" && Scene_Battle.prototype) {
    function mark(kind) {
      try { BattleManager._aprbBbwLastIssuedKind = kind; } catch (e) {}
      try { BattleManager._aprbLastCommandKind = kind; } catch (e) {}
      if (typeof APRB_DEBUG_LOG !== "undefined" && APRB_DEBUG_LOG) {
        try { console.log(`[APRB][BBW] issued kind=${kind}`); } catch (e) {}
      }
    }

    const _cmdAtk = Scene_Battle.prototype.commandAttack;
    if (_cmdAtk && !_cmdAtk.__aprb_bbw_marked) {
      Scene_Battle.prototype.commandAttack = function() { mark("attack"); return _cmdAtk.apply(this, arguments); };
      Scene_Battle.prototype.commandAttack.__aprb_bbw_marked = true;
    }
    const _cmdGrd = Scene_Battle.prototype.commandGuard;
    if (_cmdGrd && !_cmdGrd.__aprb_bbw_marked) {
      Scene_Battle.prototype.commandGuard = function() { mark("guard"); return _cmdGrd.apply(this, arguments); };
      Scene_Battle.prototype.commandGuard.__aprb_bbw_marked = true;
    }
    const _cmdSkl = Scene_Battle.prototype.commandSkill;
    if (_cmdSkl && !_cmdSkl.__aprb_bbw_marked) {
      Scene_Battle.prototype.commandSkill = function() { mark("skill"); return _cmdSkl.apply(this, arguments); };
      Scene_Battle.prototype.commandSkill.__aprb_bbw_marked = true;
    }
    const _cmdItm = Scene_Battle.prototype.commandItem;
    if (_cmdItm && !_cmdItm.__aprb_bbw_marked) {
      Scene_Battle.prototype.commandItem = function() { mark("item"); return _cmdItm.apply(this, arguments); };
      Scene_Battle.prototype.commandItem.__aprb_bbw_marked = true;
    }
  }

  // --- BattleManager.isBusy() bypass (keke的“止めない”の核) ---
  const _BM_isBusy_BBW90 = BattleManager.isBusy;
  if (_BM_isBusy_BBW90 && !_BM_isBusy_BBW90.__aprb_bbw90_wrapped) {
    BattleManager.isBusy = function() {
      // BBW=0 を有効化した行動中だけ、busy を無視してフェーズを進める
      // (waitCount / BattleLog methods / animation playing を含む“止まり”を突破する)
      if (aprbBBW_noWaitNow()) {
        if (typeof APRB_DEBUG_LOG !== "undefined" && APRB_DEBUG_LOG) {
          const kind = aprbBBW_getKindNow();
          // スパム抑制: kindが変わったときだけ
          if (this._aprbBbw90LastBusyBypass !== kind) {
            this._aprbBbw90LastBusyBypass = kind;
            try { console.log(`[APRB][BBW] bypass BattleManager.isBusy kind=${kind || "none"} (frames=0)`); } catch (e) {}
          }
        }
        return false;
      }
      return _BM_isBusy_BBW90.apply(this, arguments);
    };
    BattleManager.isBusy.__aprb_bbw90_wrapped = true;
  }

  // --- Window_BattleLog wait family: per-action disable when frames=0 (keke同様) ---
  if (typeof Window_BattleLog !== "undefined" && Window_BattleLog.prototype) {
    const wbl = Window_BattleLog.prototype;

    const _w_wait = wbl.wait;
    if (_w_wait && !_w_wait.__aprb_bbw90_wrapped) {
      wbl.wait = function() {
        if (aprbBBW_noWaitNow()) return;
        return _w_wait.apply(this, arguments);
      };
      wbl.wait.__aprb_bbw90_wrapped = true;
    }

    const _w_wfm = wbl.waitForMovement;
    if (_w_wfm && !_w_wfm.__aprb_bbw90_wrapped) {
      wbl.waitForMovement = function() {
        if (aprbBBW_noWaitNow()) return;
        return _w_wfm.apply(this, arguments);
      };
      wbl.waitForMovement.__aprb_bbw90_wrapped = true;
    }

    const _w_wfa = wbl.waitForAnimation;
    if (_w_wfa && !_w_wfa.__aprb_bbw90_wrapped) {
      wbl.waitForAnimation = function() {
        if (aprbBBW_noWaitNow()) return;
        return _w_wfa.apply(this, arguments);
      };
      wbl.waitForAnimation.__aprb_bbw90_wrapped = true;
    }
  }

  // --- cleanup: endAction clears last-issued kind (avoid affecting next unrelated waits) ---
  const _BM_endAction_BBW90 = BattleManager.endAction;
  if (_BM_endAction_BBW90 && !_BM_endAction_BBW90.__aprb_bbw90_wrapped) {
    BattleManager.endAction = function() {
      const r = _BM_endAction_BBW90.apply(this, arguments);
      try { this._aprbBbw90LastBusyBypass = null; } catch (e) {}
      try { this._aprbBbwLastIssuedKind = null; } catch (e) {}
      try { this._aprbLastCommandKind = null; } catch (e) {}
  // ActionEndDelay: if the just-finished action involved the controlled actor, start timer
  try {
    const cfg = APRB_getActionEndDelayConfig();
    if (cfg && cfg.enabled) {
      let involved = !!this._aprbLastActionInvolvedPlayer;
      // Fallback: if the subject is an actor, treat as involved (prevents false negatives when other plugins alter target lists).
      if (!involved) {
        try { if (this._subject && this._subject.isActor && this._subject.isActor()) involved = true; } catch (e0) {}
      }
      if (involved) {
        const fr = Math.max(0, Number(cfg.frames || 0));
        const ceId = APRB_getActionEndDelayCommonEventId();
        if (fr > 0 && ceId > 0) {
          this._aprbActionEndDelayTimer = fr;
          if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE] arm timer frames=${fr} ce=${ceId}`);
        } else if (fr === 0 && ceId > 0) {
  // immediate (queued)
  APRB_queueCommonEvent(ceId, "ActionEndDelayImmediate");
  if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE] immediate -> queue CE ${ceId}`);
}}
    }
  } catch (e) {}

  return r;
};
    BattleManager.endAction.__aprb_bbw90_wrapped = true;
  }
})();



/* ======================================================================
 * APRB v2.0.96-dbgdump PATCH: BBW(攻撃/防御)の「止まり」原因の最終担保 + 停滞検知
 *  - 目的: Scene_Battle.update が他プラグインの interpreter / return により BattleManager.update を呼ばないケースでも、
 *          BBW=0(攻撃/防御)中は BattleManager進行を必ず回す（=kekeのBBW寄り挙動）
 *  - 既存機能/パラメータ削除なし
 * ====================================================================== */
(() => {
  "use strict";
  const TAG = "[APRB-HALT]";
  const _log = (s) => { try { if (typeof _aprbDbg === "function") _aprbDbg(`${TAG} ${s}`); else console.log(`${TAG} ${s}`); } catch(e){ console.log(`${TAG} ${s}`); } };

  // --- Helper: BBW=0対象（攻撃/防御）か？（スキル/アイテムは対象外）
  function _aprbIsBbwZeroAttackGuard() {
    try {
      // Phaseがactionでない瞬間でも、直前に「攻撃/防御」を入力していればBB​​W=0判定を維持する（割り込み/ラップreturn対策）
      const nowF = (Graphics && Graphics.frameCount) || 0;
      const lastKind = BattleManager && BattleManager._aprbBbwLastIssuedKind;
      const lastF = BattleManager && (BattleManager._aprbBbwLastIssuedFrame ?? -999999);
      const recent = (nowF - lastF) <= 180;
      if (recent) {
        if (lastKind === "attack" && BBW_ATTACK_ENABLED && BBW_ATTACK_FRAMES === 0) return true;
        if (lastKind === "guard"  && BBW_GUARD_ENABLED  && BBW_GUARD_FRAMES  === 0) return true;
      }
      if (!BattleManager || BattleManager._phase !== "action") return false;
      const action = BattleManager._action;
      const subject = BattleManager._subject;
      if (!action || !subject) return false;
      const item = action.item && action.item();
      // itemが取れない瞬間は「攻撃/防御の可能性が高い」ので subject の入力由来も見る
      const isSkill = item && DataManager && DataManager.isSkill && DataManager.isSkill(item);
      const isItem  = item && DataManager && DataManager.isItem  && DataManager.isItem(item);
      if (isSkill || isItem) return false;
      // 攻撃/防御判定（MZ標準: attackSkillId / guardSkillId）
      const attackId = ($dataSystem && $dataSystem.attackSkillId) || 1;
      const guardId  = ($dataSystem && $dataSystem.guardSkillId)  || 2;
      const sid = item && item.id;
      const isAtk = sid === attackId;
      const isGrd = sid === guardId;
      // item不明の瞬間は「直前行動コンテキスト」があればそこを見る（APRBの既存仕組みを壊さない）
      if (!item) {
        if (BattleManager._aprbLastKnownActionKind === "attack" || BattleManager._aprbLastKnownActionKind === "guard") return true;
      }
      // ここで「BBW=0」が有効化されているか（設定が 0 であること）
      // 既存実装のフラグがあればそれを最優先。無ければ「attack/guardのBBW=0設定」を信頼。
      const cfgAtkZero = (typeof APRB_BBW_ATTACK_COUNT === "number") ? (APRB_BBW_ATTACK_COUNT === 0) : true;
      const cfgGrdZero = (typeof APRB_BBW_GUARD_COUNT  === "number") ? (APRB_BBW_GUARD_COUNT  === 0) : true;
      return (isAtk && cfgAtkZero) || (isGrd && cfgGrdZero);
    } catch (e) {
      return false;
    }
  }

  // --- BattleManager.update が呼ばれたフレームを記録
  if (BattleManager && BattleManager.update) {
    const _BM_update = BattleManager.update;
    BattleManager.update = function(...args) {
      BattleManager._aprbBmUpdatedFrame = Graphics.frameCount;
      return _BM_update.apply(this, args);
    };
  }

  // --- Scene_Battle.update で「BattleManager.update が呼ばれていない停滞」を検知し、BBW=0(攻撃/防御)中は強制進行
  if (Scene_Battle && Scene_Battle.prototype.update) {
    const _SB_update = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function(...args) {
      const beforeFrame = Graphics.frameCount;
      const beforeBmFrame = BattleManager ? BattleManager._aprbBmUpdatedFrame : -1;

      // まず通常update（他プラグインのreturnがあっても、ここが先に呼ばれるようAPRBを末尾に置くのが理想だが、念のため担保）
      const r = _SB_update.apply(this, args);

      // このフレームで BattleManager.update が動いていないなら、原因候補を列挙
      const afterBmFrame = BattleManager ? BattleManager._aprbBmUpdatedFrame : -1;
      const bmNotUpdatedThisFrame = (afterBmFrame !== beforeFrame);

      // 「止まった」＝毎フレームupdateは回るが BMが回らない / 進行しない 典型を検知
      if (bmNotUpdatedThisFrame) {
        // 連続回数カウント
        this._aprbBmSkipCount = (this._aprbBmSkipCount || 0) + 1;

        const inBbw0 = _aprbIsBbwZeroAttackGuard();
        const skipN = this._aprbBmSkipCount;

        // 2フレーム以上続いたらログ（1回だけ/間引き）
        if (skipN === 2 || (skipN % 60 === 0)) {
          const lw = BattleManager && BattleManager._logWindow;
          const ss = BattleManager && BattleManager._spriteset;
          const iw = this._interpreter;
          const reasons = [];
          try { if (lw && lw.isBusy && lw.isBusy()) reasons.push("logWindow.isBusy"); } catch(e){}
          try { if (ss && ss.isBusy && ss.isBusy()) reasons.push("spriteset.isBusy"); } catch(e){}
          try { if (BattleManager && BattleManager.isBusy && BattleManager.isBusy()) reasons.push("BattleManager.isBusy"); } catch(e){}
          try { if (iw && iw.isRunning && iw.isRunning()) reasons.push("sceneInterpreter.isRunning"); } catch(e){}
          try { if (BattleManager && BattleManager._phase) reasons.push(`phase=${BattleManager._phase}`); } catch(e){}
          _log(`BM-SKIP cnt=${skipN} bbw0AtkGrd=${inBbw0} reasons=[${reasons.join(",")}]`);
        }

        // BBW=0攻撃/防御中は「BMが呼ばれてない」こと自体が不具合なので、ここで強制的にBMを回す
        if (inBbw0 && BattleManager && BattleManager.update) {
          // 再帰防止
          if (!this._aprbForceBmGuard) {
            this._aprbForceBmGuard = true;
            try {
              BattleManager._aprbForceUpdateFromScene = true;
              BattleManager.update();
              BattleManager._aprbBmUpdatedFrame = Graphics.frameCount;
              _log(`FORCE BattleManager.update() from Scene_Battle.update`);
            } catch (e) {
              _log(`FORCE BattleManager.update() FAILED: ${e && e.message}`);
            } finally {
              BattleManager._aprbForceUpdateFromScene = false;
              this._aprbForceBmGuard = false;
            }
          }
        }
      } else {
        this._aprbBmSkipCount = 0;
      }

      return r;
    };
  }


  // ========================================================================
  // v2.0.97: Stop-detect watchdog (even if BattleManager.update is skipped)
  // - Adds a pulse counter to BattleManager.update
  // - In SceneManager.updateScene, if we are in battle and BBW=0(attack/guard) is expected
  //   but BattleManager.update wasn't called for N frames, emit [APRB-HALT] with all reasons.
  // NOTE: dbg build only; does not remove any features/params.
  // ========================================================================
  (function() {
    try {
      if (typeof BattleManager !== "undefined" && BattleManager && !BattleManager._aprbPulseWrapped97) {
        BattleManager._aprbPulseWrapped97 = true;
        const _BM_update_97 = BattleManager.update;
        BattleManager.update = function() {
          this._aprbBmUpdateTick = (this._aprbBmUpdateTick || 0) + 1;
          return _BM_update_97.apply(this, arguments);
        };
      }

      if (typeof SceneManager !== "undefined" && SceneManager && !SceneManager._aprbWatchdogWrapped97) {
        SceneManager._aprbWatchdogWrapped97 = true;

        const TAG = "[APRB-HALT]";
        const _SM_updateScene_97 = SceneManager.updateScene;
        SceneManager.updateScene = function() {
          const sceneBefore = this._scene;
          const bmTickBefore = (typeof BattleManager !== "undefined" && BattleManager) ? (BattleManager._aprbBmUpdateTick || 0) : 0;

          const ret = _SM_updateScene_97.apply(this, arguments);

          const scene = this._scene;
          // Only monitor during active battle scene
          if (scene && (scene.constructor && scene.constructor.name === "Scene_Battle")) {
            SceneManager._aprbWdSameBmTick = SceneManager._aprbWdSameBmTick || 0;

            const bmTickAfter = (typeof BattleManager !== "undefined" && BattleManager) ? (BattleManager._aprbBmUpdateTick || 0) : 0;
            const bmNotCalledThisFrame = (bmTickAfter === bmTickBefore);
            // If BBW=0 (attack/guard) expects "never stop", force-run BattleManager.update when it was not called this frame.
            // This is the key behavior of keke_SpeedStarBattle's Basic Battle Wait: progress battle logic even if Scene_Battle.updateBattleProcess was skipped by other plugins.
            if (bbw0 && bmNotCalledThisFrame) {
              try {
                // Prevent accidental double-call loops
                if (!SceneManager._aprbForceBmThisFrame) SceneManager._aprbForceBmThisFrame = 0;
                if (SceneManager._aprbForceBmThisFrame < ((Graphics && Graphics.frameCount) || 0)) {
                  SceneManager._aprbForceBmThisFrame = (Graphics && Graphics.frameCount) || 0;
                  if (typeof BattleManager !== "undefined" && BattleManager && BattleManager.update) {
                    BattleManager.update();
                    try {
                      const ph = (BattleManager && BattleManager._phase) || "";
                      const sprBusy = !!(scene && scene._spriteset && scene._spriteset.isBusy && scene._spriteset.isBusy());
                      const logBusy = !!(scene && scene._logWindow && scene._logWindow.isBusy && scene._logWindow.isBusy());
                      _aprbDbgForce(TAG + "[FORCE-BM] v=" + _APRB_VERSION + " phase=" + ph + " logBusy=" + logBusy + " sprBusy=" + sprBusy);
                    } catch(e) {
                      _aprbDbgForce(TAG + "[FORCE-BM] v=" + _APRB_VERSION);
                    }
                  }
                }
              } catch(e) {}
            }


            // BBW=0 expectation (attack/guard only)
            var bbw0 = false;
            try { if (typeof _aprbIsBbwZeroAttackGuard === "function") bbw0 = !!_aprbIsBbwZeroAttackGuard(); } catch(e) { bbw0 = false; }

            if (bbw0 && bmNotCalledThisFrame) {
              SceneManager._aprbWdSameBmTick++;
            } else {
              SceneManager._aprbWdSameBmTick = 0;
            }

            // When it looks like "stopped" (BM not called) for 30 frames, dump all reasons.
            if (SceneManager._aprbWdSameBmTick === 30 || SceneManager._aprbWdSameBmTick === 60 || SceneManager._aprbWdSameBmTick === 120) {
              const reasons = [];
              try {
                // Interpreter / troop events
                if (scene._interpreter && scene._interpreter.isRunning && scene._interpreter.isRunning()) reasons.push("Scene._interpreter.isRunning");
              } catch(e) {}
              try {
                if (typeof $gameTroop !== "undefined" && $gameTroop && $gameTroop._interpreter && $gameTroop._interpreter.isRunning && $gameTroop._interpreter.isRunning()) reasons.push("$gameTroop._interpreter.isRunning");
              } catch(e) {}
              try {
                // Log / spriteset busy
                if (scene._logWindow && scene._logWindow.isBusy && scene._logWindow.isBusy()) reasons.push("logWindow.isBusy");
              } catch(e) {}
              try {
                if (scene._spriteset && scene._spriteset.isBusy && scene._spriteset.isBusy()) reasons.push("spriteset.isBusy");
              } catch(e) {}
              try {
                // Message window (rare in battle)
                if (typeof $gameMessage !== "undefined" && $gameMessage && $gameMessage.isBusy && $gameMessage.isBusy()) reasons.push("$gameMessage.isBusy");
              } catch(e) {}

              let phase = "";
              try { phase = (typeof BattleManager !== "undefined" && BattleManager) ? (BattleManager._phase || "") : ""; } catch(e) {}
              const msg = `${TAG} BM-NOT-CALLED frames=${SceneManager._aprbWdSameBmTick} phase=${phase} reasons=${JSON.stringify(reasons)}`;
              try { console.log(msg); } catch(e) {}
              try {
                if (typeof _aprbDbg === "function") _aprbDbg(msg);
                else if (typeof BattleManager !== "undefined" && BattleManager && BattleManager._aprbDebugBuffer) BattleManager._aprbDebugBuffer.push(msg);
              } catch(e) {}
            }
          }

          return ret;
        };
      }
    } catch(e) {
      // fail safe
      try { console.warn("[APRB] watchdog init failed", e); } catch(_) {}
    }
  })();



  // ============================================================
  // SceneManager-level BM force (BBW0 Attack/Guard)
  //   - Some plugins (e.g. InvokeCommon) can early-return Scene_Battle.update,
  //     which prevents BattleManager.update from being called at all.
  //   - For BBW=0 Attack/Guard, we must keep battle flow progressing.
  // ============================================================
  (function() {
    const APRB_VER = "v2.1.07-dbgdump";
    const st = (window.__APRB_BM_FORCE_STATE__ ||= { bmCalled: false, lastForceFrame: -1 });

    // Mark "BM called this frame"
    if (!BattleManager._aprbBmForceWrapped) {
      BattleManager._aprbBmForceWrapped = true;
      const _BM_update = BattleManager.update;
      BattleManager.update = function() {
        st.bmCalled = true;
        return _BM_update.apply(this, arguments);
      };
    }

    // Force-call BM.update after SceneManager.updateScene when needed
    if (!SceneManager._aprbBmForceWrapped) {
      SceneManager._aprbBmForceWrapped = true;
      const _SM_updateScene = SceneManager.updateScene;
      SceneManager.updateScene = function() {
        st.bmCalled = false;
        const r = _SM_updateScene.apply(this, arguments);

        try {
          if ($gameParty && $gameParty.inBattle && $gameParty.inBattle()) {
            const scene = this._scene;
            const isBattle = !!scene && (scene instanceof Scene_Battle);
            if (isBattle && !st.bmCalled) {
              const frame = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Graphics.frameCount : 0;

              const kind = (BattleManager && (BattleManager._aprbBbwLastIssuedKind || BattleManager._aprbLastCommandKind)) || null;
              const lastFrame = BattleManager && BattleManager._aprbBbwLastIssuedFrame;
              const within = (typeof lastFrame === "number") ? ((frame - lastFrame) <= 120) : false; // 2s @60fps

              var bbw0 = false;
              const bbwFrames = kind ? aprbBasicBattleWaitFrames(kind) : null;
              bbw0 = (bbwFrames === 0) && within && (kind === "attack" || kind === "guard");

              if (bbw0) {
                // Force progression even if Scene_Battle.update was skipped by others
                st.bmCalled = true; // guard for this frame
                BattleManager.update();

                if (st.lastForceFrame !== frame) {
                  st.lastForceFrame = frame;
                  try { _aprbDbg(`[APRB-HALT ${APRB_VER}][FORCE-BM] kind=${kind} phase=${BattleManager._phase}`); } catch (e) {}
                }
              }
            }
          }
        } catch (e) {}

        return r;
      };
    }
  })();


})();

/* === v2.1.07-dbgdump hotfix: BBW0 hold & FORCE-BM even before action phase === */
(function(){
  'use strict';
  const VER = 'v2.1.09-fix6';

  // Shared hold state (attack/guard input -> keep BBW0 intent for a short time)
  var _aprbBbw0HoldFrames = 0;
  var _aprbBbw0HoldKind = null;

  function _aprbSetBbw0Hold(kind, frames){
    _aprbBbw0HoldKind = kind;
    if (frames > _aprbBbw0HoldFrames) _aprbBbw0HoldFrames = frames;
  }

  // Hook commandAttack / commandGuard to catch the user's input moment (before action phase)
  if (typeof BattleManager !== 'undefined' && BattleManager && !BattleManager._aprbBbw0HoldPatched){
    BattleManager._aprbBbw0HoldPatched = true;

    if (typeof BattleManager.commandAttack === 'function'){
      var _aprb_cmdAttack = BattleManager.commandAttack;
      BattleManager.commandAttack = function(){
        _aprbSetBbw0Hold('attack', 120);
        return _aprb_cmdAttack.apply(this, arguments);
      };
    }

    if (typeof BattleManager.commandGuard === 'function'){
      var _aprb_cmdGuard = BattleManager.commandGuard;
      BattleManager.commandGuard = function(){
        _aprbSetBbw0Hold('guard', 120);
        return _aprb_cmdGuard.apply(this, arguments);
      };
    }
  }

  // Track whether BattleManager.update ran in this frame
  var _aprb_lastBmUpdateFrame = -1;
  if (typeof BattleManager !== 'undefined' && BattleManager && typeof BattleManager.update === 'function' && !BattleManager._aprbBmFrameTrackPatched){
    BattleManager._aprbBmFrameTrackPatched = true;
    var _aprb_bmUpdate = BattleManager.update;
    BattleManager.update = function(){
      _aprb_lastBmUpdateFrame = (typeof Graphics !== 'undefined' && Graphics) ? Graphics.frameCount : (_aprb_lastBmUpdateFrame + 1);
      return _aprb_bmUpdate.apply(this, arguments);
    };
  }

  // Watchdog at SceneManager layer: if BM isn't called (due to early return in Scene_Battle.update),
  // and we are in the BBW0 hold window (attack/guard), force BM.update once.
  if (typeof SceneManager !== 'undefined' && SceneManager && typeof SceneManager.updateScene === 'function' && !SceneManager._aprbForceBmPatched206){
    SceneManager._aprbForceBmPatched206 = true;
    var _aprb_updateScene = SceneManager.updateScene;
    SceneManager.updateScene = function(){
      _aprb_updateScene.apply(this, arguments);

      if (_aprbBbw0HoldFrames > 0) _aprbBbw0HoldFrames--;

      var scene = this._scene;
      if (!scene) return;
      if (typeof Scene_Battle !== 'undefined' && !(scene instanceof Scene_Battle)) return;

      var frame = (typeof Graphics !== 'undefined' && Graphics) ? Graphics.frameCount : null;
      if (_aprbBbw0HoldFrames > 0 && frame != null && _aprb_lastBmUpdateFrame !== frame){
        try{
          if (typeof BattleManager !== 'undefined' && BattleManager && typeof BattleManager.update === 'function'){
            BattleManager.update();
          }
          if (typeof console !== 'undefined' && console && typeof console.log === 'function'){
            console.log('[APRB-HALT ' + VER + '][FORCE-BM] kind=' + _aprbBbw0HoldKind + ' phase=' + (BattleManager ? BattleManager._phase : 'null'));
          }
        }catch(e){
          if (typeof console !== 'undefined' && console && typeof console.error === 'function'){
            console.error(e);
          }
        }
      }
    };
  }

  // ============================================================
  // Cinematic controls for Before/After common events
  // Read parameters here as this block may live outside earlier scopes
  const _APRB_PARAM_BC = (function(){
    try { return PluginManager.parameters("APRealtimeBattle_AllInOne") || {}; } catch(e){ return {}; }
  })();
  const BEFORECOMMON_STOPTIME = (_APRB_PARAM_BC["BeforeCommon_StopTime"] ?? "true") === "true";
  const BEFORECOMMON_DISABLE_INPUT = (_APRB_PARAM_BC["BeforeCommon_DisableInput"] ?? "true") === "true";
  const BEFORECOMMON_DEBUGLOG = (_APRB_PARAM_BC["BeforeCommon_DebugLog"] ?? "false") === "true";

  //  - Stop battle time progression (best-effort)
  //  - Disable player inputs (best-effort)
  //  - Optional debug log
  // ============================================================
  function APRB_isCinematicCommonActive() {
    try {
      if (BattleManager && BattleManager._aprbCinematicCommonActive) return true;
      if (BattleManager && BattleManager._aprbCinematicAfterCommonActive) return true;
    } catch (e) {}
    return false;
  }

  // Disable input while cinematic common is active
  const _APRB_SceneBattle_isAnyInputWindowActive = Scene_Battle.prototype.isAnyInputWindowActive;
  Scene_Battle.prototype.isAnyInputWindowActive = function() {
    if (BEFORECOMMON_DISABLE_INPUT && APRB_isCinematicCommonActive()) return false;
    return _APRB_SceneBattle_isAnyInputWindowActive.apply(this, arguments);
  };

  // Also hard-clear input each frame (prevents queued OK/Cancel from leaking)
  const _APRB_SceneBattle_update_Cinematic = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function() {
    if (BEFORECOMMON_DISABLE_INPUT && APRB_isCinematicCommonActive()) {
      // [M.I.P][Fix] Do NOT clear Input here.
      // Clearing Input every frame can prevent Window_Message (show text) / Wait-for-input from receiving OK/Cancel,
      // leading to unskippable messages or soft-locks.
      // Realtime battle inputs are gated separately while cinematic common is active.

    }
    return _APRB_SceneBattle_update_Cinematic.apply(this, arguments);
  };

  
  // [M.I.P][Fix] Also gate realtime inputs while cinematic common is active.
  // This keeps attack/guard/skill/item triggers disabled without blocking message OK/Cancel.
  (function() {
    try {
      const _rt_isInputEnabled = Scene_Battle.prototype._rt_isInputEnabled;
      if (typeof _rt_isInputEnabled === "function" && !_rt_isInputEnabled.__aprb_cinematic_gate) {
        const wrapped = function() {
          try {
            if (BEFORECOMMON_DISABLE_INPUT && APRB_isCinematicCommonActive()) return false;
          } catch (e) {}
          return _rt_isInputEnabled.apply(this, arguments);
        };
        wrapped.__aprb_cinematic_gate = true;
        Scene_Battle.prototype._rt_isInputEnabled = wrapped;
      }
    } catch (e) {}
  })();

// Stop time progression during cinematic common
  const _APRB_BattleManager_update_Cinematic = BattleManager.update;
  BattleManager.update = function() {
    // If cinematic common is active, keep our state machine progressing regardless of StopTime.
    if (APRB_isCinematicCommonActive()) {
      try { if (this.aprbUpdateCinematicCommon) this.aprbUpdateCinematicCommon(); } catch (e) {}
    }

    // If StopTime is ON, freeze battle progression and only advance the common-event interpreter.
    if (BEFORECOMMON_STOPTIME && APRB_isCinematicCommonActive()) {
      try {
        if (this.updateEventMain) this.updateEventMain();
        else if (this.updateEvent) this.updateEvent();
      } catch (e) {}
      // aprbUpdateCinematicCommon() was already called above
      return;
    }

    const r = _APRB_BattleManager_update_Cinematic.apply(this, arguments);

    // If StopTime is OFF, the interpreter runs in normal update flow; still clear flags when it ends.
    if (APRB_isCinematicCommonActive()) {
      try { if (this.aprbUpdateCinematicCommon) this.aprbUpdateCinematicCommon(); } catch (e) {}
    }
    return r;
  };

  // Mark "after common" as cinematic too (post triggers)
  // We don't change existing behavior; just toggle cinematic flag while our reserved CE is running.
  (function(){
    const _reserveCommonEvent = Game_Temp.prototype.reserveCommonEvent;
    Game_Temp.prototype.reserveCommonEvent = function(commonEventId) {
      // If reserved from our plugin triggers, BattleManager may set _aprbCinematicAfterCommonActive just before reserving.
      return _reserveCommonEvent.apply(this, arguments);
    };
  })()

  // Clear after-common cinematic flag when interpreter is idle
  if (BattleManager.updateEventMain) {
    const _APRB_BattleManager_updateEventMain_CE = BattleManager.updateEventMain;
    BattleManager.updateEventMain = function() {
      const r = _APRB_BattleManager_updateEventMain_CE.apply(this, arguments);
      try {
        const running = !!($gameTroop && $gameTroop._interpreter && $gameTroop._interpreter.isRunning && $gameTroop._interpreter.isRunning());
        const reserved = !!($gameTemp && $gameTemp.isCommonEventReserved && $gameTemp.isCommonEventReserved());
        if (!running && !reserved) {
          this._aprbCinematicAfterCommonActive = false;
        }
      } catch (e) {}
      return r;
    };
  }
;


// ============================================================
// Rehook Guard (for plugin overwrite conflicts)
//  - Some environments overwrite BattleManager/updateTpb/endAction or battler state auto-removal after APRB.
//  - We re-apply critical wrappers at runtime (lightweight, idempotent).
// ============================================================
function APRB_rehookFrameFeatures() {
  try {
    // --- KeepFrame wrappers (GBB/GB) ---
    function wrapKeepFrameOn(proto) {
      if (!proto) return;
      // updateStateTurns
      if (proto.updateStateTurns && !proto.updateStateTurns.__aprb_keepframe_wrapped) {
        const _orig = proto.updateStateTurns;
        const _wrapped = function() {
          try {
            if (STATE_KEEPFRAME_TAG_ENABLE && this && this._states && this._states.length) {
              const keep = this._aprbStateKeepFrames || null;
              if (keep) {
                const savedStates = this._states.slice();
                const savedTurns = Object.assign({}, this._stateTurns || {});
                this._states = this._states.filter(id => keep[id] == null);
                const r = _orig.apply(this, arguments);
                this._states = savedStates;
                this._stateTurns = savedTurns;
                return r;
              }
            }
          } catch (e) {}
          return _orig.apply(this, arguments);
        };
        _wrapped.__aprb_keepframe_wrapped = true;
        _wrapped.__aprb_keepframe_orig = _orig;
        proto.updateStateTurns = _wrapped;
      }
      // removeStatesAuto
      if (proto.removeStatesAuto && !proto.removeStatesAuto.__aprb_keepframe_wrapped) {
        const _orig = proto.removeStatesAuto;
        const _wrapped = function(timing) {
          try {
            if (STATE_KEEPFRAME_TAG_ENABLE && this && this._states && this._states.length) {
              const keep = this._aprbStateKeepFrames || null;
              if (keep) {
                const savedStates = this._states.slice();
                const savedTurns = Object.assign({}, this._stateTurns || {});
                this._states = this._states.filter(id => keep[id] == null);
                const r = _orig.apply(this, arguments);
                this._states = savedStates;
                this._stateTurns = savedTurns;
                return r;
              }
            }
          } catch (e) {}
          return _orig.apply(this, arguments);
        };
        _wrapped.__aprb_keepframe_wrapped = true;
        _wrapped.__aprb_keepframe_orig = _orig;
        proto.removeStatesAuto = _wrapped;
      }
    }

    if (typeof Game_BattlerBase !== "undefined" && Game_BattlerBase.prototype) wrapKeepFrameOn(Game_BattlerBase.prototype);
    if (typeof Game_Battler !== "undefined" && Game_Battler.prototype) wrapKeepFrameOn(Game_Battler.prototype);

    // --- BattleManager.updateTpb wrapper (drives TBP-frame progress) ---
    if (BattleManager && BattleManager.updateTpb && !BattleManager.updateTpb.__aprb_tbpframe_wrapped) {
      const _orig = BattleManager.updateTpb;
      const _wrapped = function() {
        try {
          // keep time-stop countdown compatible with existing APRB behavior
          if (this && this._aprbTimeStop && this._aprbTimeStopFrames && this._aprbTimeStopFrames > 0) {
            this._aprbTimeStopFrames--;
            if (this._aprbTimeStopFrames <= 0) {
              this._aprbTimeStopFrames = 0;
              this._aprbTimeStop = false;
            }
          }
        } catch (e) {}
        const progressing = (!!this._aprbSlowRate && Number(this._aprbSlowRate) > 0) && !this._aprbTimeStop;
        const r = _orig.apply(this, arguments);
        if (progressing) { try { APRB_processTbpFrameProgress(this); } catch (e) {} }
        return r;
      };
      _wrapped.__aprb_tbpframe_wrapped = true;
      _wrapped.__aprb_tbpframe_orig = _orig;
      BattleManager.updateTpb = _wrapped;
    }

    // --- BattleManager.startAction wrapper (tracks whether action involved controlled actor) ---
    if (BattleManager && BattleManager.startAction && !BattleManager.startAction.__aprb_actiontrack_wrapped) {
      const _orig = BattleManager.startAction;
      const _wrapped = function() {
        const r = _orig.apply(this, arguments);
        try {
          const ca = (typeof getControlledActor === "function") ? getControlledActor() : null;
          let involved = false;
          if (ca) {
            try { if (this._subject === ca) involved = true; } catch (e) {}
            if (!involved && this._action && this._action.makeTargets) {
              const t0 = this._action.makeTargets();
              if (t0 && t0.length) {
                for (let i = 0; i < t0.length; i++) { if (t0[i] === ca) { involved = true; break; } }
              }
            }
          }
          this._aprbLastActionInvolvedPlayer = !!involved;
        } catch (e) { this._aprbLastActionInvolvedPlayer = false; }
        return r;
      };
      _wrapped.__aprb_actiontrack_wrapped = true;
      _wrapped.__aprb_actiontrack_orig = _orig;
      BattleManager.startAction = _wrapped;
    }

    // --- BattleManager.endAction wrapper (arms delayed common timer) ---
    if (BattleManager && BattleManager.endAction && !BattleManager.endAction.__aprb_actionenddelay_wrapped) {
      const _orig = BattleManager.endAction;
      const _wrapped = function() {
        const r = _orig.apply(this, arguments);
        try {
          const cfg = APRB_getActionEndDelayConfig();
          if (cfg && cfg.enabled) {
            const involved = !!this._aprbLastActionInvolvedPlayer;
            if (involved) {
              const fr = Math.max(0, Number(cfg.frames || 0));
              const ceId = APRB_getActionEndDelayCommonEventId();
              if (fr > 0 && ceId > 0) {
                this._aprbActionEndDelayTimer = fr;
                if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE][rehook] arm timer frames=${fr} ce=${ceId}`);
              } else if (fr === 0 && ceId > 0) {
                APRB_queueCommonEvent(ceId, "ActionEndDelayImmediate(rehook)");
                if (DEBUG_LOG) _aprbDbg(`[APRB][DelayCE][rehook] immediate -> queue CE ${ceId}`);
              }
            }
          }
        } catch (e) {}
        return r;
      };
      _wrapped.__aprb_actionenddelay_wrapped = true;
      _wrapped.__aprb_actionenddelay_orig = _orig;
      BattleManager.endAction = _wrapped;
    }
  } catch (e) {}
}

function APRB_rehookTick() {
  try {
    const bm = BattleManager;
    if (!bm) return;
    const fc = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Number(Graphics.frameCount) : -1;
    if (fc >= 0) {
      if (bm._aprbRehookLastFrame != null && (fc - bm._aprbRehookLastFrame) < 30) return;
      bm._aprbRehookLastFrame = fc;
    }
    APRB_rehookFrameFeatures();
  } catch (e) {}
}

// Run at least once now (after all defs in this file)
try { APRB_rehookFrameFeatures(); } catch (e) {}

// Also run periodically during battle to recover from late overwrites
if (typeof Scene_Battle !== "undefined" && Scene_Battle.prototype && Scene_Battle.prototype.update && !Scene_Battle.prototype.update.__aprb_rehook_wrapped) {
  const _SB_update_APRB_rehook = Scene_Battle.prototype.update;
  Scene_Battle.prototype.update = function() {
    try { APRB_rehookTick(); } catch (e) {}
    return _SB_update_APRB_rehook.apply(this, arguments);
  };
  Scene_Battle.prototype.update.__aprb_rehook_wrapped = true;
}

if (typeof BattleManager !== "undefined" && BattleManager.update && !BattleManager.update.__aprb_rehook_wrapped) {
  const _BM_update_APRB_rehook = BattleManager.update;
  BattleManager.update = function() {
    try { APRB_rehookTick(); } catch (e) {}
    return _BM_update_APRB_rehook.apply(this, arguments);
  };
  BattleManager.update.__aprb_rehook_wrapped = true;
}


// ============================================================
// ActionEnd Delayed Common (hooks) - robust execution path
// ============================================================
(function(){
  // Arm when an action ends (BattleManager path)
  if (typeof BattleManager !== "undefined" && BattleManager.endAction && !BattleManager.endAction.__aprb_aed2_wrapped) {
    const _BM_endAction_AED2 = BattleManager.endAction;
    BattleManager.endAction = function() {
      const r = _BM_endAction_AED2.apply(this, arguments);
      try { APRB_AED_arm("BattleManager.endAction"); } catch (e) {}
      return r;
    };
    BattleManager.endAction.__aprb_aed2_wrapped = true;
  }

  

  // Arm when battle log finishes an action (more reliable than BattleManager.endAction in heavily-modded stacks)
  if (typeof Window_BattleLog !== "undefined" && Window_BattleLog.prototype && Window_BattleLog.prototype.endAction && !Window_BattleLog.prototype.endAction.__aprb_aed2_wrapped) {
    const _WBL_endAction_AED2 = Window_BattleLog.prototype.endAction;
    Window_BattleLog.prototype.endAction = function(subject) {
      const r = _WBL_endAction_AED2.apply(this, arguments);
      try { APRB_AED_arm("Window_BattleLog.endAction"); } catch (e) {}
      return r;
    };
    Window_BattleLog.prototype.endAction.__aprb_aed2_wrapped = true;
  }

// Arm when a battler finishes all actions (fallback)
  if (typeof Game_Battler !== "undefined" && Game_Battler.prototype.onAllActionsEnd && !Game_Battler.prototype.onAllActionsEnd.__aprb_aed2_wrapped) {
    const _GB_onAllActionsEnd_AED2 = Game_Battler.prototype.onAllActionsEnd;
    Game_Battler.prototype.onAllActionsEnd = function() {
      const r = _GB_onAllActionsEnd_AED2.apply(this, arguments);
      try {
        // treat actor actions as primary trigger
        if (this && this.isActor && this.isActor()) APRB_AED_arm("Game_Battler.onAllActionsEnd(actor)");
      } catch (e) {}
      return r;
    };
    Game_Battler.prototype.onAllActionsEnd.__aprb_aed2_wrapped = true;
  }

  // Update from BattleManager.updateTpb (preferred)
  if (typeof BattleManager !== "undefined" && BattleManager.updateTpb && !BattleManager.updateTpb.__aprb_aed2_wrapped) {
    const _BM_updateTpb_AED2 = BattleManager.updateTpb;
    BattleManager.updateTpb = function() {
      const r = _BM_updateTpb_AED2.apply(this, arguments);
      try { APRB_AED_update("BattleManager.updateTpb"); } catch (e) {}
      return r;
    };
    BattleManager.updateTpb.__aprb_aed2_wrapped = true;
  }

  // Update from Scene_Battle.update (fallback, in case BM.update path is bypassed)
  if (typeof Scene_Battle !== "undefined" && Scene_Battle.prototype.update && !Scene_Battle.prototype.update.__aprb_aed2_wrapped) {
    const _SB_update_AED2 = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
      const r = _SB_update_AED2.apply(this, arguments);
      try { APRB_AED_update("Scene_Battle.update"); } catch (e) {}
      return r;
    };
    Scene_Battle.prototype.update.__aprb_aed2_wrapped = true;
  }
  // ============================================================
  // Global ticker fallback (fix6n)
  // 目的:
  //  - 他プラグインにより BattleManager.update / updateTpb / Scene_Battle.update が後から上書きされても
  //    「アクション後遅延コモン」「StateKeepFrame」の更新が止まらないようにする。
  // 方針:
  //  - NW.js の setInterval で 1 つだけ軽量タイマーを回し、戦闘中のみ処理する。
  //  - TBP進行判定は「TimeStopでない」かつ「slowRate>0(未定義なら1)」を目安にする。
  //  - APRB_processTbpFrameProgress() は Graphics.frameCount で同一フレーム二重実行をガード済み。
  // ============================================================
  (function() {
    try {
      // グローバルに 1 つだけ
      const g = (function() { try { return (typeof globalThis !== "undefined") ? globalThis : window; } catch (e) { return window; } })();
      if (g && g._aprbGlobalTickerId != null) return;

      const intervalMs = 16; // approx 60fps
      const id = setInterval(function() {
        try {
          // battle only
          if (typeof SceneManager === "undefined" || !SceneManager) return;
          const scn = SceneManager._scene;
          if (!scn) return;
          if (typeof Scene_Battle !== "undefined" && !(scn instanceof Scene_Battle)) return;

          // run delayed common update
          try { APRB_AED_update("globalTicker"); } catch (e0) {}

          // run TBP-frame progress fallback (drives StateKeepFrame decrement, etc.)
          try {
            if (typeof BattleManager === "undefined" || !BattleManager) return;
            const bm = BattleManager;
                        // Always run frame progress fallback in battle.
            // (Some plugins may keep APRB time-stop / slow flags engaged; these features must still progress.)
            APRB_processTbpFrameProgress(bm);
          } catch (e1) {}
        } catch (e2) {}
      }, intervalMs);

      if (g) g._aprbGlobalTickerId = id;
      if (DEBUG_LOG) try { _aprbDbg(`[APRB] GlobalTicker enabled id=${id}`); } catch (e3) {}
    } catch (e) {}
  })();

})();
})();

/* ---------------------------------------------------------------------------
 * [APRB] StateKeepFrame robust handler (fix6v)
 * - Accepts tag variants/case and fullwidth colon in note: <StateKeepFrame:240> / <statekeepframe：240> etc.
 * - Works even when BattleManager.update/endAction are skipped by other plugins.
 * - No plugin commands added, no existing params removed.
 * -------------------------------------------------------------------------*/
(() => {
  "use strict";
  if (typeof console === "undefined") return;

  const TAG_RE = /<\s*(?:statekeepframe|stateframekeep|statekeepframe|statekeep)\s*[:：]\s*(\d+)\s*>/i;
  const META_KEY_RE = /^(?:statekeepframe|stateframekeep|statekeep)$/i;

  function aprbGetKeepFramesFromState(state) {
    if (!state) return 0;

    // 1) Note regex (most robust: case-insensitive + fullwidth colon)
    const note = String(state.note || "");
    const m = note.match(TAG_RE);
    if (m) {
      const n = Number(m[1] || 0);
      return Number.isFinite(n) && n > 0 ? n : 0;
    }

    // 2) Meta (RMMZ metadata keys are case-sensitive, so scan keys)
    const meta = state.meta || {};
    if (meta.StateKeepFrame != null) {
      const n = Number(meta.StateKeepFrame);
      return Number.isFinite(n) && n > 0 ? n : 0;
    }
    for (const k of Object.keys(meta)) {
      if (META_KEY_RE.test(k)) {
        const n = Number(meta[k]);
        return Number.isFinite(n) && n > 0 ? n : 0;
      }
    }
    return 0;
  }

  function aprbEnsureMap(battler) {
    if (!battler) return null;
    if (!battler._aprbStateKeepMap) battler._aprbStateKeepMap = Object.create(null);
    return battler._aprbStateKeepMap;
  }

  function aprbInitIfMissing(battler, stateId) {
    const state = $dataStates && $dataStates[stateId];
    const frames = aprbGetKeepFramesFromState(state);
    if (frames <= 0) return 0;
    const map = aprbEnsureMap(battler);
    if (!map) return 0;
    if (map[stateId] == null) map[stateId] = frames;
    return map[stateId];
  }

  function aprbTickStateKeepFrame(dtFrames) {
    if (!$gameParty || !$gameTroop) return;
    if (!$gameParty.inBattle || !$gameParty.inBattle()) return;

    const battlers = [];
    try {
      battlers.push(...($gameParty.members ? $gameParty.members() : []));
      battlers.push(...($gameTroop.members ? $gameTroop.members() : []));
    } catch (_) {
      return;
    }

    for (const b of battlers) {
      if (!b || !b._states || b._states.length === 0) continue;

      const map = aprbEnsureMap(b);
      for (const stateId of b._states.slice()) {
        const remain = aprbInitIfMissing(b, stateId);
        if (remain <= 0) continue;

        map[stateId] -= dtFrames;
        if (map[stateId] <= 0) {
          // Remove state safely
          try {
            try { b._aprbSKF_removeSid = stateId; b._aprbSKF_removeFrame = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Number(Graphics.frameCount) : 0; } catch (eMark) {}
            b.removeState(stateId);
          } catch (_) {}
          delete map[stateId];
        }
      }
    }
  }

  // Hook add/remove to keep map consistent (best-effort; fallback scan still covers direct _states edits)
  if (typeof Game_BattlerBase !== "undefined" && Game_BattlerBase.prototype) {
    const _addState = Game_BattlerBase.prototype.addState;
    Game_BattlerBase.prototype.addState = function(stateId) {
      _addState.call(this, stateId);
      if (!$gameParty || !$gameParty.inBattle || !$gameParty.inBattle()) return;
      aprbInitIfMissing(this, stateId);
    };

    const _removeState = Game_BattlerBase.prototype.removeState;
    Game_BattlerBase.prototype.removeState = function(stateId) {
      _removeState.call(this, stateId);
      if (this && this._aprbStateKeepMap) delete this._aprbStateKeepMap[stateId];
    };
  }

  // Tick from Scene_Battle.update using Graphics.frameCount guard (independent of BattleManager.update)
  if (typeof Scene_Battle !== "undefined" && Scene_Battle.prototype) {
    const _sbUpdate = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
      _sbUpdate.call(this);

      if (!$gameParty || !$gameParty.inBattle || !$gameParty.inBattle()) return;
      const fc = (typeof Graphics !== "undefined" && Graphics.frameCount != null) ? Graphics.frameCount : null;
      // Use BattleManager as global guard to avoid double ticks even if multiple Scene_Battle wrappers exist
      if (typeof BattleManager !== "undefined") {
        if (BattleManager._aprbStateKeepFc === fc) return;
        BattleManager._aprbStateKeepFc = fc;
      }
      aprbTickStateKeepFrame(1);
    };
  }

  console.log("[APRB][StateKeepFrame] enabled fix6x");
})();



/* ============================================================================
 * [APRB][fix6x-r23] Victory ME timing fix
 *   - Play victory ME as soon as victory is determined (same feel as r11),
 *     even if BattleManager.processVictory is delayed by other async tasks.
 *   - Prevent double play by suppressing BattleManager.playVictoryMe afterwards.
 *   - No parameter changes / no plugin commands.
 * ========================================================================== */
(() => {
  if (typeof BattleManager === "undefined") return;

  const _aprbTryEarlyVictoryMe = () => {
    try {
      if (!$gameTroop || !$gameParty || !$gameSystem) return;
      if (!$gameTroop.isAllDead || !$gameParty.isAllDead) return;

      // Only victory (not defeat / escape / abort)
      if (!$gameTroop.isAllDead()) return;
      if ($gameParty.isAllDead()) return;
      if (BattleManager._escaped) return;
      if (BattleManager._aborting) return;

      // Already played (early or normal)
      if (BattleManager._aprbVictoryMeEarlyPlayed) return;

      // If engine already started victory processing, don't force here.
      const ph = BattleManager._phase;
      if (ph === "victory" || ph === "battleEnd") {
        // Still OK to play early once if processVictory is delayed, but guard by a small flag:
        // if processVictory already ran, engine will have played it.
        if (BattleManager._aprbVictoryMeProcessing) return;
      }

      const me = ($gameSystem.victoryMe && $gameSystem.victoryMe()) ? $gameSystem.victoryMe() : null;
      if (!me || !me.name) return;

      // Mark and play.
      BattleManager._aprbVictoryMeEarlyPlayed = true;
      try { _aprbLog && _aprbLog(`[APRB][VictoryME] early-play name=${String(me.name)}`); } catch (e) {}
      if (AudioManager && AudioManager.playMe) {
        AudioManager.playMe(me);
      }
    } catch (e) {
      try { _aprbLog && _aprbLog(`[APRB][VictoryME] early-play error ${String(e)}`); } catch (_) {}
    }
  };

  // Reset flags per battle
  const _BM_setup = BattleManager.setup;
  BattleManager.setup = function(troopId, canEscape, canLose) {
    this._aprbVictoryMeEarlyPlayed = false;
    this._aprbVictoryMeProcessing = false;
    return _BM_setup.call(this, troopId, canEscape, canLose);
  };

  // Mark processing window
  const _BM_processVictory = BattleManager.processVictory;
  BattleManager.processVictory = function() {
    this._aprbVictoryMeProcessing = true;
    try {
      // Ensure ME is not delayed even if processVictory itself got delayed.
      _aprbTryEarlyVictoryMe();
    } catch (e) {}
    return _BM_processVictory.call(this);
  };

  // Earliest safe place: checkBattleEnd runs when the engine decides to end battle.
  if (typeof BattleManager.checkBattleEnd === "function") {
    const _BM_checkBattleEnd = BattleManager.checkBattleEnd;
    BattleManager.checkBattleEnd = function() {
      const r = _BM_checkBattleEnd.call(this);
      // If victory already determined, play ME immediately.
      _aprbTryEarlyVictoryMe();
      return r;
    };
  } else {
    // Fallback: poll in update (very light)
    const _BM_update = BattleManager.update;
    BattleManager.update = function(timeActive) {
      const r = _BM_update.call(this, timeActive);
      _aprbTryEarlyVictoryMe();
      return r;
    };
  }

  // Suppress later normal play to avoid double ME.
  if (typeof BattleManager.playVictoryMe === "function") {
    const _BM_playVictoryMe = BattleManager.playVictoryMe;
    BattleManager.playVictoryMe = function() {
      if (this._aprbVictoryMeEarlyPlayed) {
        try { _aprbLog && _aprbLog(`[APRB][VictoryME] suppress-normal`); } catch (e) {}
        return;
      }
      return _BM_playVictoryMe.call(this);
    };
  }

  // ---------------------------------------------------------------------------
  // [r40] UI Visibility Latch4 (End-of-update enforcement)
  // Problem: During victory/defeat common events, $gameParty.inBattle() can become false
  // while Scene_Battle is still active. In that timing, command icons can be refreshed
  // (visible=true) without passing through show()/create guards, causing a one-frame flash.
  // Solution: enforce UI visibility at the very end of Scene_Battle.update so that even if
  // some logic re-enables icons earlier in the same frame, they are hidden before render.
  // This runs while Scene_Battle exists, independent of $gameParty.inBattle().
  (function() {
    if (typeof Scene_Battle === "undefined" || !Scene_Battle || !Scene_Battle.prototype) return;
    const _aprb_SceneBattle_update_forUiVis = Scene_Battle.prototype.update;
    Scene_Battle.prototype.update = function() {
      _aprb_SceneBattle_update_forUiVis.call(this);

      try {
        // Only enforce in the active battle scene (prevents affecting other scenes if update is reused).
        if (typeof SceneManager !== "undefined" && SceneManager && SceneManager._scene && SceneManager._scene !== this) return;

        // Enforce command icons
        if (this._aprbCommandIcons && !_aprbIsUiVisible("icons")) {
          const icons = this._aprbCommandIcons;
          const keys = ["attack","guard","skill","item","target"];
          for (let i = 0; i < keys.length; i++) {
            const s = icons[keys[i]];
            if (s) {
              s.visible = false;
              // renderable is a PIXI.DisplayObject property; when false it won't be drawn even if visible flips later.
              if (s.renderable != null) s.renderable = false;
              if (s.alpha != null) s.alpha = 0;
            }
          }
        } else if (this._aprbCommandIcons && _aprbIsUiVisible("icons")) {
          // When re-enabled, restore renderable/alpha so normal logic can control visibility.
          const icons = this._aprbCommandIcons;
          const keys = ["attack","guard","skill","item","target"];
          for (let i = 0; i < keys.length; i++) {
            const s = icons[keys[i]];
            if (s) {
              if (s.renderable != null) s.renderable = true;
              if (s.alpha != null && s.alpha === 0) s.alpha = 1;
            }
          }
        }
      } catch (_e) {}
    };
  })();

})();

// APRB: ensure parry flag resets each action
(()=>{
const _clear=Game_ActionResult.prototype.clear;
Game_ActionResult.prototype.clear=function(){_clear.call(this);this._aprbParry=false;};
})();
