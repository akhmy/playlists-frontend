import { describe, it, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { AuthContext, useAuth } from "@/hooks/useAuth";
import type { User } from "@/types/user";

describe("useAuth", () => {
  it("throws when called outside AuthProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth called outside AuthProvider boundaries"
    );
    vi.restoreAllMocks();
  });

  it("returns user and setUser from context", () => {
    const mockUser: User = {
      username: "alice",
      avatar: null,
      bio: "",
      role: "user",
      stars: 0,
    };
    const mockSetUser = vi.fn();

    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: mockUser, setUser: mockSetUser }}>
          {children}
        </AuthContext.Provider>
      ),
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.setUser).toBe(mockSetUser);
  });

  it("returns null user when provider has no user", () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={{ user: null, setUser: vi.fn() }}>
          {children}
        </AuthContext.Provider>
      ),
    });

    expect(result.current.user).toBeNull();
  });
});
