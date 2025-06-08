"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

// Define available languages
type Language = "en" | "vn";

// Define translations
const translations = {
  en: {
    // Common
    "common.darkMode": "Dark Mode",
    "common.lightMode": "Light Mode",
    "common.systemTheme": "System Theme",
    "common.language": "Language",
    "common.english": "English",
    "common.vietnamese": "Tiếng Việt",
    match: "Match",
    activeToday: "Active today",
    viewFullProfile: "View Full Profile",

    // Navigation
    "nav.home": "Home",
    "nav.dashboard": "Dashboard",
    "nav.feed": "Feed",
    "nav.matches": "Matches",
    "nav.messages": "Messages",
    "nav.dating": "Dating",
    "nav.calls": "Calls",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.howItWorks": "How It Works",
    "nav.testimonials": "Success Stories",
    "nav.pricing": "Pricing",
    "nav.signIn": "Sign In",
    "nav.getStarted": "Get Started",
    "nav.logout": "Logout",

    // Landing Page
    "landing.tagline": "AI-Powered Relationship Harmony",
    "landing.title": "Find Your Perfect Harmony",
    "landing.subtitle":
      "Our advanced AI analyzes deep compatibility across multiple dimensions to find your ideal match and create lasting harmony.",
    "landing.startJourney": "Start Your Journey",
    "landing.learnMore": "Learn More",
    "landing.howItWorks": "How It Works",
    "landing.howItWorksSubtitle":
      "Our intelligent matchmaking process is designed to create meaningful connections.",
    "landing.verifiedProfiles": "Verified Profiles",
    "landing.verifiedProfilesDesc":
      "Every profile is thoroughly verified to ensure you're connecting with real people.",
    "landing.aiMatching": "AI-Powered Matching",
    "landing.aiMatchingDesc":
      "Our sophisticated algorithm analyzes personality, values, and goals to find your perfect match.",
    "landing.guidedCommunication": "Guided Communication",
    "landing.guidedCommunicationDesc":
      "Smart ice-breakers and conversation starters help you connect meaningfully.",
    "landing.testimonials": "Success Stories",
    "landing.testimonialsSubtitle":
      "Real connections made through our platform.",
    "landing.pricing": "Membership Plans",
    "landing.pricingSubtitle": "Choose the plan that fits your journey.",
    "landing.basic": "Basic",
    "landing.premium": "Premium",
    "landing.elite": "Elite",
    "landing.popular": "Popular",
    "landing.free": "Free",
    "landing.perMonth": "/month",
    "landing.cta": "Ready to Find Your Perfect Match?",
    "landing.ctaSubtitle":
      "Join thousands of users who have found meaningful connections through our platform.",
    "landing.createProfile": "Create Your Profile",

    // Login
    "login.title": "Welcome Back",
    "login.description": "Sign in to your account to continue your journey",
    "login.email": "Email",
    "login.emailPlaceholder": "Enter your email",
    "login.password": "Password",
    "login.passwordPlaceholder": "Enter your password",
    "login.forgotPassword": "Forgot password?",
    "login.loginButton": "Sign In",
    "login.loggingIn": "Signing in...",
    "login.noAccount": "Don't have an account?",
    "login.signUp": "Sign up",
    "login.showPassword": "Show password",
    "login.hidePassword": "Hide password",
    "login.orContinueWith": "Or continue with",

    // Registration
    "register.step": "Step",
    "register.of": "of",
    "register.createAccount": "Create Your Account",
    "register.createAccountDesc":
      "Let's start with the basics to set up your profile.",
    "register.email": "Email",
    "register.password": "Password",
    "register.confirmPassword": "Confirm Password",
    "register.continue": "Continue",
    "register.cancel": "Cancel",
    "register.back": "Back",
    "register.personalInfo": "Personal Information",
    "register.personalInfoDesc":
      "Tell us a bit about yourself so we can find your perfect match.",
    "register.firstName": "First Name",
    "register.lastName": "Last Name",
    "register.dob": "Date of Birth",
    "register.gender": "Gender",
    "register.male": "Male",
    "register.female": "Female",
    "register.nonBinary": "Non-binary",
    "register.interestedIn": "Interested In",
    "register.men": "Men",
    "register.women": "Women",
    "register.everyone": "Everyone",
    "register.location": "Location",
    "register.personality": "Personality Assessment",
    "register.personalityDesc":
      "This helps our AI understand your personality traits and preferences.",
    "register.completeProfile": "Complete Your Profile",
    "register.completeProfileDesc":
      "Add some final details to make your profile stand out.",
    "register.aboutMe": "About Me",
    "register.aboutMePlaceholder":
      "Tell potential matches about yourself, your interests, and what you're looking for...",
    "register.profilePhoto": "Profile Photo",
    "register.uploadPhoto": "Upload Photo",
    "register.photoDesc":
      "Upload a clear photo of your face. This helps with verification and matching.",
    "register.interests": "Interests",
    "register.interestsDesc":
      "Select interests that represent you. This helps us find compatible matches.",
    "register.relationshipGoals": "Relationship Goals",
    "register.longTerm": "Long-term relationship",
    "register.casual": "Casual dating",
    "register.friendship": "Friendship",
    "register.completeRegistration": "Complete Registration",
    "register.orContinueWith": "Or continue with",

    // Dashboard
    "dashboard.welcome": "Welcome back",
    "dashboard.compatibilityScore": "Your Compatibility Score",
    "dashboard.compatibilityDesc":
      "Your profile is highly compatible with our matching algorithm.",
    "dashboard.newMatches": "New Matches",
    "dashboard.newMatchesDesc":
      "You have new potential matches based on your preferences.",
    "dashboard.profileCompletion": "Profile Completion",
    "dashboard.profileCompletionDesc":
      "Complete your profile to improve your matching quality.",
    "dashboard.matches": "Matches",
    "dashboard.liked": "Liked",
    "dashboard.messages": "Messages",
    "dashboard.dailyRecommendation": "Today's Perfect Match",
    "dashboard.moodMatching": "Mood-Based Matching",
    "dashboard.virtualDatePlanner": "Virtual Date Planner",

    // Profile
    "profile.back": "Back",
    "profile.backToMatches": "Back to Matches",
    "profile.message": "Message",
    "profile.about": "About",
    "profile.interests": "Interests",
    "profile.compatibility": "Compatibility",
    "profile.personality": "Personality",
    "profile.aboutMe": "About Me",
    "profile.lookingFor": "Looking For",
    "profile.basics": "Basics",
    "profile.height": "Height",
    "profile.education": "Education",
    "profile.occupation": "Occupation",
    "profile.relationshipGoals": "Relationship Goals",
    "profile.interestsHobbies": "Interests & Hobbies",
    "profile.compatibilityAnalysis": "Compatibility Analysis",
    "profile.values": "Values",
    "profile.lifestyle": "Lifestyle",
    "profile.communicationStyle": "Communication Style",
    "profile.whyMatch": "Why We Think You'll Match",
    "profile.yourProfile": "Your Profile",
    "profile.viewProfile": "View your profile",
    "profile.long-term":
      "I'm here with the intention of building a serious and meaningful long-term relationship. I'm not interested in short-term flings or casual dating. I value commitment, emotional maturity, and shared goals for the future. If you're also looking for something real and lasting, we might be a good match.",
    "profile.casual":
      "I'm here for something light and casual. I'm not looking for anything too serious right now — just good vibes, good conversations, and seeing where things go. Mutual respect and honesty are important to me. If you're also looking for something chill and pressure-free, we’ll probably get along.",
    "profile.marriage":
      "I'm here with the clear intention of finding someone to build a future with — a serious, committed relationship that can eventually lead to marriage. I'm not into playing games or short-term flings. I believe in love, loyalty, and growing together through all stages of life. If you're also ready for something real and lasting, I’d love to get to know you.",
    "profile.friendship":
      "I'm here to make genuine connections and meaningful friendships. Whether it's chatting about life, sharing interests, or simply having someone to talk to, I'm always open to meeting kind and respectful people. No pressure, no expectations — just real connection.",
    "profile1.long-term": "Long-term relationship",
    "profile1.casual": "Casual dating",
    "profile1.marriage": "Marriage",
    "profile1.friendship": "Friendship",
    "profile.ocean": "Personality",
    "profile.relationshipgoal": "Relationship Perspective",
    "profile.photos": "Photos",
    // Messages"
    "messages.title": "Messages",
    "messages.online": "Online",
    "messages.viewProfile": "View Profile",
    "messages.typeMessage": "Type a message...",

    // Chat
    "chat.searchConversations": "Search conversations...",
    "chat.selectConversation": "Select a conversation",
    "chat.selectConversationDesc":
      "Choose a conversation from the list or start a new one with a match.",
    "chat.typeMessage": "Type a message...",

    // Calls
    "calls.connecting": "Connecting...",
    "calls.ringing": "Ringing...",
    "calls.callEnded": "Call ended",

    // Matches
    "matches.title": "Discover Matches",
    "matches.filters": "Filters",
    "matches.distance": "Distance",
    "matches.ageRange": "Age Range",
    "matches.gender": "Gender",
    "matches.location": "Location",
    "matches.occupation": "Occupation",
    "matches.interesting": "Interests",
    "matches.relationshipGoal": "Relationship Goal",
    "matches.suggestedMatches": "Matches for You",
    "matches.viewAll": "View All Matches",
    "matches.connect": "Connect",
    // Dating
    "dating.title": "Dating",
    "dating.planNewDate": "Plan a Date",
    "dating.upcoming": "Upcoming",
    "dating.past": "Past",
    "dating.suggested": "Suggested",
    "dating.confirmed": "Confirmed",
    "dating.pending": "Pending",
    "dating.message": "Message",
    "dating.reschedule": "Reschedule",
    "dating.planAgain": "Plan Again",
    "dating.planThis": "Plan This",
    "dating.noUpcoming": "No upcoming dates",
    "dating.noUpcomingDesc":
      "You don't have any upcoming dates scheduled. Plan one now!",
    "dating.noPast": "No past dates",
    "dating.noPastDesc":
      "You haven't been on any dates yet. Start by planning one!",

    // Date Planner
    "datePlanner.title": "Plan a Date",
    "datePlanner.description": "Plan a date with {name}",
    "datePlanner.type": "Type",
    "datePlanner.details": "Details",
    "datePlanner.message": "Message",
    "datePlanner.confirm": "Confirm",
    "datePlanner.selectType": "Select a date type",
    "datePlanner.whenField": "When would you like to meet?",
    "datePlanner.whereField": "Where would you like to meet?",
    "datePlanner.locationPlaceholder": "Enter a location",
    "datePlanner.messageField": "Add a personal message",
    "datePlanner.messagePlaceholder":
      "I'd love to get to know you better over coffee...",
    "datePlanner.next": "Next",
    "datePlanner.back": "Back",
    "datePlanner.summary": "Date Summary",
    "datePlanner.dateWith": "Date with {name}",
    "datePlanner.when": "When",
    "datePlanner.where": "Where",
    "datePlanner.send": "Send Date Invitation",

    // Date Types
    "dateTypes.coffee": "Coffee Date",
    "dateTypes.dinner": "Dinner Date",
    "dateTypes.movie": "Movie Date",
    "dateTypes.drinks": "Drinks",
    "dateTypes.concert": "Concert/Show",

    // Feed
    "feed.createPost": "Create Post",
    "feed.postPlaceholder": "Share your thoughts or relationship journey...",
    "feed.addPhoto": "Photo",
    "feed.addVideo": "Video",
    "feed.update": "Update",
    "feed.delete": "Delete",
    "feed.reply": "Reply",
    "feed.nocmt": "No comments yet",
    "feed.writecmt": "Write a comment...",
    "feed.writereply": "Write a reply...",
    "feed.send": "Send",
    "feed.cancel": "Cancel",
    "feed.watch": "View",
    "feed.replies": "replies",
    "feed.save": "Save",
    "feed.changpw": "Change password",
    "feed.cnupdate": "Update profile",
    "feed.cndelete": "Delete account",

    // Footer
    "footer.rights": "All rights reserved.",
    "footer.privacy": "Privacy",
    "footer.terms": "Terms",
    "footer.contact": "Contact",
  },
  vn: {
    // Common
    "common.darkMode": "Chế độ tối",
    "common.lightMode": "Chế độ sáng",
    "common.systemTheme": "Chế độ hệ thống",
    "common.language": "Ngôn ngữ",
    "common.english": "Tiếng Anh",
    "common.vietnamese": "Tiếng Việt",
    match: "Phù hợp",
    activeToday: "Hoạt động hôm nay",
    viewFullProfile: "Xem hồ sơ đầy đủ",

    // Navigation
    "nav.home": "Trang chủ",
    "nav.dashboard": "Bảng điều khiển",
    "nav.feed": "Bảng tin",
    "nav.matches": "Kết nối",
    "nav.messages": "Tin nhắn",
    "nav.dating": "Hẹn hò",
    "nav.calls": "Cuộc gọi",
    "nav.profile": "Hồ sơ",
    "nav.settings": "Cài đặt",
    "nav.howItWorks": "Cách hoạt động",
    "nav.testimonials": "Câu chuyện thành công",
    "nav.pricing": "Gói thành viên",
    "nav.signIn": "Đăng nhập",
    "nav.getStarted": "Bắt đầu",
    "nav.logout": "Đăng xuất",

    // Landing Page
    "landing.tagline": "Hòa hợp mối quan hệ bằng AI",
    "landing.title": "Tìm sự hòa hợp hoàn hảo của bạn",
    "landing.subtitle":
      "AI tiên tiến của chúng tôi phân tích sự tương thích sâu sắc trên nhiều khía cạnh để tìm người phù hợp nhất và tạo ra sự hòa hợp lâu dài.",
    "landing.startJourney": "Bắt đầu hành trình",
    "landing.learnMore": "Tìm hiểu thêm",
    "landing.howItWorks": "Cách thức hoạt động",
    "landing.howItWorksSubtitle":
      "Quy trình kết nối thông minh của chúng tôi được thiết kế để tạo ra những mối quan hệ có ý nghĩa.",
    "landing.verifiedProfiles": "Hồ sơ đã xác minh",
    "landing.verifiedProfilesDesc":
      "Mọi hồ sơ đều được xác minh kỹ lưỡng để đảm bảo bạn kết nối với người thật.",
    "landing.aiMatching": "Kết nối bằng AI",
    "landing.aiMatchingDesc":
      "Thuật toán tinh vi của chúng tôi phân tích tính cách, giá trị và mục tiêu để tìm người phù hợp nhất với bạn.",
    "landing.guidedCommunication": "Giao tiếp có hướng dẫn",
    "landing.guidedCommunicationDesc":
      "Các câu mở đầu thông minh giúp bạn kết nối một cách có ý nghĩa.",
    "landing.testimonials": "Câu chuyện thành công",
    "landing.testimonialsSubtitle":
      "Những kết nối thực tế được tạo ra thông qua nền tảng của chúng tôi.",
    "landing.pricing": "Gói thành viên",
    "landing.pricingSubtitle": "Chọn gói phù hợp với hành trình của bạn.",
    "landing.basic": "Cơ bản",
    "landing.premium": "Cao cấp",
    "landing.elite": "Ưu tú",
    "landing.popular": "Phổ biến",
    "landing.free": "Miễn phí",
    "landing.perMonth": "/tháng",
    "landing.cta": "Sẵn sàng tìm người phù hợp nhất?",
    "landing.ctaSubtitle":
      "Tham gia cùng hàng nghìn người dùng đã tìm thấy kết nối có ý nghĩa thông qua nền tảng của chúng tôi.",
    "landing.createProfile": "Tạo hồ sơ của bạn",

    // Login
    "login.title": "Chào mừng trở lại",
    "login.description":
      "Đăng nhập vào tài khoản của bạn để tiếp tục hành trình",
    "login.email": "Email",
    "login.emailPlaceholder": "Nhập email của bạn",
    "login.password": "Mật khẩu",
    "login.passwordPlaceholder": "Nhập mật khẩu của bạn",
    "login.forgotPassword": "Quên mật khẩu?",
    "login.loginButton": "Đăng nhập",
    "login.loggingIn": "Đang đăng nhập...",
    "login.noAccount": "Chưa có tài khoản?",
    "login.signUp": "Đăng ký",
    "login.showPassword": "Hiện mật khẩu",
    "login.hidePassword": "Ẩn mật khẩu",
    "login.orContinueWith": "Hoặc tiếp tục với",

    // Registration
    "register.step": "Bước",
    "register.of": "của",
    "register.createAccount": "Tạo tài khoản của bạn",
    "register.createAccountDesc":
      "Hãy bắt đầu với những thông tin cơ bản để thiết lập hồ sơ của bạn.",
    "register.email": "Email",
    "register.password": "Mật khẩu",
    "register.confirmPassword": "Xác nhận mật khẩu",
    "register.continue": "Tiếp tục",
    "register.cancel": "Hủy",
    "register.back": "Quay lại",
    "register.personalInfo": "Thông tin cá nhân",
    "register.personalInfoDesc":
      "Hãy cho chúng tôi biết một chút về bạn để chúng tôi có thể tìm người phù hợp nhất.",
    "register.firstName": "Tên",
    "register.lastName": "Họ",
    "register.dob": "Ngày sinh",
    "register.gender": "Giới tính",
    "register.male": "Nam",
    "register.female": "Nữ",
    "register.nonBinary": "Phi nhị phân",
    "register.interestedIn": "Quan tâm đến",
    "register.men": "Nam",
    "register.women": "Nữ",
    "register.everyone": "Tất cả",
    "register.location": "Vị trí",
    "register.personality": "Đánh giá tính cách",
    "register.personalityDesc":
      "Điều này giúp AI của chúng tôi hiểu đặc điểm tính cách và sở thích của bạn.",
    "register.completeProfile": "Hoàn thành hồ sơ của bạn",
    "register.completeProfileDesc":
      "Thêm một số chi tiết cuối cùng để làm nổi bật hồ sơ của bạn.",
    "register.aboutMe": "Về tôi",
    "register.aboutMePlaceholder":
      "Hãy kể cho những người phù hợp tiềm năng về bản thân, sở thích và những gì bạn đang tìm kiếm...",
    "register.profilePhoto": "Ảnh hồ sơ",
    "register.uploadPhoto": "Tải ảnh lên",
    "register.photoDesc":
      "Tải lên một bức ảnh rõ nét về khuôn mặt của bạn. Điều này giúp xác minh và kết nối.",
    "register.interests": "Sở thích",
    "register.interestsDesc":
      "Chọn sở thích đại diện cho bạn. Điều này giúp chúng tôi tìm người phù hợp.",
    "register.relationshipGoals": "Mục tiêu mối quan hệ",
    "register.longTerm": "Mối quan hệ lâu dài",
    "register.casual": "Hẹn hò thông thường",
    "register.friendship": "Tình bạn",
    "register.completeRegistration": "Hoàn thành đăng ký",
    "register.orContinueWith": "Hoặc tiếp tục với",

    // Dashboard
    "dashboard.welcome": "Chào mừng trở lại",
    "dashboard.compatibilityScore": "Điểm tương thích của bạn",
    "dashboard.compatibilityDesc":
      "Hồ sơ của bạn rất tương thích với thuật toán kết nối của chúng tôi.",
    "dashboard.newMatches": "Kết nối mới",
    "dashboard.newMatchesDesc":
      "Bạn có những kết nối tiềm năng mới dựa trên sở thích của bạn.",
    "dashboard.profileCompletion": "Hoàn thành hồ sơ",
    "dashboard.profileCompletionDesc":
      "Hoàn thành hồ sơ của bạn để cải thiện chất lượng kết nối.",
    "dashboard.matches": "Kết nối",
    "dashboard.liked": "Đã thích",
    "dashboard.messages": "Tin nhắn",
    "dashboard.dailyRecommendation": "Người phù hợp nhất hôm nay",
    "dashboard.moodMatching": "Kết nối theo tâm trạng",
    "dashboard.virtualDatePlanner": "Lập kế hoạch hẹn hò ảo",

    // Profile
    "profile.back": "Quay lại",
    "profile.backToMatches": "Quay lại kết nối",
    "profile.message": "Nhắn tin",
    "profile.about": "Giới thiệu",
    "profile.interests": "Sở thích",
    "profile.compatibility": "Tương thích",
    "profile.personality": "Tính cách",
    "profile.aboutMe": "Về tôi",
    "profile.lookingFor": "Đang tìm kiếm",
    "profile.basics": "Cơ bản",
    "profile.height": "Chiều cao",
    "profile.education": "Học vấn",
    "profile.occupation": "Nghề nghiệp",
    "profile.relationshipGoal": "Mục tiêu mối quan hệ",
    "profile.interestsHobbies": "Sở thích & Thú vui",
    "profile.compatibilityAnalysis": "Phân tích tương thích",
    "profile.values": "Giá trị",
    "profile.lifestyle": "Lối sống",
    "profile.communicationStyle": "Phong cách giao tiếp",
    "profile.whyMatch": "Tại sao chúng tôi nghĩ bạn sẽ phù hợp",
    "profile.yourProfile": "Hồ sơ của bạn",
    "profile.viewProfile": "Xem hồ sơ của bạn",
    "profile.long-term":
      "Mình đến đây với mong muốn tìm một mối quan hệ nghiêm túc và lâu dài. Không tìm kiếm những mối quan hệ thoáng qua hay hẹn hò cho vui. Mình trân trọng sự cam kết, trưởng thành trong cảm xúc và có cùng định hướng tương lai. Nếu bạn cũng đang tìm điều gì đó chân thành và bền vững, có lẽ chúng ta sẽ hợp nhau.",
    "profile.casual":
      "Mình đến đây với mong muốn tìm một mối quan hệ thoải mái, không quá ràng buộc. Hiện tại chưa tìm kiếm điều gì quá nghiêm túc — chỉ cần những cuộc trò chuyện vui vẻ, năng lượng tích cực và để mọi thứ diễn ra tự nhiên. Mình đề cao sự tôn trọng và trung thực. Nếu bạn cũng đang tìm một kết nối nhẹ nhàng và không áp lực, có thể chúng ta sẽ hợp nhau.",
    "profile.marriage":
      "Mình đến đây với mục tiêu rõ ràng là tìm một người có thể cùng nhau xây dựng tương lai — một mối quan hệ nghiêm túc, có cam kết và tiến xa đến hôn nhân. Mình không tìm kiếm những cuộc vui thoáng qua hay thử cho biết. Mình tin vào tình yêu, sự thủy chung và cùng nhau trưởng thành qua từng giai đoạn của cuộc sống. Nếu bạn cũng sẵn sàng cho một điều gì đó thật sự nghiêm túc và bền vững, mình rất muốn được làm quen.",
    "profile.friendship":
      "Mình đến đây để xây dựng những tình bạn ý nghĩa, dựa trên sự tin tưởng và tôn trọng. Muốn gặp gỡ những người thích những cuộc trò chuyện vui vẻ, có vài sở thích chung và trân trọng sự chân thành. Không áp lực hay kỳ vọng — chỉ cần những kết nối thật lòng.",
    "profile1.long-term": "Mối quan hệ lâu dài",
    "profile1.casual": "Hẹn hò không ràng buộc",
    "profile1.marriage": "Kết hôn",
    "profile1.friendship": "Bạn bè",
    "profile.ocean": "Tính cách",
    "profile.relationshipgoal": "Quan điểm về mối quan hệ",
    "profile.relationshipGoals": "Mục tiêu mối quan hệ",
    "profile.photos": "Ảnh",

    // Messages
    "messages.title": "Tin nhắn",
    "messages.online": "Trực tuyến",
    "messages.viewProfile": "Xem hồ sơ",
    "messages.typeMessage": "Nhập tin nhắn...",

    // Matches
    "matches.gender": "Giới tính",
    "matches.location": "Vị trí",
    "matches.occupation": "Nghề nghiệp",
    "matches.interesting": "Sở thích",
    "matches.goal": "Mục tiêu mối quan hệ",
    "matches.suggestedMatches": "Gợi ý kết đôi",
    "matches.viewAll": "Xem tất cả",
    "matches.connect": "Kết nối",

    // Chat
    "chat.searchConversations": "Tìm kiếm cuộc trò chuyện...",
    "chat.selectConversation": "Chọn một cuộc trò chuyện",
    "chat.selectConversationDesc":
      "Chọn một cuộc trò chuyện từ danh sách hoặc bắt đầu một cuộc trò chuyện mới với một kết nối.",
    "chat.typeMessage": "Nhập tin nhắn...",

    // Calls
    "calls.connecting": "Đang kết nối...",
    "calls.ringing": "Đang đổ chuông...",
    "calls.callEnded": "Cuộc gọi kết thúc",

    // Matches
    "matches.title": "Khám phá kết nối",
    "matches.filters": "Bộ lọc",
    "matches.distance": "Khoảng cách",
    "matches.ageRange": "Độ tuổi",

    // Dating
    "dating.title": "Hẹn hò",
    "dating.planNewDate": "Lập kế hoạch hẹn hò",
    "dating.upcoming": "Sắp tới",
    "dating.past": "Đã qua",
    "dating.suggested": "Đề xuất",
    "dating.confirmed": "Đã xác nhận",
    "dating.pending": "Đang chờ",
    "dating.message": "Nhắn tin",
    "dating.reschedule": "Đổi lịch",
    "dating.planAgain": "Lập kế hoạch lại",
    "dating.planThis": "Lập kế hoạch",
    "dating.noUpcoming": "Không có cuộc hẹn sắp tới",
    "dating.noUpcomingDesc":
      "Bạn không có cuộc hẹn nào sắp tới. Hãy lập kế hoạch ngay!",
    "dating.noPast": "Không có cuộc hẹn đã qua",
    "dating.noPastDesc":
      "Bạn chưa có cuộc hẹn nào. Hãy bắt đầu bằng cách lập kế hoạch!",

    // Date Planner
    "datePlanner.title": "Lập kế hoạch hẹn hò",
    "datePlanner.description": "Lập kế hoạch hẹn hò với {name}",
    "datePlanner.type": "Loại",
    "datePlanner.details": "Chi tiết",
    "datePlanner.message": "Tin nhắn",
    "datePlanner.confirm": "Xác nhận",
    "datePlanner.selectType": "Chọn loại hẹn hò",
    "datePlanner.whenField": "Khi nào bạn muốn gặp?",
    "datePlanner.whereField": "Bạn muốn gặp ở đâu?",
    "datePlanner.locationPlaceholder": "Nhập địa điểm",
    "datePlanner.messageField": "Thêm tin nhắn cá nhân",
    "datePlanner.messagePlaceholder":
      "Tôi muốn tìm hiểu bạn nhiều hơn qua một tách cà phê...",
    "datePlanner.next": "Tiếp theo",
    "datePlanner.back": "Quay lại",
    "datePlanner.summary": "Tóm tắt cuộc hẹn",
    "datePlanner.dateWith": "Hẹn hò với {name}",
    "datePlanner.when": "Khi nào",
    "datePlanner.where": "Ở đâu",
    "datePlanner.send": "Gửi lời mời hẹn hò",

    // Date Types
    "dateTypes.coffee": "Hẹn hò cà phê",
    "dateTypes.dinner": "Hẹn hò ăn tối",
    "dateTypes.movie": "Hẹn hò xem phim",
    "dateTypes.drinks": "Đồ uống",
    "dateTypes.concert": "Hòa nhạc/Biểu diễn",

    // Feed
    "feed.createPost": "Tạo bài viết",
    "feed.postPlaceholder":
      "Chia sẻ suy nghĩ hoặc hành trình mối quan hệ của bạn...",
    "feed.addPhoto": "Ảnh",
    "feed.addVideo": "Video",
    "feed.update": "Cập nhật",
    "feed.delete": "Xóa",
    "feed.reply": "Trả lời",
    "feed.nocmt": "Chưa có bình luận nào",
    "feed.writecmt": "Viết bình luận...",
    "feed.writereply": "Viết trả lời...",
    "feed.send": "Gửi",
    "feed.cancel": "Hủy",
    "feed.watch": "Xem",
    "feed.replies": "trả lời",
    "feed.save": "Lưu",
    "feed.changpw": "Thay đổi mật khẩu",
    "feed.cnupdate": "Cập nhật hồ sơ",
    "feed.cndelete": "Xóa tài khoản",

    // Footer
    "footer.rights": "Đã đăng ký bản quyền.",
    "footer.privacy": "Quyền riêng tư",
    "footer.terms": "Điều khoản",
    "footer.contact": "Liên hệ",
  },
};

// Create context
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

// Provider component
export function LanguageProvider({ children }: { children: ReactNode }) {
  // Initialize with browser language or default to English
  const [language, setLanguage] = useState<Language>("en");

  // Load saved language preference from localStorage on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "vn")) {
      setLanguage(savedLanguage);
    }
  }, []);

  // Save language preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  // Translation function with parameter support
  const t = (key: string, params?: Record<string, string>): string => {
    let translation =
      translations[language][
        key as keyof (typeof translations)[typeof language]
      ] || key;

    // Replace parameters if provided
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value);
      });
    }

    return translation;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

// Custom hook to use the language context
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
