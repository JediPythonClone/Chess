Pawn=function(startRow,startCol) {
	this.value=0;
	this.row=startRow;
	this.col=startCol;
	this.updateMoves=function() {
		this.validMoves=[];
		let front=this.position.getRelative(this.direction,0);
		if(front&&!front.piece) {
			let move=new Move(this.position,front);
			this.validMoves.push(move);
			this.promoteIfApplicable(move);
			if(this.totalMoves==0) {
				let doubleFront=this.position.getRelative(this.direction*2,0);
				if(!doubleFront.piece) {
					let move=new Move(this.position,doubleFront);
					move.extraSteps=function() {
						this.movedPiece.doubleFronted=true;
					}
					move.extraUndo=function() {
						this.movedPiece.doubleFronted=false;
					}
					this.validMoves.push(move);
				}
			}
		}

		//optimize!!!:
		let diagLeft=this.position.getRelative(this.direction,-1);
		let diagRight=this.position.getRelative(this.direction,1);
		if(diagLeft&&diagLeft.piece&&diagLeft.piece.player!=this.player) {//if enemy
			let move=new Move(this.position,diagLeft)
			this.validMoves.push(move);
			this.promoteIfApplicable(move);
		}
		if(diagRight&&diagRight.piece&&diagRight.piece.player!=this.player) {
			let move=new Move(this.position,diagRight);
			this.validMoves.push(move);
			this.promoteIfApplicable(move);
		}
		//en passant move
		let leftSide=this.position.getRelative(0,-1);
		let rightSide=this.position.getRelative(0,1);
		if(leftSide&&leftSide.piece&&leftSide.piece.doubleFronted&&leftSide.piece.player!=this.player) {
			let move=new Move(this.position,diagLeft,leftSide.piece);
			this.validMoves.push(move);
		}
		if(rightSide&&rightSide.piece&&rightSide.piece.doubleFronted&&rightSide.piece.player!=this.player) {
			let move=new Move(this.position,diagRight,rightSide.piece);
			this.validMoves.push(move);
		}
	}
	this.promoteIfApplicable=function(move) {
		if(this.row==7-this.player.startRow-this.direction) {
			move.extraSteps=function(source) {
				if(source!="computer") {
					pause=this.movedPiece;
					push();
					fill(40);
					rect(50,50,300,300);
					fill(255);
					textSize(20);
					text("What Would You Like To",90,90);
					text("Promote Your Pawn To?",90,120);
					textSize(18);
					text("Press 1: Bishop",65,210);
					text("Press 2: Knight",205,210);
					text("Press 3: Rook",65,280);
					text("Press 4: Queen",205,280);
					pop();
				}
			}
			move.extraUndo=function() {
				this.movedPiece.becomePawn(this.movedPiece.row,this.movedPiece.col);
				this.movedPiece.img=this.movedPiece.player.pieceImageList[0];
			}
		}
	}
}

Bishop=function(startRow,startCol) {
	this.value=1;
	this.row=startRow;
	this.col=startCol;
	this.updateMoves=function() {
		this.validMoves=[];
		let diagUp=board.getDiagonal(this.row,this.col,1);
		let diagDown=board.getDiagonal(this.row,this.col,-1);
		let loopList=[diagUp,diagDown];
		for(var l=0; l<loopList.length; l++) {
			let currList=loopList[l];
			let selfIndex=this.findLocationIndex(currList)
			for(var i=selfIndex-1; i>=0; i--) {
				if(!currList[i].piece) {
					this.validMoves.push(new Move(this.position,currList[i]));
				}else {
					if(currList[i].piece.player!=this.player) {
						this.validMoves.push(new Move(this.position,currList[i]));
					}
					break;
				}
			}
			for(var i=selfIndex+1; i<currList.length; i++) {
				if(!currList[i].piece) {
					this.validMoves.push(new Move(this.position,currList[i]));
				}else {
					if(currList[i].piece.player!=this.player) {
						this.validMoves.push(new Move(this.position,currList[i]));
					}
					break;
				}
			}
		}
	}
}

Knight=function(startRow,startCol) {
	this.value=2;
	this.row=startRow;
	this.col=startCol;
	this.updateMoves=function() {
		this.validMoves=[];
		let moves=[this.position.getRelative(2,1),
					this.position.getRelative(2,-1),
					this.position.getRelative(1,2),
					this.position.getRelative(1,-2),
					this.position.getRelative(-1,2),
					this.position.getRelative(-1,-2),
					this.position.getRelative(-2,1),
					this.position.getRelative(-2,-1)];

		for(var i=0; i<moves.length; i++) {
			move=moves[i];
			if(move&&(!move.piece||move.piece.player!=this.player)) {
				this.validMoves.push(new Move(this.position,move));
			}
		}

	}
}

