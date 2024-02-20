var playingField     = "",
    selectedSquare   = 0,
    selectedTile     = 0,
    selectedCollumn  = 0,
    selectedRow      = 0,
    complexity       = 0,
    complexitySquare = 0
    candidate        = false;



function adjustFieldFontSize() {
    var field = document.querySelector(".field");
    var candField = document.querySelector(".cand-field");

    var orienter = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;
    var fieldRatio = 0.8;
    var fontRatio = 0.6;
    var newFontSize = orienter * fieldRatio * fontRatio / complexitySquare;

    field.style.fontSize = newFontSize + "px";
    candField.style.fontSize = newFontSize / complexity + "px";
}

function updateSelection() {
    document.querySelectorAll("[tile]").forEach(tileElem => {
        const tile   = parseInt( tileElem               .getAttribute("tile")   );
        const square = parseInt( tileElem.parentElement .getAttribute("square") );

        if (selectedSquare == square && selectedTile == tile) {
            tileElem.className = tileElem.className.includes("fixed") ? "tile-fixed-selected-full" : "tile-selected-full";
            return;
        }

        const collumn   =              (square - 1) % complexity  * complexity   +              (tile - 1) % complexity    +   1;
        const row       =   Math.floor((square - 1) / complexity) * complexity   +   Math.floor((tile - 1) / complexity)   +   1;

        if (selectedCollumn == collumn || selectedRow == row) {
            tileElem.className = tileElem.className.includes("fixed") ? "tile-fixed-selected-half" : "tile-selected-half";
            return;
        }

        tileElem.className = tileElem.className.includes("fixed") ? "tile-fixed" : "tile";
    });
}

function setSelectedTile(value = "0") {
    document.querySelectorAll("[tile]").forEach(tileElem => {
        const tile   = parseInt( tileElem               .getAttribute("tile")   );
        const square = parseInt( tileElem.parentElement .getAttribute("square") );

        if (selectedSquare == square && selectedTile == tile) {
            if (value == "0") {
                tileElem.firstChild.style.opacity = "0";
                hideSelectedCandidates(false);
            } else {
                tileElem.firstChild.textContent = value;
                tileElem.firstChild.style.opacity = "1";
                hideSelectedCandidates(true);
            }
        }
    });
}

function hideSelectedCandidates(value) {
    document.querySelectorAll("[cand-tile]").forEach(tileElem => {
        const tile   = parseInt( tileElem               .getAttribute("cand-tile")   );
        const square = parseInt( tileElem.parentElement .getAttribute("cand-square") );

        if (selectedSquare == square && selectedTile == tile) {
            tileElem.style.opacity = value ? "0" : "1";
        }
    });
}

function switchSelectedCandidates(value) {
    document.querySelectorAll("[cand-tile]").forEach(tileElem => {
        const tile   = parseInt( tileElem               .getAttribute("cand-tile")   );
        const square = parseInt( tileElem.parentElement .getAttribute("cand-square") );

        if (selectedSquare == square && selectedTile == tile) {
            tileElem.querySelectorAll("[cand-cand]").forEach(candElem => {
                const candidate = candElem.getAttribute("cand-cand");
                if (candidate == value) {
                    candElem.style.opacity = (candElem.style.opacity == "0") ? "1" : "0";
                }
            });
        }
    });
}



