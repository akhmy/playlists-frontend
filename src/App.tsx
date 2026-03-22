import { Route, Routes } from "react-router-dom";
import { TrendingPage } from "./pages/Trending/TrendingPage";
import { MainLayout } from "./layouts/MainLayout/MainLayout";
import { About } from "./pages/About/AboutPage";
import { PlaylistsPage } from "./pages/Playlists/PlaylistsPage";
import { PlaylistPage } from "./pages/Playlist/PlaylistPage";
import { SignInPage } from "./pages/SignIn/SignInPage";
import { TrackPage } from "./pages/Track/TrackPage";
import { ProfilePage } from "./pages/Profile/ProfilePage";
import { SignUpPage } from "./pages/SignUp/SignUpPage";
import { NotFound } from "./pages/NotFound/NotFound";

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<TrendingPage />} />
        <Route path="/playlists" element={<PlaylistsPage />} />
        <Route path="/playlists/:id" element={<PlaylistPage />} />
        <Route path="/tracks/:id" element={<TrackPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/profiles/:username" element={<ProfilePage />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
