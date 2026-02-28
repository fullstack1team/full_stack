import { css, styled } from "styled-components";
import { flexBetweenRow, flexCenter } from "../../styles/common";
import { FONT_STYLE } from "../../styles/common";
import { keyframes } from "styled-components";

// 검색창 아무것도 입력 안하고 검색하면 나오는 효과
export const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  50% { transform: translateX(4px); }
  75% { transform: translateX(-4px); }
  100% { transform: translateX(0); }
`;

// 페이지 전체
export const Page = styled.main`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.PALLETE.background.white};
`;

// 컨텐츠 컨테이너
export const Container = styled.div`
  max-width: 1420px; // 1920 기준 가운데 본문 폭
  margin: 0 auto;
  padding: 24px 0 80px;

  @media (max-width: 1920px) {
    width: 100%;
    padding: 24px 20px 80px;
  } // 1920보다 화면이 작으면 생기는 가로 스크롤 방지
`;

// **헤더 영역**
export const HeaderSection = styled.section`
  width: 100%;
  margin-top: 68px;
  padding-bottom: 24px;

  /* 좌우 여백 추가 */
  padding-left: 130px;
  padding-right: 130px;
`;
// 타이틀
export const Title = styled.h6`
  ${FONT_STYLE.GIANTS.H6_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  margin-bottom: 16px;
`;
// 검색줄
export const SearchRow = styled.div`
  ${flexBetweenRow};
  gap: 20px;
`;
// 검색 인풋
export const SearchInput = styled.input`
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
  }

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.PALLETE.primary.main};
    background-color: ${({ theme }) => theme.PALLETE.background.white};
  }
`;

// 검색 input + 아이콘 감싸는 레퍼
export const SearchWrap = styled.div`
  position: relative;
  width: 1028px;
  height: 40px;

  ${({ $error }) =>
    $error &&
    css`
      animation: ${shake} 0.35s ease;
      border: 2px solid
        ${({ theme, $error }) =>
          $error ? theme.PALLETE.error : theme.PALLETE.gray[200]};
      border-radius: 5px;
    `}
`;
export const SearchButton = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);

  border: 0;
  background: transparent;
  padding: 0;
  cursor: pointer;

  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

// 검색 아이콘
export const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
`;

// 필터 버튼
export const FilterButton = styled.button`
  height: 40px;
  width: 130px;
  padding: 0 10px;
  white-space: nowrap; /* 줄바꿈 방지 */

  ${flexCenter}
  gap: 6px;

  border-radius: 5px;
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[300]};
  background-color: ${({ theme }) => theme.PALLETE.background.white};

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme, $active }) =>
    $active ? theme.PALLETE.primary.main : theme.PALLETE.mainblack};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};

  cursor: pointer;
`;

// 필터 아이콘
export const FilterIcon = styled.img`
  width: 24px;
  height: 24px;
`;
// 정렬 드랍다운 감싸는 래퍼 (버튼 기준으로 드랍다운 위치 잡기)
export const DropdownWrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

// 드랍다운 메뉴 박스 (피그마: width 115px / height 79px)
export const DropdownMenu = styled.div`
  position: absolute;
  top: 46px;
  right: 0;

  min-width: 150px;
  width: max-content; /* 내용에 맞게 늘어나게 */
  padding: 6px;

  background: ${({ theme }) => theme.PALLETE.background.white};
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[300]};
  border-radius: 5px;

  display: flex;
  flex-direction: column;
  gap: 4px;

  z-index: 50;
  box-shadow: 0px 8px 18px rgba(0, 0, 0, 0.04); /* 쉐도우 고민 중.. */
`;

// 드랍다운 항목
export const DropdownItem = styled.button`
  width: 100%;
  height: 36px;

  ${flexCenter}
  justify-content: flex-start;

  padding: 0 14px;
  white-space: nowrap; /* 줄바꿈 금지 */

  border: none;
  background: transparent;
  border-radius: 5px;

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  cursor: pointer;

  color: ${({ theme }) => theme.PALLETE.mainblack};
  transition:
    color 0.12s ease,
    font-weight 0.12s ease;

  &:hover {
    color: ${({ theme }) => theme.PALLETE.primary.main};
    font-weight: 700;
  }
`;

