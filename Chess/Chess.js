var socket;

var playerList;
var playerNames=["White","Black"];
var currPlayer;//num
var currPiece=false;
var board;
var messageSlot;
var again;//button
var undo;//button
var redo;//button
var boardimg;
var ChessImages;
var hist;
var undid;
var checkMate;
var highlightOn=true;
var highlightButton;
var deadPieces;
var pause=false;
/*
PUT ALL server stuff IN SERVER.JS NEWCONNECTION METHOD

send msg to server:
have data obj,
socket.emit("name",data);

recevie msg from client:
socket.on("name",function(data){//some code});

send msg from server to client:
socket.broadcast.emit("name",data);
//for sending to all clients: io.sockets.emit("name",data);

recieve msg from server:
in setup: socket.on("name",method);

function method(data) {
	//stuff
}


*/
deadPiece=function(player,value) {
	this.player=player;
	this.value=value;
	deadPieces[this.player].push(this);
	this.display=function(x,y) {
		image(ChessImages[this.player][this.value],x,y,25,25);
	}
	this.revive=function() {
		for(let i=0; i<deadPieces[this.player].length; i++) {
			let deceased=deadPieces[this.player][i];
			if(deceased.equals(this)) {
				deadPieces[this.player].splice(i,1);
				break;
			}
		}
	}
	this.equals=function(other) {
		return /*this.player==other.player&&*/this.value==other.value;//player same in list
	}
}

function displayDead() {
	i=0;
	j=0;
	for(let deadPlayer of deadPieces) {
		for(let deceased of deadPlayer) {
			deceased.display(415+i*35,150+30*j);
			j++;
			if(j==8) {
				j=0;
				i++;
			}
		}
		j=0;
		i=2;
	}
}

function preload() {
	boardimg=loadImage("ChessAssets/board.png");
	//boardimg=loadImage("ChessAssets/chesspieceC0P0.png");
	ChessImages=[[],[]];
	for(var c=0; c<2; c++) {
		for(var p=0; p<6; p++) {
			let piece=loadImage("ChessAssets/chesspiecec"+c+"p"+p+".png");
			ChessImages[c].push(piece);
		}
	}
}

function setup() {
	//socket=io.connect("localhost:3000");
	select("#gamename").html("Chess");
	createCanvas(600,400);
	makeDOM();
	initializeVars();
}

function draw() {
	if(!pause) {
		background(255);
		image(boardimg,0,0,400,400);
		displayDead();
		//highlight
		if(currPiece) {
			currPiece.position.highlight(color(255,/*255*/0,0,150),false);
			if(highlightOn) {
				currPiece.highlightMoves();
			}
		}
		board.printGrid();
	}
}

function mousePressed() {
	let loc=board.findLocation(mouseX,mouseY);
	if(loc&&checkMate==-1&&!pause) {
		if(loc.piece&&loc.piece.player.num==currPlayer) {
			currPiece=loc.piece;
		} else if(currPiece&&currPiece.canMoveTo(loc)) {
			hist.push(currPiece.move(loc));
			currPiece=false;
			updateAll();
			validateAll();
			playerList[1-currPlayer].updateCheck();
			playerList[currPlayer].updateAllMoves();
			switchPlayer();
			playerList[currPlayer].endPassants();
			undid=[];
		} else {
			currPiece=false;
		}
	}
}

function updateAll() {
	playerList[currPlayer].updateAllMoves();//not yet switch player
	playerList[1-currPlayer].updateAllMoves();
}
function validateAll() {
	playerList[1-currPlayer].validate();//not yet switch player
}

function switchPlayer() {
	if(checkMate==-1) {
		currPlayer=1-currPlayer;
		messageSlot.html(playerNames[currPlayer]+"'s turn");
		if(playerList[currPlayer].updateCheck()) {
			messageSlot.html("Check!   "+playerNames[currPlayer]+"'s turn");
		} else if(playerList[currPlayer].getAllMoves().length==0) {
			messageSlot.html("Stale Mate!!");
			checkMate=2;
		}
	}
}

function initializeVars() {
	//rows,cols,boxWidth,boxHeight,canvasWidth,canvasHeight,spacing,statusList,pigment
	board=new Grid(8,8,50,50,400,400,0,color(255));//(8,8,46,45,400,400,2,color(255));
	currPiece=false;
	currPlayer=0;
	hist=[];
	undid=[];
	deadPieces=[[],[]];
 	checkMate=-1;
	playerList=[];
	playerList.push(new Player(0,-1,board,ChessImages[0]));
	playerList.push(new Player(1,1,board,ChessImages[1]));
	for(let player of playerList) {
		player.initializePieces();
	}
	updateAll();
	messageSlot.html(playerNames[currPlayer]+"'s turn");
}

function resetGame() {
	messageSlot.html("");
	initializeVars();
}

function makeDOM() {
	messageSlot=createElement("h1");
	messageSlot.position(20,height+10);

	again=createButton("Restart");
	again.position(425,10);
	again.mousePressed(resetGame);

	undo=createButton("Undo");
	undo.position(425,70);
	undo.mousePressed(undoMove);

	redo=createButton("Redo");
	redo.position(425,100);
	redo.mousePressed(redoMove);

	highlightButton=createButton("Unhighlight");
	highlightButton.position(425,40);
	highlightButton.mousePressed(toggleHighlight);	
}

function toggleHighlight() {
	if(highlightButton.html()=="Unhighlight") {
		highlightButton.html("Highlight");
	} else {
		highlightButton.html("Unhighlight");
	}
	highlightOn=!highlightOn;
}

function redoMove() {
	if(undid.length>0&&checkMate==-1&&!pause) {
		currPiece=false;
		let move=undid.pop();
		move.execute();
		hist.push(move);
		updateAll();
		validateAll();
		playerList[1-currPlayer].updateCheck();
		switchPlayer();
	}
}

function undoMove() {
	if(hist.length>0&&checkMate==-1&&!pause) {
		currPiece=false;
		let move=hist.pop()
		move.undo();
		undid.push(move);
		updateAll();
		validateAll();
		playerList[1-currPlayer].updateCheck();
		switchPlayer();
	}
}

function keyTyped() {
	key=parseInt(key);
	if(pause&&key>0&&key<5) {
		promote(pause,key);
	}
}

function promote(pawn,val) {
	pawn=pause;
	pawn.become=Pieces[val];
	pawn.become(pawn.row,pawn.col)
	pawn.img=pawn.player.pieceImageList[val];
	pause=false;
	switchPlayer();
	updateAll();
	validateAll();
	playerList[1-currPlayer].updateCheck();
	playerList[currPlayer].updateAllMoves();
	switchPlayer();
}
