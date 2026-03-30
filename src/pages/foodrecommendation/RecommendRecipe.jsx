import React, { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "react-router-dom";
import S from "./recommendrecipe.style";

const RecommendRecipe = () => {
  const { foodId } = useParams();
  const location = useLocation();

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
    desc,
    ingredients = [],
    image,
    rating = 4.5,
    xp = 300,
    cookTimeMin = 10,
    level = "쉬움",
    category = "한식",
  } = recipe;

  // =========================
  // Step 분리
  // =========================
  const steps =
    recipe.steps && recipe.steps.length > 0
      ? recipe.steps
      : desc?.split(/\d+\.\s/).filter((s) => s.trim() !== "") || [];

  // =========================
  // 재료 분류
  // =========================
  const classifyIngredients = (ingredients) => {
    const result = {
      main: [],
      sub: [],
      sauce: [],
    };

    ingredients.forEach((item) => {
      let name, category;

      // 문자열 fallback 대응
      if (typeof item === "string") {
        name = item;

        if (item.includes("고기") || item.includes("삼겹살")) {
          category = "육류";
        } else if (item.includes("오징어") || item.includes("새우")) {
          category = "해산물";
        } else if (
          item.includes("양파") ||
          item.includes("마늘") ||
          item.includes("김치") ||
          item.includes("버섯")
        ) {
          category = "채소";
        } else {
          category = "가공품";
        }
      } else {
        name = item.name;
        category = item.category;
      }

      if (category === "육류" || category === "해산물") {
        result.main.push(name);
      } else if (category === "채소" || category === "유제품") {
        result.sub.push(name);
      } else {
        result.sauce.push(name);
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
        <S.HeroImage src={image} />
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

          {/* 조미료 */}
          <S.IngredientCard>
            <S.CardTitle>조미료</S.CardTitle>
            {classified.sauce.length > 0 ? (
              classified.sauce.map((item, i) => (
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
                <b>Step {index + 1}</b>
                <p>{step}</p>
              </S.StepContent>
            </S.StepCard>
          ))}
        </S.StepGrid>

        {/* 버튼 */}
        <S.ButtonRow>
          <Link to="../foodcomplete">
            <S.PrimaryButton>
              요리 완성 <span>›</span>
            </S.PrimaryButton>
          </Link>
        </S.ButtonRow>
      </S.Container>
    </S.Page>
  );
};

export default RecommendRecipe;