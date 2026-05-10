import { describe, it, expect, vi, beforeEach } from "vitest";
import { trackApi } from "@/api/tracks";
import { client } from "@/api/clients";

vi.mock("@/api/clients", () => ({
  client: {
    get: vi.fn(),
  },
}));

const mockTrack = {
  id: 1,
  name: "Blue in Green",
  artists: "Miles Davis",
  genres: [{ id: 1, name: "Jazz" }],
  cover: null,
};

describe("trackApi", () => {
  beforeEach(() => vi.clearAllMocks());

  describe("getTrack", () => {
    it("fetches the correct URL", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: mockTrack });
      await trackApi.getTrack("1");
      expect(client.get).toHaveBeenCalledWith("tracks/1");
    });

    it("returns track data", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: mockTrack });
      const result = await trackApi.getTrack("1");
      expect(result).toEqual(mockTrack);
    });
  });

  describe("searchTracks", () => {
    it("passes search param to the request", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: [mockTrack] });
      await trackApi.searchTracks("piano");
      expect(client.get).toHaveBeenCalledWith("tracks/", {
        params: { search: "piano" },
      });
    });

    it("returns a list of tracks", async () => {
      vi.mocked(client.get).mockResolvedValue({ data: [mockTrack] });
      const result = await trackApi.searchTracks("piano");
      expect(result).toEqual([mockTrack]);
    });
  });
});
