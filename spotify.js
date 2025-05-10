const clientId = "afc043b5fb0b4b7c8380761cc4b0de28";
const redirectUri = "https://spotify-api-rust-delta.vercel.app/callback.html"; // Must match Spotify Dashboard

// Step 1: Login with Spotify
document.getElementById("login-btn").addEventListener("click", () => {
  const scopes = ["user-read-currently-playing", "user-top-read"];
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join("%20")}&response_type=token`;
  window.location = authUrl;
});

// Step 2: Fetch Data (after login)
window.onload = async () => {
  const accessToken = localStorage.getItem("spotify_access_token");
  if (!accessToken) return;

  try {
    // Fetch currently playing track
    const currentTrack = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      headers: { "Authorization": `Bearer ${accessToken}` }
    }).then(res => res.json());
    
    if (currentTrack?.item) {
      document.getElementById("current-track").innerHTML = `
        <p>${currentTrack.item.name} by ${currentTrack.item.artists[0].name}</p>
        <img src="${currentTrack.item.album.images[0].url}" width="150">
      `;
    }

    // Fetch top artists
    const topArtists = await fetch(`https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=5`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    }).then(res => res.json());
    
    document.getElementById("top-artists").innerHTML = topArtists.items
      .map(artist => `<p>${artist.name} <img src="${artist.images[0]?.url}" width="50"></p>`)
      .join("");

    // Fetch top tracks
    const topTracks = await fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=short_term&limit=10`, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    }).then(res => res.json());
    
    document.getElementById("top-tracks").innerHTML = topTracks.items
      .map(track => `<p>${track.name} by ${track.artists[0].name}</p>`)
      .join("");

  } catch (err) {
    console.error("Error fetching data:", err);
  }
};