import React, { Component } from "react";
// import { Table, Button, message } from "antd";
import { normalizeData } from "./normalizeData";
import "./app.css";
import {
  registerStore,
  getBlockData,
  getBlockVariables,
} from "@njsdata/bigscreen-sdk";
export default class App extends Component {
  divRef = null;
  state = {
    dataSource: [],
    rowId: "",
    default_value: "",
    current: null,
    durationT: null,
    player: false,
    currentTime: 0,
    duration: null,
    theme: 'light',
    audioSrc: 'https://521dimensions.com/song/FirstSnow-Emancipator.mp3'
  };
  fnref = (el) => {
    this.divRef = el;
  };
  progress = React.createRef()
  audioRf = React.createRef()

  playerFn() {

    if (this.state.player) {
      this.audioRf.current.pause();
    } else {
      this.audioRf.current.play();
    }
    this.setState(
      {
        player: !this.state.player
      }
    )
  }
  changeFn() {
    this.audioRf.current.currentTime = this.progress.current.value
  }
  Time(val) {
    let i = parseInt(val);
    let m = parseInt(val / 60);
    return `${m < 10 ? "0" + m : m}:${i % 60 < 10 ? "0" + (i % 60) : i % 60}`;
  }
  timeupdateListener() {
    let a = this.audioRf.current.currentTime;

    // console.log(this.$refs.);
    let nowTime = this.Time(a)
    this.progress.current.style.backgroundSize = `${(a / this.state.duration) * 100
      }% 100%`;
    this.setState({
      currentTime: a,
      current: nowTime
    });
  }
  componentWillMount() {
    // console.log(getBlockData(), "getBlockData");
    // console.log(getBlockVariables(), "getBlockVariables");



  }
  componentDidMount() {
    let variable = {}
    try {
      variable = getBlockVariables().default_value ? JSON.parse(getBlockVariables().default_value) : null;
    } catch (error) {
      console.log(error);
    }
    // console.log(variable.theme);
    if (Object.keys(variable).length != 0) {
      this.setState({ theme: variable.theme ? variable.theme : 'light', audioSrc: variable.audioSrc ? variable.audioSrc : 'https://521dimensions.com/song/FirstSnow-Emancipator.mp3' })
    }
    if (this.state.theme == "dark") {
      document.documentElement.classList.add("dark");
    }
    const { pubSub } = this.props;
    pubSub &&
      pubSub.subscribe(

      );

    const events = [
    ];

    const actions = [
    ];

    window.componentCenter?.register &&
      window.componentCenter.register(this.props?.componentId, "comp", this, {
        events,
        actions,
      });
    this.props?.updateProcess && this.props.updateProcess();

    this.Event_Center_getName = () => {
      return "音乐播放器";
    };
  }

  durationchangeListener() {
    let d = this.audioRf.current.duration
    let Ztime = this.Time(d)
    let a = this.audioRf.current.currentTime;

    // console.log(this.$refs.);
    let nowTime = this.Time(a)
    this.setState({
      duration: this.audioRf.current.duration,
      currentTime: this.audioRf.current.currentTime,
      durationT: Ztime,
      current: nowTime
    })

  }
  render() {
    const { duration, currentTime, current, durationT, player, audioSrc } = this.state
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div
          className="
        relative
        w-player
        flex flex-col
        rounded-xl
        shadow-player-light
        bg-player-light-background
        border border-player-light-border
        dark:shadow-player-dark
        dark:bg-player-dark-background
        dark:border-player-dark-border
        dark:backdrop-blur-xl
      "
          style={{ height: '100%' }}
        >
          <div className="px-10 pt-10 pb-4 flex items-center z-50" style={{ height: '100%' }} >
            <img
              src="https://521dimensions.com/img/open-source/amplitudejs/album-art/soon-it-will-be-cold-enough.jpg"
              className="
            w-24
            h-24
            rounded-md
            mr-6
            border border-bg-player-light-background
            dark:border-cover-dark-border
          "
              alt=''
            />
            <div className="flex flex-col">
              <span
                className="
              font-sans
              text-lg
              font-medium
              leading-7
              text-slate-900
              dark:text-white
            "
              >First Snow</span>
              <span
                className="
              font-sans
              text-base
              font-medium
              leading-6
              text-gray-500
              dark:text-gray-400
            "
              >Emancipator</span
              >
              <span
                className="
              font-sans
              text-base
              font-medium
              leading-6
              text-gray-500
              dark:text-gray-400
            "
              >Soon It Will Be Cold Enough</span
              >
            </div>
          </div>
          <div className="w-full flex flex-col px-10 pb-6 z-50" style={{ height: '9%' }}>
            <input
              type="range"
              ref={this.progress}
              className="mb-3"
              step=".1"
              min="0"
              value={currentTime}
              onChange={() => { this.changeFn() }}

              max={duration}
            />
            <div className="flex w-full justify-between">
              <span
                className="
              text-xs
              font-sans
              tracking-wide
              font-medium
              text-sky-500
              dark:text-sky-300
            "
              >{current}</span>
              <span
                className="text-xs font-sans tracking-wide font-medium text-gray-500"
              >{durationT}</span>
            </div>
          </div>
          <div
            className="
          h-control-panel
          px-10
          rounded-b-xl
          bg-control-panel-light-background
          border-t border-gray-200
          flex
          items-center
          justify-center
          z-50
          dark:bg-control-panel-dark-background dark:border-gray-900
        "
            style={{ height: '30%' }}
          >
            <div
              className="
            cursor-pointer
            amplitude-play-pause
            w-24
            h-24
            rounded-full
            bg-white
            border border-play-pause-light-border
            shadow-xl
            flex
            items-center
            justify-center
            dark:bg-play-pause-dark-background
            dark:border-play-pause-dark-border
          "
              onClick={(e) => { this.playerFn() }}
              style={{ width: '4.5rem', height: '4.5rem' }}
            >
              <svg
                id="play-icon"
                className={player ? 'visble' : null}
                width="31"
                height="37"
                viewBox="0 0 31 37"
                fill="none"
                style={{ marginLeft: '10px' }}
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M29.6901 16.6608L4.00209 0.747111C2.12875 -0.476923 0.599998 0.421814 0.599998 2.75545V33.643C0.599998 35.9728 2.12747 36.8805 4.00209 35.6514L29.6901 19.7402C29.6901 19.7402 30.6043 19.0973 30.6043 18.2012C30.6043 17.3024 29.6901 16.6608 29.6901 16.6608Z"
                  className="fill-slate-500 dark:fill-slate-400"
                />
              </svg>

              <svg
                id="pause-icon"
                width="24"
                height="36"
                viewBox="0 0 24 36"
                fill="none"
                className={!player ? 'visble' : null}
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="6"
                  height="36"
                  rx="3"
                  className="fill-slate-500 dark:fill-slate-400"
                />
                <rect
                  x="18"
                  width="6"
                  height="36"
                  rx="3"
                  className="fill-slate-500 dark:fill-slate-400"
                />
              </svg>
            </div>

            <div></div>
          </div>


        </div>
        <audio
          ref={this.audioRf}
          className="audio-player"
          src={audioSrc}
          style={{ display: 'block', height: '100px', width: '100px' }}
          onTimeUpdate={() => { this.timeupdateListener() }}
          onDurationChange={() => { this.durationchangeListener() }}

        ></audio>
      </div>
    );
  }
}
