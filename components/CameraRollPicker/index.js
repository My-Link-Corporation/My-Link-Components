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
import {SafeAreaView, View, Platform, FlatList, Animated, Pressable, Image, Modal} from 'react-native';
import CameraRoll from '@react-native-community/cameraroll';
import {checkMultiple, requestMultiple, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Navigation} from 'react-native-navigation';
import {RNCamera} from 'react-native-camera';
import Text from '../Text';
import Layout from '../../constants/Layout';
import Video from 'react-native-video';
import Icon from '../Icon';
import Colors from '../../constants/Colors'
import {Button} from '../Components';

/**
 * Obtiene los archivos multimedia del dispositivo del usuario.
 * 
 * #### Ejemplo
 * ```jsx
 * <CameraRollPicker
 *  mediaType={'Photos'}
 *  cameraEnabled={false}
 *  multiple
 *  max={10}
 *  onChange={(selected) => this.setState({selected})}
 * />
 * ```
 * @param {number} pageSize Elementos obtenidos por solicitud - default 20
 * @param {string} mediaType ['All', 'Photos', 'Videos'] Tipo de elementos a obtener - default 'All'
 * @param {boolean} cameraEnabled Muestra la cámara como opción - default true
 * @param {boolean} multiple Permite seleccionar más de un elemento - default false
 * @param {number} max Cantidad de elementos máximos a obtener
 * @param {function} onReady Devuelve la selección y reinicia el selector
 * @param {function} onChange Devuelve la selección cada vez que cambia
 * @param {boolean} topbarEnabled Muestra la barra superior - default true
 * @param {boolean} previewEnabled Muestra una vista preliminar al mantener presionado sobre la multimedia - default true
 * 
 */

class CameraRollPicker extends React.Component{
    constructor(props){
        super(props);
        this.defaultMedia   = (this.props.cameraEnabled ? this.props.cameraEnabled : true) ? [':camera'] : [];
        this.state = {
            permissionsAllowed: false,
            media:              this.defaultMedia,
            selected:           [],
            after:              undefined,
            hasNextPage:        true,
            refreshing:         false,
            multipleEnabled:    this.props.multiple,
            topBarVars:         new Animated.ValueXY({x: -63, y: 0}),
            previewVisible:     false,
            previewMedia:       undefined
        }
        this.requestPermissions = this.requestPermissions.bind(this);
        this.updateCameraRoll   = this.updateCameraRoll.bind(this);
        this.onRefresh          = this.onRefresh.bind(this);
        this.renderPicture      = this.renderPicture.bind(this);
        this.onPress            = this.onPress.bind(this);
        this.triggerTopBarAnim  = this.triggerTopBarAnim.bind(this);
        this.resetSelector      = this.resetSelector.bind(this);
        this.onReadyButtonPress = this.onReadyButtonPress.bind(this);
        this.onLongPress        = this.onLongPress.bind(this);
        this.onPressOut         = this.onPressOut.bind(this);
        this.getFromCamera      = this.getFromCamera.bind(this);
    }

    componentDidMount(){
        this.requestPermissions();
    }

