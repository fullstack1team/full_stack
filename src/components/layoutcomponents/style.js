import styled from "styled-components";
import { Link } from "react-router-dom";
import { flexBetweenRow, flexCenter, FONT_STYLE } from "../../styles/common";

// 플로팅 액션 섹션
export const FloatingWrapper = styled.div`
  position: fixed;
  right: 32px;
  bottom: 32px;
  z-index: 1000;
`;

export const ScrollButton = styled.button`
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 1px solid  ${({ theme }) => theme.PALLETE.gray[300]};

  background-color: ${({ theme }) => theme.PALLETE.white};

  color: ${({ theme }) => theme.PALLETE.mainblack};

  font-size: 20px;
  font-weight: 700;

  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    transform: translateY(-4px);
  }
`;

/* ================= Header styles ================= */


export const HeaderOuter = styled.header`
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
`;

export const HeaderInner = styled.div`
  max-width: 1420px;
  margin: 0 auto;
  padding: 24px 20px 16px;

  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export const TopRow = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;
`;

export const LogoArea = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: #111;
  white-space: nowrap;
`;

export const LogoWrap = styled.div`
  ${flexCenter};
  gap: 5px;
`;

export const LogoIcon = styled.img`
  height: 30px;
  margin-right: 10px;
`;

export const LogoText = styled.span`
  font-size: 22px;
  font-weight: 800;
  letter-spacing: -0.4px;
`;

export const SearchArea = styled.div`
  flex: 1;
  max-width: 720px;
  height: 44px;
  border: 2px solid #ff3b30;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 0 10px 0 14px;
`;

export const SearchInput = styled.input`
  flex: 1;
  height: 100%;
  border: none;
  outline: none;

  font-size: 14px;
`;

export const SearchBtn = styled.button`
  width: 34px;
  height: 34px;

  border: none;
  background: transparent;
  cursor: pointer;

  color: #ff3b30;
  font-size: 16px;

  display: grid;
  place-items: center;
`;

export const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
`;

export const RightArea = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
`;

export const RightLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;

  text-decoration: none;
  color: #111;

  &:hover {
    text-decoration: underline;
  }
`;

export const ProfileButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  background: transparent;
  color: #111;
  cursor: pointer;
  padding: 0;

  &:hover {
    text-decoration: underline;
  }
`;

export const RightIcon = styled.img`
  font-size: 14px;
  height: 14px;
  object-fit: contain;
`;

export const ProfileTextIcon = styled.span`
  font-size: 14px;
  line-height: 1;
`;

export const RightText = styled.span`
  ${FONT_STYLE.PRETENDARD.H8_REGULAR};
  font-weight: 600; 
`;

export const BottomRow = styled.div`
  ${flexBetweenRow}
`;

export const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 70px;

  @media (max-width: 900px) {
    gap: 22px;
    flex-wrap: wrap;
  }
`;

export const NavItem = styled(Link)`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  position: relative;
  text-decoration: none;
  color: #111;

  /* font-size: 14px; */
  font-weight: 600;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;   /* underline margin */
    width: 100%;
    height: 1px;
    background: transparent;
    transition: 0.2s;
  }

  &:hover {
    color: ${({ theme }) => theme.PALLETE.primary.main};
  }

  &:hover::after {
    background: ${({ theme }) => theme.PALLETE.primary.main};
  }
`;

/* ========== Footer styles ========== */

export const FooterOuter = styled.footer`
  width: 100%;
  background: #f5f5f5;
`;

export const FooterInner = styled.div`
  height: 216px;
  max-width: 1920px;
  margin: 0 auto;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 360px;

  @media (max-width: 1400px) {
    padding: 0 80px;
  }

  @media (max-width: 768px) {
    height: auto;
    padding: 28px 20px;
    flex-direction: column;
    gap: 18px;
    align-items: flex-start;
  }
`;

export const Left = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const TopLinks = styled.nav`
  display: flex;
  align-items: center;
  gap: 10px;

  a {
    font-size: 12px;
    color: #222;
    text-decoration: none;
    letter-spacing: -0.2px;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export const Dot = styled.span`
  font-size: 12px;
  color: #777;
