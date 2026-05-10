import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlaylistGridItem } from "@/components/playlist/PlaylistGridItem/PlaylistGridItem";
import { AuthContext } from "@/hooks/useAuth";
import type { Playlist } from "@/types/playlist";
import type { User } from "@/types/user";

const mockPlaylist: Playlist = {
  id: 1,
  name: "Late Night Jazz",
  description: "Smooth sounds",
  author: "alice",
  cover: null,
  tracks: [],
  stars: 7,
  alreadyStarred: false,
};

const renderItem = (playlist: Playlist, user: User | null = null) =>
  render(
    <AuthContext.Provider value={{ user, setUser: vi.fn() }}>
      <PlaylistGridItem playlist={playlist} />
    </AuthContext.Provider>
  );

describe("PlaylistGridItem", () => {
  it("renders the playlist name", () => {
    renderItem(mockPlaylist);
    expect(screen.getByText("Late Night Jazz")).toBeInTheDocument();
  });

  it("renders the author", () => {
    renderItem(mockPlaylist);
    expect(screen.getByText("alice")).toBeInTheDocument();
  });

  it("renders the stars count", () => {
    renderItem(mockPlaylist);
    expect(screen.getByText("7")).toBeInTheDocument();
  });

  it("uses placeholder image when cover is null", () => {
    renderItem(mockPlaylist);
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "/assets/playlist-cover-placeholder.webp"
    );
  });

  it("uses the provided cover URL", () => {
    renderItem({ ...mockPlaylist, cover: "https://example.com/cover.jpg" });
    expect(screen.getByRole("img")).toHaveAttribute(
      "src",
      "https://example.com/cover.jpg"
    );
  });

  it("uses playlist name as image alt text", () => {
    renderItem(mockPlaylist);
    expect(screen.getByRole("img")).toHaveAttribute("alt", "Late Night Jazz");
  });

  it("renders a star icon", () => {
    const { container } = renderItem(mockPlaylist);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
