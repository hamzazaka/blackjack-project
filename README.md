# Blackjack

This project is a simplified version of the classic card game Blackjack, built with React. The aim is to create a single-player game against the computer ("The House") with the objective of achieving a hand value closer to 21 than the House, without exceeding 21.

## Game Rules

- The game is played with a single deck of cards.
- Both the player and the House start with two face-up cards. The player can see both of their own cards and the House's cards.
- Players can choose to "Hit" to take another card or "Stand" to end their turn.
- Face cards (Jack, Queen, King) are worth 10 points, Aces can be 1 or 11, and all other cards hold their numeric value.
- The game ends when the player stands or exceeds a total of 21 points.
- A win occurs if the player's total is higher than the House's without exceeding 21, or reaches exactly 21.

## Technologies Used

- React.js for the UI
- Axios for API requests to [Deck of Cards API](http://deckofcardsapi.com/)
- Material UI for component styling

## Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). To get started, clone the repository and run the following commands:

## bash
npm install
npm start

