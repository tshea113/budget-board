import { GraphType } from '@/types/trends';
import React from 'react';
import GraphSelect from './graph-select';
import DebtsGraph from './debts/debts-graph';
import { Card } from '@/components/ui/card';
import NetWorthGraph from './net-worth/net-worth-graph';
import AssetsGraph from './assets/asset-graph';

const Trends = (): JSX.Element => {
  const [currentGraph, setCurrentGraph] = React.useState<GraphType>(GraphType.Spending);

  return (
    <div className="flex flex-col gap-3">
      <GraphSelect graphType={currentGraph} setGraphType={setCurrentGraph} />
      <Card className="p-2">
        {(() => {
          switch (currentGraph) {
            case GraphType.Spending:
              return <h1>Spending Graph</h1>;
            case GraphType.Income:
              return <h1>Income Graph</h1>;
            case GraphType.Assets:
              return <AssetsGraph />;
            case GraphType.Debts:
              return <DebtsGraph />;
            case GraphType.NetWorth:
              return <NetWorthGraph />;
            default:
              return null;
          }
        })()}
      </Card>
    </div>
  );
};

export default Trends;
