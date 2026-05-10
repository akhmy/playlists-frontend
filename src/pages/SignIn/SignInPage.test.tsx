import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignInPage } from "@/pages/SignIn/SignInPage";
import { authApi } from "@/api/authApi";
import { renderWithProviders } from "@/test/utils";

vi.mock("@/api/authApi", () => ({
  authApi: {
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

describe("SignInPage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders username and password fields", () => {
    renderWithProviders(<SignInPage />);
    expect(screen.getByPlaceholderText("username")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
  });

  it("renders the submit button", () => {
    renderWithProviders(<SignInPage />);
    expect(screen.getByRole("button", { name: "Войти" })).toBeInTheDocument();
  });

  it("calls signIn with entered username and password", async () => {
    vi.mocked(authApi.signIn).mockResolvedValue({} as never);
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser);
    const user = userEvent.setup();

    renderWithProviders(<SignInPage />);

    await user.type(screen.getByPlaceholderText("username"), "alice");
    await user.type(screen.getByPlaceholderText("••••••••"), "pass123");
    await user.click(screen.getByRole("button", { name: "Войти" }));

    expect(authApi.signIn).toHaveBeenCalledWith("alice", "pass123");
  });

  it("calls setUser with the returned user after successful login", async () => {
    vi.mocked(authApi.signIn).mockResolvedValue({} as never);
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser);
    const user = userEvent.setup();

    const { setUser } = renderWithProviders(<SignInPage />);

    await user.type(screen.getByPlaceholderText("username"), "alice");
    await user.type(screen.getByPlaceholderText("••••••••"), "pass123");
    await user.click(screen.getByRole("button", { name: "Войти" }));

    await waitFor(() => expect(setUser).toHaveBeenCalledWith(mockUser));
  });

  it("shows error message on failed login", async () => {
    vi.mocked(authApi.signIn).mockRejectedValue(new Error("401"));
    const user = userEvent.setup();

    renderWithProviders(<SignInPage />);

    await user.type(screen.getByPlaceholderText("username"), "alice");
    await user.type(screen.getByPlaceholderText("••••••••"), "wrong");
    await user.click(screen.getByRole("button", { name: "Войти" }));

    await waitFor(() => {
      expect(screen.getByText("Неверный логин или пароль")).toBeInTheDocument();
    });
  });

  it("clears the error message when typing in the username field", async () => {
    vi.mocked(authApi.signIn).mockRejectedValue(new Error("401"));
    const user = userEvent.setup();

    renderWithProviders(<SignInPage />);

    await user.click(screen.getByRole("button", { name: "Войти" }));
    await waitFor(() => {
      expect(screen.getByText("Неверный логин или пароль")).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("username"), "a");
    expect(
      screen.queryByText("Неверный логин или пароль")
    ).not.toBeInTheDocument();
  });

  it("clears the error message when typing in the password field", async () => {
    vi.mocked(authApi.signIn).mockRejectedValue(new Error("401"));
    const user = userEvent.setup();

    renderWithProviders(<SignInPage />);

    await user.click(screen.getByRole("button", { name: "Войти" }));
    await waitFor(() => {
      expect(screen.getByText("Неверный логин или пароль")).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText("••••••••"), "x");
    expect(
      screen.queryByText("Неверный логин или пароль")
    ).not.toBeInTheDocument();
  });

  it("contains a link to the sign-up page", () => {
    renderWithProviders(<SignInPage />);
    expect(screen.getByRole("link", { name: "Создать аккаунт" })).toHaveAttribute(
      "href",
      "/sign-up"
    );
  });
});
