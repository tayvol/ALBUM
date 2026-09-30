# ALBUM — Album & Lyrics Visualizer

A static GitHub Pages album archive and lyrics visualizer.

## Features
- Multiple albums and artists
- Album covers and responsive cards
- Search albums, artists and tracks
- Track selection and animated visualizer
- Lyrics display
- Spotify / external lyrics links
- No framework or build step

## Add albums
Edit `albums.js`. Add an album object with a unique `id`, title, artist, year, cover, links and tracks. Put cover images in an `albums/` folder.

For each track:
```js
{
  title: "Song Name",
  duration: "3:20",
  lyrics: ["Your own lyric line", "Another lyric line"]
}
```

Only publish lyrics you have permission to reproduce. Otherwise use `lyricsUrl` to link to an authorized lyrics source.

## GitHub Pages
The site is plain HTML/CSS/JS. Enable Pages from the `main` branch; no build command is needed.