import HeatingController from './HeatingController';
const axios = require('axios');
const { parseStringPromise } = require('xml2js');

interface WemoControllerConfig {
  host: string;
  port: string | number;
}

class WemoController extends HeatingController {
  private host: string;
  private port: string | number;
  private on: boolean = false;

  constructor({ host, port }: WemoControllerConfig) {
    super();
    this.host = host;
    this.port = port;
    this.on = false;
  }

  override isOn(): boolean {
    return this.on;
  }

  private getSetStateRequest(state: boolean): string {
    return `<?xml version="1.0"?>
    <s:Envelope xmlns:s="http://schemas.xmlsoap.org/soap/envelope/" s:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
        <s:Body>
            <ns:SetBinaryState xmlns:ns="urn:Belkin:service:basicevent:1">
                <UDN>0</UDN>
                <EndAction>0</EndAction>
                <Duration>0</Duration>
                <BinaryState>${Number(state)}</BinaryState>
            </ns:SetBinaryState>
        </s:Body>
    </s:Envelope>
    `;
  }

  private async executeSoapRequest(request: string): Promise<any> {
    const headers = {
      'Content-Type': 'text/xml',
      SOAPAction: '"urn:Belkin:service:basicevent:1#SetBinaryState"',
    };
    const url = `http://${this.host}:${this.port}/upnp/control/basicevent1`;
    const response = await axios.post(url, request, {
      headers,
    });
    return parseStringPromise(response.data);
  }

  private getBinaryStateFromResponse(parsedResponse: any): number {
    const state =
      parsedResponse['s:Envelope']['s:Body'][0]['u:SetBinaryStateResponse'][0]
        .BinaryState[0];
    return Number(state);
  }

  override async turnOn(): Promise<void> {
    try {
      if (this.on) {
        return; // this will throw error otherwise
      }
      const parsedResponse = await this.executeSoapRequest(
        this.getSetStateRequest(true)
      );
      const binaryState = this.getBinaryStateFromResponse(parsedResponse);
      this.on = Number.isNaN(binaryState) ? true : Boolean(binaryState);
    } catch (err) {
      console.error('Failed to turn on wemo', err);
    }
  }

  override async turnOff(): Promise<void> {
    try {
      if (!this.on) {
        return; // this will throw error otherwise
      }
      const parsedResponse = await this.executeSoapRequest(
        this.getSetStateRequest(false)
      );
      const binaryState = this.getBinaryStateFromResponse(parsedResponse);
      this.on = Number.isNaN(binaryState) ? false : Boolean(binaryState);
    } catch (err) {
      console.error('Failed to turn off wemo', err);
    }
  }
}

export = WemoController;