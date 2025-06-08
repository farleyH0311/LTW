# Hướng dẫn Components - Dự án Harmonia

## Giới thiệu

Tài liệu này cung cấp thông tin chi tiết về hệ thống components trong dự án Harmonia, bao gồm cách sử dụng, tạo mới và tùy chỉnh components. Harmonia sử dụng kết hợp giữa Shadcn UI và các custom components để xây dựng giao diện thống nhất và dễ bảo trì.

## Nguyên tắc sử dụng Components

1. **Tái sử dụng tối đa**: Ưu tiên sử dụng components đã có thay vì tạo mới
2. **Tính module hóa**: Mỗi component nên thực hiện một chức năng rõ ràng
3. **Khả năng tùy biến**: Components phải dễ dàng tùy chỉnh thông qua props
4. **Phù hợp với thiết kế**: Tuân thủ design system của dự án
5. **Trải nghiệm tốt trên mobile**: Phải hoạt động tốt trên các thiết bị di động

## Cấu trúc thư mục Components

```
components/
├── ui/                 # Shadcn UI components
├── navigation/         # Components điều hướng
│   ├── app-navigation.tsx    # Navigation cho desktop
│   └── mobile-navigation.tsx # Navigation cho mobile
├── profile/            # Components liên quan đến hồ sơ người dùng
├── interactive/        # Components tương tác như card swipe
├── ui-effects/         # Components hiệu ứng UI
├── language-provider.tsx # Provider đa ngôn ngữ
└── theme-provider.tsx  # Provider cho theme sáng/tối
```

## Shadcn UI Components

Dự án sử dụng thư viện Shadcn UI, một tập hợp các components có thể tùy chỉnh dựa trên Radix UI và Tailwind CSS.

### Cài đặt component mới từ Shadcn UI

```bash
npx shadcn@latest add <component-name>
```

Ví dụ:

```bash
npx shadcn@latest add button
npx shadcn@latest add dropdown-menu
npx shadcn@latest add dialog
```

### Những components UI chính

| Component | Mô tả | Import từ |
|-----------|-------|-----------|
| Button | Các loại button với nhiều variants | `@/components/ui/button` |
| Card | Container cho nội dung liên quan | `@/components/ui/card` |
| Dialog | Modal dialog | `@/components/ui/dialog` |
| Form | Components xây dựng form | `@/components/ui/form` |
| Tabs | Chuyển đổi giữa các view | `@/components/ui/tabs` |
| Toast | Thông báo tạm thời | `@/components/ui/toast` |
| Sheet | Overlay panel từ cạnh màn hình | `@/components/ui/sheet` |

### Cách sử dụng

```tsx
import { Button } from "@/components/ui/button"

export function MyComponent() {
  return (
    <Button variant="default" size="lg" onClick={() => console.log("Clicked!")}>
      Click me
    </Button>
  )
}
```

### Tùy chỉnh variants

Các components của Shadcn UI sử dụng `cva` từ thư viện `class-variance-authority` để quản lý variants. Bạn có thể tùy chỉnh hoặc thêm variants mới bằng cách chỉnh sửa file component tương ứng.

Ví dụ tùy chỉnh variants cho Button:

```tsx
// components/ui/button.tsx
export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md...",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        // Thêm variant mới
        harmonia: "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:opacity-90",
      },
      // ...
    }
  }
)
```

## Custom Components

### Navigation Components

#### AppNavigation

```tsx
import { AppNavigation } from "@/components/navigation/app-navigation"

// Trong layout
<AppNavigation />
```

Hiển thị thanh điều hướng chính trên desktop, bao gồm các liên kết đến các trang chính và nút đăng xuất.

#### MobileNavigation

```tsx
import { MobileNavigation } from "@/components/navigation/mobile-navigation"

// Trong layout
<MobileNavigation />
```

Hiển thị thanh điều hướng cho thiết bị di động ở dưới cùng của màn hình, đi kèm với nút đăng xuất dạng floating button.

### Provider Components

#### LanguageProvider

