
import { HomebridgePlatform } from 'homebridge-framework';
import { Configuration } from './configuration/configuration';
import { AppleTvClient } from './clients/apple-tv-client';
import { AppleTvController } from './controllers/apple-tv-controller';
import { Api } from './api/api';

/**
 * Represents the platform of the plugin.
 */
export class Platform extends HomebridgePlatform<Configuration> {

    /**
     * Gets or sets the list of all clients that are used to communicate with the Apple TVs.
     */
    public clients = new Array<AppleTvClient>();

    /**
     * Gets or sets the list of all controllers that represent physical Apple TVs in HomeKit.
     */
    public controllers = new Array<AppleTvController>();

    /**
     * Gets the name of the plugin.
     */
    public get pluginName(): string {
        return 'homebridge-appletv';
    }    
    
    /**
     * Gets the name of the platform which is used in the configuration file.
     */
    public get platformName(): string {
        return 'AppleTvPlatform';
    }

    /**
     * Is called when the platform is initialized.
     */
    public initialize() {
        this.logger.info(`Initialing platform...`);

        // Sets the API configuration
	    this.configuration.isApiEnabled = this.configuration.isApiEnabled || false;
        this.configuration.apiPort = this.configuration.apiPort || 40304;

        // Sets the timeouts and intervals
        this.configuration.scanTimeout = this.configuration.scanTimeout || 2;
        this.configuration.maximumConnectRetry = this.configuration.maximumConnectRetry || 10;
        this.configuration.connectRetryInterval = this.configuration.connectRetryInterval || 5;
        this.configuration.heartbeatInterval = this.configuration.heartbeatInterval || 60;

        // Cycles over all configured devices and creates the corresponding controllers and clients
        if (this.configuration.devices) {
            for (let deviceConfiguration of this.configuration.devices) {
                if (deviceConfiguration.name) {

                    // Creates a new client for the device configuration
                    if (deviceConfiguration.isOnOffSwitchEnabled || deviceConfiguration.isPlayPauseSwitchEnabled || this.configuration.isApiEnabled) {
                        const appleTvClient = new AppleTvClient(this, deviceConfiguration);
                        this.clients.push(appleTvClient);

                        // Creates an Apple TV controller for the device configuration
                        if (deviceConfiguration.isOnOffSwitchEnabled || deviceConfiguration.isPlayPauseSwitchEnabled) {
                            const appleTvController = new AppleTvController(this, deviceConfiguration, appleTvClient);
                            this.controllers.push(appleTvController);
                        }
                    } else {
                        this.logger.warn(`[${deviceConfiguration.name}] Device not used.`);
                    }
                } else {
                    this.logger.warn(`Device name missing in the configuration.`);
                }
            }
        } else {
            this.logger.warn(`No devices configured.`);
        }

        // Enables the API
        if (this.configuration.isApiEnabled) {
            new Api(this);
        }
    }

    /**
     * Is called when homebridge is shut down.
     */
    public destroy() {
        this.logger.info(`Shutting down Apple TV clients...`);

        // Destroys all clients
        for (let client of this.clients) {
            client.destroy();
        }
    }
}
