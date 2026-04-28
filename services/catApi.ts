export async function getCatBreeds() {
  try {
    const response = await fetch(
      "https://api.thecatapi.com/v1/breeds?limit=15",
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

