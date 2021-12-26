async function initSnakeGame(){
    //make a 17x17 array
    let board = new Board(125)
    let snake = new Snake(3, 8)
    let food = new Food(13, 8)
    
    board.generate(snake, food)
    addKeyListeners(snake, board)
}

class Tile{
    constructor(x, y, contents){
        this.x = x
        this.y = y
        this.contents = contents
    }
}

class Snake{
    constructor(x, y){
        this.x = x
        this.y = y
        this.direction = "right"
        this.length = 3
        
        this.body = [
            [this.x, this.y, this.direction],
            [this.x - 1, this.y, this.direction],
            [this.x - 2, this.y, this.direction]
        ]
    }

    move(){
        for(let i = 0; i < this.body.length; i++){
            let snakeNode = this.body[i]
            switch(snakeNode[2]){
                case "right":
                    snakeNode[0] += 1
                    break
                case "left":
                    snakeNode[0] -= 1
                    break
                case "up":
                    snakeNode[1] -= 1
                    break
                case "down":
                    snakeNode[1] += 1
                    break
            }
        }
    }

    increaseLength(){
        this.length += 1
        switch(this.body[this.body.length - 1][2]){
            case "right":
                this.body.push([this.body[this.body.length - 1][0] - 1, this.body[this.body.length - 1][1], this.body[this.body.length - 1][2]])
                break
            case "left":
                this.body.push([this.body[this.body.length - 1][0] + 1, this.body[this.body.length - 1][1], this.body[this.body.length - 1][2]])
                break
            case "up":
                this.body.push([this.body[this.body.length - 1][0], this.body[this.body.length - 1][1] - 1, this.body[this.body.length - 1][2]])
                break
            case "down":
                this.body.push([this.body[this.body.length - 1][0], this.body[this.body.length - 1][1] + 1, this.body[this.body.length - 1][2]])
                break
        }
    }

    changeDirection(direction){
        if((direction == "right" || direction == "left") && (this.body[0][2] == "left" || this.body[0][2] == "right")) return
        else if((direction == "down" || direction == "up") && (this.body[0][2] == "up" || this.body[0][2] == "down")) return
        this.body[0][2] = direction
    }

    refreshDirection(){
        for(let i = this.body.length-1; i > 0; i--){
            this.body[i][2] = this.body[i - 1][2]
        }
    }
}

class Food{
    constructor(x, y){
        this.x = x
        this.y = y
    }

    eat(){
        this.x = Math.floor(Math.random() * 16)
        this.y = Math.floor(Math.random() * 16)
    }
}

class Board{
    constructor(tickSpeed){
        let gameBoard = new Array(17)
        for(let i = 0; i < 17; i++){
            gameBoard[i] = []
            for(let j = 0; j < 17; j++){
                gameBoard[i][j] = new Tile(i, j, "empty")
            }
        }

        this.gameBoard = gameBoard
        this.tickSpeed = tickSpeed
        this.tick = 0
    }

    
    generate(snake, food){
        this.renderSnake(snake)
        this.renderFood(food)
        let gameBoard = this.gameBoard
        let table = document.getElementById("gameBoard")
        for(let i = 0; i < 17; i++){
            let row = document.createElement("tr")
            for(let j = 0; j < 17; j++){
                let color
                if(gameBoard[i][j].contents == "empty") color = "black"
                else if( gameBoard[i][j].contents == "snake") color = "green"
                else if( gameBoard[i][j].contents == "food") color = "red"

                let cell = document.createElement("td")
                cell.className = i + "," + j
                cell.style.backgroundColor = color
                cell.innerHTML = "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
                row.appendChild(cell)
            }
            table.appendChild(row)
        }

        this.gameBoard = gameBoard
        this.interval = setInterval(() => {
            this.tick++
            
            snake.move()
            this.refresh(snake, food)
            snake.refreshDirection()
        }, this.tickSpeed)
    }

    renderSnake(snake){
        let snakeBody = snake.body
        for(let i = 0; i < snakeBody.length; i++){
            this.gameBoard[snakeBody[i][1]][snakeBody[i][0]].contents = "snake"
        }
    }

    renderFood(food){
        this.gameBoard[food.y][food.x].contents = "food"
    }

    refresh(snake, food){
        this.clear()
        this.renderFood(food)
        
        try{
            this.renderSnake(snake)
        }catch{
            this.lose()
        }

        if(snake.body[0][0] == food.x && snake.body[0][1] == food.y){
            console.log("food eaten")
            snake.increaseLength()
            food.eat()
        }

        for(let i = 0; i < 17; i++){
            for(let j = 0; j < 17; j++){
                let cell = document.getElementsByClassName(i + "," + j)[0]
                if(this.gameBoard[i][j].contents == "empty") cell.style.backgroundColor = "black"
                else if( this.gameBoard[i][j].contents == "snake") cell.style.backgroundColor = "green"
                else if( this.gameBoard[i][j].contents == "food") cell.style.backgroundColor = "red"
            }
        }
    }

    clear(){
        for(let i = 0; i < 17; i++){
            for(let j = 0; j < 17; j++){
                this.gameBoard[i][j].contents = "empty"
            }
        }
    }

    lose(){
        console.log("you lose")
        clearInterval(this.interval)
    }
}


async function addKeyListeners(snake, board){
    let previousBoardTick
    document.addEventListener("keydown", (e) => {
        if(board.tick == previousBoardTick) return
        switch(e.keyCode){
            case 37:
                snake.changeDirection("left")
                previousBoardTick = board.tick
                break
            case 38:
                snake.changeDirection("up")
                previousBoardTick = board.tick
                break
            case 39:
                snake.changeDirection("right")
                previousBoardTick = board.tick
                break
            case 40:
                snake.changeDirection("down")
                previousBoardTick = board.tick
                break
        }
    })
}