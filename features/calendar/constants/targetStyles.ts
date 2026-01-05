export const TARGET_CONFIG: Record<
  string,
  { name: string; bg: string; text: string; border?: string }
> = {
  ALL: { name: "ALL", bg: "#8BC34A", text: "#FFFFFF" },
  boys: { name: "男子", bg: "#3C2465", text: "#FFFFFF" },
  boysA: { name: "男子A", bg: "#673AB7", text: "#FFFFFF" },
  boysB: { name: "男子B", bg: "#FFFFFF", text: "#673AB7", border: "#673AB7" },
  girls: { name: "女子", bg: "#811C1C", text: "#FFFFFF" },
  girlsA: { name: "女子A", bg: "#D32F2F", text: "#FFFFFF" },
  girlsB: { name: "女子B", bg: "#FFFFFF", text: "#D32F2F", border: "#D32F2F" },
};

// フォームの選択肢などで使う用の配列形式
export const TARGET_OPTIONS = Object.entries(TARGET_CONFIG).map(
  ([id, config]) => ({
    id,
    ...config,
  })
);
