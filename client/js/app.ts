/**
 * insert important comment here
 */

import Boot from "./states/boot";
import Main from "./states/main";
import Preload from "./states/preload";

class App extends Phaser.Game {

  constructor() {
    super(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO);

    this.state.add("boot", Boot, false);
    this.state.add("preload", Preload, false);
    this.state.add("main", Main, false);

    this.state.start("boot");
  }

}

export default App;
