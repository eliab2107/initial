function checagem(id){ //Garantindo as regras
    
    let x = id[0]
    let y = id[1]

    if (matriz_board[x][y] == null && humanosJogam == true && jogo){
        marcar(x, y, 'X')  
        playRobot()    
    }
}


function marcar(x, y, simbolo){
    let elemento
    let novo
    rodada++
    matriz_board[x][y] = simbolo
    id=x+y
    elemento = document.getElementById(id)
    novo = document.createTextNode(simbolo);
    elemento.appendChild(novo);
    testwin(x, y, simbolo); 
    humanosJogam = !humanosJogam
}


function testwin(x, y, simbol){
    let contCol=0
    let contLin=0
    let contVert = 0
    
    if (matriz_board[2][0] == matriz_board[1][1] && matriz_board[1][1] == matriz_board[0][2] && matriz_board[1][1] == simbol){
        fimJogo(simbol) //Vitória na diagonal não principal
    }else{
        for (let i=0; i<3;i++){                    
        if(matriz_board[x][i] == simbol){ 
            contLin++
          
        }if(matriz_board[i][y] == simbol){
            contCol++
                
        }if(matriz_board[i][i] == simbol){
            contVert++
        }     
    }
    if (contCol == 3 || contLin == 3 || contVert == 3){
        fimJogo(simbol)
        jogo = false
    }else if(rodada == 9){
        jogo = false
        fimJogo('D')
    }
    }
    
    
}


function fimJogo(simbol){
    let novo
    if (simbol == 'X'){
        novo = 'VOCÊ VENCEU'
        pontHuman++
    }else if (simbol == 'O'){
        novo = 'VOCÊ PERDEU'
        pontRobot++
    }else{
        novo = 'DEU VELHA'
    }
    document.getElementById('msg-fim-game').innerHTML = novo
    novo = `### HUMANO ${pontHuman} vs ${pontRobot} ROBOT ###`
    document.getElementById('placar-game').innerHTML = novo
}


function checarDiagonais(i,j){
    let diagonal = 0
   
    if(i==j){ //examinar a diagonal principal
        let k = 0
        let l = 0 
        while (k < 3){
            if (matriz_board[l][k] == 'X'){
                diagonal+=2
            }else if (matriz_board[l][k] == 'O'){ 
                diagonal-=2
            }else{
                diagonal--
            }
            l++
            k++
        }
    }else{ //Examinar a diagonal
        let k = 2
        let l = 0
        while (k >= 0){
            if (matriz_board[l][k] == 'X'){
                diagonal+=2
            }else if (matriz_board[l][k] == 'O'){ 
                diagonal-=2
            }else{
                diagonal--
            }
            l++
            k--
        }
    }
    //essa casa esta numa diagonal que representa um risco de vitoria ou derrota iminente 
    if(diagonal < -4) {
        return -9
    }else if(diagonal > 0){
        return 9
    }else{
        return diagonal
    }
}

function lerLinhaColuna(i,j){
    let coluna=0
    let linha=0
    //lendo uma coluna
    for (let k=0;k<3;k++){
        if(matriz_board[k][j]=='O'){ 
            coluna-=2
        }else if(matriz_board[k][j] == 'X'){
            coluna+=2
        }else{
            coluna--
        }
    }
    // lendo uma linha
    for (let l=0;l<3;l++){
        if(matriz_board[i][l] == 'O'){
            linha-=2
        }else if(matriz_board[i][l] == 'X'){
            linha+=2
        }else{
            linha--
        }
    }
    //Há uma vitória ou derrota nessa casa iminente
    if (coluna < -4 || linha < -4){
        return -9
    }else if(coluna > 0 || linha > 0 ){ 
        return 9
    }
    else{
        return linha + coluna
    }
}


function playRobot(){ 
    let fatorD = 0
    let sumfators = 0
    if(matriz_board[1][1] == null && jogo){
        marcar('1','1','O')
    }else if(jogo){
        //para cada espaço ainda não ocupado na matriz será gerado um coeficiente, para encontrar a melhor opção
        for (let i=0;i<3;i++){
            for (let j=0;j<3;j++){
                if(matriz_board[i][j] == null){
                    if(candidatos.length == 0){
                        candidatos.push(i,j,sumfators)
                    }else if(i+j == 2 || i==j){
                        fatorD = checarDiagonais(i,j)
                    }
                    sumfators = lerLinhaColuna(i,j) 
                    if(sumfators == -9 || fatorD == -9){ //vitoria iminente
                        candidatos = [i,j, sumfators] 
                    }else if((sumfators == 9 || fatorD == 9 ) && candidatos[2] != -9){
                        //derrota iminente sem uma vitoria iminente
                        candidatos = [i,j, sumfators]
                    }else if(sumfators < candidatos[2] && candidatos[2] != 9 && fatorD != 9  ) {
                        candidatos = [i,j, sumfators]
                    }
                }
                fatorD = 0 
            }  
        }
    l = candidatos[0]
    k = candidatos[1]
    l = l.toString()
    k = k.toString() 
    marcar(l,k,'O')
    candidatos = [] 
    } 
    
}         

       
 
function jogarNovamente(){
    for (let i=0;i<3;i++){
        for (let j=0; j<3;j++){
            matriz_board[i][j] = null
        }
    }    
    for (let y of document.getElementsByClassName('option')){
        y.innerHTML = ''
    }
    document.getElementById('msg-fim-game').innerHTML = ''
    jogo = true
    rodadas = 0 
    iniciar = 0
    rodada = 0
    if ((pontHuman+pontRobot) % 2 == 0){
        humanosJogam=true
    }else{
        humanosJogam=false
        playRobot()
    }
    
}

var jogo = true
var pontHuman =0
var pontRobot =0
var rodadas = 0 
var candidatos = []
var iniciar = 0
var rodada = 0
var matriz_board = [[null, null, null],
                    [null, null, null],
                    [null, null, null]]
var humanosJogam = true //se vezde for igual a 1 então os humanos jogam        