```tsx
// _app.tsx hoặc layout.tsx
import { LanguageProvider } from "@/components/language-provider"

export default function Layout({ children }) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  )
}

// Sử dụng trong component
import { useLanguage } from "@/components/language-provider"

function MyComponent() {
  const { t, setLanguage, language } = useLanguage()
  
  return (
    <div>
      <h1>{t("common.welcome")}</h1>
      <button onClick={() => setLanguage("vn")}>
        {t("common.vietnamese")}
      </button>
    </div>
  )
}
```

LanguageProvider cung cấp khả năng đa ngôn ngữ (Tiếng Anh và Tiếng Việt) cho ứng dụng.

#### ThemeProvider

```tsx
// _app.tsx hoặc layout.tsx
import { ThemeProvider } from "@/components/theme-provider"

export default function Layout({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

ThemeProvider quản lý theme sáng/tối của ứng dụng.

### Interactive Components

#### CompatibilityChart

```tsx
import { CompatibilityChart } from "@/components/compatibility-chart"

function ProfilePage() {
  return (
    <CompatibilityChart 
      scores={{
        values: 85,
        personality: 70,
        lifestyle: 90,
        goals: 75,
        communication: 80
      }}
    />
  )
}
```

Hiển thị biểu đồ radar về độ tương thích giữa người dùng.

#### PersonalityRadarChart

```tsx
import { PersonalityRadarChart } from "@/components/personality-radar-chart"

function ProfilePage() {
  return (
    <PersonalityRadarChart 
      traits={{
        openness: 0.8,
        conscientiousness: 0.7,
        extraversion: 0.5,
        agreeableness: 0.9,
        neuroticism: 0.3
      }}
    />
  )
}
```

Hiển thị biểu đồ radar về các đặc điểm tính cách.

## Tạo Custom Component Mới

### Quy trình tạo component

1. **Xác định yêu cầu**: Rõ ràng về chức năng và giao diện của component
2. **Kiểm tra components hiện có**: Tránh tạo trùng lặp
3. **Thiết kế API**: Xác định props và behavior
4. **Implement component**: Tuân thủ các nguyên tắc đã đề ra
5. **Viết documentation**: Thêm JSDoc và giải thích cách sử dụng

### Template cơ bản

```tsx
/**
 * MyCustomComponent - Mô tả ngắn gọn về component
 * 
 * @param title - Tiêu đề của component
 * @param children - Nội dung bên trong
 * @param variant - Biến thể giao diện (default, large, compact)
 */
import { cn } from "@/lib/utils"
import React from "react"

interface MyCustomComponentProps {
  title?: string
  children: React.ReactNode
  variant?: "default" | "large" | "compact"
  className?: string
}

export function MyCustomComponent({
  title,
  children,
  variant = "default",
  className,
}: MyCustomComponentProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        variant === "large" && "p-6 text-lg",
        variant === "compact" && "p-2 text-sm",
        className
      )}
    >
      {title && <h3 className="mb-2 font-medium">{title}</h3>}
      <div>{children}</div>
    </div>
  )
}
```

### Ví dụ component với state

```tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SubmitButtonProps {
  text: string
  loadingText?: string
  onClick?: () => Promise<void>
  className?: string
}

export function SubmitButton({
  text,
  loadingText = "Đang xử lý...",
  onClick,
  className,
}: SubmitButtonProps) {
  const [loading, setLoading] = useState(false)
  
  const handleClick = async () => {
    if (loading || !onClick) return
    
    setLoading(true)
    try {
      await onClick()
    } catch (error) {
      console.error("Error in SubmitButton:", error)
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <Button
      className={cn("w-full", className)}
      disabled={loading}
      onClick={handleClick}
    >
      {loading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        text
      )}
    </Button>
  )
}
```

## Các pattern thường dùng

### Compound Components

Pattern khi một component cha cung cấp context cho các component con, tạo API dễ sử dụng.

```tsx
import { createContext, useContext, useState } from "react"

// Context
const TabsContext = createContext(null)

