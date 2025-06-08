export const questions = [
  // Openness
  {
    id: 1,
    text: "Tôi thích thử những điều mới và khác biệt.",
    trait: "openness",
  },
  {
    id: 2,
    text: "Tôi thích các hoạt động nghệ thuật hoặc sáng tạo.",
    trait: "openness",
  },
  { id: 3, text: "Tôi tò mò và ham học hỏi.", trait: "openness" },
  { id: 4, text: "Tôi có trí tưởng tượng phong phú.", trait: "openness" },
  {
    id: 5,
    text: "Tôi cởi mở với những ý tưởng không truyền thống.",
    trait: "openness",
  },

  // Conscientiousness
  {
    id: 6,
    text: "Tôi luôn hoàn thành công việc một cách cẩn thận.",
    trait: "conscientiousness",
  },
  {
    id: 7,
    text: "Tôi luôn đúng giờ và có tổ chức.",
    trait: "conscientiousness",
  },
  {
    id: 8,
    text: "Tôi lên kế hoạch trước khi thực hiện công việc.",
    trait: "conscientiousness",
  },
  {
    id: 9,
    text: "Tôi có động lực cao để đạt được mục tiêu.",
    trait: "conscientiousness",
  },
  {
    id: 10,
    text: "Tôi là người đáng tin cậy trong công việc.",
    trait: "conscientiousness",
  },

  // Extraversion
  {
    id: 11,
    text: "Tôi cảm thấy thoải mái khi trò chuyện với người lạ.",
    trait: "extraversion",
  },
  {
    id: 12,
    text: "Tôi là người năng động và tràn đầy năng lượng.",
    trait: "extraversion",
  },
  {
    id: 13,
    text: "Tôi thích tham gia vào các hoạt động xã hội.",
    trait: "extraversion",
  },
  {
    id: 14,
    text: "Tôi cảm thấy vui vẻ khi ở trong đám đông.",
    trait: "extraversion",
  },
  {
    id: 15,
    text: "Tôi thường chủ động bắt chuyện với người khác.",
    trait: "extraversion",
  },

  // Agreeableness
  {
    id: 16,
    text: "Tôi dễ đồng cảm với cảm xúc của người khác.",
    trait: "agreeableness",
  },
  {
    id: 17,
    text: "Tôi thường giúp đỡ người khác ngay cả khi không được yêu cầu.",
    trait: "agreeableness",
  },
  { id: 18, text: "Tôi luôn cố gắng tránh xung đột.", trait: "agreeableness" },
  {
    id: 19,
    text: "Tôi quan tâm đến nhu cầu của người khác.",
    trait: "agreeableness",
  },
  {
    id: 20,
    text: "Tôi đối xử tử tế và lịch sự với mọi người.",
    trait: "agreeableness",
  },

  // Neuroticism
  {
    id: 21,
    text: "Tôi thường cảm thấy căng thẳng hoặc lo lắng.",
    trait: "neuroticism",
  },
  {
    id: 22,
    text: "Tôi dễ bị ảnh hưởng bởi cảm xúc tiêu cực.",
    trait: "neuroticism",
  },
  {
    id: 23,
    text: "Tôi thường cảm thấy không yên tâm về bản thân.",
    trait: "neuroticism",
  },
  {
    id: 24,
    text: "Tôi dễ bị kích động bởi những điều nhỏ nhặt.",
    trait: "neuroticism",
  },
  {
    id: 25,
    text: "Tôi thường có tâm trạng thất thường.",
    trait: "neuroticism",
  },
];

export const answerLabels = [
  "Hoàn toàn không đồng ý",
  "Không đồng ý",
  "Trung lập",
  "Đồng ý",
  "Hoàn toàn đồng ý",
];

export const traitDetails: Record<TraitKey, string> = {
  openness:
    "Sự cởi mở cho thấy bạn có trí tưởng tượng phong phú, sáng tạo và sẵn sàng khám phá ý tưởng mới.",
  conscientiousness:
    "Sự tận tâm phản ánh tính cách cẩn thận, có tổ chức và có trách nhiệm.",
  extraversion:
    "Hướng ngoại mô tả bạn là người năng động, thích giao tiếp và hoạt động xã hội.",
  agreeableness:
    "Sự dễ chịu cho thấy bạn thân thiện, cảm thông và sẵn lòng hợp tác với người khác.",
  neuroticism:
    "Tâm lý bất ổn phản ánh xu hướng dễ lo lắng, dễ bị tác động bởi cảm xúc tiêu cực.",
};

export type TraitKey =
  | "openness"
  | "conscientiousness"
  | "extraversion"
  | "agreeableness"
  | "neuroticism";

export const traitComments: Record<
  TraitKey,
  { low: string; medium: string; high: string }
> = {
  openness: {
    low: "Bạn có xu hướng thực tế và thích những gì quen thuộc hơn là khám phá cái mới.",
    medium: "Bạn cân bằng giữa việc duy trì thói quen và khám phá điều mới mẻ.",
    high: "Bạn sáng tạo, tò mò và thích tìm hiểu những điều khác biệt.",
  },
  conscientiousness: {
    low: "Bạn có thể linh hoạt nhưng đôi khi thiếu sự tổ chức và kỷ luật.",
    medium: "Bạn có sự cân bằng giữa linh hoạt và trách nhiệm.",
    high: "Bạn rất đáng tin cậy, có tổ chức và luôn cố gắng hoàn thành mọi việc tốt nhất.",
  },
  extraversion: {
    low: "Bạn thích sự yên tĩnh, suy nghĩ nội tâm và có thể hướng nội.",
    medium: "Bạn linh hoạt giữa việc giao tiếp và thời gian riêng tư.",
    high: "Bạn năng động, thích giao tiếp và thường là trung tâm của các cuộc trò chuyện.",
  },
  agreeableness: {
    low: "Bạn có thể thẳng thắn và ít quan tâm đến cảm xúc người khác.",
    medium:
      "Bạn vừa biết quan tâm đến người khác vừa giữ được lập trường cá nhân.",
    high: "Bạn thân thiện, vị tha và sẵn sàng giúp đỡ người khác.",
  },
  neuroticism: {
    low: "Bạn ổn định về mặt cảm xúc và hiếm khi bị stress.",
    medium: "Bạn đôi lúc lo lắng nhưng vẫn giữ được sự cân bằng.",
    high: "Bạn dễ bị căng thẳng và nên tìm cách chăm sóc sức khỏe tinh thần.",
  },
};
