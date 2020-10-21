import React from 'react';
import { Image, View, TouchableOpacity } from 'react-native';
import Colors from '../../constants/Colors';
import IconPack from '../../constants/IconPack';

/**
 * Componente global para iconos.
 * 
 *	@param {string} name Nombre del ícono
 *  @param {string} color Color en HEX | RGBA
 *  @param {string} background Color en HEX | RGBA
 * 	@param {function} onPress Función que se activa al presionar el ícono
 *  @param {boolean} forceColor Forza el tintado del ícono
 * 	@param {boolean} Borderless Dibuja un borde alrededor del ícono.
 *  @param {boolean} Colorless Muestra el ícono 'tal cual'
 */

export default class Icon extends React.Component{
	constructor(props){
		super(props);
		this.onPress	= this.onPress.bind(this);
	}
	
	onPress = () => {
		if(this.props.onPress){
			this.props.onPress();
		}
	}
	
	render(){
		const size = this.props.size ? this.props.size : 40;
		const border = this.props.Borderless ? 0 : 0.75;
		const background = this.props.background ? this.props.background : "transparent";
		const color = this.props.forceColor ? 
			this.props.color
				: 
			Colors.defaultGray
		;
		const name = this.props.name ? (typeof IconPack[this.props.name] == "undefined" ? "uknown" : this.props.name) : "unknown";
		const MainComponent = this.props.onPress ? TouchableOpacity : View;
		const factor = this.props.factor ? this.props.factor : 0.6;
		const borderColor = this.props.borderColor ? this.props.borderColor : "#CCCCCC";

		return(
			<MainComponent
				onPress={this.onPress}
				style={{
					borderRadius: 100,
					borderColor: borderColor,
					backgroundColor: 'white',
					width: size,
					height: size,
					borderWidth: border,
					backgroundColor: background,
					elevation: this.props.Shadow ? 2 : 0
				}
			}>
				<View style={{
					flex: 1,
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}>
				{!this.props.Colorless && 
					<Image style={{
						resizeMode: 'contain',
						width: (size*factor),
						height: (size*factor),
						tintColor: color
					}} source={IconPack[name]}/>
				}
				{this.props.Colorless && 
					<Image style={{
						resizeMode: 'contain',
						width: (size*factor),
						height: (size*factor),
					}} source={IconPack[name]}/>
				}
				</View>
			</MainComponent>
		);
	}
}