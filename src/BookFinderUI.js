import React, { useState } from 'react';
import axios from 'axios';
import { CircularProgress, Grid, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import BookCard from './components/BookCard'; 
import SearchBar from './components/SearchBar'; 

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f4f6f8',
    padding: theme.spacing(3),
  },
  resultsContainer: {
    width: '100%',
    height: 'calc(100vh - 200px)',
    overflowY: 'auto',
    padding: theme.spacing(2),
  },
  loading: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '50vh',
  },
}));

const BookFinderUI = () => {
  const classes = useStyles();
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetching Google Books API
  const fetchBooks = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const response = await axios.get(`https://www.googleapis.com/books/v1/volumes`, {
        params: {
          q: query,
          maxResults: 10,  // Limit results to 10
          langRestrict: 'en', // Restrict to English books
        },
      });
      setBooks(response.data.items);  // Set the books data from Google Books API
    } catch (error) {
      console.error('Error fetching books', error);
    }
    setLoading(false);
  };

  return (
    <div className={classes.root}>
      {/* Search bar */}
      <SearchBar query={query} setQuery={setQuery} fetchBooks={fetchBooks} />

      {/* Display loading indicator */}
      {loading ? (
        <div className={classes.loading}>
          <CircularProgress />
        </div>
      ) : (
        <div className={classes.resultsContainer}>
          <Grid container spacing={3} justifyContent="center">
            {books.length > 0 ? (
              books.map((book, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <BookCard book={book} /> {/* Render each BookCard */}
                </Grid>
              ))
            ) : (
              <Typography variant="h6" color="textSecondary" gutterBottom>
                <p>“Words can be like X-rays if you use them properly – they’ll go through anything. You read and you’re pierced.”</p>
                <p>–Aldous Huxley, Brave New World</p>{/*Tag Line*/ }
              </Typography>
            )}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default BookFinderUI;

