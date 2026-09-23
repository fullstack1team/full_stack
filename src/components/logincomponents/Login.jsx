import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import S from "./style";
import useAuthStore from "../../store/authStore";
import { API_BASE_URL } from "../../config/api";

// 💡 이미지 파일 없이 사용할 눈 아이콘 SVG 컴포넌트
const EyeIcon = ({ show }) => {
  return show ? (
    // 눈 감은 모양 (숨기기)
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
      <line x1="1" y1="1" x2="23" y2="23"></line>
    </svg>
  ) : (
    // 눈 뜬 모양 (보기)
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  );
};

const Login = () => {
  const { setIsAuthenticated, setMember } = useAuthStore();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm({ mode: "onChange" });

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#])[\da-zA-Z!@#]{8,}$/;

  const login = async (member) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(member),
    });

    const resData = await response.json();

    if (!response.ok) {
      throw new Error(resData.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    return resData;
  };

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (res) => {
      const userData = res.data || res;
      if (userData) {
        setMember(userData);
        setIsAuthenticated(true);
        navigate("/", { replace: true });
      }
    },
    onError: (error) => {
      setIsAuthenticated(false);
      // 로그인 실패 시 서버 에러 저장
      setServerError(error.message || "이메일 또는 비밀번호가 올바르지 않습니다.");
    },
  });

  const onSubmit = (formData, e) => {
    e.preventDefault(); // 폼 제출 기본 동작 방지
    setServerError(""); // 제출 버튼 클릭 시 이전 에러 초기화
    loginMutation.mutate(formData);
  };

  return (
    <>
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        {/* 아이디(이메일) 입력 */}
        <S.Label>
          <p>아이디</p>
          <S.Input
            type="text"
            placeholder="이메일을 입력하세요."
            {...register("memberEmail", {
              required: true,
              pattern: {
                value: emailRegex,
              },
            })}
          />
          {errors?.memberEmail?.type === "required" && (
            <S.ConfirmMessage>이메일을 입력해주세요.</S.ConfirmMessage>
          )}
          {errors?.memberEmail?.type === "pattern" && (
            <S.ConfirmMessage>이메일 양식에 맞게 입력해주세요.</S.ConfirmMessage>
          )}
        </S.Label>

        {/* 비밀번호 입력 */}
        <S.Label $isError={!!serverError}>
          <p>비밀번호</p>
          <S.InputWrap>
            <S.Input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요."
              // 💡 입력할 때는 빨간색이 안 나오고 로그인 실패시(serverError)에만 빨간색 적용
              $isError={!!serverError}
              {...register("memberPassword", {
                required: true,
                pattern: {
                  value: passwordRegex,
                },
                // 비밀번호 입력할 때 다시 타이핑하면 서버 에러 지워주기
                onChange: () => {
                  if (serverError) setServerError("");
                },
              })}
            />
            <S.PasswordToggleButton
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              <EyeIcon show={showPassword} />
            </S.PasswordToggleButton>
          </S.InputWrap>

          {/* 유효성 검사 에러 (입력 중 양식 안내) */}
          {errors?.memberPassword?.type === "required" && (
            <S.ConfirmMessage>비밀번호를 입력해주세요.</S.ConfirmMessage>
          )}
          {errors?.memberPassword?.type === "pattern" && (
            <S.ConfirmMessage>
              소문자, 숫자, 특수문자를 각 하나 포함한 8자리 이상이여야 합니다.
            </S.ConfirmMessage>
          )}

          {/* 비밀번호가 틀려서 로그인에 실패했을 때만 표시되는 에러 문구 */}
          {!errors?.memberPassword && serverError && (
            <S.ConfirmMessage style={{ color: "#E53935" }}>
              {serverError}
            </S.ConfirmMessage>
          )}
        </S.Label>

        <S.Button type="submit" disabled={loginMutation.isPending}>로그인</S.Button>
      </S.Form>
    </>
  );
};

export default Login;