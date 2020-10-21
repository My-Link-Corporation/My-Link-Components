/**
 * Copyright (c) 2019-present, My-Link Corporation S.A de C.V.
 * All rights reserved.
 * 
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Eduardo Dorantes <eduardo-dorantes@my-link.com>
 */

'use strict';

import Values from '../constants/Values';
const MapAPI	= Values.NominatimAPI;

const ReverseGeocode = async (lat, lng) => {
	const url = MapAPI + "lat=" + lat + "&lon=" + lng;
	try {
		const response = await fetch(url);
		const responseJson = await response.json();
		return responseJson;
	}
	catch (e) {
		return false;
	}
}

export{
	ReverseGeocode
};