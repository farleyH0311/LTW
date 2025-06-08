# Tài liệu Onboarding - Dự án Harmonia

## 1. Giới thiệu dự án

Harmonia là một nền tảng kết nối và hẹn hò hiện đại, được phát triển bằng Next.js 15, React 19 và Shadcn UI. Ứng dụng cung cấp trải nghiệm người dùng tối ưu trong việc tìm kiếm và kết nối với những người phù hợp, tích hợp các tính năng như:

- Thuật toán ghép cặp thông minh dựa trên AI
- Hệ thống tin nhắn và trò chuyện an toàn
- Cuộc gọi video
- Hỗ trợ đa ngôn ngữ (Tiếng Anh và Tiếng Việt)
- Giao diện thích ứng với thiết bị di động

## 2. Cài đặt môi trường phát triển

### Yêu cầu hệ thống
- Node.js v18+ (khuyến nghị sử dụng v20 LTS)
- pnpm hoặc npm
- Git

### Các bước cài đặt

1. **Clone dự án**

```bash
git clone <repository-url>
cd harmonia
```

2. **Cài đặt dependencies**

```bash
pnpm install
# hoặc
npm install
```

3. **Khởi chạy môi trường phát triển**

```bash
pnpm dev
# hoặc
npm run dev
```

4. **Truy cập ứng dụng**

Mở trình duyệt và truy cập [http://localhost:3000](http://localhost:3000)

### Cấu hình môi trường (nếu cần)

Tạo file `.env.local` tại thư mục gốc và thêm các biến môi trường:

```
# Ví dụ về các biến môi trường (sẽ được cập nhật khi tích hợp API và dịch vụ)
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## 3. Cấu trúc dự án

```
harmonia/
├── app/                     # Next.js App Router
│   ├── (authenticated)/     # Routes yêu cầu xác thực (feed, dating, messages, calls...)
│   ├── login/               # Trang đăng nhập
│   ├── register/            # Trang đăng ký
│   ├── globals.css          # CSS toàn cục
│   ├── layout.tsx           # Layout chính của ứng dụng
│   ├── page.tsx             # Trang chủ (landing page)
│
├── components/              # Các thành phần UI tái sử dụng
│   ├── navigation/          # Components điều hướng (app-navigation, mobile-navigation)
│   ├── ui/                  # Shadcn UI components
│   ├── language-provider.tsx # Provider đa ngôn ngữ
│   └── ...
│
├── hooks/                   # React hooks
├── lib/                     # Thư viện tiện ích
│   └── utils.ts             # Các hàm tiện ích
│
├── public/                  # Tài nguyên tĩnh
└── styles/                  # Các styles khác
```

### Giải thích các thư mục chính

- **app/**: Chứa tất cả các trang và routes theo cấu trúc của Next.js App Router
  - **(authenticated)**: Chứa các trang yêu cầu đăng nhập như feed, dating, messages
  - **login**, **register**: Các trang xác thực
- **components/**: Chứa các component có thể tái sử dụng
  - **navigation/**: Components điều hướng
  - **ui/**: Components UI cơ bản từ shadcn/ui
- **hooks/**: Custom React hooks
- **lib/**: Các utility functions và helpers
- **public/**: Các tài nguyên tĩnh như hình ảnh, fonts
- **ProjectDocs/**: Tài liệu dự án

## 4. Công nghệ sử dụng

- **Framework**: Next.js 15+ (App Router)
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Animations**: Framer Motion
- **State Management**: Zustand (cho client components)
- **Form Management**: React Hook Form + Zod
- **Icons**: Lucide React
- **Internationalization**: Custom language provider
- **Date & Time**: date-fns

## 5. Quy trình làm việc

### Git Workflow

1. **Branches**:
   - `main`: Branch chính, chỉ merge code đã được review
   - `develop`: Branch phát triển, merge các feature branches
   - `feature/ten-feature`: Branch cho các tính năng mới
   - `fix/ten-fix`: Branch cho các sửa lỗi

2. **Commit Message Format**:
   ```
   type(scope): nội dung commit

   Mô tả chi tiết (nếu cần)
   ```

   Trong đó `type` có thể là:
   - `feat`: Thêm tính năng mới
   - `fix`: Sửa lỗi
   - `docs`: Cập nhật tài liệu
   - `style`: Thay đổi không ảnh hưởng đến code (format, whitespace...)
   - `refactor`: Refactor code
   - `test`: Thêm hoặc sửa tests
   - `chore`: Cập nhật công cụ, thư viện...

3. **Pull Requests**:
   - Tạo PR từ feature branch vào develop
   - Yêu cầu ít nhất 1 người review
   - Mô tả rõ ràng những thay đổi
   - Đảm bảo code đã được test kỹ lưỡng

### Quy trình phát triển

1. **Planning**:
   - Nhận task từ task management system (Jira, Trello...)
   - Hiểu rõ yêu cầu và thiết kế trước khi bắt đầu

2. **Development**:
   - Tạo branch từ develop
   - Phát triển tính năng hoặc sửa lỗi
   - Viết unit tests nếu cần
   - Đảm bảo code tuân thủ các quy tắc trong `.cursorrules`

3. **Code Review**:
   - Tạo PR và gán reviewer
   - Cập nhật code theo feedback

4. **Testing**:
   - Test tính năng trên local
   - Verify trên các thiết bị và trình duyệt khác nhau

5. **Deployment**:
   - Merge vào develop
   - CI/CD sẽ tự động deploy lên môi trường staging

## 6. Coding Standards

### TypeScript & React Best Practices

- Luôn sử dụng TypeScript với các type chính xác
- Sử dụng React Server Components khi có thể
- Chỉ sử dụng "use client" khi thực sự cần thiết
- Tránh sử dụng class components, ưu tiên functional components
- Giới hạn file tối đa 150 dòng

### Quy tắc đặt tên

- **Files & Folders**: lowercase-with-dashes
- **Components**: PascalCase
- **Functions & Variables**: camelCase
- **Constants**: UPPER_SNAKE_CASE

### Style Guide

- Sử dụng Tailwind CSS để styling
- Tuân thủ mobile-first approach
- Sử dụng các biến CSS (CSS variables) từ Shadcn UI

## 7. Tài liệu tham khảo

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Shadcn UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)

## 8. Liên hệ và hỗ trợ

Nếu bạn gặp khó khăn hoặc cần hỗ trợ:
- Liên hệ với Tech Lead
- Tạo issue trên GitHub repository
- Hỏi trong kênh Slack/Discord của team 