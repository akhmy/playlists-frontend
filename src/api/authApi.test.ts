import { describe, it, expect, vi, beforeEach } from "vitest";
import { authApi } from "@/api/authApi";
import { client } from "@/api/clients";

vi.mock("@/api/clients", () => ({
  client: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe("authApi", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("signIn", () => {
    it("posts to auth/jwt/create/ with username and password", async () => {
      vi.mocked(client.post).mockResolvedValue({ data: {} });
      await authApi.signIn("alice", "pass123");
      expect(client.post).toHaveBeenCalledWith("auth/jwt/create/", {
        username: "alice",
        password: "pass123",
      });
    });
  });

  describe("signUp", () => {
    it("posts to auth/users/ with username, password and re_password", async () => {
      vi.mocked(client.post).mockResolvedValue({ data: "ok" });
      await authApi.signUp("alice", "pass123", "pass123");
      expect(client.post).toHaveBeenCalledWith("auth/users/", {
        username: "alice",
        password: "pass123",
        re_password: "pass123",
      });
    });
  });

  describe("getMe", () => {
    it("returns user data from response", async () => {
      const user = {
        username: "alice",
        avatar: null,
        bio: "",
        role: "user",
        stars: 0,
      };
      vi.mocked(client.get).mockResolvedValue({ data: user });
      const result = await authApi.getMe();
      expect(result).toEqual(user);
    });

    it("calls auth/users/me/", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: {} });
      await authApi.getMe();
      expect(client.get).toHaveBeenCalledWith("auth/users/me/");
    });
  });

  describe("signOut", () => {
    it("posts to auth/jwt/logout/", async () => {
      vi.mocked(client.post).mockResolvedValue({ data: {} });
      await authApi.signOut();
      expect(client.post).toHaveBeenCalledWith("auth/jwt/logout/");
    });
  });

  describe("getUser", () => {
    const makeDto = (is_staff: boolean) => ({
      username: "alice",
      avatar: null,
      bio: "",
      is_staff,
      stars: 3,
    });

    it('maps is_staff=true to role="admin"', async () => {
      vi.mocked(client.get).mockResolvedValue({ data: makeDto(true) });
      const result = await authApi.getUser("alice");
      expect(result.role).toBe("admin");
    });

    it('maps is_staff=false to role="user"', async () => {
      vi.mocked(client.get).mockResolvedValue({ data: makeDto(false) });
      const result = await authApi.getUser("alice");
      expect(result.role).toBe("user");
    });

    it("strips is_staff from the returned object", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: makeDto(false) });
      const result = await authApi.getUser("alice");
      expect(result).not.toHaveProperty("is_staff");
    });

    it("fetches the correct user URL", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: makeDto(false) });
      await authApi.getUser("alice");
      expect(client.get).toHaveBeenCalledWith("users/alice");
    });
  });
});
