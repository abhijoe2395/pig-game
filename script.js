'use strict';

// Selecting elements
const score0Element = document.querySelector('#score--0'); // selecting the id called "score--0"
const score1Element = document.getElementById('score--1'); // alternate way of selecting ID
const currentScore0Element = document.getElementById('current--0'); // score of player 1
const currentScore1Element = document.getElementById('current--1'); // score of player 2
const diceElement = document.querySelector('.dice');
const btnNew = document.querySelector('.btn--new');
const btnRoll = document.querySelector('.btn--roll');
const btnHold = document.querySelector('.btn--hold');
const player0Element = document.querySelector('.player--0'); // selecting player 1
const player1Element = document.querySelector('.player--1'); // selecting player 2
let scores, currentScore, activePlayer, playing, confetti; // initializing variables

// switch player function
const switchPlayer = function () {
  document.getElementById(`current--${activePlayer}`).textContent = 0;
  currentScore = 0;
  activePlayer = activePlayer === 0 ? 1 : 0;
  player0Element.classList.toggle('player--active'); // if player 1 active, toggle/remove active status
  player1Element.classList.toggle('player--active'); // if player 2 inactive, toggle/add active status
};

// reset game to initial state function
const init = function () {
  // Starting conditions
  confetti = document.querySelector('#canvas');
  confetti.classList.add('hidden'); // hiding confetti canvas initially

  scores = [0, 0];
  currentScore = 0;

  activePlayer = 0;
  playing = true; // checks state of the game, if player currently playing or not

  // set scores display to 0
  score0Element.textContent = 0;
  score1Element.textContent = 0;

  // set current scores display to 0
  currentScore0Element.textContent = 0;
  currentScore1Element.textContent = 0;

  // remove winner classes
  player0Element.classList.remove('player--winner');
  player1Element.classList.remove('player--winner');

  // add active class to player 1 (active player 0)
  player0Element.classList.add('player--active');

  // remove active class to player 2 (active player 1)
  player1Element.classList.remove('player--active');

  // remove "Winner! 🏆" tag below all players
  document.querySelector('.winner--0').classList.add('hidden');
  document.querySelector('.winner--1').classList.add('hidden');

  // hide dice element initially
  diceElement.classList.add('hidden');
};

// calling init function
init();

// Rolling dice event handler
btnRoll.addEventListener('click', function () {
  if (playing) {
    // 1. Generating a random dice roll
    const dice = Math.trunc(Math.random() * 6) + 1; // generate a number between 1 and 6
    console.log(dice);

    // 2. Display dice
    diceElement.classList.remove('hidden');
    diceElement.src = `dice-${dice}.png`; // displaying corresponding dice image based on generated random dice roll

    // 3. Check for rolled 1
    if (dice !== 1) {
      // add the dice to the current score
      currentScore += dice;
      document.getElementById(`current--${activePlayer}`).textContent =
        currentScore;
    } else {
      // switch to next player
      switchPlayer();
    }
  }
});

// hold button event handler
btnHold.addEventListener('click', function () {
  if (playing) {
    // 1. Add current score to active player's score
    scores[activePlayer] += currentScore;
    // above code equivalent to: scores[1] = scores[1] + currentScore;
    document.getElementById(`score--${activePlayer}`).textContent =
      scores[activePlayer]; // displaying total score element

    // 2.check if score is already at least 100
    if (scores[activePlayer] >= 100) {
      // if true, finish the game
      playing = false;
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.add('player--winner');
      document
        .querySelector(`.player--${activePlayer}`)
        .classList.remove('player--active');

      // show "winner" tag
      document
        .querySelector(`.winner--${activePlayer}`)
        .classList.remove('hidden');

      // reset current score to 0
      document.getElementById(`current--${activePlayer}`).textContent = 0;

      // hide dice
      diceElement.classList.add('hidden');

      // show active player as winner
      alert(`Player ${activePlayer + 1} Wins!`);

      // show confetti
      confetti.classList.remove('hidden');
      // (https://www.w3schools.com/jsref/met_win_settimeout.asp)
      let timeout;

      function myFunction() {
        timeout = setTimeout(confettiFunction, 5000);
      }

      function confettiFunction() {
        if (confirm('Do you want to start a new game?')) {
          // start new game
          confetti.classList.add('hidden'); // hide confetti
          init();
        } else {
          // Do nothing.
        }
      }
      myFunction();
    } else {
      // Or else switch player
      switchPlayer();
    }
  }
});

btnNew.addEventListener('click', init);

