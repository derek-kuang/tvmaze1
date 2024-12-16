let apiURL = 'https://api.tvmaze.com/';




// initialize page after HTML loads
window.onload = function() {
   closeLightBox();  // close the lightbox because it's initially open in the CSS
   document.getElementById("button").onclick = function () {
     searchTvShows();
   };
   document.getElementById("lightbox").onclick = function () {
     closeLightBox();
   };
} // window.onload


// get data from TV Maze
async function searchTvShows() {




   document.getElementById("btns").style.left = "50%";
   document.getElementById("btns").style.top = "25%";
   document.body.style.backgroundImage = "none";
   document.getElementById("title").style.paddingTop = "0px";
   document.getElementById("main").style.backgroundColor = "#F0F0F0";




  document.getElementById("main").innerHTML = "";
 
  let search = document.getElementById("search").value;  
   
  try {  
      const response = await fetch(apiURL + 'search/shows?q=' + search);
      const data = await response.json();
      console.log(data);
      showSearchResults(data);
  } catch(error) {
    console.error('Error fetching tv show:', error);
  } // catch
} // searchTvShows
 





// change the activity displayed
function showSearchResults(data) {
 
  // show each tv show from search results in webpage
  for (let tvshow in data) {
    createTVShow(data[tvshow]);
  } // for




} // updatePage





// in the json, genres is an array of genres associated with the tv show
// this function returns a string of genres formatted as a bulleted list
function showGenres(genres) {
   let output = "<ul>";
   for (g in genres) {
      output += "<li>" + genres[g] + "</li>";
   } // for      
   if(genres[g] == "" || genres[g] == null){
      output = "<span id='output'>No genre available</span>"
   }else{
     output += "</ul>";
   }
   return output;
} // showGenres






// constructs one TV show entry on webpage
function createTVShow (tvshowJSON) {
 
    // get the main div tag
    var elemMain = document.getElementById("main");
   
    // create a number of new html elements to display tv show data
    var elemDiv = document.createElement("div");
    var elemImage = document.createElement("img");
   
    var elemShowTitle = document.createElement("h2");
    elemShowTitle.classList.add("showtitle"); // add a class to apply css
   
    var elemGenre = document.createElement("div");
    elemGenre.classList.add("elemgenre")


    var elemRating = document.createElement("div");
    elemRating.classList.add("rating")


    var elemSummary = document.createElement("div");
   
    // add JSON data to elements
    if(tvshowJSON.show.image == null){

    }else{
      elemImage.src = tvshowJSON.show.image.medium;
    }
    elemShowTitle.innerHTML = tvshowJSON.show.name;
    
    elemGenre.innerHTML = "Genres: " + showGenres(tvshowJSON.show.genres);
    if(tvshowJSON.show.rating.average == null){
      elemRating.innerHTML = "No rating available"
    }else{
    elemRating.innerHTML = "Rating: " + '<span class="ratingnum">' + tvshowJSON.show.rating.average + '</span>';
    }
    elemSummary.innerHTML = tvshowJSON.show.summary;
   
       
    // add 5 elements to the div tag elemDiv
    elemDiv.appendChild(elemShowTitle);  
    elemDiv.appendChild(elemGenre);
    elemDiv.appendChild(elemRating);
    elemDiv.appendChild(elemSummary);
    elemDiv.appendChild(elemImage);
   
    // get id of show and add episode list
    let showId = tvshowJSON.show.id;
    fetchEpisodes(showId, elemDiv);
   
    // add this tv show to main
    elemMain.appendChild(elemDiv);
   
} // createTVShow



// fetch episodes for a given tv show id
async function fetchEpisodes(showId, elemDiv) {
     
  console.log("fetching episodes for showId: " + showId);
 
  try {
     const response = await fetch(apiURL + 'shows/' + showId + '/episodes');  
     const data = await response.json();
     console.log("episodes");
     console.log(data);
     showEpisodes(data, elemDiv);
  } catch(error) {
    console.error('Error fetching episodes:', error);
  } // catch
   
 
} // fetch episodes



// list all episodes for a given showId in an ordered list
// as a link that will open a light box with more info about
// each episode
function showEpisodes (data, elemDiv) {
     
    let elemEpisodes = document.createElement("div");  // creates a new div tag
    let output = "<ol>";
    for (episode in data) {
        output += "<li><a href='javascript:showLightBox(" + data[episode].id  + ")'>" + data[episode].name + "</a></li>";
    }
    output += "</ol>";
    elemEpisodes.innerHTML = output;
    elemDiv.appendChild(elemEpisodes);  // add div tag to page
       
} // showEpisodes




// open lightbox and display episode info
function showLightBox(episodeId){
     document.getElementById("lightbox").style.display = "block";
     
      fetchInfo(episodeId)
     
} // showLightBox



 // close the lightbox
 function closeLightBox(){
     document.getElementById("lightbox").style.display = "none";
 } // closeLightBox



async function fetchInfo(episodeId){
  const response = await fetch(apiURL + 'episodes/' + episodeId);  
  const data = await response.json();
  console.log(data);




  document.getElementById("message").innerHTML = ""
  if(data.summary == null || data.summary == ""){
    var summary = ""
    var summaryBr = "<br>"
  }else{
    var summary = data.summary
    var summaryBr = ""
  }
  console.log(summary)
  let season = data.season
  console.log(season)
  if(data.image == null){
    var imageURL = ""
  }else{
    var imageURL = data.image.medium
  }
 
  console.log(imageURL)
  let name = data.name
  console.log(name)
  let number = data.number
  console.log(number)
  document.getElementById("message").innerHTML += "Episode name: " + name + "<br>"
  document.getElementById("message").innerHTML += summary + summaryBr
  document.getElementById("message").innerHTML += "Season: " + season + "<br> <br>"
  document.getElementById("message").innerHTML += "Episode number: " + number + "<br> <br>"
  document.getElementById("message").innerHTML += '<img src="' + imageURL + '" alt = "">'
 
}
