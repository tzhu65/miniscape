class Main extends Phaser.State {

  cursors : any;
  player: any;
  wasd: any;
  platforms: any;

  public preload() {
    console.log("main preload");
    
  }

  public create() {
    console.log("main create");
    this.cursors = this.game.input.keyboard.createCursorKeys();
    this.player = this.game.add.sprite(this.game.width/2, this.game.height/2, 'isaac');
    this.wasd = {
      w: this.game.input.keyboard.addKey(Phaser.Keyboard.W),
      s: this.game.input.keyboard.addKey(Phaser.Keyboard.S),
      a: this.game.input.keyboard.addKey(Phaser.Keyboard.A),
      d: this.game.input.keyboard.addKey(Phaser.Keyboard.D),
    };

    this.game.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.stage.backgroundColor = "#cecece";

    this.platforms = this.game.add.group();
    this.platforms.enableBody = true;

    for (var i=100; i<this.game.world.height - 50; i+=50){
      var wall = this.platforms.create(i, 50, 'ground');
      wall.body.immovable = true;
      wall = this.platforms.create(50, i, 'ground');
      wall.body.immovable = true;
      wall = this.platforms.create(this.game.world.height - 50, i, 'ground');
      wall.body.immovable = true;
      wall = this.platforms.create(i, this.game.world.height - 50, 'ground');
      wall.body.immovable = true;
    }
  }

  public update() {

    var hitPlatform = this.game.physics.arcade.collide(this.player, this.platforms);

    this.player.body.velocity.x = 0;
    this.player.body.velocity.y = 0;

    if (this.wasd.a.isDown){
      this.player.body.velocity.x = -500;
    }
    else if (this.wasd.d.isDown){
      this.player.body.velocity.x = 500;
    }
    if (this.wasd.w.isDown){
      this.player.body.velocity.y = -500;
    }
    else if (this.wasd.s.isDown){
      this.player.body.velocity.y =  500;
    }
    else{
      this.player.animations.stop();
    }
  }

}

export default Main;
