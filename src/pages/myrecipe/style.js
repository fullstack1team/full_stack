import { styled } from "styled-components";
import { FONT_STYLE } from "../../styles/common";
import { keyframes } from "framer-motion";

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

  
  /* 데스크탑 */
  @media (max-width: 1920px) {
    width: 100%;
    padding: 24px 20px 80px;
  }
  
  /* 모바일 */
  @media (max-width: 520px) {
    padding: ${({ $header }) => 
      $header ? "8px 20px 0" : "20px 20px 40px"};
  }
`;

export const FullDivider = styled.div`
  width: 100%;
  height: 1px;
  margin: 30px 0 0;
  background-color: ${({ theme }) => theme.PALLETE.gray[100]};

  @media (max-width: 520px) {
    margin-top: 8px;
  }
`;

export const LoadingWrapper = styled.div`
  min-height: calc(100vh - 260px);

  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LoadingSpinner = styled.div`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};
  color: ${({ theme }) => theme.PALLETE.gray[700]};
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

//
export const SortRow = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;

  padding-top: 36px;
  padding-bottom: 16px;
  margin: 0;

  /* 모바일에선 최신순 | 조리 빠른순 | 난이도 낮은순 사라짐 */
  @media (max-width: 520px) {
    display: none;
  }
`;
