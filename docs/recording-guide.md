# Five-minute recording guide

Practise with the working app and the source code open side by side. Speak in your own words. This guide explains the implementation; it is not a claim about what you personally found difficult.

## 0:00-1:10 - Demonstrate the app

- Introduce it as a React + Vite gallery styled with Tailwind.
- Refresh and show the spinner, followed by 30 photographs. If the request is too fast to see, use developer tools network throttling before refreshing.
- Search a photographer name from a visible card, try mixed-case text, and show that only matching authors remain.
- Clear the search. Toggle a heart and refresh to prove it stays selected. Remove it to show both directions work.
- Briefly show mobile/tablet/desktop sizes if time allows.

Suggested explanation: "The initial request gets the photos. Search filters that array in the browser, so typing does not make another API request. Favourite IDs are saved on this browser."

## 1:10-2:10 - Open src/hooks/useFetchPhotos.js

Walk through the file from top to bottom:

- Imports: `useState` stores values; `useEffect` starts the request after rendering.
- `PHOTOS_URL`: the exact required endpoint, with `limit=30`.
- Initial state: an empty photos array, loading true, error null.
- `AbortController`: supplies a signal that lets cleanup cancel a request.
- The async function calls `fetch`, checks `response.ok`, then reads the JSON.
- `fetch` does not automatically reject HTTP error responses, which is why `response.ok` matters.
- Success stores photos. `catch` stores a readable message for network, HTTP, or JSON failure. `finally` ends loading, including on failure.
- The aborted check avoids changing state after cancellation. Cleanup calls `abort` on unmount.
- The empty dependency array means the effect runs when mounted, rather than on every search or heart click. StrictMode also performs an extra setup/cleanup cycle during development.
- The returned object contains exactly `photos`, `loading`, and `error`. `Gallery` consumes those values to choose the loading, error, or grid UI.

## 2:10-3:10 - Open the reducer, then Gallery.jsx

Open `src/reducers/favouritesReducer.js`:

- The storage key names the localStorage entry belonging to this app.
- `readFavourites` parses saved JSON. It checks for an array of string IDs and removes duplicates. Invalid JSON or unavailable storage returns `[]`.
- The reducer handles one action: `TOGGLE_FAVOURITE`.
- `includes` checks whether an ID is saved. `filter` removes it, or `[...state, action.id]` adds it. Both produce a new array, leaving old state untouched.
- An unknown action returns the current state.

Open `Gallery.jsx`:

- `useReducer(favouritesReducer, [], readFavourites)` uses a lazy initializer: restore saved IDs before the first persistence effect can overwrite them.
- A heart dispatches an action containing the action type and photo ID.
- An effect saves the new array after favourites change. Storage is a side effect, so it stays outside the pure reducer.
- `useReducer` is required by the brief. It also keeps add/remove decisions in a single named state-transition function. `useState` could implement a small toggle, but this assignment specifically asks for a reducer.

## 3:10-4:15 - Explain useCallback and useMemo in Gallery.jsx

- `handleSearch` reads the input event and sets the search string.
- `useCallback` caches the function reference. Its empty dependency array is safe because the function only uses the stable state setter.
- `SearchInput` is wrapped with React's `memo`. A stable callback lets it skip a re-render when only favourites change. Its value still changes when the user types.
- `useMemo` caches the filtered array. It recomputes only when `photos` or `search` changes.
- `trim` removes surrounding spaces. `toLowerCase` on both sides makes search case-insensitive. `includes` supports partial names.
- Be explicit: "Neither optimization is necessary for correctness. Removing them would still produce the right results, but could recreate the handler or repeat filtering on unrelated renders. With only 30 photos the benefit is small."

## 4:15-5:00 - Explain a difficulty you actually encountered

Choose a real part you studied, debugged, or changed. One useful exercise is understanding persistence:

1. Ask yourself what happens if an effect saves an empty default array before another effect reads localStorage.
2. Explain why initializing the reducer directly from storage prevents that ordering problem.
3. Show the initializer, then show a heart surviving a refresh.

Only describe this as your hardest part if it was. Another option is explaining why HTTP failures need `response.ok`, or why aborted requests should not set state.

Possible form sentence, **only if it reflects your experience**: "The hardest part was restoring favourites before the first save; I solved it with useReducer's lazy initializer."

## Other lines you should understand

| Code | Plain-English meaning |
| --- | --- |
| JSX and `{...}` | HTML-like UI syntax, with JavaScript expressions inside braces. |
| `createRoot(...).render(...)` | Mounts the React tree inside the root element from index.html. |
| `StrictMode` | Development checks that help reveal effect-cleanup mistakes. |
| Imports/exports | Share components and functions between files. |
| Props / destructuring | Receive values and functions from a parent component. |
| `photos.map(...)` | Creates one card for each matching photo. |
| `key={photo.id}` | Gives React a stable identity for each card. |
| `onClick={() => onToggle(photo.id)}` | Waits for a click, then sends that card's ID to its parent. |
| `aria-pressed` | Tells assistive technology whether a toggle button is selected. |
| Inline SVG | Draws the small icons without a UI library. |
| Conditional/ternary expressions | Choose loading, error, empty, or populated UI; choose heart appearance. |
| Template literals | Insert values into text, image URLs, and conditional Tailwind classes. |
| `grid-cols-1 md:grid-cols-2 lg:grid-cols-4` | One column by default, two at 768px+, four at 1024px+. |
| `loading="lazy"` | Lets the browser defer off-screen image downloads. |
| localStorage | Browser storage that survives refreshes on the same origin. |
| `JSON.stringify` / `JSON.parse` | Convert arrays to storage strings and back. |
| `try` / `catch` / `finally` | Attempt work, handle failures, and finish cleanup. |
| Tailwind's Vite plugin and CSS import | Generate the utility CSS classes used in JSX. |

## Recording and submitting

Use a recorder you are comfortable with (Windows Game Bar or OBS are options from the brief). Capture your screen and microphone. Play back the finished video to verify that the code is readable and your voice is audible.

Upload the actual recording. Make sure someone with the link can watch it. Submit that URL and the public GitHub repository URL in the Google Form provided separately. Do not substitute an automated silent demo for your own explanation.