Rook=function(startRow,startCol) {
	this.value=3;
	this.row=startRow;
	this.col=startCol;
	this.updateMoves=function() {
		this.validMoves=[];
		let horizontal=board.getHorizontal(this.row);
		let vertical=board.getVertical(this.col);
		let loopList=[horizontal,vertical];
		for(var l=0; l<loopList.length; l++) {
			let currList=loopList[l];
			let selfIndex=this.findLocationIndex(currList);
			for(var i=selfIndex-1; i>=0; i--) {
				if(!currList[i].piece) {
					this.validMoves.push(new Move(this.position,currList[i]));
				}else {
					if(currList[i].piece.player!=this.player) {
						this.validMoves.push(new Move(this.position,currList[i]));
					}
					break;
				}
			}
			for(var i=selfIndex+1; i<currList.length; i++) {
				if(!currList[i].piece) {
					this.validMoves.push(new Move(this.position,currList[i]));
				}else {
					if(currList[i].piece.player!=this.player) {
						this.validMoves.push(new Move(this.position,currList[i]));
					}
					break;
				}
			}
		}
	}
}

Queen=function(startRow,startCol) {
	this.value=4;
	this.row=startRow;
	this.col=startCol;
	this.updateMoves=function() {
		this.validMoves=[];
		let diagUp=board.getDiagonal(this.row,this.col,1);
		let diagDown=board.getDiagonal(this.row,this.col,-1);
		let horizontal=board.getHorizontal(this.row);
		let vertical=board.getVertical(this.col);
		let loopList=[diagUp,diagDown,horizontal,vertical];
		for(var l=0; l<loopList.length; l++) {
			let currList=loopList[l];
			let selfIndex=this.findLocationIndex(currList)
			for(var i=selfIndex-1; i>=0; i--) {
				if(!currList[i].piece) {
					this.validMoves.push(new Move(this.position,currList[i]));
				}else {
					if(currList[i].piece.player!=this.player) {
						this.validMoves.push(new Move(this.position,currList[i]));
					}
					break;
				}
			}
			for(var i=selfIndex+1; i<currList.length; i++) {
				if(!currList[i].piece) {
					this.validMoves.push(new Move(this.position,currList[i]));
				}else {
					if(currList[i].piece.player!=this.player) {
						this.validMoves.push(new Move(this.position,currList[i]));
					}
					break;
				}
			}
		}
	}
}

King=function(startRow,startCol) {
	this.value=5;
	this.row=startRow;
	this.col=startCol;
	this.updateMoves=function() {
		this.validMoves=[];
		let moves=[this.position.getRelative(-1,-1),
					this.position.getRelative(-1,0),
					this.position.getRelative(-1,1),
					this.position.getRelative(0,-1),
					this.position.getRelative(0,1),
					this.position.getRelative(1,-1),
					this.position.getRelative(1,0),
					this.position.getRelative(1,1)];

		for(var i=0; i<moves.length; i++) {
			move=moves[i];
			if(move&&(!move.piece||move.piece.player!=this.player)) {
				this.validMoves.push(new Move(this.position,move));
			}
		}

		//castling
		if(this.totalMoves==0&&!this.player.updateCheck()) {
			let kingRow=[];
			for(let i=0; i<8; i++) {
				kingRow.push(this.board.get(this.row,i));
			}
			let blocked=[false,false];
			let side=0;
			for(let i=1; i<7; i++) {
				let piece=kingRow[i].piece;
				if(piece&&piece.value!=5) {
					blocked[side]=true;
				}
				if(piece&&piece.value==5) {
					side=1;
				}
			}
			let rooks=[kingRow[0].piece,kingRow[7].piece];
			for(let i=0; i<2; i++) {
				if(rooks[i]&&rooks[i].totalMoves==0&&!blocked[i]/*&&!this.player.isInCheck*/) {//isInCheck not working
					let dir=-1;
					if(i==1) {
						dir=i;
					}
					this.addCastle(rooks[i],dir);
				}
			}
		}
	}
	this.addCastle=function(rook,dir) {
		let rookMove=new Move(rook.position,this.position.getRelative(0,dir));//-?
		let kingMove=new Move(this.position,this.position.getRelative(0,2*dir),false,rookMove);
		kingMove.extraSteps=function(source) {
			this.extra.execute(source);
		}
		kingMove.extraUndo=function() {
			this.extra.undo();
		}
		this.validMoves.push(kingMove);
	}
}


