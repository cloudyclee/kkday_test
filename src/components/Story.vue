<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
	props: ["img"],
	setup() {
		const store = useStore();
		const nowImg = computed(() => {
			return store.getters.getNowImg;
		});

		return {
			nowImg,
		};
	},
};
</script>

<template>
	<transition name="fade">
		<div class="img_container" v-show="nowImg === img.index">
			<img :src="img.imageUrl" alt="旅遊故事" />
			<div class="story__text">{{ img.text }}</div>
		</div>
	</transition>
</template>

<style lang="sass" scoped>
.img_container
    display: inline-block
    width: 100%
    height: 100%
    position: relative
    transition: 0.3s ease
    img
        position: absolute
        width: auto
        height: 100%
        left: 50%
        top: 0
        transform: translateX(-50%)
    .story__text
        position: absolute
        width: calc(100% - 20px)
        left: 0
        top: 100%
        transform: translateY(-100%)
        padding: 40px 10px
        background: linear-gradient(to bottom, rgba(0, 0, 0, 0) 0%, rgba(#333, 0.25) 15%, rgba(#333, 0.5) 30%)
        text-align: center
        font-size: 20px
        color: #fff
        line-height: 1.5
        white-space: normal
        word-break: break-word
.fade-leave-to, .fade-enter-from
    opacity: 0
.fade-enter-to, .fade-leave-form
    opacity: 1
@media screen and (max-width: 576px)
    .img_container
        img
            top: 50%
            min-width: 100%
            transform: translate(-50%, -50%)
            min-height: 100%
            height: auto
</style>
