// 處理開頭和末尾多個連續的 /，變成單個
export const normalizePathname = (path) => {
  return path.replace(/\/+$/, "").replace(/^\/*/, "/");
};
