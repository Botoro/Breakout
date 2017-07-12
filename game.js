const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
ctx.canvas.width = 300;
ctx.canvas.height = 500;

const cWidth = ctx.canvas.width;
const cHeight = ctx.canvas.height;

var bloquesDestruidos = 0;
var combo = 0;
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
var filas = 2;
var columnas = 6; // columnas +1
var velocidad = 5;
var game_loop;
var player;
var bloque;
var start_loop;
var arreglo = new Array();
var s;
var vidas;
var playerVivo = true;
var nivelSuperado = false;
var variacionBola = 0;
var stopPlayer;
var stopEnemigo;
var juegoAndando;
var keyP;
var dir;
var clic=0;
var textPosX = cWidth/2;
var textPosY = cHeight/2;
var position;

var bgSprite = new Image();
bgSprite.src = "img/breakout_bg.png";

var playerSprite = new Image();
playerSprite.src = "img/png/paddleRed.png";


var level1 = "*-*-*-*-";

document.getElementById("canvas").addEventListener("click", function(){

	if(!playerVivo){
		init();
	}
	stopPelota=true;
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
	filas = 1;
	columnas = 6;
	bloquesDestruidos=0;
	combo = 1;
	newLevel();
}

function newLevel(){
	player = new Player((cWidth/2)-50,cHeight-10,100,10);
	pelota = {posX: (cWidth/2), posY: cHeight-15, dirX: 0, dirY:10, per:7};
	//bloque = new Bloque(10,300, 80, 10, 1);
	for (var i = 1; i <=filas; i++){
		//console.log(i);
		for (var j = 0; j <=columnas-1; j++) {
			if(j==0)
				bloques[j] =new Bloque(j,(i*20), 50, 20, 1);	
			else
				bloques[j] =new Bloque(50*j,(i*20), 50, 20, 1);	

			//console.log("("+bloques[j].posX+","+bloques[j].posY+")");
		}
		matrisBloques[i] = bloques;
		bloques = new Array();
	}

	bloquesDesign(level1);

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
function bloquesDesign(d){
	var cadena = d;
	var eliminarCadena = ""
	for (var j = 0; j <=columnas-1; j++) {
		if(cadena.charAt(j)=='*'){
			console.log("a eliminar: "+j);
			eliminarCadena += j;
		}
	}
	console.log(eliminarCadena);

	for (var i = 1; i <=filas; i++){
		for(i=0; i<eliminarCadena.length; i++) {
			matrisBloques[i].splice(eliminarCadena.charAt(i),1);
		}
			
	}
	

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

	if (nivelSuperado)
		levelUp();

	if (!stopPlayer){		
		movePlayer(keyP);
	}	
	score();
	vidasTexto();			
}

function drawBackground(){
	ctx.save();
	ctx.fillStyle = "#000";
	ctx.fillRect (0,0,cWidth,cHeight);
	ctx.strokeStyle = "red"; 
	ctx.strokeRect (0,0,cWidth,cHeight);
	ctx.drawImage(bgSprite,0,0,cWidth,cHeight);
	ctx.restore();

}
function drawPlayer(){
	ctx.save();
	//ctx.fillStyle = "#FFF";
	ctx.fillRect (player.posX, player.posY, player.width, player.height);
	ctx.drawImage(playerSprite,player.posX,player.posY,player.width,player.height);
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
		for (var j = 0; j <matrisBloques[i].length; j++) {
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

	//player
	if (player.posY <= pelota.posY+pelota.per
		&& pelota.posX >= player.posX 
		&& pelota.posX <= player.posX+player.width){
		

		//cambia dirección de pelota
		if (pelota.posX < player.posX+(player.width/2)){
			position = player.posX+(player.width/2);
			//console.log("Player: " + position);
			//console.log("Pelota: " + (position - pelota.posX));
			variacionBola = Math.floor((position - pelota.posX)/8);
			pelota.dirX = variacionBola;
			cambioDireccion('up');
			cambioDireccion('left');
		}
		else{
			position = player.posX+(player.width/2);
			variacionBola = Math.floor((pelota.posX-position )/8);
			pelota.dirX = variacionBola;
			cambioDireccion('up');
			cambioDireccion('right');
		}
	}

	if (pelota.posY >= cHeight){
		combo = 0;
		destruyePelota();
	}

	//bloques colision lo hare por parte para entender.
	for (var i = 1; i <=filas; i++){
		for (var j = 0; j < matrisBloques[i].length; j++) {
			if (pelota.posX >= matrisBloques[i][j].posX && pelota.posX <= matrisBloques[i][j].posX + matrisBloques[i][j].width &&
				pelota.posY+pelota.per >= matrisBloques[i][j].posY && pelota.posY+pelota.per <= matrisBloques[i][j].posY + matrisBloques[i][j].height){
				nivelSuperado = false;
				s += 10;

				if (pelota.posY <= matrisBloques[i][j].posY + matrisBloques[i][j].height){
					cambioDireccion('down');
				}
				//destruye todo
				 if (pelota.posY <= matrisBloques[i][j].posY){
				 	cambioDireccion('up');
				 }

				//lado izquiedo Bloque
				if (pelota.posX <= matrisBloques[i][j].posX+(player.width/2)){
					cambioDireccion('left');
				}
				//lado derecho Bloque
				else{
					cambioDireccion('right');
				}
				//destruyo bloque
				matrisBloques[i].splice(j,1);
				bloquesDestruidos++;
				combo++;
			}
		}
	}

	if (bloquesDestruidos==(filas*columnas)){
		nivelSuperado = true;
		filas++;
		bloquesDestruidos=0;
		newLevel();
	}
}

function destruyePelota(){
	pelota.posX = (player.posX+player.width/2);
	pelota.posY = cHeight-15;
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

	if (dir=='up' && pelota.dirY > 0)
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
	ctx.fillStyle = "white";
	ctx.fillText(subtitle,textPosX,textPosY+10)
	subtitle = "Puntaje: "+s;
	ctx.font = "bold 10px Courier";
	ctx.fillText(subtitle,textPosX,textPosY+20)
	ctx.restore();  
}

function levelUp(){
	ctx.save();
	var title = "Nivel "+filas;
	ctx.font = "bold 30px Courier";
	ctx.fillStyle = "white";
	ctx.textAlign = "center";
	ctx.fillText(title,textPosX,textPosY);
	var subtitle = "Puntaje: "+s;
	ctx.font = "bold 10px Courier";
	ctx.fillText(subtitle,textPosX,textPosY+20)
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






