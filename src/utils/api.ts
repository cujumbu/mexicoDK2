import type { Attraction } from '../types';

const OPENTRIPMAP_API_KEY = import.meta.env.VITE_OPENTRIPMAP_API_KEY;

// Danish translations for common categories
const categoryTranslations: Record<string, string> = {
  'historic': 'Historisk',
  'architecture': 'Arkitektur',
  'cultural': 'Kultur',
  'natural': 'Natur',
  'religion': 'Religion',
  'beaches': 'Strand',
  'museums': 'Museum',
  'urban_environment': 'Bymiljø',
  'tourist_facilities': 'Turistfaciliteter',
  'sport': 'Sport',
  'amusements': 'Underholdning',
  'pools': 'Swimmingpool',
  'water': 'Vand',
  'gardens_and_parks': 'Parker og Haver',
  'monuments': 'Monument',
  'other': 'Andet'
};

const translateCategory = (category: string): string => {
  const key = category.toLowerCase().split(',')[0];
  return categoryTranslations[key] || 'Seværdighed';
};

const getWikipediaUrl = (details: any): string | undefined => {
  // Check for Wikipedia link in different possible locations
  if (details.wikipedia) {
    if (typeof details.wikipedia === 'string') {
      return details.wikipedia;
    }
    if (details.wikipedia.link && typeof details.wikipedia.link === 'string') {
      return details.wikipedia.link;
    }
  }
  if (details.wikipedia_extracts?.url && typeof details.wikipedia_extracts.url === 'string') {
    return details.wikipedia_extracts.url;
  }
  return undefined;
};

export const fetchAttractions = async (lat: number, lon: number): Promise<Attraction[]> => {
  try {
    const radius = 20000; // 20km radius
    const limit = 50; // Increased limit
    const headers = {
      'X-RapidAPI-Key': OPENTRIPMAP_API_KEY,
      'X-RapidAPI-Host': 'opentripmap-places-v1.p.rapidapi.com'
    };

    // First, get places within radius
    const placesResponse = await fetch(
      `https://opentripmap-places-v1.p.rapidapi.com/en/places/radius?radius=${radius}&lon=${lon}&lat=${lat}&limit=${limit}&rate=2&format=json`,
      { headers }
    );

    if (!placesResponse.ok) {
      throw new Error(`OpenTripMap API error: ${placesResponse.statusText}`);
    }

    const placesData = await placesResponse.json();

    if (!Array.isArray(placesData)) {
      console.error('Invalid places response format:', placesData);
      return [];
    }

    // Fetch details for each place
    const attractions = await Promise.all(
      placesData.map(async (place) => {
        try {
          const detailsResponse = await fetch(
            `https://opentripmap-places-v1.p.rapidapi.com/en/places/xid/${place.xid}`,
            { headers }
          );

          if (!detailsResponse.ok) {
            throw new Error(`Failed to fetch details for ${place.xid}`);
          }

          const details = await detailsResponse.json();

          // Only return places with names
          if (!details.name) {
            return null;
          }

          // Format the distance
          const distanceInKm = place.dist / 1000;
          const formattedDistance = distanceInKm < 1 
            ? `${Math.round(place.dist)}m` 
            : `${distanceInKm.toFixed(1)}km`;

          // Get Wikipedia URL
          const wikipediaUrl = getWikipediaUrl(details);

          return {
            id: place.xid,
            name: details.name,
            category: translateCategory(details.kinds || ''),
            address: details.address?.road || 'Adresse ikke tilgængelig',
            distance: formattedDistance,
            photo: details.preview?.source,
            lat: place.point.lat.toString(),
            lng: place.point.lon.toString(),
            wikipediaUrl: wikipediaUrl
          };
        } catch (error) {
          console.error('Error fetching attraction details:', error);
          return null;
        }
      })
    );

    // Filter out null values and ensure required fields exist
    return attractions.filter((a): a is Attraction => 
      a !== null && a.name && a.category
    );
  } catch (error) {
    console.error('Error fetching attractions:', error);
    return [];
  }
};