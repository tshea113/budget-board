import { GraphType } from '@/types/trends';
import React, { type JSX } from 'react';
import GraphSelect from './graph-select';
import { Card } from '@/components/ui/card';
import NetWorthGraph from './net-worth/net-worth-graph';
import AssetsGraph from './assets/asset-graph';
import LiabilitiesGraph from './liabilities/liabilities-graph';
import SpendingCard from './spending/spending-card';
import NetCashFlowGraph from './net-cash-flow/net-cash-flow-graph';

const Trends = (): JSX.Element => {
  const [currentGraph, setCurrentGraph] = React.useState<GraphType>(GraphType.Spending);

  return (
    <div className="flex flex-col gap-3">
      <GraphSelect graphType={currentGraph} setGraphType={setCurrentGraph} />
      <Card className="p-2">
        {(() => {
          switch (currentGraph) {
            case GraphType.Spending:
              return <SpendingCard />;
            case GraphType.NetCashFlow:
              return <NetCashFlowGraph />;
            case GraphType.Assets:
              return <AssetsGraph />;
            case GraphType.Liabilities:
              return <LiabilitiesGraph />;
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
