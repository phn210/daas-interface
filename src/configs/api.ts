import Axios from 'axios';

export const dashboardClient = Axios.create({
  baseURL: 'https://scoringapi.trava.finance/travadao/v1/dashboard/',
});
