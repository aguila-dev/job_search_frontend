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

/**
 * Fetch job listings from the Workday API.
 * @param limit The maximum number of job listings to fetch.
 * @param offset The offset from the start for pagination.
 * @param searchText The text to search for in job listings.
 * @returns A promise that resolves to the job listings.
 */

const fetchWorkdayAPI = async (
  company: string,
  limit: string | number = 20,
  offset: string | number = 0,
  searchText: string = '',
  selectedLocations: string[] = []
): Promise<any> => {
  try {
    console.log('selectedLocations', selectedLocations);
    const queryURL = createQueryString(
      `http://localhost:8000/jobs/${company}`,
      {
        limit,
        offset,
        searchText,
        locations: selectedLocations,
      }
    );
    console.log('queryURL', queryURL);
    const response = await fetch(
      // `http://localhost:8000/jobs/${company}?limit=${limit}&offset=${offset}&searchText=${searchText}`,
      queryURL,
      {
        method: 'GET', // Assuming your Node.js backend uses a GET request for this route
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

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
