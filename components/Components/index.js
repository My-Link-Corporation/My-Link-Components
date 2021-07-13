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
import { TouchableOpacity, View, PixelRatio } from 'react-native';
import Text from '../Text';
import Colors from '../../constants/Colors';
import Icon from '../Icon';

class Button extends React.Component{
	constructor(props){
		super(props);
	}
	
	render(){
		if(this.props.disabled){
			return(
				<View style={{
					backgroundColor: "#E6E6E6",
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'row',
					borderRadius: 10,
					width: this.props.width ? this.props.width: 150,
					height: this.props.height ? this.props.height : 30
				}}>
					{this.props.icon &&
						<Icon Borderless forceColor color="white" name={this.props.icon}/>
					}
					<Text style={{
						flex: 1,
						textAlign: 'center',
						color: 'white',
						fontSize: 15,
						fontWeight: 'bold'
					}}>{this.props.title}</Text>
				</View>
			);
		}
		else{
			return(
				<TouchableOpacity onPress={this.props.onPress} style={{
					backgroundColor: this.props.color ? this.props.color : Colors.buttonColor,
					alignItems: 'center',
					justifyContent: 'center',
					flexDirection: 'row',
					borderRadius: 10,
					width: this.props.width ? this.props.width: 150,
					height: this.props.height ? this.props.height : 30
				}}>
					{this.props.icon &&
						<Icon Borderless forceColor color="white" name={this.props.icon}/>
					}
					<Text style={{
						flex: 1,
						textAlign: 'center',
						color: 'white',
						fontSize: 15,
						fontWeight: 'bold'
					}}>{this.props.title}</Text>
				</TouchableOpacity>
			);
		}
	}
}

class Switch extends React.Component{
	constructor(props){
		super(props);
		this.onPress		= this.onPress.bind(this);
	}
	
	onPress = () => {
		if(this.props.onValueChange){
			const value = !this.props.value;
			this.props.onValueChange(value);
		}
	}
	
	render(){
		const value				= this.props.value;
		const indicatorColor	= this.props.disabled ? Colors.defaultGray	: (!value ? 'transparent' : (this.props.color ? this.props.color : Colors.personal));
		const borderColor		= this.props.disabled ? Colors.defaultGray	: (!value ? Colors.defaultGray : (this.props.color ? this.props.color : Colors.personal));
		
		const Component = this.props.disabled ? View : TouchableOpacity;
		return(
			<Component activeOpacity={0.75} onPress={this.onPress} style={{
				width: 60,
				height: 42,
				borderWidth: 1,
				borderColor: Colors.defaultGray,
				borderRadius: 7.5,
				flexDirection: 'row',
				alignItems: 'center',
				padding: 2,
				justifyContent: value ? 'flex-end' : 'flex-start'
			}}>
				<View style={{
					width: 20,
					height: 20,
					borderRadius: 360,
					borderWidth: 1,
					borderColor: borderColor,
					backgroundColor: indicatorColor
				}}>
					
				</View>
			</Component>
		);
	}
}

