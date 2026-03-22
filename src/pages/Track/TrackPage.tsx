import { useEffect, useState } from "react";
import type { Track } from "@/types/track";
import { trackApi } from "@/api/tracks";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { TrackView } from "@/components/track/TrackView";

export const TrackPage = () => {
  const { id } = useParams();
  if (!id) return null;

  const [track, setTrack] = useState<Track>();
  useEffect(() => {
    trackApi.getTrack(id).then(setTrack);
  }, []);

  if (!track) return null;

  console.log(track);

  return (
    <>
      <Helmet>
        <title>{track.name}</title>
      </Helmet>
      <TrackView track={track} />
    </>
  );
};
