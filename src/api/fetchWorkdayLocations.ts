const fetchWorkdayLocations = async (company: string): Promise<any> => {
  try {
    const response = await fetch(
      `http://localhost:8000/api/locations/${company}`,
      {
        method: 'GET',
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
    console.error('Failed to fetch locations: ', error);
    throw error;
  }
};

export default fetchWorkdayLocations;
