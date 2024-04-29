// fetchWorkdayAPI.ts

const createQueryString = (baseURL: string, params: any) => {
  const url = new URL(baseURL);
  Object.keys(params).forEach((key) => {
    if (Array.isArray(params[key])) {
      // Use the `locations[]` notation if backend is configured to handle arrays this way
      params[key].forEach((value: any) =>
        url.searchParams.append(`${key}[]`, value)
      );
    } else {
      url.searchParams.append(key, params[key]);
    }
  });
  return url;
};

// interface Params {
//   limit: number | string;
//   offset: number | string;
//   searchText: string;
//   locations?: string[];
//   locationCountry?: string[];
// }

// const createQueryString = (baseUrl: string, params: Params) => {
//   const url = new URL(baseUrl);
//   console.log('selectedLocations in createQueryString >>>\n', params.locations);
//   url.searchParams.append('limit', String(params.limit));
//   url.searchParams.append('offset', String(params.offset));
//   url.searchParams.append('searchText', params.searchText);

//   // if (!selectedLocations) {
//   //   return url.toString();
//   // }
//   if (params.locations && Array.isArray(params.locations)) {
//     params.locations.forEach((city: string) => {
//       url.searchParams.append('locations', city);
//     });
//   }

//   // Append locationCountry if they exist and are an array
//   if (params.locationCountry && Array.isArray(params.locationCountry)) {
//     params.locationCountry.forEach((country: string) => {
//       url.searchParams.append('locationCountry', country);
//     });
//   }

//   return url.toString();
// };

/**
 * Fetch job listings from the Workday API.
 * @param limit The maximum number of job listings to fetch.
 * @param offset The offset from the start for pagination.
 * @param searchText The text to search for in job listings.
 * @returns A promise that resolves to the job listings.
 */

// interface LocationsData {
//   locations?: string[];
//   locationCountry?: string[];
// }

const fetchWorkdayAPI = async (
  company: string,
  limit: string | number = 20,
  offset: string | number = 0,
  searchText: string = '',
  selectedLocations?: any
): Promise<any> => {
  try {
    console.log(
      'selectedLocations in fetchWORKDAY!!! >>>\n',
      selectedLocations
    );
    const queryURL = createQueryString(
      `http://localhost:8000/v1/api/jobs/${company}`,
      {
        limit,
        offset,
        searchText,
        locations: selectedLocations.locations,
        locationCountry: selectedLocations.locationCountry,
      }
    );
    console.log('queryURL', queryURL);
    const response = await fetch(queryURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Failed to fetch job listings: ', error);
    return false;
  }
};

export default fetchWorkdayAPI;
