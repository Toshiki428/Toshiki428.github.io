# Toshiki428.github.io - Personal Portfolio & Blog

## ライブデモ

[サイトを見る](https://toshiki428.github.io/)

## 概要

このプロジェクトは、私のポートフォリオと技術ブログを兼ねた個人ウェブサイトです。  
React、TypeScript、Viteを使用して構築されており、GitHub Pagesでホストされています。

私のスキル、プロジェクト、技術的な知見を紹介することを目的としています。

## 主な機能

- **レスポンシブデザイン**: あらゆるデバイスで快適に閲覧できます。
- **Markdownベースのコンテンツ管理**: ポートフォリオやブログ記事はMarkdownファイルで簡単に管理できます。
- **ポートフォリオ表示**: 過去のプロジェクトを一覧で紹介します。
- **ブログ記事**: 技術的なトピックや開発経験に関する記事を公開します。
- **Mermaid図のサポート**: コードブロック内でMermaid記法を使用することで、図をレンダリングできます。

## 技術スタック

- **フレームワーク**: React
- **言語**: TypeScript
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS, `@tailwindcss/typography`
- **Markdownレンダリング**: `react-markdown`, `remark-gfm`
- **コンテンツ解析**: `gray-matter`
- **その他**: `buffer` (Node.js `Buffer`のブラウザポリフィル)

## セットアップ

ローカルで開発環境をセットアップし、プロジェクトを実行するための手順です。

1. **リポジトリをクローン**:
    ```bash
    git clone https://github.com/Toshiki428/Toshiki428.github.io.git
    cd Toshiki428.github.io
    ```

2. **依存関係のインストール**:
    ```bash
    npm install
    ```

3. **開発サーバーの起動**:
    ```bash
    npm run dev
    ```
    ブラウザで `http://localhost:5173` (または表示されるURL) を開くと、開発サーバーが起動し、変更がリアルタイムで反映されます。

4. **プロジェクトのビルド**:
    ```bash
    npm run build
    ```
    本番環境用の静的ファイルが `dist` ディレクトリに生成されます。

5. **プロジェクトのデプロイ**:
    ```bash
    npm run deploy
    ```

## コンテンツ管理

ポートフォリオやブログ記事のコンテンツは、`src/contents/` ディレクトリ内のMarkdownファイルとして管理されます。

- **ポートフォリオ**: `src/contents/portfolio/` に `.md` ファイルを追加。
- **ブログ記事**: `src/contents/blog/` に `.md` ファイルを追加。
- **Aboutページ**: `src/contents/pages/about.md` を編集。

各Markdownファイルは、フロントマター（YAML形式のメタデータ）をサポートしており、タイトル、日付、タグなどの情報を記述できます。

## デプロイ

このプロジェクトはGitHub Pagesにデプロイされます。`main` ブランチへのプッシュにより、GitHub Actionsが自動的にビルドとデプロイを実行します。

## 著者

Toshiki428 - [GitHub](https://github.com/Toshiki428)