//
// adding "How-To" Modal Window
//
const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
// querySelectorAll is used to select multiple classes with same name for ex: show-modal class has 3 buttons
// these multiple classes are then stored as an array in the variable btnsOpenModal which can be accessed with a for loop

// creating a function 'closeModal' to compy with DRY principles
const closeModal = function () {
  modal.classList.add('hidden'); // adding back the "hidden" class to modal window so that when the window is 'closed' it should get hidden.
  overlay.classList.add('hidden');
};

// function 'openModal
const openModal = function () {
  modal.classList.remove('hidden'); // in index.html modal window is actually hidden. we have to make so that after button is pressed only then modal window displays. In order to do that we have to remove the class "hidden". So we add event listener on button and then write a function that removes "hidden" class from the modal window element in html, thus overlaying/enabling the modal window on button press event.
  overlay.classList.remove('hidden'); // same as removing "hidden" class for modal window.
};

// adding event listener for showing modal window button
for (let i = 0; i < btnsOpenModal.length; i++) {
  btnsOpenModal[i].addEventListener('click', openModal);
}

// adding event listener for closing modal window button
btnCloseModal.addEventListener('click', closeModal);

// adding click event listener for closing modal window if clicked anywhere outside of the window other than the close button i.e. on the overlay
overlay.addEventListener('click', closeModal);

// keyboard events are usually global events, hence event listeners are applied to the entire document
document.addEventListener('keydown', function (e) {
  // here, the parameter "e" will hold the info about which key has been pressed by user in the form of an object
  // since we want to add event handler for "esc" key only, this is necessary or else event will be triggered for any key press
  console.log(e); // for more info on the object see console

  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    // check if modal window is first hidden or not, if not hidden then close it
    closeModal();
  }
});

//
// confetti
// (https://jsfiddle.net/mj3SM/6/)
window.onload = function () {
  //canvas init
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext('2d');

  //canvas dimensions
  var W = window.innerWidth;
  var H = window.innerHeight;
  canvas.width = W;
  canvas.height = H;

  //snowflake particles
  var mp = 200; //max particles
  var particles = [];
  for (var i = 0; i < mp; i++) {
    particles.push({
      x: Math.random() * W, //x-coordinate
      y: Math.random() * H, //y-coordinate
      r: Math.random() * 15 + 1, //radius
      d: Math.random() * mp, //density
      color:
        'rgba(' +
        Math.floor(Math.random() * 255) +
        ', ' +
        Math.floor(Math.random() * 255) +
        ', ' +
        Math.floor(Math.random() * 255) +
        ', 0.8)',
      tilt: Math.floor(Math.random() * 5) - 5,
    });
  }

  //Lets draw the flakes
  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (var i = 0; i < mp; i++) {
      var p = particles[i];
      ctx.beginPath();
      ctx.lineWidth = p.r;
      ctx.strokeStyle = p.color; // Green path
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.tilt + p.r / 2, p.y + p.tilt);
      ctx.stroke(); // Draw it
    }

    update();
  }

  //Function to move the snowflakes
  //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
  var angle = 0;

  function update() {
    angle += 0.01;
    for (var i = 0; i < mp; i++) {
      var p = particles[i];
      //Updating X and Y coordinates
      //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
      //Every particle has its own density which can be used to make the downward movement different for each flake
      //Lets make it more random by adding in the radius
      p.y += Math.cos(angle + p.d) + 1 + p.r / 2;
      p.x += Math.sin(angle) * 2;

      //Sending flakes back from the top when it exits
      //Lets make it a bit more organic and let flakes enter from the left and right also.
      if (p.x > W + 5 || p.x < -5 || p.y > H) {
        if (i % 3 > 0) {
          //66.67% of the flakes
          particles[i] = {
            x: Math.random() * W,
            y: -10,
            r: p.r,
            d: p.d,
            color: p.color,
            tilt: p.tilt,
          };
        } else {
          //If the flake is exitting from the right
          if (Math.sin(angle) > 0) {
            //Enter from the left
            particles[i] = {
              x: -5,
              y: Math.random() * H,
              r: p.r,
              d: p.d,
              color: p.color,
              tilt: p.tilt,
            };
          } else {
            //Enter from the right
            particles[i] = {
              x: W + 5,
              y: Math.random() * H,
              r: p.r,
              d: p.d,
              color: p.color,
              tilt: p.tilt,
            };
          }
        }
      }
    }
  }

  //animation loop
  setInterval(draw, 20);
};
