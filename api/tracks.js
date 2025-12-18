import express from "express";
const router = express.Router();
export default router;
import { getTracks, getTrackById } from "#db/queries/tracks";
import getUserFromToken from "#middleware/getUserFromToken";
import requireUser from "#middleware/requireUser";
import { getPlaylistsContainingTrack } from "#db/queries/tracks";

router.get("/", async (req, res) => {
  const tracks = await getTracks();
  res.send(tracks);
});

router.get("/:id", async (req, res) => {
  const track = await getTrackById(req.params.id);
  if (!track) return res.status(404).send("Track not found.");
  res.send(track);
});


router.get(
  "/:id/playlists",
  getUserFromToken,
  requireUser,
  async (req, res) => {
    const trackId = Number(req.params.id);

     const track = await getTrackById(trackId);
    if (!track) return res.status(404).send("Track not found.");
    const playlists = await getPlaylistsContainingTrack(req.user.id, trackId);
    res.send(playlists);
  }
);
