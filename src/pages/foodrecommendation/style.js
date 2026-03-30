import styled from "styled-components";
import { flexBetweenRow, flexCenter, FONT_STYLE } from "../../styles/common";

const S = {};

/* ===================================================
   기본 페이지 구조 (커뮤니티와 동일)
=================================================== */

S.Page = styled.main`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.PALLETE.background.white};
`;

S.Container = styled.div`
  max-width: 1420px;
  margin: 0 auto;
  padding: 24px 0 80px;

  @media (max-width: 1920px) {
    width: 100%;
    padding: 24px 20px 80px;
  }
`;

/* ===================================================
   상단 섹션 (커뮤니티와 동일)
=================================================== */

S.HeaderSection = styled.section`
  width: 100%;
  margin-top: 68px;
  padding-bottom: 24px;

  /* 좌우 여백 추가 */
  padding-left: 130px;
  padding-right: 130px;
`;

S.SectionTitle = styled.h2`
  ${FONT_STYLE.GIANTS.H6_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  margin-bottom: 16px;
`;



/* 검색 + 정렬 Row */
S.SearchRow = styled.div`
  ${flexBetweenRow};
  gap: 20px;
`;

/* 검색 박스 */
S.SearchWrap = styled.div`
  position: relative;
  width: 1028px;
  height: 40px;
`;

S.SearchInput = styled.input`
  width: 100%;
  height: 100%;

  /* 아이콘 자리 확보 */
  padding: 0 44px 0 16px;

  border-radius: 5px;
  border: 1px solid transparent;
  background-color: ${({ theme }) => theme.PALLETE.gray[50]};

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};

  &::placeholder {
    color: ${({ theme }) => theme.PALLETE.gray[800]};
  };

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.PALLETE.primary.main};
    background-color: ${({ theme }) => theme.PALLETE.background.white};
  };
`;

S.SearchButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);

  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;

  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

S.SearchIcon = styled.img`
  width: 24px;
  height: 24px;
`;

/* 정렬 버튼 */
S.SortButton = styled.button`
  height: 40px;
  width: 130px;
  padding: 0 10px;   
  white-space: nowrap;  

  ${flexCenter}
  gap: 6px;

  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[300]};
  background-color: ${({ theme }) => theme.PALLETE.background.white};

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme, $active }) => $active ? theme.PALLETE.primary.main : theme.PALLETE.mainblack};
  font-weight: ${({ $active }) => $active? 600 : 400};
 
  cursor: pointer;
   
`;

// 필터 아이콘
S.FilterIcon = styled.img`
  width: 24px;
  height: 24px;
`

/* ===================================================
   구분선 (커뮤니티 동일)
=================================================== */

S.FullDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 30px 0 0;
  background-color: #eee;
`;

/* ===================================================
   그리드 (기존 유지)
=================================================== */

S.FeedGridSection = styled.section`
  width: 100%;
  margin-top: 52px;
  padding-bottom: 24px;
`;

S.FeedGridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px;

  @media (max-width: 1320px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

S.Title = styled.h6`
  font-size: 18px;
  font-weight: 700;
`;

S.DropdownWrap = styled.div`
  position: relative;
`;

S.FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
`;

S.FilterIcon = styled.img`
  width: 20px;
`;

S.DropdownWrap = styled.div`
  position: relative;
`;

S.DropdownMenu = styled.div`
  position: absolute;
  top: 46px;
  right: 0;

  width: 130px;

  background: ${({ theme }) => theme.PALLETE.background.white};
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[200]};
  border-radius: 8px;

  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  z-index: 100;
`;

S.DropdownItem = styled.button`
  width: 100%;
  padding: 12px 16px;

  border: none;
  background: transparent;

  text-align: left;
  cursor: pointer;

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};

  color: ${({ theme, $active }) =>
    $active
      ? theme.PALLETE.primary.main
      : theme.PALLETE.mainblack};

  &:hover {
    color: ${({ theme }) => theme.PALLETE.primary.main};
    background: ${({ theme }) => theme.PALLETE.gray[50]};
  }
`;









/* ===================================================
   FoodComplete 전용
=================================================== */

S.FCPage = styled.main`
  width: 100%;
  min-height: 100vh;
  background: #f3f3f3;
`;

