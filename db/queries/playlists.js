import db from "#db/client";

export async function createPlaylist(userId, name, description) {
  const sql = `
  INSERT INTO playlists
    (user_id, name, description)
  VALUES
    ($1, $2, $3)
  RETURNING *
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [userId, name, description]);
  return playlist;
}

export async function getPlaylists() {
  const sql = `
  SELECT *
  FROM playlists
  `;
  const { rows: playlists } = await db.query(sql);
  return playlists;
}

export async function getPlaylistById(id) {
  const sql = `
  SELECT *
  FROM playlists
  WHERE id = $1
  `;
  const {
    rows: [playlist],
  } = await db.query(sql, [id]);
  return playlist;
}

export async function getPlaylistByUserId(userId) {
  const sql = `
    SELECT *
    FROM playlists
    WHERE user_id = $1
  `;
  const { rows: playlists } = await db.query(sql, [userId]);
  return playlists;
}