import styled from "styled-components";
import { FONT_STYLE } from "../../styles/common";

const S = {};

/* ===== Page ===== */
S.Page = styled.main`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.PALLETE.background.white};
`;

/* ===== Hero ===== */
/* Hero */
S.Hero = styled.section`
  width: 100%;
  height: 360px;
  position: relative;
  overflow: hidden;
`;

S.HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

S.HeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
`;

S.HeroInner = styled.div`
  max-width: 1420px;
  margin: 0 auto;
  padding: 0 20px;

  /* 🔥 왼쪽 정렬 */
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

S.Title = styled.h1`
  font-size: 28px;
  font-weight: 700;
  color: #2b2b2b;
`;

S.Description = styled.p`
  font-size: 14px;
  margin-top: 12px;
  color: #444;
`;

S.MetaRow = styled.div`
  margin-top: 18px;
  display: flex;
  gap: 14px;
`;

S.RatingBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 6px 12px;
  border-radius: 6px;

  background: #fff2e8;     /* FFF2E8 */
  color: #ff4d26;          /* FF4D26 */
  font-weight: 600;
  font-size: 14px;
`;

S.XpBadge = styled.div`
  display: inline-flex;
  align-items: center;

  padding: 6px 14px;
  border-radius: 6px;

  background: #dff7f1;     /* DFF7F1 */
  color: #018264;          /* 018264 */
  font-weight: 700;
  font-size: 14px;
`;

/* ===== Container ===== */
S.Container = styled.div`
  max-width: 1420px;
  margin: 0 auto;
  padding: 60px 20px 100px;
`;

/* ===== Tag ===== */
S.TagRow = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 40px;
`;

S.Tag = styled.div`
  background: ${({ theme }) => theme.PALLETE.gray[100]};
  padding: 6px 14px;
  border-radius: 6px;
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
`;

/* ===== Section Title ===== */
S.SectionTitle = styled.h2`
  ${FONT_STYLE.GIANTS.H6_REGULAR};
  margin-bottom: 20px;
`;

/* ===== Ingredient ===== */
S.IngredientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
  margin-bottom: 60px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

S.IngredientCard = styled.div`
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[200]};
  border-radius: 10px;
  padding: 20px;
`;

S.CardTitle = styled.div`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  font-weight: 600;
  margin-bottom: 14px;
`;

S.IngredientItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
`;

S.IngredientIcon = styled.img`
  width: 16px;
  height: 16px;
  flex: 0 0 auto;
`;

S.IngredientText = styled.span`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
`;

/* ===== Step ===== */
S.StepTitle = styled.h2`
  ${FONT_STYLE.GIANTS.H6_REGULAR};
  margin-bottom: 30px;
`;

S.StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;

  @media (max-width: 1320px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

S.StepCard = styled.div`
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[200]};
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
`;

S.StepNumber = styled.div`
  background: ${({ theme }) => theme.PALLETE.primary.main};
  color: #fff;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  font-weight: 600;
`;

S.StepImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
`;

S.StepContent = styled.div`
  padding: 16px;
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
`;

/* ===== Button ===== */
S.ButtonRow = styled.div`
  text-align: center;
  margin-top: 60px;
`;

S.PrimaryButton = styled.button`
  padding: 14px 40px;
  border-radius: 6px;
  border: none;
  background: ${({ theme }) => theme.PALLETE.primary.main};
  color: #fff;
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  font-weight: 600;
  cursor: pointer;

  transition: 0.2s ease;

  &:hover {
    opacity: 0.9;
  }
`;

/* ===================================================
   RecommendRecipe 전용
=================================================== */

/* Hero 이미지 */
S.Hero = styled.section`
  width: 100%;
  height: 380px;
  overflow: hidden;
`;

S.HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

/* 제목 + 메타 */
S.MetaRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

S.RatingBadge = styled.div`
  padding: 6px 10px;
  background: #fff3e0;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
`;

S.XpBadge = styled.div`
  padding: 6px 10px;
  background: #e0f2f1;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
`;

/* 태그 */
S.TagRow = styled.div`
  display: flex;
  gap: 8px;
  margin: 16px 0 30px;
`;

S.Tag = styled.div`
  padding: 6px 12px;
  background: ${({ theme }) => theme.PALLETE.gray[100]};
  border-radius: 8px;
  font-size: 13px;
`;

/* ================= 재료 ================= */

S.IngredientGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 40px;
`;

S.IngredientCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  min-height: 140px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
`;

S.CardTitle = styled.h4`
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 10px;
`;

S.IngredientItem = styled.div`
  font-size: 13px;
  margin-bottom: 6px;
  color: #333;
`;

S.EmptyText = styled.p`
  color: #aaa;
  font-size: 13px;
  margin-top: 10px;
`;

/* ================= Step ================= */

S.StepTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 16px;
`;

S.StepGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

S.StepCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
`;

S.StepNumber = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #ff4d37;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
`;

S.StepContent = styled.div`
  margin-top: 20px;
  font-size: 13px;
  line-height: 1.5;
`;

/* ================= 버튼 ================= */

S.ButtonRow = styled.div`
  text-align: center;
  margin-top: 40px;
`;

S.PrimaryButton = styled.button`
  padding: 14px 40px;
  border-radius: 8px;
  background: #ff4d37;
  color: #fff;
  font-weight: 600;
  border: none;
  cursor: pointer;

  &:hover {
    background: #e63e2e;
  }
`;

export default S;