import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { authApi } from "@/api/authApi";
import { useAuth } from "@/hooks/useAuth";
import { SignForm } from "@/components/SignForm/SignForm";

export const SignInPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSignIn = () => {
    authApi
      .signIn(username, password)
      .then(() => authApi.getMe())
      .then(setUser)
      .then(() => navigate(searchParams.get("redirect") ?? "/"))
      .catch(() => setError(true));
  };

  return (
    <>
      <Helmet>
        <title>Войти</title>
      </Helmet>
      <SignForm
        title="Войти"
        submitLabel="Войти"
        onSubmit={handleSignIn}
        hint={
          <>
            Ещё не зарегистрированы?{" "}
            <Link
              to="/sign-up"
              style={{ color: "#646cff", textDecoration: "none" }}
            >
              Создать аккаунт
            </Link>
          </>
        }
      >
        <SignForm.Field
          label="Имя пользователя"
          errors={error ? ["Неверный логин или пароль"] : []}
        >
          <SignForm.Input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              setError(false);
            }}
          />
        </SignForm.Field>
        <SignForm.Field label="Пароль">
          <SignForm.Input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError(false);
            }}
          />
        </SignForm.Field>
      </SignForm>
    </>
  );
};
