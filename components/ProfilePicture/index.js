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
import { View, Image, Linking, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import Values from '../../constants/Values';
import firebase from '../firebase';
import FastImage from 'react-native-fast-image';
const defaultPhoto = require('../../assets/images/default_profile_picture.png');

/**
 * Foto de perfil de un usuario
 * @param {string} linkname
 * @param {number} size Tamaño del componente - default: 50
 * @param {boolean} borderless Omite el dibujado del contorno
 * @param {number} borderColor Color del borde
 * @param {boolean} spacing Margen entre la foto y el borde - default: 1
 * @param {string} spacingColor Color del espacio entre el borde y la foto - default 'white'
 * @param {number} shadow Aplica elevación al componente - default: false
 * @param {boolean} PhotoOnly Omite el dibujado de la bandera - default: false
 * @param {boolean} accessToProfile Abre el perfil al pulsar la foto
 */

export default class ProfilePicture extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			linkname:	'',
			source:		defaultPhoto,
			hasPicture: false,
			FlagSource:	null,
			ready:		false
		}
		this.fetchData		= this.fetchData.bind(this);
		this.goToProfile	= this.goToProfile.bind(this);
		this.flagsBucket	= firebase.app().storage('gs://my-link-2020-app-files');
		this.getPicture		= this.getPicture.bind(this);
	}

	getPicture = () => {
		return this.state.source;
	}
	
	fetchData = async () => {
		const self			= this;
		const linkname		= this.props.linkname;
		
		if(!this._ismounted || this._onrequest){
			return;
		}

		this._onrequest = true;
		if(linkname){
			this.setState({linkname: linkname});
			firebase.firestore().collection("usuarios").where('linkname', '==', linkname)
			.get()
			.then(async function (response){
				if(response.docs.length > 0){
					const data = response.docs[0].data();
					self.flagsBucket.ref('flags/' + data.pais.toUpperCase() + '.png').getDownloadURL()
					.then((downloadURL) => {
						if(!self._ismounted){
							return;
						}
						
						self.setState({
							FlagSource: {uri: downloadURL}
						}, () => {
							self._onrequest = false;
						});
					})
					
					if(data.foto || data.logo){
						var remoteReference = data.foto;
						firebase.storage().ref(remoteReference).getDownloadURL()
						.then((url) => {
							if(!self._ismounted){
								return;
							}
							self.setState({
								source: 	{uri: url},
								ready:		true,
								hasPicture: true
							}, () => {
								self._onrequest = false;
							});
						});
					}
					else{
						if(!self._ismounted){
							return;
						}
						self.setState({
							ready: true,
							source: defaultPhoto,
							hasPicture: false
						}, () => {
							self._onrequest = false;
						});
					}
				}
			})
			.catch(function(){

			})
		}
		else{
			self.setState({
				ready: true,
				source: defaultPhoto,
				hasPicture: false
			}, () => {
				self._onrequest = false;
			});
		}
	}
	
	componentDidMount(){
		this._ismounted = true;
		this._onrequest = false;
		this.fetchData();
	}

	componentWillUnmount(){
		this._ismounted = false;
	}
		
	goToProfile = () => {
		if(!this.props.linkname){
			return;
		}
		Linking.openURL(Values.ReferenceURI + "u/" + this.props.linkname);
	}
	
	render(){
		const size			=	this.props.size			? this.props.size : 50;
		const border		=	this.props.borderless	? 0 : 1;
		const borderColor	=	this.props.borderColor	? this.props.borderColor : Colors.defaultGray;
		const spacing   	=	this.props.spacing		? this.props.spacing : 1;
		const spacingColor	=	this.props.spacingColor ? this.props.spacingColor : 'white';
		const isBusiness 	=	this.props.linkname		? (this.props.linkname.split("-")[0] == "B" ? true : false) : false;
		const shadow		=	(this.props.Shadow || this.props.shadow)		? 3 : 0;
		const accessToProfile = this.props.Profile		? true : false;
		const Component		=	accessToProfile ? TouchableOpacity : View;
		const FlagSource	=	this.state.FlagSource;
		
		if(this.props.linkname && (this.props.linkname != this.state.linkname)){
			this.fetchData();
		}

		if(this.state.ready){
			if(this.props.PhotoOnly){
				return(
					<Component onPress={this.goToProfile} style={{
						borderRadius:		(this.props.Business || isBusiness) ? (20/20*7) : 360,
						borderColor:		borderColor,
						borderWidth:		border,
						width:				size + (border*2),
						height:				size + (border*2),
						alignItems:			'center',
						justifyContent: 	'center',
						backgroundColor:	'white',
						elevation:			shadow
					}}>
						<FastImage source={this.props.linkname ? this.state.source : this.props.source} style={{
							backgroundColor: 'white',
							borderRadius: this.props.Business ? 20 : 360,
							borderColor: spacingColor,
							borderWidth: spacing,
							width: size,
							height: size,
							resizeMode: 'cover',
							zIndex: 1
						}}/>
					</Component>
				);
			}
			else{
				return(
					<Component onPress={this.goToProfile} style={{
						borderRadius:		(this.props.Business || isBusiness) ? (20/20*7) : 360,
						borderColor:		borderColor,
						borderWidth:		border,
						width:				size + (border*2),
						height:				size + (border*2),
						alignItems:			'center',
						justifyContent: 	'center',
						backgroundColor:	'white',
						elevation:			shadow
					}}>
						{FlagSource && 
							<View style={{
								width: ((size/20)*7),
								height: ((size/20)*7),
								backgroundColor: Colors.defaultGrayLight,
								position: 'absolute',
								top: (this.props.Business || isBusiness) ? -(size/9) : 0,
								right: (this.props.Business || isBusiness) ? -(size/9) : -(size/9),
								borderRadius: (size/4),
								zIndex: 0,
								borderColor: borderColor,
								borderWidth: border,
							}}></View>
						}
						{this.state.hasPicture &&
							<FastImage
								source={!this.props.source ? this.state.source : this.props.source}
								style={{
									backgroundColor: 'white',
									borderRadius: (this.props.Business || isBusiness) ? (20/20*7) : 360,
									borderColor: spacingColor,
									borderWidth: spacing,
									width: size,
									height: size,
									resizeMode: 'cover',
									zIndex: 1
								}}
							/>
						}
						{!this.state.hasPicture &&
							<FastImage source={!this.props.source ? defaultPhoto : this.props.source} style={{
								backgroundColor: 'white',
								borderRadius: (this.props.Business || isBusiness) ? (20/20*7) : 360,
								borderColor: spacingColor,
								borderWidth: spacing,
								width: size,
								height: size,
								resizeMode: 'cover',
								zIndex: 1
							}}/>
						}
						{FlagSource && 
							<FastImage source={this.state.FlagSource} style={{
								zIndex: 3,
								position: 'absolute',
								width: ((size/20)*7) - 2,
								height: ((size/20)*7) - 2,
								top: (this.props.Business || isBusiness) ? (-(size/9) + 1) : 1,
								right: (this.props.Business || isBusiness) ? (-(size/9) + 1) : (-(size/9) + 1),
								borderWidth: spacing,
								borderColor: spacingColor,
								borderRadius: (size/4),
								backgroundColor: 'white'
							}}/>
						}
					</Component>
				);
			}
		}
		else{
			return(
				<Component style={{
					borderRadius:		(this.props.Business || isBusiness) ? 20 : 360,
					borderColor:		borderColor,
					borderWidth:		border,
					width:				size + (border*2),
					height:				size + (border*2),
					alignItems:			'center',
					justifyContent: 	'center',
					backgroundColor:	'white',
				}}>
					<Image source={this.props.linkname ? this.state.source : this.props.source} style={{
						backgroundColor: 'white',
						borderRadius: this.props.Business ? 20 : 360,
						borderColor: spacingColor,
						borderWidth: spacing,
						width: size,
						height: size,
						resizeMode: 'cover',
						zIndex: 1
					}}/>
				</Component>
			)
		}
	}
}