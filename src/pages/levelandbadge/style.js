import styled from "styled-components";
import { flexCenter, flexCenterColumn, FONT_STYLE } from "../../styles/common";
import theme from "../../styles/theme";
import { Link } from "react-router-dom";

export const LevelAndBadgeScreen = styled.div`
  width: 100%;
  ${flexCenterColumn};
`;

export const BannerWraper = styled.div`
  width: 1920px;
  position: relative;
  height: 578px;
`;

export const BaseImage = styled.img`
  position: relative;
  width: 100%;
  display: block;
`;

export const OverlayImg = styled.img`
  position: absolute;
  object-fit: cover;
  top: ${(props) => props.top || "0"}px;
  left: ${(props) => props.left || "0"}px;
  z-index: ${(props) => props.zIndex || "1"};
`;

export const TochallengeWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 750px;
  height: 520px;
  z-index: 3;

  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(0.5px);
  box-shadow: 0 0 0 10px rgb(0, 0, 0) inset 15px 5px 50px 0 rgb(0, 0, 0);
  border-radius: 110px;

  ${flexCenterColumn}
  gap: 20px;
`;

export const BannerH1 = styled.h1`
  ${FONT_STYLE.GIANTS.H1_REGULAR};
  color: ${theme.PALLETE.headerandfooter};
`;

export const BannerP = styled.p`
  ${FONT_STYLE.PRETENDARD.H5_MEDIUM};
`;

export const ToChallengeLink = styled(Link)`
  border: 1px solid #3385ff;
  width: 270px;
  height: 65px;
  background-color: white;
  border-radius: 5px;
  ${FONT_STYLE.PRETENDARD.H6_MEDIUM};
  color: ${theme.PALLETE.mainblack};
  ${flexCenter};
`;

// ---------------------------------------------------

export const MyLevelWrap = styled.div`
  width: 100%;
  height: 600px;
  ${flexCenter}
`;

export const MyLevelField = styled.fieldset`
  width: 1420px;
  height: 350px;
`;

export const MyLevelLegend = styled.legend`
  ${FONT_STYLE.GIANTS.H5_REGULAR};
  color: ${theme.PALLETE.headerandfooter};
  margin: 0 0 10px;
`;

export const MyLevelProgressWrap = styled.div`
  width: 100%;
  height: 300px;
  margin: 1rem 0;
  border: 1px solid ${theme.PALLETE.gray[50]};
  background-color: ${theme.PALLETE.gray[50]};
  border-radius: ${theme.RADIUS.md};
  display: flex;
`;

export const MyLevelProgressContainer = styled.div`
  width: 820px;
  height: 20px;
  background-color: ${theme.PALLETE.gray[300]};
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  margin: 15px 0 15px 0;
`;

export const MyLevelProgress = styled.div`
  height: 100%;
  background: #009bff;
  width: ${(props) => props.width}%;
  transition: width 0.4s ease-out; /* 나중에 데이터 바뀔 때 슥 차오름 */
`;

export const ExpText = styled.div`
  ${FONT_STYLE.PRETENDARD.H7_BOLD};
  color: ${theme.PALLETE.headerandfooter};
  display: block;
  text-align: right; 
  width: 100%;
`;

export const MyLevelProfileWrap = styled.div`
  position: relative;
  width: 300px;
  height: 100%;
  ${flexCenter};
`;

export const MyLevelProfileContainer = styled.img`
  position: absolute;
  width: 165px;
  height: auto;
  z-index: 2;
`;

export const MyLevelProfileImg = styled.img`
  position: absolute;
  border-radius: 9999px;
  width: 145px;
  height: 145px; /* 💡 프로필 이미지 높이 지정 */
  object-fit: cover;
  z-index: 1;
  top: 88px;
`;

export const LevelLabel = styled.div`
  ${FONT_STYLE.PRETENDARD.H5_BOLD};
  color: ${theme.PALLETE.headerandfooter};

  white-space: nowrap;
  word-break: keep-all;
`;

export const LevelCurrent = styled.div`
  width: 130px;
  height: 40px;
  border: 1px solid ${theme.PALLETE.primary.main};
  border-radius: 20px;
  color: ${theme.PALLETE.mainblack};
  ${FONT_STYLE.PRETENDARD.H6_BOLD};
  ${flexCenter};
