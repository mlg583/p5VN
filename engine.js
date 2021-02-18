//VN ENGINE SCRIPT by SmexGames
let inputFile = []
let processedScript = []
let currentIndex = 0
let endText = "-End of Script-"
let characters = []
let images = []
let tags = []
let menus = []
let canAdvance = true
let DEBUG = false
let enableGUI = true
let enableText = true
let state = 0;
let currentBackground
let variables = new Object
let gameStarted = false
let ratio;
let ratioX
let ratioY;

function reset() {
    processedScript = []
    currentIndex = 0
    characters = []
    tags = []
    menus = []

    cl_mouseWasPressed = false;
    cl_lastHovered = null;
    cl_lastClicked = null;
    cl_clickables = [];

    startButton = new Clickable()
    startButton.onOutside = function () { startButton.color = '#FFFFFF80' }
    startButton.onHover = function () { startButton.color = '#FFFFFFC0' }

    startButton.cornerRadius = 10;       //Corner radius of the clickable (float)
    startButton.strokeWeight = 2;        //Stroke width of the clickable (float)
    startButton.stroke = "#000000";      //Border color of the clickable (hex number as a string)
    startButton.text = "";       //Text of the clickable (string)
    startButton.textColor = "#000000";   //Color of the text (hex number as a string)
    startButton.textSize = 12;           //Size of the text (integer)
    startButton.locate(width / 3, .5 * height)
    startButton.width = (width / 3)
    startButton.height = ((height - 50) / 5)

    startButton.onRelease = function () {
        currentIndex = 0
        gameStarted = true
    }

    canAdvance = true
    enableGUI = true
    enableText = true
    state = 0;
    currentBackground
    variables = new Object
    gameStarted = false
    initCharArray()
    processInputFile()
    loadAllCharacters()
}

function preload() {
    inputFile = loadStrings("script.txt")

    font = loadFont("PressStart2P.ttf")
    title = loadImage("backgrounds/Titlescreen.png")
    song = loadSound("song.ogg")
}

function initCharArray() {
    characters = []
    images = []
}

// Walk through the process script and create an array of the characters that were defined
function loadAllCharacters() {
    for (i = 0; i < processedScript.length - 1; i++) {
        if (processedScript[i].type == ElementTypes.DIALOG) {
            if (!isCharacterDefined(processedScript[i].characterName)) {
                var c = new Character(processedScript[i].characterName);
                characters.push(c)
            }
        }
    }
}

function isCharacterDefined(name) {
    for (var char in characters) {
        if (char.name === name) return true
    }
    return false
}

function jump(tagName) {
    var jmpTag = getTagByName(tagName)
    currentIndex = jmpTag[1]
}

const ElementTypes = {
    DIALOG: 1,
    IMAGE: 2,
    COMMAND: 3,
    MENU: 4,
}
Object.freeze(ElementTypes)

const CommandTypes = {
    END: 1,
    SHOW: 2,
    HIDE: 3,
    TAG: 4,
    MENU: 5,
}
Object.freeze(CommandTypes)



class ScriptElement {
    constructor(type, commandType = null) {
        this.type = type
        this.commandType = commandType
    }
}

class Character {
    constructor(name, charColor = 255, path = [], xpos = width / 2, ypos = height / 2,) {
        this.name = name
        this.charColor = charColor
        this.path = path
        this.xpos = xpos
        this.ypos = ypos
        this.lastSprite = 0

        this.sprites = []
        if (path.length) {
            for (let i = 1; i <= 10; i++) {
                var suffix = i.toString().padStart(2, '0')
                loadImage(path + "/" + name + suffix + ".png", img => { if (img != null) this.sprites[i] = img })
            }
        }
        characters.push(this)

        this.currentSprite = 0
    }

    setSprite(i) {
        this.currentSprite = i
    }

    setPos(pos) {
        var quarter = width / 4
        if (pos == "LEFT")
            this.xpos = quarter
        else if (pos == "CENTER")
            this.xpos = quarter * 2
        else
            this.xpos = quarter * 3
    }

