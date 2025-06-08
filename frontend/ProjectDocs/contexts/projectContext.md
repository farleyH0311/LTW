# Harmonia - Bối cảnh dự án

## Tổng quan dự án

Harmonia là một nền tảng kết nối và hẹn hò hiện đại, được xây dựng trên công nghệ Next.js 15 và React 19. Mục tiêu chính của Harmonia là tạo ra một không gian an toàn và hiệu quả cho người dùng tìm kiếm và phát triển các mối quan hệ có ý nghĩa thông qua thuật toán kết nối thông minh.

## Phạm vi dự án

### Mục tiêu người dùng
- Tìm kiếm và kết nối với những người phù hợp dựa trên sở thích, giá trị và tính cách
- Giao tiếp an toàn thông qua hệ thống nhắn tin và gọi video được bảo mật
- Truy cập nền tảng từ nhiều thiết bị với trải nghiệm nhất quán
- Nhận đề xuất kết nối thông minh dựa trên thuật toán AI

### Phạm vi kỹ thuật
- Xây dựng ứng dụng web sử dụng Next.js 15 App Router và React 19
- Thiết kế responsive theo hướng mobile-first
- Triển khai tính năng xác thực và ủy quyền người dùng
- Phát triển hệ thống nhắn tin và gọi video thời gian thực
- Tích hợp các thuật toán AI cho việc kết nối
- Hỗ trợ đa ngôn ngữ và chế độ theme sáng/tối

## Yêu cầu thiết kế

### Nguyên tắc thiết kế
- **Lấy người dùng làm trung tâm**: Mọi quyết định thiết kế phải ưu tiên trải nghiệm người dùng
- **Đơn giản và trực quan**: Giao diện dễ sử dụng, giảm thiểu đường cong học tập
- **Nhất quán**: Duy trì tính nhất quán trong thiết kế trên toàn bộ ứng dụng
- **Hiệu suất**: Tối ưu hóa hiệu suất để đảm bảo thời gian phản hồi nhanh

### Hệ thống thiết kế
- Sử dụng Shadcn UI làm nền tảng component
- Áp dụng Tailwind CSS cho styling
- Tuân thủ một bảng màu nhất quán cho cả theme sáng và tối
- Sử dụng typography rõ ràng và có thể đọc được trên tất cả các thiết bị

## Yêu cầu kỹ thuật

### Kiến trúc
- **Next.js 15**: Sử dụng App Router và React Server Components
- **React 19**: Tận dụng các tính năng mới nhất của React
- **TypeScript**: Đảm bảo code an toàn với kiểu dữ liệu
- **Microservices**: Tổ chức code theo mô hình microservices khi cần thiết
- **Serverless**: Triển khai trên nền tảng serverless cho khả năng mở rộng

### Công cụ và thư viện
- **State Management**: Zustand cho quản lý state phía client
- **Form Management**: React Hook Form + Zod cho validation
- **UI/UX**: Framer Motion cho animations
- **API**: NextJS API Routes/Server Actions
- **Authentication**: Dựa trên JWT, OAuth hoặc Auth providers

### Quy tắc code
- Áp dụng lập trình hàm, tránh OOP và classes
- Files giới hạn tối đa 150 dòng
- Sử dụng tên biến mô tả và ngữ nghĩa
- Ưu tiên exports có tên cho components

## Tiêu chí thành công

### Mục tiêu hiệu suất
- **LCP (Largest Contentful Paint)**: < 2.5 giây
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms
- **TTI (Time to Interactive)**: < 3.8 giây

### Mục tiêu trải nghiệm người dùng
- Thời gian tải trang nhanh và trôi chảy
- Giao diện người dùng thân thiện và trực quan
- Phản hồi tức thì cho các tương tác
- Chức năng nhất quán trên các thiết bị và trình duyệt

## Lộ trình dự án

### Giai đoạn 1: Thiết kế và cấu trúc
- Thiết lập cấu trúc dự án
- Xây dựng components cơ bản
- Thiết kế giao diện người dùng

### Giai đoạn 2: Core Features
- Xây dựng hệ thống xác thực
- Phát triển hồ sơ người dùng
- Triển khai thuật toán kết nối cơ bản

### Giai đoạn 3: Tính năng giao tiếp
- Xây dựng hệ thống nhắn tin
- Tích hợp cuộc gọi video
- Phát triển tính năng đề xuất

### Giai đoạn 4: Tối ưu hóa và mở rộng
- Tối ưu hóa hiệu suất
- Triển khai tính năng cao cấp
- Mở rộng khả năng hỗ trợ người dùng 