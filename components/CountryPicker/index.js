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
import { View, SafeAreaView, FlatList, TouchableOpacity, Image } from 'react-native';
import Text from './Text';
import isoCountries from '../constants/isoCountries';
import Layout from '../constants/Layout';
import SearchBar from './SearchBar';
import FlagPack from '../constants/FlagPack';
import Icon from './Icon';
import { Navigation } from 'react-native-navigation';

const MyLinkLogo = require('../assets/images/logo.png');

export default class CountryPicker extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			filter:		'',
			codes:		[],
			flagRefs:	{},
			visible:	false
		}
		this.isoCountries = undefined;
		this.onFilterChange	= this.onFilterChange.bind(this);
		this.onPress = this.onPress.bind(this);
	}
	
	onPress = (item) => {
		if(this.props.callback){
			this.props.callback({code: item, name: isoCountries[item], image: FlagPack[item]});
			Navigation.pop(this.props.componentId);
		}
	}

	onFilterChange = (text) => {
		this.setState({filter: text});
	}
	
	render(){
		var filteredCodes = Object.keys(isoCountries);
		if(this.state.filter){
			const filter = this.state.filter.trim().toLowerCase();
			filteredCodes = Object.keys(isoCountries).filter((key) => {
				const is = isoCountries[key].toLowerCase().search(filter.toLowerCase()) > -1;
				if(is){
					return key;
				}
			});
		}
		
		return(
			<SafeAreaView style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
				<View style={{width: '100%', height: 60, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					<View style={{width: 50, height: 50, position: 'absolute', top: 5, left: 0, alignItems: 'center', justifyContent: 'center'}}>
						<Icon Borderless factor={1} name="arrow_left" onPress={() => Navigation.pop(this.props.componentId)}/>
					</View>
					<Image source={MyLinkLogo} style={{width: (Layout.window.width/4), height: 40, resizeMode: 'contain'}}/>
				</View>
				<View>
					<SearchBar
						autoFocus
						placeholder="País"
						value={this.state.filter}
						onChange={this.onFilterChange}/>
				</View>
				<FlatList
					data={filteredCodes}
					keyExtractor={(i) => {return i;}}
					renderItem={({item}) => {
						return(
							<TouchableOpacity
								onPress={() => {this.onPress(item)}}
								style={{width: '100%', flexDirection: 'row', height: 40, alignItems: 'center', paddingLeft: 10}}>
								<Image
									source={FlagPack[item]}
									style={{width: 20, height: 20, resizeMode: 'contain', borderRadius: 360, marginRight: 10}}
								/>
								<Text key={item}>{isoCountries[item]}</Text>
							</TouchableOpacity>
						);
					}}
				/>
			</SafeAreaView>
		);
	}
}