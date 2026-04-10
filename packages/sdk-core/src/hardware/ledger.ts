import TransportWebHID from '@ledgerhq/hw-transport-webhid';
import TransportWebUSB from '@ledgerhq/hw-transport-webusb';

export class LedgerAdapter {
  async connect(prefer: 'hid' | 'usb' = 'hid') {
    return prefer === 'hid' ? TransportWebHID.create() : TransportWebUSB.create();
  }

  async getSession(prefer: 'hid' | 'usb' = 'hid') {
    const transport = await this.connect(prefer);
    return {
      transport,
      close: async () => transport.close()
    };
  }
}
