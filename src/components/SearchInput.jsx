import { memo } from 'react';

// memo lets this component skip re-rendering when only favourites change.
const SearchInput = memo(function SearchInput({ value, onChange }) {
  return (
    <div className="relative w-full sm:max-w-sm">
      <label htmlFor="author-search" className="sr-only">Search by author</label>
      <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="pointer-events-none absolute top-3.5 left-4 size-5 text-stone-400">
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </svg>
      <input
        id="author-search"
        type="search"
        value={value}
        onChange={onChange}
        placeholder="Search by author..."
        autoComplete="off"
        className="h-12 w-full rounded-xl border border-stone-300 bg-white py-3 pr-4 pl-12 text-sm text-stone-800 shadow-xs outline-none transition placeholder:text-stone-500 focus:border-[#a74632] focus:ring-2 focus:ring-[#a74632]/15"
      />
    </div>
  );
});

export default SearchInput;
