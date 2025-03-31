const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const PLAYLIST_ID = "PLC3y8-rFHvwgg3vaYJgHGnModB54rxOk3";

export const getVideo = async () => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${PLAYLIST_ID}&maxResults=20&key=${API_KEY}`
  );
``
  return response.json();
};
