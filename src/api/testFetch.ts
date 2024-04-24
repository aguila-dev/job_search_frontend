import fetchWkdAPI from './fetchWorkdayAPI';
// Function to initiate the fetch and log results
async function testFetch() {
  try {
    const data = await fetchWkdAPI(); // Use default parameters or specify your own
    console.log('Fetched Data:', data);
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

testFetch(); // Call the test function
