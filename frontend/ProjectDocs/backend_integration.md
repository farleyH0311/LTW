# Kế hoạch Tích hợp Backend - Dự án Harmonia

## Giới thiệu

Hiện tại, Harmonia đang hoạt động như một ứng dụng frontend mà chưa có backend thực sự. Tài liệu này mô tả chiến lược và kế hoạch triển khai backend để hỗ trợ tất cả các tính năng của ứng dụng, sử dụng Supabase như một giải pháp backend toàn diện.

## 1. Kiến trúc Backend

### Đề xuất kiến trúc

Chúng ta sẽ sử dụng Supabase như một giải pháp backend tất cả trong một (all-in-one) để tối ưu hóa tốc độ phát triển và phù hợp với kích thước team.

```
┌────────────────┐       ┌───────────────────────────────────┐
│                │       │                                   │
│  Next.js App   │◄──────┤            Supabase              │
│                │       │                                   │
└────────────────┘       └───────────────────────────────────┘
                                   │
      ┌───────────────────────────┼───────────────────────────┐
      │                           │                           │
┌─────▼─────┐             ┌───────▼────────┐      ┌───────────▼─────┐
│           │             │                │      │                 │
│  Auth     │             │  PostgreSQL    │      │  Storage        │
│           │             │  Database      │      │                 │
│           │             │                │      │                 │
└───────────┘             └────────────────┘      └─────────────────┘
                                 │
                                 │
                          ┌──────▼──────┐
                          │             │
                          │  Realtime   │
                          │  & Edge     │
                          │  Functions  │
                          │             │
                          └─────────────┘
```

### Công nghệ đề xuất

- **Authentication**: Supabase Auth (hỗ trợ đầy đủ JWT, OAuth, Magic Links)
- **Database**: PostgreSQL (được quản lý bởi Supabase)
- **Realtime**: Supabase Realtime (cho chat và thông báo)
- **Functions**: Supabase Edge Functions (dựa trên Deno)
- **Storage**: Supabase Storage (cho lưu trữ media)
- **Security**: Row Level Security (RLS) của PostgreSQL
- **Client**: Supabase JavaScript Client (cho Next.js/React)

## 2. API Endpoints

Thay vì phải phát triển một cách thủ công các API endpoints, chúng ta sẽ sử dụng:

1. **Supabase Auto-generated APIs** cho CRUD cơ bản
2. **Supabase Edge Functions** cho các endpoint tùy chỉnh hoặc logic phức tạp
3. **Supabase Realtime** cho các tính năng real-time

### API Cơ bản được tự động tạo:

| Chức năng | Mô tả |
|----------|-------|
| **Authentication** | Đăng ký, đăng nhập, quên mật khẩu, xác thực email |
| **Database Access** | CRUD cho tất cả các bảng với quyền truy cập theo RLS |
| **Storage** | Upload, download và quản lý file |
| **Realtime** | Đăng ký các thay đổi database theo thời gian thực |

### Edge Functions cho logic phức tạp:

| Function | Mô tả |
|----------|-------|
| `/functions/matching-algorithm` | Thuật toán ghép cặp |
| `/functions/notifications` | Xử lý và gửi thông báo |
| `/functions/statistics` | Tính toán thống kê và analytics |
| `/functions/media-processing` | Xử lý hình ảnh và media |
| `/functions/video-call-token` | Tạo token cho dịch vụ video call |

## 3. Cơ sở dữ liệu

### Mô hình dữ liệu

#### PostgreSQL (trong Supabase)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  date_of_birth DATE NOT NULL,
  gender VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Preferences
CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES users(id),
  interested_in VARCHAR(20)[] NOT NULL,
  min_age INT NOT NULL,
  max_age INT NOT NULL,
  max_distance INT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  theme VARCHAR(10) DEFAULT 'system',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Matches
CREATE TABLE matches (
  id UUID PRIMARY KEY,
  user_id_1 UUID REFERENCES users(id),
  user_id_2 UUID REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending',
  matched_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id_1, user_id_2)
);

