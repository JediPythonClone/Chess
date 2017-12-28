Player=function(num,direction,board,pieceImageList) {
	this.board=board;
	this.num=num;
	this.direction=direction;
	this.startRow=(this.direction-1)*-3.5;
	this.pieceImageList=pieceImageList;
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
		this.pieces.push(new King(this.startRow,4));
		for(piece of this.pieces) {
			piece.initialize(this.board,this);
		}
	}
	this.updateAllMoves=function() {
		for(piece of this.pieces) {
			piece.updateMoves();
		}
	}
}
