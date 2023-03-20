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

const sound = document.getElementById("sound");


// DARK MODE
themeSelector.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode-bg");
})

// GET DATA
searchIcon.addEventListener("click", () => {
    let search = searchInput.value;
    let URL = `https://api.dictionaryapi.dev/api/v2/entries/en/${search}`;
    let audioUrl;
    nounSection.remove();
    verbSection.remove();
    // let sectionCont = document.getElementsByClassName("section-container");
    // console.log(sectionCont);
    // for (let i = 0; i < sectionCont.length; i++) {
    //     console.log(sectionCont.length);
    //     sectionCont[i].remove();
    //     console.log(sectionCont[i]);
    // }
    // console.log(sectionCont);

    fetch(URL)
        .then(data => data.json())
        .then(data => {
            // console.log(data);
            // let sectionCont = document.getElementsByClassName("section-container");
            // console.log(sectionCont);
            // for (let i = 0; i < sectionCont.length; i++) {
            //     console.log(sectionCont.length);
            //     console.log(sectionCont[i]);
            //     sectionCont[i].remove();
            // }
            // console.log(sectionCont);

            // Word
            word.innerHTML = data[0].word;

            // Phonetic
            if (data[0].phonetic) {
                phonetic.innerHTML = data[0].phonetic;
            } else {
                phonetic.innerHTML = "";
            }

            // Audio
            data[0].phonetics.forEach(element => {
                if (element.audio != "") {
                    audioUrl = element.audio;
                }
            })
            sound.setAttribute("src", `${audioUrl}`);

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
                    <div class="section-heading">
                      <h4>Synonyms</h4>
                      <span>${element.synonyms[0]}</span>
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
                        meaningExample.innerHTML = `"${item.example}"`;
                    })
                }
            })

            // Source
            source.innerHTML = data[0].sourceUrls[0];
            sourceLink.setAttribute("href", data[0].sourceUrls[0])
        })
});

function playSound() {
    sound.play();
}