class Preload extends Phaser.State {

  public preload() {
    console.log("preload preload");

    // preload required assets
    this.game.load.image('isaac', 'img/isaac.png');
    this.game.load.image('ground', 'img/ground57.png');
  }

  public create() {
    console.log("preload create");
    //this.game.add.sprite(0, 0, 'isaac');
    this.game.state.start("main");
  }

}

export default Preload;
