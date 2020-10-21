/**
 * Copyright (c) 2019-present, My-Link Corporation S.A de C.V.
 * All rights reserved.
 * 
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Eduardo Dorantes <eduardo-dorantes@my-link.com>
 */

'use strict';

class BackgroundTaksResolver{
    constructor(){
        this.tasks = {};
        console.log("BTR initialised: ", this.tasks);
    }

    run = (id, task) => {
        this.tasks[id] = task;
        return this.tasks[id];
    }

    get = (id) => {
        typeof this.tasks[id] != "undefined" ? this.tasks[id] : null;
    }

    remove = (id) => {
        if(this.tasks[id]){
            delete this.tasks[id];
        }
    }

    clearAll = () => {

    }
}

export default BackgroundTaksResolver;