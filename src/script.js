import { API_KEY } from './config.js'; //PUT API KEY IN THIS CONFIG FILE.

$(function () {
    let query = "";
    let genreFilter = "";
    let platformFilter = "";
    let scrapedGames = [];
    let scrapedGenres = []
    let scrapedPlatforms = [];
    $.fx.off = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const API_URL = "https://rawg.io/api/";

    //elements
    const statusEl = $("#status-text");
    const gameListEL = $("#game-list");
    const genreFilterEl = $("#genre-filter");
    const platformFilterEl = $("#platform-filter");
    const searchBar = $("#search-bar");

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
        let games = undefined;
        let url = API_URL + "?key=" + API_KEY + "&page_size=40";
        const count = 4; //maybe have this as a setting for user?
        let i = 0;

        try {
            while(i <= count) {
                const response = await fetch(url); //fetches url plus platform and genre filters
                if (!response.ok) {
                    throw new Error(response.status);
                }        

                const search = await response.json();
                const results = search.results;

                //scrapes genres for filtering and puts them into a set, no duplicates
                getGenres(results);
                
                url = search.next;
                i++;
            }
        } catch (error) {
            console.log(error);
        }
        
        scrapedGenres.forEach((genre) => {
            console.log(genre);
        });

        return games;        
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
            query = searchBar.val().trim().toLowerCase();
            console.log(query);
        }

        if(!(platformFilter === "")) { console.log("Platform filter: " + platformFilter); }
        if(!(genreFilter === "" )) { console.log("Genre filter: " + genreFilter); }
        if(platformFilter === "" && genreFilter === "") { console.log("No filters were selected"); }
    });

    platformFilterEl.on("click", ".platform-option", function() {
        //console.log($(this).val());
        platformFilter = "?platform=" + $(this).val().trim().toLowerCase();
    })

    genreFilterEl.on("click", ".genre-option", function () {
        //console.log($(this).val());
        genreFilter = "?category=" + $(this).val().trim().toLowerCase();
    });

    //getGames("");
    //getGenres();
    //getPlatforms();
});