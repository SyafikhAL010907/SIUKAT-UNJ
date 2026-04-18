import { dashboard } from "../api";

export function fetchData(token) {
  return {
    type: "FETCH_DASHBOARD_DATA",
    payload: dashboard.fetchChartData(token),
  };
}
export function fetchMeta(token) {
  return {
    type: "FETCH_DASHBOARD_META",
    payload: dashboard.fetchChartMeta(token),
  };
}
