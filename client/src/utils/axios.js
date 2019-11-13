import axios from "axios"

let axiosInstance = axios.create({
  baseURL: "https://smaa-function-app.azurewebsites.net"
  // baseURL: "http://localhost:7071"
});

export default axiosInstance