    drawSprite() {
        if (this.path.length) {
            if (this.currentSprite != 0 && this.sprites[this.currentSprite] != null) {
                imageMode(CENTER)
                
                  this.sprites[this.currentSprite].resize(this.sprites[this.currentSprite].width * ratioX, this.sprites[this.currentSprite].height * ratioY)
                  
                
                image(this.sprites[this.currentSprite], this.xpos, this.ypos)
            }
        }
    }
}

class MyImage {
    constructor(name, path) {
        this.name = name
        this.path = path
        loadImage(path, img => { this.p5Image = img })
        images.push(this)

        this.currentSprite = 0
    }

    setSprite(i) {
        this.currentSprite = i
    }
}


class CommandTag extends ScriptElement {
    constructor(tagName, lineNumber) {
        super(ElementTypes.COMMAND)
        this.tagName = tagName
        this.lineNumber = lineNumber
        tags.push([tagName, lineNumber])

    }

}

class CommandEnd extends ScriptElement {
    constructor() {
        super(ElementTypes.COMMAND, CommandTypes.END)
    }

    render() {
        text(endText, 40, 460, 540, height - 40)
        

    
    }
}

class CommandBG extends ScriptElement {
    constructor(name) {
        super(ElementTypes.COMMAND)
        this.name = name
        if (this.name != "none") {
            this.myImage = getImageByName(name)
        }
    }

    render() {
        if (this.name == "none") {
            currentBackground = null
        } else {
            currentBackground = this.myImage.p5Image

        }

    }
}


class CommandShow extends ScriptElement {
    constructor(name, pos) {
        super(ElementTypes.COMMAND)
        this.characterName = name
        this.pos = pos
    }

    render() {
        var char = getCharacterByName(this.characterName)
        char.setPos(this.pos)
        if (char.lastSprite == 0) {
            char.setSprite(1)
        } else {
            char.setSprite(char.lastSprite)
            // show the image at the pos

        }
    }
}

class CommandHide extends ScriptElement {
    constructor(name) {
        super(ElementTypes.COMMAND)
        this.characterName = name
    }

    render() {
        var char = getCharacterByName(this.characterName)
        char.setSprite(0)
        // Hide 
    }
}

class CommandJump extends ScriptElement {
    constructor(tagName) {
        super(ElementTypes.COMMAND)
        this.tagName = tagName
    }

    render() {
        jump(this.tagName)
    }
}

class CommandVariable extends ScriptElement {
    constructor(Name, ValueToSet) {
        super(ElementTypes.COMMAND)
        this.name = Name
        this.value = ValueToSet

        variables[Name] = false // at definition time, we can't set the values, only when walking the processed script can we do that
    }

    render() {
        variables[this.name] = this.value
    }
}

class CommandConditional extends ScriptElement {
    constructor(variableName, trueTag, falseTag) {
        super(ElementTypes.COMMAND)
        this.variableName = variableName
        this.trueTag = trueTag
        this.falseTag = falseTag

    }

    render() {
        if (variables[this.variableName] === "true") {
            jump(this.trueTag)
        } else {
            jump(this.falseTag)
        }

    }
}

class CommandSetSprite extends ScriptElement {
    constructor(charName, spriteIndex) {
        super(ElementTypes.COMMAND)
        this.character = getCharacterByName(charName)
        this.spriteIndex = spriteIndex
    }

    render() {
        this.character.setSprite(this.spriteIndex)
        this.character.lastSprite = this.spriteIndex
    }
}


function handleMenuClick(menuName, item) {
    var menu = getMenuByName(menuName)
    menu.handleClick(item)
}

function handleMenuHover(menuName, item) {
    var menu = getMenuByName(menuName)
    menu.handleHover(item)

}

function handleMenuOutside(menuName, item) {
    var menu = getMenuByName(menuName)
    menu.handleOutside(item)
}

class CommandMenu extends ScriptElement {
    constructor(menuName, menuItems) {
        super(ElementTypes.MENU)
        this.menuName = menuName
        this.menuItems = menuItems
        this.everdrawn = false
        this.buttons = []
        menus.push(this)
    }

    handleClick(item) {
        canAdvance = true
        enableGUI = true
        jump(this.menuItems[item][1])
    }

