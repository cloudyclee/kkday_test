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
		const isLoading = computed(() => {
			return store.getters.getIsLoading;
		});
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

		const storiesMeta = apiGetStoriesMeta();

		const getImg = () => {
			store
				.dispatch("handleImgArr", {
					array: storiesMeta.idList,
					w_arr: storiesMeta.weightList,
				})
				.then((res) => {
					store.dispatch("handleLoading");
				})
				.catch((err) => {
					console.log(err);
					getImg();
				});
		};
		getImg();

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
			nowImg,
			imgUrl,
			imgArr,
			isLoading,
		};
	},
};
</script>

<template>
	<transition name="loadingFrame">
		<LoadingFrame :isLoading="isLoading" />
	</transition>
	<div
		class="blur_bg"
		:style="{
			backgroundImage: `url('${imgUrl}')`,
		}"
	></div>
	<div id="stories">
		<Button />
		<div class="story">
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

.blur_bg
	position: absolute
	width: 100%
	height: 100%
	background-size: cover
	filter: blur(50px)
	z-index: 1
#stories
	width: 100vh * 9/16
	height: 100%
	margin: 0 auto
	overflow: initial
	.story
		position: relative
		width: 100%
		height: 100%
		overflow: hidden
		z-index: 5
		.imgSlider
			width: 100%
			height: 100%
			white-space: nowrap
.loadingFrame-enter-active, .loadingFrame-leave-active
    transition: 0.3s ease
.loadingFrame-leave-to
    opacity: 0
.loadingFrame-enter-to, .loadingFrame-leave-form
    opacity: 1
@media screen and (max-width: 576px)
	#stories
		width: auto
		.stop
			right: 10px
		.story
			width: 100%
</style>
