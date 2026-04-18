// 변경점: MenuBoxFixed 추가(포탈용), MenuOverlay z-index 상향, MenuBox shadow 수정

import styled from "styled-components";
import { flexCenter, flexBetweenRow, FONT_STYLE } from "../../styles/common";

/* ---------- modal ---------- */

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  background: rgba(0, 0, 0, 0.45);
  ${flexCenter}

  padding: 28px;
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 920px;
  max-height: calc(100vh - 56px);

  background: ${({ theme }) => theme.PALLETE.white};
  border-radius: 20px;
  overflow: hidden;

  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.22);

  display: flex;
  flex-direction: column;
`;

export const Hero = styled.div`
  position: relative;
  height: 330px;
  flex-shrink: 0;
  overflow: hidden;
  background: #000;
`;

export const ImageWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

/* ✅ 배경 이미지: cover + blur */
export const HeroBg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;

  transform: scale(1.06);
  opacity: 0.5;
`;

/* ✅ 배경 딤 */
export const HeroBgDim = styled.div`
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
`;

/* ✅ 중앙 메인 이미지 컨테이너 */
export const HeroMain = styled.div`
  position: absolute;
  inset: 0;
  z-index: 5;
`;

export const HeroMainBox = styled.div`
  position: absolute;
  inset: 0;
`;

/* ✅ 중앙 메인 이미지 */
export const HeroMainImg = styled.img`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;

  object-fit: contain;
  display: block;

  box-shadow: 0 18px 60px rgba(0, 0, 0, 0.35);
`;

export const HeroPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  ${flexCenter}

  ${FONT_STYLE.PRETENDARD.H6_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[700]};
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

export const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 10;

  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }
`;

export const CloseIcon = styled.img`
  width: 22px;
  height: 22px;
`;

export const NavControls = styled.div`
  position: absolute;
  inset: 0;
  z-index: 9;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 22px;
  pointer-events: auto;
`;

export const NavButtonLeft = styled.button`
  position: absolute;
  left: 22px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 7;

  width: 56px;
  height: 56px;
  border-radius: 999px;

  border: none;
  background: rgba(255, 255, 255, 0.95);
  cursor: pointer;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: ${({ disabled }) => (disabled ? 0.3 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};

  &:hover {
    background: ${({ theme }) => theme.PALLETE.gray[100]};
  }
`;

export const NavIcon = styled.img`
  width: 18px;
  height: 18px;
  display: block;
`;

export const NavButtonRight = styled(NavButtonLeft)`
  left: auto;
  right: 22px;
`;

export const ImageIndex = styled.div`
  position: absolute;
  right: 18px;
  bottom: 14px;
  z-index: 8;

  padding: 6px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.55);

  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: #fff;
`;

/* ---------- body ---------- */

export const Body = styled.div`
  display: grid;
  grid-template-columns: 1fr 1.05fr;
  gap: 22px;
  padding: 22px 24px 24px;

  flex: 1;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    overflow-y: auto;
  }
`;

export const Left = styled.div`
  min-width: 0;
  min-height: 0;
`;

export const Right = styled.div`
  min-width: 0;
  min-height: 0;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;
`;

export const Nickname = styled.div`
  ${FONT_STYLE.PRETENDARD.H6_REGULAR};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.SEMIBOLD};
  color: ${({ theme }) => theme.PALLETE.mainblack};
`;

export const MetaRight = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const LevelBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  padding: 6px 10px;
  border-radius: 5px;

  background: ${({ theme }) => theme.PALLETE.primary.sub};
  color: ${({ theme }) => theme.PALLETE.primary.main};

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.MEDIUM};
`;

export const LevelIcon = styled.img`
  width: 14px;
  height: 14px;
`;

export const LikeBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.MEDIUM};
  color: ${({ theme }) => theme.PALLETE.mainblack};
`;

export const HeartIcon = styled.img`
  width: 16px;
  height: 16px;
`;

export const DateText = styled.div`
  margin-top: 8px;
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[600]};
`;

export const Title = styled.h2`
  margin: 18px 0 10px;
  ${FONT_STYLE.PRETENDARD.H6_SEMIBOLD};
  color: ${({ theme }) => theme.PALLETE.mainblack};
