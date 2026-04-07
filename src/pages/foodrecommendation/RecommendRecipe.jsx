import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import S from "./recommendrecipe.style";
import { useNavigate } from "react-router-dom";

const RecommendRecipe = () => {
  const { foodId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  // =========================
  // 데이터 로딩 (핵심 수정)
  // =========================
  useEffect(() => {
    if (location.state?.recipe) {
      setRecipe(location.state.recipe);
    } else {
      fetch(`http://localhost:10000/fridge/recommend/1`)
        .then((res) => res.json())
        .then((data) => {
          setRecipe(data);
        })
        .catch(() => {
          setRecipe(null);
        });
    }
  }, [location.state]);

  // =========================
  // 로딩 처리
  // =========================
  if (!recipe) return <div style={{ padding: 40 }}>로딩중...</div>;

  const {
    title,
    recipe: desc,
    ingredients = [],
    rating = 4.5,
    xp = 300,
    cookTimeMin = 10,
    level = "쉬움",
    category = "한식",
  } = recipe;

  const imageUrl = recipe.image || recipe.imageUrl;

  console.log("recipe 전체:", recipe);
  console.log("ingredients:", ingredients);

  // =========================
  // Step 분리
  // =========================
  const steps =
    recipe.steps?.length > 0
      ? recipe.steps
      : recipe.recipe?.split(/\d+\.\s/).filter((s) => s.trim() !== "");

  // =========================
  // 재료 분류
  // =========================
  const classifyIngredients = (ingredients) => {
    const result = {
      main: [],
      sub: [],
    };

    ingredients.forEach((item) => {
      const name = item.name || item;
      const category = item.category;

      if (["육류", "해산물", "채소"].includes(category)) {
        result.main.push(name);
      } else {
        result.sub.push(name);
      }
    });

    return result;
  };

  const classified = classifyIngredients(ingredients);

  console.log("recipe:", recipe);
  console.log("ingredients:", ingredients);

  return (
    <S.Page>
      {/* Hero */}
      <S.Hero>
        <S.HeroImage src={imageUrl} />
      </S.Hero>

      <S.Container>
        <S.Title style={{ marginTop: "20px" }}>{title}</S.Title>

        <S.MetaRow style={{ marginBottom: "20px" }}>
          <S.RatingBadge>⭐ {rating}</S.RatingBadge>
          <S.XpBadge>XP {xp}</S.XpBadge>
        </S.MetaRow>

        <S.TagRow>
          <S.Tag>{cookTimeMin}분</S.Tag>
          <S.Tag>{level}</S.Tag>
          <S.Tag>{category}</S.Tag>
        </S.TagRow>

        {/* =========================
            재료
        ========================= */}
        <S.SectionTitle>재료</S.SectionTitle>

        <S.IngredientGrid>
          {/* 주재료 */}
          <S.IngredientCard>
            <S.CardTitle>주재료</S.CardTitle>
            {classified.main.length > 0 ? (
              classified.main.map((item, i) => (
                <S.IngredientItem key={i}>• {item}</S.IngredientItem>
              ))
            ) : (
              <S.EmptyText>재료 없음</S.EmptyText>
            )}
          </S.IngredientCard>

          {/* 부재료 */}
          <S.IngredientCard>
            <S.CardTitle>부재료</S.CardTitle>
            {classified.sub.length > 0 ? (
              classified.sub.map((item, i) => (
                <S.IngredientItem key={i}>• {item}</S.IngredientItem>
              ))
            ) : (
              <S.EmptyText>재료 없음</S.EmptyText>
            )}
          </S.IngredientCard>
        </S.IngredientGrid>

        {/* =========================
            Steps
        ========================= */}
        <S.StepTitle>만드는 방법</S.StepTitle>

        <S.StepGrid>
          {steps.map((step, index) => (
            <S.StepCard key={index}>
              <S.StepNumber>{index + 1}</S.StepNumber>

              <S.StepContent>
                <p>{step}</p>
              </S.StepContent>
            </S.StepCard>
          ))}
        </S.StepGrid>

        {/* 버튼 */}
        <S.ButtonRow>
          <S.PrimaryButton
            onClick={() =>
              navigate("../foodcomplete", {
                state: { recipe },
              })
            }
          >
            요리 완성 <span>›</span>
          </S.PrimaryButton>
        </S.ButtonRow>
      </S.Container>
    </S.Page>
  );
};

export default RecommendRecipe;
