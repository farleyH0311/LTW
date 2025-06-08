import { formatDistanceToNow, format } from "date-fns";

export const formatJoinedDate = (dateString) => {
  if (!dateString) {
    return "Invalid date"; // Trả về thông báo khi dateString là chuỗi trống hoặc không có giá trị
  }

  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    console.error("Invalid date string:", dateString);
    return "Invalid date"; // Nếu ngày không hợp lệ, trả về thông báo
  }

  const now = new Date();
  const diffInMs = now - date;
  const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

  if (diffInDays < 1) {
    return `${formatDistanceToNow(date)} ago`;
  } else if (diffInDays < 30) {
    return `${Math.floor(diffInDays)} days ago`;
  } else {
    return `in ${format(date, "MMMM yyyy")}`;
  }
};