    handleHover(item) {
        push()
        this.buttons[item].color = "#FFFFFFC0"
        pop()
    }

    handleOutside(item) {
        push()
        this.buttons[item].color = "#FFFFFF80"
        pop()
    }

    render() {
        canAdvance = false
        enableGUI = false
        if (!this.everdrawn) {
            for (let i = 0; i < this.menuItems.length; i++) {
                this.buttons.push(new Clickable())
                this.buttons[i].locate(width / 2, height / 2)


                this.buttons[i].cornerRadius = 10;       //Corner radius of the clickable (float)
                this.buttons[i].strokeWeight = 2;        //Stroke width of the clickable (float)
                this.buttons[i].stroke = "#000000";      //Border color of the clickable (hex number as a string)
                this.buttons[i].text = "";       //Text of the clickable (string)
                this.buttons[i].textColor = "#000000";   //Color of the text (hex number as a string)
                this.buttons[i].textSize = 12;           //Size of the text (integer)
                this.buttons[i].textFont = "sans-serif"; //Font of the text (string)
                this.buttons[i].textScaled = false;       //Whether to scale the text with the clickable (boolean)
                this.buttons[i].locate(width / 4, 50 + (((height - 50) / this.menuItems.length) * i))
                this.buttons[i].width = (width / 2)
                this.buttons[i].height = ((height - 50) / this.menuItems.length) * .50
                let menuName = this.menuName
                this.buttons[i].onHover = function () {
                    return handleMenuHover(menuName, i);
                }

                this.buttons[i].onOutside = function () {
                    return handleMenuOutside(menuName, i)
                }


                this.buttons[i].onRelease = function () {
                    return handleMenuClick(menuName, i)
                }
            }
            this.everdrawn = true
        }
        for (let i = 0; i < this.menuItems.length; i++) {
            push()
            this.buttons[i].draw()
            pop()

            push()
            textAlign(CENTER, CENTER)
            textSize(24*ratio)
            text(this.menuItems[i][0], width / 2, 50 + (((height - 50) / this.menuItems.length) * i) + (this.buttons[i].height / 2))
            pop()
        }
    }
}




class Dialog extends ScriptElement {
    constructor(characterName, dialog, command = null) {
        super(ElementTypes.DIALOG)
        this.characterName = characterName
        this.dialog = dialog
        this.command = command
    }

    render() {
        textAlign(LEFT)

        if (this.characterName != "N") {

            textSize(24* ratio)
            var char = getCharacterByName(this.characterName)
            fill(char.charColor)

            text(this.characterName + ":", 20*ratioX, 420*ratioY, width / 2, 460*ratioY)

            if (this.command && this.command.length) {
                if (this.command.includes("LEFT"))
                    char.setPos("LEFT")
                else if (this.command.includes("RIGHT"))
                    char.setPos("RIGHT")
                if (this.command.includes("CENTER"))
                    char.setPos("CENTER")
            }
        }
        textSize(20* ratioY)
        fill(255)
        text(this.dialog, 40*ratioX, 460*ratioY, 740*ratioX, height - 40)
    }
}

const TokenTypes = {
    OpenParen: 1,
    CloseParen: 2,
    Comma: 3,
    Identifier: 4,
    QuotedString: 5,
    ColorDefinition: 6,
    Number: 7,
    Keyword: 8,
    LCR: 9,
    Value: 10,
    TrueOrFalse: 9,
}
Object.freeze(TokenTypes)

const Keywords = {
    Color: "color",
    Left: "LEFT",
    Center: "CENTER",
    Right: "RIGHT",
    True: "true",
    False: "false",
}
Object.freeze(Keywords)

// modified from https://stackoverflow.com/questions/4434076/best-way-to-alphanumeric-check-in-javascript
function isAlphaAt(str, i) {
    var code = str.charCodeAt(i);
    if (!(code > 64 && code < 91) && // upper alpha (A-Z)
        !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false
    }
    return true
}

function isAlphaOrDigitAt(str, i) {
    if (isAlphaAt(str, i) || isDigitAt(str, i))
        return true
}

function isDigitAt(str, i) {
    var code = str.charCodeAt(i);
    if (code > 47 && code < 58) // numeric
    {
        return true
    }
    return false
}