Move=function(startLoc,endLoc,attackedPiece,extra) {
	this.extra=extra;
	this.movedPiece=startLoc.piece;
	this.killedPiece=endLoc.piece;
	if(attackedPiece) {
		this.killedPiece=attackedPiece;
		this.origEndPiece=endLoc.piece;
	}
	this.startLoc=startLoc;
	this.endLoc=endLoc;
	this.execute=function(source) {
		if(this.killedPiece) {
			this.killedPiece.die();
		}
		this.movedPiece.position=this.endLoc;
		this.endLoc.piece=this.movedPiece;
		this.startLoc.piece=false;
		this.movedPiece.row=this.endLoc.row;
		this.movedPiece.col=this.endLoc.col;
		this.movedPiece.totalMoves++;
		if(this.extraSteps) {
			this.extraSteps(source);
		}
	}
	this.undo=function() {
		if(this.extraUndo) {
			this.extraUndo();
		}
		this.movedPiece.row=this.startLoc.row;
		this.movedPiece.col=this.startLoc.col;
		this.startLoc.piece=this.movedPiece;
		this.movedPiece.position=this.startLoc;
		if(this.killedPiece) {
			this.killedPiece.deathCertificate.revive();
			this.killedPiece.deathCertificate=false;
			this.killedPiece.player.pieces.splice(0,0,this.killedPiece);
			this.killedPiece.position.piece=this.killedPiece;
			if(attackedPiece) {
				this.endLoc.piece=this.origEndPiece;
			}
		} else {
			this.endLoc.piece=false;
		}
		this.movedPiece.totalMoves--;
	}
	this.equals=function(start, end) {
		return this.startLoc==start&&this.endLoc==end;
	}
}
let initialize=function(board,player) {
	this.history=[];
	this.totalMoves=0;
	this.isAlive=true;
	this.board=board;
	this.player=player;
	this.direction=this.player.direction;//direction:white is neg;
	this.position=this.board.get(this.row,this.col);
	this.position.piece=this;
	this.position.player=this.player.num;
	this.position.status=0;
	this.validMoves=[];
	this.img=this.player.pieceImageList[this.value];
}
let display=function(loc) {
	image(this.img,loc.x,loc.y,loc.boxWidth,loc.boxHeight);
}
let move=function(loc) {
	let currMove;
	for(let move of this.validMoves) {
		if(move.equals(this.position,loc)) {
			currMove=move;
		}
	}
	currMove.execute("player");
	if(this.doubleFronted&&this.totalMoves>1) {
		this.doubleFronted=false;
	}
	return currMove;
}
let highlightMoves=function() {
	for(var move of this.validMoves) {
		move.endLoc.highlight(color(255,255,0,150),0);
	}
}
let canMoveTo=function(loc) {
	for(let move of this.validMoves) {
		if(move.equals(this.position,loc)) {
			return true;
		}
	}
	return false;
}
let findLocationIndex=function(list) {
	for(var i=0; i<list.length; i++) {
		if(board.get(this.row,this.col).equals(list[i])) {
			return i;
		}
	}
}
let die=function() {
	for(var i=0; i<this.player.pieces.length; i++) {
		if(this.player.pieces[i]==this) {
			this.player.pieces.splice(i,1);
		}
		this.position.piece=false;
	}
	this.deathCertificate=new deadPiece(this.player.num,this.value);
}
let validateMoves=function() {
	for(var i=this.validMoves.length-1; i>=0; i--) {
		let move=this.validMoves[i];
		move.execute("computer");
		playerList[1-this.player.num].updateAllMoves();
		//if update ur own player's, it undoes everything validated!-is that a prob?
		this.player.updateCheck();
		if(this.player.isInCheck) {
			this.validMoves.splice(i,1);
		}
		move.undo();
	}
	this.player.updateCheck();
}
var PieceNames=["Pawn","Bishop","Knight","Rook","Queen","King"]
var Pieces=[Pawn,Bishop,Knight,Rook,Queen,King];
for(piece of Pieces) {
	piece.prototype.initialize=initialize;
	piece.prototype.display=display;
	piece.prototype.move=move;
	piece.prototype.highlightMoves=highlightMoves;
	piece.prototype.canMoveTo=canMoveTo;
	piece.prototype.findLocationIndex=findLocationIndex;
	piece.prototype.die=die;
	piece.prototype.validateMoves=validateMoves;
}
Pawn.prototype.becomeQueen=Queen;
Pawn.prototype.becomePawn=Pawn;