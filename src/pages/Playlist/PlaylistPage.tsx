import { useEffect, useState } from "react";
import { type Playlist } from "@/types/playlist";
import { playlistApi } from "@/api/playlists";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PlaylistView } from "@/components/playlist/PlaylistView/PlaylistView";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/hooks/useAuth";

export const PlaylistPage = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState<Playlist>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const fetchPlaylist = () => {
    if (!id) return;
    playlistApi.getPlaylist(id).then(setPlaylist);
  };

  useEffect(() => { fetchPlaylist(); }, [id]);

  if (!id || !playlist) return null;

  console.log(playlist);

  const handleUpvote = () => {
    if (!user) {
      navigate(`/sign-in?redirect=${location.pathname}`);
      return;
    }

    playlistApi.upvotePlaylist(id).then((data) => {
      setPlaylist(
        (prev) =>
          prev && {
            ...prev,
            stars: data.stars,
            alreadyStarred: data.alreadyStarred,
          },
      );
    });
  };

  return (
    <>
      <Helmet>
        <title>{playlist.name}</title>
      </Helmet>
      <PlaylistView playlist={playlist} onUpvote={handleUpvote} onRefresh={fetchPlaylist} />
    </>
  );
};
