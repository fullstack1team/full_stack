import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import S from "./style";

const JoinComponent = () => {

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    formState: { isSubmitting, isSubmitted, errors },
  } = useForm({ mode: "onChange" });

    const watchAllFields = watch();

  //[] 바깥 ^는 문자열 처음을 의미
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // !@#$%^&*() 등 일반적인 특수문자를 모두 포함하는 범위
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[!@#$%^&*])[\da-zA-Z!@#$%^&*]{8,}$/;

  const join = async (member) => {
    const response = await fetch("http://localhost:10000/members/join", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(member),
    });

    const result = await response.json();

  if (!response.ok) {
      const errorDetail = Array.isArray(result.message) 
        ? result.message.join(", ") 
        : result.message || "회원가입 실패";
      
      throw new Error(errorDetail); 
    }
    return result;
  };

  const joinMutation = useMutation({
    mutationFn: join,
    onSuccess: (res) => {
      alert("회원가입에 성공했습니다! 로그인 페이지로 이동합니다.");
      navigate("/login")
    },
    onError: (error) => {
      console.error(error);
      alert(`회원가입 실패: ${error.message}`);
    },
  });

  const onSubmit = (formData) => {

    const { memberPasswordConfirm, ...rest } = formData;
    
    const memberData = {
      ...rest,
      memberProvider: "LOCAL", // 400 에러코드의 원인
      memberNickname: rest.memberName, 
    };

    console.log("전송 데이터:", memberData);
    joinMutation.mutate(memberData);
  };

  // const joinMutation = useMutation({
  //   mutationFn: join,
  //   onSuccess: (res) => {
  //     // 성공 처리
  //     console.log(res);
  //   },
  //   onError: (error) => {
  //     // 에러시 처리
  //   },
  // });

  // const onSubmit = (formData) => {
  //   const { memberPasswordConfirm, ...member } = formData;
  //   // 데이터 요청(react query)
  //   joinMutation.mutate(member);
  // };

  return (
    <>
      <S.Form onSubmit={handleSubmit(onSubmit)}>
        <S.Label>
          <p>아이디</p>
          <S.Input
            type="text"
            placeholder="이메일을 입력하세요."
            {...register("memberEmail", { 
              required: "이메일을 입력해주세요.", 
              pattern: { value: emailRegex, message: "이메일 양식이 올바르지 않습니다." } 
            })}
          />
          {((watchAllFields.memberEmail && errors.memberEmail) || (isSubmitted && errors.memberEmail)) && (
            <S.ConfirmMessage>{errors.memberEmail?.message}</S.ConfirmMessage>
          )}
        </S.Label>

        <S.Label>
          <p>비밀번호</p>
          <S.Input
            type="password"
            placeholder="비밀번호를 입력하세요."
            {...register("memberPassword", { 
              required: "비밀번호를 입력해주세요.", 
              pattern: { value: passwordRegex, message: "8자리 이상, 소문자/숫자/특수문자를 포함해야 합니다." } 
            })}
          />
          {((watchAllFields.memberPassword && errors.memberPassword) || (isSubmitted && errors.memberPassword)) && (
            <S.ConfirmMessage>{errors.memberPassword?.message}</S.ConfirmMessage>
          )}
        </S.Label>

        <S.Label>
          <p>비밀번호 확인</p>
          <S.Input
            type="password"
            placeholder="비밀번호를 확인해주세요."
            {...register("memberPasswordConfirm", {
              required: "비밀번호 확인이 필요합니다.",
              validate: {
                matchPassword: (value) => {
                  const { memberPassword } = getValues();
                  // 💡 콘솔에 실시간 비교 결과 출력
                  console.log(
                    "입력된 확인값:", value,
                    "원본 비밀번호:", memberPassword,
                    "일치 여부:", memberPassword === value
                  );
                  return memberPassword === value || "비밀번호가 일치하지 않습니다.";
                },
              },
            })}
          />

          {/* 💡 사용자가 선택한 '두 번째 방식' 적용 */}
          {((watchAllFields.memberPasswordConfirm && errors.memberPasswordConfirm) || 
            (isSubmitted && errors.memberPasswordConfirm)) && (
            <S.ConfirmMessage>
              {errors.memberPasswordConfirm?.message || "비밀번호를 확인해주세요."}
            </S.ConfirmMessage>
          )}
        </S.Label>

        <S.Label>
          <p>이름</p>
          <S.Input
            type="text"
            placeholder="이름을 입력하세요."
            {...register("memberName", { required: "이름을 입력해주세요." })}
          />
          {((watchAllFields.memberName && errors.memberName) || (isSubmitted && errors.memberName)) && (
            <S.ConfirmMessage>{errors.memberName?.message}</S.ConfirmMessage>
          )}
        </S.Label>
        <S.Button disabled={isSubmitting}>회원가입</S.Button>
      </S.Form>
    </>
  );
};

export default JoinComponent;
