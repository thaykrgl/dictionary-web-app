// DOM ELEMENTS
let themeSelector = document.getElementById("theme-selector");
let searchInput = document.getElementById("search-input");
let searchIcon = document.getElementById("search-icon");
let word = document.getElementById("word");
let phonetic = document.getElementById("phonetic");
let source = document.getElementById("source");
let sourceLink = document.getElementById("source-link");
let nounSection = document.getElementById("noun-section");
let verbSection = document.getElementById("verb-section");
let meaningList = document.getElementById("meaning-list");
let audioIcon = document.getElementById("audio-play");
let searchElements = document.querySelectorAll(".word-search");
let mainContent = document.getElementById("main");
let container = document.getElementById("container");
let searchBar = document.getElementById("search-bar");
const sound = document.getElementById("sound");
const themeSound = document.getElementById("themeSound");

// THEME AUDIO



// INPUT VALIDATION
function lettersOnly(input) {
  var regex = /[^a-z ]/gi;
  input.value = input.value.replace(regex, "");
}


// REMOVE ELEMENT FROM DOM
function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}


// DARK MODE / THEME SELECTOR AUDIO
themeSelector.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-bg");
  if (document.body.classList.contains("dark-mode-bg")) {
    themeSound.setAttribute("src", "https://cdn.freesound.org/previews/237/237944_3877322-lq.mp3");
  } else {
    themeSound.setAttribute("src", "https://cdn.freesound.org/previews/440/440499_4629347-lq.mp3");
  }
  themeSound.play();
})


// GET DATA
function getData(searchWord) {

  searchInput.value = searchWord;

  if (searchWord === "") {
    removeElementsByClass("empty-div");
    searchInput.classList.add("input-error-border");
    mainContent.style.display = "none";
    let emptyDiv = document.createElement("div");
    emptyDiv.classList.add("empty-div");
    searchBar.appendChild(emptyDiv);
    emptyDiv.innerHTML = `
    <p>Whoops, can't be empty</p>
          `
    document.querySelector(".dictionary-web-app .container .search-bar .search-icon").style.top = "38%";
    if (document.querySelector(".not-found")) {
      document.querySelector(".not-found").style.display = "none"
    }

  } else {
    searchInput.classList.remove("input-error-border");
    document.querySelector(".dictionary-web-app .container .search-bar .search-icon").style.top = "55%";
    removeElementsByClass("empty-div");
    let URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`;
    let audioUrl;

    fetch(URL)
      .then(data => data.json())
      .then(data => {

        if (data.title == "No Definitions Found") {
          removeElementsByClass("not-found");
          mainContent.style.display = "none";
          let notFoundDiv = document.createElement("div");
          notFoundDiv.classList.add("not-found");
          container.appendChild(notFoundDiv);
          notFoundDiv.innerHTML = `
          <div class="image">
          <img src="/assets/images/not-found.png" alt="">
        </div>
        <h4>No Definitions Found</h4>
        <p>Sorry pal, we couldn't find definitions for the word you were looking for. You can try the search again at
          later time or head to the web instead.</p>
      </div>
          `
        } else {

          removeElementsByClass("not-found");
          mainContent.style.display = "block";
          nounSection.remove();
          verbSection.remove();
          removeElementsByClass("section-container");

          // Word
          word.innerHTML = data[0].word;

          // Phonetic
          if (data[0].phonetic) {
            phonetic.innerHTML = data[0].phonetic;
          } else {
            phonetic.innerHTML = "";
          }

          // Audio
          let isAudio;

          if (data[0].phonetics.length > 0) {
            data[0].phonetics.forEach(element => {
              if (element.audio != "") {
                isAudio = true
                audioUrl = element.audio;
              } else {
                audioIcon.style.display = "none";
              }
            })
            if (isAudio) {
              audioIcon.style.display = "block";
            }
            sound.setAttribute("src", `${audioUrl}`);
          } else {
            audioIcon.style.display = "none";
          }

          // Meanings
          data[0].meanings.forEach(element => {
            if (element.synonyms.length > 0) {

              var node = document.querySelector(".first-row"),
                ele = document.createElement("div");
              ele.setAttribute("class", "section-container");

              ele.innerHTML = `<div class="section">
                      <div class="seperator">
                        <div class="section-name">
                          <span>${element.partOfSpeech}</span>
                        </div>
                        <div class="line"></div>
                      </div>
                      <div class="section-heading">
                        <h4>Meaning</h4>
                      </div>
                      <div class="section-content">
                        <ul id="meaning-list">
  
                        </ul>
                      </div>
                      <div class="section-heading" id="section-heading">
                        <h4>Synonyms</h4>
                      </div>
                    </div>`;
              node.parentNode.insertBefore(ele, node.nextSibling);

              element.definitions.forEach(item => {
                let meaningLi = document.createElement("li");
                document.getElementById("meaning-list").appendChild(meaningLi);
                let meaningSpan = document.createElement("span");
                meaningLi.appendChild(meaningSpan);
                meaningSpan.innerHTML = item.definition;
              });

              element.synonyms.forEach(item => {
                let synonymSpan = document.createElement("span");
                document.getElementById("section-heading").appendChild(synonymSpan);
                synonymSpan.innerHTML = item;
                synonymSpan.setAttribute("onclick", `getData("${item}")`);

              });

            } else {

              var node = document.querySelector(".first-row"),
                ele = document.createElement("div");
              ele.setAttribute("class", "section-container");

              ele.innerHTML = `<div class="section">
                          <div class="seperator">
                            <div class="section-name">
                              <span>${element.partOfSpeech}</span>
                            </div>
                            <div class="line"></div>
                          </div>
                          <div class="section-heading">
                            <h4>Meaning</h4>
                          </div>
                          <div class="section-content">
                            <ul id="meaning-list">
  
                            </ul>
                          </div>
                        </div>`

              node.parentNode.insertBefore(ele, node.nextSibling);

              element.definitions.forEach(item => {
                let meaningLi = document.createElement("li");
                document.getElementById("meaning-list").appendChild(meaningLi);
                let meaningSpan = document.createElement("span");
                meaningLi.appendChild(meaningSpan);
                meaningSpan.innerHTML = item.definition;
                let meaningExample = document.createElement("p");
                meaningLi.appendChild(meaningExample);
                let meaningHTML = item.example ? `"${item.example}"` : "";
                meaningExample.innerHTML = meaningHTML;
              })
            }
          })

          // Source
          source.innerHTML = data[0].sourceUrls[0];
          sourceLink.setAttribute("href", data[0].sourceUrls[0])
        }
      })
  }
}


// SEARCH ICON CLICK EVENT
searchIcon.addEventListener("click", function () {
  let inputValue = document.getElementById("search-input").value;
  getData(inputValue);
});


// SEARCH ENTER EVENT
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    getData(this.value);
  }
});


// AUDIO PLAY FUNCTION
function playSound() {
  sound.play();
}