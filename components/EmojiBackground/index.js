/**
 * Copyright (c) 2019-present, My-Link Corporation S.A de C.V.
 * All rights reserved.
 * 
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Eduardo Dorantes <eduardo-dorantes@my-link.com>
 */

'use strict';

import React from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';
import EmojiPack from '../../constants/EmojiPack';

class PostEmojiColoresBackground extends React.Component{
    render(){
        const width             =   this.props.width;
        const height            =   this.props.height;
        const source            =   this.props.source ? this.props.source: undefined;
        const size				=	48;
		const degrees			=	["270deg", "45deg", "0deg", "-45deg"];
		const columns			=	(Math.round(width / size) + 1);
		const rows				=	(Math.round(height / size) + 1);
		const gridItems			=	[];
		for(var i = 0; i < columns; i++){
			for(var j = 0; j < rows; j++){
				var show	= j % 2 == 0 ? (i % 2 == 0 ? true : false) : (i % 2 == 1 ? true : false);
				var n		= j % 4;
				var degree	= degrees[n];
				if(show){
					gridItems.push(
						<View style={{
							width: size,
							height: size,
							backgroundColor: 'transparent',
							position: 'absolute',
							top: size * i,
							left: size * j,
                            transform: [{ rotateZ: degree}],
                            zIndex: 0
						}}
						key={i + " - " + j}>
							<Animatable.Image
								source={source}
                                style={{width: size, height: size}}
                                animation="pulse"
                                easing="ease-in"
                                iterationCount="infinite"
							/>
						</View>
					)
				}
			}
        }
        
        return(
            <View style={{flex: 1}}>
                {gridItems}
            </View>
        );

    }
}

export default PostEmojiColoresBackground;