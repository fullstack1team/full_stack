import styled from "styled-components";
import { flexCenter, FONT_STYLE } from "../../../styles/common";

export const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 9999;

  background: rgba(0, 0, 0, 0.35);

  ${flexCenter}
`;

export const Modal = styled.div`
  width: 100%;
  max-width: 500px;

  background: ${({ theme }) => theme.PALLETE.white};

  border-radius: 20px;
  padding: 36px 28px 28px;

  text-align: center;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.18);
`;

export const IconWrapper = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 22px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 50%;

  background: ${({ theme }) => theme.PALLETE.primary.main};
  color: ${({ theme }) => theme.PALLETE.white};

  font-size: 42px;
  font-weight: 700;
  line-height: 1;
`;

export const Title = styled.h2`
  ${FONT_STYLE.PRETENDARD.H5_BOLD};

  color: ${({ theme }) => theme.PALLETE.mainblack};

  margin-bottom: 10px;
`;

export const Desc = styled.p`
  ${FONT_STYLE.PRETENDARD.H7_REGULAR};

  color: ${({ theme }) => theme.PALLETE.gray[700]};

  line-height: 1.5;

  margin-bottom: 24px;
`;

export const Divider = styled.div`
  height: 1px;

  background: ${({ theme }) => theme.PALLETE.gray[200]};

  margin-bottom: 34px;
`;

export const ButtonRow = styled.div`
  display: flex;
  justify-content: center;

  gap: 16px;

  margin-bottom: 10px;
`;

export const CancelButton = styled.button`
  height: 48px;
  width: 140px;

  border-radius: 8px;

  cursor: pointer;

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};

  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.MEDIUM};

  border: 1px solid ${({ theme }) => theme.PALLETE.gray[300]};

  background: transparent;

  color: ${({ theme }) => theme.PALLETE.gray[700]};

  &:hover {
    background: ${({ theme }) => theme.PALLETE.gray[100]};
  }

  &:active {
    background: ${({ theme }) => theme.PALLETE.gray[200]};
  }
`;

export const ConfirmButton = styled.button`
  height: 48px;
  width: 160px;

  border-radius: 8px;

  cursor: pointer;

  ${FONT_STYLE.PRETENDARD.H7_REGULAR};

  font-weight: ${({ theme }) => theme.FONT_WEIGHT.PRETENDARD.MEDIUM};

  border: none;

  background: ${({ theme }) => theme.PALLETE.primary.main};

  color: ${({ theme }) => theme.PALLETE.white};

  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.88;
  }

  &:active {
    opacity: 1;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.PALLETE.primary.main};
    outline-offset: 3px;
  }
`;
