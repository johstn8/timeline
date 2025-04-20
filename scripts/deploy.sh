#!/usr/bin/env bash
# Simple CI/CD script: build frontend, zip backend for AWS Lambda, upload to S3 + CloudFront

set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# 1. Frontend‑Build
echo "🔨 Building frontend…"
npm --prefix "$ROOT_DIR/frontend" run build

# 2. Bundle Backend (exclude node_modules to keep size small)
echo "📦 Bundling backend API…"
BACKEND_DIST="$ROOT_DIR/backend-dist"
rm -rf "$BACKEND_DIST" && mkdir "$BACKEND_DIST"
cp -r "$ROOT_DIR/backend"/* "$BACKEND_DIST"
rm -rf "$BACKEND_DIST/node_modules"
(cd "$BACKEND_DIST" && npm install --omit=dev)

# Zip für AWS Lambda
cd "$BACKEND_DIST"
zip -r ../lambda.zip .

# 3. Upload zu AWS (S3 + Lambda Update)
echo "☁️  Uploading to AWS…"
AWS_REGION=${AWS_REGION:-eu-central-1}
S3_BUCKET=${S3_BUCKET:-timeline-project-bucket}
LAMBDA_FUNC=${LAMBDA_FUNC:-timeline-backend}

aws s3 sync "$ROOT_DIR/frontend/dist" "s3://$S3_BUCKET" --delete
aws lambda update-function-code --function-name "$LAMBDA_FUNC" --zip-file fileb://../lambda.zip --region "$AWS_REGION"

echo "✅  Deployment complete!"
