#!/bin/bash

# 環境変数からデプロイ環境を取得（デフォルトはproduction）
DEPLOY_ENV=${DEPLOY_ENV:-production}

# ビルドを実行
npm run build

# 設定ファイルをビルドディレクトリにコピー
cp "config/config.${DEPLOY_ENV}.json" build/config.json

echo "Built for ${DEPLOY_ENV} environment"