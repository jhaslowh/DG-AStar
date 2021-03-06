/** UI Handler for the game **/
function UIHandler(){
	// Scene to hold all geometry 
	this.scene = new THREE.Scene();

	// Components 
	this.children = [];
	this.currentBrush;
}

/** Update UI State **/
UIHandler.prototype.update = function(){
	for (var i = 0; i < this.children.length; i++)
		this.children[i].update();
}

/** Draw UI **/
UIHandler.prototype.draw = function(){
	renderer.render(this.scene, camera);
}

/** ================================= **/
/** Button                            **/
/** ================================= **/

/** Basic button structure **/
function mButton(x,y,width,height,image, clickFunc){
	// Location
	this.x = x;
	this.y = y;
	// Size
	this.w = width;
	this.h = height;
	// States
	this.clicked = false;
	this.onClick = clickFunc;
	// Mesh
	this.mesh = makeSprite(width,height,image);
	this.mesh.position.set(x,y,0);

	// Set this to true to use these
	this.useAdvancedRendering = false;
	this.drawState = ButtonState.Normal;
	// Normal Texture
	this.tNormal = this.mesh.material.map;
	// Hover Texture
	this.tHover; 
	// Clicked Texture
	this.tClick;
}

/** Brush Types */
var ButtonState = { 
  "Normal": 0,
  "Hover": 1, 
  "Click": 2
};

/** Update Button state **/
mButton.prototype.update = function(){
	// Check if clicked 
	if (this.contains(mouse.x, mouse.y)){
		// Change to hovering picture
		if (this.useAdvancedRendering && this.drawState != ButtonState.Hover) {
			this.mesh.material.map = this.tHover;
			this.drawState = ButtonState.Hover;
			SCREEN_DIRTY = true;
		}
		if (mouse.left_down){
			// Change to clicked picture 
			if (this.useAdvancedRendering && this.drawState != ButtonState.Click) {
				this.mesh.material.map = this.tClick;
				this.drawState = ButtonState.Click;
				SCREEN_DIRTY = true;
			}
			
			// Check if clicked 
			if (!mouse.left_down_old){
				if (this.onClick != null)
					this.onClick();
				else 
					clicked = true;
			}
		}
	}
	else {
		// Change to normal picture 
		if (this.useAdvancedRendering && this.drawState != ButtonState.Normal) {
			this.mesh.material.map = this.tNormal;
			this.drawState = ButtonState.Normal;
			SCREEN_DIRTY = true;
		}
	}
}

/** Check if a location is inside button */
mButton.prototype.contains = function(x,y){
	if (x > this.x && x < this.x + this.w &&
		y > this.y && y < this.y + this.h)
		return true;
	return false;
}

/** Check if button has been clicked **/
mButton.prototype.isClicked = function(){
	if (clicked){
		clicked = false;
		return true;
	}
	return false;
}

/** ================================= **/
/**   Helper Code             **/
/** ================================= **/

/** Make a sprite **/
function makeSprite(width, height, texPath){
	// Load the texture file 
	var texture = null;
	if (texPath != null) texture = THREE.ImageUtils.loadTexture(texPath);
	// Make a new basic material and give it the texture 
	var mat = new THREE.MeshBasicMaterial({map:texture});
	// Must set this to true or the texture will not draw correctly if there is alpha 
	mat.transparent = true;
	// Make a new blank geometry 
  var geom = new THREE.Geometry(); 
  
  // Add verticies to the geometry 
  geom.vertices.push(new THREE.Vector3(0,0,0));
  geom.vertices.push(new THREE.Vector3(0,height,0));
  geom.vertices.push(new THREE.Vector3(width,height,0));
  geom.vertices.push(new THREE.Vector3(width,0,0));
  
  // Set the geometry faces 
  geom.faces.push(new THREE.Face3(0,1,2));
  geom.faces.push(new THREE.Face3(2,3,0));

  // Set the UV's for the faces 
  if (texture != null){
	  geom.faceVertexUvs[0].push([
	  	new THREE.Vector2(0,1),
	  	new THREE.Vector2(0,0),
	  	new THREE.Vector2(1,0)]);
	  geom.faceVertexUvs[0].push([
	  	new THREE.Vector2(1,0),
	  	new THREE.Vector2(1,1),
	  	new THREE.Vector2(0,1)]);
	  geom.faces[0].normal.set(0,0,1); 
	}

  // Make the mesh 
  return new THREE.Mesh(geom, mat);
}

/** ================================= **/
/**   Initialization Code             **/
/** ================================= **/

