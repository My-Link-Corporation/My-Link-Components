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
import { View, Image, FlatList, Pressable, BackHandler } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import TextInput from '../TextInput';
import MapView from '../Maps/Map';
import {checkMultiple, requestMultiple, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Text		from '../Text';
import Icon		from '../Icon';
import Colors	from '../../constants/Colors';
import Layout	from '../../constants/Layout';
import Values	from '../../constants/Values';
import { ReverseGeocode } from '../../helpers/Location';


export default class CityFinder extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			search:				'',
			location:			undefined,
			results:			[':mylocation'],
			currentLocation:	undefined,
			permissionsAllowed: false,
			focused:			false
		}
		this.requestPermissions		= this.requestPermissions.bind(this);
		this.fetchCurrentLocation	= this.fetchCurrentLocation.bind(this);
		this.onChange				= this.onChange.bind(this);
		this.onReady				= this.onReady.bind(this);
		this.onSubmitSearch			= this.onSubmitSearch.bind(this);
		this.renderResultsItem		= this.renderResultsItem.bind(this);
		this.renderHeader			= this.renderHeader.bind(this);
		this.onItemPress			= this.onItemPress.bind(this);
		this.onFocus				= this.onFocus.bind(this);
		this.onBlur					= this.onBlur.bind(this);
	}
	
	componentDidMount(){
		this.requestPermissions();
		this.BackHandler = BackHandler.addEventListener('hardwareBackPress', () => {
			if(this.state.focused){
				this.onBlur();
				return true;
			}
			else{
				return false;
			}
		})
	}
	
	componentWillUnmount(){
		this.BackHandler.remove();
	}

	onFocus = () => {
		this.setState({focused: true}, () => {
			if(this.props.onFocus){
				this.props.onFocus();
			}
		});
	}

	onBlur = () => {
		this.setState({focused: false}, () => {
			this.textInputRef.blur();
			if(this.props.onBlur){
				this.props.onBlur();
			}
		});
	}

	requestPermissions = () => {
        const self = this;
        var PermissionsSet = [];
        if(Platform.OS === 'android'){
            PermissionsSet = [
				PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
				PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
				PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
			];
        }
        else if (Platform.OS === 'ios'){
            PermissionsSet = [
				PERMISSIONS.IOS.LOCATION_ALWAYS,
				PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
			];
        }
        checkMultiple(PermissionsSet)
        .then((res) => {
            const result = [];
            Object.keys(res).forEach((item) => {
                result.push(res[item]);
            });
            if(result.includes(RESULTS.DENIED) || result.includes(RESULTS.BLOCKED)){
                requestMultiple(PermissionsSet)
                .then((re) => {
                    const _result = [];
                    Object.keys(re).forEach((item) => {
                        _result.push(re[item]);
                    });
                    if(_result.includes(RESULTS.DENIED) || _result.includes(RESULTS.BLOCKED)){

                    }
                    else{
                        self.setState({permissionsAllowed: true}, self.fetchCurrentLocation);
                    }
                })
            }
            else{
                self.setState({permissionsAllowed: true}, self.fetchCurrentLocation);
            }
        });
	}

	fetchCurrentLocation = async () => {
		const self = this;
		Geolocation.getCurrentPosition(async (position) => {
			const coords = {lat: position.coords.latitude, lng: position.coords.longitude};
			const cityData = await ReverseGeocode(coords.lat, coords.lng);
			self.setState({currentLocation: cityData}, () => self.onChange(true));
		})
	}

	onChange = (current, set) => {
		const currentLocation = current ? this.state.currentLocation : this.state.location;
		const locationData = {
			set: set,
			lat: currentLocation.lat,
			lng: currentLocation.lon,
			location: [currentLocation.address.road, currentLocation.address.county, currentLocation.address.state, currentLocation.address.country].filter((obj) => obj).join(", ")
		};
		if(this.props.onChange){
			this.props.onChange(locationData);
		}
	}

	onReady = (current) => {
		const currentLocation = current ? this.state.currentLocation : this.state.location;
		const locationData = {
			set: true,
			lat: currentLocation.lat,
			lng: currentLocation.lon,
			location: [currentLocation.address.road, currentLocation.address.county, currentLocation.address.state, currentLocation.address.country].filter((obj) => obj).join(", ")
		};

		if(this.props.onChange){
			this.props.onChange(locationData);
		}
	}

	onSubmitSearch = () => {
		const search	= this.state.search.trim();
		const URI			= Values.AddressLookupURI.replace('{1}', search);
		fetch(URI)
		.then((response) => response.json())
		.then((responseJson) => {
			this.setState({results: [':mylocation', ...responseJson]});
		})
		.catch(() => {
			
		})
	}

	onItemPress = (item) => {
		if(item == ':mylocation'){
			this.onChange(true, true);
		}
		else{
			this.setState({location: item}, () => this.onChange(false, true));
		}
	}

	renderResultsItem = ({item, index}) => {
		if(item === ':mylocation'){
			if(this.state.currentLocation){
				const locationString =  `${this.state.currentLocation.address.county}, ${this.state.currentLocation.address.state}, ${this.state.currentLocation.address.country}`;
				return(
					<Pressable onPress={() => this.onItemPress(':mylocation')} key={index} style={{width: '100%', height: 50, padding: 5, paddingLeft: 10, paddingRight: 10}}>
						<View style={{width: '100%', height: '100%', flexDirection: 'row', backgroundColor: Colors.defaultGrayLight, borderRadius: 20, alignItems: 'center'}}>
							<View style={{width: 40, height: 50, alignItems: 'center', justifyContent: 'center'}}>
								<Icon Borderless background={Colors.personal} forceColor color="white" name="location"/>
							</View>
							<Text numberOfLines={1} style={{marginLeft: 10, width: '80%'}}>{locationString}</Text>
						</View>
					</Pressable>
				);
			}
			else{
				return null;
			}
		}
		else{
			const locationString =  [item.address.road, item.address.county, item.address.state, item.address.country].filter((obj) => obj).join(", ");
			return(
				<Pressable onPress={() => this.onItemPress(item)} key={index} style={{width: '100%', height: 50, padding: 5, paddingLeft: 10, paddingRight: 10}}>
					<View style={{width: '100%', height: '100%', flexDirection: 'row', backgroundColor: Colors.defaultGrayLight, borderRadius: 20, alignItems: 'center'}}>
						<View style={{width: 40, height: 50, alignItems: 'center', justifyContent: 'center'}}>
							<Icon Borderless background="white" name="location"/>
							<View style={{width: 10, height: 10, position: 'absolute', right: 10, bottom: 15}}>
								<Image source={{uri: item.icon}} style={{width: 10, height: 10, resizeMode: 'contain'}}/>
							</View>
						</View>
						<Text numberOfLines={1} style={{marginLeft: 10, width: '80%'}}>{locationString}</Text>
					</View>
				</Pressable>
			);
		}
	}
	
	renderHeader = () => {
		const displayMap			= this.props.displayMap;
		const currentLocation		= this.state.currentLocation;
		const currentLocationString	= currentLocation ? `${currentLocation.address.county}, ${currentLocation.address.state}, ${currentLocation.address.country}` : 'undetermined';

		return(
			<View style={{flex: 1, backgroundColor: 'white'}}>
				<View style={{width: '100%', height: 120, marginBottom: 20, alignItems: 'center', justifyContent: 'space-around', borderBottomWidth: 1, borderBottomColor: Colors.defaultGray}}>
					<View style={{width: '100%', alignItems: 'center'}}>
						<Text>{'Mi ubicación'}</Text>
						<Text>{currentLocationString}</Text>
					</View>
					<View style={{width: '60%', height: 30, backgroundColor: Colors.defaultGrayLight, borderRadius: 10}}>
						<TextInput
							placeholder="Buscar ciudad"
							style={{
								padding: 0,
								textAlign: 'center'
							}}
							value={this.state.search}
							onChangeText={(text) => this.setState({search: text.trim()})}
							onSubmitEditing={this.onSubmitSearch}
							onFocus={this.onFocus}
							onBlur={this.onBlur}
							ref={(c) => this.textInputRef = c}
						/>
					</View>
				</View>
				{(displayMap && currentLocation) &&
					<View style={{ width: '100%', height: Layout.window.width/2, marginBottom: 20, }}>
						<MapView
							coordinate={[
								this.state.location ? this.state.location.lon : this.state.currentLocation.lon,
								this.state.location ? this.state.location.lat : this.state.currentLocation.lat
							]}
							liteMode
						/>
					</View>
				}
			</View>
		);
	}

	render(){
		if(this.state.permissionsAllowed){
			return(
				<FlatList
					style={{flex: 1, backgroundColor: 'white'}}
					data={this.state.results.filter((obj) => obj)}
					renderItem={this.renderResultsItem}
					ListHeaderComponent={this.renderHeader}
				/>
			);
		}
		else{
			return(
				<View style={{flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
					<Text>{'Permissions unavailable'}</Text>
				</View>
			);
		}
	}
}