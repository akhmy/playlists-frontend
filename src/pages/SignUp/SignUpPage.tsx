import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { authApi } from "@/api/authApi";
import { useAuth } from "@/hooks/useAuth";
import { SignForm } from "@/components/SignForm/SignForm";

export const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string[];
    password?: string[];
    rePassword?: string[];
    nonFieldErrors?: string[];
  }>({});
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSignUp = () => {
    authApi
      .signUp(username, password, rePassword)
      .then(() => authApi.signIn(username, password))
      .then(() => authApi.getMe())
      .then(setUser)
      .then(() => navigate(searchParams.get("redirect") ?? `/profiles/${username}`))
      .catch((e) => {
        const {
          re_password: rePassword,
          non_field_errors: nonFieldErrors,
          ...rest
        } = e.response?.data ?? {};
        setErrors({ ...rest, rePassword, nonFieldErrors });
      });
  };

  return (
    <>
      <Helmet>
        <title>Регистрация</title>
      </Helmet>
      <SignForm
        title="Регистрация"
        submitLabel="Зарегистрироваться"
        onSubmit={handleSignUp}
        hint={
          <>
            Уже есть аккаунт?{" "}
            <Link to="/sign-in" style={{ color: "#646cff", textDecoration: "none" }}>
              Войти
            </Link>
          </>
        }
      >
        <SignForm.Field label="Имя пользователя" errors={errors.username}>
          <SignForm.Input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </SignForm.Field>
        <SignForm.Field label="Пароль" errors={errors.password}>
          <SignForm.Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </SignForm.Field>
        <SignForm.Field label="Повторите пароль" errors={errors.rePassword}>
          <SignForm.Input
            type="password"
            placeholder="••••••••"
            value={rePassword}
            onChange={(e) => setRePassword(e.target.value)}
          />
        </SignForm.Field>
        {errors.nonFieldErrors?.map((e, i) => (
          <span key={i} style={{ fontSize: "0.8rem", color: "#f87171" }}>{e}</span>
        ))}
      </SignForm>
    </>
  );
};
