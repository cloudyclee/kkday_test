const weighted_random = ( array, w_arr, n = 6 ) => {
    let total = 0;
    let selected_arr = [];
    let output_arr = [];
    w_arr.forEach( elem => {
        total += elem;
    } );

    for ( let i = 0; i < w_arr.length; i++ ) {
        for ( let j = 0; j < w_arr[ i ]; j++ ) {
            selected_arr.push( array[ i ] );
        }
    }

    while ( output_arr.length < n ) {
        let randomN = Math.floor( Math.random() * selected_arr.length );
        if ( output_arr.indexOf( selected_arr[ randomN ] ) === -1 ) {
            output_arr.push( selected_arr[ randomN ] );
        } else {
            continue;
        }
    }
    return output_arr;
};

export const pickFn = weighted_random;