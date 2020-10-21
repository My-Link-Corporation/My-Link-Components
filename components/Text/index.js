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
import { Text } from 'react-native';
import Colors from '../../constants/Colors';

const Regular			= "HelveticaNeueLt";//"HelveticaNeueMed";
const Thin				= "HelveticaNeueLt";
const Condensed			= "";
const Bold				= "";
const PublicationTitle		= "HelveticaNeueLTPro-HvCn";//HelveticaNeueLTPro-BdOu
const PublicationTitleColor = "HelveticaNeueLTPro-BdOu";

export default class AppText extends React.Component {
	constructor(props){
		super(props)
	}
	
	render(){
		var fontFamily	= Regular;
		fontFamily		= this.props.Regular ? Regular : fontFamily;
		fontFamily		= this.props.PublicationTitle ? PublicationTitle : fontFamily;
		fontFamily		= this.props.PublicationTitleColor ? PublicationTitleColor : fontFamily;
		//fontFamily		
		return(
			<Text
				{...this.props}
				allowFontScaling={false}
				style={[
					{fontFamily: fontFamily, color: Colors.defaultTextColor},
					this.props.style
				]}
			/>
		);
	}
}
