import { useCallback, useEffect, useMemo, useReducer, useState } from 'react';
import useFetchPhotos from '../hooks/useFetchPhotos';
import { favouritesReducer, readFavourites, STORAGE_KEY } from '../reducers/favouritesReducer';
import PhotoCard from './PhotoCard';
import SearchInput from './SearchInput';

export default function Gallery() {
  const { photos, loading, error } = useFetchPhotos();
  const [search, setSearch] = useState('');
  // The initializer reads storage before the first render/persistence effect.
  const [favourites, dispatch] = useReducer(favouritesReducer, [], readFavourites);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favourites));
    } catch {
      // Still allow toggling in memory if browser storage is unavailable.
      console.warn('Favourites could not be saved in this browser.');
    }
  }, [favourites]);

  const handleSearch = useCallback((event) => {
    setSearch(event.target.value);
  }, []);

  const filteredPhotos = useMemo(() => {
    const query = search.trim().toLowerCase();
    return photos.filter((photo) => photo.author.toLowerCase().includes(query));
  }, [photos, search]);

  function toggleFavourite(id) {
    dispatch({ type: 'TOGGLE_FAVOURITE', id });
  }

  return (
    <div className="min-h-screen bg-[#f7f6f2] font-sans text-stone-800 antialiased">
      <header className="border-b border-stone-200">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-5 py-6 sm:px-8">
          <div className="flex size-9 items-center justify-center rounded-xl bg-[#a74632] text-white">
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="size-5">
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m3 17 5-5 4 4 4-6 5 7" />
            </svg>
          </div>
          <h1 className="text-sm font-semibold tracking-tight">Photo Gallery<span className="text-[#a74632]">.</span></h1>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 pt-8 pb-16 sm:px-8">
        <div className="mb-6">
          <SearchInput value={search} onChange={handleSearch} />
        </div>

        {loading ? (
          <div role="status" className="flex min-h-80 flex-col items-center justify-center gap-4 text-sm text-stone-600">
            <span aria-hidden="true" className="size-8 animate-spin rounded-full border-2 border-stone-200 border-t-[#a74632] motion-reduce:animate-none" />
            Loading photographs...
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-red-900">
            <h2 className="font-semibold">We couldn't load the photographs.</h2>
            <p className="mt-2 text-sm">{error} Check your connection and refresh the page.</p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-t border-stone-200 pt-5 text-xs text-stone-600">
              <p role="status">{filteredPhotos.length} {filteredPhotos.length === 1 ? 'photograph' : 'photographs'}{search.trim() ? ` matching “${search.trim()}”` : ' to explore'}</p>
              <p>{favourites.length} {favourites.length === 1 ? 'favourite' : 'favourites'} saved</p>
            </div>
            {filteredPhotos.length > 0 ? (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {filteredPhotos.map((photo) => (
                  <PhotoCard key={photo.id} photo={photo} isFavourite={favourites.includes(photo.id)} onToggle={toggleFavourite} />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-stone-300 px-5 py-20 text-center">
                <h2 className="font-serif text-2xl">No photographs found.</h2>
                <p className="mt-2 text-sm text-stone-600">Try another author name or clear your search.</p>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="mx-auto flex max-w-7xl flex-wrap justify-between gap-2 border-t border-stone-200 px-5 py-6 text-xs text-stone-500 sm:px-8">
        <p>A little perspective goes a long way.</p>
        <p>Photography from <a href="https://picsum.photos" className="underline underline-offset-4 hover:text-stone-800">Lorem Picsum</a></p>
      </footer>
    </div>
  );
}
