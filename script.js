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
const sound = document.getElementById("sound");
let searchElements = document.querySelectorAll(".word-search");


// REMOVE ELEMENT FROM DOM
function removeElementsByClass(className) {
  const elements = document.getElementsByClassName(className);
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
}


// DARK MODE
themeSelector.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode-bg");
})


// GET DATA
function getData(searchWord) {

  console.log(searchWord);
  let URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${searchWord}`;
  let audioUrl;
  nounSection.remove();
  verbSection.remove();
  removeElementsByClass("section-container");

  fetch(URL)
    .then(data => data.json())
    .then(data => {

      console.log(data);

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
    })
}

searchIcon.addEventListener("click", function(){

});

function playSound() {
  sound.play();
}