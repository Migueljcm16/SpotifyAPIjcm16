"use client";
import React, { useState, useEffect, useRef } from 'react';

export default function Page() {
  const [token, setToken] = useState<{ access_token: string } | null>(null);
  const [tokenExpiration, setTokenExpiration] = useState<number | null>(null);
  const [genres, setGenres] = useState<any[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [song, setSong] = useState<any>('');

  const fetchAccessToken = async () => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          'grant_type': 'client_credentials',
          'client_id': '07f7b007eb4141919e8691a16a5299b3',
          'client_secret': 'f3fb4092a7d04bdca1e54a5464c0addb',
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setToken(data);

        const expiresIn = data.expires_in || 3600;
        setTokenExpiration(Date.now() + expiresIn * 1000);
      } else {
        console.error('Error al obtener el token de acceso:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener el token de acceso:', error);
    }
  };

  const fetchGenres = async () => {
    try {
      const response = await fetch('https://api.spotify.com/v1/browse/categories', {
        headers: {
          'Authorization': `Bearer ${token?.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setGenres(data.categories.items);
      } else {
        console.error('Error al obtener los géneros de Spotify:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener los géneros de Spotify:', error);
    }
  };

  const getRandomSong = async () => {
    if (!selectedGenre) {
      alert('Por favor, seleccione un género antes de obtener una canción aleatoria.');
      return;
    }

    try {
      const response = await fetch(`https://api.spotify.com/v1/browse/categories/${selectedGenre}/playlists`, {
        headers: {
          'Authorization': `Bearer ${token?.access_token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        const randomPlaylist = data.playlists.items[0].id;
        const tracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${randomPlaylist}/tracks`, {
          headers: {
            'Authorization': `Bearer ${token?.access_token}`,
          },
        });
        if (tracksResponse.ok) {
          const tracksData = await tracksResponse.json();
          const randomTrack = tracksData.items[Math.floor(Math.random() * tracksData.items.length)].track;
          setSong(randomTrack);
          console.log(randomTrack);
        } else {
          console.error('Error al obtener las canciones de la playlist:', tracksResponse.statusText);
        }
      } else {
        console.error('Error al obtener una playlist aleatoria:', response.statusText);
      }
    } catch (error) {
      console.error('Error al obtener una canción aleatoria de Spotify:', error);
    }
  };

  useEffect(() => {
    fetchAccessToken();
  }, []);

  useEffect(() => {
    if (token) {
      fetchGenres();

      const renewalTimer = setTimeout(fetchAccessToken, (tokenExpiration || 0) - Date.now() - 60000);
      return () => clearTimeout(renewalTimer);
    }
  }, [token, tokenExpiration]);

  return (
    <main className='flex flex-col bg-gradient-to-t from-slate-900 to-green-900 min-h-screen'>
      <div className='bg-zinc-900 flex justify-between p-4 px-5 w-full'>
        <div className='flex gap-3 items-center'>
          <svg className='h-10' viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M128 0C57.308 0 0 57.309 0 128c0 70.696 57.309 128 128 128 70.697 0 128-57.304 128-128C256 57.314 198.697.007 127.998.007l.001-.006Zm58.699 184.614c-2.293 3.76-7.215 4.952-10.975 2.644-30.053-18.357-67.885-22.515-112.44-12.335a7.981 7.981 0 0 1-9.552-6.007 7.968 7.968 0 0 1 6-9.553c48.76-11.14 90.583-6.344 124.323 14.276 3.76 2.308 4.952 7.215 2.644 10.975Zm15.667-34.853c-2.89 4.695-9.034 6.178-13.726 3.289-34.406-21.148-86.853-27.273-127.548-14.92-5.278 1.594-10.852-1.38-12.454-6.649-1.59-5.278 1.386-10.842 6.655-12.446 46.485-14.106 104.275-7.273 143.787 17.007 4.692 2.89 6.175 9.034 3.286 13.72v-.001Zm1.345-36.293C162.457 88.964 94.394 86.71 55.007 98.666c-6.325 1.918-13.014-1.653-14.93-7.978-1.917-6.328 1.65-13.012 7.98-14.935C93.27 62.027 168.434 64.68 215.929 92.876c5.702 3.376 7.566 10.724 4.188 16.405-3.362 5.69-10.73 7.565-16.4 4.187h-.006Z" fill="#1ED760"/></svg>
          <span className='text-white font-bold text-2xl'>GENERARDOR MJ</span>
        </div>
        <a href='https://github.com/dashboard' target='_blank' className='flex gap-2 items-center p-2 pr-3 rounded-full' style={{backgroundColor:"#d7ffd04a"}}>
          <svg className='h-6 text-white' viewBox="0 0 256 250" fill="currentColor" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M128.001 0C57.317 0 0 57.307 0 128.001c0 56.554 36.676 104.535 87.535 121.46 6.397 1.185 8.746-2.777 8.746-6.158 0-3.052-.12-13.135-.174-23.83-35.61 7.742-43.124-15.103-43.124-15.103-5.823-14.795-14.213-18.73-14.213-18.73-11.613-7.944.876-7.78.876-7.78 12.853.902 19.621 13.19 19.621 13.19 11.417 19.568 29.945 13.911 37.249 10.64 1.149-8.272 4.466-13.92 8.127-17.116-28.431-3.236-58.318-14.212-58.318-63.258 0-13.975 5-25.394 13.188-34.358-1.329-3.224-5.71-16.242 1.24-33.874 0 0 10.749-3.44 35.21 13.121 10.21-2.836 21.16-4.258 32.038-4.307 10.878.049 21.837 1.47 32.066 4.307 24.431-16.56 35.165-13.12 35.165-13.12 6.967 17.63 2.584 30.65 1.255 33.873 8.207 8.964 13.173 20.383 13.173 34.358 0 49.163-29.944 59.988-58.447 63.157 4.591 3.972 8.682 11.762 8.682 23.704 0 17.126-.148 30.91-.148 35.126 0 3.407 2.304 7.398 8.792 6.14C219.37 232.5 256 184.537 256 128.002 256 57.307 198.691 0 128.001 0Zm-80.06 182.34c-.282.636-1.283.827-2.194.39-.929-.417-1.45-1.284-1.15-1.922.276-.655 1.279-.838 2.205-.399.93.418 1.46 1.293 1.139 1.931Zm6.296 5.618c-.61.566-1.804.303-2.614-.591-.837-.892-.994-2.086-.375-2.66.63-.566 1.787-.301 2.626.591.838.903 1 2.088.363 2.66Zm4.32 7.188c-.785.545-2.067.034-2.86-1.104-.784-1.138-.784-2.503.017-3.05.795-.547 2.058-.055 2.861 1.075.782 1.157.782 2.522-.019 3.08Zm7.304 8.325c-.701.774-2.196.566-3.29-.49-1.119-1.032-1.43-2.496-.726-3.27.71-.776 2.213-.558 3.315.49 1.11 1.03 1.45 2.505.701 3.27Zm9.442 2.81c-.31 1.003-1.75 1.459-3.199 1.033-1.448-.439-2.395-1.613-2.103-2.626.301-1.01 1.747-1.484 3.207-1.028 1.446.436 2.396 1.602 2.095 2.622Zm10.744 1.193c.036 1.055-1.193 1.93-2.715 1.95-1.53.034-2.769-.82-2.786-1.86 0-1.065 1.202-1.932 2.733-1.958 1.522-.03 2.768.818 2.768 1.868Zm10.555-.405c.182 1.03-.875 2.088-2.387 2.37-1.485.271-2.861-.365-3.05-1.386-.184-1.056.893-2.114 2.376-2.387 1.514-.263 2.868.356 3.061 1.403Z"></path></svg>
          <span className='text-white font-semibold text-sm'>GitHub</span>
        </a>
      </div>
      <div className='flex flex-1 justify-center p-8'>
        <div className='flex flex-col justify-center gap-4 items-center'>
          <label htmlFor="genre" className='text-white text-base font-bold'>SELECCIONA UN GENERO</label>
          <select className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-2.5 outline-none	w-80' id="genre" value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)}>
            <option value="">Genero no seleccionado</option>
            {genres.map((genre: any) => (
              <option key={genre.id} value={genre.id}>{genre.name}</option>
            ))}
          </select>
          <button onClick={getRandomSong} className='ease-in-out duration-300 bg-slate-50 p-2 px-3 text-sm font-bold rounded-full w-fit hover:bg-slate-300 mt-1	'>GENERAR CANCION ALEATORIA</button>
          <div className='flex flex-col mt-2 text-center text-white font-semibold text-sm items-center'>
            <span className='p-4'>{song && song.name ? `${song.artists[0].name} - ${song.name}` : 'AUTOR - CANCION'}</span>
            <img className='w-96' src={song && song.album && song.album.images.length > 0 ? song.album.images[0].url : "/black-square.png"} alt={song && song.name ? `Imagen de ${song.name}` : "Imagen no disponible"} />
            <audio className='mt-6' src={song && song.preview_url} controls />
          </div>
        </div>
      </div>
    </main>
  );
}