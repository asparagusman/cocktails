import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [cocktailData, setCocktailData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [inputValue, setInputValue] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(10);
  const [showAll, setShowAll] = useState(true);

  useEffect(() => {
    const fetchCocktails = async () => {
      try {
        const response = searchTerm
          ? await axios.get(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchTerm}`)
          : await axios.get('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=');
        setCocktailData(response.data.drinks || []);
        setCurrentPage(1);  // Reset to the first page on new search
      } catch (error) {
        console.error('Error fetching the data', error);
      }
    };

    fetchCocktails();
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchTerm(inputValue);
    setShowAll(false);
  };

  const handleShowAll = () => {
    setSearchTerm('');
    setInputValue('');
    setShowAll(true);
  };

  // Get current posts
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = cocktailData.slice(indexOfFirstResult, indexOfLastResult);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate total pages
  const totalPages = Math.ceil(cocktailData.length / resultsPerPage);

  return (
    <div className="App">
      <h1>Search Cocktails</h1>
      <form onSubmit={handleSearch}>
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Enter a cocktail" 
        />
        <button type="submit">Search</button>
        <button type="button" onClick={handleShowAll}>Show All</button>
      </form>
      {currentResults.length > 0 ? (
        <>
          <ul>
            {currentResults.map(drink => (
              <li key={drink.idDrink}>
                <h2>{drink.strDrink}</h2>
              </li>
            ))}
          </ul>
          {cocktailData.length > resultsPerPage && (
            <div className="pagination">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => paginate(index + 1)}
                  className={currentPage === index + 1 ? 'active' : ''}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
}

export default App;
