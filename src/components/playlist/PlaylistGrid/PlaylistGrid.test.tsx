import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { PlaylistGrid } from "@/components/playlist/PlaylistGrid/PlaylistGrid";
import { AuthContext } from "@/hooks/useAuth";
import type { Playlist } from "@/types/playlist";

const playlists: Playlist[] = [
  {
    id: 1,
    name: "Playlist One",
    description: "",
    author: "alice",
    cover: null,
    tracks: [],
    stars: 3,
    alreadyStarred: false,
  },
  {
    id: 2,
    name: "Playlist Two",
    description: "",
    author: "bob",
    cover: null,
    tracks: [],
    stars: 8,
    alreadyStarred: true,
  },
];

const renderGrid = (items: Playlist[]) =>
  render(
    <MemoryRouter>
      <AuthContext.Provider value={{ user: null, setUser: vi.fn() }}>
        <PlaylistGrid playlists={items} />
      </AuthContext.Provider>
    </MemoryRouter>
  );

describe("PlaylistGrid", () => {
  it("renders a card for each playlist", () => {
    renderGrid(playlists);
    expect(screen.getByText("Playlist One")).toBeInTheDocument();
    expect(screen.getByText("Playlist Two")).toBeInTheDocument();
  });

  it("each item links to its detail page", () => {
    renderGrid(playlists);
    const links = screen.getAllByRole("link");
    expect(links[0]).toHaveAttribute("href", "/playlists/1");
    expect(links[1]).toHaveAttribute("href", "/playlists/2");
  });

  it("renders no links when given an empty list", () => {
    renderGrid([]);
    expect(screen.queryByRole("link")).toBeNull();
  });

  it("renders the correct number of items", () => {
    renderGrid(playlists);
    expect(screen.getAllByRole("link")).toHaveLength(2);
  });
});
