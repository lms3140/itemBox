import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import styled from "styled-components";
import { z } from "zod";
import { authAPIObject } from "../api/apiURL";
import { postDataFetch } from "../api/fetch";
import CustomButton from "../components/CustomButton";
import Input from "../components/RHFInput";
import { loginFormSchema } from "../schema/formSchema";
import { useAuthStore } from "../store/zustandStore";
import { useNavigate } from "react-router";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  align-items: center;
`;

type TAuthForm = z.infer<typeof loginFormSchema>;

function Login() {
  const { setToken } = useAuthStore();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm<TAuthForm>({
    resolver: zodResolver(loginFormSchema),
  });

  const loginSubmit: SubmitHandler<TAuthForm> = async (data) => {
    try {
      const res = await postDataFetch(authAPIObject.login, data);

      setToken(res);
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("root", {
        type: "deps",
        message: "아이디 또는 비밀번호가.... 안맞아요",
      });
    }
  };

  return (
    <Wrapper>
      <form onSubmit={handleSubmit(loginSubmit)}>
        <Input register={register} label="아이디" name="id" />
        <Input
          register={register}
          label="비밀번호"
          name="password"
          type="password"
        />
        <CustomButton variant="primary" type="submit">
          로그인
        </CustomButton>
      </form>
      {errors.root && errors.root.message}
    </Wrapper>
  );
}

export default Login;