S.FCWrapper = styled.div`
  max-width: 1420px;
  margin: 0 auto;
  padding-bottom: 120px;
`;

/* ================= Hero ================= */

S.FCHero = styled.section`
  width: 100%;
  height: 360px;
  position: relative;
  overflow: hidden;
  margin-bottom: 60px;
`;

S.FCHeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

S.FCHeroOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
`;

S.FCHeroInner = styled.div`
  max-width: 1420px;
  margin: 0 auto;
  padding: 0 20px;
`;

S.FCTitle = styled.h1`
  ${FONT_STYLE.GIANTS.H7_REGULAR};
  font-size: 24px;
  font-weight: 700;
`;

S.FCSubText = styled.p`
  font-size: 13px;
  margin-top: 8px;
  color: #444;
`;

/* ================= Content ================= */

S.FCContent = styled.div`
  max-width: 1420px;
  margin: 100px auto 0;
`;

/* 공통 섹션 */
S.FCSection = styled.section`
  margin-bottom: 48px;
`;

S.FCSectionHeading = styled.h3`
  font-size: 16px;
  font-weight: 600;
`;

S.FCSectionTitleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
`;

S.FCSectionIcon = styled.img`
  width: 20px;
  height: 20px;
`;

/* ================= Upload ================= */

S.FCUploadBox = styled.div`
  width: 100%;
  height: 180px;
  border: 1px solid #ccc;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  color: #888;
  cursor: pointer;
    &:hover {
    border-color: #ff4d37;
  }
`;

/* ================= 후기 ================= */

S.FCTextarea = styled.textarea`
  width: 100%;
  height: 140px;
  border: 1px solid #ddd;
  background: #fff;
  padding: 16px;
  font-size: 14px;
  resize: none;

  &:focus {
    outline: none;
    border-color: #ff4d37;
  }
`;

/* ================= 재료 ================= */

S.FCIngredientSectionWrap = styled.div`
  width: 1420px;
  margin: 0 auto;
`;

S.FCIngredientBox = styled.div`
  width: 1420px;
  height: 427px;
  border: 1px solid #d9d9d9;
  /* border-radius: 10px; */
  background: #fff;
  padding: 32px 40px;
  position: relative;

  display: grid;
  grid-template-columns: repeat(4, 1fr);
  column-gap: 60px;
  row-gap: 18px;
`;

S.FCIngredientItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  padding: 6px 8px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;

  background-color: ${(props) =>
    props.$active ? "#ff4d37" : "#ffffff"};

  color: ${(props) =>
    props.$active ? "#ffffff" : "#333333"};
`;

S.FCCheckIcon = styled.img`
  width: 18px;
  height: 18px;
  cursor: pointer;
`;

S.FCSelectedCount = styled.div`
  position: absolute;
  bottom: 16px;
  right: 24px;
  font-size: 12px;
  color: #ff4d37;
`;

/* ================= XP ================= */

S.FCXPBox = styled.div`
  background: #ffffff;
  padding: 28px 32px;
  /* border-radius: 10px; */
  border: 1px solid #e0e0e0;
`;

S.FCXPLabel = styled.div`
  display: inline-block;
  padding: 6px 14px;
  border: 1px solid #ff4d26;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  background: white;
  margin-bottom: 8px;
`;

S.FCXPLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

S.FCXPText = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #333;
`;

S.FCProgressBar = styled.div`
  width: 100%;
  height: 12px;
  background: #b8b8b8;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 24px;
  position: relative;
`;

S.FCProgressOrange = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #f59e0b, #ff4d26);
  border-radius: 8px;
  width: ${({ value }) => value}%;
  transition: width 0.3s ease;
`;

S.FCProgressBlue = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #1d4ed8, #06b6d4);
  border-radius: 8px;
  width: ${({ value }) => value}%;
  transition: width 0.3s ease;
`;

/* ================= 공유 ================= */

S.FCShareBox = styled.div`
  border: 1px solid #ddd;
  background: #fff;
  padding: 20px;
  font-size: 13px;
  color: #666;
`;

/* ================= 버튼 ================= */

S.FCCompleteButton = styled.button`
  display: block;
  margin: 60px auto 0;
  padding: 12px 44px;
  border: 1px solid #ff4d37;
  background: #fff;
  color: #ff4d37;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #ff4d37;
    color: #fff;
  }
`;




export default S;
