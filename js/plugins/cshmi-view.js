var cshmiViewPlugIn = new function () {
    this.checkConditions = function () {
        var req = new XMLHttpRequest();
        req.open('HEAD', 'http://' + app.serverConnection.getServerAddress() + ':' + app.serverConnection.getServerPort() + '/hmi/', false);
        try {
            req.send(null);
            if (req.status == 200) {
                return 1;
            } else {
                req.open('HEAD', window.location.protocol + '//' + window.location.hostname + ':' + window.location.port + '/hmi/', false);
                try {
                    req.send(null);
                    if (req.status == 200) return 2;
                } catch (e) {
                    // do nothing
                }
            }
        } catch (e) {
            // do nothing
        }
        return false;
    };

    this.run = function (activeElementPath, data) {
        var sl = this.checkConditions();
        var iFrame = '<iframe src="' +
            (sl == 1 ? 'http://' : window.location.protocol + '//') +
            (sl == 1 ? app.serverConnection.getServerAddress() : window.location.hostname) +
            ':' +
            (sl == 1 ? app.serverConnection.getServerPort() : window.location.port) +
            '/hmi/?Host=' +
            (sl == 1 ? app.serverConnection.getServerAddress() : window.location.hostname) +
            '&Server=' +
            $('#server-name').val() +
            '&Sheet=' +
            activeElementPath +
            '" style="border: 0; width: 100%; height: 100%; margin: -1px; padding: 0;"></iframe>';
        $('#' + this.name).append(iFrame);
    }
}