`;

export const Desc = styled.p`
  margin: 0 0 10px;
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  line-height: 1.55;

  ${({ $expanded }) =>
    $expanded
      ? `
        display: block;
        overflow: visible;
      `
      : `
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
      `}
`;

export const DetailLink = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  margin-bottom: 18px;

  ${FONT_STYLE.PRETENDARD.H7_MEDIUM};
  color: ${({ theme }) => theme.PALLETE.primary.main};

  &:hover {
    text-decoration: underline;
  }
`;

export const SectionTitle = styled.div`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.SEMIBOLD};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  margin-bottom: 10px;
`;

export const ChipRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
`;

export const Chip = styled.span`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[800]};

  background: ${({ theme }) => theme.PALLETE.gray[100]};
  border-radius: 5px;
  padding: 4px 8px;
`;

export const XpBox = styled.div`
  margin-top: 8px;
  padding: 12px 14px;
  border-radius: 8px;

  background: ${({ theme }) => theme.PALLETE.primary.sub};

  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.primary.mainblack};

  b {
    color: ${({ theme }) => theme.PALLETE.primary.main};
    font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.SEMIBOLD};
  }
`;

/* ---------- comments ---------- */

export const CommentCard = styled.div`
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[300]};
  border-radius: 10px;
  background: ${({ theme }) => theme.PALLETE.white};
  padding: 10px 12px;

  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  overflow: hidden;
`;

export const CommentHeader = styled.div`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.SEMIBOLD};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  /* ${flexBetweenRow} */
  display: flex;
  align-items: center;
  /* align-items: flex-end; */
  gap: 10px;
  /* padding: 6px 0; */
  padding: 2px 0;
`;

export const CommentHeaderTop = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const SectionDivider = styled.div`
  border-top: 1px solid ${({ theme }) => theme.PALLETE.gray[200]};
  margin: 6px -12px 10px;
`;

export const CommentHeaderMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 8px;

  padding: 8px;
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[200]};
  border-radius: 10px;
  background: ${({ theme }) => theme.PALLETE.white};
`;

export const CommentHeaderMenuItem = styled.button`
  border: none;
  background: ${({ theme }) => theme.PALLETE.gray[50]};
  cursor: pointer;

  padding: 10px 12px;
  border-radius: 8px;
  text-align: left;

  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};

  &:hover {
    background: ${({ theme }) => theme.PALLETE.gray[100]};
  }
`;



export const CommentScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;

  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 6px;
`;

export const EmptyComment = styled.div`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[600]};
  padding: 8px 2px;
`;

export const CommentItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

export const CommentTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const CommentTextWrap = styled.div`
  /* padding: 6px 0 2px; */
  padding: 6px 0 0px;

  border-bottom: ${({ theme, $editing }) =>
    $editing
      ? `1px solid ${theme.PALLETE.primary.main}`
      : "1px solid transparent"};
`;

export const EditTextarea = styled.textarea`
  width: 100%;
  resize: none;
  border: none;
  outline: none;
  background: transparent;

  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  line-height: 1.5;
  word-break: break-word;

  padding: 0;
  margin: 0;
`;

export const EditActionRow = styled.div`
  margin-top: 6px;
  display: flex;
  justify-content: flex-end;
  gap: 6px;
`;

export const EditActionButton = styled.button`
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[300]};
  border-radius: 5px;
  background: transparent;
  cursor: pointer;
  padding: 4px 6px;

  ${FONT_STYLE.PRETENDARD.H8_REGULAR};

  color: ${({ theme, $primary }) =>
    $primary ? theme.PALLETE.primary.main : theme.PALLETE.gray[700]};

  opacity: ${({ disabled }) => (disabled ? 0.4 : 1)};
  pointer-events: ${({ disabled }) => (disabled ? "none" : "auto")};
`;

export const CommentLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
  margin-bottom: -20px;
`;

export const CommentNickname = styled.div`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.SEMIBOLD};
  color: ${({ theme }) => theme.PALLETE.mainblack};
`;

export const CommentMeta = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

export const CommentTime = styled.div`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[600]};
`;

