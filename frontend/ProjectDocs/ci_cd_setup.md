# Cài đặt CI/CD cho Dự án Harmonia

## Giới thiệu

Tài liệu này mô tả chi tiết cách cài đặt và cấu hình quy trình CI/CD (Continuous Integration/Continuous Deployment) cho dự án Harmonia. Quy trình này giúp tự động hóa việc kiểm thử, xây dựng và triển khai ứng dụng, đảm bảo chất lượng code và triển khai nhanh chóng.

## Nguyên tắc CI/CD

1. **Fast Feedback**: Phát hiện vấn đề sớm thông qua kiểm thử tự động
2. **Automated Deployment**: Triển khai tự động để giảm thiểu sai sót do thao tác thủ công
3. **Environment Parity**: Môi trường giống nhau giữa development, staging và production
4. **Versioning**: Quản lý phiên bản rõ ràng

## Môi trường triển khai

Dự án Harmonia được triển khai trên ba môi trường:

1. **Development**: Môi trường phát triển cho team developer
2. **Staging**: Môi trường thử nghiệm giống production
3. **Production**: Môi trường người dùng thực

## Công nghệ sử dụng

- **GitHub Actions**: CI/CD platform
- **Docker**: Containerization
- **Vercel/Netlify**: Frontend hosting
- **AWS/Digital Ocean**: Backend hosting
- **Terraform**: Infrastructure as Code
- **Sentry**: Error monitoring
- **Datadog**: Performance monitoring

## Thiết lập Workflow CI/CD

### 1. Thiết lập GitHub Actions

Tạo thư mục `.github/workflows` và các file workflow cần thiết:

#### CI Workflow (`.github/workflows/ci.yml`)

```yaml
name: Continuous Integration

on:
  push:
    branches: [develop, main]
  pull_request:
    branches: [develop, main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm type-check
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
```

#### Deploy Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy

on:
  push:
    branches:
      - develop
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Build
        run: pnpm build
        
      - name: Set deployment environment
        id: deployment
        run: |
          if [[ $GITHUB_REF == 'refs/heads/main' ]]; then
            echo "::set-output name=environment::production"
          else
            echo "::set-output name=environment::staging"
          fi
      
      # Sử dụng Vercel hoặc Netlify để deploy frontend
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: ${{ steps.deployment.outputs.environment == 'production' && '--prod' || '' }}
```

### 2. Cài đặt script trong package.json

Thêm các script cần thiết vào file `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "prepare": "husky install"
  }
}
```

### 3. Cài đặt pre-commit hooks với Husky

```bash
pnpm add -D husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

Cấu hình `lint-staged` trong `package.json`:

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md}": [
      "prettier --write"
    ]
  }
}
```

## Quy trình Deployment

### 1. Development

- Developer làm việc trên branch feature/fix
- Commit và push lên repository
- GitHub Actions chạy kiểm tra linting và test
- Sau khi PR được approve, code được merge vào branch `develop`
- Tự động deploy lên môi trường staging

### 2. Staging

- Code từ branch `develop` được triển khai tự động lên môi trường staging
- QA tiến hành test tính năng
- Thu thập feedback và thực hiện các sửa đổi cần thiết

### 3. Production

- Sau khi đã kiểm tra kỹ trên staging, tạo PR từ `develop` vào `main`
- Code review và approval từ team lead
- Merge vào `main` và tự động deploy lên production
- Tạo Git tag cho phiên bản đã triển khai

## Infrastructure as Code (IaC)

### Terraform Configuration

Tạo thư mục `terraform` với các file cấu hình:

```
terraform/
├── main.tf
├── variables.tf
├── outputs.tf
├── modules/
│   ├── frontend/
│   ├── backend/
│   └── database/
├── environments/
│   ├── dev/
│   ├── staging/
│   └── prod/
```

File `main.tf` cơ bản:

```hcl
provider "aws" {
  region = var.aws_region
}

module "frontend" {
  source = "./modules/frontend"
  
  app_name = var.app_name
  environment = var.environment
}

module "backend" {
  source = "./modules/backend"
  
  app_name = var.app_name
  environment = var.environment
  db_password = var.db_password
}

module "database" {
  source = "./modules/database"
  
  app_name = var.app_name
  environment = var.environment
  db_password = var.db_password
}
```

## Monitoring và Alerting

### 1. Sentry cho Error Tracking

Cài đặt Sentry trong ứng dụng Next.js:

```tsx
// app/sentry.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

### 2. Datadog cho Performance Monitoring

Thêm Real User Monitoring của Datadog vào ứng dụng:

```html
<!-- In Head -->
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Zero-Downtime Deployment

### 1. Blue-Green Deployment

Thiết lập Blue-Green deployment cho backend services:

1. Deploy phiên bản mới (green) song song với phiên bản hiện tại (blue)
2. Chuyển traffic dần dần sang phiên bản mới
3. Monitor lỗi và performance
4. Nếu ổn, chuyển hết traffic sang phiên bản mới
5. Dừng phiên bản cũ

### 2. Cấu hình health checks

Thêm endpoint health check vào Next.js app:

```tsx
// app/api/health/route.ts
export async function GET() {
  return new Response(JSON.stringify({ status: 'ok' }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
```

## Rollback Strategy

### 1. Cấu hình auto-rollback

Cài đặt auto-rollback trong workflow GitHub Actions:

```yaml
- name: Monitor deployment
  run: |
    curl -s --retry 10 --retry-delay 10 $HEALTH_CHECK_URL | grep -q "status.*ok" || {
      echo "Health check failed! Rolling back..."
      # Rollback logic here
      exit 1
    }
```

### 2. Manual rollback

Tạo workflow για manual rollback:

```yaml
name: Manual Rollback

on:
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to rollback to (tag)'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          ref: ${{ github.event.inputs.version }}
      
      # Deployment steps here
```

## Bảo mật trong CI/CD

1. **Secrets Management**:
   - Sử dụng GitHub Secrets cho các thông tin nhạy cảm
   - Không lưu trữ credentials trong code

2. **Dependency Scanning**:
   - Sử dụng GitHub Dependabot để tự động cập nhật dependencies
   - Thêm scanning dependencies vào workflow CI:

```yaml
- name: Security scan
  uses: snyk/actions/node@master
  with:
    args: --severity-threshold=high
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

## Quy trình triển khai cho team

1. **Phát triển tính năng**:
   - Checkout từ branch `develop`
   - Tạo branch feature (format: `feature/ten-tinh-nang`)
   - Commit và push code
   - Tạo PR vào branch `develop`

2. **Code review**:
   - Yêu cầu ít nhất 1 approval từ team member
   - CI phải pass (tests, linting, etc.)
   - Giải quyết conflicts nếu có

3. **Merge và deploy staging**:
   - Merge vào `develop`
   - CI/CD tự động deploy lên staging
   - Thông báo cho QA để test

4. **Release lên production**:
   - Tạo PR từ `develop` vào `main`
   - Yêu cầu approval từ team lead
   - Merge và tự động deploy lên production
   - Monitor errors và performance

## Kết luận

Quy trình CI/CD này giúp team phát triển và triển khai ứng dụng Harmonia một cách hiệu quả, đảm bảo chất lượng code và trải nghiệm người dùng. Các công cụ và quy trình được thiết kế để phù hợp với kiến trúc và yêu cầu của dự án, đồng thời cung cấp tính linh hoạt để mở rộng trong tương lai. 