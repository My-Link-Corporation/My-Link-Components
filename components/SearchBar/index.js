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
import { View, TouchableOpacity } from 'react-native';
import TextInput from '../TextInput';
import Colors from '../../constants/Colors';
import Icon from '../Icon';
import Layout from '../../constants/Layout';

export default class SearchBar extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			text: ''
		}
		this.onChange = this.onChange.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
		this.focus = this.focus.bind(this);
	}
	
	onChange = (e) => {
		if(this.props.onChange){
			this.props.onChange(e);
		}
	}

	onSubmit = (nativeEvent) => {
		if(this.props.onSubmit){
			this.props.onSubmit(nativeEvent)
		}
	}

	focus = () => {
		this.textInput.focus();
	} 
	
	render(){
		const width = this.props.width ? this.props.width : '100%';
		const border = this.props.borderless ? 0 : 1;
		const align = this.props.align ? this.props.align : 'center';
		return(
			<TouchableOpacity style={{width: '100%', height: 40, padding: 5}} onPress={this.focus} activeOpacity={1}>
				<View style={{
					backgroundColor: Colors.defaultGrayLight,
					height: 30,
					width: width,
					//margin: 5,
					borderRadius: 7,
					alignItems: 'center',
					justifyContent: 'center',
				}}>
					<View style={{
						width: '100%',
						height: '100%',
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: (this.props.noIcon ? 'flex-start' : 'center'),
						padding: 5
					}}>
						{(this.props.value || !this.props.noIcon) &&
							<Icon size={30} factor={1} Borderless name='search'/>
						}
						<View style={{height: 30}}>
							<TextInput
								autoFocus={this.props.autoFocus}
								ref={(c) => this.textInput = c}
								numberOfLines={1}
								multiline={false}
								placeholder={this.props.placeholder}
								onChangeText={this.onChange}
								style={{
									textAlign: 'left',
									fontSize: 15,
									paddingBottom: 5,
									height: 30,
									padding: 0
								}}
								value={this.props.value}
								returnKeyType={"search"}
								onSubmitEditing={this.onSubmit}
							/>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		);
	}
}