import axios, { AxiosError, AxiosResponse } from "axios";

const http = axios.create({
  baseURL: process.env.VUE_APP_REMOTE_SERVICE_BASE_URL,
  headers: {
    "Content-type": "application/json",
    'Access-Control-Allow-Origin': '*',
    'Accept' : 'application/json, text/plain, */*',
    'Access-Control-Allow-Methods' : 'GET, PUT, POST, DELETE, OPTIONS',
    'Access-Control-Allow-Credentials' : true,
    'Cache-Control': 'no-store'
  }
})

export async function createIntentPayment (amount: number): Promise<string> {
  return await http.post(`/api/Stripe/StripeCharge?amount=${amount}`)
    .catch((_error: any) => {
      if (isAxiosError(_error) && _error.response) {
        return _error.response;
      } else {
        throw _error;
      }
    }).then((_response: AxiosResponse) => {
      return _response.data;
    });
}

function isAxiosError(obj: any | undefined): obj is AxiosError {
  return obj && obj.isAxiosError === true;
}

export async function getAllEventModel() : Promise<any> {
  return await http.get('/api/Stripe/GetAllEventModels')
    .catch((_error: any) => {
      if (isAxiosError(_error) && _error.response) {
        return _error.response;
      } else {
        throw _error;
      }
    }).then((_response: AxiosResponse) => {
      return _response.data;
    });
}

export async function initiateReservation(idEventModel : number, email : string) : Promise<any> {
  const url = new URL(process.env.VUE_APP_REMOTE_SERVICE_BASE_URL+'/api/Reservation/InitiateReservation')
  url.searchParams.append("date", new Date().toISOString());
  url.searchParams.append("email", email);
  url.searchParams.append("idEventModel", idEventModel.toString());
  return await http.post(url.href)
    .catch((_error: any) => {
      if (isAxiosError(_error) && _error.response) {
        return _error.response;
      } else {
        throw _error;
      }
    }).then((_response: AxiosResponse) => {
      console.log(_response.data)
      return _response.data;
    });
}
export async function autoCreateEvent(emails : string[], dateEvent : Date, email :string, idResa : number): Promise<any>{
  const url = new URL(process.env.VUE_APP_REMOTE_SERVICE_BASE_URL+'/api/Reservation/AutoCreateEvent')
  url.searchParams.append("email", email);
  url.searchParams.append("dateEvent", dateEvent.toISOString());
  url.searchParams.append("idResa", idResa.toString());
  return await http.post(url.href, emails)
    .catch((_error: any) => {
      if (isAxiosError(_error) && _error.response) {
        return _error.response;
      } else {
        throw _error;
      }
    }).then((_response: AxiosResponse) => {
      console.log(_response.data)
      return _response.data;
    });
  

}