import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import { processList } from './longProcess/enums';
import Loader from './components/Loader';

type LengthCountType = {
  loading: boolean;
  value: number;
};

export type ProfileType = {
  albumId: number | string;
  id: number | string;
  title: string;
  url: string;
  thumbnailUrl: string;
};

export type ProfileListType = {
  loading: boolean;
  list: unknown & Array<ProfileType>;
  page: number;
};

export type GetDataType = {
  action: string;
  period: 'initial' | 'next' | 'prev' | 'pageNumber';
  thePageNumber: number;
};

export const listPageSize = 50;

const App = () => {
  const counter: Worker = useMemo(
    () => new Worker(new URL('./longProcess/count.ts', import.meta.url)),
    []
  );

  const [lengthCount, setLengthCount] = useState<LengthCountType>({
    loading: true,
    value: 0,
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

  return (
    <main className="main-container">
      <section className="count">
        Total count of Profiles is{' '}
        <b>{lengthCount.loading ? <Loader size={14} /> : lengthCount.value}</b>
      </section>
      <section className="table-container"></section>
    </main>
  );
};

export default App;
