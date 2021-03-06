# p5VN v0.1
A simple visual novel engine coded in p5.js
---------------------------------------------------------------------
Live Demo: https://mlg583.github.io/p5VN/

How to use:
--------------
**Recommended: p5 editor (Chrome or Firefox Users, p5.Sound is broken in Edge?)**

https://editor.p5js.org/supersmexyhentai/sketches/yFlLoRUEm

*Upload images and Edit Script.txt to modify the script of the game! Sign into p5 in order to duplicate the project and save your edits! (p5vn works at 800x600px resolution)*

p5VN must be hosted on a web server to function! For offline editing, please clone/download the repo and access the folder via a local web server.

Those with Python 3 installed can easily do so by running "python -m http.server" in your command line and navegating to "localhost:8000". From there, browse to the file path of the p5vn-main folder.  

Errors in the console reporting missing images are normal! The engine attempts to load 10 images per defined character even if there aren't 10 images. This should not have any effect. If sound glitches occur, please refresh the page.

--------------

**DOCUMENTATION**
--------------

Script.txt 
-----------
-contains all of the instructions for the script!

Here's an example script!:

----------------------------------------------------------------
$tag(start)

N: Hello World!

END

------------------------------------------------------------
This will have the Narrator say the line "Hello World".
If a character named "Bob", has been defined, you can write:

-----------------------

$defineC("Bob", "characters\Bob", color(0,0,0))

$tag(start)

Bob: I'm speaking!

END

------------------
And "Bob" will say the line!



Commands:
-------------------------------------------------------
Commands are lines that begin with the character "$"
Commands let you define and update Characters, change background images, set variables and more!
Here's a list of commands:

$defineC("Character Name","file path", color(r,g,b))
-------
-Defines a new character. Characters can have 10 different images to use use, and will look for them in the specified path. Images must be named "Character Name"##.png or .jpg. Color sets the color of their title when speaking.  


$defineImg(Name, "file path")
---------------------------
-creates an "image" that can be displayed by the $bg command.


$show("Character Name", POSITION)
--------------
-displays a specified character at one of 3 possible positions, LEFT, RIGHT, and CENTER. Character when first displayed always used "Character Name01" as their default image unless specified otherwise. 


$hide("Character Name")
---------
-hides the specified character. Characters retain their last displayed image upon being hidden and will use it when shown again.


$setSprite("Character Name", 1-10)
------------
-Sets the specified character's sprite to the specified sprite image. 


$tag(tagName)
------------
-Creates a tag, that can be jumped to using a jump command


$jump(tagName)
-------------
-Continues to execute the script at the specified tag


$menu("Menu Name", n, "Option 1 text", option1Tag, "Option 2 text", option2Tag .... )
-------------
-Generates a menus with n options. Buttons are specified in top down order. Clicking a button jumps to the specified tag. 


$setVar(variableName, number or bool value)
-------------
-initializes or updates a specified value. Variables can hold numbers or "true" or "false"


$if(variableName, trueTag, falseTag)
------------
-A conditional jump. Jumps to trueTag if variableName is true, falseTag if variableName is false

-----------------------------------------------------------------------------------------------------
Other Features
--------
Here's some other functionality possible.

END
--------
-Marks the end of the script. Don't forget it! (The End text displayed is currently not modifyable by the script.)


#COMMENTS
------
-Any line starting with # is completely ignored


IN-LINE POSITION UPDATES(ie: &show(POSITION))
----------
-can be added after any line of character dialogue to update their position to a given position (LEFT, RIGHT, CENTER)

Title Screen
-------------
-The title screen path must be 'backgrounds/Titlescreen.png'

-----------------------------------------------------------------------------------------------------

TBD: 
--------
Remove hardcoded elements (Font, end text, etc.)

Music Commands (define, stop, play music from the script file)

Fix Scaling


-------------------------------------------------------------

Special Thanks:
------
p5.clickable: https://github.com/Lartu/p5.clickable
p5.scribble.js: https://github.com/generative-light/p5.scribble.js/