function consumeKeyword(line, i, keyword, prefixLen) {
    var start = i;
    if (keyword == "color") {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.Number, line, i)
        i += res[0]
        var num1 = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        var res = requireTokenAndValue(TokenTypes.Number, line, i)
        i += res[0]
        var num2 = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        res = requireTokenAndValue(TokenTypes.Number, line, i)
        i += res[0]
        var num3 = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)
        return [TokenTypes.ColorDefinition, prefixLen + i - start, color(num1, num2, num3)]
    }
    else if (keyword == "LEFT" || keyword == "RIGHT" || keyword == "CENTER")
        return [TokenTypes.LCR, prefixLen + i - start, keyword]
    else if (keyword == "true" || keyword == "false")
        return [TokenTypes.TrueOrFalse, prefixLen + i - start, keyword]
}

function consumeToken(line, index) {
    var start = index
    while (line[index] == ' ' || line[index != '\t']) {
        index++
    }
    if (line[index] == "(")
        return [TokenTypes.OpenParen, index - start + 1]

    if (line[index] == ")")
        return [TokenTypes.CloseParen, index - start + 1]
    if (line[index] == "\"") {
        var qs = ""
        var count = 1
        while (line[index + count] != "\"") {
            qs += line[index + count]
            count++
        }
        return [TokenTypes.QuotedString, index - start + count + 1, qs]
    }
    if (line[index] == ",")
        return [TokenTypes.Comma, index - start + 1]
    if (isDigitAt(line, index)) {
        var num = parseInt(line[index])
        var count = 1
        while (isDigitAt(line, index + count)) {
            num *= 10;
            num += parseInt(line[index + count])
            count++
        }
        return [TokenTypes.Number, index - start + count, num]
    }
    id = "";
    if (isAlphaAt(line, index)) {
        id += line[index]
        var count = 1
        while (isAlphaOrDigitAt(line, index + count)) {
            id += line[index + count]
            count++
        }

        if (Object.values(Keywords).includes(id)) {
            return consumeKeyword(line, index + count, id, index - start + count)
        }

        return [TokenTypes.Identifier, index - start + count, id]
    }
}

function requireToken(type, line, index) {
    var tokenResult = consumeToken(line, index)
    if (tokenResult[0] == type)
        return tokenResult[1]
    throw "Expected token " + type + " but saw " + tokenResult[0] + " at position " + index + " of line " + line
}

function requireTokenAndValue(type, line, index) {
    var tokenResult = consumeToken(line, index);
    if (tokenResult[0] == type)
        return [tokenResult[1], tokenResult[2]];
    if (type == TokenTypes.Value) {
        // this should except numbers or keywords (true, false)
        if (tokenResult[0] == TokenTypes.Number) {
            return [tokenResult[1], tokenResult[2]];
        }
        if (tokenResult[0] == TokenTypes.TrueOrFalse) {
            return [tokenResult[1], tokenResult[2]];
        }
    }

    throw "Expected token " + type + " but saw " + tokenResult[0] + " at position " + index + " of line " + line;
}

function parseCharacter(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.QuotedString, line, i)
        i += res[0]
        var id = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        res = requireTokenAndValue(TokenTypes.QuotedString, line, i)
        i += res[0]
        var path = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        res = requireTokenAndValue(TokenTypes.ColorDefinition, line, i)
        i += res[0]
        var color = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)

        // the contructor actually places these in an array, as a convenience
        new Character(id, color, path)
    }
}

function parseImage(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.Identifier, line, i)
        i += res[0]
        var id = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        res = requireTokenAndValue(TokenTypes.QuotedString, line, i)
        i += res[0]
        var path = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)

        // the contructor actually places these in an array, as a convenience
        new MyImage(id, path)
    }
}

function parseBG(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.Identifier, line, i)
        i += res[0]
        var id = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)

        processedScript.push(new CommandBG(id))
    }
}

function parseShow(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.QuotedString, line, i)
        i += res[0]
        var id = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        res = requireTokenAndValue(TokenTypes.LCR, line, i)
        i += res[0]
        var pos = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)

        processedScript.push(new CommandShow(id, pos))
    }
}

