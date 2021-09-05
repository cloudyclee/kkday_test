<script>
export default {
	props: ["isLoading"],
};
</script>

<template>
	<div class="frame" v-if="isLoading">
		<div class="loagingBalls">
			<div class="ball"></div>
			<div class="ball"></div>
			<div class="ball"></div>
			<div class="ball"></div>
			<div class="ball"></div>
		</div>
	</div>
</template>

<style lang="sass" scoped>
.frame
    position: absolute
    left: 0
    top: 0
    width: 100%
    height: 100%
    background-color: rgba(#000, 0.9)
    z-index: 1000
    .loagingBalls
        position: absolute
        left: 50%
        top: 50%
        width: 20%
        height: 10px
        display: flex
        justify-content: space-around
        align-items: center
        transform: translate(-50%, -50%)
        .ball
            width: 10px
            height: 10px
            border-radius: 100%
            background-color: #fff
            transform: translateY(0)
            animation: ballJump 1s linear infinite
        .ball:nth-child(2)
            animation-delay: 0.1s
        .ball:nth-child(3)
            animation-delay: 0.3s
        .ball:nth-child(4)
            animation-delay: 0.5s
        .ball:nth-child(5)
            animation-delay: 0.7s

@keyframes ballJump
    0%
        transform: translateY(0px)
    25%
        transform: translateY(-15px)
    50%
        transform: translateY(0px)
    75%
        transform: translateY(15px)
    100%
        transform: translateY(0px)
</style>
