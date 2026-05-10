import { describe, it, expect, vi, beforeEach } from "vitest";
import { playlistApi } from "@/api/playlists";
import { client } from "@/api/clients";

vi.mock("@/api/clients", () => ({
  client: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockDto = {
  id: 1,
  name: "Chill Vibes",
  description: "desc",
  author: "alice",
  cover: null,
  tracks: [],
  stars: 5,
  already_starred: true,
};

describe("playlistApi", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getPlaylists", () => {
    it("maps already_starred to alreadyStarred in results", async () => {
      vi.mocked(client.get).mockResolvedValue({
        data: { count: 1, next: null, previous: null, results: [mockDto] },
      });
      const result = await playlistApi.getPlaylists();
      expect(result.results[0].alreadyStarred).toBe(true);
      expect(result.results[0]).not.toHaveProperty("already_starred");
    });

    it("passes limit and offset params", async () => {
      vi.mocked(client.get).mockResolvedValue({
        data: { count: 0, next: null, previous: null, results: [] },
      });
      await playlistApi.getPlaylists({ limit: 10, offset: 20 });
      expect(client.get).toHaveBeenCalledWith("playlists/", {
        params: { limit: 10, offset: 20 },
      });
    });
  });

  describe("getTrendingPlaylists", () => {
    it("maps already_starred to alreadyStarred", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: [mockDto] });
      const result = await playlistApi.getTrendingPlaylists();
      expect(result[0].alreadyStarred).toBe(true);
      expect(result[0]).not.toHaveProperty("already_starred");
    });
  });

  describe("getPlaylist", () => {
    it("maps already_starred to alreadyStarred", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: mockDto });
      const result = await playlistApi.getPlaylist("1");
      expect(result.alreadyStarred).toBe(true);
      expect(result).not.toHaveProperty("already_starred");
    });

    it("fetches the correct URL", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: mockDto });
      await playlistApi.getPlaylist("42");
      expect(client.get).toHaveBeenCalledWith("playlists/42");
    });
  });

  describe("upvotePlaylist", () => {
    it("maps already_starred to alreadyStarred", async () => {
      vi.mocked(client.patch).mockResolvedValue({
        data: { stars: 6, already_starred: true },
      });
      const result = await playlistApi.upvotePlaylist("1");
      expect(result.alreadyStarred).toBe(true);
      expect(result.stars).toBe(6);
    });

    it("calls the correct URL", async () => {
      vi.mocked(client.patch).mockResolvedValue({
        data: { stars: 1, already_starred: false },
      });
      await playlistApi.upvotePlaylist("7");
      expect(client.patch).toHaveBeenCalledWith("playlists/7/upvote/");
    });
  });

  describe("createPlaylist", () => {
    it("posts FormData to playlists/", async () => {
      vi.mocked(client.post).mockResolvedValue({ data: mockDto });
      await playlistApi.createPlaylist("My Playlist", "cool desc");
      expect(client.post).toHaveBeenCalledWith(
        "playlists/",
        expect.any(FormData)
      );
    });

    it("includes cover in FormData when provided", async () => {
      vi.mocked(client.post).mockResolvedValue({ data: mockDto });
      const file = new File(["img"], "cover.jpg", { type: "image/jpeg" });
      await playlistApi.createPlaylist("My Playlist", "desc", file);
      const formData = vi.mocked(client.post).mock.calls[0][1] as FormData;
      expect(formData.get("cover")).toBe(file);
    });
  });

  describe("putPlaylist", () => {
    it("puts FormData to the correct URL", async () => {
      vi.mocked(client.put).mockResolvedValue({ data: {} });
      await playlistApi.putPlaylist(
        3,
        { name: "Updated", description: "new desc", cover: null, tracks: [1, 2] }
      );
      expect(client.put).toHaveBeenCalledWith(
        "playlists/3/",
        expect.any(FormData)
      );
    });
  });

  describe("deletePlaylist", () => {
    it("calls delete on the correct URL", async () => {
      vi.mocked(client.delete).mockResolvedValue({});
      await playlistApi.deletePlaylist(5);
      expect(client.delete).toHaveBeenCalledWith("playlists/5/");
    });
  });
});
