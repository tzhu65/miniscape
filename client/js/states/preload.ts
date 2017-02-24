class Preload extends Phaser.State {

  public preload() {
    console.log("preload preload");

    // preload required assets
    this.game.load.image("ground47", "img/ground47.png");
  }

  public create() {
    console.log("preload create");
    this.game.state.start("main");
  }

}

export default Preload;
