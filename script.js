var playingField     = "",
    selectedSquare   = 0,
    selectedTile     = 0,
    selectedX        = 0,
    selectedY        = 0,
    complexity       = 0,
    complexitySquare = 0,
    tilesAmt         = 0,
    candidate        = false,
    filledTiles      = new Map(),
    fixedTiles       = new Set();

const Direction = {
    Up    : "Up",
    Down  : "Down",
    Left  : "Left",
    Right : "Right",
}



function adjustFieldFontSize() {
    // var styleElem = document.head.ge
    return;

    var field = document.querySelector(".field");
    var candField = document.querySelector(".cand-field");

    var orienter = (window.innerWidth < window.innerHeight) ? window.innerWidth : window.innerHeight;
    var fieldRatio = 0.8;
    var fontRatio = 0.6;
    var newFontSize = orienter * fieldRatio * fontRatio / complexitySquare;

    field.style.fontSize = newFontSize + "px";
    candField.style.fontSize = newFontSize / complexity + "px";
}

function moveSelection(direction) {
    switch (direction) {
        case Direction.Up:
            if (selectedY == "0") { selectedY = complexitySquare; break; }
            if (selectedY == "1") selectedY = complexitySquare;
            else                  selectedY--;
            break;
        case Direction.Down:
            if (selectedY == complexitySquare) selectedY = "1";
            else                               selectedY++;
            break;
        case Direction.Left:
            if (selectedX == "0") { selectedX = complexitySquare; break; }
            if (selectedX == "1") selectedX = complexitySquare;
            else                  selectedX--;
            break;
        case Direction.Right:
            if (selectedX == complexitySquare) selectedX = "1";
            else                               selectedX++;
            break;
        default:
            return;
    }
    updateSelection();
}

function updateSelection() {
    document.querySelectorAll("[tile]").forEach(tileElem => {
        const square = parseInt( tileElem.parentElement .getAttribute("square") );
        const tile   = parseInt( tileElem               .getAttribute("tile")   );
        const x      = parseInt( tileElem               .getAttribute("x")      );
        const y      = parseInt( tileElem               .getAttribute("y")      );
        const cord   = square + "-" + tile;

        if (selectedX == x && selectedY == y) {
            tileElem.className = fixedTiles.has(cord) ? "tile-fixed-selected-full" : "tile-selected-full";
            selectedSquare     = square;
            selectedTile       = tile;
            return;
        }

        if (selectedX == x || selectedY == y) {
            tileElem.className = fixedTiles.has(cord) ? "tile-fixed-selected-half" : "tile-selected-half";
            return;
        }

        tileElem.className = fixedTiles.has(cord) ? "tile-fixed" : "tile";
    });
}

function checkAll() {
    for (let s = 1; s <= complexitySquare; s++) {
        var squareSet = new Set();

        for (let t = 1; t <= complexitySquare; t++) {
            const value = filledTiles.get(s + "-" + t);
            if (squareSet.has(value) || value == "0") return false;
            squareSet.add(value);
        }
    }
    for (let x = 1; x <= complexitySquare; x++) {
        var columnSet = new Set();

        for (let y = 1; y <= complexitySquare; y++) {
            const s   =   Math.floor((y - 1) / complexity) * complexity   +   Math.floor((x - 1) / complexity)   +   1;
            const t   =              (y - 1) % complexity  * complexity   +              (x - 1) % complexity    +   1;

            const value = filledTiles.get(s + "-" + t);
            if (columnSet.has(value) || value == "0") return false;
            columnSet.add(value);
        }
    }
    for (let y = 1; y <= complexitySquare; y++) {
        var rowSet = new Set();

        for (let x = 1; x <= complexitySquare; x++) {
            const s   =   Math.floor((y - 1) / complexity) * complexity   +   Math.floor((x - 1) / complexity)   +   1;
            const t   =              (y - 1) % complexity  * complexity   +              (x - 1) % complexity    +   1;

            const value = filledTiles.get(s + "-" + t);
            if (rowSet.has(value) || value == "0") return false;
            rowSet.add(value);
        }
    }
    return true;
}

