import React from "react";
import S from "./style";
import { API_BASE_URL } from "../../config/api";

const QuickLoginComponent = () => {
  return (
    <>
      <S.Fieldset>
        <legend align="center">&nbsp;간편 로그인&nbsp;</legend>
        <S.Link to={`${API_BASE_URL}/auth/kakao`}>
          <img src="\assets\icons\kakao_button.png" />
        </S.Link>
        <S.Link to={`${API_BASE_URL}/auth/naver`}>
          <img src="\assets\icons\naver_button.png" />
        </S.Link>
        <S.Link to={`${API_BASE_URL}/auth/google`}>
          <img src="\assets\icons\google_button.png" />
        </S.Link>
      </S.Fieldset>
    </>
  );
};

export default QuickLoginComponent;
