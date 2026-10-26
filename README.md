# Photo Gallery

A small React photo gallery for the Celebrare frontend internship assignment. Browse 30 photographs, search by author, and save favourites across refreshes.

## Run locally

Use Node.js 22.12+ or 24 LTS and npm.

```sh
npm ci
npm run dev
```

Open the local address printed by Vite (normally http://localhost:5173).

```sh
npm run lint
npm run build
npm run preview
```

The app requires internet access to fetch the public API and images. No API key, backend, or environment variables are needed.

## Requirements and implementation

| Requirement | Where to look |
| --- | --- |
| React + Vite, Tailwind only, functional components | `package.json`, `vite.config.js`, `src/index.css` |
| Fetch 30 photos, loading spinner, error message | `src/hooks/useFetchPhotos.js`, `src/components/Gallery.jsx` |
| Responsive grid: 1 mobile, 2 tablet, 4 desktop | `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` in `Gallery.jsx` |
| Real-time author search, no search API calls | `handleSearch` and `filteredPhotos` in `Gallery.jsx` |
| Favourites managed with useReducer and localStorage | `src/reducers/favouritesReducer.js`, `Gallery.jsx` |
| Custom hook returning photos, loading, error | `src/hooks/useFetchPhotos.js` |
| useCallback search handler and useMemo filtered list | `Gallery.jsx`; memoized `SearchInput.jsx` |

The grid switches to two columns at 768px and four at 1024px. Cards use smaller Picsum image URLs for the same photo IDs instead of downloading the original full-resolution images. Hearts are accessible buttons with `aria-pressed` and descriptive labels. Icons are inline SVG; no component or icon libraries are installed.

## How state works

- `useFetchPhotos` owns the request and three state values. It checks HTTP failures, catches network/JSON errors, and stops showing the spinner when the request finishes. Its cleanup aborts a request when the component unmounts.
- `search` is a string managed with `useState`. The memoized handler updates it. `useMemo` filters authors case-insensitively, ignoring surrounding spaces.
- `favourites` is an array of photo ID strings managed only by `useReducer`. `TOGGLE_FAVOURITE` adds an absent ID or removes a present one, without mutating the previous array.
- The reducer initializer restores saved IDs before the first render. An effect writes changed IDs to localStorage. Invalid saved JSON falls back to an empty array. If browser storage is blocked/full, toggling still works in memory but will not persist.
- `useCallback` keeps the search function's identity stable so the memoized search input can skip rendering when a heart changes. `useMemo` avoids repeating the filter on a favourites-only render. Removing either optimization would not break correctness; it can cause extra work. For 30 photos the savings are small, and these hooks are included as required by the assignment.

## Manual verification

1. Open the app and confirm 30 cards load. With network throttling, confirm a spinner appears first.
2. Search an author name from a visible card. Try different letter cases, a partial name, and a name with spaces around it. Confirm the filtered results update without a reload or another list request.
3. Search a name that does not exist. Confirm the empty result message appears; clear search to restore all cards.
4. Favourite a photo, refresh, and confirm its filled heart remains. Unfavourite it and refresh again.
5. Check the grid at 390px, 820px, and 1440px: one, two, and four columns respectively.
6. Block the list API in browser developer tools and refresh. Confirm an error message appears and the spinner stops. Unblock it and refresh to recover.
7. Tab to a heart and use Enter/Space to toggle it. The search field has an accessible label.

React StrictMode intentionally starts, cancels, and restarts the fetch effect in development. A cancelled development request is expected; the production build loads normally.

## Verification completed

`npm run lint` and `npm run build` pass. Fourteen browser checks passed against the running app: the live API and images, case-insensitive search without additional API requests, empty results, adding/removing favourites across reloads, all three grid layouts without overflow, recovery from corrupted storage, no uncaught browser errors, the pending-request spinner, HTTP and network errors, and keyboard toggling with unavailable storage. Error/loading states were checked using controlled API responses.

## References

- [Vite setup](https://vite.dev/guide/)
- [Tailwind's Vite installation](https://tailwindcss.com/docs/installation/using-vite)
- [Picsum API and sized image URLs](https://picsum.photos/)
