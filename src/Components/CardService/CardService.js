// Importing the Axios library for making HTTP requests
import axios from 'axios';

// Base URL for the Deck of Cards API
const BASE_URL = 'https://deckofcardsapi.com/api/deck';

// Function to initialize a new deck and return its ID
export const initializeDeck = async () => {
  try {
    // Making a GET request to the API to shuffle a new deck
    const response = await axios.get(`${BASE_URL}/new/shuffle/?deck_count=1`);
    // Returning the deck ID obtained from the API response
    return response.data.deck_id;
  } catch (error) {
    // Handling errors that may occur during the API request
    console.error('Error initializing deck:', error.message);
    // Throwing a custom error to indicate failure in deck initialization
    throw new Error('Failed to initialize deck');
  }
};

// Function to draw one or more cards from a specified deck
export const drawCard = async (deckId, count = 1) => {
  try {
    // Making a GET request to the API to draw specified number of cards from the deck
    const response = await axios.get(`${BASE_URL}/${deckId}/draw/?count=${count}`);
    // Returning the drawn cards obtained from the API response
    return response.data.cards;
  } catch (error) {
    // Handling errors that may occur during the API request
    console.error('Error drawing card:', error.message);
    // Throwing a custom error to indicate failure in drawing cards
    throw new Error('Failed to draw card');
  }
};
