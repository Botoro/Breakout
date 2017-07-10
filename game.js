const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width = 300;
ctx.canvas.height = 500;

const cWidth = ctx.canvas.width;
const cHeight = ctx.canvas.height;

class Player{
	
	constructor(posX=0, posY=0, width=0, height=0){
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
	}
	//player =  {posX: (ctx.canvas.width/2)-30, posY: ctx.canvas.height-10, width: 100, height: 10};

}

class Bloque {
	constructor(posX=0, posY=0, width=0, height=0, estado=0){
		this.posX = posX;
		this.posY = posY;
		this.width = width;
		this.height = height;
		this.estado = estado;
	}
}

var velocidad = 6;
var game_loop;
var player;
var bloque;
var start_loop;
var s;
var vidas;
var playerVivo = true;

var stopPlayer;
var stopEnemigo;
var keyP;
var dir;
var clic=0;
var textPosX = cWidth/2;
var textPosY = cHeight/2;

var bgSprite = new Image();
bgSprite.src = "fondo.jpg";

var playerSprite = new Image();
playerSprite.src = "nave.jpg";


document.getElementById("canvas").addEventListener("click", function(){

	if(!playerVivo){
		init();
	}

	if(clic==0 ){
		keyP = "r";
		clic=1;
	}
	else{
		keyP = "l";
		clic=0;
	}


},false);

document.addEventListener("keydown",function(event){
	var key = event.which;
	switch(key){
		case 68:
		case (39):
			keyP = "r";
			break;
		case 65:
		case (37):
			keyP = "l";
			break;
		}
		if (key==13 && !playerVivo){
			init();
		}

},false);

function init(){
	s=0; vidas=3;
	//player =  {posX: (ctx.canvas.width/2)-30, posY: ctx.canvas.height-10, width: 100, height: 10};

	player = new Player((ctx.canvas.width/2)-30,ctx.canvas.height-10,100,10);

	pelota = {posX: (ctx.canvas.width/2), posY: 10, dirX: 5, dirY:10, per:7};

	bloque = new Bloque(10,300, 80, 10, 1);

	if(typeof game_loop != "undefined"){
		clearInterval(game_loop);
	}
	clearInterval(start_loop);
	game_loop = setInterval(main, 30);
	stopPlayer = false;
	stopEnemigo = false;
	playerVivo = true;
	keyP="";
}

function getRandom(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function main(){
	drawBackground();

	if (playerVivo){
		drawPlayer();
		drawPelota();
		if (bloque.estado==1){
			drawBloques();
		}
		rebotePelota();
		colision();	
	}else{
		gameOver();
	}

	if (!stopPlayer)		
		movePlayer(keyP);	
	score();
	vidasTexto();			
}

function drawBackground(){
	ctx.save();
	ctx.fillStyle = "#000";
	ctx.fillRect (0,0,cWidth,cHeight);
	ctx.strokeStyle = "red"; 
	ctx.strokeRect (0,0,cWidth,cHeight);
	//ctx.drawImage(bgSprite,0,0,cWidth,cHeight);
	ctx.restore();

}
function drawPlayer(){
	ctx.save();
	ctx.fillStyle = "#FFF";
	ctx.fillRect (player.posX, player.posY, player.width, player.height);
	//ctx.drawImage(playerSprite,player.posX,player.posY,player.width,player.height);
	ctx.restore();
}

function drawPelota(){
	ctx.save()
	ctx.beginPath();
	// ctx.clearRect(0,0,700,500);
	ctx.fillStyle="yellow";
	ctx.arc(pelota.posX, pelota.posY, pelota.per, 0, 360,false);
	ctx.fill();
	ctx.restore();
}

function drawBloques(){
	if (bloque.estado==0){
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle="red";
		ctx.clearRect(bloque.posX, bloque.posY, bloque.width, bloque.height);
		ctx.restore();
	}
	else{
		ctx.save();
		ctx.beginPath();
		ctx.fillStyle="red";
		ctx.fillRect(bloque.posX, bloque.posY, bloque.width, bloque.height);
		ctx.restore();
	}
}

		
// funciones del jugador
function movePlayer(dir){
	switch(dir){
	case "r":
		player.posX += +velocidad;
		break;
	case "l":
		player.posX += -velocidad;
		break;
	}
}


function colision(){

	//player paredes
	if(player.posX<-1){
		player.posX = 0;
	}

	if(player.posX >= (cWidth-player.width)){
		player.posX = cWidth-player.width;
	}

	if (player.posY <= pelota.posY+pelota.per
		&& pelota.posX >= player.posX 
		&& pelota.posX <= player.posX+player.width){
		//cambia dirección de pelota
		if (pelota.posX <= player.posX+(player.width/2)){
			cambioDireccion('up');
			cambioDireccion('left');
		}
		else{
			cambioDireccion('up');
			cambioDireccion('right');
		}
	}

	if (pelota.posY == cHeight){
		destruyePelota();
	}

	//bloques colision lo hare por parte para entender.
	if (pelota.posX >= bloque.posX && pelota.posX <= bloque.posX + bloque.width &&
		pelota.posY >= bloque.posY && pelota.posY <= bloque.posY + bloque.height){
		
		if (pelota.posX <= bloque.posX+(player.width/2)){
			cambioDireccion('left');
		}
		else{
			cambioDireccion('right');
		}
		console.log("pelota 0");
		bloque.estado = 0;

	}


}

function destruyePelota(){
	pelota.posX = (ctx.canvas.width/2);
	pelota.posY = 10;
	vidas--;
	//player.width -= 30;
	if(vidas<=0){
		gameOver();
		playerVivo=false;
	}
}

function rebotePelota(){
	if(pelota.posY <= pelota.per){
		cambioDireccion('down');
	}

	if(pelota.posX >= ctx.canvas.width){
		cambioDireccion('left');
	}

	if(pelota.posX <= pelota.per){
		cambioDireccion('right');
	}

	pelota.posY += pelota.dirY;
	pelota.posX += pelota.dirX;
}

function cambioDireccion(dir){
	if ((dir=='up' && pelota.dirY > 0) || (dir=='down' && pelota.dirY < 0))
		pelota.dirY = -pelota.dirY;

	if (dir=='down' && pelota.dirY > 0)
		pelota.dirY = pelota.dirY;

	if (dir=='left' && pelota.dirX > 0){
		pelota.dirX = -pelota.dirX;
	}

	if (dir=='right' && pelota.dirX <0){
		pelota.dirX = -pelota.dirX;
	}

	if (dir=='right' && pelota.dirX >0){
		pelota.dirX = pelota.dirX;
	}
}

function gameOver(){
	ctx.save();
	var title = "Game Over";
	ctx.font = "bold 30px Courier";
	ctx.fillStyle = "red";
	ctx.textAlign = "center";
	ctx.fillText(title,textPosX,textPosY);
	var subtitle = "Volver a comenzar";
	ctx.font = "bold 10px Courier";
	ctx.fillText(subtitle,textPosX,textPosY+10)
	ctx.restore();  
}

function score(){
	ctx.save();
	var t = "Score: " + s;
	ctx.font = "bold 10px Courier";
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.fillText(t,10,10);
	ctx.restore();			
}

function vidasTexto(){
	ctx.save();
	var t = "Vidas: " + vidas;
	ctx.font = "bold 10px Courier";
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.fillText(t,cWidth-60,10);
	ctx.restore();			
}

init();	






