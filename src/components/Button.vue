<script>
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { compileFunction } from "vm";
export default {
	props: ["isMobileDevice"],
	setup() {
		const store = useStore();
		let timer = null;
		const isStop = ref(false);
		const isAnimated = ref([true, true, true, true, true, true]);
		const isMobileDevice = computed(() => {
			const mobileDevice = [
				"Android",
				"webOS",
				"iPhone",
				"iPad",
				"iPod",
				"BlackBerry",
				"Windows Phone",
			];
			let isMobileDevice = mobileDevice.some((e) =>
				navigator.userAgent.match(e)
			);
			return isMobileDevice;
		});
		const time = ref([0, 0, 0, 0, 0, 0]);

		const isLoading = computed(() => {
			return store.getters.getIsLoading;
		});
		const nowImg = computed(() => {
			return store.getters.getNowImg;
		});
		const imgArr = computed(() => {
			return store.getters.getImgArr;
		});

		const timeCount = () => {
			timer = setInterval(() => {
				if (
					time.value[nowImg.value] * 1000 <
					imgArr.value[nowImg.value].duration
				) {
					isAnimated.value[nowImg.value] = true;
					time.value[nowImg.value]++;
				} else {
					clearInterval(timer);
					store.dispatch("handleIncrease");
					timeCount();
				}
			}, 1000);
		};
		const stopInterval = () => {
			if (!isStop.value) {
				clearInterval(timer);
			} else {
				timeCount();
			}
			isStop.value = !isStop.value;
		};

		const nextImg = () => {
			store.dispatch("handleIncrease");
		};
		const preImg = () => {
			console.log("hi");
			store.dispatch("handleDecrease");
		};

		watch(
			() => isLoading.value,
			(nv) => {
				if (!nv) {
					timeCount();
				}
			}
		);
		watch(
			() => nowImg.value,
			(nv, ov) => {
				if (nv < ov) {
					for (let i = 0; i < time.value.length; i++) {
						if (i >= nv) {
							time.value[i] = 0;
							isAnimated.value[i] = false;
						}
					}
				} else {
					for (let i = 0; i < time.value.length; i++) {
						if (i < nv) {
							if (imgArr.value[i]) {
								time.value[i] = imgArr.value[i].duration / 1000;
								isAnimated.value[i] = false;
							}
						}
					}
				}
			},
			{ deep: true }
		);

		return {
			imgArr,
			time,
			nextImg,
			preImg,
			isStop,
			isAnimated,
			isMobileDevice,
			stopInterval,
		};
	},
};
</script>

<template>
	<div class="stop" @click.prevent="stopInterval" v-if="!isMobileDevice">{{
		isStop ? "▲" : "="
	}}</div>
	<div class="imgBars">
		<div
			class="imgBar"
			v-for="(item, idx) in imgArr"
			:key="item"
			:style="{ width: `calc(90% / ${imgArr.length})` }"
		>
			<div
				:style="{
					width: `${(time[idx] * 100000) / item.duration}%`,
				}"
				:class="['imgBar_inner', { ani_progress: isAnimated[idx] }]"
			></div>
		</div>
	</div>
	<div class="buttons">
		<div class="button" @click="preImg" v-if="!isMobileDevice">‹</div>
		<div
			class="mobile_button"
			@touchstart="preImg"
			v-if="isMobileDevice"
		></div>
		<div
			class="mobile_button"
			@touchstart="stopInterval"
			@touchend="stopInterval"
			v-if="isMobileDevice"
		></div>
		<div
			class="mobile_button"
			@touchstart="nextImg"
			v-if="isMobileDevice"
		></div>
		<div class="button" @click="nextImg" v-if="!isMobileDevice">›</div>
	</div>
</template>

<style lang="sass" scoped>
.imgBars
    position: absolute
    display: flex
    justify-content: space-around
    align-items: center
    width: calc(100% - 10px)
    height: 5px
    padding: 5px
    z-index: 50
    .imgBar
        height: 5px
        background-color: rgba(gray, 0.8)
        border-radius: 5px
        .imgBar_inner
            width: 100%
            height: 100%
            border-radius: 5px
            background-color: #fff
            &.ani_progress
                transition: 1s linear
.stop
    position: absolute
    right: calc(50% - 100vh * 9/32 + 10px)
    bottom: 10px
    width: 30px
    height: 30px
    border-radius: 100%
    font-size: 24px
    line-height: 30px
    text-align: center
    transform: rotate(90deg)
    background-color: #000
    color: #fff
    z-index: 200
    cursor: pointer
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
    z-index: 50
    .button
        position: relative
        width: 30px
        height: 30px
        border-radius: 100%
        background-color: #ddd
        text-align: center
        line-height: 30px
        font-size: 20px
        cursor: pointer
    .mobile_button
        position: relative
        width: 30%
        height: 100%
        z-index: 50
        cursor: pointer
    .mobile_button:nth-child(2)
        width: 40%
</style>
