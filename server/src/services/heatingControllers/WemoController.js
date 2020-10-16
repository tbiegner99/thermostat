const axios = require("axios");
const { parseStringPromise } = require("xml2js");
const HeatingController = require("./HeatingController");

class WemoController extends HeatingController {
  constructor({ host, port }) {
    super();
    this.host = host;
    this.port = port;
    this.on = false;
  }

  isOn() {
    return this.on;
  }

  getSetStateRequest(state) {
    return `<?xml version="1.0"?>
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
            <ns:SetBinaryState xmlns:ns="urn:Belkin:service:basicevent:1">
                <BinaryState>${Number(state)}</BinaryState>
                <Duration>0</Duration>
                <EndAction>0</EndAction>
                <UDN>0</UDN>
            </ns:SetBinaryState>
        </s:Body>
    </s:Envelope>
    `;
  }

  async executeSoapRequest(request) {
    const headers = {
      "Content-Type": "text/xml",
      SOAPAction: '"urn:Belkin:service:basicevent1:1#SetBinaryState"',
    };
    const url = `http://${this.host}:${this.port}/upnp/control/basicevent1`;
    const response = await axios.post(url, request, {
      headers,
    });
    return parseStringPromise(response.data);
  }

  getBinaryStateFromResponse(parsedResponse) {
    const state =
      parsedResponse["s:Envelope"]["s:Body"][0]["u:SetBinaryStateResponse"][0]
        .BinaryState[0];
    return Number(state);
  }

  async turnOn() {
    try {
      if (this.on) {
        return; // this will thrrow error otherwise
      }
      const parsedResponse = await this.executeSoapRequest(
        this.getSetStateRequest(true)
      );
      const binaryState = this.getBinaryStateFromResponse(parsedResponse);
      this.on = Number.isNaN(binaryState) ? true : Boolean(binaryState);
    } catch (err) {
      console.error("Failed to turn on wemo", err);
    }
  }

  async turnOff() {
    try {
      if (!this.on) {
        return; // this will thrrow error otherwise
      }
      const parsedResponse = await this.executeSoapRequest(
        this.getSetStateRequest(false)
      );
      const binaryState = this.getBinaryStateFromResponse(parsedResponse);
      this.on = Number.isNaN(binaryState) ? false : Boolean(binaryState);
    } catch (err) {
      console.error("Failed to turn on wemo", err);
    }
  }
}

module.exports = WemoController;
