const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width = 300;
ctx.canvas.height = 500;

const cWidth = ctx.canvas.width;
const cHeight = ctx.canvas.height;
var velocidad = 6;
var game_loop;
var player;
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
	console.log("ahora si"+event.which);
},false);

/*
//Captura que tecla se presiono
$(document).keydown(function(event){
event.preventDefault();
var key = event.which;
switch(key){
		case (87):
		case (38):
			if (velocidad < 13)
				velocidad +=1;
			break;
		case 83:
		case (40):
			if (velocidad > 5)
				velocidad -=1;
			break;

		case 68:
		case (39):
			keyP = "r";
			break;
		case 65:
		case (37):
			keyP = "l";
			break;
		}
if (key==13){
	init();
}

})

//Captura que tecla se presiono
$(document).keyup(function(event){
})*/


function init(){
s=0; vidas=3;
player =  {posX: (ctx.canvas.width/2)-30, posY: ctx.canvas.height-20, width: 100, height: 20};
pelota = {posX: (ctx.canvas.width/2), 
		  posY: 10, dirX: 5, dirY:10, width:10 , height:10 };

if(typeof game_loop != "undefined"){
	clearInterval(game_loop);
}
clearInterval(start_loop);
game_loop = setInterval(main, 30);
stopPlayer = false;
stopEnemigo = false;
keyP="";


}

function getRandom(min, max) {
return Math.floor(Math.random() * (max - min)) + min;
}

function main(){
drawBackground();
score();
vidasTexto();
if (playerVivo){
	drawPlayer();
	drawPelota();
	rebotePelota();
	colision();	
}else{
	gameOver();
}

if (!stopPlayer)		
	movePlayer(keyP);				
}

function drawBackground(){
ctx.save();
ctx.fillStyle = "black";
	ctx.fillRect (0,0,cWidth,cHeight);
	ctx.strokeStyle = "red"; 
	ctx.strokeRect (0,0,cWidth,cHeight);
	//ctx.drawImage(bgSprite,0,0,cWidth,cHeight);
	ctx.restore();

}
function drawPlayer(){
ctx.save();
ctx.fillStyle = "white";
ctx.fillRect (player.posX, player.posY, player.width, player.height);
//ctx.drawImage(playerSprite,player.posX,player.posY,player.width,player.height);
ctx.restore();
}

function drawPelota(){
ctx.save()
ctx.beginPath();
// ctx.clearRect(0,0,700,500);
ctx.fillStyle="yellow";
ctx.arc(pelota.posX, pelota.posY, 10, 0, 360,false);
ctx.fill();
ctx.restore();

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

	if(player.posX > (cWidth-player.width)){
		player.posX = cWidth-player.width;
	}

	if (player.posY == pelota.posY+pelota.height
		&& pelota.posX >= player.posX-15 
		&& pelota.posX <= player.posX+15+player.width){

		//cambia dirección de pelota
		if (pelota.posX < player.posX+(player.width/2)){
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


}

function destruyePelota(){
	pelota.posX = (ctx.canvas.width/2);
	pelota.posY = 10;
	vidas--;
	player.width -= 30;
	if(vidas<=0){
		gameOver();
		playerVivo=false;
	}
}

function rebotePelota(){
	if(pelota.posY == pelota.height){
		cambioDireccion('down');
	}

	if (pelota.posY == ctx.canvas.height){
		cambioDireccion('up');
	}

	if(pelota.posX == ctx.canvas.width){
		cambioDireccion('left');
	}
	if(pelota.posX == pelota.height){
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
	ctx.restore();  
}

function score(){
	ctx.save();
	var t = "Score: " + s;
	ctx.font = "bold 10px Courier";
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.fillText(t,10,20);
	ctx.restore();			
}

function vidasTexto(){
	ctx.save();
	var t = "Vidas: " + vidas;
	ctx.font = "bold 10px Courier";
	ctx.fillStyle = "white";
	ctx.textAlign = "left";
	ctx.fillText(t,cWidth-60,20);
	ctx.restore();			
}

init();	






