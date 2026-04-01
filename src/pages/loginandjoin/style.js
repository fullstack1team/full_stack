import styled from "styled-components";
import { FONT_STYLE } from "../../styles/common";
import theme from "../../styles/theme";

const S = {};

S.Screen = styled.div`
width: 100%;
padding: 100px 0;
height: 100%;
display:flex;
flex-direction:column;
align-items:center;
min-height: calc(100vh - 250px);
`
S.Wrapper = styled.div`
width: 360px;
display: flex;
flex-direction:column;
align-items:center;
gap: 20px;
`
S.Title = styled.p`
${FONT_STYLE.GIANTS.H4_BOLD};
color:${theme.PALLETE.headerandfooter};
margin-bottom: 50px;
`
S.ServiceWrapper = styled.div`
display:flex;
gap:15px;
margin: 10px 0;
${FONT_STYLE.PRETENDARD.H8_REGULAR};
color:${theme.PALLETE.gray[900]};

a {
    color: inherit;
    text-decoration: none;
  }
`;



export default S;