Pawn=function(startRow,startCol) {
	this.value=0;
	this.row=startRow;
	this.col=startCol;
	this.startRow=startRow;
	this.startCol=startCol;
	this.updateMoves=function() {
		this.validMoves=[];
		this.killMoves=[];
		let front=this.position.getRelative(this.direction,0);
		//if not front: this=new Queen();
		if(this.row==7-this.player.startRow) {
			this.becomeQueen(this.row,this.col);
			this.img=this.player.pieceImageList[4];
		}

		if(front&&!front.piece) {
			this.validMoves.push(front);
			if(this.row==this.startRow&&this.col==this.startCol) {
				let doubleFront=this.position.getRelative(this.direction*2,0);
				if(!doubleFront.piece) {
					this.validMoves.push(doubleFront);
				}
			}
		}
		let diagLeft=this.position.getRelative(this.direction,-1);
		let diagRight=this.position.getRelative(this.direction,1);
		if(diagLeft&&diagLeft.piece&&diagLeft.piece.player!=this.player) {//if enemy
			this.killMoves.push(diagLeft);
			this.validMoves.push(diagLeft);
		}
		if(diagRight&&diagRight.piece&&diagRight.piece.player!=this.player) {
			this.killMoves.push(diagRight);
			this.validMoves.push(diagRight);
		}
	}
}

Bishop=function(startRow,startCol) {
	this.value=1;
	this.row=startRow;
	this.col=startCol;
	this.updateMoves=function() {
		this.validMoves=[];
		this.killMoves=[];
		let diagUp=board.getDiagonal(this.row,this.col,1);
		let diagDown=board.getDiagonal(this.row,this.col,-1);
		let loopList=[diagUp,diagDown];
		for(var l=0; l<loopList.length; l++) {
			let currList=loopList[l];
			let selfIndex=this.findLocationIndex(currList)
			for(var i=selfIndex-1; i>=0; i--) {
				if(!currList[i].piece) {
					this.validMoves.push(currList[i]);
				}else {
					if(currList[i].piece.player!=this.player) {
						this.killMoves.push(currList[i]);
						this.validMoves.push(currList[i]);
					}
					break;
				}
			}
			for(var i=selfIndex+1; i<currList.length; i++) {
				if(!currList[i].piece) {
					this.validMoves.push(currList[i]);
				}else {
					if(currList[i].piece.player!=this.player) {
						this.killMoves.push(currList[i]);
						this.validMoves.push(currList[i]);
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
		this.killMoves=[];
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
			if(move&&!move.piece) {
				this.validMoves.push(move);
			}else if(move&&move.piece.player!=this.player) {
				this.killMoves.push(move);
				this.validMoves.push(move);
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
		this.killMoves=[];
		let horizontal=board.getHorizontal(this.row);
		let vertical=board.getVertical(this.col);
		let loopList=[horizontal,vertical];
		for(var l=0; l<loopList.length; l++) {
			let currList=loopList[l];
			let selfIndex=this.findLocationIndex(currList);
			for(var i=selfIndex-1; i>=0; i--) {
				if(!currList[i].piece) {
					this.validMoves.push(currList[i]);
				}else {
					if(currList[i].piece.player!=this.player) {
						this.killMoves.push(currList[i]);
						this.validMoves.push(currList[i]);
					}
					break;
				}
			}
			for(var i=selfIndex+1; i<currList.length; i++) {
				if(!currList[i].piece) {
					this.validMoves.push(currList[i]);
				}else {
					if(currList[i].piece.player!=this.player) {
						this.killMoves.push(currList[i]);
						this.validMoves.push(currList[i]);
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
		this.killMoves=[];
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
					this.validMoves.push(currList[i]);
				}else {
					if(currList[i].piece.player!=this.player) {
						this.killMoves.push(currList[i]);
						this.validMoves.push(currList[i]);
					}
					break;
				}
			}
			for(var i=selfIndex+1; i<currList.length; i++) {
				if(!currList[i].piece) {
					this.validMoves.push(currList[i]);
				}else {
					if(currList[i].piece.player!=this.player) {
						this.killMoves.push(currList[i]);
						this.validMoves.push(currList[i]);
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
		this.killMoves=[];
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
			if(move&&!move.piece) {
				this.validMoves.push(move);
			}else if(move&&move.piece.player!=this.player) {
				this.killMoves.push(move);
				this.validMoves.push(move)
			}
		}

		//loop to find check
		let check=false
		for(var i=0; i<8; i++) {
			for(var j=0; j<8; j++) {
				let loc=board.get(i,j);
				if(loc.piece&&loc.piece.killMoves.includes(this.position)) {
					check=true;
					this.isInCheck=true;
				}
			}
		}
		if(!check) {
			this.isInCheck=false;
		}
	}
}


let initialize=function(board,player) {
	this.isAlive=true;
	this.board=board;
	this.player=player;
	this.direction=this.player.direction;//direction:white is neg;
	this.position=this.board.get(this.row,this.col);
	this.position.piece=this;
	this.position.player=this.player.num;
	this.position.status=0;
	this.validMoves=[];
	this.killMoves=[];
	this.img=this.player.pieceImageList[this.value];
	this.updateMoves();
}
let display=function(loc) {
	image(this.img,loc.x,loc.y,loc.boxWidth,loc.boxHeight);
}
let move=function(row,col) {
	let loc=this.board.get(row,col);
	if(loc&&this.validMoves.includes(loc)) {
		if(loc.piece) {
			loc.piece.die();
		}
		this.position.player=-1;
		this.position.status=-1;
		this.position.piece=false;
		this.position=loc;
		this.position.player=this.player.num;
		this.position.status=this.value;
		this.position.piece=this;
		this.row=row;
		this.col=col;
	}
}
let highlightMoves=function() {
	for(var loc of this.validMoves) {
		loc.highlight(color(255,255,0,150),0);
	}
}
let canMoveTo=function(loc) {
	return this.validMoves.includes(loc);
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
	}
}

let Pieces=[Pawn,Bishop,Knight,Rook,Queen,King];
for(piece of Pieces) {
	piece.prototype.initialize=initialize;
	piece.prototype.display=display;
	piece.prototype.move=move;
	piece.prototype.highlightMoves=highlightMoves;
	piece.prototype.canMoveTo=canMoveTo;
	piece.prototype.findLocationIndex=findLocationIndex;
	piece.prototype.die=die;
}
Pawn.prototype.becomeQueen=Queen;