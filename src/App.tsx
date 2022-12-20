import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { processList } from './longProcess/enums';
import Loader from './components/Loader';
import Table from './components/Table';
import { GetDataType, ProfileListType } from './data/dataTypes';

type LengthCountType = {
  loading: boolean;
  value: number;
};

const App = () => {
  const counter: Worker = useMemo(
    () => new Worker(new URL('./longProcess/count.ts', import.meta.url)),
    []
  );

  const getData: Worker = useMemo(
    () => new Worker(new URL('./longProcess/getData.ts', import.meta.url)),
    []
  );

  const [lengthCount, setLengthCount] = useState<LengthCountType>({
    loading: true,
    value: 0,
  });

  const [profileList, setProfileList] = useState<ProfileListType>({
    loading: true,
    list: [],
    page: 1,
  });

  useEffect(() => {
    if (window.Worker) {
      counter.postMessage(processList.count);
    }
  }, [counter]);

  useEffect(() => {
    if (window.Worker) {
      counter.onmessage = (e: MessageEvent<string>) => {
        setLengthCount((prev) => ({
          ...prev,
          loading: false,
          value: Number(e.data) && Number(e.data),
        }));
      };
    }
  }, [counter]);

  useEffect(() => {
    if (window.Worker) {
      const request = {
        action: processList.getData,
        period: 'initial',
        thePageNumber: profileList.page,
      } as GetDataType;

      getData.postMessage(JSON.stringify(request));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (window.Worker) {
      getData.onmessage = (e: MessageEvent<string>) => {
        const response = JSON.parse(e.data) as unknown as ProfileListType;
        console.log({ response });

        setProfileList((prev) => ({
          ...prev,
          loading: response.loading,
          list: response.list,
          page: response.page,
        }));
      };
    }
  }, [getData]);

  return (
    <main className="main-container">
      <section className="count">
        Total count of Profiles is{' '}
        <b>{lengthCount.loading ? <Loader size={14} /> : lengthCount.value}</b>
      </section>
      <section className="table-container">
        {profileList.loading ? (
          <Loader size={40} display="block" />
        ) : (
          <>
            <Table list={profileList.list} />
          </>
        )}
      </section>
    </main>
  );
};

export default App;