`;

export const CompanyRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #444;
`;

export const CompanyName = styled.span`
  font-size: 12px;
  letter-spacing: -0.2px;
`;

export const Divider = styled.span`
  width: 1px;
  height: 12px;
  background: #d6d6d6;
`;

export const CompanyDropdown = styled.button`
  border: none;
  background: transparent;
  cursor: pointer;

  font-size: 12px;
  color: #444;
  letter-spacing: -0.2px;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  &:hover {
    text-decoration: underline;
  }
`;

export const Chevron = styled.span`
  font-size: 12px;
  transform: translateY(-1px);
  color: #666;
`;

export const Copyright = styled.p`
  margin: 0;
  font-size: 11px;
  color: #b7b7b7;
  letter-spacing: -0.2px;
`;

export const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 18px;

  @media (max-width: 768px) {
    gap: 12px;
  }
`;

export const IconGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const IconBtn = styled.button`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  border: none;
  background: #e9e9e9;
  cursor: pointer;

  display: grid;
  place-items: center;

  font-size: 16px;
  color: #666;

  &:hover {
    background: #e2e2e2;
  }
`;

export const SiteGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const SiteBtn = styled.button`
  height: 38px;
  padding: 0 18px;
  border-radius: 999px;
  border: none;
  background: #e9e9e9;
  cursor: pointer;

  font-size: 12px;
  color: #444;
  letter-spacing: -0.2px;

  &:hover {
    background: #e2e2e2;
  }
`;

export const PlusBtn = styled.button`
  width: 38px;
  height: 38px;
  border-radius: 999px;
  border: none;
  background: #e9e9e9;
  cursor: pointer;

  display: grid;
  place-items: center;

  font-size: 18px;
  color: #666;
  line-height: 0;

  &:hover {
    background: #e2e2e2;
  }
`;

/* ================= ProfileBar styles ================= */
export const SidebarContainer = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 390px;
  height: 100vh;
  background-color: white;
  z-index: 1000;
  padding: 35px;

  /* [핵심] isOpen 상태에 따라 위치를 이동시킴 */
  transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(100%)")};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: transform 0.3s ease-in-out, visibility 0.3s;
`;

export const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(81, 81, 81, 0.44);
  z-index: 999;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

export const CloseButton = styled.button`
  margin: 0 0 100% 0;
`;

export const ProfileImgWrap = styled.div`
  width: 100%;
  height: 130px;
  display: flex;
  justify-content: space-between;
`;

export const ProfileTitles = styled.p`
  ${FONT_STYLE.PRETENDARD.H6_BOLD};
  margin: 10px 0 10px 0;
  color: ${({ theme }) => theme.PALLETE.headerandfooter};
`;

export const ProfileUserInfoContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const ProfileUserName = styled.span`
  ${FONT_STYLE.PRETENDARD.H7_SEMIBOLD};
  margin: 0 10px 0 0;
`;
export const ProfileUserLevel = styled.div`
  width: 70px;
  height: 28px;
  ${flexCenter};
  ${FONT_STYLE.PRETENDARD.H7_MEDIUM};
  color: ${({ theme }) => theme.PALLETE.primary.main};
  background: #fff2e8;
  border-radius: 5px;
  gap: 10px;
  margin: 0 10px 0 0;
`;
export const ProfileUserXp = styled.div`
  width: 70px;
  height: 28px;
  ${flexCenter};
  ${FONT_STYLE.PRETENDARD.H7_MEDIUM};
  color: ${({ theme }) => theme.PALLETE.secondary};
  border-radius: 5px;
  background: #dff7f1;
`;
export const ProfileUserCreateAt = styled.p`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  margin: 5px 0 0 0;
`;

export const ProfileContainer = styled.div`
  padding: 20px 0 20px 0;
  border-bottom: 1px solid ${({ theme }) => theme.PALLETE.gray[300]};
  display:flex;
  flex-direction:column;
  gap: 5px;
`;

export const ChangeButton = styled.button`
text-align:left;
`