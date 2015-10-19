﻿// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    document.addEventListener("backbutton", onBackButton.bind(this), false);

    var pushNotification;

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        pushNotification = window.plugins.pushNotification;
        if ( device.platform == 'android' || device.platform == 'Android' )
        {
            pushNotification.register(
                successHandler,
                errorHandler, {
                    "senderID": "396431166285",
                    "ecb":"onNotificationGCM"
                });
        }

    };

    function onBackButton(e)
    {
        $("#app-status-ul").append('<li>backbutton event received</li>');
 
        if( $("#home").length > 0 )
        {
            e.preventDefault();
            pushNotification.unregister(successHandler, errorHandler);
            navigator.app.exitApp();
        }
        else
        {
            navigator.app.backHistory();
        }
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function successHandler(result) {
        $("#app-status-ul").append('<li>EVENT -> SUCCESS:' + result + '</li>');
    };

    function errorHandler(error) {
        $("#app-status-ul").append('<li>EVENT -> ERROR:' + error + '</li>');
    };

    // Android
    function onNotificationGCM(e) {
        $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");

                    console.log("regID = " + e.regid);
                }
                break;

            case 'message':
                if (e.foreground) {
                    $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');
                    var my_media = new Media("/android_asset/www/" + e.soundname);
                    my_media.play();
                }
                else {
                    if (e.coldstart) {
                        $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                    }
                    else {
                        $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                    }
                }

                $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
                $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
                break;

            case 'error':
                $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
                break;

            default:
                $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
                break;
        }
    };

})();

