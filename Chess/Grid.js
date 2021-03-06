Location=function(grid,row,col,x,y,boxWidth,boxHeight,spacing) {
	this.grid=grid;
	this.row=row;
	this.col=col;
	this.boxWidth=boxWidth;
	this.boxHeight=boxHeight;
	this.x=x;
	this.y=y;
	this.spacing=spacing;
	this.midpointX=this.x+(this.boxWidth/2);
	this.midpointY=this.y+(this.boxHeight/2);
	this.piece=false;

	this.isEmpty=function() {
		return this.status==-1&&this.player==-1;
	}
	this.printLocation=function() {
		if(this.piece) {
			this.piece.display(this);
		}
	}
	this.highlight=function(fillColor, strokeWeight) {
		fill(255);
		noStroke();
		if(fillColor) {
			fill(fillColor);
		}
		if(strokeWeight) {
			strokeWeight(strokeWeight);
		}
		rect(this.x,this.y,this.boxWidth-this.spacing,this.boxHeight-this.spacing);
	}
	this.contains=function(xPoint,yPoint) {
		if(xPoint>this.x&&yPoint>this.y&&xPoint<this.x+this.boxWidth-this.spacing
			&&yPoint<this.y+this.boxHeight-this.spacing) {
			return true;
		}
		return false;
	}
	this.equals=function(other) {
		if(this.x==other.x&&this.y==other.y) {
			return true;
		}
		return false;
	}
	
	this.getRelative=function(rowAdd,colAdd) {
		return grid.get(this.row+rowAdd,this.col+colAdd);
	}
}

Grid=function(rows,cols,boxWidth,boxHeight,canvasWidth,canvasHeight,spacing) {
	this.rows=rows;
	this.cols=cols;
	this.boxWidth=boxWidth;
	this.boxHeight=boxHeight;
	this.width=canvasWidth;
	this.height=canvasHeight;
	this.paddingX=(this.width-(this.boxWidth*this.cols))/2;
	this.paddingY=(this.height-(this.boxHeight*this.rows))/2;
	this.grid=[];
	noStroke();
	for(var i=0; i<this.rows; i++) {
		this.grid[i]=[];
		for(var j=0; j<this.cols; j++) {
			let x=this.paddingX+(j*this.boxWidth);
			let y=this.paddingY+(i*this.boxHeight);
			this.grid[i][j]=new Location(this,i,j,x,y,this.boxWidth,this.boxHeight,spacing);
		}
	}
	this.get=function(row,col) {
		if(!this.isValidLocation(row,col)) {
			return false;
		}
		return this.grid[row][col];
	}
	this.printGrid=function() {
		for(var i=0; i<this.rows; i++) {
			for(var j=0; j<this.cols; j++) {
				this.get(i,j).printLocation();
			}
		}
	}
	this.findLocation=function(x,y) {
		for(var i=0; i<rows; i++) {
			for(var j=0; j<cols; j++) {
				if(this.get(i,j).contains(x,y)) {
					return this.get(i,j);
				}
			}
		}
		return false;
	}
	this.isValidLocation=function(row,col) {
		if(row>=rows||col>=cols||row<0||col<0)
		{
			return false;
		}
		return true;
	}
	this.getBaseCase=function(row,col,direction) {
		while(this.isValidLocation(row+1,col-direction))
		{
			row++;
			col-=direction;
		}
		return [row,col];
	}
	this.getVertical=function(col) {
		let vertCoord=[];
		for(var i=0; i<rows; i++) {
			vertCoord[i]=this.get(i,col);
		}
		return vertCoord;
	}
	this.getHorizontal=function(row) {
		let horCoord=[];
		for(var j=0; j<cols; j++) {
			horCoord[j]=this.get(row,j);
		}
		return horCoord;
	}
	this.getDiagonal=function(row,col,direction) {
		let baseCoord=this.getBaseCase(row,col,direction);
		let baseRow=baseCoord[0];
		let baseCol=baseCoord[1];
		let diagCoord=[];
		while(this.isValidLocation(baseRow,baseCol)) {
			diagCoord[diagCoord.length]=this.get(baseRow,baseCol);
			baseRow--;
			baseCol+=direction
		}
		return diagCoord;
	}
	this.checkStreak=function(length,row,col,status) {
		let potentials=[this.getVertical(col),this.getHorizontal(row),
		this.getDiagonal(row,col,1),this.getDiagonal(row,col,-1)];
		let streak=0;
		let streakCoord=[];
		for(var i=0; i<4; i++) {
			let list=potentials[i];
			for(var j=0; j<list.length; j++) {
				if(list[j].status==status) {
					streak++;
					if(streak==1) {
						streakCoord[0]=list[j];
					}
					if(streak==length) {
						streakCoord[1]=list[j];
						return streakCoord;
					}
				} else {
					streak=0;
				}
			}
			streakCoord=[];
			streak=0;
		}
		return false;
	}
}