<template>
  <div class="outer_holder">
    <div class="promo_holder d_layout_col d_layout_center_all">
      <p class="title d_mb10" v-html="title"></p>
      <p class="subtitle d_mb30" v-html="subtitle"></p>
      <a-carousel arrows dotsClass="dotsP" autoplay>
        <div slot="prevArrow" class="custom-slick-arrow" style="left: 10px;zIndex: 1">
          <a-icon type="left-circle" />
        </div>
        <div slot="nextArrow" class="custom-slick-arrow" style="right: 10px">
          <a-icon type="right-circle" />
        </div>
        <div v-for="item in items" :key="item.icon" class="d_layout_col item d_layout_center_all">
          <span class="mdi " :class="item.icon"></span>
          <p v-html="item.text"></p>
        </div>
      </a-carousel>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    title: String,
    subtitle: String,
    items: Array,
  },
};
</script>
<style scoped lang="scss">
.promo_holder {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  text-align: center;
  background: #ff0099; /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #493240, #ff0099); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to right, #493240, #ff0099); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
  border-radius: 20px;
  padding: 20px;
  color: white;
  .title {
    font-weight: bold;
    opacity: 1;
    text-transform: unset;
    font-size: 14.5px;
    width: 80%;
  }
  .subtitle {
    font-size: 11.5px;
    letter-spacing: 1px;
    text-transform: uppercase;
    opacity: 0.7;
  }
  .ant-carousel {
    width: 100%;
    text-align: center;
    margin: 20px auto;
    color: white;
    .slick-slide {
      text-align: center;
      overflow: hidden;
      .item {
        width: 320px !important;
        margin: 0 auto !important;
        h3 {
          font-size: 20px;
          opacity: 0.7;
        }
        h2 {
          font-size: 15px;
          font-style: italic;
          opacity: 0.7;
          text-align: center;
          margin-bottom: 30px;
        }
      }
    }

    .custom-slick-arrow {
      width: 25px;
      height: 25px;
      font-size: 25px;
      display: block;
      color: white;
      background: transparent;
      opacity: 0.5;
      &::before {
        display: none;
      }
      &:hover {
        opacity: 1;
      }
    }
  }
}
</style>
<style lang="scss">
.promo_holder {
  .dotsP {
    margin-top: 50px;
    bottom: auto;
    li > button {
      width: 10px !important;
      height: 10px !important;
      border-radius: 50%;
    }
  }
}
</style>
