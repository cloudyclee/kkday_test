import { createStore } from 'vuex';
import { pickFn } from "../functions/alg_random";
import { apiGetStoryByIdUnstable } from "../api/stories-api";

export default createStore( {
	state: {
		imgArr: [],
		nowImg: 0
	},
	actions: {
		handleImgArr ( { commit }, payload ) {
			const PromiseImgArr = async _ => {
				const { array, w_arr } = payload;
				const storiesID = pickFn( array, w_arr );
				const imgArr = [];
				let index = 0;
				for ( let i = 0; i < storiesID.length; i++ ) {
					try {
						let img = await apiGetStoryByIdUnstable( storiesID[ i ] );
						if ( img ) {
							img.index = index;
							imgArr.push( img );
							index++;
						} else {
							throw new Error( "item not get" );
						}
					} catch ( err ) {
						console.log( err );
					}
				};

				if ( imgArr.length === 0 ) {
					throw new Error( "no item" );
				}
				commit( "setImgArr", imgArr );
				return imgArr;
			};

			return new Promise( ( resolve, reject ) => {
				PromiseImgArr().then( res => resolve( res ), err => reject( err ) );
			} );
		},
		handleIncrease ( { commit } ) {
			commit( "setNowImg", 1 );
		},
		handleDecrease ( { commit } ) {
			commit( "setNowImg", -1 );
		}
	},
	mutations: {
		setImgArr ( state, payload ) {
			state.imgArr = payload;
		},
		setNowImg ( state, payload ) {
			if ( payload > 0 ) {
				if ( state.nowImg < state.imgArr.length - 1 ) {
					state.nowImg++;
				} else {
					state.nowImg = 0;
				}
			} else {
				if ( state.nowImg > 0 ) {
					state.nowImg--;
				} else {
					state.nowImg = state.imgArr.length - 1;
				}
			}
		}
	},
	getters: {
		getImgArr ( state ) {
			return state.imgArr;
		},
		getNowImg ( state ) {
			return state.nowImg;
		}
	}
} );
