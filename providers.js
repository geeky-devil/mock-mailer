const axios = require('axios');

class ProviderA {
  async sendEmail(email) {
    return axios.post('https://66cdcf098ca9aa6c8ccbb32f.mockapi.io/send/providerA', email);
  }
}

class ProviderB {
  async sendEmail(email) {
    return axios.post('https://66cdcf098ca9aa6c8ccbb32f.mockapi.io/send/providerB', email);
  }
}

module.exports = { ProviderA, ProviderB };
