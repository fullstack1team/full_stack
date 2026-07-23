import { FONT_STYLE } from "../../styles/common";
import styled, { keyframes } from "styled-components";

/** ---------------------------
 * SortTab (오른쪽 정렬 탭)
 * --------------------------- */
export const SortTabWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2px;
  margin-top: 40px;
  margin-bottom: 60px;
`;

export const SortTabButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};

  color: ${({ theme, $active }) =>
    $active ? theme.PALLETE.mainblack : theme.PALLETE.gray[700]};
  font-weight: ${({ $active }) => ($active ? 600 : 400)};

  transition: color 0.15s ease;
  position: relative;

  /* 구분자 | */
  &::after {
    content: ${({ $isLast }) => ($isLast ? "''" : "'|'")};
    margin-left: 6px; /* ← 핵심 */
    color: ${({ theme }) => theme.PALLETE.gray[300]};
    font-weight: 400;
  }

  &:hover {
    color: ${({ theme }) => theme.PALLETE.mainblack};
  }
`;

/** ---------------------------
 * Grid (4열)
 * --------------------------- */
export const Grid = styled.div`
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

/** ---------------------------
 * Card (1번 스타일)
 * - 보더/그림자 없음
 * - 썸네일 정사각형
 * --------------------------- */
export const Card = styled.button`
  width: 100%;
  background: transparent;
  border: none;
  padding: 0;
  text-align: left;
  cursor: pointer;

  /* 버튼 기본 스타일 제거 */
  appearance: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.PALLETE.primary.main};
    outline-offset: 6px;
    border-radius: 14px;
  }
`;

const pop = keyframes`
  0%   { transform: scale(1); }
  35%  { transform: scale(1.25); }
  65%  { transform: scale(0.92); }
  100% { transform: scale(1); }
`;

// export const ThumbArea = styled.div`
//   position: relative;
//   width: 100%;
//   aspect-ratio: 1 / 1; /* 정사각형 */
//   border-radius: 18px; /* 1번처럼 둥글게 */
//   overflow: hidden;
// `;

// export const ThumbImg = styled.img`
//   width: 100%;
//   height: auto;
//   object-fit: cover;
//   display: block;
//   transform: translateZ(0);
// `;

export const ThumbArea = styled.div`
  width: 100%;
  aspect-ratio: 1 / 1;
  position: relative;
  overflow: hidden;
  border-radius: 16px;
  background: #f5f5f5;
`;

export const ThumbImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const BookmarkIcon = styled.img`
  position: absolute;
  top: 12px;
  right: 12px;

  width: 28px;
  height: 28px;

  cursor: pointer;
  z-index: 2;

  transition:
    transform 0.15s ease,
    opacity 0.15s ease;
  transform-origin: center;

  &:hover {
    transform: scale(1.08);
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus-visible {
    outline: 2px solid rgba(0, 0, 0, 0.25);
    outline-offset: 3px;
    border-radius: 6px;
  }

  /*  저장된 상태로 바뀔 때 살짝 튕김 */
  &[data-saved="true"] {
    animation: ${pop} 240ms ease-out;
  }
`;

/** ---------------------------
 * Text / Badges / Chips
 * --------------------------- */
export const Body = styled.div`
  padding-top: 14px;
`;

export const Title = styled.h6`
  ${FONT_STYLE.PRETENDARD.H6_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  margin: 0 0 10px;
  line-height: 1.3;

  /* 너무 길면 ... 처리 (1번처럼) */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const Desc = styled.p`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.primary.mainblack};
  margin: 6px 0 14px;
  line-height: 22px;

  /* 두 줄에서 ... 처리 */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

export const BadgeRow = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
`;

export const Badge = styled.span`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 10px;
  /* font-weight: 600; */
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.SEMIBOLD};

  &.star {
    background: ${({ theme }) => theme.PALLETE.primary.sub};
    color: ${({ theme }) => theme.PALLETE.primary.main};
  }

  &.xp {
    background: #dff7f1;
    color: ${({ theme }) => theme.PALLETE.secondary};
  }
`;

export const BadgeStar = styled.i`
  font-style: normal;
  line-height: 1;
`;

export const MetaRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }
`;

export const MetaChip = styled.span`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  display: inline-flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.PALLETE.gray[100]};
  color: ${({ theme }) => theme.PALLETE.mainblack};

  padding: 10px 12px;
  border-radius: 999px;
  white-space: nowrap;
`;

export const MissingTooltip = styled.div`
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  transform: translate(-50%, 5px);

  width: max-content;
  min-width: 150px;
  max-width: 240px;
  padding: 10px 12px;

  border-radius: 10px;
  background: rgba(32, 32, 32, 0.96);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);

  color: #fff;
  text-align: left;
  white-space: normal;

  opacity: 0;
  visibility: hidden;
  pointer-events: none;

  transition:
    opacity 0.18s ease,
    transform 0.18s ease;

  z-index: 30;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);

    border-width: 6px;
    border-style: solid;
    border-color: rgba(32, 32, 32, 0.96) transparent transparent transparent;
  }
`;

export const MissingChipWrap = styled.div`
  position: relative;
  flex: 1;
  min-width: 0;

  & > ${MetaChip} {
    width: 100%;
    box-sizing: border-box;
  }

  &:hover ${MissingTooltip},
  &:focus-within ${MissingTooltip} {
    opacity: 1;
    visibility: visible;
    transform: translate(-50%, 0);
  }
`;

export const TooltipTitle = styled.div`
  margin-bottom: 4px;
  font-size: 12px;
  font-weight: 700;
`;

export const TooltipText = styled.div`
  font-size: 12px;
  line-height: 1.5;
  word-break: keep-all;
`;

/** ---------------------------
 * MyRecipeEmpty (빈 화면)
 * --------------------------- */

export const MyRecipeEmptyWrapper = styled.div`
  min-height: calc(100vh - 260px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

export const MyRecipeEmptyImage = styled.img`
  width: 400px;
  height: auto;
  margin-bottom: 24px;
`;

export const MyRecipeEmptyTitle = styled.h2`
  ${FONT_STYLE.GIANTS.H5_REGULAR};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.SEMIBOLD};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  margin-bottom: 8px;
`;

export const MyRecipeEmptyDesc = styled.p`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[700]};
`;

/** ---------------------------
 * MyRecipeEmpty CTA Button
 * --------------------------- */

export const MyRecipeEmptyButton = styled.button`
  margin-top: 32px;
  padding: 10px 28px;
  border-radius: 5px;

  border: 1px solid #ff4e37;
  cursor: pointer;

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.MEDIUM};

  background: ${({ theme }) => theme.PALLETE.white};
  color: ${({ theme }) => theme.PALLETE.primary.mainblack};

  /* transition:
    background-color 0.15s ease,
    transform 0.15s ease; */

  &:hover {
    background: ${({ theme }) => theme.PALLETE.primary.sub};
    color: ${({ theme }) => theme.PALLETE.mainblack};
    /* transform: translateY(-2px); */
  }

  &:active {
    background: ${({ theme }) => theme.PALLETE.primary.main};
    color: ${({ theme }) => theme.PALLETE.white};
    transform: translateY(-2px);
  }
`;
