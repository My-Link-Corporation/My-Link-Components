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
import MapboxGL from '@react-native-mapbox-gl/maps';
import StyleURL from '../../../constants/MapViewStyles';

export default class MapView extends React.Component{
	constructor(props){
		super(props);
	}
	
	render(){
		const coordinate			= this.props.coordinate;
		const zoomLevel				= this.props.zoomLevel			? this.props.zoomLevel : 15;
		const liteModeEnabled		= !(this.props.liteMode 		? this.props.liteMode : false);
		const showUserLocation		= this.props.showUserLocation	? this.props.showUserLocation : false;
		const followUserLocation	= this.props.followUserLocation ? this.props.followUserLocation : false;
		const MapStyle				= this.props.MapStyle			? this.props.MapStyle : StyleURL.Basic;
		const onRegionDidChange		= this.props.onRegionDidChange	? this.props.onRegionDidChange : undefined;
		
		return(
			<MapboxGL.MapView
				style={{flex:1, width: '100%'}}
				styleURL={MapStyle}
				zoomEnabled={liteModeEnabled}
				scrollEnabled={liteModeEnabled}
				pitchEnabled={liteModeEnabled}
				rotateEnabled={liteModeEnabled}
				logoEnabled={false}
				attributionEnabled={false}
				onRegionDidChange={onRegionDidChange}
			>
				{(showUserLocation && followUserLocation) &&
					<MapboxGL.UserLocation/>
				}
				<MapboxGL.Camera
					animationDuration={500}
					centerCoordinate={coordinate}
					zoomLevel={zoomLevel}
					followUserLocation={followUserLocation}
					followUserMode={MapboxGL.UserTrackingModes.Follow}
				/>
				{this.props.children}
			</MapboxGL.MapView>
		);
	}
}