import {h, Component} from 'preact';
import mojs from 'mo-js';
import {Howl} from 'howler';

import CongratsCounter from './congrats-counter';
import CongratsButton from './congrats-button';
import CongratsTexts from './congrats-texts';
import CongratsBg from './congrats-bg';

require('../../css/blocks/congrats');
const CLS = require('../../css/blocks/congrats.postcss.css.json');

class Congrats extends Component {
  render () {
    const {state} = this.props;
    return  <div className={CLS['congrats']}>
              <CongratsBg timeline={this._timeline} />
              <CongratsTexts timeline={this._timeline} />
              <CongratsButton timeline={this._timeline} />
              <CongratsCounter timeline={this._timeline} state={state} />
            </div>;
  }

  shouldComponentUpdate () {
    this._checkPlay();
    return false;
  }

  componentWillMount() {
    const sound = new Howl({
      src: ['./sounds/applause.mp3', './sounds/applause.wav'],
      volume: .5
    });

    this._timeline = new mojs.Timeline({ onStart() { sound.play(); } });
  }
  componentDidMount() { setTimeout( this._checkPlay.bind(this), 100 ); }

  /*
    Method to check if it is a good time to play animation.
  */
  _checkPlay() {
    const {store} = this.context;
    const state = store.getState();
    const isPlay = state.cards.present.pairsLeft === 0;
    isPlay && this._play();
    isPlay || this._hide();
  }

  /*
    Method to play animation.
  */
  _play() {
    if (this._isPlay === true) { return; }
    this.base.style.display = 'block';
    this._timeline.play();
    this._isPlay = true;
  }

  /*
    Method to hide the component.
  */
  _hide() {
    if (!this._isPlay) { return; }
    if ( this._timeline.progress > 0 ) {
      this._timeline.setProgress(0);
    }
    this.base.style.display = 'none';
    this._isPlay = false;
  }

}

export default Congrats;