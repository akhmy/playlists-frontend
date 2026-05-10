import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignUpPage } from "@/pages/SignUp/SignUpPage";
import { authApi } from "@/api/authApi";
import { renderWithProviders } from "@/test/utils";

vi.mock("@/api/authApi", () => ({
  authApi: {
    signUp: vi.fn(),
    signIn: vi.fn(),
    getMe: vi.fn(),
  },
}));

const mockUser = {
  username: "alice",
  avatar: null,
  bio: "",
  role: "user" as const,
  stars: 0,
};

const fillAndSubmit = async (
  user: ReturnType<typeof userEvent.setup>,
  username = "alice",
  password = "pass123",
  rePassword = "pass123"
) => {
  await user.type(screen.getByPlaceholderText("username"), username);
  const [passwordInput, rePasswordInput] =
    screen.getAllByPlaceholderText("••••••••");
  await user.type(passwordInput, password);
  await user.type(rePasswordInput, rePassword);
  await user.click(screen.getByRole("button", { name: "Зарегистрироваться" }));
};

describe("SignUpPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders username, password and re-password fields", () => {
    renderWithProviders(<SignUpPage />);
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText("••••••••")).toHaveLength(2);
  });

  it("renders the submit button", () => {
    renderWithProviders(<SignUpPage />);
    expect(
      screen.getByRole("button", { name: "Зарегистрироваться" })
    ).toBeInTheDocument();
  });

  it("calls signUp with username, password and rePassword", async () => {
    vi.mocked(authApi.signUp).mockResolvedValue({} as never);
    vi.mocked(authApi.signIn).mockResolvedValue({} as never);
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser);
    const user = userEvent.setup();

    renderWithProviders(<SignUpPage />);
    await fillAndSubmit(user);

    expect(authApi.signUp).toHaveBeenCalledWith("alice", "pass123", "pass123");
  });

  it("signs in and fetches user after successful registration", async () => {
    vi.mocked(authApi.signUp).mockResolvedValue({} as never);
    vi.mocked(authApi.signIn).mockResolvedValue({} as never);
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser);
    const user = userEvent.setup();

    const { setUser } = renderWithProviders(<SignUpPage />);
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(authApi.signIn).toHaveBeenCalledWith("alice", "pass123");
      expect(authApi.getMe).toHaveBeenCalled();
      expect(setUser).toHaveBeenCalledWith(mockUser);
    });
  });

  it("shows username error from API response", async () => {
    vi.mocked(authApi.signUp).mockRejectedValue({
      response: {
        data: { username: ["Пользователь с таким именем уже существует."] },
      },
    });
    const user = userEvent.setup();

    renderWithProviders(<SignUpPage />);
    await fillAndSubmit(user);

    await waitFor(() => {
      expect(
        screen.getByText("Пользователь с таким именем уже существует.")
      ).toBeInTheDocument();
    });
  });

  it("shows password error from API response", async () => {
    vi.mocked(authApi.signUp).mockRejectedValue({
      response: { data: { password: ["Пароль слишком короткий."] } },
    });
    const user = userEvent.setup();

    renderWithProviders(<SignUpPage />);
    await fillAndSubmit(user, "alice", "123", "123");

    await waitFor(() => {
      expect(screen.getByText("Пароль слишком короткий.")).toBeInTheDocument();
    });
  });

  it("shows non_field_errors from API response", async () => {
    vi.mocked(authApi.signUp).mockRejectedValue({
      response: { data: { non_field_errors: ["Пароли не совпадают."] } },
    });
    const user = userEvent.setup();

    renderWithProviders(<SignUpPage />);
    await fillAndSubmit(user, "alice", "pass123", "different");

    await waitFor(() => {
      expect(screen.getByText("Пароли не совпадают.")).toBeInTheDocument();
    });
  });

  it("contains a link to the sign-in page", () => {
    renderWithProviders(<SignUpPage />);
    expect(screen.getByRole("link", { name: "Войти" })).toHaveAttribute(
      "href",
      "/sign-in"
    );
  });
});
