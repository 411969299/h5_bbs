<style lang="less">
  @import "../../styles/base/base-750";

  .name {
    display: inline;
    color: #3D83D7;
  }

  .details_plug {
    .width(700);
    .height(150);
    .margin-top(20);
    border: 1px solid #EEEEEE;
    background: #F7F7F7;

    > img {
      float: left;
      .width(148);
      .height(148);
    }

    .abstract {
      float: left;
      .width(500);
      .height(121);
      .margin(13, 20, 16, 27);

      > h6 {
        .font-size(30);
        font-weight: normal;
        -webkit-margin-before: 0;
        -webkit-margin-after: 0;
        color: #595959;
      }

      > p {
        .font-size(26);
        .margin-top(5);
        color: #A7A7A7;
        overflow: hidden;
        word-break: break-all;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        -ms-line-clamp: 2;
        -ms-box-orient: vertical;
      }
    }
  }
</style>

<template>
  <div class="details_plug" v-link="{path: '/forum_detail?postId=' + id}">
    <img :src="img" data-ignore="1" />
    <div class="abstract clearfix">
      <h6>{{ name }}</h6>
      <p>{{ title }}</p>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      id: {
        type: Number,
        required: true
      },
      img: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      title: {
        type: String,
        required: true
      }
    }
  }
</script>
