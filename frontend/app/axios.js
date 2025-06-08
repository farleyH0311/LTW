import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  //console.log("Interceptor token:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
    //console.log("Header Authorization set:", config.headers.Authorization);
  }
  return config;
});
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = "Bearer " + token;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const response = await instance.post("/api/auth/refresh");

        const newAccessToken = response.data.accessToken;

        localStorage.setItem("accessToken", newAccessToken);
        instance.defaults.headers.common["Authorization"] =
          "Bearer " + newAccessToken;
        originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

        processQueue(null, newAccessToken);

        return instance(originalRequest);
      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem("accessToken");
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const addProfile = async (id, profileData) => {
  try {
    const response = await instance.post(
      `/api/users/${id}/profile`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error("Error adding profile:", error);
    throw error;
  }
};

export const updateProfile = async (id, profileData) => {
  try {
    const response = await instance.put(
      `/api/users/${id}/profile`,
      profileData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};
export const getProfileByUserId = async (userId) => {
  try {
    const response = await instance.get(`/api/users/${userId}/profile`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
export const getProfileById = async (Id) => {
  try {
    const response = await instance.get(`/api/users/${Id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
export const getAllProfiles = async () => {
  try {
    const response = await instance.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching all profiles:", error);
    throw error;
  }
};

export const login = async (data) => {
  try {
    const response = await instance.post("/api/auth/login", data, {
      withCredentials: true,
    });
    console.log("Dữ liệu trả về từ API login:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error login:", error);
    throw error;
  }
};
export const register = async (data) => {
  try {
    const response = await instance.post("/api/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Error register:", error);
    throw error;
  }
};
export const logout = async () => {
  try {
    const response = await instance.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );

    console.log("Logout thành công:", response.data);
    return response.data;
  } catch (error) {
    console.error("Lỗi khi logout:", error);
    throw error;
  }
};
export const deleteAccount = async (userId) => {
  try {
    const response = await instance.delete(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting account:",
      error.response?.data || error.message
    );
    throw error;
  }
};
//post
export const createPost = async (data) => {
  console.log(
    "Access Token before createPost:",
    localStorage.getItem("accessToken")
  );

  try {
    const response = await instance.post("/api/posts", data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating post:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getAllPosts = async () => {
  try {
    const response = await instance.get("/api/posts");
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.status);
      console.error("Error details:", error.response.data);
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    throw error;
  }
};
export const handleLike = async (postId, userId) => {
  try {
    const response = await instance.post(`/api/posts/${postId}/like`, {
      userId,
    });
    return response;
  } catch (err) {
    console.error("Error:", err.response?.data || err.message);
    throw err;
  }
};
//cmt
export const createComment = async (
  postId,
  userId,
  content,
  parentCommentId
) => {
  try {
    const response = await instance.post(`/api/posts/${postId}/comments`, {
      userId,
      content,
      parentCommentId: parentCommentId ?? null,
      postId,
    });

    return response.data;
  } catch (error) {
    console.error(
      "Lỗi khi tạo bình luận:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

export const getCommentsByPost = async (postId) => {
  try {
    const res = await instance.get(`/api/posts/${postId}/comments`);
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi lấy bình luận:",
      error?.response?.data || error.message
    );
    throw error;
  }
};
export const updateComment = async (userId, commentId, data) => {
  try {
    const res = await instance.put(
      `/api/posts/${userId}/${commentId}/comments`,
      data
    );
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi sửa bình luận:",
      error?.response?.data || error.message
    );
    throw error;
  }
};
export const deleteComment = async (userId, commentId) => {
  try {
    const res = await instance.delete(
      `/api/posts/${userId}/${commentId}/comments`
    );
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi xóa bình luận:",
      error?.response?.data || error.message
    );
    throw error;
  }
};
export const deletePost = async (userId, postId) => {
  try {
    const res = await instance.delete(`/api/posts/${userId}/${postId}`);
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi xóa bài viết:",
      error?.response?.data || error.message
    );
    throw error;
  }
};
export const updatePost = async (userId, postId, data) => {
  try {
    const res = await instance.put(`/api/posts/${userId}/${postId}`, data);
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi sửa bài viết:",
      error?.response?.data || error.message
    );
    throw error;
  }
};

export const verifyOtp = async (email, otp) => {
  try {
    const res = await instance.post("/api/auth/verify-otp", {
      email,
      otp,
    });
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi xác thực OTP:",
      error?.response?.data || error.message
    );
    throw error;
  }
};
export const loginWithGoogle = async (idToken) => {
  try {
    //console.log("Đang gửi idToken lên backend:", idToken);
    const response = await instance.post("/api/auth/google-login", { idToken });

    const { accessToken, user } = response.data;

    if (!accessToken || !user) {
      throw new Error("Backend trả dữ liệu không hợp lệ");
    }
    localStorage.setItem("accessToken", accessToken);
    //console.log("Đăng nhập thành công, user:", user);
    return user;
  } catch (error) {
    console.error(
      "Lỗi khi đăng nhập bằng Google:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};

export const sendOtp = async (email) => {
  try {
    const response = await instance.post("/api/auth/send-otp", { email });
    return response.data;
  } catch (error) {
    console.error("Lỗi khi gửi OTP:", error);
    throw error;
  }
};
export const resetPassword = async (email, newPassword, confirmPassword) => {
  try {
    const response = await instance.post("/api/auth/reset-password", {
      email,
      newPassword,
      confirmPassword,
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};
export const changePassword = async (
  oldPassword,
  newPassword,
  confirmPassword
) => {
  try {
    const res = await instance.patch("/api/auth/change-password", {
      oldPassword,
      newPassword,
      confirmPassword,
    });
    return res.data;
  } catch (error) {
    console.error(
      "Lỗi khi đổi mật khẩu:",
      error?.response?.data || error.message
    );
    throw error;
  }
};
export const createPersonalityTest = async (data) => {
  try {
    const response = await instance.post("/api/personality-test", data);
    return response.data;
  } catch (error) {
    console.error(
      "Error creating personality test:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getPersonalityTest = async (userId) => {
  try {
    const response = await instance.get(`/api/personality-test/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error getting personality test:",
      error.response?.data || error.message
    );
    throw error;
  }
};
export const getCompatibilityResults = async (userId, candidateIds) => {
  try {
    if (!Array.isArray(candidateIds)) {
      candidateIds = [candidateIds];
    }
    const response = await instance.get(
      `/api/matches/compatibility/${userId}`,
      {
        params: {
          candidateIds: candidateIds.join(","),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching compatibility results:", error);
    throw error;
  }
};

export const getUserIdByProfileId = async (profileId) => {
  try {
    const response = await instance.get(`/api/users/userId/${profileId}`);
    return response.data.userId;
  } catch (error) {
    console.error("Error fetching userId by profileId:", error);
    throw error;
  }
};
export const getSuggestedMatches = async (userId, limit = 20) => {
  try {
    const response = await instance.get(`/api/matches/suggested/${userId}`, {
      params: { limit },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching suggested matches:", error);
    throw error;
  }
};
export const getAllUserImages = async (userId) => {
  try {
    const response = await instance.get(`/api/posts/users/${userId}/images`);
    return response.data;
  } catch (error) {
    console.error("Error fetching images: ", error);
    throw error;
  }
};

export const sendLike = async (senderId, receiverId) => {
  try {
    const response = await instance.post(`/api/matches/like`, {
      senderId,
      receiverId,
    });
    return response.data;
  } catch (error) {
    console.error("Error sending like:", error.response?.data || error.message);
    throw error;
  }
};

export const undoLike = async (senderId, receiverId) => {
  try {
    const response = await instance.delete(`/api/matches/cancel`, {
      params: { senderId, receiverId },
    });
    return response.data;
  } catch (error) {
    console.error("Error undoing like:", error.response?.data || error.message);
    throw error;
  }
};

export const acceptMatch = async (senderId) => {
  try {
    const response = await instance.post(`/api/matches/accept`, { senderId });
    return response.data;
  } catch (error) {
    console.error("Error accepting match:", error.response?.data || error.message);
    throw error;
  }
};

export const rejectMatch = async (receiverId, senderId) => {
  try {
    const response = await instance.delete('/api/matches/reject', {
      params: { receiverId, senderId },
    });
    return response.data;
  } catch (error) {
    console.error("Error rejecting match:", error.response?.data || error.message);
    throw error;
  }
};


export const getMyMatches = async (userId) => {
  try {
    const response = await instance.get(`/api/matches/my-matches/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching my matches:", error.response?.data || error.message);
    throw error;
  }
};

export const unmatchUser = async (userId1, userId2) => {
  try {
    const response = await instance.delete(`/api/matches/unmatch`, {
      params: { userId1, userId2 },
    });
    return response.data;
  } catch (error) {
    console.error("Error unmatching user:", error);
    throw error;
  }
};

export const getMyMatchesWithInterests = async (userId) => {
  try {
    const response = await instance.get(`/api/matches/my-matches-with-interests/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching my matches with interests:", error.response?.data || error.message);
    throw error;
  }
};


export const getIncomingLikes = async (userId) => {
  try {
    const response = await instance.get(`/api/matches/incoming/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching incoming likes:", error.response?.data || error.message);
    throw error;
  }
};

export const getSentLikes = async (userId) => {
  try {
    const response = await instance.get(`/api/matches/sent/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching sent likes:", error.response?.data || error.message);
    throw error;
  }
};

export const createDatingPlan = async (data) => {
  try {
    const response = await instance.post('/api/dating', data);
    return response.data;
  } catch (error) {
    console.error('Error creating dating plan:', error);
    throw error;
  }
};

export const getMyDatingPlans = async (userId) => {
  try {
    const response = await instance.get(`/api/dating/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching dating plans:', error);
    throw error;
  }
};

export const updateDateStatus = async (dateId, status) => {
  try {
    const response = await instance.patch(`/api/dating/${dateId}`, { status });
    return response.data;
  } catch (error) {
    console.error('Error updating date status:', error);
    throw error;
  }
};

export const updateDateRating = async (dateId, userId, rating) => {
  try {
    const response = await instance.patch(`/api/dating/rate/${dateId}`, {
      userId,
      rating,
    });
    return response.data;
  } catch (error) {
    console.error("Error rating date:", error);
    throw error;
  }
};

export const getNotificationsByUserId = async (userId, page = 1, pageSize = 10) => {
  try {
    const res = await instance.get(
      `/api/notifications/user/${userId}?page=${page}&pageSize=${pageSize}`
    );
    return res.data; 
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const res = await instance.patch(`/api/notifications/${notificationId}/read`);
    return res.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

export const markAllNotificationsAsRead = async (userId) => {
  try {
    const res = await instance.patch(`/api/notifications/user/${userId}/read-all`);
    return res.data;
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    throw error;
  }
};
