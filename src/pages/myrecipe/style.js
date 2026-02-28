import { styled } from "styled-components";
import { FONT_STYLE } from "../../styles/common";

/* ===========================
   Layout (CommunityMain 컨셉과 동일)
=========================== */

export const Page = styled.main`
  width: 100%;
  min-height: 100vh;
  background: ${({ theme }) => theme.PALLETE.background.white};
`;

export const Container = styled.div`
  max-width: 1420px;
  margin: 0 auto;
  padding: 24px 0 80px;

  @media (max-width: 1920px) {
    width: 100%;
    padding: 24px 20px 80px;
  }
`;

export const FullDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 30px 0 0;
  background-color: ${({ theme }) => theme.PALLETE.gray[100]};
`;

/* ===========================
   Empty State
=========================== */

export const EmptyState = styled.div`
  width: 100%;
  min-height: 360px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
`;

export const EmptyTitle = styled.p`
  ${FONT_STYLE.PRETENDARD.H6_REGULAR};
  color: ${({ theme }) => theme.PALLETE.mainblack};
  font-weight: 600;
`;

export const EmptyDesc = styled.p`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[700]};
`;