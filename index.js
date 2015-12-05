var _go = function(machine, step) {
    if(!step.done) {
        var arr = step.value();
        var state = arr[0];
        var value = arr[1];

        if(state === 'park') {
            setImmediate(function() {_go(machine, step);});
        } else if(state === 'continue') {
            _go(machine, machine.next(value));
        }
    }
}

var go = function(machine) {
    var gen = machine();
    _go(gen, gen.next());
}

var put = function(chan, val) {
    return function() {
        if(chan.length === 0) {
            chan.unshift(val);
            return ['continue', null];
        } else {
            return ['park', null];
        }
    }
}

var take = function(chan) {
    return function() {
        if(chan.length === 0) {
            return ['park', null];
        } else {
            var val = chan.pop();
            return ['continue', val];
        }
    }
}

var c = [];

go(function *() {
    for(var i = 0; i < 10; i++) {
        yield put(c, i);
        console.log('process put', i);
    }

    yield put(c, null);
}); 

go(function *() {
    while(true) {
        var val = yield take(c);
        if(val === null) {
            break;
        } else {
            console.log('process take', val);
        }
    }
});

