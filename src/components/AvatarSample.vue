<template>
  <img :src="src" :alt="alt" class="avatar" />
</template>

<script>
export default {
  props: {
    src: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: 'Avatar'
    }
  }
}
</script>

<style>
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 10px;
}
</style>