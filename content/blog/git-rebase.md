---
date: "2019-07-23"
title: How to Combine Git Commits
---

Suppose you have the following commits in your git log:
````
3a6846f 2019-07-23 Daniel Engbert (HEAD -> master) edited a.txt and b.txt
b98b227 2019-07-23 Daniel Engbert created b.txt
f14e2b4 2019-07-23 Daniel Engbert created a.txt
912bb66 2019-07-23 Daniel Engbert inital commit
````

If you want to combine the 3 latest commits into one commit like this:
````
896afa6 2019-07-23 Daniel Engbert (HEAD -> master) created files a.txt and b.txt
912bb66 2019-07-23 Daniel Engbert inital commit
````

then perform the following:
````bash
git pull # (if applicable)
git rebase HEAD~3 --interactive
#git rebase f14e2b4 --interactive   # alternative (does the same thing)
````

Then edit the file that appears (change the first word in each line from):
````bash
# original file (oldest commit is at top)
pick f14e2b4 created a.txt                                                                               
pick b98b227 created b.txt                                                                          
pick 3a6846f edited a.txt and b.txt 
````

to:
````bash
# edited file:
# (choose "pick" mode for oldest commit, all other set to "squash")
p f14e2b4 created a.txt                                                                               
s b98b227 created b.txt                                                                          
s 3a6846f edited a.txt and b.txt 
````

* Then save the file. A new file will open, replace its contents with whatever message you want for the combined commit and save.  Your selected commits should now be combined into one.
* Note: if an error is reported after saving the first file, your options are:

````bash
# edit the file again to fix the error
git rebase --edit-todo
git rebase --continue

# or abort from the rebase, restoring things to how they were
git rebase --abort
````