    requestPermissions = () => {
        const self = this;
        var PermissionsSet = [];
        if(Platform.OS === 'android'){
            PermissionsSet = [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE, PERMISSIONS.ANDROID.RECORD_AUDIO, PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE];
        }
        else if (Platform.OS === 'ios'){
            PermissionsSet = [PERMISSIONS.ANDROID.CAMERA, PERMISSIONS.ANDROID.MEDIA_LIBRARY, PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.IOS.PHOTO_LIBRARY, ];
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
                    if(!(_result.includes(RESULTS.DENIED) || _result.includes(RESULTS.BLOCKED))){
                        self.setState({permissionsAllowed: true}, self.onRefresh);
                    }
                })
            }
            else{
                self.setState({permissionsAllowed: true}, self.onRefresh);
            }
        });
    }

    updateCameraRoll = () => {
        if(!this.state.hasNextPage){
            return;
        }
        this.setState({refreshing: true});
        CameraRoll.getPhotos({
            first: this.props.pageSize || 20,
            assetType: (this.props.mediaType || 'All'),
            after: this.state.after
        })
        .then(r => {
            const raw = [...this.state.media, ...r.edges];
            raw.splice(0,1);
            const media = Array.from(new Set(raw.map(a => a.node.image.uri)))
            .map(id => {
                return raw.find(a => a.node.image.uri === id)
            });
            if(this.props.cameraEnabled){
                media.splice(0,0,':camera');
            }
            this.setState({
                media: media,
                refreshing: false,
                after: r.page_info.end_cursor,
                hasNextPage: r.page_info.has_next_page
            });
        })
        .catch((err) => {
            console.log(err)
            this.setState({refreshing: false});
        });
    }

    onRefresh = () => {
        this.setState({
            media: this.defaultMedia,
            selected: [],
            after: undefined,
            hasNextPage: true
        }, this.updateCameraRoll);
    }

    resetSelector = () => {
        this.triggerTopBarAnim();
        this.setState({
            selected:           [],
            after:              undefined,
            hasNextPage:        true,
            refreshing:         false,
        }, this.requestPermissions);
    }

    onReadyButtonPress = () => {
        if(typeof this.props.onReady === 'function'){
            this.props.onReady(this.state.selected);
        }
        this.resetSelector();
    }

    onPress = (data) => {
        var selected = this.state.selected;
        if(!this.props.multiple){
            if(selected[0] == data.uri){
                this.setState({selected: []}, () => {
                    if(this.props.onChange){
                        this.props.onChange([]);
                    }
                });
            }
            else{
                this.setState({selected: [data.uri]}, () => {
                    if(this.props.onChange){
                        this.props.onChange([data.uri]);
                    }
                });
            }
            this.triggerTopBarAnim();
        }
        else{
            if(selected.indexOf(data.uri) > -1){
                const index = selected.indexOf(data.uri);
                selected.splice(index, 1);
                this.setState({selected: selected}, () => {
                    if(this.props.onChange){
                        this.props.onChange([...selected]);
                    }
                });
                if(selected.length == 0){
                    this.setState({multipleEnabled: false}, this.triggerTopBarAnim);
                }
            }
            else{
                if(selected.length < (this.props.max || 1)){
                    this.setState({selected: [...this.state.selected, data.uri]}, () => {
                        if(this.props.onChange){
                            this.props.onChange([...selected, data.uri]);
                        }
                    });
                    this.setState({multipleEnabled: true}, this.triggerTopBarAnim);
                }
            }
        }
    }

    onLongPress = (data) => {
        if(this.props.previewEnabled ? this.props.previewEnabled : true){
            this.setState({previewVisible: true, previewMedia: data});
        }
    }

    onPressOut = () => {
        if(this.props.previewEnabled ? this.props.previewEnabled : true){
            this.setState({previewVisible: false, previewMedia: undefined});
        }
    }

    getFromCamera = () => {
        if(this.camera){
            //this.camera.pausePreview();
            Navigation.push(this.props.componentId, {
                component: {
                    name:       'my-link.camera',
                    passProps:  {
                        callback:   (media_url) => {
                            const selected = this.state.selected;
                            this.resetSelector();
                            this.setState({selected: [...selected, media_url]});
                            if(this.camera){
                                setTimeout(() => {
                                    //this.camera.resumePreview();
                                }, 500);
                            }
                        }
                    }
                }
            })
        }
    }

    renderPicture = ({item, index}) => {
        if(item == ':camera'){
            return(
                <Pressable
                    onPress={this.getFromCamera}
                    key={':camera'}
                    style={[{
                        width: Layout.window.width/4,
                        height: Layout.window.width/4,
                        marginTop: 1
                    },
                    index%4==0 ? {marginRight: 1} : index%4==1 ? {} : {marginLeft: 1 }]}
                >
                    <RNCamera
                        ref={((c) => this.camera = c)}
                        style={{
                            width: Layout.window.width/4,
                            height: Layout.window.width/4,
                        }}
                        type={'front'}
                    />
                    <View style={{width: '100%', height: '100%', position: 'absolute', alignItems: 'center', justifyContent: 'center'}}>
                        <Icon factor={1} Borderless name="camera" background="rgba(0,0,0,0.5)" forceColor color="white"/>
                    </View>
                </Pressable>
            );
        }
        const type = item.node.type.split("/")[0];
        if(type == 'image'){
            const uuid = {type: type, uri: item.node.image.uri};
            const selectedIndex = this.state.selected.indexOf(uuid.uri);
            const alreadySelected = selectedIndex > -1;
            return(
                <Pressable
                    key={item.node.image.uri}
                    onPress={() => this.onPress(uuid)}
                    onLongPress={() => this.onLongPress(uuid)}
                    onPressOut={() => this.onPressOut(uuid)}
                    style={[{
                        width: Layout.window.width/4,
                        height: Layout.window.width/4,
                        marginTop: 1
                    },
                    index%4==0 ? {marginRight: 1} : index%4==1 ? {} : {marginLeft: 1 }]}
                >
                    <Image
                        source={{ uri: item.node.image.uri }}
                        style={{
                            width: Layout.window.width/4,
                            height: Layout.window.width/4,
                            backgroundColor: 'black'
                        }}
                    />
                    {alreadySelected &&
                        <View style={{width: '100%', height: '100%', position: 'absolute', alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{width: 30, height: 30, backgroundColor: Colors.pet, borderRadius: 360, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white'}}>
                                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{selectedIndex + 1}</Text>
                            </View>
                        </View>
                    }
                </Pressable>
            );
        }
        if(type == 'video'){
            const uuid = {type: type, uri: item.node.image.uri};
            const selectedIndex = this.state.selected.indexOf(uuid.uri);
            const alreadySelected = selectedIndex > -1;
            return(
                <Pressable
                    key={item.node.image.uri}
                    onPress={() => this.onPress(uuid)}
                    onLongPress={() => this.onLongPress(uuid)}
                    onPressOut={() => this.onPressOut(uuid)}
                    style={[{
                        width: Layout.window.width/4,
                        height: Layout.window.width/4,
                        marginTop: 1
                    },
                    index%4==0 ? {marginRight: 1} : index%4==1 ? {} : {marginLeft: 1 }]}
                >
                    <Image
                        source={{ uri: item.node.image.uri }}
                        style={{
                            width: Layout.window.width/4,
                            height: Layout.window.width/4
                        }}
                    />
                    <View style={{width: '100%', height: '100%', position: 'absolute', top: 5, left: 5}}>
                        <Icon factor={1} size={20} Borderless name="videocall" background="rgba(0,0,0,0.5)" forceColor color="white"/>
                    </View>
                    {alreadySelected &&
                        <View style={{width: '100%', height: '100%', position: 'absolute', alignItems: 'center', justifyContent: 'center'}}>
                            <View style={{width: 30, height: 30, backgroundColor: Colors.pet, borderRadius: 360, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'white'}}>
                                <Text style={{color: 'white', fontSize: 18, fontWeight: 'bold'}}>{selectedIndex + 1}</Text>
                            </View>
                        </View>
                    }
                </Pressable>
            );
        }
    }

	triggerTopBarAnim = () => {
        if(!this.props.topbarEnabled){
            return;
        }
		if(this.state.multipleEnabled){
			Animated.timing(
				this.state.topBarVars,
				{
					toValue: {x: 0, y: 63},
                    isInteraction: false,
                    useNativeDriver: false
				}
			).start();
		}
		else{
			Animated.timing(
				this.state.topBarVars,
				{
					toValue: {x: -63, y: 0},
					isInteraction: false,
                    useNativeDriver: false
				}
			).start();
		}
	}

    render(){
        if(!this.state.permissionsAllowed){
            return(
                <SafeAreaView style={{width: '100%', height: '100%', backgroundColor: 'white', alignItems: 'center', justifyContent: 'center'}}>
                    <View>
                        <Text>{'Permissions unavailable'}</Text>
                    </View>
                </SafeAreaView>
            );
        }
        else{
            return(
                <SafeAreaView style={{width: '100%', height: '100%', backgroundColor: 'white'}}>
                    {this.props.topbarEnabled &&
                        <Animated.View
                            style={{
                                width: '100%', 
                                height: this.state.topBarVars.y,
                                top:    this.state.topBarVars.x,
                                backgroundColor: 'white', 
                                elevation: 1,
                                alignItems: 'center',
                                justifyContent: 'space-around',
                                flexDirection: 'row',
                            }}>
                                <Text style={{marginLeft: 10,}}>{`${this.state.selected.length} archivos seleccionados.`}</Text>
                                <Button title="Listo" width={90} onPress={this.onReadyButtonPress}/>
                        </Animated.View>
                    }
                    <FlatList
                        extraData={this.state.selected}
                        data={this.state.media}
                        keyExtractor={(item) => {
                            if(item === ':camera'){
                                return ':camera';
                            }
                            else{
                                return item.node.image.uri;
                            }
                        }}
                        renderItem={this.renderPicture}
                        numColumns={4}
                        style={{flex: 1, backgroundColor: 'white'}}
                        onEndReached={this.updateCameraRoll}
                        onRefresh={this.onRefresh}
                        refreshing={this.state.refreshing}
                    />
                    <Modal
                        transparent={true}
                        style={{
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'transparent',
                        }}
                        visible={this.state.previewVisible}
                    >
                        <View
                            style={{
                                width: '100%',
                                height: '100%',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                        >
                            <View style={{width: '100%', height: '75%', backgroundColor: 'rgba(0,0,0,0.75)', alignItems: 'center', justifyContent: 'center'}}>
                                {(this.state.previewMedia && this.state.previewMedia.type == "video") &&
                                    <View style={{width: '100%', height: '75%', backgroundColor: 'black'}}>
                                        <Video
                                            bufferConfig={{
                                                minBufferMs:                        0,
                                                maxBufferMs:                        5000,
                                                bufferForPlaybackMs:                2500,
                                                bufferForPlaybackAfterRebufferMs:   5000
                                            }}
                                            source={{ uri: this.state.previewMedia.uri }}
                                            style={{
                                                width: '100%',
                                                height: '100%'
                                            }}
                                            resizeMode={'contain'}
                                            useTextureView={true}
                                        />
                                    </View>
                                }
                                {(this.state.previewMedia && this.state.previewMedia.type == "image") &&
                                    <View style={{width: '100%', height: '75%', backgroundColor: 'black'}}>
                                        <Image source={{uri: this.state.previewMedia.uri}} style={{width: '100%', height: '100%', resizeMode: 'contain'}}/>
                                    </View>
                                }
                            </View>
                        </View>
                    </Modal>
                </SafeAreaView>
            );
        }
    }
}

export default CameraRollPicker;