function setSelectedTile(value = "0") {
    const selectedCord = selectedSquare + "-" + selectedTile;
    if (value == "0") filledTiles.delete(selectedCord);
    else              filledTiles.set(selectedCord, value);

    document.querySelectorAll("[tile]").forEach(tileElem => {
        const square = parseInt( tileElem.parentElement .getAttribute("square") );
        const tile   = parseInt( tileElem               .getAttribute("tile")   );
        const cord = square + "-" + tile;
        if (fixedTiles.has(cord)) return;

        if (selectedCord == cord) {
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

    if (filledTiles.size == tilesAmt) {
        if (checkAll()) {
            console.log("YOU WIN!!!");
            document.getElementById("popup-win").style.display = "flex";
        } else {
            console.log("Too bad...");
        }
    }
}

function hideSelectedCandidates(value) {
    document.querySelectorAll("[cand-tile]").forEach(tileElem => {
        const square = parseInt( tileElem.parentElement .getAttribute("cand-square") );
        const tile   = parseInt( tileElem               .getAttribute("cand-tile")   );

        if (selectedSquare == square && selectedTile == tile) {
            tileElem.style.opacity = value ? "0" : "1";
        }
    });
}

function switchSelectedCandidates(value) {
    document.querySelectorAll("[cand-tile]").forEach(tileElem => {
        const square = parseInt( tileElem.parentElement .getAttribute("cand-square") );
        const tile   = parseInt( tileElem               .getAttribute("cand-tile")   );
        if (fixedTiles.has(square + "-" + tile)) return;

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
    selectedX        = 0;
    selectedY        = 0;
    complexity       = _complexity;
    complexitySquare = complexity * complexity;
    tilesAmt         = complexitySquare * complexitySquare;
    filledTiles      = new Map();
    fixedTiles       = new Set();

    var root = document.documentElement;
    var ratioField = 0.8;
    var ratioText  = ratioField * 0.6 / complexitySquare;
    root.style.setProperty("--ratio-font-num", ratioText);
    root.style.setProperty("--ratio-font-can", ratioText / complexity);

    var gridTemplate = "repeat(" + complexity + ", " + 100.0 / complexity + "%)";

    var menu = document.querySelector(".menu");
    menu.style.display = "none";

    var game = document.querySelector(".game");
    game.style = "";

    var field = document.querySelector(".field");
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
            const x   =              (s - 1) % complexity  * complexity   +              (t - 1) % complexity    +   1;
            const y   =   Math.floor((s - 1) / complexity) * complexity   +   Math.floor((t - 1) / complexity)   +   1;

            var tile = document.createElement('div');
            tile.className = "tile";
            tile.setAttribute("tile", t);
            tile.setAttribute("x",    x);
            tile.setAttribute("y",    y);

            var value = document.createElement('div');
            value.textContent   = "0";
            value.style.opacity = "0";
            tile.appendChild(value);

            var candTile = document.createElement('div');
            candTile.setAttribute("cand-tile", t);
            candTile.style.gridTemplateColumns = gridTemplate;

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
            const newSquare = parseInt( tileElem.parentElement .getAttribute("square") );
            const newTile   = parseInt( tileElem               .getAttribute("tile")   );

            if (selectedSquare == newSquare && selectedTile == newTile) {
                selectedSquare   = 0;
                selectedTile     = 0;
                selectedX        = 0;
                selectedY        = 0;
                updateSelection();
                return;
            }

            selectedSquare = newSquare;
            selectedTile   = newTile;

            selectedX = parseInt( tileElem.getAttribute("x") );
            selectedY = parseInt( tileElem.getAttribute("y") );

            console.log( "x:", selectedX, ",   y:",  selectedY, ",   square:", selectedSquare,  ",   tile:", selectedTile );
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

            if (candidate) {
                switchSelectedCandidates(number);
            } else {
                setSelectedTile(number);
            }
        });
    });

    fillField();
}

function fillField() {
    if (complexity == 3) {
        filledTiles.set("1-2", "5");
        filledTiles.set("1-3", "1");
        filledTiles.set("1-5", "2");

        filledTiles.set("2-4", "6");
        filledTiles.set("2-8", "1");

        filledTiles.set("3-2", "2");
        filledTiles.set("3-6", "7");
        filledTiles.set("3-7", "8");
        filledTiles.set("3-9", "9");

        filledTiles.set("4-2", "9");
        filledTiles.set("4-7", "4");
        filledTiles.set("4-9", "5");

        filledTiles.set("5-5", "8");
        filledTiles.set("5-8", "7");

        filledTiles.set("6-4", "5");
        filledTiles.set("6-7", "9");

        filledTiles.set("7-1", "7");
        filledTiles.set("7-7", "6");

        filledTiles.set("8-3", "2");
        filledTiles.set("8-5", "4");
        filledTiles.set("8-7", "3");
        filledTiles.set("8-8", "5");

        filledTiles.set("9-7", "1");

        filledTiles.forEach((value, cord) => {
            fixedTiles.add(cord);
        });
    }
    
    document.querySelectorAll("[tile]").forEach(tileElem => {
        const square = parseInt( tileElem.parentElement .getAttribute("square") );
        const tile   = parseInt( tileElem               .getAttribute("tile")   );
        const cord   = square + "-" + tile;

        if (filledTiles.has(cord)) {
            tileElem.firstChild.style.opacity = "1";
            tileElem.firstChild.textContent = filledTiles.get(cord);
        }
        if (fixedTiles.has(cord)) tileElem.className = "tile-fixed";
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

    document.addEventListener("keydown", (event) => {
        if (event.isComposing || event.code === 229) return;

        switch (event.key) {
            case "ArrowUp":
                moveSelection(Direction.Up);
                break;
            case "ArrowDown":
                moveSelection(Direction.Down);
                break;
            case "ArrowLeft":
                moveSelection(Direction.Left);
                break;
            case "ArrowRight":
                moveSelection(Direction.Right);
                break;
        }
    });

    document.getElementById("popup-win").onclick = function() {
        document.getElementById("popup-win").style.display = "none";

        var game = document.querySelector(".game");
        game.style.display = "none";

        var menu = document.querySelector(".menu");
        menu.style = "";
    };
});