# homebridge-apple-tv-remote

Plugin for controlling Apple TVs in homebridge. Each Apple TV can be turned on/off via a switch. Additionally, a play/pause switch is exposed to HomeKit.

## Generate credentials for Apple TVs

Before installing the plugin, credentials must be created for each Apple TV. 

You can install the package `node-appletv-x` that contains a command line tool to create the credentials for each Apple TV you want to use:

```
npm install -g node-appletv-x
```

After the installation is completed, use the `appletv pair` command to scan for your Apple TVs in the local network and generate credentials for each of them.

## Installation

Please install the plugin with the following command:

```
npm install -g homebridge-apple-tv-remote
```

## Configuration

```json
{
    "platforms": [
        {
            "platform": "AppleTvPlatform",
            "devices": [
                {
                    "name": "<UNIQUE-NAME>",
                    "credentials": "<CREDENTIALS>",
                    "isOnOffSwitchEnabled": false,
                    "isPlayPauseSwitchEnabled": false
                }
            ],
            "isApiEnabled": false,
            "apiPort": 40304,
            "apiToken": "<YOUR-TOKEN>"
        }
    ]
}
```

**devices**: Array of all your Apple TV devices that the plugin should expose.

**name**: A unique name for the device. This helps you to differentiate the entries in the devices array and is used in the API.

**credentials**: The credentials string that has been generated with the `appletv` command.

**isOnOffSwitchEnabled**: If set to true, a switch is exposed for changing on/off of the Apple TV. Defaults to `false`.

**isPlayPauseSwitchEnabled**: If set to true, a switch is exposed for changing the play state. Defaults to `false`.

**isApiEnabled** (optional): Enables an HTTP API for controlling devices. Defaults to `false`. See **API** for more information.

**apiPort** (optional): The port that the API (if enabled) runs on. Defaults to `40304`, please change this setting of the port is already in use.

**apiToken** (optional): The token that has to be included in each request of the API. Is required if the API is enabled and has no default value.

## API

This plugin also provides an HTTP API to control some features of the Apple TVs. It has been created so that you can further automate the system with HomeKit shortcuts. Starting with iOS 13, you can use shortcuts for HomeKit automation.

If the API is enabled, it can be reached at the specified port on the host of this plugin. 
```
http://<YOUR-HOST-IP-ADDRESS>:<apiPort>
```

The token has to be specified as value of the `Authorization` header on each request:
```
Authorization: <YOUR-TOKEN>
```

### API - Get State

Use the `/<UNIQUE-NAME>` endpoint to get the state of an Apple TV. The HTTP method has to be `GET`:
```
http://<YOUR-HOST-IP-ADDRESS>:<apiPort>/<UNIQUE-NAME>
```

The response body will be JSON:

```
{
    "isOn": true|false,
    "isPlaying": true|false
}
```

### API - Send Commands

Use the `/<UNIQUE-NAME>` endpoint to send commands to an Apple TV. The HTTP method has to be `POST`:
```
http://<YOUR-HOST-IP-ADDRESS>:<apiPort>/<UNIQUE-NAME>
```

The body of the request has to be JSON in the following format:

```
{
    "isOn": true|false,
    "isPlaying": true|false,
    "commands": [
        {
            "key": "<COMMAND1>",
            "longPress": false
        },
        {
            "wait": <MILLISECONDS-TO-WAIT>
        },
        {
            "key": "<COMMAND3>",
            "longPress": false
        }
    ]
}
```

All properties to be set are optional (e.g. you can only send `isOn` as property).

Each command string can be any of following keys:

* `up`
* `down`
* `left`
* `right`
* `menu`
* `topmenu`
* `home`
* `play`
* `pause`
* `stop`
* `next`
* `previous`
* `suspend`
* `wake`
* `volumeup`
* `volumedown`
* `select`

Commands are executed sequentially. Use `wait` to wait before sending the next command.

# Special Thanks

Special thanks to stickpin who updated and fixed the original `node-appletv` package.