`;

export const LevelInfoWrap = styled.div`
  width: calc(100% - 600px);
  display: flex;
  align-items: center;
  gap: 15px;
`;

export const LevelProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export const LevelNextMedal = styled.img`
  width: 145px;
  height: auto; /* 💡 다음 메달 이미지 크기 정상화 */
  object-fit: contain;
`;

export const NextMedalInfo = styled.div`
  ${FONT_STYLE.PRETENDARD.H6_MEDIUM};
  color: ${theme.PALLETE.gray[900]};
`;

export const MedalWrap = styled.div`
  position: relative;
  width: 300px;
  height: 100%;
  ${flexCenterColumn};
`;

// ------------------------------------------
export const MyBadgeWrap = styled.div`
  width: 100%;
  ${flexCenter}
`;

export const MyBadgeField = styled.fieldset`
  width: 1420px;
`;

export const BadgeContainer = styled.div`
  width: 100%;
  /* 내부 요소 배치를 위한 설정 */
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
  padding: 20px 0 20px 0;

  /* 디자인적 요소 */
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
`;

export const BadgeDiv = styled.div`
  width: 260px;
  height: 340px;
  background-color: ${theme.PALLETE.gray[100]};
  position: relative;
  border-radius: 10px;
  ${flexCenterColumn};
  cursor: help;
`;

export const BadgeName = styled.span`
  ${FONT_STYLE.PRETENDARD.H6_SEMIBOLD};
  margin-top: 10px;
`;

export const BadgeExp = styled.div`
  width: 192px;
  height: 50px;
  ${flexCenter};
  border: 1px solid ${theme.PALLETE.headerandfooter};
  border-radius: 5px;
  margin: 12px 0 0 0;
  background-color: white;
  ${FONT_STYLE.PRETENDARD.H6_BOLD};
`;

/* 💡 [핵심 수정] 뱃지 원형 이미지 크기 및 렌더링 옵션 보완 */
export const BadgeImg = styled.img`
  width: 120px;
  height: 120px;
  object-fit: contain;
  display: block;
  opacity: 0.95;
`;

/* 💡 [핵심 수정] 우측 상단 자물쇠/해금 리본 이미지 크기 및 위치 보완 */
export const BadgeLockImg = styled.img`
  position: absolute;
  top: 0px;
  z-index: 2;
  height: auto;
  object-fit: contain;

  /* 💡 해금(금색)과 미해금(회색)을 완전히 분리 */
  ${(props) =>
    props.$isUnlocked
      ? `
        /* [해금 - 금색 리본] */
        width: 48px;
        right: 32px;
      `
      : `
        /* [미해금 - 회색 리본] 이미지 여백이 크므로 수치를 크게 설정 */
        width: 70px;
        right: 18px;
        top: -21px;
      `}
`;

export const TooltipBox = styled.div`
  position: absolute;
  bottom: 105%; /* 뱃지 위에 띄움 */
  left: 75%;
  transform: translateX(-50%);
  width: 400px;
  height: 430px;
  background: ${theme.PALLETE.gray[100]};
  border-radius: 10px;
  z-index: 100;
  ${flexCenterColumn}
  gap: 8px;
  pointer-events: none; /* 툴팁 때문에 마우스 이벤트가 방해받지 않도록 설정 */
`;

export const TooltipIconBox = styled.div`
  width: 100%;
  height: 60%;
  background: ${theme.PALLETE.gray[200]};
  border-radius: 10px 10px 0 0;
  ${flexCenter};

  /* 툴팁 내부 뱃지 이미지 크기 오버라이딩 */
  & > img {
    width: 140px;
    height: 140px;
  }
`;

export const TooltipName = styled.div`
  ${FONT_STYLE.PRETENDARD.H5_BOLD};
  width: 90%;
  text-align: left;
  height: 10%;
`;

export const TooltipDecription = styled.div`
  white-space: pre-wrap; /* 💡 오타 수정 (whitespace -> white-space) */
  ${FONT_STYLE.PRETENDARD.H7_MEDIUM};
  width: 90%;
  height: 20%;
`;

export const GetBadgeAt = styled.div`
  width: 90%;
  height: 10%;
  display: flex;
  align-items: center;
  gap: 5px;
  opacity: 1; /* 💡 툴팁 하단 해금 날짜 문구가 보이도록 opacity 수정 */
`;