import { Place } from '@/api/venueApplication';

export const convertPlacesToOptions = (places: Place[]) => {
  return places.map((place) => {
    return { id: place.id, name: place.name };
  });
};
