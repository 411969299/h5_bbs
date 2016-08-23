<style lang="less">
  @import "../../../styles/base/base-750";

  .audio_plug {
    display: inline-block;
    .width(254);
    .height(78);
    .border-radius(4);
    border: 1px solid #3483E1;
    overflow: hidden;

    > audio {
      display: none;
    }

    #play_animation {
      float: left;
      display: inline-block;
      .margin(16, 0, 0, 38);
      .width(30);
      .height(46);
      content: '';
      background: url('../../../assets/images/audio.png');
      .background-size(30, 156);
    }

    #play_animation.active_1 {
      .background-position(0, 0);
    }

    #play_animation.active_2 {
      .background-position(0, -55);
    }

    #play_animation.active_3 {
      .background-position(0, -110);
    }

    .time {
      float: right;
      .margin(16, 18, 0, 0);
      .font-size(32);
      color: #3483E1;
    }
  }

  .no_support {
    .font-size(32);
    .padding-left(30);
    color: #999;
  }
</style>

<template>
  <a v-if="support" class="audio_plug" href="javascript:;" @click="playVoice">
    <audio id="audio" :src="src"></audio>
    <span id="play_animation" class="active_3"></span>
    <span class="time">{{ long }}"</span>
  </a>
  <a v-else class="no_support" href="javascript:;">不支持此格式语音播放</a>
</template>

<script>
  export default {
    props: {
      src: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        oPlayAnimation: null,
        oAudio: null,
        bOk: false,
        timer: null,
        long: 1,
        support: true
      }
    },
    ready () {
      this.oPlayAnimation = document.getElementById('play_animation')
      this.oAudio = document.getElementById('audio')
      if (this.oAudio) {
        this.oAudio.addEventListener('loadstart', () => {
          this.long = parseInt(this.oAudio.duration)
          if (isNaN(this.long)) {
            this.support = false
          }
        })
        this.oAudio.addEventListener('canplay', () => {
          this.long = parseInt(this.oAudio.duration)
          this.support = true
        })
        this.oAudio.addEventListener('ended', () => {
          this.bOk = false
          clearInterval(this.timer)
          this.long = parseInt(this.oAudio.duration)
          this.oPlayAnimation.className = 'active_3'
        })
      }
    },
    methods: {
      playVoice () {
        if (this.long) {
          this.bOk = !this.bOk
          let i = 1
          if (this.bOk) {
            this._play()
            this.timer = setInterval(() => {
              this.long = parseInt(this.oAudio.duration - this.oAudio.currentTime)
              this.oPlayAnimation.className = 'active_' + i
              i++
              if (i === 4) {
                i = 1
              }
            }, 400)
          } else {
            this.bOk = false
            this._pause()
            clearInterval(this.timer)
            this.oPlayAnimation.className = 'active_3'
          }
        }
      },
      _play () {
        this.oAudio.play()
      },
      _pause () {
        this.oAudio.pause()
        this.oAudio.currentTime = 0
        this.long = parseInt(this.oAudio.duration)
      }
    }
  }
</script>