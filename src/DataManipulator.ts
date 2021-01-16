import { ServerRespond } from './DataStreamer';

export interface Row {
  price_abc: number,
  price_def: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  timestamp: Date,
  trigger_alert: number | undefined,
}

export class DataManipulator {
  static generateRow(serverResponds: ServerRespond[]): Row {
    // serverResponds[0]: ABC
    // serverResponds[1]: DEF
    const priceABC = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const priceDEF = (serverResponds[1].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const ratio = priceABC / priceDEF;

    // Bound is +/- 10% of the price ratio
    const upperBound = 1 + 0.1;
    const lowerBound = 1 - 0.1;

    return {
      price_abc: priceABC,
      price_def: priceDEF,
      ratio,
      // pick the more recent timestamp
      timestamp: (serverResponds[0].timestamp > serverResponds[1].timestamp) ?
          serverResponds[0].timestamp : serverResponds[1].timestamp,
      upper_bound: upperBound,
      lower_bound: lowerBound,
      // check if ratio exceeds the threshold
      trigger_alert: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
    };
  }
}