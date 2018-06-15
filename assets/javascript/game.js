// Execute this code when the DOM has fully loaded.
$(document).ready(function () {

    // VARIABLE DECLARATION
    // =======================================================================================================

    // Creating an object to hold your characters
    var characters = {
        "Obi-Wan Kenobi": {
            name: "Obi-Wan Kenobi",
            zeroHealth: function (characterName) {
                characters[characterName].health = 0;
                console.log('zeroHealth');
            },
            health: 100,
            attack: 8,
            imageUrl: "assets/images/obiwan.jpg",
            enemyAttackBack: 15
        },
        "Luke Skywalker": {
            name: "Luke Skywalker",
            zeroHealth: function (characterName) {
                characters[characterName].health = 0;
                console.log('zeroHealth');
            },
            health: 100,
            attack: 14,
            imageUrl: "assets/images/lukeskywalker.jpg",
            enemyAttackBack: 5
        },
        "Darth Sidious": {
            name: "Darth Sidious",
            zeroHealth: function (characterName) {
                characters[characterName].health = 0;
                console.log('zeroHealth');
            },
            health: 150,
            attack: 8,
            imageUrl: "assets/images/thechancellor.jpg",
            enemyAttackBack: 5
        },
        "Darth Maul": {
            name: "Darth Maul",
            zeroHealth: function (characterName) {
                characters[characterName].health = 0;
                console.log('zeroHealth');
            },
            health: 180,
            attack: 7,
            imageUrl: "assets/images/darthmaul.jpg",
            enemyAttackBack: 25
        }
    };

    // Will be populated when the character selects the character.
    var currSelectedCharacter;
    // with all the characters the payer didnt select.
    var combatants = [];
    // Will be populated when the player chooses an opponent. 
    var currDefender;
    // Will keep track of turns during combat. Used for calculating player damage.
    var turnCounter = 1;
    // Tracks number of defeated opponents.
    var killCount = 0;


    // FUNCTIONS
    // ========================================================================================================


    console.log(characters);
    // This function will render a character card to the page.
    // The character rendered and the area they are rendered to.

    var renderOne = function (character, renderArea, charStatus) {
        var charDiv = $("<div class='character' data-name='" + character.name + "'>");
        var charName = $("<div class='character-name'>").text(character.name);
        var charImage = $("<img alt='image' class='character-image'>").attr("src", character.imageUrl);
        var charHealth = $("<div class='character-health'>").text(character.health);
        charDiv.append(charName).append(charImage).append(charHealth);
        $(renderArea).append(charDiv);

        // If the character is an enemy or defender (the active opponent), add the appropriate class.
        if (charStatus === "enemy") {
            $(charDiv).addClass("enemy");
        } else if (charStatus === "defender") {
            // populate currDefender with the selected opponent's information.
            currDefender = character;
            $(charDiv).addClass("target-enemy");
        }
    };


    // Function to handle rendering game messages. 
    var renderMessage = function (message) {

        // Builds the message and appends it to the page.
        var gameMessageSet = $("#game-message");
        var newMessage = $("<div>").text(message);
        gameMessageSet.append(newMessage);

        // If we get this specific message passed in, clear the message area.
        if (message === "clearMessage") {
            gameMessageSet.text("");
        }

    };


    // This function handles the rendering of characters based on which area they are to be rendered in.
    var renderCharacters = function (charObj, areaRender) {

        // *characters-section* is the div where all of our characters begin the game.
        // If true, render all characters to the string area.
        if (areaRender === "#characters-section") {
            $(areaRender).empty();
            // We then Loop through the characters object and call the renderOne function on each character to render the card.
            for (var key in charObj) {
                if (charObj.hasOwnProperty(key)) {
                    renderOne(charObj[key], areaRender, "");
                }
            }
        }



        // "selected-character" is the div where our selected character appears.
        // If true, render the selected plater character to this area.
        if (areaRender === "#selected-character") {
            renderOne(charObj, areaRender, "");
        }
        // *available-to-attack* is the div where our "inactive" opponents reside.
        // If true, render the selected character to this area.
        if (areaRender === "#available-to-attack-section") {

            // Loop through the combatants array and call the renderOne function to each character.
            for (var i = 0; i < charObj.length; i++) {
                renderOne(charObj[i], areaRender, "enemy");
            }
            // Creates an on click event for each enemy.
            $(document).on("click", ".enemy", function () {
                var name = ($(this).attr("data-name"));

                // If there is no defender, the clicked enemy will become the defender.
                if ($("#defender").children().length === 0) {
                    renderCharacters(name, "#defender");
                    $(this).hide();
                    renderMessage("clearMessage");
                }
            });
        }

        // "defender" is the div where the active opponent appears.
        // If true, render the selected enemy in this location. 
        if (areaRender === "#defender") {
            $(areaRender).empty();
            for (var i = 0; i < combatants.length; i++) {
                if (combatants[i].name === charObj) {
                    renderOne(combatants[i], areaRender, "defender");
                }
            }
        }
        // Re-render defender when attacked.
        if (areaRender === "playerDamage") {
            $("#defender").empty();
            renderOne(charObj, "#defender", "defender");

        }
        // Re-render player character when attacked.
        if (areaRender === "enemyDamage") {
            $("#selected-character").empty();
            renderOne(charObj, "#selected-character", "");
        }
        // Remove defeated enemy.
        if (areaRender === "enemyDefeated") {
            $("#defender").empty();
            var gameStateMessage = "You have defeated " + charObj.name + ", you can choose to fight another enemy.";
            renderMessage(gameStateMessage);
        }
    };

    // Function which handles restarting the game after victory defeat.
    var restartGame = function (inputEndGame) {

        // When the 'Restart' button is clicked, reload the page.
        var restart = $("<button>Restart</button>").click(function () {
            location.reload();
        });

        // Build div that will display the victory/defeat message. 
        var gameState = $("<div>").text(inputEndGame);

        // Render the restart button and victory/defeat message to the page. 
        $("body").append(gameState);
        $("body").append(restart);

    }

    // ===============================================================================================================================

    // Render all characters to the page when the game starts.
    renderCharacters(characters, "#characters-section");

    // On click event for selecting our character.
    $(document).on("click", ".character", function () {
        // Saving the clicked character's name.
        var name = $(this).attr("data-name");



        // If a player character has not yet been chosen...
        if (!currSelectedCharacter) {
            // We populate currSelectedCharacter with the selected character's information.
            currSelectedCharacter = characters[name];
            // We then loop through the remaining characters and push them to the combatants array.
            for (var key in characters) {
                if (key !== name) {
                    combatants.push(characters[key]);
                }
            }

            console.log(combatants);
            // Hide the character select div.
            $("#characters-section").hide();

            // Then render our selected character and our combatants.
            renderCharacters(currSelectedCharacter, "#selected-character");
            renderCharacters(combatants, "#available-to-attack-section");
        }
    });

    // When you click the attack button, run the following game logic...
    $("#attack-button").on("click", function () {
        if ($("#defender").children().length !== 0) {

            // Creates messages for our attack and our opponents counter attack.
            var attackMessage = "You attacked " + currDefender.name + " for " + (currSelectedCharacter.attack * turnCounter) + " damage.";
            var counterAttackMessage = currDefender.name + " attacked you back for " + currDefender.enemyAttackBack + " damage.";
            renderMessage("clearMessage");

            // Reduce defender's health by your attack value. 
            currDefender.health -= (currSelectedCharacter.attack * turnCounter);

            // If the enemy still had health...
            if (currDefender.health > 0) {

                // Render the enemy's updated character card. 
                renderCharacters(currDefender, "playerDamage");

                // Render the combat messages.
                renderMessage(attackMessage);
                renderMessage(counterAttackMessage);

                // Reduce your health by the opponent's attack value.
                currSelectedCharacter.health -= currDefender.enemyAttackBack;

                // Render the player's updated character card.
                renderCharacters(currSelectedCharacter, "enemyDamage");

                // If you have less than zero health the game ends.
                //We call the restartGame function to allow the user to restart the game.

                if (currSelectedCharacter.health <= 0) {
                    renderMessage("clearMessage");
                    currSelectedCharacter.zeroHealth(currSelectedCharacter.name);
                     // Call the restartGame function to allow the user to restart the game 
                    restartGame("Sorry You have been defeated... GAME OVER!!!");
                    $("#attack-button").unbind("click");
                } 
            }
        }

        // If the enemy has less than zero health they are defeated.
            
        if (currDefender.health <= 0) {
            // Remove your opponent's character card.
            renderMessage("clearMessage");
            // If you have killed all of your opponents you win.
            currDefender.zeroHealth(currDefender.name);
            renderCharacters(currDefender, "enemyDefeated");
            if (killCount >= 3) {
            // Increment your kill count.
                killCount++;
            }
            // Increment your turnCounter. 
            turnCounter++;
        }
    });

});