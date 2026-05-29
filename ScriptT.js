let boxes = document.querySelectorAll(".box");
let reset = document.querySelector("#reset");
let newG = document.querySelector("#new");
let msg = document.querySelector("#msg");
let msgcont = document.querySelector("#msgcont");
let turnO = true;
let gameover= false;
let mode = 'pvp';
let ai= document.querySelector("#aimode");
const winpatterns = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8],
]
boxes.forEach((box) => {
    box.addEventListener('click' , function(){
        if(turnO){
            box.innerText = 'X';
            box.style.color = 'brown';
            turnO = false;
            box.disabled = true;
            checkWinner();
            if(mode === 'pvai' && !gameover){
                disabledboxes();
                setTimeout(() => {
                    const move = getBestMove();
                    if (move !== -1){
                        boxes[move].innerText= 'O';
                        boxes[move].style.color= 'black';
                        boxes[move].disabled= true;
                        turnO= true;
                        checkWinner();
                    }
                    boxes.forEach((b) => {
                        if(b.innerText === ''){
                            b.disabled= false;
                        }
                    });
                }, 300);
            }
        }
        else{
            box.innerText = 'O';
            box.style.color= 'black';
            turnO = true;
            box.disabled = true;
            checkWinner();
        }

    });
});
const enableboxes = () => {
    for (let box of boxes){
        box.disabled = false;
        box.innerText= "";
    }    
};
const disabledboxes = () =>{
    for (let box of boxes){
        box.disabled= true;
    }
};
const showWinner = (Winner) => {
    msg.innerText = `Congratulates on winning the silly game ${Winner} player`;
    msgcont.classList.remove('hide');
    gameover= true;
    disabledboxes();
    reset.disabled= false;
    ai.disabled= false;
    newG.disabled= false;
    confetti({
        particleCount: 77,
        spread: 77,
        origin: {y: 0.9},
    });
}
const checkWinner = () => {
    let hasWon = false;
    for(pattern of winpatterns){
        let post0val = boxes[pattern[0]].innerText;
        let post1val = boxes[pattern[1]].innerText;
        let post2val = boxes[pattern[2]].innerText;
        if(post0val !== "" && post1val !== "" && post2val !== "" && post0val == post1val && post1val == post2val){
            boxes[pattern[0]].classList.add('win');
            boxes[pattern[1]].classList.add('win');
            boxes[pattern[2]].classList.add('win');
            showWinner(post1val);
            hasWon= true;
            return;
        }
    }    
    if(!hasWon){
        const allboxes = [...boxes].every((box) => box.innerText !== "");
        if(allboxes){
            msgcont.classList.remove('hide');
            msg.innerText = `It's a draw! Well... that's awkward`;
        }
    }
};
function miniMax(b, isMaximizing, depth){
    for(p of winpatterns){
        if(b[p[0]] && b[p[0]] === b[p[1]] && b[p[1]] === b[p[2]]){
            if(b[p[0]] === 'O'){
                return 10-depth;
            }
            else{
                return depth-10;
            }
        }
    }
    if(b.every(v => v!== '' )){
        return 0;
    }
    if(isMaximizing){
        let best= -Infinity;
        b.forEach((v,i) => {
            if(!v){
                b[i]= 'O';
                best= Math.max(best, miniMax(b, false, depth+1));
                b[i]= '';
            }
        });
        return best;
    }
    else{
        let best= Infinity;
        b.forEach((v,i) => {
            if(!v){
                b[i]= 'X';
                best= Math.min(best, miniMax(b, true, depth+1));
                b[i]= '';
            }
        });
        return best;
    }
}
function getBestMove() {
    const boardStates= [...boxes].map(b => b.innerText);
    let bestVal= -Infinity, bestMove= -1;
    boardStates.forEach((v,i) => {
        if(!v){
            boardStates[i]= 'O';
            const val= miniMax(boardStates, false, 0);
            if(val>bestVal){
                bestVal= val;
                bestMove= i;
            }
        }
    });
    return bestMove;
}
const resetgame = () =>{
    turnO = true;
    gameover= false;
    enableboxes();
    msgcont.classList.add('hide');
    boxes.forEach(box => box.classList.remove('win'));
}
newG.addEventListener('click', () => {
    mode= 'pvp';
    resetgame();
    reset.disabled= true;
    ai.disabled= true;
});
reset.addEventListener('click', () => {
    resetgame();
    ai.disabled= true;
});
ai.addEventListener('click', () => {
    resetgame();
    mode= 'pvai';
    ai.classList.add('active');
    reset.disabled= true;
});
