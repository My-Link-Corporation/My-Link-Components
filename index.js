import AccountTypes from './constants/AccountTypes';
import Colors from './constants/Colors';
import ColoredBackgroundDictionary from './constants/ColoredBackgroundDictionary';
import Layout from './constants/Layout';
import FlagPack from './constants/FlagPack';
import EmojiPack from './constants/EmojiPack';
import isoCountries from './constants/isoCountries';
import MapViewStyles from './constants/MapViewStyles';
import IconPack from './constants/IconPack';
import Values from './constants/Values';

import Icon from './components/Icon';
import CameraRollPicker from './components/CameraRollPicker';
import Text from './components/Text';
import TextInput from './components/TextInput';
import ProfilePicture from './components/ProfilePicture';
import CityFinder from './components/CityFinder';
import CountryPicker from './components/CountryPicker';
import EmojiBackground from './components/EmojiBackground';
import MapView from './components/Maps/Map';
import SearchBar from './components/SearchBar';

import { Button, Switch, HourSelector, TimerSelector } from './components/Components';

const Constants = {
    AccountTypes,
    Colors,
    ColoredBackgroundDictionary,
    Layout,
    FlagPack,
    EmojiPack,
    isoCountries,
    MapViewStyles,
    IconPack,
    Values
}

const Maps = {
    MapView
}

export {
    Constants,
    CameraRollPicker,
    Text,
    TextInput,
    ProfilePicture,
    CityFinder,
    CountryPicker,
    EmojiBackground,
    Maps,
    SearchBar,
    Icon,
	Button,
	Switch,
	HourSelector,
	TimerSelector
}