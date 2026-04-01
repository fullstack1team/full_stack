import styled from "styled-components";
import { flexCenter, flexCenterColumn, FONT_STYLE } from "../../styles/common";

const S = {};

/* =========================
   나의 냉장고 상단 배경 섹션
========================= */

S.FridgeHeaderSection = styled.div`
  width: 100%;
  background-color: #FFF9F5;
`;

S.FridgeHeaderInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 32px;
`;

/* =========================
   페이지 타이틀
========================= */

S.FridgeTitle = styled.h2`
  margin: 0 auto 24px auto;
  width: 100%;
  text-align: center;
  ${FONT_STYLE.GIANTS.H6_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  margin-bottom: 16px;
`;

/* ====================
      공통 버튼
=================== */

S.AddButton = styled.button`
  width: 298px;
  height: 56px;
  border: 1px solid #FF4D26;
  border-radius: 5px;
  background-color: transparent;
  ${flexCenter}
  font-family: 'Pretendard';
  font-size: ${({ theme }) => theme.FONT_SIZE.h5};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.SEMIBOLD};
  color: #262626;
  cursor: pointer;
`;

S.LayoutAddButton = styled.button`
  width: 87px;
  height: 36px;
  border: 1px solid #FF4D26;
  border-radius: 5px;
  background-color: transparent;
  ${flexCenter}
  font-family: 'Pretendard';
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.BOLD};
  color: #262626;
  cursor: pointer;
`;

/* ==================================================
   페이지 레이아웃
================================================== */

S.MyFridgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

/* ======================
   ✅ 추천 배너 (이미지형 구조)
====================== */

S.RecommendBanner = styled.div`
  width: 100%;
  /* margin: 40px 0; */
  display: flex;
  justify-content: center;
`;

S.BannerBackground = styled.div`
  width: 100%;
  max-width: 1100px;
  height: 260px;

  background-image: url(${process.env.PUBLIC_URL}/assets/images/recommandbanner.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  position: relative;
  overflow: hidden;
`;

S.BannerOverlay = styled.div`
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

S.BannerTitle = styled.h3`
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 18px;

  span {
    color: #FF4E37;
  }
`;

S.BannerButton = styled.button`
  padding: 8px 38px;
  border-radius: 40px;
  border: 1px solid #666666;
  background: white;
  font-size: ${({ theme }) => theme.FONT_SIZE.h6};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.LIGHT};
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #FF4E37;
    color: white;
    border-color: #FF4E37;
  }
`;

/* ======================
   상단 고정 영역
====================== */

S.TopFixedSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 80px;
`;

S.FridgeHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFF9F5;
`;

S.FridgeButtonGroup = styled.div`
  margin-left: auto;
  display: flex;
  gap: 8px;
`;

S.FridgeTopSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

S.CategoryRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 2px;
  flex-wrap: wrap;
`;

S.LayoutCategoryTab = styled.button`
  width: 90px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: none;
  font-size: 15.8px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ $active }) =>
    $active ? "#FF6B4A" : "#E0E0E0"};
  color: ${({ $active }) =>
    $active ? "#FFFFFF" : "#777777"};
`;

S.TopInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

S.EmptyWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 260px);
`;

/* ======================
   카드 & Grid
====================== */

S.HoverInfo = styled.div`
  position: absolute;
  top: -8px;
  left: 105%;
  width: 180px;
  background-color: #ffffff;
  border: 1px solid #ff4e37;
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  color: #262626;
  line-height: 1.4;
  opacity: 0;
  transform: translateY(6px);
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 20;
`;

S.CardStyle = styled.div`
  position: relative;
  ${flexCenterColumn}
  height: 120px;
  border-radius: 10px;
  background-color: #fff;
  box-sizing: border-box;
  border: 2px solid
    ${({ $active }) => ($active ? "#FF4E37" : "#E9E9EC")};

  cursor: ${({ deleteMode }) => deleteMode ? "pointer" : "default"};

  &:hover ${S.HoverInfo} {
    opacity: 1;
    transform: translateY(0);
  }

  ${({ deleteMode }) =>
    deleteMode &&
    `
      transition: transform 0.1s;
      &:hover {
        transform: scale(0.97);
      }
    `}
`;

S.DeleteBadge = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #FF4E37;
  background-color: ${({ $active }) => $active ? "#FF4E37" : "#fff"};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: white;
`;

S.CardTextStyle = styled.p`
  font-size: ${({ theme }) => theme.FONT_SIZE.h8};
  font-weight: ${({ theme }) =>
    theme.FONT_WEIGHT.PRETENDARD.LIGHT};
`;

S.IconStyle = styled.div`
  font-size: 32px;
  margin-bottom: 8px;
`;

S.GridWrapperStyle = styled.div`
  width: 100%;
  margin: 0 auto;
`;

S.GridStyle = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 16px;
`;

/* ======================
   모달
====================== */

S.ModalOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  ${flexCenter}
  z-index: 1000;
`;

S.ModalContent = styled.div`
  width: 920px;
  height: 720px;
  background-color: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
`;

S.ModalHeader = styled.div`
  display: flex;
  margin-bottom: 24px;
`;

S.CategoryTab = styled.button`
  width: 180px;
  height: 64px;
  border: none;
  ${flexCenter}
  background-color: ${({ $active }) =>
    $active ? "#FFFFFF" : "#DDDDDD"};
  color: ${({ $active }) =>
    $active ? "#FF4E37" : "#898989"};
  font-size: ${({ theme }) => theme.FONT_SIZE.h6};
  font-weight: ${({ theme }) =>
    theme.FONT_WEIGHT.PRETENDARD.MEDIUM};
  cursor: pointer;
  transition: all 0.2s ease;
`;

S.ModalBody = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 24px;
`;

S.ModalGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(8, 127.64px);
  gap: 16px;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px 0;
`;

S.SelectedHeader = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  font-weight: 600;
  margin-bottom: 8px;
`;

S.SelectedRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
`;

S.SelectedSection = styled.div`
  border-top: 1px solid #E9E9EC;
  padding-top: 16px;
`;

S.ModalFooter = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
`;

// 입력 그룹
S.FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 20px;
`;

// label
S.FormLabel = styled.label`
  font-size: 14px;
  font-weight: 600;
  color: #444;
`;

// input
S.FormInput = styled.input`
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
  font-size: 14px;

  &:focus {
    border-color: #FF4E37;
    outline: none;
  }
`;

// select
S.FormSelect = styled.select`
  height: 44px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 12px;
`;

// 모달 폭 줄이기
S.ModalContent = styled.div`
  width: 420px;
  padding: 32px;
  border-radius: 16px;
  background: white;
`;

// 버튼 업그레이드
S.AddButton = styled.button`
  width: 100%;
  height: 50px;
  background: #FF4E37;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  border: none;
  cursor: pointer;

  &:hover {
    background: #e8432e;
  }
`;

export default S;