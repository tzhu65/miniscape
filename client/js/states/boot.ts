/**
 * booting class to load stuff in
 */

class Boot extends Phaser.State {

  public create() {
    console.log("boot create");

    // set scaling to show everything and keep proportions
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;

    // set the physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.state.start("preload");
  }

}

export default Boot;
