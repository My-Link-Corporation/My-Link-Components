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
import { View, Image } from 'react-native';
import Colors from '../../../constants/Colors';
import Text from '../../../components/Text';
import Icon from '../../../components/Icon';
import ProfilePicture from '../../../components/ProfilePicture';
import MapboxGL from '@react-native-mapbox-gl/maps';

class LinknameMarker extends React.Component{
	constructor(props){
		super(props);
	}
	
	render(){
		const LineColor = Colors.personal;
		return(
			<MapboxGL.PointAnnotation
				id={'test'}
				coordinate={[this.props.coordinate.longitude, this.props.coordinate.latitude]}
			>
				<View style={{backgroundColor: 'transparent', width: 56, height: 70}}>
					<View style={{
						zIndex: 2,
						position: 'absolute',
						top: 10,
						left: 0,
						width: 55,
						height: 50,
						backgroundColor: 'transparent'
					}}>
						<ProfilePicture
							linkname={this.props.linkname}
							spacing={1}
							borderColor={LineColor}
						/>
					</View>
					<View style={{
						width: 60,
						position: 'absolute',
						bottom: 0,
						left: 16
					}}>
						<View style={{
							width: 20,
							height: 20,
							borderRadius: 2.5,
							backgroundColor: LineColor,
							borderWidth: 1,
							borderColor: LineColor,
							position: 'absolute',
							transform: [{'rotateZ': '45deg'}],
							position: 'absolute',
							bottom: 3,
							zIndex: 1,
						}}/>
					</View>
				</View>
			</MapboxGL.PointAnnotation>
		)
	}
}

class BusinessMarker extends React.Component{
	constructor(props){
		super(props)
	}
	
	render(){
		const LineColor = Colors.personal;
		return(
			<MapboxGL.PointAnnotation
				id={'test'}
				coordinate={[this.props.coordinate.longitude, this.props.coordinate.latitude]}
			>
				<View style={{
					width: 40,
					height: 40,
					backgroundColor: 'transparent',
					alignItems: 'center',
				}}>
					<View style={{
						width: 32,
						height: 32,
						backgroundColor: LineColor,
						borderRadius: 5,
						alignItems: 'center',
						justifyContent: 'center',
						borderWidth: 1,
						borderColor: 'white',
						position: 'absolute',
						zIndex: 0
					}}/>
					<View style={{
						width: 30,
						height: 30,
						backgroundColor: LineColor,
						borderRadius: 5,
						alignItems: 'center',
						justifyContent: 'center',
						top: 1,
						zIndex: 2
					}}>
						<Icon Borderless forceColor color={'white'} name='personal' factor={0.70}/>
					</View>
					<View style={{
						width: 12,
						height: 12,
						borderRadius: 2.5,
						backgroundColor: LineColor,
						borderWidth: 1,
						borderColor: 'white',
						position: 'absolute',
						transform: [{'rotateZ': '45deg'}],
						bottom: 4,
						zIndex: 1,
					}}/>
				</View>
			</MapboxGL.PointAnnotation>
		);
	}
}

export {
	LinknameMarker,
	BusinessMarker
}