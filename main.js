const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
    constructor() {
        this._board = this.generateField();
        this._currentCharLoc = this.getCharLoc();
    }

    // * Draw playing board

    print() {
        this._board.forEach(val => console.log(val.join('')));
    }

    // * Move character 

    move(diection) {
        switch(diection) {
            case 'r':
                this._currentCharLoc[1]++;
                break;
            case 'l':
                this._currentCharLoc[1]--;
                break;
            case 'd':
                this._currentCharLoc[0]++;
                break;
            case 'u':
                this._currentCharLoc[0]--;
                break;
        }
        return this.checkNewLocation();
    }

    // * Validate new character location

    checkNewLocation() {
        let x = this._currentCharLoc[1];
        let y = this._currentCharLoc[0];
        if (x < 0 || y < 0 || x > this._board[0].length - 1 || y > this._board.length - 1) {
            console.log('Game Over, You stepped out of bounds!');
            return 1
        }
        switch(this._board[y][x]) {
            case hat:
                console.log('Congratulations You Won!')
                return 1;
            case fieldCharacter:
                this._board[y][x] = pathCharacter;
                return 0;
            case hole:
                console.log('Ooooops You fell in Hole! Try again.');
                return 1;
            case pathCharacter:
                return 0;
        }
    }

    // * Get user input for next move
    static getNextMove() {
        return prompt('Where You want to go? (Left/Right/Up/Down) :');
    }


    // * Generate playing board
    generateField() {
        const height = Number(prompt('Enter height of playing board: '));
        const width = Number(prompt('Enter width of playing board: '));
        const holeChance = prompt('Enter precentage of field to be covered in holes: ');
        
        const holeCount = ((holeChance / 100) * height * width).toFixed(0);

        const field = [...Array(height)].map(() => Array(width).fill(fieldCharacter));
        
        // * add holes
        for(let i = 0; i < holeCount; i++) {
            let holePosition = Field.getFreeLoc(height, width, field);
            field[holePosition[0]][holePosition[1]] = hole;
        }
        
        // * add starting position
        field[Field.rndCord(height)][Field.rndCord(width)] = pathCharacter;
        // * add hat
        field[Field.rndCord(height)][Field.rndCord(width)] = hat;
        return field;
    }


    // * get free field cordinates for placing Path/Hat/Hole

    static getFreeLoc(maxHeight, maxWidth, fieldArr) {
        let yPos = 0;
        let xPos = 0;

        do {
            yPos = Field.rndCord(maxHeight);
            xPos = Field.rndCord(maxWidth);
        } while (fieldArr[yPos][xPos] != fieldCharacter);      
        return [yPos, xPos];
    }
    
    // * generate whole rnd Number

    static rndCord(maxVal) {
        return Math.floor(Math.random() * maxVal);
    }
    

    // * Play the game
    play(){
        let gameState = 0;
        do {
            this.print();
            gameState = this.move(Field.getNextMove());
        } while (gameState === 0);
    }

    // * Find starting positon
    getCharLoc() {
        const yIndex = this._board.findIndex(el => el.includes('*'));
        const xIndex = this._board[yIndex].indexOf('*');
        return [yIndex, xIndex];
    }
}

const myField = new Field();

myField.play();
