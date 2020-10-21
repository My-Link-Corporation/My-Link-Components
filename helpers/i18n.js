/**
 * Copyright (c) 2019-present, My-Link Corporation S.A de C.V.
 * All rights reserved.
 * 
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Eduardo Dorantes <eduardo-dorantes@my-link.com>
 */

'use strict';

class _i18n {
    static dictionary_id   =  undefined;
    static dictionary      =  {};

    static setLanguage = (lang) => {
        global.language = lang;
        this.setDictionary()
        // reload app
    };

    static setDictionary   = (data) => {
        if(typeof data == "undefined"){

        }
        else{
            this.dictionary = data//require('');
        }
    };

    static replace(){
        const parameters    =   Array.from(arguments);
        const str           =   parameters.shift();
        const values        =   parameters;
        const text          =   this._replace(str, values);
        return text;
    };

    static _replace(key, values){
        const string    = _i18n.dictionary[key] || key;
        var text        = string;
        var index       = 0;
        const length    =   values.length;
        for(index; index < length; index++){
            text = text.split(`{${index+1}}`).join(values[index]);
            
        }
        return `${text}`;
    }
}

function i18n(){
    return _i18n.replace(...Array.from(arguments));
}

String.prototype.i18n = function(){
    return i18n(this, ...Array.from(arguments))
}

export default i18n;