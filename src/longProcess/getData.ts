/* eslint-disable no-restricted-globals */
import { GetDataType, listPageSize, ProfileListType } from '../data/dataTypes';
import { profiles } from '../data';
import { processList } from './enums';

self.onmessage = (e: MessageEvent<string>) => {
  const data = JSON.parse(e.data) as GetDataType;

  if (data.action !== processList.getData) {
    return;
  }
  if (data.period === 'initial') {
    const items = profiles.filter((item, index) => index < listPageSize);

    const response = {
      loading: false,
      list: items,
      page: data.thePageNumber,
    } as ProfileListType;

    self.postMessage(JSON.stringify(response));
  }
};

export {};
