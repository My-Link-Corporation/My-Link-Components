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
import { TextInput } from 'react-native';

export default class AppTextInput extends React.Component {
	constructor(props){
		super(props);
		this.focus	= this.focus.bind(this);
		this.blur	= this.blur.bind(this);
	}
	
	focus = () => {
		this.textInput.focus();
	}
	
	blur = () => {
		this.textInput.blur();
	}
	
	render(){
		return(
			<TextInput
				{...this.props}
				ref={(input) => this.textInput = input}
				allowFontScaling={false}
				style={[
					{ fontFamily: "Helvetica-Neue" + (this.props.Thin ? "-Regular" : this.props.Condensed ? "-Condensed" : "-Thin") },
					this.props.style
				]}
			/>
		);
	}
}
