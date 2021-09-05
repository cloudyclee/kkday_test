<script>
import { reactive, ref, computed, onMounted, watch } from "vue";
import { useStore } from "vuex";
import { apiGetStoriesMeta } from "./api/stories-api";
import Button from "./components/Button.vue";
import Story from "./components/Story.vue";
import LoadingFrame from "./components/LoadingFrame.vue";
export default {
	components: {
		Button,
		Story,
		LoadingFrame,
	},
	setup() {
		const store = useStore();
		let timer = null;
		const isStop = ref(false);
		const time = ref([0, 0, 0, 0, 0, 0]);
		const isLoading = ref(true);
		const nowImg = computed(() => {
			return store.getters.getNowImg;
		});
		const imgArr = computed(() => {
			return store.getters.getImgArr;
		});
		const imgUrl = computed(() => {
			return imgArr.value[nowImg.value]
				? imgArr.value[nowImg.value].imageUrl
				: "";
		});
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
		const storiesMeta = apiGetStoriesMeta();
		const timeCount = () => {
			time.value[nowImg.value] = 0;
			timer = setInterval(() => {
				if (
					time.value[nowImg.value] * 1000 <
					imgArr.value[nowImg.value].duration
				) {
					time.value[nowImg.value]++;
				} else {
					clearInterval(timer);
					store.dispatch("handleIncrease");
					timeCount();
				}
			}, 1000);
		};
		const getImg = () => {
			store
				.dispatch("handleImgArr", {
					array: storiesMeta.idList,
					w_arr: storiesMeta.weightList,
				})
				.then((res) => {
					isLoading.value = false;
					timeCount();
				})
				.catch((err) => {
					console.log(err);
					getImg();
				});
		};
		const stopInterval = () => {
			if (!isStop.value) {
				clearInterval(timer);
			} else {
				timeCount();
			}
			isStop.value = !isStop.value;
		};
		getImg();
		console.log(isMobileDevice.value);

		watch(
			() => nowImg.value,
			(nv, ov) => {
				console.log(nv, ov);
				if (nv < ov) {
					time.value.forEach((item, idx) => {
						if (idx >= nv) {
							item = 0;
						}
					});
					console.log(time.value);
				} else {
					time.value.forEach((item, idx) => {
						if (idx < nv) {
							if (imgArr.value[idx])
								item = imgArr.value[idx].duration;
						} else {
							item = 0;
						}
					});
				}
			},
			{ deep: true }
		);

		// run test for random pick
		// let stat = new Array(15).fill(0);
		// for (let i = 0; i < 5000; i++) {
		// 	const test = pickFn(storiesMeta.idList, storiesMeta.weightList);
		// 	test.forEach((item) => {
		// 		const index = storiesMeta.idList.indexOf(item);
		// 		stat[index]++;
		// 	});
		// }
		// console.log(stat);

		return {
			time,
			nowImg,
			imgUrl,
			imgArr,
			isLoading,
			stopInterval,
			isStop,
			isMobileDevice,
		};
	},
};
</script>

<template>
	<transition name="loadingFrame">
		<LoadingFrame :isLoading="isLoading" />
	</transition>
	<div id="stories">
		<div
			class="stop"
			@click.prevent="stopInterval"
			v-if="!isMobileDevice"
			>{{ isStop ? "▲" : "=" }}</div
		>
		<Button :isMobileDevice="isMobileDevice" />
		<div
			class="blur_bg"
			:style="{
				backgroundImage: `url('${imgUrl}')`,
			}"
		></div>
		<div class="story" @dblclick="stopInterval">
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
						:class="[
							'imgBar_inner',
							{ ani_progress: time[idx] !== 0 },
						]"
					></div>
				</div>
			</div>
			<Story v-for="item in imgArr" :key="item" :img="item" />
		</div>
	</div>
</template>

<style lang="sass">
*
	user-select: none

html, body, #app, #stories
	position: relative
	width: 100%
	height: 100%
	margin: 0px
	padding: 0px
	overflow: hidden

#stories
	background-color: rgba(#000, 0.8)
	.blur_bg
		position: absolute
		width: 100%
		height: 100%
		background-size: cover
		filter: blur(50px)
		z-index: 1
	.story
		position: relative
		width: 100vh * 9/16
		height: 100%
		overflow: hidden
		margin: 0 auto
		z-index: 5
		.imgSlider
			width: 100%
			height: 100%
			white-space: nowrap
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

.loadingFrame-enter-active, .loadingFrame-leave-active
    transition: 0.3s ease
.loadingFrame-leave-to
    opacity: 0
.loadingFrame-enter-to, .loadingFrame-leave-form
    opacity: 1
@media screen and (max-width: 576px)
	#stories
		.stop
			right: 10px
		.story
			width: 100%
</style>
