import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; 
import FindIdComponent from "../../components/logincomponents/FindIdComponent";
import FindPwComponent from "../../components/logincomponents/FindPwComponent";
import QuickLoginComponent from "../../components/logincomponents/QuickLoginComponent";
import Login from "../../components/logincomponents/Login";
import useAuthStore from "../../store/useAuthStore";
import S from "./style";

const LoginPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {

    if (isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }
    
    const checkLogin = async () => {
      try {
        const response = await fetch("http://localhost:10000/auth/test-jwt", {
          method: "GET",
          credentials: "include", 
        });

        if (response.ok) {
          navigate("/", { replace: true }); 
        }
      } catch (error) {
        console.log("비로그인 상태입니다.");
      }
    };

    checkLogin();
  }, [navigate, isAuthenticated]);

  return (
    <S.Screen>
      <S.Title>로그인</S.Title>
      <S.Wrapper>
        <Login />

        <S.ServiceWrapper>
          <FindIdComponent />
          <p>|</p>
          <FindPwComponent />
          <p>|</p>
          <Link to={"/join"}>회원가입</Link>
        </S.ServiceWrapper>
        <QuickLoginComponent />
      </S.Wrapper>
    </S.Screen>
  );
};

export default LoginPage;
