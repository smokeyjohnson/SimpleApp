// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener('deviceready', onDeviceReady.bind(this), false);
    document.addEventListener("backbutton", onBackButton.bind(this), false);

    var pushNotification;
    var uuid = 'hjkhjkhj';
    var baseUrl = 'http://192.168.0.175/';
    var appKey = 'uk.co.linkinfotec.simpleapp';

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );
        
        window.plugins.uniqueDeviceID.get(function (result) {
            uuid = result;
        }, function (err) {
            alert(err);
        });

        
        $("#app-status-ul").append('<li> INFO -> PLATFORM ' + window.device.platform + '</li>');
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        pushNotification = window.plugins.pushNotification;

        if (window.device.platform == 'android' || window.device.platform == 'Android')
        {
            pushNotification.register(
                successHandler,
                errorHandler, {
                    "senderID": "47799401239",
                    "ecb":"onNotificationGCM"
                });
        }

    };

    function onBackButton(e) {
        $("#app-status-ul").append('<li>backbutton event received</li>');

        e.preventDefault();
        pushNotification.unregister(successHandler, errorHandler);
        navigator.app.exitApp();

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };

    function successHandler(result) {
        alert('success');
        $("#app-status-ul").append('<li>EVENT -> SUCCESS:' + result + '</li>');
    };

    function errorHandler(error) {
        alert('error');
        $("#app-status-ul").append('<li>EVENT -> ERROR:' + error + '</li>');
    };

    $('#testApi').on('click', function(){ 
        $.ajax
        ({
            type: "POST",
            //the url where you want to sent the userName and password to
            url: baseUrl + 'umbraco/api/DeviceApi/MobileSubscriptionRegister/',
            dataType: 'json',
            contentType: 'application/json',
            async: false,
            data: JSON.stringify({ 'AppKey': appKey, 'DeviceKey': uuid, 'DeviceType': device.platform.toLowerCase(), 'ApiToken': 'dfgfsdfgsdgsdgsdg', 'IsActive': true }),
            success: function (data) {
                $("#app-status-ul").append('<li>EVENT -> REGISTER WITH PORTAL:' + data + '</li>');
            }
        });
    });

    // Android
    function onNotificationGCM(e) {
        $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

        switch (e.event) {
            case 'registered':
                if (e.regid.length > 0) {
                    $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");

                    console.log("regID = " + e.regid);

                    $.ajax
                    ({
                        type: "POST",
                        //the url where you want to sent the userName and password to
                        url: baseUrl + 'umbraco/api/DeviceApi/MobileSubscriptionRegister/',
                        dataType: 'json',
                        contentType: 'application/json',
                        async: false,
                        data: JSON.stringify({ 'appkey': appKey, 'devicekey': uuid, 'devicetype': device.platform.toLowerCase(), 'apitoken': e.regid, 'isactive': true }),
                        success: function (data) {
                            $("#app-status-ul").append('<li>EVENT -> REGISTER WITH PORTAL:' + data + '</li>');
                        }
                    });
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

function testApi() {
    $.post(baseUrl + 'umbraco/api/DeviceApi/MobileSubscriptionRegister/',
        JSON.stringify({ 'AppKey': appKey, 'DeviceKey': uuid, 'DeviceType': device.platform.toLowerCase(), 'ApiToken': 'dfgfsdfgsdgsdgsdg', 'IsActive': true }),
        function (result) {
            $("#app-status-ul").append('<li>EVENT -> REGISTER WITH PORTAL:' + result + '</li>');
        }, "text/json");
};