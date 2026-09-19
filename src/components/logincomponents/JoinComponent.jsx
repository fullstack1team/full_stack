import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import S from "./style";

// 로그인에서 사용했던 동일한 EyeIcon SVG 컴포넌트
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

const JoinComponent = () => {
  const navigate = useNavigate();

  // 비밀번호 & 비밀번호 확인 각각의 토글 상태
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm({ mode: "onChange" });

  const watchAllFields = watch();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])[\da-zA-Z!@#$\%^&*]{8,}$/;

  const join = async (member) => {
    const response = await fetch("http://localhost:10000/members/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(member),
    });

    const result = await response.json().catch(() => ({}));

    if (!response.ok) {
      // 💡 백엔드에서 던진 MemberException 메시지 추출 (단일 문자열 또는 배열 대응)
      let errorMessage = "회원가입 실패";

      if (typeof result.message === "string") {
        errorMessage = result.message;
      } else if (Array.isArray(result.message)) {
        errorMessage = result.message.join(", ");
      } else if (result.response && typeof result.response.message === "string") {
        errorMessage = result.response.message;
      }

      throw new Error(errorMessage);
    }
    return result;
  };

  const joinMutation = useMutation({
    mutationFn: join,
    onSuccess: () => {
      alert("회원가입에 성공했습니다! 로그인 페이지로 이동합니다.");
      navigate("/login");
    },
    onError: (error) => {
      console.error("회원가입 에러 상세:", error);
      // 💡 "이미 사용 중인 닉네임(이름)입니다."가 alert 창으로 출력됩니다.
      alert(error.message || "회원가입 중 오류가 발생했습니다.");
    },
  });

  const onSubmit = (formData) => {
    const { memberPasswordConfirm, ...rest } = formData;

    const memberData = {
      ...rest,
      memberProvider: "LOCAL",
      memberNickname: rest.memberName,
    };

    console.log("전송 데이터:", memberData);
    joinMutation.mutate(memberData);
  };

  return (
    <>
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        {/* 아이디 */}
        <S.Label>
          <p>아이디</p>
          <S.Input
            type="text"
            placeholder="이메일을 입력하세요."
            {...register("memberEmail", {
              required: "이메일을 입력해주세요.",
              pattern: {
                value: emailRegex,
                message: "이메일 양식이 올바르지 않습니다.",
              },
            })}
          />
          {((watchAllFields.memberEmail && errors.memberEmail) ||
            (isSubmitted && errors.memberEmail)) && (
            <S.ConfirmMessage>{errors.memberEmail?.message}</S.ConfirmMessage>
          )}
        </S.Label>

        {/* 비밀번호 */}
        <S.Label>
          <p>비밀번호</p>
          <S.InputWrap>
            <S.Input
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요."
              {...register("memberPassword", {
                required: "비밀번호를 입력해주세요.",
                pattern: {
                  value: passwordRegex,
                  message:
                    "8자리 이상, 소문자/숫자/특수문자를 포함해야 합니다.",
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
          {((watchAllFields.memberPassword && errors.memberPassword) ||
            (isSubmitted && errors.memberPassword)) && (
            <S.ConfirmMessage>
              {errors.memberPassword?.message}
            </S.ConfirmMessage>
          )}
        </S.Label>

        {/* 비밀번호 확인 */}
        <S.Label>
          <p>비밀번호 확인</p>
          <S.InputWrap>
            <S.Input
              type={showPasswordConfirm ? "text" : "password"}
              placeholder="비밀번호를 확인해주세요."
              {...register("memberPasswordConfirm", {
                required: "비밀번호 확인이 필요합니다.",
                validate: {
                  matchPassword: (value) => {
                    const { memberPassword } = getValues();
                    return (
                      memberPassword === value ||
                      "비밀번호가 일치하지 않습니다."
                    );
                  },
                },
              })}
            />
            <S.PasswordToggleButton
              type="button"
              onClick={() => setShowPasswordConfirm((prev) => !prev)}
            >
              <EyeIcon show={showPasswordConfirm} />
            </S.PasswordToggleButton>
          </S.InputWrap>
          {((watchAllFields.memberPasswordConfirm &&
            errors.memberPasswordConfirm) ||
            (isSubmitted && errors.memberPasswordConfirm)) && (
            <S.ConfirmMessage>
              {errors.memberPasswordConfirm?.message ||
                "비밀번호를 확인해주세요."}
            </S.ConfirmMessage>
          )}
        </S.Label>

        {/* 이름 */}
        <S.Label>
          <p>이름</p>
          <S.Input
            type="text"
            placeholder="이름을 입력하세요."
            {...register("memberName", { required: "이름을 입력해주세요." })}
          />
          {((watchAllFields.memberName && errors.memberName) ||
            (isSubmitted && errors.memberName)) && (
            <S.ConfirmMessage>{errors.memberName?.message}</S.ConfirmMessage>
          )}
        </S.Label>

        <S.Button disabled={isSubmitting}>회원가입</S.Button>
      </S.Form>
    </>
  );
};

export default JoinComponent;