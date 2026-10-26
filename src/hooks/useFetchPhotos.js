import { useEffect, useState } from 'react';

const PHOTOS_URL = 'https://picsum.photos/v2/list?limit=30';

export default function useFetchPhotos() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPhotos() {
      try {
        const response = await fetch(PHOTOS_URL, {
          signal: controller.signal,
        });

        // fetch only rejects network errors; HTTP failures need this check.
        if (!response.ok) {
          throw new Error(`Could not load photos (HTTP ${response.status}).`);
        }

        const data = await response.json();
        if (!controller.signal.aborted) setPhotos(data);
      } catch (err) {
        if (!controller.signal.aborted) {
          setError(err.message || 'Could not load photos. Please try again.');
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    fetchPhotos();

    // Cancel the request when unmounting, including StrictMode's dev cleanup.
    return () => controller.abort();
  }, []);

  return { photos, loading, error };
}
