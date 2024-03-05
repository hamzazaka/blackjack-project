// Importing necessary modules and styles
import React, { useState, useEffect } from 'react';
import { Button, Container, Typography, Grid } from '@mui/material';
import { initializeDeck, drawCard } from '../CardService/CardService';
import './Game.css';

// Functional component for the Blackjack game
const Game = () => {
  // State variables to track game data
  const [deckId, setDeckId] = useState(null);
  const [playerHand, setPlayerHand] = useState([]);
  const [houseHand, setHouseHand] = useState([]);
  const [playerTotal, setPlayerTotal] = useState(0);
  const [houseTotal, setHouseTotal] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);

  // useEffect hook to initialize the game when the component mounts
  useEffect(() => {
    const initializeGame = async () => {
      try {
        // Initialize a new deck and get its ID
        const id = await initializeDeck();
        setDeckId(id);
        // Deal initial cards from the deck
        dealInitialCards(id);
      } catch (error) {
        setMessage('Error initializing game. Please try again.');
        console.error('Error initializing game:', error.message);
      }
    };

    // Call the initialization function when the component mounts
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // useEffect hook to check for win/lose conditions whenever player or house totals change
  useEffect(() => {
    const checkWinOrLose = () => {
      if (gameOver) return;
      // Check different game outcomes and update the message accordingly
      if (playerTotal === 21 && houseTotal < 21) {
        setGameOver(true);
        setMessage('Blackjack! You win!');
      } else if (houseTotal === 21 && playerTotal < 21) {
        setGameOver(true);
        setMessage('Computer has Blackjack. You lose!');
      } else if (playerTotal > 21) {
        setGameOver(true);
        setMessage('Busted! You lose.');
      } else if (playerTotal > houseTotal && playerTotal < 21) {
        setGameOver(true);
        setMessage('Congratulations! You win!');
      } else if (playerTotal === 21 && houseTotal === 21) {
        setGameOver(true);
        setMessage("It's a draw! You Lose!");
      }
    };

    // Call the checkWinOrLose function when relevant state variables change
    checkWinOrLose();
  }, [gameOver, playerTotal, houseTotal]);

  // Function to deal the initial cards for both the player and the house
  const dealInitialCards = async (deckId) => {
    try {
      // Draw two cards for the player and two cards for the house
      const playerCards = await drawCard(deckId, 2);
      const houseCards = await drawCard(deckId, 2);

      // Set the player and house hands, and calculate their initial totals
      setPlayerHand(playerCards);
      setHouseHand(houseCards);
      setPlayerTotal(calculateTotal(playerCards));
      setHouseTotal(calculateTotal(houseCards));
    } catch (error) {
      setMessage('Error dealing initial cards. Please try again.');
      console.error('Error dealing initial cards:', error.message);
    }
  };

  // Function to calculate the total value of a hand, considering Ace special case
  const calculateTotal = (hand) => {
    let total = 0;
    let aceCount = 0;

    // Loop through each card in the hand and calculate the total value
    hand.forEach((card) => {
      if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
        total += 10;
      } else if (card.value === 'ACE') {
        total += 11;
        aceCount += 1;
      } else {
        total += parseInt(card.value);
      }
    });

    // Adjust the total value if there are Aces in the hand and the total exceeds 21
    while (total > 21 && aceCount > 0) {
      total -= 10;
      aceCount -= 1;
    }

    return total;
  };

  // Function to handle the "Play" button click and start the game
  const handlePlay = () => {
    setGameStarted(true);
  };

  // Function to handle the "Hit" button click
  const handleHit = async () => {
    if (playerTotal < 21 && !gameOver) {
      try {
        // Draw a new card and update the player's hand and total
        const newCard = await drawCard(deckId, 1);
        setPlayerHand([...playerHand, ...newCard]);
        setPlayerTotal(calculateTotal([...playerHand, ...newCard]));

        // Check if the player busts (total exceeds 21) after hitting
        if (playerTotal > 21) {
          setGameOver(true);
          setMessage('Busted! You lose.');
        }
      } catch (error) {
        setMessage('Error drawing a card. Please try again.');
        console.error('Error drawing a card:', error.message);
      }
    }
  };

  // Function to handle the "Stand" button click
  const handleStand = () => {
    // End the player's turn and determine the winner
    setGameOver(true);
    determineWinner();
  };

  // Function to restart the game by resetting state variables
  const restartGame = () => {
    setGameOver(false);
    setMessage('');
    setPlayerHand([]);
    setHouseHand([]);
    setPlayerTotal(0);
    setHouseTotal(0);
    dealInitialCards(deckId);
  };

  // Function to determine the winner after player has stood
  const determineWinner = () => {
    if (houseTotal > 21 || (playerTotal <= 21 && playerTotal > houseTotal)) {
      setMessage('Congratulations! You win!');
    } else if (playerTotal === houseTotal) {
      setMessage("It's a tie! You lose");
    } else {
      setMessage('Sorry, you lose. Better luck next time.');
    }
  };

  // JSX for rendering the game interface
  return (
    <Container maxWidth="xl" className="game-container">
      <Typography variant="h3" className="heading">
        BlackJack
      </Typography>
      {!gameStarted ? (
        <div className="play-button-container">
          <Button className='play-button' variant="contained" color="primary" onClick={handlePlay}>
            Play
          </Button>
        </div>
      ) : (
        <div>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6} textAlign={'center'}>
            <div className="user-cards">
              <Typography variant="h6">User's Hand</Typography>
              <div className="cards">
                {playerHand.map((card, index) => (
                  <img  key={index} src={card.image} alt={`${card.value} of ${card.suit}`} />
                ))}
              </div>
              <Typography variant="body1">Total: {playerTotal}</Typography>
            </div>
          </Grid>

          <Grid item xs={12} md={6} textAlign={'center'}>
            <div className="computer-cards">
              <Typography variant="h6">Computer's Hand</Typography>
              <div className="cards">
                {houseHand.map((card, index) => (
                  <img key={index} src={card.image} alt={`${card.value} of ${card.suit}`} />
                ))}
              </div>
              <Typography variant="body1">Total: {houseTotal}</Typography>
            </div>
          </Grid>
        </Grid>
        <div className="buttons">
        {!gameOver && (
          <>
            <Button className='button' variant="contained" color="primary" onClick={handleHit}>
              Hit
            </Button>
            <Button className='button' variant="contained" color="primary" onClick={handleStand}>
              Stand
            </Button>
          </>
        )}
      </div>

      <div className="message">
        {message && (
          <>
            <Typography variant="h5">{message}</Typography>
            <Button className='button' variant="contained" color="primary" onClick={restartGame}>
              Restart Game
            </Button>
          </>
        )}
      </div>
      </div>
      )}
    </Container>
  );
};

export default Game;
