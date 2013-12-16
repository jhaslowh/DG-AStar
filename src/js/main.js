
var renderer;
var camera;     // Main camera 
var path = new PathHandler();
var SCREEN_DIRTY = false;
var WIDTH = 0, HEIGHT = 0;
var FPS = 60; // Can only be changed at start of game 
var time_step = (1000/FPS)/1000;

// Beginning initialization 
function init(){
  // Window size 
  WIDTH = window.innerWidth, HEIGHT = window.innerHeight;

  // Setup program 
  path.init();
  initIO();
        
  /** Setup renderer */
  // Create Renderer
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(WIDTH, HEIGHT);
  // Set the background color of the scene.
  renderer.setClearColor(new THREE.Color(0x353539));
  renderer.autoClear = false;               // Tell renderer not to auto clear
  renderer.shadowMapCullFace = THREE.CullFaceBack; // Set the cull face 
  
  document.body.appendChild(renderer.domElement);

  SCREEN_DIRTY = true;
}

/** Main Loop **/
function gameLoop(){
  // Update 
  path.update();
  updateButtons();

  // Draw 
  redraw();
}

/** Redraw the display **/ 
function redraw() 
{
  // Render
  if (SCREEN_DIRTY){
    renderer.clear();
    path.draw();
  }
}

// Setup 
init();

//enter game loop
setInterval(gameLoop, 1000 / FPS);

