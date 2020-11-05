var PLAY = 1;
var END = 0;
var gamestate = PLAY;

var monkey , monkey_running, monkey_collide;
var banana ,bananaImage;
var obstacle, obstacleImage;
var foodGroup, obstaclesGroup;
var ground;
var bg, bg_move;
var score;
var hits;
var survival_time;

function preload()
{
  
  monkey_running =                          loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png", "sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  monkey_collide = loadAnimation("sprite_2.png");
  
  bg_move = loadAnimation("jungle.jpg");
  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
}

function setup() 
{
  createCanvas(600,400);
  
  monkey = createSprite(60,315,10,10);
  monkey.addAnimation("running",monkey_running);
  monkey.addAnimation("collided", monkey_collide);
  monkey.scale = 0.13;
  
  bg = createSprite(60,50,10,10)
  bg.addAnimation("background",bg_move);
  bg.scale = 1.2;
  bg.depth = 0;
  
  ground = createSprite(400,375,1500,60);
  ground.visible = false; 
  
  restart = createSprite(293,240,20,20);
  restart.shapeColor = "white";
  restart.visible = false;
  
  score = 0;
  survival_time = 0;
  hits = 0;
  
  obstaclesGroup = new Group();
  foodGroup = new Group();
}


function draw() 
{
  background("white");
  
  if(gamestate == PLAY)
  {
    if(keyDown("space") && monkey.y >= 270) 
    {
      monkey.velocityY = -20;
    } 
    
    monkey.velocityY = monkey.velocityY + 1;
    bg.velocityX = -(6+3*score/4);
    
    if (bg.x < 0)
    {
      bg.x = bg.width/2;
    }
       
    if(monkey.isTouching(foodGroup))
    {
      foodGroup.destroyEach(); 
      score = score+2;
    }
    
    switch(score)
    {
      case 10: monkey.scale = 0.15;
        break;
      case 20: monkey.scale = 0.17;
        break;
      case 30: monkey.scale = 0.19;
        break;
      case 40: monkey.scale = 0.21;
        break;
      default: break;
    }
    
    restart.visible = false;
    survival_time = survival_time + Math.round(getFrameRate()/60);
     
    spawnObstacles();
    bananas();
    
    if(obstaclesGroup.isTouching(monkey))
    {
      hits++;
      monkey.scale = 0.1;
      obstaclesGroup.setLifetimeEach(0);
    }
    
    if(hits == 2)
    {
       gamestate = END;
       monkey.scale = 0.13;
    }
  }
  
  if(gamestate == END)
  {
    restart.visible = true;
  
    foodGroup.setVelocityXEach(0);
    obstaclesGroup.setVelocityXEach (0);
    obstaclesGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);
    
    bg.velocityX = 0;
    monkey.velocityY = 0;
    monkey.changeAnimation("collided", monkey_collide);
    
    if(mousePressedOver(restart))
    {
      reset();
      survival_time = 0;
    }
  }
  
  monkey.collide(ground);
    
  drawSprites();
  
  textSize(15);
  textFont("bembo");
  fill("white");
  text("Bananas = "+score,250,70);
  
  textSize(15);
  textFont("bembo");
  fill("white");
  text("Hits = "+hits,265,85);
  
  textSize(20);
  textFont("bembo");
  fill("white");
  text("Survival Time = "+survival_time,210,50);
  
  if(gamestate == END)
  {
    restart.visible = true;
    
    textSize(30);
    textFont("bembo");
    fill("white");
    text("GAME OVER!",200,200);
    
    textSize(15);
    textFont("bembo");
    fill("white");
    text("Press 👇 to restart",250,220);
  } 
}

function reset()
{
  gamestate = PLAY;
  monkey.changeAnimation("running",monkey_running);
  obstaclesGroup.destroyEach();
  foodGroup.destroyEach();
  restart.visible = false;
  score = 0;
  hits = 0;
}

function bananas()
{
  if (frameCount % 100 === 0)
  {
    var banana = createSprite(600,120,40,10);
    banana.y = Math.round(random(120,200));
    banana.addImage(bananaImage);
    banana.scale = 0.12;
    banana.velocityX = -(6+2*score/4);
    banana.lifetime = 110;
    
    banana.setCollider("circle",0,0,40);
  
    foodGroup.add(banana);
  }
}

function spawnObstacles()
{ 
  if (frameCount % 150 === 0)
  {
    var obstacle = createSprite(600,318,10,40);
  
    obstacle.velocityX = -(6+2*score/4);
    obstacle.addImage(obstacleImage);
    obstacle.scale = 0.17;
    obstacle.setCollider("circle",0,0,130);
    obstacle.lifetime = 110;
    
    obstaclesGroup.add(obstacle);
  }
}
