# p5VN
A simple visual novel engine coded in p5.js
---------------------------------------------------------------------
How to use:
--------------
Script.txt 
-----------
-contains all of the instructions for the script!

Here's an example script!:

$tag(start)
N: Hello World!
END

This will have the Narrator say the line "Hello World".
If a character named "Bob", has been defined, you can write:

Bob: I'm speaking!

And "Bob" will say the line!

-------------------------------------------------------------------------

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

---------------------------------------------------------------------------

#COMMENTS
------
-Any line starting with # is completely ignored


IN-LINE POSITION UPDATES(&show(POSITION))
----------
-can be added after any line of character dialogue to update their position to a given position (LEFT, RIGHT, CENTER)

Title Screen
-------------
-The title screen path currently must be 'backgrounds/Titlescreen.png' (To be fixed at some point)