// 섹션 구분선
export const FullDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 30px 0 0; // 피그마상에선 70px이지만 실제 구현시 공간 낭비가 심해 30px로 줄임
  background-color: ${({ theme }) => theme.PALLETE.gray[100]};
`;

// **트랜딩 케러셀 영역**
export const CarouselSection = styled.section`
  width: 100%;
  margin-top: 68px;
  padding-bottom: 24px;
`;

export const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SectionTitle = styled.h4`
  // 피그마상 폰트사이즈 26px이지만 theme에 공용 사이즈 없어서 h4로 설정
  ${FONT_STYLE.GIANTS.H4_REGULAR}
  color: ${({ theme }) => theme.PALLETE.mainblack};
  margin-bottom: 18px;
`;

export const SectionDesc = styled.p`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[700]};
  margin-bottom: 34px;
`;
// 캐러셀 본문(버튼 + 뷰포트)
export const CaroselBody = styled.div`
  position: relative;
  width: 100%;
  /* padding: 0 130px; */
`;

// 잘라내는 창
export const CarouselViewport = styled.div`
  overflow: hidden;
  width: 100%;
`;

// 카드들이 한 줄로 가로 나열되는 트랙
export const CarouselTrack = styled.div`
  display: flex;
  gap: 22px; // 여기 gap 건드릴거면 const GAP 과 동일해야함 EX) const GAP = 20 면 gap: 20px;
  transition: transform 0.28s ease;
  will-change: transform;
`;

// 좌/우 네비 버튼(뼈대)
export const CarouselNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);

  ${({ $direction }) =>
    $direction === "prev" ? "left: -24px;" : "right: -24px;"}

  width: 50px; // 피그마상 60px
  height: 50px;
  border-radius: 50%;
  z-index: 10;

  /* border: 1px solid ${({ theme }) => theme.PALLETE.gray[300]}; */
  background: ${({ theme }) => theme.PALLETE.background.white};
  cursor: pointer;
  box-shadow: 0px 1px 4px 4px rgba(0, 0, 0, 0.03);

  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  // 화살표 아이콘
  &::before {
    content: "";
    width: 8px;
    height: 8px;
    border-right: 2px solid ${({ theme }) => theme.PALLETE.gray[700]};
    border-bottom: 2px solid ${({ theme }) => theme.PALLETE.gray[700]};
    transform: ${({ $direction }) =>
      $direction === "prev" ? "rotate(135deg)" : "rotate(-45deg)"};
    margin-left: ${({ $direction }) => ($direction === "prev" ? "2px" : "0")};
  }
`;

// 카드 뼈대
export const CarouselCard = styled.button`
  width: ${({ $w }) =>
    $w ? (typeof $w === "number" ? `${$w}px` : $w) : "100%"};

  flex: 0 0 auto;

  /* border: 1px solid ${({ theme }) =>
    theme.PALLETE
      .gray[200]}; // 피그마상 으론 이게 맞는데 테두리 들어가니 촌스러워짐 */
  border-radius: 10px;
  background: ${({ theme }) => theme.PALLETE.background.white};
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  text-align: left;
  /* box-shadow: 0 2px 10px rgba(0,0,0,0.05); */
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);

  &:hover img {
    transform: scale(1.03);
  }

  img {
    transition: transform 0.25s ease;
  }
`;

// ✅ 카드 이미지 + 배지 오버레이용 래퍼
export const CardImageWrap = styled.div`
  position: relative;
  width: 100%;
`;

// ✅ 배지 컨테이너 (좌상단)
export const BadgeWrap = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  display: inline-flex;
  gap: 6px;
  z-index: 2;
`;

// ✅ NEW 배지
export const BadgeNew = styled.span`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  padding: 4px 8px;
  border-radius: 6px;
  background: ${({ theme }) => theme.PALLETE.primary.main};
  color: ${({ theme }) => theme.PALLETE.white};
  font-weight: 700;
  white-space: nowrap;
`;

// ✅ 인기 배지
export const BadgePopular = styled.span`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  padding: 4px 8px;
  border-radius: 6px;
  background: ${({ theme }) => theme.PALLETE.secondary};
  color: ${({ theme }) => theme.PALLETE.white};
  font-weight: 700;
  white-space: nowrap;
