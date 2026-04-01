import styled from "styled-components";
import theme from "../../styles/theme";
import { flexCenter, FONT_STYLE } from "../../styles/common";
import { Link } from "react-router-dom";

const S = {};

S.Form = styled.form`
  /* border:solid 1px; */
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
`;

S.Input = styled.input`
  width: 100%;
  height: 50px;
  border-radius: 5px;
`;

S.Button = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 5px;
  background: ${theme.PALLETE.primary.main};
  color: white;
  opacity: 0.9;
  margin: 10px 0 5px 0;
`;

S.ConfirmMessage = styled.p`
  color: ${theme.PALLETE.primary.main};
  min-height: 20px;
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
