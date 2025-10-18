import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import SingleAnimePageDetails from './Pages/SingleAnimeDetailsPage'
import AnimeStreamingPage from './Pages/AnimeStreamingPage'
import AnimeWatchlistPage from './Pages/AnimeWatchlistPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/Dashboard' element={<Dashboard/>}/>
        <Route path='/Dashboard/AnimePage/:id' element={<SingleAnimePageDetails/>}/>
        <Route path='/Watch/:id' element={<AnimeStreamingPage/>}/>
        <Route path='/WatchList' element={<AnimeWatchlistPage/>}/>
      </Routes>
    </div>
  )
}

export default App;