class HourSelector extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			hour:	12,
			min:	0,
			a:		false
		}
		this.increaseHour	=	this.increaseHour.bind(this);
		this.decreaseHour	=	this.decreaseHour.bind(this);
		this.increaseMin	=	this.increaseMin.bind(this);
		this.decreaseMin	=	this.decreaseMin.bind(this);
		this.toggleA		=	this.toggleA.bind(this);
		this.getTime		=	this.getTime.bind(this);
		this.onChange		=	this.onChange.bind(this);
	}
	
	onChange = () => {
		if(this.props.onChange){
			const value = this.getTime();
			this.props.onChange(value);
		}
	}
	
	getTime = () => {
		return {
			hour:	(this.state.a ? (this.state.hour + 12) : this.state.hour),
			min:	this.state.min,
			stamp:	(((this.state.a ? (this.state.hour + 12) : this.state.hour) * 60 * 60) + (this.state.min * 60)) * 1000
		};
	}
	
	increaseHour = () => {
		var hour = this.state.hour;
		hour += 1;
		if(hour > 12){
			hour = 1;
		}
		this.setState({hour: hour}, this.onChange());
	}
	
	decreaseHour = () => {
		var hour = this.state.hour;
		hour -= 1;
		if(hour < 1){
			hour = 12;
		}
		this.setState({hour: hour}, this.onChange());
	}
	
	increaseMin = () => {
		var min = this.state.min;
		min += 1;
		if(min > 59){
			min = 0;
		}
		this.setState({min: min}, this.onChange());
	}
	
	decreaseMin = () => {
		var min = this.state.min;
		min -= 1;
		if(min < 0){
			min = 59;
		}
		this.setState({min: min}, this.onChange());
	}
	
	toggleA = () => {
		var a	=	this.state.a;
		this.setState({a: !this.state.a}, this.onChange());
	}
	
	
	render(){
		const hour		= (this.state.hour).toString().padStart(2, '0');
		const minutes	= (this.state.min).toString().padStart(2, '0');
		return(
			<View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<View style={{width: 30, height: 35, borderRadius: 10, borderWidth: 1, borderColor: Colors.defaultGray, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
							<Text>{hour}</Text>
						</View>
						<View>
							<Icon Borderless factor={1} name="arrow_up"		onPress={this.increaseHour}/>
							<Icon Borderless factor={1} name="arrow_down"	onPress={this.decreaseHour}/>
						</View>
					</View>
					<View style={{width: 30, alignItems: 'center', justifyContent: 'center'}}>
						<Text style={{fontSize: 24, fontWeight: 'bold', fontFamily: 'Helvetica', color: Colors.defaultGray}}>:</Text>
					</View>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<View style={{width: 30, height: 35, borderRadius: 10, borderWidth: 1, borderColor: Colors.defaultGray, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
							<Text>{minutes}</Text>
						</View>
						<View>
							<Icon Borderless factor={1} name="arrow_up"		onPress={this.increaseMin}/>
							<Icon Borderless factor={1} name="arrow_down"	onPress={this.decreaseMin}/>
						</View>
						<Text>hrs.</Text>
					</View>
				</View>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					<View style={{width: 30, height: 35, borderRadius: 10, borderWidth: 1, borderColor: Colors.defaultGray, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
						<Text>{["am.", "pm."][this.state.a ? 1 : 0]}</Text>
					</View>
					<View>
						<Icon Borderless factor={1} name="arrow_up"		onPress={this.toggleA}/>
						<Icon Borderless factor={1} name="arrow_down"	onPress={this.toggleA}/>
					</View>
				</View>
			</View>
		);
	}
}

class TimerSelector extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			hour:	0,
			min:	0,
		}
		this.increaseHour	=	this.increaseHour.bind(this);
		this.decreaseHour	=	this.decreaseHour.bind(this);
		this.increaseMin	=	this.increaseMin.bind(this);
		this.decreaseMin	=	this.decreaseMin.bind(this);
		this.getTime		=	this.getTime.bind(this);
		this.onChange		=	this.onChange.bind(this);
	}
	
	onChange = () => {
		if(this.props.onChange){
			const value = this.getTime();
			this.props.onChange(value);
		}
	}
	
	getTime = () => {
		return {
			hour:	this.state.hour,
			min:	this.state.min,
			stamp:	((this.state.hour * 60 * 60) + (this.state.min * 60)) * 1000
		};
	}
	
	increaseHour = () => {
		var hour = this.state.hour;
		hour += 1;
		if(hour > 12){
			hour = 1;
		}
		this.setState({hour: hour}, this.onChange());
	}
	
	decreaseHour = () => {
		var hour = this.state.hour;
		hour -= 1;
		if(hour < 1){
			hour = 12;
		}
		this.setState({hour: hour}, this.onChange());
	}
	
	increaseMin = () => {
		var min = this.state.min;
		min += 1;
		if(min > 59){
			min = 0;
		}
		this.setState({min: min}, this.onChange());
	}
	
	decreaseMin = () => {
		var min = this.state.min;
		min -= 1;
		if(min < 0){
			min = 59;
		}
		this.setState({min: min}, this.onChange());
	}
	
	
	render(){
		const hour		= (this.state.hour).toString().padStart(2, '0');
		const minutes	= (this.state.min).toString().padStart(2, '0');
		return(
			<View style={{width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}}>
				<View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<View style={{width: 30, height: 35, borderRadius: 10, borderWidth: 1, borderColor: Colors.defaultGray, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
							<Text>{hour}</Text>
						</View>
						<View>
							<Icon Borderless factor={1} name="arrow_up"		onPress={this.increaseHour}/>
							<Icon Borderless factor={1} name="arrow_down"	onPress={this.decreaseHour}/>
						</View>
						<Text>hrs.</Text>
					</View>
					<View style={{width: 30, alignItems: 'center', justifyContent: 'center'}}></View>
					<View style={{flexDirection: 'row', alignItems: 'center'}}>
						<View style={{width: 30, height: 35, borderRadius: 10, borderWidth: 1, borderColor: Colors.defaultGray, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
							<Text>{minutes}</Text>
						</View>
						<View>
							<Icon Borderless factor={1} name="arrow_up"		onPress={this.increaseMin}/>
							<Icon Borderless factor={1} name="arrow_down"	onPress={this.decreaseMin}/>
						</View>
						<Text>min.</Text>
					</View>
				</View>
			</View>
		);
	}
}


export {
	Button,
	Switch,
	HourSelector,
	TimerSelector
}