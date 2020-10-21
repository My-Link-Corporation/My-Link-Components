/**
 * Copyright (c) 2019-present, My-Link Corporation S.A de C.V.
 * All rights reserved.
 * 
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Eduardo Dorantes <eduardo-dorantes@my-link.com>
 */

'use strict';

export default {
	ReferenceURI:		'mk://',
	WebURI:				'https://my-link.com',
	NominatimAPI:		'https://nominatim.openstreetmap.org/reverse?format=json&',
	AddressLookupURI:	'https://nominatim.openstreetmap.org/search/{1}?format=json&addressdetails=1&limit=10',
	MapBoxToken:		'pk.eyJ1IjoiYWthZHJpbWVyIiwiYSI6ImNrMXdxNGRubDA0ZzUzY250ZGExaXowY2oifQ.ovIYNbaahNzqrPLVQVPLkA',
	CountriesService:	'https://restcountries.eu/rest/v2/all',
	Twitter:			{
		ConsumerKey:		'LGQBuFhWZUZ025mA44OP6ii18',
		SecretKey:			'VtFA2annYCGW3OqY062oi2raWA40IPP5F98njdzzkiHRfyUxci',
		AccessToken:		'1196849364762865664-s7fb02jeb4raI74o417hBKSWDaDph1',
		AccessTokenSecret:	'ZM0WwQB70PrltFYWZMaGjpc9oaoZqqM8xTlb78tDchxks'
	},
	Instagram:			{
		AppSecret:			'950732c058ab360fb80f16f539f99ff9',
		AppID:				'867267500398456',
	},
	Pinterest:			{
		AppID:				'5067383012904183647',
		AppSecret:			'26dd96e883b23add266b5f5629df76e97cffab2ee0813d3d11ae4629b820b4e4',
	},
	Uber:				{
		ClientID:			'WLAH2dj1jghRM4anvEAif82nM65DNxtM',
		ClientSecret:		'kx9MzH_be4lBt3-C1hd7nxeSA1vhRWP1WtqSmqy2'
	},
	Stripe:				{
		PublicKey:			'pk_test_51Gq1jTKBCATsIS0GNeOnfFy2vF4L8LIGcDs6XL7GB2FWgH37N2pWSmoY9yts825UYKDdsx4u8hO9asN4XbMmox0B00WghGNbw1'
	},
	Base64Regex:		/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/,
	QRScanRegex:		/^((https:\/\/my\-link\.com\/|mk\:\/\/)u\/)([aA-zZ0-9\-]+)\/([l|s|p|o|d|c])\/([aA-zZ0-9]{8})\/?((?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=))?/,
	HashtagRegex:		/(#[A-Za-z0-9\-\.\_]+)/g,
	ExtUrlRegex:		/(https:\/\/my\-link\.com\/|mk\:\/\/)u\/([aA-zZ]+[0-9]{4}[A-Z]{2})(\/[l|s])?(\/[0-9a-f\-]{36})?/
}
