import axios from "axios";
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||"/api",timeout:20000});
api.interceptors.request.use(c=>{const t=localStorage.getItem("ss_token");if(t)c.headers.Authorization=`Bearer ${t}`;return c;});
export const errMsg=e=>e?.response?.data?.message||(e?.code==="ERR_NETWORK"?"Can't reach the server. Make sure the backend is running.":"Something went wrong. Try again in a moment.");
export default api;
