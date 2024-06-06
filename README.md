## Todoリスト

このTODOリストはNext.jsを使用して作成されました。Ant Designと
Tailwind CSSでスタイルをあてています。
このプロジェクトは、私の最後の練習作品です。

## 特徴
- タスクの追加
- ローカルストレージを使い再読み込みしたときのデータの消失を防いでいます
- 確認モーダル付きの全削除機能
- 編集と詳細テキストの機能

## 使用技術
- Next.js
- Typescript
- Ant Design
- Tailwind CSS

##　リストのインストールとセットアップ

1. リポジトリをクローンします。

    ```bash
    git clone https://github.com/your-username/your-repo.git
    ```

2. 依存関係をインストールします。

    ```bash
    cd your-repo
    npm install
    ```

3. 開発サーバーを起動します。

    ```bash
    npm run dev
    ```

    ブラウザで `http://localhost:3000` を開いてアプリケーションを確認します。

## デプロイ

Netlifyを使用してデプロイする手順は以下の通りです：

1. [Netlify](https://www.netlify.com/)にアクセスし、アカウントを作成またはログインします。
2. "New site from Git" ボタンをクリックし、GitHubアカウントを連携します。
3. デプロイしたいリポジトリを選択します。
4. ビルド設定を以下のように設定します：
    - Build command: `npm run build`
    - Publish directory: `.next`
5. "Deploy site" ボタンをクリックします。

デプロイが完了すると、Netlifyから公開URLが提供されます。

## ライセンス

このプロジェクトはMITライセンスの下で公開されています。詳細は[LICENSE](./LICENSE)ファイルを参照してください。
