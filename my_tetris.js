const canvas = document.getElementById('game_space');
const context = canvas.getContext('2d');
const grid = 32;
const tetrominoSeq =[];
var score =0;

function updateScore(){
    score +=10;
}

const color ={
    'I': 'cyan',
    'O': 'yellow',
    'T': 'purple',
    'S': 'green',
    'Z': 'red',
    'J': 'blue',
    'L': 'orange'
};

const tetrominos = {
    'I':[
        [0,0,0,0],
        [1,1,1,1],
        [0,0,0,0],
        [0,0,0,0]
    ],
    'J':[
        [1,0,0],
        [1,1,1],
        [0,0,0]
    ],
    'L':[
        [0,0,1],
        [1,1,1],
        [0,0,0]
    ],
    'O':[
        [1,1],
        [1,1]
        
    ],
    'S':[
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    'Z':[
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    'T':[
        [0,1,0],
        [1,1,1],
        [0,0,0]
    ]
};
const playfield = [];

//get random integer btwn min and max
function getRandomNum(min, max){
    min = Math.ceil(min);
    max = Math.floor(max);

    res = Math.floor(Math.random() * (max-min +1)) + min;
    return res
}

//generate new tetromino seq
function genSequence(){
    const sequence = ['I', 'J','L','O','S', 'T', 'Z'];

    while (sequence.length){
        const random = getRandomNum(0, sequence.length -1);
        const name = sequence.splice(random, 1)[0];
        tetrominoSeq.push(name);
    }

}

//get next seq
function getNextTetronimo(){
    if(tetrominoSeq.length ===0){
        genSequence();
    }

 const name = tetrominoSeq.pop();
const matrix = tetrominos[name];

    //I and O start at center
const col = playfield[0].length /2 - Math.ceil(matrix[0].length/2);

const row= name === 'I' ? -1 : -2;
    return {
        name: name,
        matrix: matrix,
        row: row,
        col: col
    };

   

}
//rotate an NxN matrix 90 degrees
function rotate(matrix){
    const len = matrix.length -1;
    const res = matrix.map((row, i) => row.map((val, j) => matrix[len -j][i]));

    return  res;
}

//check if new matrix is valid
function isValidMove(matrix, rowOfCell, colOfCell){
    for(let row =0; row < matrix.length; row++){
        for(let col =0; col <matrix[row].length; col++){
            if(matrix[row][col] &&(
                colOfCell +col<0 || colOfCell + col >= playfield[0].length ||
                rowOfCell + row >= playfield.length || playfield[rowOfCell + row][colOfCell + col])
                ){
                    return false;
                }
        }
    }
    return true;
}

function placeTetro(){
    for(let row =0; row < tetro.matrix.length; row++){
        for(let col = 0; col < tetro.matrix[row].length; col++){
            if(tetro.matrix[row][col]){
                if(tetro.row +row < 0){
                    return gameOver();
                }
                playfield[tetro.row + row][tetro.col +col]= tetro.name;
            }
        
        }
    }

    //check if line clears starting from the bottom
    for(let row = playfield.length -1; row >= 0; ){
        if(playfield[row].every(cell => !!cell)){

            for(let i = row; i >= 0; i--){
                for (let j =0; j<playfield[i].length; j++){
                    playfield[i][j] = playfield[i-1][j];
                 
                }
               
            }
            updateScore();
        }
        else{
            row--;
        }
    }
    tetro =getNextTetronimo();
}


function gameOver(){
    cancelAnimationFrame(aniFrame);
    

    context.fillStyle = 'black';
    context.globalAlpha  = 0.75;
    context.fillText(0, canvas.height / 2-30, canvas.width, 60);

    context.globalAlpha =1;
    context.fillStyle = 'white';
    context.font = '38px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Game Over', canvas.width /2, canvas.height /2);
    gameEnd=true;
}

function pause(){
  
    if(!pauseStatus){ 
    cancelAnimationFrame(aniFrame);
    context.fillStyle = 'black';
    context.globalAlpha  = 0.75;
    // context.fillText(0, canvas.height / 2-30, canvas.width, 60);

     context.globalAlpha =1;
    context.fillStyle = 'white';
    context.font = '38px monospace';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Paused', canvas.width /2, canvas.height /2);
    }
    pauseStatus =true;
}


function play(){
    if(!pauseStatus)
    return;

    
    aniFrame = requestAnimationFrame(runtime);
    if(gameEnd){
        gameEnd=false;
        aniFrame=null;
        runtime();
    }
    pauseStatus = false;

}

//populate empty state
for(let row =-2; row < 20; row++){
    playfield[row]=[];

    for(let col = 0; col < 10; col ++){
        playfield[row][col]=0;
    }
}



let pauseStatus = true;
let gameEnd = false;
let count = 0;
let tetro = getNextTetronimo();
let aniFrame=null;



function runtime(){
    aniFrame = requestAnimationFrame(runtime);
    context.clearRect(0,0,canvas.width,canvas.height);
    document.getElementById('score_count').innerHTML = score;
    if(gameEnd) return;
    if(pauseStatus) return;
    //draw the arena
    for(let row=0; row<20; row++){
        for(let col =0; col<10; col++){
            if(playfield[row][col]){
                const name = playfield[row][col];
                context.fillStyle = color[name];

                context.fillRect(col * grid, row * grid, grid-1, grid-1);
            }
        }
    }

    if(tetro){
        if(++count>35){
            tetro.row++;
            count=0;

            if(!isValidMove(tetro.matrix, tetro.row, tetro.col)){
                tetro.row--;
                placeTetro();
            }

        }

        context.fillStyle = color[tetro.name];

        for(let row=0; row<tetro.matrix.length; row++){
            for(let col=0; col<tetro.matrix[row].length; col++){
                if (tetro.matrix[row][col]){
                    context.fillRect((tetro.col +col) * grid, (tetro.row +row) * grid, grid-1, grid-1);
                }
            }
        }
    }
}

function hardDrop(){
     var row  = tetro.row +1;
   while(isValidMove(tetro.matrix, row, tetro.col)){
        row ++;
   }
    if(!isValidMove(tetro.matrix, row, tetro.col)){
        tetro.row = row -1;

        placeTetro();
        return;
    }

    tetro.row =row;


}

//listen to keyboard
document.addEventListener('keydown', function(e){
   


    //left and right 
    if(e.which ===37 || e.which ===39){
        const column = e.which ===37
        ? tetro.col -1
        : tetro.col +1;

    if(isValidMove(tetro.matrix, tetro.row, column)){
        tetro.col = column;
    }
    }
//up arrow
    if(e.which===38){
        const matrix = rotate(tetro.matrix);
        if(isValidMove(matrix, tetro.row, tetro.col)){
            tetro.matrix = matrix
        }
    }

//down arrow
if(e.which===40){
    const row = tetro.row +1;
    if(!isValidMove(tetro.matrix, row, tetro.col)){
        tetro.row = row -1;

        placeTetro();
        return;
    }

    tetro.row =row;
}
if(e.which===32 && !gameEnd && !pauseStatus )
hardDrop();

//pause
if(e.which===80 && !gameEnd && !pauseStatus)
    pause();

//end game
if(e.which===27)
    gameOver();
});

