export const interestMap: Record<string, { title: string; description: string; image: string }[]> = {
  Travel: [{ title: "Lập kế hoạch du lịch ngắn ngày", description: "Cùng nhau tìm hiểu điểm đến mơ ước và lập plan", image: "/dates/travel.jpg" }],
  Fitness: [{ title: "Chạy bộ buổi sáng", description: "Khỏe mạnh và kết nối cùng nhau", image: "/dates/fitness.jpg" }],
  Reading: [{ title: "Cafe đọc sách", description: "Không gian yên tĩnh để chia sẻ sách hay", image: "/dates/reading.jpg" }],
  Cooking: [{ title: "Nấu ăn cùng nhau", description: "Làm bếp và thưởng thức món ngon", image: "/dates/cooking.jpg" }],
  Photography: [{ title: "Săn ảnh hoàng hôn", description: "Lưu lại khoảnh khắc đẹp bên nhau", image: "/dates/photography.jpg" }],
  Art: [{ title: "Thăm triển lãm nghệ thuật", description: "Chia sẻ góc nhìn sáng tạo", image: "/dates/art.jpg" }],
  Music: [{ title: "Nghe nhạc acoustic", description: "Không gian chill và âm nhạc", image: "/dates/music.jpg" }],
  Movies: [{ title: "Xem phim chiếu rạp", description: "Cùng xem phim và ăn bỏng", image: "/dates/movie.jpg" }],
  Gaming: [{ title: "Chơi Mario Kart hoặc boardgame", description: "Thư giãn và vui vẻ", image: "/dates/gaming.jpg" }],
  Technology: [{ title: "Tham quan TechHub", description: "Khám phá công nghệ mới", image: "/dates/tech.jpg" }],
  Fashion: [{ title: "Đi shopping", description: "Khám phá style thời trang cùng nhau", image: "/dates/fashion.jpg" }],
  Sports: [{ title: "Xem trận đấu thể thao", description: "Cổ vũ và ăn mừng cùng nhau", image: "/dates/sport.jpg" }],
  Hiking: [{ title: "Leo núi nhẹ hoặc dạo đồi", description: "Tận hưởng thiên nhiên", image: "/dates/hiking.jpg" }],
  Yoga: [{ title: "Tập yoga đôi", description: "Thư giãn tâm trí và cơ thể", image: "/dates/yoga.jpg" }],
  Dancing: [{ title: "Lớp nhảy salsa", description: "Nhảy và kết nối cảm xúc", image: "/dates/dancing.jpg" }],
  Writing: [{ title: "Workshop viết", description: "Viết blog, thơ hoặc truyện", image: "/dates/writing.jpg" }],
  Pets: [{ title: "Dắt thú cưng đi dạo", description: "Thư giãn cùng các bé cưng", image: "/dates/pets.jpg" }],
  Food: [{ title: "Khám phá chợ đêm", description: "Ăn vặt và khám phá ẩm thực", image: "/dates/food.jpg" }],
  Coffee: [{ title: "Hẹn ở quán cà phê rooftop", description: "Ngắm view đẹp và trò chuyện", image: "/dates/coffee.jpg" }],
  Wine: [{ title: "Tasting rượu vang", description: "Không khí lãng mạn và tinh tế", image: "/dates/wine.jpg" }],
  Theater: [{ title: "Xem kịch nói", description: "Một trải nghiệm nghệ thuật khác biệt", image: "/dates/theater.jpg" }],
  Concerts: [{ title: "Đi concert", description: "Cháy hết mình cùng âm nhạc", image: "/dates/concert.jpg" }],
  Volunteering: [{ title: "Tham gia thiện nguyện", description: "Cùng nhau tạo ra điều tốt đẹp", image: "/dates/volunteer.jpg" }],
  Meditation: [{ title: "Thiền sáng", description: "Cân bằng và bình an", image: "/dates/meditate.jpg" }],
  Languages: [{ title: "Hẹn nói tiếng Anh/Nhật", description: "Học hỏi và kết nối", image: "/dates/language.jpg" }],
};

export const generateSuggestedDatesByInterests = (interests: string[], count = 4) => {
  const fallback = Object.values(interestMap).flat();
  const pool = interests.reduce((acc, key) => acc.concat(interestMap[key] || []), [] as typeof fallback);

  const source = pool.length ? pool : fallback;
  const shuffled = [...source].sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, count);

  return selected.map((item, i) => ({
    id: i + 1,
    ...item,
    compatibility: Math.floor(Math.random() * 30) + 70,
  }));
};
