import React, { useState, useEffect } from 'react'
import './Search.css'
import Dashboard from './Dashboard'
import Library from './Library'
import useAuth from './useAuth'
import SpotifyWebApi from 'spotify-web-api-node'
import TrackSearchResult from './TrackSearchResult'
import Player from './Player'


const spotifyWebApi = new SpotifyWebApi({
    clientId: '83a8e9308c2847e48066ac7d304b2751',
})

function Search(props) {
    const accessToken = useAuth(props.token)
    const [search, setSearch] = useState("")
    const [searchResults, setSearchResults] = useState([]);
    const [playingTrack, setPlayingTrack] = useState();

    function chooseTrack(track) {
        setPlayingTrack(track);
        setSearch('')
    }

    useEffect(() => {
        if (!accessToken) return
        spotifyWebApi.setAccessToken(accessToken)
    }, [accessToken])

    useEffect(() => {
        if (!search) return setSearchResults([]);
        if (!accessToken) return

        let cancel = false;
        spotifyWebApi.searchTracks(search).then(res => {
            if (cancel) return;
            setSearchResults(res.body.tracks.items.map(track => {
                const smallestAlbumImage = track.album.images.reduce((smallest, image) => {
                    if (image.height < smallest.height) return image
                    return smallest
                }, track.album.images[0])

                return {
                    artist: track.artists[0].name,
                    title: track.name,
                    uri: track.uri,
                    albumUrl: smallestAlbumImage.url
                }
            }))
        })

        return () => (cancel = true)
    }, [search, accessToken])

    // Render Pages
    const [currentPage, setCurrentPage] = useState('')
    switch (currentPage) {
        case 'Home':
            return <Dashboard />
        case 'Library':
            return <Library />
        case 'Search':
            return <Search />
    }
    return (
        <div className="background">
            <h1 className="textSearch">Search</h1>
            <input type="text" className="searchMusic" placeholder="Artists, song or podcast" onChange={e => setSearch(e.target.value)} />
            <svg className="searchIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g class="nc-icon-wrapper" stroke-width="1" fill="none" stroke="#ffffff" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="7.5" r="6"></circle> <line x1="15.5" y1="15.5" x2="11.742" y2="11.742"></line> </g></svg>

            <div className="musics">
                {searchResults.map(track => (
                    <TrackSearchResult
                        track={track}
                        key={track.uri}
                        chooseTrack={chooseTrack}
                    />
                ))}
            </div>

    
            <div className="navigationBar"></div>

            <svg className="homeIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g class="nc-icon-wrapper" fill="#ffffff"><path d="M23.633,10.226l-11-9a1,1,0,0,0-1.266,0L5,6.435V4.5A.5.5,0,0,0,4.5,4h-1a.5.5,0,0,0-.5.5V8.071L.367,10.226a1,1,0,0,0,1.266,1.548L3,10.656V22a1,1,0,0,0,1,1h6V18.5a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5V23h6a1,1,0,0,0,1-1V10.656l1.367,1.118a1,1,0,0,0,1.29-1.529ZM13.5,14h-3a.5.5,0,0,1-.5-.5v-3a.5.5,0,0,1,.5-.5h3a.5.5,0,0,1,.5.5v3A.5.5,0,0,1,13.5,14Z" fill="#ffffff"></path></g></svg>
            <h1 className="homeNavigation" onClick={(e) => setCurrentPage('Home')}>Home</h1>

            <h1 className="searchNavigation" onClick={(e) => setCurrentPage('Search')}>Search</h1>
            <svg className="SearchIcon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><g class="nc-icon-wrapper" stroke-width="1" fill="none" stroke="#ffffff" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"><circle cx="7.5" cy="7.5" r="6"></circle> <line x1="15.5" y1="15.5" x2="11.742" y2="11.742"></line> </g></svg>


            <h1 className="libraryNavigation" onClick={(e) => setCurrentPage('Library')}>Library</h1>
            <svg className="libraryIcon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><g fill="none" class="nc-icon-wrapper"><path d="M12 11.55C9.64 9.35 6.48 8 3 8v11c3.48 0 6.64 1.35 9 3.55 2.36-2.19 5.52-3.55 9-3.55V8c-3.48 0-6.64 1.35-9 3.55zM12 8c1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3 1.34 3 3 3z" fill="#ffffff"></path></g></svg> 

            <div><Player accessToken={accessToken} trackUri={playingTrack?.uri}/></div>
        </div>
    )
}

export default Search
