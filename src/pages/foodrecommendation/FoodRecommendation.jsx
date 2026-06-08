import React, { useEffect, useState } from "react";
import S from "./style";
import { useNavigate } from "react-router-dom";
import MyRecipeCard from "../../components/myrecipecomponents/MyRecipeCard";

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

const FoodRecommendation = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:10000/fridge/recommend/", {
          credentials: "include",
        });
        const data = await res.json();

        if (!res.ok || data?.statusCode >= 400) {
          console.error("추천 API 실패:", data);
          const recipeWithXp = addXpToRecipe(data);
          setRecipes([]);
          return;
        }

        // UI 유지하면서 데이터만 교체
        const recipeWithXp = addXpToRecipe(data);
        setRecipes([recipeWithXp]);
        
      } catch (e) {
        console.error("추천 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommend();
  }, []);

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
          <S.FeedGridWrap>
            {loading ? (
              <div>🍳 레시피 생성 중...</div>
            ) : (
              recipes.map((item, index) => (
                <MyRecipeCard
                  key={item.id ?? item.recipeId ?? index}
                  item={item}
                  onClick={() => handleClickCard(item)}
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
