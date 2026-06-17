# chord.play

コード進行をテキストで入力して鳴らせる、シンプルなWebアプリです。

**→ [chord-player-ten.vercel.app](https://chord-player-ten.vercel.app)**

## 使い方

```
C Am F G
Dm7 G7 Cmaj7 C
Am Em F G
```

- スペース区切りでコードを入力
- `|` でバー区切り
- 改行でセクション分け
- ▶ 再生 / ■ 停止（スペースキーでも可）
- コードをクリックで単発試聴

## 機能

| 機能 | 説明 |
|------|------|
| 再生 | BPM調整付きでループ再生 |
| 音色 | Piano / Guitar / Pad の3種類 |
| 保存 | タイトルをつけてサーバーに保存 |
| シェア | `?id=XXXXXX` のURLで共有 |

## 対応コード記法

`C` `Cm` `C7` `Cmaj7` `Cm7` `Cdim` `Caug` `Csus2` `Csus4`  
`C9` `Cmaj9` `Cm9` `Cadd9` `C6` `Cm6` `Cdim7` `Cm7b5`  
`C/E`（分数コード：ベース音は無視して上声部を演奏）

## 技術スタック

- フロントエンド: Vanilla HTML/CSS/JS、Web Audio API
- バックエンド: Vercel Serverless Functions (Node.js)
- ストレージ: Upstash Redis

## ローカル開発

```bash
git clone https://github.com/byeolsatang/chord-player.git
cd chord-player
npm install
npm start
# → http://localhost:3456
```

保存機能を使うには `.env` に Upstash Redis の環境変数を設定してください。

```
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```
