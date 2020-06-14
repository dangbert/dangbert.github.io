---
date: "2020-06-14"
title: How to create Anki flashcards while reading on your Kindle
---

In this video I demonstrate how I create Anki flashcards while reading on my Kindle (using the highlights and notes feature), and how I batch import them into Anki.

I use this primarily for creating vocabularly flashcards from Spanish books on my kindle, but you can use this process for any sort of book or pdf that's flashcard worthy.
{{< youtube 3DoNWYdSNcs >}}

### Steps from video:
[Download code here](https://github.com/dangbert/clippy-kindle/releases/tag/r1.0) (click `Source code "zip"` to download).  We will be using two python programs for this process:

* `clippy.py` which reads a "My Clippings.txt" file from your Kindle (containing your notes/highlights) and converts it into a new file "collection.json".
* `marky.py` reads your "collection.json" file and outputs a markdown file and csv file for every book.  For the purposes of Anki flashcards, we only care about the csv files.

````bash
# extract and run code initially
unzip clippy-kindle-r1.0.zip && cd clippy-kindle-r1.0
# install dependencies
pip3 install --user -r requirements.txt
# plug your kindle into your computer and then run:
./clippy.py "/path/to/your/Kindle/documents/My Clippings.txt"

# run marky on the outputted collection.json to create csv files for each book
#   (for simplicity, type "n" when prompted to define custom settings)
#   but type "y" when asked to save your generated settings file!
./marky.py collection.json output --update-outdate
````
> Note: you can also use a virtual environment to install the pip dependencies if you prefer (see the [README on github](https://github.com/dangbert/clippy-kindle/tree/r1.0#how-to-use))

At this point `marky.py` will have created an `output/` folder in your current directory with a file structure like so (two files for each of your annotated books):
````txt
output/
├── Do Androids Dream of Electric Sheep? by Dick, Philip K..csv
├── Do Androids Dream of Electric Sheep? by Dick, Philip K..md
├── Fahrenheit 451: A Novel by Bradbury, Ray.csv
├── Fahrenheit 451: A Novel by Bradbury, Ray.md
├── Los juegos del hambre by Suzanne Collins.csv
├── Los juegos del hambre by Suzanne Collins.md
````

Now you can edit the `.csv` file of the book(s) with notes/highlights that you want to import into Anki.  Follow the instructions at [4:31 in the video](https://youtu.be/3DoNWYdSNcs?list=PLWIM1-JI0JRlY73DFQMxR-d54EgM_K3MK&t=271) or see [this section in the README](https://github.com/dangbert/clippy-kindle/tree/r1.0#creating-anki-flashcards-from-a-csv-file) to do so.

#### Updating your flashcards regularly:
From now on, whenever you want to update Anki with the latest flashcards from your books, simply plug your Kindle into your computer and run:

* (note: also explained at [7:02 in the video](https://youtu.be/3DoNWYdSNcs?list=PLWIM1-JI0JRlY73DFQMxR-d54EgM_K3MK&t=422))

````bash
./clippy.py "/run/media/dan/Kindle/documents/My Clippings.txt"
./marky.py collection.json output --settings settings.json --update-outdate --latest-csv
````

This will update your `output/` folder, so that the csv files will contain only the latest notes/highlights added to your Kindle since the last time your ran `marky.py`. You can then import these files into Anki as before.

* `--update-outdate` tells `marky.py` to store the timestamp of your latest addition to your notes/highlights of each book in `settings.json`.
* `--latest-csv` tells `marky.py` to output the csv files with only the new highlights/notes made on your kindle (for each book) since the last time `marky.py` was run with `--update-outdate`.  If you omit this flag, your csv files will be populated with all the highlights/notes ever made in that book on your Kindle (including those you might already have imported into Anki).

### Advanced usage:
If you have multiple books you'd like to import as cards into the same Anki deck, it may be tedious to have to edit and import each book's csv file into Anki.  In this case you can create a settings group in your `settings.json` file that will output a group of books as a single csv file.  See [10:10 in the video](https://youtu.be/3DoNWYdSNcs?list=PLWIM1-JI0JRlY73DFQMxR-d54EgM_K3MK&t=610) or [this section of the README](https://github.com/dangbert/clippy-kindle/tree/r1.0#pro-tip-for-creating-flashcards).

> I use this for quickly importing content from all my spanish books into the same Anki deck, and I have a separate settings group for Portugese books as well.


### More information
For more information see [the README on github](https://github.com/dangbert/clippy-kindle/tree/r1.0). You can also run the programs `clippy.py` and `marky.py` without any arguments to see information about how to run them.

````bash
# view help files for each program
./clippy.py
./marky.py
````
