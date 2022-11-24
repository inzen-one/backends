import axios from 'axios';
import classNames from 'classnames';
import currency from 'currency.js';
import moment from 'moment';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { printChart } from 'src/utils/charts';

const Table = () => {
  const [prices, setPrices] = useState({
    btc: [],
    eth: [],
    matic: [],
  });

  const [charts, setCharts] = useState({
    times: [],
    prices: [],
  });

  const drawed = useRef(false);

  useEffect(() => {
    const fetchPrices = async () => {
      const response = await Promise.all([
        axios.get('https://api-v2.blockpour.com/api/prices/average/hourly/BTC?days=1'),
        axios.get('https://api-v2.blockpour.com/api/prices/average/hourly/MATIC?days=1'),
        axios.get('https://api-v2.blockpour.com/api/prices/average/hourly/ETH?days=1'),
      ]);

      const responseFormatted = response.map((rs) => rs.data.data);

      setPrices({
        btc: responseFormatted[0],
        matic: responseFormatted[1],
        eth: responseFormatted[2],
      });

      setCharts({
        times: {
          btc: responseFormatted[0].map((rs) => moment().unix(rs.time)),
          matic: responseFormatted[1].map((rs) => moment().unix(rs.time)),
          eth: responseFormatted[2].map((rs) => moment().unix(rs.time)),
        },
        prices: {
          btc: responseFormatted[0].map((rs) => parseFloat(rs.price)),
          matic: responseFormatted[1].map((rs) => parseFloat(rs.price)),
          eth: responseFormatted[2].map((rs) => parseFloat(rs.price)),
        },
      });
    };

    fetchPrices();
  }, []);

  useEffect(() => {
    if (!drawed.current && charts.times.btc && charts.prices.btc) {
      printChart(charts.times.btc, charts.prices.btc, 'btcRef');
      printChart(charts.times.eth, charts.prices.eth, 'ethRef');
      printChart(charts.times.matic, charts.prices.matic, 'maticRef');

      drawed.current = true;
    }
  }, [charts]);
  return (
    <div className="overflow-x-auto relative">
      <table className="text-sm text-left text-gray-400 w-full">
        <thead className="text-xs uppercase bg-gray-700 text-gray-400">
          <tr>
            {[
              {
                name: 'Name',
              },
              {
                name: 'Price',
                isNumber: true,
              },
              {
                name: 'Volume',
                isNumber: true,
              },

              {
                name: 'Last 7 Days',
                isChart: true,
              },
            ].map((e) => (
              <th
                scope="col"
                className={classNames('py-3 px-6', e.isNumber && 'text-right', e.isChart && 'w-40')}
                key={e.name}
              >
                <span className="ml-3">{e.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b bg-gray-800 border-gray-700">
            <th scope="row" className="thClass flex items-center">
              <Image src="/btc-logo.png" width={20} height={20} alt="polygon" />
              <span className="ml-3">Bitcoin</span>
            </th>
            <th className="thClass text-right">
              {prices.btc.length > 0 && currency(prices.btc[prices.btc.length - 1].price).format()}
            </th>
            <th className="thClass text-right">
              {prices.btc.length > 0 && currency(prices.btc[prices.btc.length - 1].volume).format()}
            </th>
            <th className="thClass relative">
              <canvas id="btcRef" />
            </th>
          </tr>
          <tr className="border-b bg-gray-800 border-gray-700">
            <th scope="row" className="thClass flex items-center">
              <Image src="/eth-logo.png" width={20} height={20} alt="polygon" />
              <span className="ml-3">Ethereum</span>
            </th>
            <th className="thClass text-right">
              {prices.eth.length > 0 && currency(prices.eth[prices.eth.length - 1].price).format()}
            </th>
            <th className="thClass text-right">
              {prices.eth.length > 0 && currency(prices.eth[prices.eth.length - 1].volume).format()}
            </th>
            <th className="thClass relative">
              <canvas id="ethRef" />
            </th>
          </tr>
          <tr className="border-b bg-gray-800 border-gray-700">
            <th scope="row" className="thClass flex items-center">
              <Image src="/matic-logo.png" width={20} height={20} alt="polygon" />
              <span className="ml-3">MATIC</span>
            </th>
            <th className="thClass text-right">
              {prices.matic.length > 0 && currency(prices.matic[prices.matic.length - 1].price).format()}
            </th>
            <th className="thClass text-right">
              {prices.matic.length > 0 && currency(prices.matic[prices.matic.length - 1].volume).format()}
            </th>
            <th className="thClass relative">
              <canvas id="maticRef" />
            </th>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Table;
