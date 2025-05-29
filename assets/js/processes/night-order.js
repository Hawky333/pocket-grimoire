import Observer from "../classes/Observer.js";
import NightOrder from "../classes/NightOrder.js";
import {
    empty,
    lookupOne,
    lookupOneCached,
    announceInput,
} from "../utils/elements.js";

const gameObserver = Observer.create("game");
const tokenObserver = Observer.create("token");
const nightOrder = new NightOrder();

gameObserver.on("characters-selected", ({ detail }) => {

    nightOrder.reset();
    nightOrder.setCharacters(detail.characters);
    empty(lookupOneCached("#first-night")).append(nightOrder.drawNightOrder(true));
    empty(lookupOneCached("#other-nights")).append(nightOrder.drawNightOrder(false));

});

// #145 - Show the "First Night" order after clearing the grimoire.
gameObserver.on("clear", () => {
    lookupOneCached(".js--night-order--carousel").scrollLeft = 0;
});

tokenObserver.on("character-add", ({ detail }) => {

    // #131 - check the character isn't from the previous script.
    if (!nightOrder.hasCharacter(detail.character)) {
        return;
    }

    nightOrder.addCharacter(detail.character);

});

tokenObserver.on("character-remove", ({ detail }) => {

    // #131 - check the character isn't from the previous script.
    if (!nightOrder.hasCharacter(detail.character)) {
        return;
    }

    nightOrder.removeCharacter(detail.character);

});

tokenObserver.on("shroud-toggle", ({ detail }) => {

    // #131 - check the character isn't from the previous script.
    if (!nightOrder.hasCharacter(detail.character)) {
        return;
    }

    nightOrder.toggleDead(detail.character, detail.isDead);

});

const showDead = lookupOne("#show-dead");

showDead.addEventListener("change", ({ target }) => {

    const showDead = target.checked;

    nightOrder.setShowDead(showDead);
    gameObserver.trigger("night-order-show-dead", {
        showDead
    });

});

lookupOne("#show-all").addEventListener("change", ({ target }) => {

    const showAll = target.checked;

    nightOrder.setShowNotInPlay(showAll);
    gameObserver.trigger("night-order-show-all", {
        showAll
    });

    // Showing all characters not in play but hiding the dead can seem
    // confusing. This forces "show dead" to be true when showing all, although
    // the user can hide the dead seperately.
    if (showAll && !showDead.checked) {

        showDead.checked = true;
        announceInput(showDead);

    }

});
