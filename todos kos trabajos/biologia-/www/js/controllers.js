angular.module('starter.controllers', [])



.controller('DashCtrl', function($scope) {})



.controller('ChatsCtrl', function($scope, Chats) {

    var canvas = document.getElementById('canvas');

var ctx = canvas.getContext("2d");

// canvas.height = canvas.width = size = 512;

canvas.width = window.innerWidth;

canvas.height = window.innerHeight;

canvas.style.cssText = "width:"+ canvas.width +"px,height:"+ canvas.height +"px"; 

var targets = [];

var R = canvas.width/20;

var ii = 10;

var r = R/ii/5*3;

var deg = Math.PI/(ii*2);

var rotate_speed = deg/15;

var distance = r*4;

var lineWidth = 1;

var num = Math.floor(canvas.height/distance*0.7);

var offsetX = canvas.width/2;

var offsetY = canvas.height/2 - num*distance/2;

var color = "#2ae";



for(var i=0; i<num; i++){

    targets.push(deg*i);

    targets.push(i*distance);

}



function reset(){

    canvas.width = window.innerWidth;

    canvas.height = window.innerHeight;

    canvas.style.cssText = "width:"+ canvas.width +"px,height:"+ canvas.height +"px"; 

    targets = [];

    R = canvas.width/60;

    r = R/ii/4*3;

    distance = r*4;

    num = Math.floor(canvas.height/distance*0.7);

    offsetX = canvas.width/2;

    offsetY = canvas.height/2 - num*distance/2;

    

    for(var i=0; i<num; i++){

        targets.push(deg*i);

        targets.push(i*distance);

    }

}



function transformPos(deg){

    var x = Math.sin(deg) * R;

    // var y = Math.cos(deg) * r +r;

    return { x: x }

}



function draw(){

    ctx.beginPath();

    ctx.lineWidth = lineWidth;

    ctx.strokeStyle = color;

    ctx.fillStyle = color;

    for (var i = 0; i<targets.length; i+=2) {

        var pos = transformPos( targets[i] );

        var y = offsetY + targets[i+1];

        ctx.moveTo( pos.x + offsetX, y);

        ctx.lineTo(-pos.x + offsetX, y);

        ctx.moveTo( pos.x + offsetX, y);

        ctx.arc(    pos.x + offsetX, y, r, 0, Math.PI*2);

        ctx.moveTo(-pos.x + offsetX, y)

        ctx.arc(   -pos.x + offsetX, y, r, 0, Math.PI*2);

    }

    ctx.stroke();

    ctx.fill();

    ctx.closePath()

}



function cleanUp(){

    ctx.clearRect(0,0,canvas.width,canvas.height);

}



function update(){

    for(var i=0; i<targets.length; i+=2){

        targets[i] += rotate_speed;

        if( targets[i] >= Math.PI) { targets[i] -= Math.PI; }

    }

}



window.addEventListener("resize",reset);



function Animat(){

    cleanUp();

    draw();

    update();

    setTimeout(Animat,1000/60);

}

Animat();

})



.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {

  $scope.chat = Chats.get($stateParams.chatId);

})



.controller('AccountCtrl', function($scope) {

  $scope.settings = {

    enableFriends: true

  };

})

//---------------------------------------juego---------------------------------------//

