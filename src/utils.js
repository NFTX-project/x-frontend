import { POLL_DELAY_CONNECTIVITY } from "./constants";
import { getWeb3 } from "./web3-utils";

export const pollConnectivity = pollEvery((providers = [], onConnectivity) => {
  let lastFound = null;
  return {
    request: async () => {
      try {
        await Promise.all(
          providers.map((p) => getWeb3(p).eth.net.getNetworkType())
        );
        return true;
      } catch (err) {
        return false;
      }
    },
    onResult: (connected) => {
      if (connected !== lastFound) {
        lastFound = connected;
        onConnectivity(connected);
      }
    },
  };
  // web.eth.net.isListening()
}, POLL_DELAY_CONNECTIVITY);

export function pollEvery(fn, delay) {
  let timer = -1;
  let stop = false;
  const poll = async (request, onResult) => {
    let result;
    try {
      result = await request();
    } catch (err) {
      log("Polling failed for fn:", fn);
      log("Error:", err);
      // Stop polling and let requester handle
      throw err;
    }

    if (!stop) {
      onResult(result);
      timer = setTimeout(poll.bind(null, request, onResult), delay);
    }
  };
  return (...params) => {
    const { request, onResult } = fn(...params);
    poll(request, onResult);
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  };
}

// return the first argument (named after lodash)
export const identity = (arg) => arg;

export function log(...params) {
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.NODE_ENV !== "test"
  ) {
    console.log(...params);
  }
}

export const iOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

export const isSafari = /Version\/[\d.]+.*Safari/.test(navigator.userAgent);