-- Chats
CREATE TABLE chats (
  id UUID PRIMARY KEY,
  match_id UUID REFERENCES matches(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY,
  chat_id UUID REFERENCES chats(id),
  sender_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  sent_at TIMESTAMP DEFAULT NOW()
);

-- Dates
CREATE TABLE dates (
  id UUID PRIMARY KEY,
  match_id UUID REFERENCES matches(id),
  proposer_id UUID REFERENCES users(id),
  date_type VARCHAR(50) NOT NULL,
  date_time TIMESTAMP NOT NULL,
  location TEXT,
  message TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User Actions
CREATE TABLE user_actions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  target_id UUID REFERENCES users(id),
  action_type VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Feed Posts
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  media_urls TEXT[],
  likes_count INT DEFAULT 0,
  comments_count INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Storage Buckets (trong Supabase)

- **avatars**: Ảnh đại diện người dùng
- **posts**: Media cho bài đăng trên feed
- **messages**: File đính kèm trong tin nhắn
- **general**: Các tài nguyên khác của ứng dụng

## 4. Lộ trình triển khai

### Giai đoạn 1: Thiết lập Supabase (1 tuần)
- Tạo dự án Supabase
- Cấu hình authentication
- Tạo schema database
- Thiết lập RLS (Row Level Security)
- Cấu hình storage buckets

### Giai đoạn 2: Phát triển core features (3 tuần)
- Tích hợp authentication với frontend
- Phát triển quản lý người dùng và hồ sơ
- Thiết lập realtime subscriptions
- Tích hợp storage cho upload ảnh

### Giai đoạn 3: Phát triển tính năng xã hội (3 tuần)
- Phát triển hệ thống chat
- Triển khai thuật toán matching
- Tích hợp thông báo và realtime updates

### Giai đoạn 4: Phát triển tính năng nâng cao (3 tuần)
- Phát triển tính năng dating
- Tích hợp dịch vụ video call của bên thứ ba
- Phát triển feed xã hội
- Tối ưu hóa hiệu suất

### Giai đoạn 5: Hoàn thiện và triển khai (2 tuần)
- Kiểm thử toàn diện
- Tối ưu hóa hiệu suất
- Triển khai production

## 5. Kinh nghiệm và thách thức kỹ thuật

### Các vấn đề cần lưu ý
1. **Bảo mật dữ liệu người dùng**
   - Thiết lập chính sách RLS phù hợp
   - Mã hóa thông tin nhạy cảm
   - Tuân thủ GDPR và các quy định về bảo vệ dữ liệu
   
2. **Real-time performance**
   - Tối ưu sử dụng Supabase Realtime
   - Thiết kế cấu trúc dữ liệu phù hợp với realtime
   
3. **Matching algorithm**
   - Phát triển thuật toán ghép cặp trong Edge Functions
   - Sử dụng PostgreSQL cho tính toán matching phức tạp
   
4. **Xử lý ảnh và media**
   - Tối ưu lưu trữ và phân phối ảnh/video với Supabase Storage
   - Thiết lập CDN (có thể sử dụng cùng với Supabase)
   
5. **Scale**
   - Sử dụng các tính năng caching và pooling của Supabase
   - Tối ưu hóa các truy vấn database

## 6. Các công cụ và dịch vụ bên thứ ba

- **Authentication**: Supabase Auth (hỗ trợ Google, Facebook, Email, Phone)
- **Database**: PostgreSQL (được quản lý bởi Supabase)
- **Lưu trữ ảnh**: Supabase Storage
- **Push notifications**: Có thể tích hợp Firebase Cloud Messaging với Supabase
- **Email service**: Tích hợp với SendGrid hoặc Resend
- **Video calls**: Twilio, Agora, hoặc Daily.co (tích hợp qua Edge Functions)
- **Analytics**: Tích hợp Supabase với PostHog hoặc Google Analytics
- **CI/CD**: GitHub Actions

## 7. Kế hoạch bảo mật

- Sử dụng xác thực JWT tích hợp sẵn của Supabase
- Thiết lập Row Level Security (RLS) cho tất cả các bảng
- Mã hóa dữ liệu nhạy cảm
- Triển khai HTTPS
- Sử dụng Supabase Vault cho thông tin nhạy cảm
- Thiết lập các chính sách bảo mật cho từng bucket storage

## 8. Monitoring và Logging

- Sử dụng Supabase Dashboard cho monitoring cơ bản
- Tích hợp với LogTail hoặc các dịch vụ logging khác
- Thiết lập webhook notifications cho các sự cố
- Sử dụng PostgreSQL query performance monitoring

## 9. Lợi ích của giải pháp Supabase

- **Phát triển nhanh hơn**: API tự động, client SDK mạnh mẽ
- **Chi phí thấp hơn**: Free tier rộng rãi, chi phí thấp hơn so với microservices
- **Bảo trì đơn giản**: Một platform duy nhất thay vì nhiều dịch vụ
- **Bảo mật đã được xây dựng sẵn**: RLS, JWT, bucket policies
- **Học tập và bàn giao dễ dàng**: Tài liệu phong phú, cộng đồng hỗ trợ
- **Phù hợp với team nhỏ**: Giảm thiểu thời gian dành cho DevOps và infrastructure

## 10. Kết luận

Chiến lược backend dựa trên Supabase sẽ giúp team phát triển Harmonia nhanh chóng với nguồn lực có giới hạn, đồng thời vẫn đảm bảo tính bảo mật, hiệu suất và khả năng mở rộng. Giải pháp này đặc biệt phù hợp cho đồ án môn học, cho phép team tập trung vào phát triển tính năng thay vì quản lý infrastructure phức tạp. 