# HomeAssistant Alarm

> **This project is a fork of [HubitatAlarm](https://github.com/Welasco/HubitatAlarm) by [Victor Santana (Welasco)](https://github.com/Welasco).** All credit for the original architecture, DSC/Honeywell protocol implementation, and core functionality goes to Victor. This fork adapts the project for Home Assistant integration with additional features like dynamic alarm code passing.

HomeAssistant Alarm is a solution to integrate [DSC (IT-100 or Envisalink)](https://www.dsc.com/) or [Honeywell (Envisalink)](https://www.honeywellhome.com/) alarm system to Home Assistant. It will allow you to control your home alarm (DSC or Honeywell) using Home Assistant from everywhere.

You can also build your own Alarm dashboard:
![app10](media/app10.png)

HomeAssistant Alarm is all in one solution with the following features:

- Easy deployment and management

- Auto mapping Alarm Zones to device Types

- Compatible with Serial board [DSC-IT100](https://www.amazon.com/Tyco-Serial-Integration-Module-Control/dp/B003XACL9C/ref=sr_1_1_sspa?keywords=dsc-it100&qid=1638610345&sr=8-1-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEzNzY4U0pUMkpXUUdWJmVuY3J5cHRlZElkPUEwMTk2ODMxMzZFQlE4MkVPV01GOSZlbmNyeXB0ZWRBZElkPUExMDExMTEzVjJCODg2VVNQNFpKJndpZGdldE5hbWU9c3BfYXRmJmFjdGlvbj1jbGlja1JlZGlyZWN0JmRvTm90TG9nQ2xpY2s9dHJ1ZQ==) or [Envisalink](https://www.amazon.com/Envisalink-EVL-4EZR-Interface-Honeywell-Compatible/dp/B016WQTJ4S/ref=sr_1_3?keywords=envisalink+dsc&qid=1638610590&sr=8-3). In case of DSC alarm you can chose the one you are using. Honeywell is only compatible with Envisalink.

- Backup and Restore, you can restore either the Raspberry Pi or HomeAssistant Alarm app settings.

- Supports two communication methods WSS or API

- Raspberry Pi deployment using docker or installation script

## DSC Alarm

### **DSC with IT-100**

IT-100 is a serial board (RS-232) that can be integrated with DSC Alarm system. It implement an interface to interact with DSC main Alarm board by sending/receiving commands. [More information.](./Documentation/DSC-it100.pdf)

### **DSC with Envisalink**

- Envisalink is a Ethernet board that can be integrated with DSC Alarm system. It implement an interface to interact with DSC main Alarm board by sending/receiving commands. [More information.](./Documentation/EnvisaLinkTPI-ADEMCO-1-03.pdf)

## Honeywell Alarm

### **Honeywell with Envisalink**

- Envisalink is a Ethernet board that can be integrated with Honeywell alarm. It implement an interface to interact with Honeywell main Alarm board by sending/receiving commands. [More information.](./Documentation/EnvisaLinkTPI-ADEMCO-1-03.pdf)

## Connectivity

HomeAssistant Alarm was built to run on a single board computer like Raspberry Pi. There are many possible options to connect HomeAssistant Alarm to your home alarm (DSC or Honeywell) using a Raspberry Pi. Here is a list of possible options:

- DSC IT-100, can be connected to a Raspberry Pi 3 or Zero W using a USB to Serial cable. The Raspberry Pi 3 can connect to your network using either WiFi of Ethernet cable. For Raspberry Pi Zero W you can connect to your network using WiFi only.
- Envisalink, requires a Ethernet connection to access your network and Raspberry Pi would access the Envisalink IP address using your local network.

Connection logic:

![Hubitat Diagram](./media/HubitatAlarm.png)

## HomeAssistant Alarm technical details

HomeAssistant Alarm is a Node.JS application that works like a bridge between DSC or Honeywell alarms and Home Assistant. It will detect all events in the alarm and will communicate with the Home Assistant integration.

It supports either DSC-IT100 or Envisalink to connect to DSC or Honeywell alarms.

The communication between Home Assistant and HomeAssistant Alarm can be configured in two possible ways:

- Web Sockets - This is the preferred way to connect Home Assistant to HomeAssistant Alarm. A web socket session will be established and will remain open sending and receiving commands working as a live bridge.
- API - This is a push and pull model where Home Assistant will consume APIs to send and receive commands.

### Setup HomeAssistant Alarm

There are two methods to install HomeAssistant Alarm to a Raspberry Pi. It can be installed using a script or docker container.

#### Script Installation method

To install HomeAssistant Alarm in your Raspberry Pi using script just copy and paste the following command line:

```bash
curl -SL https://raw.githubusercontent.com/michettik/HubitatAlarm/master/Alarm/install.sh | sudo -E bash -
```

To update just run the same command again. It will detect if it was already installed and update to the latest version.
HomeAssistant Alarm will be installed under this path: /opt/Alarm. It will create a config.json file that should be backed up to preserve all your settings.

To uninstall run the following command:

```bash
curl -SL https://raw.githubusercontent.com/michettik/HubitatAlarm/master/Alarm/uninstall.sh | sudo -E bash -
```

#### Docker method

You must have Docker installed. You can use the following commands to install Docker in your Raspberry Pi.

```bash
sudo curl -sL get.docker.com | bash
sudo usermod -a -G docker pi
```

Run HomeAssistant Alarm container using the following command:

- For DSC-IT100

```bash
docker run --name=homeassistant-alarm -d -p 3001:3001 -v /home/pi/homeassistant-alarm-config:/opt/Alarm/config --device=/dev/ttyUSB0 -e TZ=America/Edmonton --restart always michettik/homeassistant-alarm:latest
```

- For Envisalink

```bash
docker run --name=homeassistant-alarm -d -p 3001:3001 -v /home/pi/homeassistant-alarm-config:/opt/Alarm/config -e TZ=America/Edmonton --restart always michettik/homeassistant-alarm:latest
```

HomeAssistant Alarm will create a config.json file in the mounted folder /home/pi/homeassistant-alarm-config. It's important to keep this file out of the container in case you have to update or reinstall the container.

To update a container you run the following commands:

```bash
# Updating Alarm container
docker pull michettik/homeassistant-alarm:latest
docker stop homeassistant-alarm
docker rm homeassistant-alarm
# Run command for DSC-IT100
docker run --name=homeassistant-alarm -d -p 3001:3001 -v /home/pi/homeassistant-alarm-config:/opt/Alarm/config --device=/dev/ttyUSB0 --restart always michettik/homeassistant-alarm:latest
# Run command for Envisalink
docker run --name=homeassistant-alarm -d -p 3001:3001 -v /home/pi/homeassistant-alarm-config:/opt/Alarm/config --restart always michettik/homeassistant-alarm:latest
```

## WebSocket/API Code Parameter

This fork adds support for passing the alarm code directly in WebSocket messages or API calls, instead of requiring it to be hardcoded in config.json.

**WebSocket example:**
```json
{"command": "alarmDisarm", "code": "1234"}
```

**API example:**
```
GET /api/alarmDisarm?code=1234
```

If no code is provided, it falls back to the `alarmpassword` in config.json (backwards compatible).

## Home Assistant Integration

Use this server with the [HomeAssistant-DSC-IT-100](https://github.com/michettik/HomeAssistant-DSC-IT-100) custom integration for Home Assistant.

## Credits & Acknowledgments

This project would not exist without the excellent work of **[Victor Santana (Welasco)](https://github.com/Welasco)**.

The original **[HubitatAlarm](https://github.com/Welasco/HubitatAlarm)** project provides:
- Complete DSC IT-100 and Envisalink serial/network integration
- Honeywell alarm system support
- WebSocket and API communication layer
- Node.js bridge architecture
- Docker containerization
- Comprehensive documentation

**Thank you, Victor, for creating and open-sourcing this project!**

### Changes in this fork:
- Rebranded for Home Assistant (originally designed for Hubitat)
- Added dynamic alarm code passing via WebSocket/API messages
- Changed default port to 3001
- Updated to Node.js 18

## License

MIT License