function genNewField(_complexity) {
    selectedSquare   = 0;
    selectedTile     = 0;
    selectedCollumn  = 0;
    selectedRow      = 0;
    complexity       = _complexity;
    complexitySquare = complexity * complexity;

    var gridTemplate = "repeat(" + complexity + ", " + 100.0 / complexity + "%)";

    var field     = document.querySelector(".field");
    field.innerHTML = "";
    field.style.gridTemplateColumns = gridTemplate;

    var candField = document.querySelector(".cand-field");
    candField.innerHTML = "";
    candField.style.gridTemplateColumns = gridTemplate;

    adjustFieldFontSize();

    var evenComplexity = (complexity % 2 == 0);
    var even = evenComplexity;

    for (var s = 1; s <= complexitySquare; s++) {
        even = !even;
        if (evenComplexity && s % complexity == 1) even = !even;

        var square = document.createElement('div');
        square.className = even ? "square-even" : "square-noteven";
        square.setAttribute("square", s)
        square.style.gridTemplateColumns = gridTemplate;

        var candSquare = document.createElement('div');
        candSquare.setAttribute("cand-square", s);
        candSquare.style.gridTemplateColumns = gridTemplate;

        for (var t = 1; t <= complexitySquare; t++) {
            var tile = document.createElement('div');
            tile.className = "tile";
            tile.setAttribute("tile", t);

            var value = document.createElement('div');
            value.textContent   = "0";
            value.style.opacity = "0";
            tile.appendChild(value);

            var candTile = document.createElement('div');
            candTile.setAttribute("cand-tile", t);
            candTile.style.gridTemplateColumns = gridTemplate;
            candTile.style.opacity = "1";

            for (var c = 1; c <= complexitySquare; c++) {
                var candCand = document.createElement('div');
                candCand.setAttribute("cand-cand", c);
                candCand.style.opacity = "0";
                candCand.textContent = c;

                candTile.appendChild( candCand );
            }

                square.appendChild(     tile );
            candSquare.appendChild( candTile );
        }
            field.appendChild(     square );
        candField.appendChild( candSquare );
    }

    document.querySelectorAll("[tile]").forEach(tileElem => {
        tileElem.addEventListener("click", () => {
            const newTile   = parseInt( tileElem               .getAttribute("tile")   );
            const newSquare = parseInt( tileElem.parentElement .getAttribute("square") );

            if (selectedSquare == newSquare && selectedTile == newTile) return;

            selectedTile   = newTile;
            selectedSquare = newSquare;

            selectedCollumn   =              (selectedSquare - 1) % complexity  * complexity   +              (selectedTile - 1) % complexity    +   1;
            selectedRow       =   Math.floor((selectedSquare - 1) / complexity) * complexity   +   Math.floor((selectedTile - 1) / complexity)   +   1;

            console.log( "collumn:", selectedCollumn, ",   row:",  selectedRow, ",   square:", selectedSquare,  ",   tile:", selectedTile );
            updateSelection();
        });
    });

    document.getElementById("main-buttons").style.display = "initial";
    var numHolder = document.querySelector(".num-holder");
    numHolder.innerHTML = "";
    numHolder.style.gridTemplateColumns = gridTemplate;

    for (var n = 1; n <= complexitySquare; n++) {
        var numButton = document.createElement('button');
        numButton.setAttribute("btn-number", n);
        numButton.textContent = n;
        numHolder.appendChild(numButton);
    }

    document.querySelectorAll("[btn-number]").forEach(numButton => {
        numButton.addEventListener("click", () => {
            const number = numButton.getAttribute("btn-number");
            console.log(number);

            if (candidate) {
                switchSelectedCandidates(number);
            } else {
                setSelectedTile(number);
            }
        });
    });
}



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("main-buttons").style.display = "none";

    document.getElementById( "btn-new-game-2" ).addEventListener("click", () => { genNewField(2) });
    document.getElementById( "btn-new-game-3" ).addEventListener("click", () => { genNewField(3) });
    document.getElementById( "btn-new-game-4" ).addEventListener("click", () => { genNewField(4) });

    document.getElementById( "btn-resize-nums" ).addEventListener("click", () => { adjustFieldFontSize() });
    document.getElementById( "btn-clear"       ).addEventListener("click", () => { setSelectedTile()     });
    document.getElementById( "btn-candidate"   ).addEventListener("click", () => {
        candidate = !candidate;
        var button = document.getElementById("btn-candidate");
        button.className = candidate ? "btn-hold" : "";
    });
});