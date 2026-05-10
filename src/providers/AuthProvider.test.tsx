import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { AuthProvider } from "@/providers/AuthProvider";
import { authApi } from "@/api/authApi";
import { client } from "@/api/clients";
import { useAuth } from "@/hooks/useAuth";

vi.mock("@/api/clients", () => ({
  client: {
    post: vi.fn(),
  },
}));

vi.mock("@/api/authApi", () => ({
  authApi: {
    getMe: vi.fn(),
  },
}));

const UserDisplay = () => {
  const { user } = useAuth();
  return <div data-testid="user">{user ? user.username : "no-user"}</div>;
};

describe("AuthProvider", () => {
  beforeEach(() => vi.clearAllMocks());

  it("sets user after successful refresh and getMe", async () => {
    const mockUser = {
      username: "alice",
      avatar: null,
      bio: "",
      role: "user" as const,
      stars: 0,
    };
    vi.mocked(client.post).mockResolvedValue({});
    vi.mocked(authApi.getMe).mockResolvedValue(mockUser);

    render(
      <AuthProvider>
        <UserDisplay />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("alice");
    });
  });

  it("keeps null user when getMe fails", async () => {
    vi.mocked(client.post).mockResolvedValue({});
    vi.mocked(authApi.getMe).mockRejectedValue(new Error("401"));

    render(
      <AuthProvider>
        <UserDisplay />
      </AuthProvider>
    );

    // Wait for getMe to be called and fail, then assert user is still null
    await waitFor(() => expect(authApi.getMe).toHaveBeenCalled());
    expect(screen.getByTestId("user")).toHaveTextContent("no-user");
  });

  it("still calls getMe even when refresh fails", async () => {
    vi.mocked(client.post).mockRejectedValue(new Error("network error"));
    vi.mocked(authApi.getMe).mockRejectedValue(new Error("401"));

    render(
      <AuthProvider>
        <UserDisplay />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(authApi.getMe).toHaveBeenCalled();
    });
  });
});
