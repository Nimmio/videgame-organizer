type coveType = "cover_small" | "cover_big" | "thumb";
export const getUrl = (
  input: string,
  type: coveType = "cover_small"
): string => {
  return "https:" + input.replace("t_thumb", `t_${type}`);
};