// Provider component
function Tabs({ children, defaultValue }) {
  const [value, setValue] = useState(defaultValue)
  
  return (
    <TabsContext.Provider value={{ value, setValue }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

// Child components
function TabsList({ children }) {
  return <div className="tabs-list">{children}</div>
}

function TabsTrigger({ value, children }) {
  const context = useContext(TabsContext)
  const isActive = context.value === value
  
  return (
    <button
      className={`tabs-trigger ${isActive ? "active" : ""}`}
      onClick={() => context.setValue(value)}
    >
      {children}
    </button>
  )
}

function TabsContent({ value, children }) {
  const context = useContext(TabsContext)
  
  if (context.value !== value) return null
  
  return <div className="tabs-content">{children}</div>
}

// Compose the API
Tabs.List = TabsList
Tabs.Trigger = TabsTrigger
Tabs.Content = TabsContent

// Export
export { Tabs }
```

### Render Props

Pattern cho phép component cha kiểm soát cách render component con.

```tsx
interface ListProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li key={index}>{renderItem(item, index)}</li>
      ))}
    </ul>
  )
}

// Usage
<List
  items={['Apple', 'Banana', 'Orange']}
  renderItem={(fruit) => (
    <span className="font-medium">{fruit}</span>
  )}
/>
```

### HOC (Higher Order Component)

Pattern bao bọc component với các chức năng bổ sung.

```tsx
interface WithAuthenticationProps {
  isAuthenticated: boolean
}

function withAuthentication<P extends object>(
  Component: React.ComponentType<P>
) {
  return function WithAuthentication(props: P & WithAuthenticationProps) {
    const { isAuthenticated, ...rest } = props
    
    if (!isAuthenticated) {
      return <div>Please login to view this content</div>
    }
    
    return <Component {...(rest as P)} />
  }
}

// Usage
const ProtectedComponent = withAuthentication(MyComponent)
```

## Responsive Design

### Nguyên tắc Mobile-First

Tất cả components nên được thiết kế theo nguyên tắc mobile-first, sử dụng media queries của Tailwind CSS.

```tsx
<div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
  <div className="w-full md:w-1/3">Sidebar</div>
  <div className="w-full md:w-2/3">Main content</div>
</div>
```

### Breakpoints

| Prefix | Min width | CSS |
|--------|-----------|-----|
| `sm` | 640px | `@media (min-width: 640px) { ... }` |
| `md` | 768px | `@media (min-width: 768px) { ... }` |
| `lg` | 1024px | `@media (min-width: 1024px) { ... }` |
| `xl` | 1280px | `@media (min-width: 1280px) { ... }` |
| `2xl` | 1536px | `@media (min-width: 1536px) { ... }` |

## Best Practices

1. **Đặt tên component có ý nghĩa**: Tên phải mô tả rõ chức năng
2. **Sử dụng TypeScript interface/type**: Định nghĩa rõ ràng các props
3. **Sử dụng cn utility**: Dùng `cn` từ `@/lib/utils` để merge classNames
4. **Thiết kế có sẵn dark mode**: Sử dụng các biến CSS từ Shadcn UI
5. **Sử dụng JSDoc comment**: Viết comment cho các props quan trọng
6. **Tách logic phức tạp**: Sử dụng hooks để tách logic

## Troubleshooting

### Lỗi thường gặp và cách xử lý

1. **Component không render đúng trên mobile**
   - Kiểm tra responsive classes
   - Kiểm tra z-index
   - Kiểm tra overflow properties

2. **Client component không hoạt động**
   - Kiểm tra xem đã thêm "use client" directive chưa
   - Đảm bảo tất cả hooks được sử dụng đúng cách

3. **Type errors trong components**
   - Kiểm tra interface/types
   - Đảm bảo props được sử dụng đúng

## Kết luận

Hướng dẫn này cung cấp thông tin cơ bản về hệ thống components trong dự án Harmonia. Tuân thủ các nguyên tắc và pattern đã đề ra sẽ giúp xây dựng UI thống nhất, dễ bảo trì và hiệu quả. 