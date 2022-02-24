---
date: "2022-02-24"
title: Anki Export Cards by Tag
---

If you have anki cards of a given tag (e.g. `math`) spread out amongst several decks, you may be interested in exporting them all as a single deck (this was my case as I wanted to share the cards with some friends).  Luckily there's a simple way to do this using filtered decks.


## Steps:

1. Click `Tools > Create Filtered Deck`, give your deck the desired name and use a search phrase like `tag:mytag`.
  * Note: you can use any search string you'd also use in the "Browse" section of Anki.
  * Bump the Limit up to a high number that will include all your cards (I just used 10,000), and I also selected the cards to be ordered by "Order added".  Then click the "build" button.
  * ![Step 1](https://i.imgur.com/A5jzdtt.png)

2. A new deck will show up with your provided name. You can then click the settings icon next to the deck and select "Export".
  * I exported with the following settings (removing scheduling information) so anyone I send the deck to can start reviewing it from the beginning (rather than where I left off with the cards).
  * ![Step 2](https://i.imgur.com/44PqEVS.png)

3. Delete the new deck if desired.  Because this is a "filtered deck" and not a normal deck, it's safe to delete the deck as the original cards will remain in the decks of origin.

## See also:
* [Anki filtered decks documentation](https://docs.ankiweb.net/filtered-decks.html)
