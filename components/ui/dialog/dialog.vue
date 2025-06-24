<template>
  <!-- Dialog 遮罩層，self 代表只有點擊自己才關閉 -->
  <!-- <div class="hm-dialog__wrapper" v-show="visible" @click.self="handleClose"> -->
  <transition appear name="dialog-fade">
    <div class="hm-dialog__wrapper" v-if="visible">
      <div class="hm-dialog" :style="{ width, height, marginTop: top }">
        <div class="hm-dialog__header" :style="{ backgroundColor: headerColor }">
          <slot name="title">
            <span class="hm-dialog__title">{{ title }}</span>
          </slot>
          <!-- <button class="closeit" type="button" @click="handleClose"> -->
          <!-- <button class="hm-dialog__headerbtn" type="button" @click="handleClose"> -->
          <!-- <span class="bi-x-lg" style="font-size: 25px; margin-right: 5px" /> -->
          <!-- <i class="bi bi-x-lg"></i> -->
          <span class="closeit" @click="handleClose" type="button" v-if="closeable">×</span>
          <!-- ╳ -->
          <!-- </button> -->
        </div>
        <div class="hm-dialog__body">
          <!-- Dialog 內容，默認插槽 -->
          <slot></slot>
        </div>
        <div class="hm-dialog__footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
export default {
  name: "HmDialog",
};
</script>
<script setup lang="ts">
const emits = defineEmits(["update:visible", "closeDialog"]);

withDefaults(
  defineProps({
    title: string,
    width: string,
    height: string,
    top: string,
    headerColor: string,
    visible: boolean,
    closeable: boolean,
  }),
  {
    title: "提示",
    width: "50%",
    height: "",
    top: "15vh",
    headerColor: "#8ec31f",
    visible: false,
    closeable: true,
  },
);

const handleClose = () => {
  // 直接修改父元件 visible 的值
  emits("update:visible", false);
  emits("closeDialog");
};
</script>
<style lang="scss" scoped>
.hm-dialog__wrapper {
  background-color: rgba(0, 0, 0, 0.5);
  overflow: hidden;
  margin: 0px 0px 0px 0px;
  position: fixed;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  z-index: 1000;

  .hm-dialog {
    border-radius: 10px;
    position: relative;
    background-color: rgb(255, 255, 255);
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.3);
    box-sizing: border-box;
    margin: 15vh auto 50px auto;

    &__header {
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
      color: rgb(255, 255, 255);
      padding: 20px 20px 10px 20px;

      .hm-dialog__title {
        line-height: 24px;
        font-size: 18px;
        color: rgb(48, 49, 51);
      }

      .hm-dialog__headerbtn {
        font-size: 16px;
        color: rgb(255, 255, 255);
        background-color: transparent;
        border: none;
        outline: none;
        cursor: pointer;
        padding: 0px 0px 0px 0px;
        position: absolute;
        top: 20px;
        right: 20px;
      }
    }

    &__body {
      max-height: calc(100vh - 70px);
      color: rgb(96, 98, 102);
      word-wrap: break-all;
      overflow-y: auto;
      padding: 0px 0px 0px 0px;
    }

    &__footer {
      text-align: right;
      box-sizing: border-box;
      padding: 10px 20px 20px 20px;
    }
  }
}

.closeit {
  height: 25px;
  width: 25px;
  font-size: 36px;
  font-weight: 100;
  line-height: 36px;
  border: 0px;
  color: rgb(255, 255, 255);
  background-color: rgba(0, 0, 0, 0);
  position: absolute;
  top: 10px;
  right: 20px;
  transition: 0.3s;

  &:hover {
    height: 35px;
    width: 35px;
    font-size: 60px;
  }
}

.dialog-fade-enter-active {
  animation: dialogFade 0.5s;
}

.dialog-fade-leave-active {
  animation: dialogFade 0.5s reverse;
}

@keyframes dialogFade {
  0% {
    opacity: 0;
    transform: translateY(-20px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

</style>
