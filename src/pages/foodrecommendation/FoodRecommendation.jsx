import React, { useEffect, useState } from "react";
import S from "./style";
import { useNavigate } from "react-router-dom";
import MyRecipeCard from "../../components/myrecipecomponents/MyRecipeCard";

const FoodRecommendation = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecommend = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:10000/fridge/recommend/1");
        const data = await res.json();

        // UI 유지하면서 데이터만 교체
        setRecipes([data]);
      } catch (e) {
        console.error("추천 실패:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommend();
  }, []);

  const handleClickCard = (item) => {
    navigate(`/foodrecommendation/recommendRecipe/${item.id}`, {
      state: { recipe: item }, 
    });
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
              recipes.map((item) => (
                <MyRecipeCard
                  key={item.id}
                  item={{
                    ...item,
                    desc: item.recipe, // 카드용
                    imageUrl: item.image, // 카드용
                  }}
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