export const MineTag = styled.span`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[700]};
  position: relative;
  padding-left: 10px;

  &::before {
    content: "·";
    position: absolute;
    left: 2px;
    top: 0;
    color: ${({ theme }) => theme.PALLETE.gray[500]};
  }
`;

export const CommentText = styled.div`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[900]};
  line-height: 1.5;
  word-break: break-word;
`;

export const CommentMenuWrap = styled.div`
  margin-left: auto;
  position: relative;
`;

/* ✅ 점3개 버튼 */
export const KebabButton = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;

  &:hover {
    background: ${({ theme }) => theme.PALLETE.gray[100]};
  }
`;

/* ✅ 점3개 */
export const KebabDots = styled.div`
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: ${({ theme }) => theme.PALLETE.gray[500]};
  position: relative;

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: ${({ theme }) => theme.PALLETE.gray[500]};
  }

  &::before {
    top: -7px;
  }
  &::after {
    top: 7px;
  }
`;

/* ✅ 포탈 메뉴 뒤 클릭막이(스크롤 영역 밖이라 fixed) */
export const MenuOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 100000;
`;

/* ✅ 포탈 메뉴 박스(스크롤 overflow 영향 X) */
export const MenuBoxFixed = styled.div`
  position: fixed;
  z-index: 100001;

  width: 110px;
  background: ${({ theme }) => theme.PALLETE.white};
  border: 1px solid ${({ theme }) => theme.PALLETE.gray[200]};
  border-radius: 10px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.12);

  padding: 6px;

  display: flex;
  flex-direction: column;
`;

/* ✅ 메뉴 아이템 */
export const MenuItem = styled.button`
  width: 100%;
  border: none;
  background: transparent;
  cursor: pointer;

  display: flex;
  align-items: center;
  gap: 8px;

  padding: 10px 10px;
  border-radius: 8px;

  ${FONT_STYLE.PRETENDARD.H8_REGULAR};

  color: ${({ theme }) => theme.PALLETE.mainblack};

  &:hover {
    color: ${({ theme }) => theme.PALLETE.primary.main};
  }

  ${({ $danger, theme }) =>
    $danger &&
    `
      &:hover {
        color: ${theme.PALLETE.error};
      }
    `}
`;

export const MenuIcon = styled.img`
  width: 16px;
  height: 16px;
  display: block;
`;

export const CommentComposer = styled.div`
  margin-top: 18px;
  display: grid;
  grid-template-columns: 1fr 51px;
  gap: 6px;
  align-items: center;
`;

export const Textarea = styled.textarea`
  height: 50px;
  resize: none;

  border: 1px solid ${({ theme }) => theme.PALLETE.gray[300]};
  border-radius: 5px;
  padding: 15px;

  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};

  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.PALLETE.gray[500]};
  }

  &:focus {
    border-color: ${({ theme }) => theme.PALLETE.primary.main};
  }
`;

export const SendButton = styled.button`
  width: 50px;
  height: 50px;
  border-radius: 5px;

  border: none;
  cursor: pointer;

  background: ${({ theme }) => theme.PALLETE.primary.main};
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};

  &:hover {
    background: ${({ theme }) => theme.PALLETE.primary.dark ?? "#e8432e"};
  }
`;

export const SendIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const CounterRow = styled.div`
  margin-top: 4px;
  margin-right: 6px;
  display: flex;
  justify-content: end;
  align-items: center;
`;

export const CounterText = styled.div`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[900]};
`;

/* ✅ 취소/저장 버튼 영역 */
export const ActionRow = styled.div`
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
  gap: 12px;
`;

export const ActionButton = styled.button`
  height: 40px;
  min-width: 108px;
  padding: 0 16px;
  border-radius: 8px;
  cursor: pointer;

  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.SEMIBOLD};

  border: ${({ theme, $variant }) =>
    $variant === "primary"
      ? "none"
      : `1px solid ${theme.PALLETE.primary.main}`};

  background: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.PALLETE.primary.main : "transparent"};

  color: ${({ theme, $variant }) =>
    $variant === "primary" ? theme.PALLETE.white : theme.PALLETE.primary.main};

  opacity: ${({ $disabled }) => ($disabled ? 0.5 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? "none" : "auto")};
`;
