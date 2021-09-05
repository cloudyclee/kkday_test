<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
	props: ["isMobileDevice"],
	setup() {
		const store = useStore();
		const nowImg = computed(() => {
			return store.getters.getNowImg;
		});
		const nextImg = () => {
			store.dispatch("handleIncrease");
		};
		const preImg = () => {
			store.dispatch("handleDecrease");
		};

		return {
			nextImg,
			preImg,
		};
	},
};
</script>

<template>
	<div class="buttons">
		<div class="button" @click="preImg" v-if="!isMobileDevice">‹</div>
		<div class="mobile_button" @click="preImg" v-if="isMobileDevice"></div>
		<div class="mobile_button" @click="nextImg" v-if="isMobileDevice"></div>
		<div class="button" @click="nextImg" v-if="!isMobileDevice">›</div>
	</div>
</template>

<style lang="sass" scoped>
.buttons
    position: absolute
    width: calc(100vh * 9/16 + 70px)
    height: 100%
    left: 50%
    top: 0
    transform: translateX(-50%)
    display: flex
    justify-content: space-between
    align-items: center
    z-index: 10
    .button
        position: relative
        width: 30px
        height: 30px
        border-radius: 100%
        background-color: #ddd
        text-align: center
        line-height: 30px
        font-size: 20px
        z-index: 10
        cursor: pointer
    .mobile_button
        position: relative
        width: calc((100% - 70px) / 2)
        height: 100%
        z-index: 10
        cursor: pointer
@media screen and (max-width: 576px)
    .buttons
        display: none
</style>
