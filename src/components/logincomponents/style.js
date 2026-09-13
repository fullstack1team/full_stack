import styled, { css } from "styled-components";
import theme from "../../styles/theme";
import { flexCenter, FONT_STYLE } from "../../styles/common";
import { Link } from "react-router-dom";

const S = {};

S.Form = styled.form`
  width: 90%;
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin: 0 auto;
  ${FONT_STYLE.PRETENDARD.H7_MEDIUM};
`;

S.Label = styled.label`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 5px;

  /* 서버 로그인 틀렸을 때만 '비밀번호' 텍스트를 빨간색으로 변경 */
  p {
    color: ${({ $isError }) => ($isError ? "#E53935" : "inherit")};
  }
`;

S.InputWrap = styled.div`
  position: relative;
  width: 100%;
`;

S.Input = styled.input`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  border: 1px solid ${theme.PALLETE.gray[300] || "#ccc"};
  padding: 0 45px 0 15px;
  box-sizing: border-box;
  outline: none;
  background-color: #fff;
  transition: all 0.2s ease-in-out;

  /* 💡 비밀번호 틀렸을 때만(serverError) 연분홍 배경 & 테두리 */
  ${({ $isError }) =>
    $isError &&
    css`
      background-color: #fde8e8;
      border: 1px solid #f8b4b4;
      color: #e53935;

      &::placeholder {
        color: #f89494;
      }
    `}
`;

S.PasswordToggleButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;

  &:hover {
    color: #333;
  }
`;

S.Button = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  background: ${theme.PALLETE.primary.main};
  color: white;
  opacity: 0.9;
  margin: 10px 0 5px 0;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

S.ConfirmMessage = styled.p`
  color: ${theme.PALLETE.primary.main};
  min-height: 20px;
  font-size: 13px;
`;

S.Fieldset = styled.fieldset`
  border-top: solid 1px;
  width: 90%;
  margin: 40px 0 0 0;
  color: ${theme.PALLETE.gray[500]};
  ${flexCenter};
  ${FONT_STYLE.PRETENDARD.H8_MEDIUM};
  gap: 10px;
  padding: 20px;
`;

S.Link = styled(Link)`
  width: 48px;
  height: 48px;

  img {
    width: 95%;
    height: 95%;
    object-fit: cover;
  }
`;

export default S;