const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width = 300;
ctx.canvas.height = 500;

const cWidth = ctx.canvas.width;
const cHeight = ctx.canvas.height;

var colis = 0;
var marca = 0;

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

var bloques = new Array();
var matrisBloques = new Array();
var filas = 1;
var columnas = 6;

var velocidad = 5;
var game_loop;
var player;
var bloque;
var start_loop;
var s;
var vidas;
var playerVivo = true;

var stopPlayer;
var stopEnemigo;
var juegoAndando;
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
		
		case 32:
			stopPelota=true;
		break;
		}
		if (key==13 && !playerVivo){
			init();
		}

},false);

function init(){
	s=0; vidas=3;
	//player =  {posX: (cWidth/2)-30, posY: cHeight-10, width: 100, height: 10};

	player = new Player((cWidth/2)-50,cHeight-10,100,10);

	pelota = {posX: (cWidth/2), posY: cHeight-20, dirX: 5, dirY:10, per:7};

	//bloque = new Bloque(10,300, 80, 10, 1);
	for (var i = 1; i <=filas; i++){
		for (var j = 0; j <columnas; j++) {
			if(j==0)
				bloques[j] =new Bloque(j,20, 50, 20, 1);
			else{
				bloques[j] =new Bloque((j-1)*50,(i*20), 50, 20, 1);

			}
		}
		matrisBloques[i] = bloques;
	}


	cambioDireccion('up');


	if(typeof game_loop != "undefined"){
		clearInterval(game_loop);
	}
	clearInterval(start_loop);
	game_loop = setInterval(main, 30);
	stopPlayer = false;
	stopPelota = false;
	stopEnemigo = false;
	playerVivo = true;
	juegoAndando = true;
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
		drawBloques();
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
	for (var i = 1; i <=filas; i++){
		for (var j = 0; j <bloques.length; j++) {
			ctx.save();
			ctx.beginPath();
			ctx.fillStyle = 'rgb(' + Math.floor(255 - 42.5 * i) + ', ' +
                       Math.floor(255 - 42.5 * i) + ', '+Math.floor(255 - 42.5 * i)+')';
			ctx.fillRect(matrisBloques[i][j].posX, matrisBloques[i][j].posY, matrisBloques[i][j].width, matrisBloques[i][j].height);
			ctx.strokeStyle="#000";
			ctx.strokeRect(matrisBloques[i][j].posX, matrisBloques[i][j].posY, matrisBloques[i][j].width, matrisBloques[i][j].height);

			ctx.restore();
		}
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
			cambioDireccion('right');
		}
		else{
			cambioDireccion('up');
			cambioDireccion('left');
		}
	}

	if (pelota.posY >= cHeight){

		destruyePelota();
		cambioDireccion('up');
	}

	//bloques colision lo hare por parte para entender.
	for (var i = 1; i <= filas; i++) {
		for(var j=0;j < bloques.length;j++){
			if (pelota.posX >= matrisBloques[i][j].posX && pelota.posX <= matrisBloques[i][j].posX + matrisBloques[i][j].width &&
				pelota.posY >= matrisBloques[i][j].posY && pelota.posY <= matrisBloques[i][j].posY + matrisBloques[i][j].height){
				
				if (pelota.posX <= matrisBloques[i][j].posX+(player.width/2)){
					cambioDireccion('left');
				}
				else{
					cambioDireccion('right');
				}
				 			bloques.splice(j,1);

			}
		}
		if (colis==1) {
			bloques.splice(marca,1);
			colis=0;

		}

	}


}

function destruyePelota(){
	pelota.posX = (player.posX+player.width/2);
	pelota.posY = cHeight-30;
	stopPelota = false;
	juegoAndando =
	vidas--;
	//player.width -= 30;
	if(vidas<=0){
		gameOver();
		playerVivo=false;
	}
}

function rebotePelota(){
	if (stopPelota){
		if(pelota.posY <= pelota.per){
			cambioDireccion('down');
		}

		if(pelota.posX >= cWidth){
			cambioDireccion('left');
		}

		if(pelota.posX <= pelota.per){
			cambioDireccion('right');
		}

		pelota.posY += pelota.dirY;
		pelota.posX += pelota.dirX;
	}
	else{
		pelota.posY = cHeight-15;
		pelota.posX = player.posX + player.width/2;
		if(pelota.posX >= cWidth/2){
			cambioDireccion('left');
		}

		if(pelota.posX <= cWidth/2){
			cambioDireccion('right');
		}	
	}
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






