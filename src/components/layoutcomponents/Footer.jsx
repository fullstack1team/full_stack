import React from "react";
import * as S from "./style";

const Footer = () => {
  return (
    <S.FooterOuter>
      <S.FooterInner>
        {/* LEFT */}
        <S.Left>
          <S.TopLinks>
            <a href="/terms">이용약관</a>
            <S.Dot>•</S.Dot>
            <a href="/privacy">개인정보처리방침</a>
            <S.Dot>•</S.Dot>
            <a href="/about">ABOUT US</a>
            <S.Dot>•</S.Dot>
            <a href="/notice">공지사항</a>
          </S.TopLinks>

          <S.CompanyRow>
            <S.CompanyName>프리고고(주)</S.CompanyName>
            <S.Divider />
            <S.CompanyDropdown type="button">
              사업자 정보 <S.Chevron aria-hidden>▾</S.Chevron>
            </S.CompanyDropdown>
          </S.CompanyRow>

          <S.Copyright>Copyright © 프리고고, All Rights Reserved.</S.Copyright>
        </S.Left>

        {/* RIGHT */}
        <S.Right>
          <S.IconGroup>
            <S.IconBtn as="a" href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <S.IconImg src="/assets/icons/ic_insta.svg" alt="인스타 아이콘" />
            </S.IconBtn>

            <S.IconBtn as="a" href="https://kakaotalk.com" target="_blank" rel="noopener noreferrer">
              <S.IconImg src="/assets/icons/ic_kakao.svg" alt="카카오 아이콘" />
            </S.IconBtn>
          </S.IconGroup>

          <S.SiteGroup>
            <S.SiteBtn type="button">관련사이트</S.SiteBtn>
            <S.PlusBtn type="button" aria-label="더보기">
              +
            </S.PlusBtn>
          </S.SiteGroup>
        </S.Right>
      </S.FooterInner>
    </S.FooterOuter>
  );
};

export default Footer;
