Player=function(num,direction,board,pieceImageList) {
	this.board=board;
	this.num=num;
	this.direction=direction;
	this.startRow=(this.direction-1)*-3.5;
	this.pieceImageList=pieceImageList;
	this.isInCheck=false;
	this.initializePieces=function() {
		this.pieces=[];
		for(var i=0; i<8; i++) {
			this.pieces.push(new Pawn(this.startRow+this.direction,i));
		}
		this.pieces.push(new Rook(this.startRow,0));
		this.pieces.push(new Rook(this.startRow,7));
		this.pieces.push(new Knight(this.startRow,1));
		this.pieces.push(new Knight(this.startRow,6));
		this.pieces.push(new Bishop(this.startRow,2));
		this.pieces.push(new Bishop(this.startRow,5));
		this.pieces.push(new Queen(this.startRow,3));

		this.king=new King(this.startRow,4);
		this.pieces.push(this.king);
		for(piece of this.pieces) {
			piece.initialize(this.board,this);
		}
	}
	this.updateAllMoves=function() {
		for(let piece of this.pieces) {
			piece.updateMoves();
		}
		this.updateCheck();
	}
	this.validate=function() {
		for(let piece of this.pieces) {
			piece.validateMoves();
		}
		if(this.getAllMoves().length==0) {
			playerList[1-this.num].updateAllMoves();
			if(this.updateCheck()) {
				checkMate=this.num;
				messageSlot.html("Check Mate!!   "+playerNames[1-this.num]+" Wins!!");
			}
		}
	}
	this.updateCheck=function() {
		let check=false;
		let enemy=playerList[1-this.num];
		for(let enemyPiece of enemy.pieces) {
			if(enemyPiece.canMoveTo(this.king.position)) {
				check=true;
				this.isInCheck=true;
			}
		}
		if(!check) {
			this.isInCheck=false;
		}
		return this.isInCheck;
	}
	this.getAllMoves=function() {
		let total=[];
		for(let piece of this.pieces) {
			for(let move of piece.validMoves) {
				total.push(move);
			}
		}
		return total;
	}
	this.endPassants=function() {
		for(let piece of this.pieces) {
			if(piece instanceof Pawn) {
				piece.doubleFronted=false;
			}
		}
	}
}