function parseTag(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.Identifier, line, i)
        i += res[0]
        var id = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)

        new CommandTag(id, processedScript.length)
    }
}


function parseHide(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.QuotedString, line, i)
        i += res[0]
        var id = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)

        processedScript.push(new CommandHide(id))
    }
}

function parseJump(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.Identifier, line, i)
        i += res[0]
        var id = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)

        processedScript.push(new CommandJump(id))
    }
}

function parseMenu(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.QuotedString, line, i)
        i += res[0]
        var menuName = res[1]
        i += requireToken(TokenTypes.Comma, line, i)

        var res = requireTokenAndValue(TokenTypes.Number, line, i)
        i += res[0]
        var menuItems = []
        var paramCount = res[1]
        while (paramCount > 0) {
            var menuItem = []

            i += requireToken(TokenTypes.Comma, line, i)

            var res = requireTokenAndValue(TokenTypes.QuotedString, line, i)
            i += res[0]
            menuItem.push(res[1])

            i += requireToken(TokenTypes.Comma, line, i)

            var res = requireTokenAndValue(TokenTypes.Identifier, line, i)
            i += res[0]
            menuItem.push(res[1])

            menuItems.push(menuItem)
            paramCount--
        }
        i += requireToken(TokenTypes.CloseParen, line, i)

        processedScript.push(new CommandMenu(menuName, menuItems))


    }
}

function parseVariable(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.Identifier, line, i)
        i += res[0]
        var id = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        res = requireTokenAndValue(TokenTypes.Value, line, i)
        i += res[0]
        var val = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)
    }

    processedScript.push(new CommandVariable(id, val))
}

function parseConditional(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.Identifier, line, i)
        i += res[0]
        var variableName = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        res = requireTokenAndValue(TokenTypes.Identifier, line, i)
        i += res[0]
        var trueTag = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        res = requireTokenAndValue(TokenTypes.Identifier, line, i)
        i += res[0]
        var falseTag = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)
    }

    processedScript.push(new CommandConditional(variableName, trueTag, falseTag))
}

function parseSetSprite(line) {
    for (var i = 0; i < line.length; i++) {
        i += requireToken(TokenTypes.OpenParen, line, i)
        var res = requireTokenAndValue(TokenTypes.QuotedString, line, i)
        i += res[0]
        var id = res[1]
        i += requireToken(TokenTypes.Comma, line, i)
        res = requireTokenAndValue(TokenTypes.Number, line, i)
        i += res[0]
        var val = res[1]
        i += requireToken(TokenTypes.CloseParen, line, i)
    }

    processedScript.push(new CommandSetSprite(id, val))
}



//create processedScript which is an array of ScriptElement objects
function processInputFile() {

    for (var line in inputFile) {
        if (inputFile[line].startsWith("#") || inputFile[line].trim().length == 0) {
            // do nothing with comments and empty lines
        }
        else if (inputFile[line].startsWith("$")) {
            if (inputFile[line].startsWith("$defineC")) {
                parseCharacter(inputFile[line].substring(8))
            }
            else if (inputFile[line].startsWith("$defineImg")) {
                parseImage(inputFile[line].substring(10))
            }
            else if (inputFile[line].startsWith("$bg")) {
                parseBG(inputFile[line].substring(3))
            }
            else if (inputFile[line].startsWith("$show")) {
                parseShow(inputFile[line].substring(5))
            }
            else if (inputFile[line].startsWith("$hide")) {
                parseHide(inputFile[line].substring(5))
            }
            else if (inputFile[line].startsWith("$tag")) {
                parseTag(inputFile[line].substring(4))
            }
            else if (inputFile[line].startsWith("$jump")) {
                parseJump(inputFile[line].substring(5))
            }
            else if (inputFile[line].startsWith("$menu")) {
                parseMenu(inputFile[line].substring(5))
            }
            else if (inputFile[line].startsWith("$setVar")) {
                parseVariable(inputFile[line].substring(7))
            }

            else if (inputFile[line].startsWith("$if")) {
                parseConditional(inputFile[line].substring(3))
            }

            else if (inputFile[line].startsWith("$setSprite")) {
                parseSetSprite(inputFile[line].substring(10))
            }

        }
        else {
            // anything left is either an empty line, or a character name followed by dialog
            if (inputFile[line].trim() == "END") {
                processedScript.push(new CommandEnd())
            }
            else {

                let splitRes = split(inputFile[line], ": ")

                if (splitRes[1]) {
                    var cmd = split(splitRes[1], "&")
                    if (!cmd[1])
                        processedScript.push(new Dialog(splitRes[0], splitRes[1]))
                    else
                        processedScript.push(new Dialog(splitRes[0], cmd[0], cmd[1]))
                }
                else if (inputFile[line][0] == "&") {
                }
            }
        }

    }
}

