//File to include functions for browser compatability.

//////////////Internet Explorer//////////////
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position) {
        position = position || 0;
        return this.indexOf(searchString, position) === position;
    };
}

if (!String.prototype.trim) {
    var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
    String.prototype.trim = function () {
        return this.replace(rtrim, "");
    }
}

if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
        enumerable: false,
        value: function(obj) {
            var newArr = this.filter(function(el) {
                return el == obj;
            });
            return newArr.length > 0;
        }
    });
}

if (!Array.prototype.isArray) {
    Array.prototype.isArray = function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    };
}

if (FileReader.prototype.readAsBinaryString === undefined) {
    FileReader.prototype.readAsBinaryString = function (fileData) {
        var binary = "";
        var pt = this;
        var reader = new FileReader();
        reader.onload = function (e) {
            var bytes = new Uint8Array(reader.result);
            var length = bytes.byteLength;
            for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i]);
            }
            pt.content = binary;
            pt.onload();
        };
        reader.readAsArrayBuffer(fileData);
    }
}
/////////////////////////////////////////////

///////////////////Safari////////////////////
function isPrivateBrowsingSupported() {
    try {
        if (window.localStorage) {
            var test = "__localstoragetest__";

            try {
                window.localStorage.setItem(test, test);
                window.localStorage.removeItem(test);
            } catch (ex) {
                return false;
            }

            return true;
        }

        return false;
    } catch (e) {
        return false;
    }
}

if (!isPrivateBrowsingSupported() || typeof window.localStorage == 'undefined' || typeof window.sessionStorage == 'undefined') {
    (function () {
        var Storage = function (type) {
            function createCookie(name, value, days) {
                var date, expires;

                if (days) {
                    date = new Date();
                    date.setTime(date.getTime()+(days*24*60*60*1000));
                    expires = "; expires="+date.toGMTString();
                } else {
                    expires = "";
                }
                document.cookie = name+"="+value+expires+"; path=/";
            }

            function readCookie(name) {
                var nameEQ = name + "=",
                    ca = document.cookie.split(';'),
                    i, c;

                for (i=0; i < ca.length; i++) {
                    c = ca[i];
                    while (c.charAt(0)==' ') {
                        c = c.substring(1,c.length);
                    }

                    if (c.indexOf(nameEQ) == 0) {
                        return c.substring(nameEQ.length,c.length);
                    }
                }
                return null;
            }

            function setData(data) {
                data = JSON.stringify(data);
                if (type == 'session') {
                    window.name = data;
                } else {
                    createCookie('localStorage', data, 365);
                }
            }

            function clearData() {
                if (type == 'session') {
                    window.name = '';
                } else {
                    createCookie('localStorage', '', 365);
                }
            }

            function getData() {
                var data = type == 'session' ? window.name : readCookie('localStorage');
                return data ? JSON.parse(data) : {};
            }


            // initialise if there's already data
            var data = getData();

            return {
                length: 0,
                clear: function () {
                    data = {};
                    this.length = 0;
                    clearData();
                },
                getItem: function (key) {
                    return data[key] === undefined ? null : data[key];
                },
                key: function (i) {
                    // not perfect, but works
                    var ctr = 0;
                    for (var k in data) {
                        if (ctr == i) return k;
                        else ctr++;
                    }
                    return null;
                },
                removeItem: function (key) {
                    delete data[key];
                    this.length--;
                    setData(data);
                },
                setItem: function (key, value) {
                    data[key] = value+''; // forces the value to a string
                    this.length++;
                    setData(data);
                }
            };
        };

        try {
            if (typeof window.localStorage == 'undefined') window.localStorage = new Storage('local');
            if (typeof window.sessionStorage == 'undefined') window.sessionStorage = new Storage('session');
        } catch (e) {
            try {
                window.localStorage = new Storage('local');
            } catch (e2) {}
        }
    })();
}
/////////////////////////////////////////////