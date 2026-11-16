$(function() { // Makes sure that your function is called once all the DOM elements of the page are ready to be used.

    // Called function to update the name, happiness, and weight of our pet in our HTML
    checkAndUpdatePetInfoInHtml();

    // When each button is clicked, it will "call" function for that button (functions are below)
    $('.treat-button').click(clickedTreatButton);
    $('.play-button').click(clickedPlayButton);
    $('.exercise-button').click(clickedExerciseButton);
    // New button: calls the function for the new Nap behavior
    $('.nap-button').click(clickedNapButton);

  })

    // The pet is an object with a name (string) and weight, happiness and energy (numbers).
    // Energy is the new stat that goes with the new Nap button.
    var pet_info = {name:"Biscuit", weight:20, happiness:50, energy:50};

    function clickedTreatButton() {
      // Increase pet happiness
      pet_info['happiness'] += 5;
      // Increase pet weight
      pet_info['weight'] += 2;
      checkAndUpdatePetInfoInHtml();
      // Pet comment + bounce animation
      showPetMessage(pickOne([
        "Yum! That treat was delicious!",
        "Nom nom nom... can I have another?",
        "Treats are my favorite thing ever! Woof!"
      ]), 'good', 'bounce');
    }

    function clickedPlayButton() {
      // Increase pet happiness
      pet_info['happiness'] += 8;
      // Decrease pet weight
      pet_info['weight'] -= 2;
      // Playing is tiring, so it also costs a little energy
      pet_info['energy'] -= 10;
      checkAndUpdatePetInfoInHtml();
      showPetMessage(pickOne([
        "Woof woof! This is so much fun!",
        "Again, again! Throw it again!",
        "You are the best playmate!"
      ]), 'good', 'bounce');
    }

    function clickedExerciseButton() {
      // Decrease pet happiness
      pet_info['happiness'] -= 5;
      // Decrease pet weight
      pet_info['weight'] -= 3;
      // Exercise is the most tiring action
      pet_info['energy'] -= 15;
      checkAndUpdatePetInfoInHtml();
      showPetMessage(pickOne([
        "Phew... I'm getting a workout!",
        "My legs are tired. Is this over yet?",
        "Okay okay, I'm getting fit!"
      ]), 'bad', 'shake');
    }

    // NEW behavior for the new Nap button: restores energy and adds a little happiness
    function clickedNapButton() {
      pet_info['energy'] += 25;
      pet_info['happiness'] += 2;
      checkAndUpdatePetInfoInHtml();
      showPetMessage(pickOne([
        "Zzz... that was a great nap.",
        "I feel so rested now. Thank you!",
        "Five more minutes... zzz..."
      ]), 'sleepy', 'snooze');
    }

    function checkAndUpdatePetInfoInHtml() {
      checkWeightAndHappinessBeforeUpdating();
      updatePetInfoInHtml();
    }

    function checkWeightAndHappinessBeforeUpdating() {
      // Conditionals so the values can never go below zero
      if (pet_info['weight'] < 0) {
        pet_info['weight'] = 0;
      }
      if (pet_info['happiness'] < 0) {
        pet_info['happiness'] = 0;
      }
      if (pet_info['energy'] < 0) {
        pet_info['energy'] = 0;
      }
      // Energy is out of 100, so it also can't go above 100
      if (pet_info['energy'] > 100) {
        pet_info['energy'] = 100;
      }
    }

    // Updates your HTML with the current values in your pet_info object
    function updatePetInfoInHtml() {
      $('.name').text(pet_info['name']);
      $('.weight').text(pet_info['weight']);
      $('.happiness').text(pet_info['happiness']);
      $('.energy').text(pet_info['energy']);
    }

    // Returns a random item from a list so the pet doesn't repeat itself every click
    function pickOne(list) {
      return list[Math.floor(Math.random() * list.length)];
    }

    // Shows the visual notification (no console.log or alert) and plays the animation.
    // mood = 'good', 'bad' or 'sleepy' (the CSS class that colors the box)
    // animation = 'bounce', 'shake' or 'snooze' (the CSS class that moves the pet image)
    function showPetMessage(comment, mood, animation) {

      // If the pet is in a bad spot, it complains instead of using the normal comment.
      if (pet_info['weight'] === 0) {
        comment = "I'm all skin and bones... feed me a treat!";
      } else if (pet_info['energy'] === 0) {
        comment = "I'm completely out of energy. I need a nap!";
      } else if (pet_info['happiness'] === 0) {
        comment = "I'm so unhappy... please play with me.";
      }

      // jQuery method #1: .html()
      // .html(string) replaces everything inside the selected element with the HTML
      // string we give it. Unlike .text(), which would show the tags as plain text,
      // .html() actually interprets the tags, so here the <strong> makes the pet's name
      // bold and the <em> puts the comment in italics inside the notification box.
      $('#pet-message').html('<strong>' + pet_info['name'] + ' says:</strong> <em>"' + comment + '"</em>');

      // jQuery method #2: .removeClass()
      // .removeClass('a b c') removes those CSS classes from the selected element if it
      // has them. We use it twice:
      //   1) on the message box, to clear the old mood color before adding the new one
      //   2) on the pet image, to remove the last animation class. A CSS animation only
      //      replays when its class is added again, so removing it first lets the same
      //      animation run on back to back clicks.
      $('#pet-message').removeClass('good bad sleepy').addClass(mood);
      $('.pet-image').removeClass('bounce shake snooze');
      $('.pet-image')[0].offsetWidth; // forces the browser to notice the class was removed
      $('.pet-image').addClass(animation);

      playSound(mood);
    }

    // Extra credit: a tiny sound effect made with the browser's built-in Web Audio API,
    // so no sound files are needed. Higher beep = happy, low beep = tired, soft = nap.
    function playSound(mood) {
      try {
        var audioContext = new (window.AudioContext || window.webkitAudioContext)();
        var oscillator = audioContext.createOscillator();
        var gain = audioContext.createGain();
        var pitch = {good: 660, bad: 220, sleepy: 330};
        oscillator.frequency.value = pitch[mood];
        gain.gain.value = 0.08; // keep it quiet
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
      } catch (error) {
        // If the browser blocks audio, just skip the sound
      }
    }