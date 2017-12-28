var playerList=[];
var playerNames=["White","Black"];
var currPlayer;//num
var currPiece=false;
var board;
var messageSlot;
var again;
var pastMoves;
var undo;
var undoneMoves;
var redo;
var boardimg;
var ChessImages;
var chessPieces;

function preload() {
	boardimg=loadImage("ChessAssets/chessboard.png");
	ChessImages=[[],[]];
	for(var c=0; c<2; c++) {
		for(var p=0; p<6; p++) {
			let piece=loadImage("ChessAssets/chesspieceC"+c+"P"+p+".png");
			ChessImages[c].push(piece);
		}
	}
}

function setup() {
	select("#gamename").html("Chess");
	createCanvas(400,400);
	initializeVars();
	messageSlot=createElement("h1");
	messageSlot.position(20,height+10);
	makeAgainButton();
	makeUndoButton();
	currPlayer=0;
	messageSlot.html(playerNames[currPlayer]+"'s turn");
}

function draw() {
	background(255);
	image(boardimg,0,0,width,height);
	//highlight
	if(currPiece) {
		currPiece.position.highlight(color(255,/*255*/0,0,150),false);
		currPiece.highlightMoves();
	}
	board.printGrid();
}

function mousePressed() {
	let loc=board.findLocation(mouseX,mouseY);
	if(loc) {
		if(loc.player==currPlayer) {
			currPiece=loc.piece;
		} else if(currPiece&&currPiece.canMoveTo(loc)) {
			currPiece.move(loc.row,loc.col);
			currPiece=false;
			switchPlayer();
			playerList[0].updateAllMoves();
			playerList[1].updateAllMoves();
		} else {
			currPiece=false;
		}
	}
}

function switchPlayer() {
	currPlayer=1-currPlayer;
	messageSlot.html(playerNames[currPlayer]+"'s turn");
}

function initializeVars() {
	//rows,cols,boxWidth,boxHeight,canvasWidth,canvasHeight,spacing,statusList,pigment
	board=new Grid(8,8,46,45,width,height,2,color(255));
	playerList.push(new Player(0,-1,board,ChessImages[0]));
	playerList.push(new Player(1,1,board,ChessImages[1]));
	for(var i=0; i<2; i++) {
		playerList[i].initializePieces();
	}
	player=0;
	turns=0;
	winLine=false;
	pastMoves=[];
	undoneMoves=[];
}

function resetGame() {
	messageSlot.html("");
	again.hide();
	background(255);
	initializeVars();
}

function makeUndoButton() {
	undo=createButton("Undo");
	undo.position(425,50);
	undo.mousePressed(undoMove);

	redo=createButton("Redo");
	redo.position(425,80);
	redo.mousePressed(redoMove);
}

function redoMove() {
	if(undoneMoves.length>0&&undoneMoves[undoneMoves.length-1].status==-1) {
		re_move=undoneMoves.pop();
		heights[re_move.col]--;
		pastMoves.push(re_move);
		re_move.status=player;
		switchPlayer();
		turns++;
	}
}

function undoMove() {
	if(!winLine&&turns>0) {
		let lastTurn=pastMoves[pastMoves.length-1];
		undoneMoves.push(lastTurn)
		turns--;
		switchPlayer();
		lastTurn.status=-1;
		heights[lastTurn.col]++;
		pastMoves.splice(pastMoves.length-1,1)
	}
}

function makeAgainButton() {
	again=createButton("Play Again?")
	again.position(150,425);
	again.mousePressed(resetGame);
	again.size(87,50)
	again.style("background-color","rgb(0,0,200)");
	again.style("border","none");
	again.style("color","rgb(0,200,0)");
	again.style("font-size","15px");
	again.hide();
}
