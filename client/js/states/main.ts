class Main extends Phaser.State {

  public preload() {
    console.log("main preload");
  }

  public create() {
    console.log("main create");

    this.game.stage.backgroundColor = "#cecece";
  }

  public update() {
    console.log("main update");
  }

}

export default Main;
