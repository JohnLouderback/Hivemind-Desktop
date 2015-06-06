require('Common');
var json = require('jsonfile');
var os = require('os');
var Platforms;
(function (Platforms) {
    Platforms[Platforms["WIN"] = 0] = "WIN";
    Platforms[Platforms["OSX"] = 1] = "OSX";
})(Platforms || (Platforms = {}));
var App = (function () {
    function App() {
    }
    App.initialize = function () {
        console.log('hello');
    };
    App.getPlatform = function () {
        if (os.platform() === 'darwin') {
            return Platforms.OSX;
        }
        else {
            return Platforms.WIN;
        }
    };
    App.model = {
        runtime: {
            platform: App.getPlatform()
        },
        theme: json.readFileSync('themes/dark/theme.json'),
        resourceStrings: json.readFileSync('resources/english.json'),
    };
    return App;
})();
global.App = App;
global.Platforms = Platforms;
App.initialize();
var Win = require('./window-components/Win.js');
var win = new Win();
//# sourceMappingURL=app.js.map