UIHandler.prototype.init = function(){
	/** ================ **/
	/** Labels           **/
	/** ================ **/
	// Add Big Lables
	var sprite = makeSprite(128,32,'res/ui_label_controls.png');
	sprite.position.set(10,10,0);
	this.scene.add(sprite);
	sprite = makeSprite(128,32,'res/ui_label_legend.png');
	sprite.position.set(10,200,0);
	this.scene.add(sprite);

	// Add Small Labels 
	sprite = makeSprite(128,32,'res/ui_label_current.png');
	sprite.position.set(16,136,0);
	this.scene.add(sprite);

	/** ================ **/
	/** Buttons          **/
	/** ================ **/

	// Make Reset button 
	var button = new mButton(16,52,72,32,'res/button_reset.png', 
		function(){
			path.resetGridFully();
			SCREEN_DIRTY = true;});
	button.useAdvancedRendering = true;
	button.tHover = THREE.ImageUtils.loadTexture('res/button_reset_hover.png');
	button.tClick = THREE.ImageUtils.loadTexture('res/button_reset_click.png');
	this.scene.add(button.mesh);
	this.children.push(button);

	// Make find path button 
	button = new mButton(98,52,72,32,'res/button_find_path.png', 
		function(){
			path.findPath();
			SCREEN_DIRTY = true;});
	button.useAdvancedRendering = true;
	button.tHover = THREE.ImageUtils.loadTexture('res/button_find_path_hover.png');
	button.tClick = THREE.ImageUtils.loadTexture('res/button_find_path_click.png');
	this.scene.add(button.mesh);
	this.children.push(button);

	// Make generate path button 
	button = new mButton(16,94,72,32,'res/button_gen_obst.png', 
		function(){
			path.generateObstacles(20);
			SCREEN_DIRTY = true;});
	button.useAdvancedRendering = true;
	button.tHover = THREE.ImageUtils.loadTexture('res/button_gen_obst_hover.png');
	button.tClick = THREE.ImageUtils.loadTexture('res/button_gen_obst_click.png');
	this.scene.add(button.mesh);
	this.children.push(button);

	/** ================ **/
	/** Brush Elements   **/
	/** ================ **/
	// Current Brush Icon 
	this.currentBrush = makeSprite(15,15,'res/brush_icon.png');
	this.currentBrush.position.set(70,136,0);
	this.currentBrush.material.color.setHex(COLOR_OBSTACLE_NODE);
	this.scene.add(this.currentBrush);

	// Normal 
	button = new mButton(16,160,15,15,'res/brush_icon.png', 
		function(){
			path.brushType = BrushType.Normal;
			path.ui.currentBrush.material.color.setHex(COLOR_NORMAL_NODE);
			SCREEN_DIRTY = true;});
	button.mesh.material.color.setHex(COLOR_NORMAL_NODE);
	this.scene.add(button.mesh);
	this.children.push(button);

	// Obsticle
	button = new mButton(35,160,15,15,'res/brush_icon.png', 
		function(){
			path.brushType = BrushType.Obstacle;
			path.ui.currentBrush.material.color.setHex(COLOR_OBSTACLE_NODE);
			SCREEN_DIRTY = true;});
	button.mesh.material.color.setHex(COLOR_OBSTACLE_NODE);
	this.scene.add(button.mesh);
	this.children.push(button);

	// Start
	button = new mButton(54,160,15,15,'res/brush_icon.png', 
		function(){
			path.brushType = BrushType.StartLoc;
			path.ui.currentBrush.material.color.setHex(COLOR_START_NODE);
			SCREEN_DIRTY = true;});
	button.mesh.material.color.setHex(COLOR_START_NODE);
	this.scene.add(button.mesh);
	this.children.push(button);

	// Goal
	button = new mButton(73,160,15,15,'res/brush_icon.png', 
		function(){
			path.brushType = BrushType.GoalLoc;
			path.ui.currentBrush.material.color.setHex(COLOR_GOAL_NODE);
			SCREEN_DIRTY = true;});
	button.mesh.material.color.setHex(COLOR_GOAL_NODE);
	this.scene.add(button.mesh);
	this.children.push(button);

	/** ================ **/
	/** Legend           **/
	/** ================ **/

	// Normal legend 
	sprite = makeSprite(15,15,'res/brush_icon.png');
	sprite.material.color.setHex(COLOR_NORMAL_NODE);
	sprite.position.set(16,235,0);
	this.scene.add(sprite);
	sprite = makeSprite(128,32,'res/ui_label_normal.png');
	sprite.position.set(34,235,0);
	this.scene.add(sprite);

	// Obstacle legend 
	sprite = makeSprite(15,15,'res/brush_icon.png');
	sprite.material.color.setHex(COLOR_OBSTACLE_NODE);
	sprite.position.set(16,252,0);
	this.scene.add(sprite);
	sprite = makeSprite(128,32,'res/ui_label_obstacle.png');
	sprite.position.set(34,252,0);
	this.scene.add(sprite);

	// Start legend 
	sprite = makeSprite(15,15,'res/brush_icon.png');
	sprite.material.color.setHex(COLOR_START_NODE);
	sprite.position.set(16,269,0);
	this.scene.add(sprite);
	sprite = makeSprite(128,32,'res/ui_label_startloc.png');
	sprite.position.set(34,269,0);
	this.scene.add(sprite);

	// Goal legend 
	sprite = makeSprite(15,15,'res/brush_icon.png');
	sprite.material.color.setHex(COLOR_GOAL_NODE);
	sprite.position.set(16,286,0);
	this.scene.add(sprite);
	sprite = makeSprite(128,32,'res/ui_label_goalloc.png');
	sprite.position.set(34,286,0);
	this.scene.add(sprite);

	// Open legend 
	sprite = makeSprite(15,15,'res/brush_icon.png');
	sprite.material.color.setHex(COLOR_OPEN_NODE);
	sprite.position.set(16,303,0);
	this.scene.add(sprite);
	sprite = makeSprite(128,32,'res/ui_label_open.png');
	sprite.position.set(34,303,0);
	this.scene.add(sprite);

	// Closed legend 
	sprite = makeSprite(15,15,'res/brush_icon.png');
	sprite.material.color.setHex(COLOR_CLOSED_NODE);
	sprite.position.set(16,320,0);
	this.scene.add(sprite);
	sprite = makeSprite(128,32,'res/ui_label_closed.png');
	sprite.position.set(34,320,0);
	this.scene.add(sprite);

	// Path legend 
	sprite = makeSprite(15,15,'res/brush_icon.png');
	sprite.material.color.setHex(COLOR_FOUNDPATH_NODE);
	sprite.position.set(16,337,0);
	this.scene.add(sprite);
	sprite = makeSprite(128,32,'res/ui_label_path.png');
	sprite.position.set(34,337,0);
	this.scene.add(sprite);
}
