const calculateRating = (xp, minXp, maxXp, minRating, maxRating) => {
  const numericXp = Number(xp);

  const safeXp = Number.isFinite(numericXp)
    ? Math.min(maxXp, Math.max(minXp, numericXp))
    : minXp;

  const ratio = (safeXp - minXp) / (maxXp - minXp);

  const rating = minRating + ratio * (maxRating - minRating);

  return rating.toFixed(1);
};

export const getRecipeRating = (difficulty, xp) => {
  const normalizedDifficulty = String(difficulty || "")
    .trim()
    .toLowerCase();

  if (["하", "쉬움", "easy"].includes(normalizedDifficulty)) {
    return calculateRating(xp, 100, 199, 3.5, 3.9);
  }

  if (["중", "보통", "medium"].includes(normalizedDifficulty)) {
    return calculateRating(xp, 200, 299, 4.0, 4.4);
  }

  if (["상", "어려움", "hard"].includes(normalizedDifficulty)) {
    return calculateRating(xp, 300, 500, 4.5, 5.0);
  }

  return "4.0";
};
