export const environment = {
  production: false,
  apiHost: 'http://26.223.72.183',
  apiPort: 8080,
  get apiUrl() {
    return `${this.apiHost}:${this.apiPort}/api`;
  },
  get apiUrlImg() {
    return `${this.apiHost}:${this.apiPort}`;
  },
  get apiUrlAiRaslen() {
    return `${this.apiHost}:8091/api`;
  }
};
