export default function PhotoCard({ photo, isFavourite, onToggle }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-stone-200 bg-white transition-shadow hover:shadow-md">
      <div className="aspect-[4/3] overflow-hidden bg-stone-200">
        <img
          src={`https://picsum.photos/id/${photo.id}/640/480`}
          alt={`Photograph by ${photo.author}`}
          width="640"
          height="480"
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 motion-safe:group-hover:scale-105"
        />
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="mb-1 text-[10px] font-semibold tracking-[0.18em] text-stone-500 uppercase">Photograph by</p>
          <h2 className="truncate text-sm font-medium text-stone-800" title={photo.author}>{photo.author}</h2>
        </div>
        <button
          type="button"
          aria-label={`${isFavourite ? 'Remove' : 'Add'} photo ${photo.id} ${isFavourite ? 'from' : 'to'} favourites`}
          aria-pressed={isFavourite}
          onClick={() => onToggle(photo.id)}
          className={`flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-full transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a74632] ${isFavourite ? 'bg-[#faeee9] text-[#a74632]' : 'bg-stone-50 text-stone-500 hover:bg-stone-100 hover:text-[#a74632]'}`}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" fill={isFavourite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-5">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
          </svg>
        </button>
      </div>
    </article>
  );
}
