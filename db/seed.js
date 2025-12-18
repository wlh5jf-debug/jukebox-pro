import db from "#db/client";

import { createPlaylist } from "#db/queries/playlists";
import { createPlaylistTrack } from "#db/queries/playlists_tracks";
import { createTrack } from "#db/queries/tracks";
import { createUser } from "#db/queries/users"
await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  const tracks = [];
  for (let i = 1; i <= 20; i++) {
    const track = await createTrack(`Track ${i}`, i * 50000);
    tracks.push(track);
  }



  const user1 = await createUser("AlphaBomba", "ignition!");
  const playlist1 = await createPlaylist("Alpha's Mix", "AlphaBomba's favorite tunes", user1.id);
  for (let i = 0; i < 5; i++) {
  await createPlaylistTrack(playlist1.id, tracks[i].id);
  }

 
  const user2 = await createUser("BetaFlop", "batnick?");
  const playlist2 = await createPlaylist("Beta's Grooves", "BetaFlop's chill vibes", user2.id);
  for (let i = 5; i < 10; i++) {
    await createPlaylistTrack(playlist2.id, tracks[i].id);
  }

}