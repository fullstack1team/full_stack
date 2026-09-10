import React, { useEffect, useState } from "react";
import S from "./style";
import { useNavigate } from "react-router-dom";
import MyRecipeCard from "../../components/myrecipecomponents/MyRecipeCard";
import { savedRecipe } from "../../api/aiSavedRecipe";
import useAuthStore from "../../store/authStore";

const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getXpByLevel = (level) => {
  const normalizedLevel = String(level || "").replace(/\s/g, "");

  if (normalizedLevel === "쉬움" || normalizedLevel.toLowerCase() === "easy") {
    return getRandomInt(100, 200);
  }

  if (
    normalizedLevel === "보통" ||
    normalizedLevel === "중간" ||
    normalizedLevel.toLowerCase() === "medium"
  ) {
    return getRandomInt(200, 300);
  }

  if (
    normalizedLevel === "어려움" ||
    normalizedLevel.toLowerCase() === "hard"
  ) {
    return getRandomInt(300, 500);
  }

  return getRandomInt(150, 300);
};

const addXpToRecipe = (recipe) => {
  return {
    ...recipe,
    xp:
      Number(recipe?.xp) > 0 ? Number(recipe.xp) : getXpByLevel(recipe?.level),
  };
};

const DEFAULT_RECIPE_IMAGE = "/assets/images/default-recipe.png";

const getRecipeImageUrl = (recipe) => {
  return (
    recipe?.imageUrl ||
    recipe?.image ||
    recipe?.recipeImageUrl ||
    recipe?.recipe_image_url ||
    recipe?.thumbnailUrl ||
    recipe?.thumbnail ||
    recipe?.image_url ||
    DEFAULT_RECIPE_IMAGE
  );
};

const normalizeRecipe = (recipe) => {
  const imageUrl = getRecipeImageUrl(recipe);

  return {
    ...recipe,
    imageUrl,
    image: imageUrl,
  };
};

const FoodRecommendation = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const authState = useAuthStore();

  const currentUser = authState.member ?? authState.user ?? null;
  const isLoggedIn = authState.isAuthenticated || !!currentUser;

  useEffect(() => {
    if (!isLoggedIn) {
      setRecipes([]);
      setLoading(false);
      return;
    }

    const fetchRecommend = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:10000/fridge/recommend/", {
          credentials: "include",
        });
        const data = await res.json();

        console.log("추천 API 원본 data:", JSON.stringify(data, null, 2));

        if (!res.ok || data?.statusCode >= 400) {
          console.error("추천 API 실패:", data);
          setRecipes([]);
          return;
        }

        // UI 유지하면서 데이터만 교체
        const normalizedRecipe = normalizeRecipe(data);
        const recipeWithXp = addXpToRecipe({
          ...normalizedRecipe,
          saved: false,
        });

        setRecipes([recipeWithXp]);
      } catch (e) {
        console.error("추천 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommend();
  }, [isLoggedIn]);

  const getSaveIngredients = (ingredients = []) => {
    const result = {
      main: [],
      sub: [],
    };

    if (!Array.isArray(ingredients)) {
      return result;
    }

    ingredients.forEach((item) => {
      const name = item?.name || item;
      const category = item?.category;

      if (!name) return;

      if (["육류", "해산물", "채소"].includes(category)) {
        result.main.push(name);
      } else {
        result.sub.push(name);
      }
    });

    return result;
  };

  const getSaveSteps = (item) => {
    if (Array.isArray(item.steps) && item.steps.length > 0) {
      return item.steps;
    }

    if (typeof item.recipe === "string") {
      return item.recipe.split(/\d+\.\s/).filter((s) => s.trim() !== "");
    }

    return [];
  };

  const handleClickCard = (item) => {
    navigate(
      `/foodrecommendation/recommendRecipe/${item.id ?? item.recipeId ?? "ai"}`,
      {
        state: {
          recipe: item,
        },
      },
    );
  };

  const handleToggleBookmark = async (item) => {
    try {
      if (item.saved) {
        alert("이미 저장된 레시피입니다.");
        return;
      }

      const payload = {
        title: item.title,
        description: item.recipe || item.description || "",
        imageUrl:
          item.imageUrl || item.image || "/assets/images/default-recipe.png",

        cookTime: item.cookTime ?? item.cookTimeMin,
        difficulty: item.difficulty || item.level,
        category: item.category,
        xp: item.xp || 0,

        ingredients: getSaveIngredients(item.ingredients),
        steps: getSaveSteps(item),

        missingIngredients: Array.isArray(item.ingredients),
        steps: getSaveSteps(item),

        missingIngredients: Array.isArray(item.missingIngredients)
          ? item.missingIngredients
          : [],
      };

      console.log("저장 요청 payload:", payload);

      await savedRecipe(payload);

      setRecipes((prev) =>
        prev.map((recipe) =>
          (recipe.id ?? recipe.recipeId) === (item.id ?? item.recipeId)
            ? { ...recipe, saved: true }
            : recipe,
        ),
      );

      alert("레시피가 저장되었습니다.");
    } catch (error) {
      console.error("레시피 저장 실패:", error);
      alert("레시피 저장에 실패했습니다.");
    }
  };

  return (
    <S.Page>
      <S.Container>
        <S.HeaderSection>
          <S.SectionTitle>오늘의 추천요리</S.SectionTitle>
        </S.HeaderSection>
      </S.Container>

      <S.FullDivider />

      <S.Container>
        <S.FeedGridSection>
          <S.FeedGridWrap $loginRequired={!isLoggedIn}>
            {!isLoggedIn ? (
              <S.LoginRequiredWrap>
                <S.LoginRequiredTitle>
                  로그인이 필요합니다.
                </S.LoginRequiredTitle>

                <S.LoginRequiredDesc>
                  추천 요리를 확인하려면 로그인해주세요.
                </S.LoginRequiredDesc>

                <S.LoginRequiredButton onClick={() => navigate("/login")}>
                  로그인하러 가기
                </S.LoginRequiredButton>
              </S.LoginRequiredWrap>
            ) : loading ? (
              <S.LoadingText>🍳 레시피 생성 중...</S.LoadingText>
            ) : (
              recipes.map((item, index) => (
                <MyRecipeCard
                  key={item.id ?? item.recipeId ?? index}
                  item={item}
                  onClick={() => handleClickCard(item)}
                  onToggleBookmark={() => handleToggleBookmark(item)}
                />
              ))
            )}
          </S.FeedGridWrap>
        </S.FeedGridSection>
      </S.Container>
    </S.Page>
  );
};

export default FoodRecommendation;