function getPositionInstructions() {
    if (inputFile[currentIndex][1][1]) {
        return
    }
}

function getCharacterByName(nameString) {

    for (i = 0; i <= characters.length; i++) {
        if (characters[i].name === nameString) {
            return characters[i]
        }
    }
    // this should never happen since we preprocess and create all named characters
    return null
}


function getMenuByName(nameString) {

    for (i = 0; i <= menus.length; i++) {
        if (menus[i].menuName === nameString) {
            return menus[i]
        }
    }
    // this should never happen since we preprocess and create all named characters
    return null
}


function getTagByName(nameString) {

    for (i = 0; i <= tags.length; i++) {
        if (tags[i][0] === nameString) {
            return tags[i]
        }
    }
    // this should never happen since we preprocess and create all named characters
    return null
}


function getImageByName(nameString) {

    for (i = 0; i <= images.length; i++) {
        if (images[i].name === nameString) {
            return images[i]
        }
    }
    return null
}


function setup() {
    createCanvas(min(windowWidth,800), min(windowHeight,600));
    ratioY = height/600
    ratioX = width/800
  
    ratio = ratioY;
    
    reset()
	song.playMode('restart')
    song.play()

    scribble = new Scribble();
    scribble.bowing = 0
    scribble.maxOffset = .1
    scribble.roughness = 10;
}

function mouseReleased() {
    if (canAdvance) {
        if (currentIndex + 1 >= processedScript.length) {
            currentIndex = 0
            gameStarted = false
            reset()

        } else {
            currentIndex++

        }

    }
}

function renderGUI() {
    strokeWeight(4*ratio)
    scribble.scribbleFilling([20*ratioX, 20*ratioX, 780*ratioX, 780*ratioX], [450*ratioY, 590*ratioY, 590*ratioY, 450*ratioY], 2, -20)
}

function renderText() {
    fill(255)
    stroke(0)
    strokeWeight(8*ratio)
    textFont(font)
    textAlign(LEFT)

    processedScript[currentIndex].render()

    if (processedScript[currentIndex].type == ElementTypes.COMMAND && processedScript[currentIndex].commandType != CommandTypes.END) {
        mouseReleased()
    }
}

function draw() {
    if (gameStarted) {
        background(220);

        if (currentBackground != null) {
            imageMode(CORNER)
            image(currentBackground, 0, 0, width, height)
        }
        else {
            background(0)
        }

        stroke(150, 150, 255)

        drawAllCharacterSprites()

        if (enableGUI) {
            renderGUI()
        }
        if (enableText) {
            renderText()
        }
        
    }

    else {
       
        push()
        imageMode(CORNER)
        image(title, 0, 0, width, height)
        pop()
        push()
        startButton.draw()
        pop()
        push()
        textAlign(CENTER, CENTER)
        rectMode(CENTER)
        fill(255)
        stroke(0)
        strokeWeight(8*ratio)
        textFont(font)

        textSize(24*ratio)
        text("Start", width / 2, startButton.y + startButton.height / 2)
        pop()
    }

}

function drawAllCharacterSprites() {
    for (var i = 0; i < characters.length; i++) {
        characters[i].drawSprite()
    }

}

function clearAllSprites() {
    for (var i = 0; i < characters.length; i++) {
        characters[i].setSprite(0)
        characters[i].lastSprite = 0
    }
}
  
function windowResized() {
   resizeCanvas(min(windowWidth,800), min(windowHeight,600))
}

