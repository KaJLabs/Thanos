import TrezorConnect from '@trezor/connect-web';

export class TrezorAdapter {
  init(manifest: { email: string; appUrl: string }) {
    TrezorConnect.init({
      lazyLoad: true,
      manifest
    });
  }

  async getEthereumAddress(path = `m/44'/60'/0'/0/0`) {
    return TrezorConnect.ethereumGetAddress({ path, showOnTrezor: false });
  }

  async getBitcoinAddress(path = `m/84'/0'/0'/0/0`) {
    return TrezorConnect.getAddress({ path, coin: 'btc', showOnTrezor: false });
  }
}