`;

// 이미지 영역 placeholder
export const CardImageArea = styled.img`
  height: 161px;
  width: 100%;
  object-fit: cover;
  display: block;
`;

// 내용 영역 placeholder
export const CardContentArea = styled.div`
  /* padding: 24px; */
  padding: 18px 20px 20px;
`;

export const CardTitleRow = styled.div`
  ${flexBetweenRow};
  margin-bottom: 0;
`;
export const ProfileImg = styled.img`
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  flex: 0 0 auto;
`;

export const CardTitleLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  min-width: 0; /* 제목 길면 줄임표 처리용 */
`;

export const CardTitle = styled.p`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
`;

export const CardLikeArea = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;
export const HeartIcon = styled.span`
  width: 19px;
  height: 15px;
  display: inline-block;

  background-image: ${({ $liked }) =>
    $liked
      ? "url('/assets/icons/heart.svg')"
      : "url('/assets/icons/empty_heart.svg')"};

  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;

  cursor: pointer;
`;

export const LikeCount = styled.span`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
`;

export const CardDivider = styled.div`
  width: 100%;
  height: 1px;
  background: ${({ theme }) => theme.PALLETE.gray[200]};
  margin: 14px 0 12px;
`;

export const CardMetaRow = styled.div`
  ${flexBetweenRow}
  /* gap: 17px; */
  gap: 10px;
  /* margin-bottom: 15px; */
  margin-bottom: 12px;
  /* flex-wrap: nowrap; */ // 이렇게 해버리면 닉네임 길 때 닉네임이 짤려보임
  flex-wrap: wrap;
`;
export const MetaLeft = styled.div`
  min-width: 0;
  flex: 1 1 auto;
`;

export const UserNickName = styled.p`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  font-weight: 600;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  ${({ $mine, theme }) =>
    $mine &&
    `
      position: relative;
      padding-left: 12px;

      &::before {
        content: "";
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: ${theme.PALLETE.primary.main};
      }
    `}
`;
export const MetaCenter = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
`;

export const BadgeChip = styled.span`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  /* padding: 9px; */
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  background: ${({ theme }) => theme.PALLETE.primary.sub};
  color: ${({ theme }) => theme.PALLETE.primary.main};
  font-weight: 600;
  white-space: nowrap; // 줄바꿈 방지
`;
export const BadgeChipIcon = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;
export const BadgeChip2 = styled.span`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  font-weight: 600;

  padding: 6px 10px;
  border-radius: 6px;
  background: #dff7f1; // theme에 지정컬러 없음
  color: ${({ theme }) => theme.PALLETE.secondary};

  white-space: nowrap;
`;

export const MetaRight = styled.div`
  flex: 0 0 auto;
  white-space: nowrap;
`;

export const CardDateText = styled.span`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[700]};

  max-width: 110px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
export const CardDesc = styled.p`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  line-height: 24px;

  /* 3줄까지만 보이게(원하면) */
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

// export const BadgeChip = styled.\

// 트렌딩 크러셀 ↔ 피드 그리드 구분선
export const SectionDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 60px 0 80px 0;

  background-color: ${({ theme }) => theme.PALLETE.gray[200]};
`;

// ** FeedGrid 부분
// 피드 그리드(파란 박스)
export const FeedGridSection = styled.section`
  width: 100%;
  margin-top: 52px; /* 캐러셀 아래 간격 */
  padding-bottom: 24px;
`;

export const FeedGridWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 30px; // 트랜딩 크러셀 카드에선 20px
  /* column-gap: 22px;   좌우 */
  /* row-gap: 44px;      상하 */

  /* 3열 */
  @media (max-width: 1320px) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* 2열 */
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  /* 1열 */
  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const EmptyState = styled.div`
  width: 100%;
  padding: 48px 0;
  text-align: center;
`;

export const EmptyTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
`;

export const EmptyDesc = styled.div`
  margin-top: 8px;
  font-size: 14px;
  color: #999;
`;

export const FeedGridSentinel = styled.div`
  height: 1px;
`;

export const FeedGridLoading = styled.p`
  margin-top: 18px;
  text-align: center;
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[700]};
`;

export const FeedGridEnd = styled.p`
  margin-top: 18px;
  text-align: center;
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[700]};
`;