.controller('JuegoCtrl', function($scope) {



    // - - - - VARIABLES - - - -



    let cards = Array.from(document.getElementsByClassName("card"));

    let openCards = [];

    let card1;

    let card2;



    // counter variables

    let moveCounter = 0;

    let matchedCards = 0;

    let cardClick = 0;

    let starCounter = 3;

    let secCounter = 0;

    let minCounter = 0;

    let timing;



    // js DOM elements

    let won;

    let pauseScreen;



    // - - - - CARDS  - - - -



    addCards();



    // add shuffled cards to page

    function addCards() {

        cards = shuffle(cards);

        const deck = document.querySelector('.deck');

        deck.style.display === "none";

        for (let card in cards) {

            deck.appendChild(cards[card]);

        }

        deck.style.display === "flex";

    }



    // shuffle function

    function shuffle(array) {

        let currentIndex = array.length, temporaryValue, randomIndex;

        while (currentIndex !== 0) {

            randomIndex = Math.floor(Math.random() * currentIndex);

            currentIndex -= 1;

            temporaryValue = array[currentIndex];

            array[currentIndex] = array[randomIndex];

            array[randomIndex] = temporaryValue;

        }

        return array;

    }

  

    // click on cards triggers cardClicked function

    for (let x in cards) {

        cards[x].onclick = function(event) {

            cardClicked(event);

        };

    }



    // counts clicks on cards, first one starts timer

    // flips open cards

    function cardClicked(event) {

        cardClick++;

        if (cardClick === 1) {

            timer();

        }

        event.target.classList.add("open");

        setTimeout(function(){event.target.classList.add("show");}, 180);

        check(event);

    }



    // - - - - CHECK CARDS AFTER CLICK  - - - -

    

    function check(event) {

        // adds card to openCards array

        openCards.push(event.target.innerHTML.trim());

        if (openCards.length === 1) {

            card1 = event.target;

        }

        // if two cards are open  

        else if (openCards.length === 2) {

            disable(); // disable clicking on another

            counter(); // add a move to move counter

            card2 = event.target;

            // the cards are a match / no match, call relevant function

            if (openCards[0] === openCards[1]) {

                match();

            }

            else {

                noMatch();

            }

            // if over 14 moves, take away a star

            if (moveCounter === 15) {

                starCounter = 2;

                star2();

            }

            // if over 19 moves, take away another star

            else if (moveCounter === 20) {

                starCounter = 1;

                star1();

            }

        }

    }



    // - - - - MATCHING CARDS  - - - -



    function match() {

        openCards.length = 0;



        // add match animation

        card1.classList.add("match");

        card2.classList.add("match");

        card1 = null;

        card2 = null;

        enable(); //enable clicking on other card

        matchedCards++; // count matched pairs



        // if all 8 pairs are found

        if (matchedCards === 8) { 

            // stop timer

            clearInterval(timing);

            // call winner screen

            setTimeout(function() {

                win()

            }, 1000);

        }

    }



    // - - - - NOT MATCHING CARDS  - - - -



    function noMatch() {

        openCards.length = 0;



        // add no match animation

        setTimeout(function(){

            card1.classList.add('unMatch');

            card2.classList.add('unMatch');

            setTimeout(function() {

                card1.classList.remove("unMatch");

                card2.classList.remove("unMatch");

            }, 700);

        }, 800);



        // flip back the cards

        setTimeout(function() {

            card1.classList.remove('open', 'show');

            card2.classList.remove('open', 'show');

            card1 = null;

            card2 = null;

            enable();

        }, 2000);

    }



    // - - - - DISABLE CLICK  - - - -

    // function to disable clicking on other cards when two cards are open

    function disable() {

        for (let x in cards) {

            cards[x].classList.add('disable');

        }

    }



    // - - - - ENABLE CLICK  - - - -



    function enable() {

        for (let x in cards) {

            cards[x].classList.remove('disable');

        }

    }



    // - - - - STAR COUNTER  - - - -



    function star2() { // remove the first star

        let star = document.getElementsByClassName("fa")[2].classList;

        star.replace('fa-star', 'fa-star-o');

    }



    function star1() { // remove the second star

        let star = document.getElementsByClassName("fa")[1].classList;

        star.replace('fa-star', 'fa-star-o');

    }



    // - - - - MOVE COUNTER  - - - -



    function counter() {

        moveCounter++;

        document.querySelector('.moves').textContent = moveCounter;

    }

    

    // - - - - TIMER  - - - -



    function timer() {

        timing = setInterval(function(){

            secCounter++;

            // add leading zero to seconds

            if (String(secCounter).length === 1) {

                secCounter = "0" + secCounter;

            }

            // if seconds reaches 60 reset seconds, increment minutes

            if (secCounter === 60) {

                secCounter = "00";

                document.querySelector('.secCount').textContent = secCounter;

                minCounter++;

                // add leading zero to minutes

                if (String(minCounter).length === 1) {

                    minCounter = "0" + minCounter;

                }

                document.querySelector('.minCount').textContent = minCounter;

            }

            else {

                document.querySelector('.secCount').textContent = secCounter;

            }

        },1000);

    }



    // - - - - RESTART BUTTON  - - - -



    const restartButton = document.querySelector(".restart");

    restartButton.onclick = function() {

        restart();

    };



    // restart function, starts a new game

    function restart() {

        // disable clicking on cards until new game is started

        disable();



        window.removeEventListener('keypress', restart, false);

        

        // reset timer

        clearInterval(timing);

        document.querySelector('.secCount').textContent = "00";

        document.querySelector('.minCount').textContent = "00";



        // reset moves counter

        moveCounter = 0;

        document.querySelector('.moves').textContent = 0;



        // turn back open cards, reshuffle deck

        for (let card in cards) {

            cards[card].classList.remove("open", "show", "match");

        }

        setTimeout(function(){ addCards(); }, 400);



        // reset stars

        let stars = Array.from(document.getElementsByClassName("fa"));

        for (let s in stars) {

            stars[s].classList.replace('fa-star-o', 'fa-star');

        }



        // reset variables

        cardClick = 0;

        card1 = null;

        card2 = null;

        matchedCards = 0;

        starCounter = 3;

        secCounter = 0;

        minCounter = 0;



        // remove won screen if new game initiated from there

        if (won !== undefined) {

            won.style.display === "none";

            won.remove();

        }

        

        // enable clicking again

        enable();

    }



    // - - - - PAUSE BUTTON  - - - -



    



    // - - - - WINNER SCREEN - - - -



    function win() {

        won = document.createElement("DIV");

        won.classList.add("winner");



        // add header

        const wonHeader = document.createElement("H1");

        wonHeader.classList.add("winnerHeader");

        wonHeader.textContent = "Congratulation!";



        // add info about the game

        const wonText = document.createElement("H2");

        wonText.classList.add("winnerText");

        let wonInfo = minCounter === 0 ? 

            "You won with " + moveCounter + " moves in " + secCounter + " sec!" : 

            "You won with " + moveCounter + " moves in " + minCounter + " min " + secCounter + " sec!";

        wonText.textContent = wonInfo;



        // add stars earned

        const wonStar = document.createElement("DIV");

        for (let i = 0; i < starCounter; i++) {

            const wonStarOne = document.createElement("I");

            wonStarOne.classList.add('fa','fa-star','fa-3x','wonStar');

            wonStar.appendChild(wonStarOne);

        } 



        // add new game button

        const newGameButton = document.createElement('DIV');

        newGameButton.classList.add('newGameButton');

        newGameButton.textContent = 'Play again?';



        // add key press comment

        const newGameComment = document.createElement("H3");

        newGameComment.classList.add('newGameComment');

        newGameComment.textContent = 'or press any key';

        

        won.append(wonHeader, wonText, wonStar, newGameButton, newGameComment);



        document.body.appendChild(won);  



        // event listeners for new game button - click or keypress

        newGameButton.onclick = function(){

            restart()

        };

        window.addEventListener('keypress', restart, false);

    }
    });

