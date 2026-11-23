import { API_KEY } from './config.js'; //PUT API KEY IN THIS CONFIG FILE.

$(function () {
    let query = "";
    let genreFilter = "";
    let platformFilter = "";
    let gameFound = false;
    console.log(query + " " + genreFilter + " " + platformFilter);
    $.fx.off = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const API_URL = "https://rawg.io/api/games?";

    //elements
    const statusEl = $("#status-text");
    const gameListEL = $("#game-list");
    const genreFilterEl = $("#genre-filter");
    const platformFilterEl = $("#platform-filter");
    const searchBar = $("#search-bar");

    searchBar.val("");
    genreFilterEl.val("");
    platformFilterEl.val("");

    async function displayGames() {
        //apply game elements based on results from search, gets the games, then creates elements based off of each game
        
    }

    function createElementForGrid() {
        //create one game element
    }

    //gets all platforms available from the API to put as options for platforms to hard code in later
    async function getPlatforms() {
        try {
            const response = await fetch(API_URL + "platforms?key=" + API_KEY);
            if(!response.ok) { throw new Error(response.status); }

            const data = await response.json();
            const results = data.results;

            results.forEach((platform) => {
                console.log(platform.name);
            });
        } catch (error) {
            console.error(error.message);
        }  
    }
    //gets all genres available from the API to put as options to hard code in later
    async function getGenres() {
        try {
            const response = await fetch(API_URL + "genres?key=" + API_KEY);
            if(!response.ok) { throw new Error(response.status); }

            const data = await response.json();
            const results = data.results;

            results.forEach((genre) => {
                console.log(genre.name);
            });

        } catch (error) {
            console.error(error.message);
        }
    }

    async function getGames(query) {
        let games = [];
        let url = "";
        
        //various if statements to update url to fetch
        if(!(query === "")) {
            url = API_URL + "key=" + API_KEY + "&search=" + query + "&page_size=40";
        } 
        
        if (!(platformFilter === "")) {
            url = API_URL + "key=" + API_KEY + "&platforms=" + platformFilter;
        } 

        if(!(genreFilter === "")) {
            url = API_URL + "key=" + API_KEY + "&genres=" + genreFilter;
        }
        
        if (!(query === "") && !(platformFilter === "")) {
            url = API_URL + "key=" + API_KEY + "&platforms=" + platformFilter + "&search=" + query;
        }

        if (!(query === "") && !(genreFilter === "")) {
            url = API_URL + "key=" + API_KEY + "&genres=" + genreFilter + "&search=" + query;
        }
        
        if (!(genreFilter === "") && !(platformFilter === "")) {
            url = API_URL + "key=" + API_KEY + "&platforms=" + platformFilter + "&genres=" + genreFilter;
        }

        if (!url) {
            return;
        }

        console.log("Search URL: " + url);

        try {
            const numPagesToSearch = 3;
            let i = 0;

            while(i < numPagesToSearch) {
                const response = await fetch(url); //fetches url plus platform and genre filters
                
                if (!response.ok) {
                    throw new Error(response);
                }     

                const search = await response.json();
                const results = search.results;

                //filters out games in the search results that don't have a metacritic rating
                for (let i = 0; i < results.length; i++) {
                    if(results[i].metacritic != null) {
                        games.push(results[i]);
                    } 
                }
                
                url = search.next;
                i++;
            }
            
        } catch (error) {
            console.log(error.message);
        }

        console.log(games);
        statusEl.text("Successfully loaded games!");
    }

    $("#filter-btn").on("click", function() {
        console.log($("#filter").val().trim().toLowerCase());
    });

    $("#search-btn").on("click", function() {
        //get filters/and or search term to get query set up for searching
        //console.log($("#search").val().trim().toLowerCase());
        if(searchBar.val() === "") {
            query = "";
            console.log("No query in input box");
        } else {
            query = searchBar.val().trim().toLowerCase().replaceAll(" ", "%");
            console.log(query);
        }

        if(!(platformFilter === "")) { console.log("Platform filter: " + platformFilter); }
        if(!(genreFilter === "" )) { console.log("Genre filter: " + genreFilter); }
        if(platformFilter === "" && genreFilter === "") { console.log("No filters were selected"); }

        statusEl.text("Loading games...");

        genreFilterEl.val("");
        platformFilterEl.val("");

        getGames(query);
        
    });

    platformFilterEl.on("click", ".platform-option", function() {
        //console.log($(this).val());
        platformFilter = $(this).val().trim().toLowerCase().replaceAll(" ", "");
    })

    genreFilterEl.on("click", ".genre-option", function () {
        //console.log($(this).val());
        genreFilter = $(this).val().trim().toLowerCase().replaceAll(" ", "");
    });

    //getGames("");
    //getGenres();
    //getPlatforms();
});