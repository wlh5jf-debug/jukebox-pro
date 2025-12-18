import express from "express";
const router = express.Router();
export default router;

import {
  createPlaylist,
  getPlaylistById,
  getPlaylistByUserId
} from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { getTracksByPlaylistId } from "#db/queries/tracks";
import requireUser from "#middleware/requireUser";
import requireBody from "#middleware/requireBody";
import getUserFromToken from "#middleware/getUserFromToken";

router.use(getUserFromToken)
router.use(requireUser)

router.get("/", async (req, res) => {
  const playlists = await getPlaylistByUserId(req.user.id);
  res.send(playlists);
});

router.post("/", async (req, res) => {
  if (!req.body) return res.status(400).send("Request body is required.");

  const { name, description } = req.body;
  if (!name || !description)
    return res.status(400).send("Request body requires: name, description");

  const playlist = await createPlaylist(req.user.id, name, description);
  res.status(201).send(playlist);
});

router.param("id", async (req, res, next, id) => {
  const playlist = await getPlaylistById(id);
  if (!playlist) return res.status(404).send("Playlist not found.");

  req.playlist = playlist;
  next();
});

router.get("/:id", (req, res) => {
  if (req.playlist.user_id !== req.user.id)
  return res.status(403).send("Not Authorized");
  res.send(req.playlist);
});

router.get("/:id/tracks", async (req, res) => {
  if (req.playlist.user_id !== req.user.id)
    return res.status(403).send("Not Authorized");

  const tracks = await getTracksByPlaylistId(req.playlist.id);
  res.send(tracks);
});

router.post(
  "/:id/tracks",
  requireBody(["trackId"]),
  async (req, res) => {
    if (req.playlist.user_id !== req.user.id)
      return res.status(403).send("Not Authorized");

    const { trackId } = req.body;
    const playlistTrack = await createPlaylistTrack(req.playlist.id, trackId);
    res.status(201).send(playlistTrack);
  }
);

