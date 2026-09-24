import { classifyTraffic } from "../classification/crawler";
import { getLocaleContext } from "./locale";
import { getReferrerContext } from "./referrer";
import { getViewportContext } from "./viewport";

export function getBrowserContext() {
  return {
    ...getLocaleContext(),
    ...getReferrerContext(),
    ...getViewportContext(),
    userAgent: navigator.userAgent,
    trafficClass: classifyTraffic(navigator.userAgent),
  };
}
