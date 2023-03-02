import Vue from 'vue'
import Vuex from 'vuex'
import axios, { AxiosError, AxiosResponse } from "axios";
import { relativeTimeRounding } from 'moment';

Vue.use(Vuex)

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

function isAxiosError(obj: any | undefined): obj is AxiosError {
  return obj && obj.isAxiosError === true;
}

export default new Vuex.Store({
  state: {
    events: [],
    intentPaymentNumber: undefined,
    idEvent: '',
    email: '',
    resaNumber: {id: null},
    notif:'',
    displaySnack: false,
  },
  mutations: {
    events(state, events){
      return state.events = events;
    },
    setIntentPaymentNumber(state, num){
      return state.intentPaymentNumber = num;
    },
    setIdEvent(state, id){
      return state.idEvent = id;
    },
    setEmail(state, email){
      return state.email = email;   
    },
    setResaNum(state, code){
      return state.resaNumber = code;
    },
    setSnackBarNotif(state, text){
      return state.notif = text;
    },
    displaySnackbar(state, bool){
      return state.displaySnack = bool;
    },
  },
  actions: {
    setIdEvent({commit}, id){
      commit('setIdEvent', id);
    },
    setEmail({commit}, email){
      commit('setEmail',email);   
    },
    setSnackBar({commit}, [text, bool]){
      commit('setSnackBarNotif', text);
      commit('displaySnackbar', bool)
    },
    getAllEvent({commit}) {
      http.get('/api/Stripe/GetAllEventModels')
        .then((_response: AxiosResponse) => {
          commit('events', _response.data);
        })
        .catch((_error: any) => {
          if (isAxiosError(_error) && _error.response) {
            return _error.response;
          } else {
            throw _error;
          }
        })
    },
    createStripeIntentPayment({commit, dispatch}, amount: number){
      http.post(`/api/Stripe/StripeCharge?amount=${amount}`)
        .then((_response: AxiosResponse) => {
          commit('setIntentPaymentNumber', _response.data);
          dispatch('initiateReservation');
        })
        .catch((_error: any) => {
          if (isAxiosError(_error) && _error.response) {
            return _error.response;
          } else {
            throw _error;
          }
        })
    },
    initiateReservation({commit, state}){
      const url = new URL(process.env.VUE_APP_REMOTE_SERVICE_BASE_URL+'/api/Reservation/InitiateReservation')
      url.searchParams.append("date", new Date().toISOString());
      url.searchParams.append("email", state.email);
      url.searchParams.append("idEventModel", state.idEvent.toString());
      http.post(url.href)
        .then((_response: AxiosResponse) => {
          commit('setResaNum', _response.data);
        })
        .catch((_error: any) => {
          if (isAxiosError(_error) && _error.response) {
            return _error.response;
          } else {
            throw _error;
          }
        });
    },
    autoCreateEvent({commit}, [emails, selectedDate, selectedHour, emailStripe, idResa]){
      const date = new Date(selectedDate + ' ' + selectedHour);
      const dateUTC = new Date(selectedDate + " " + date.getUTCHours() + ":" + date.getUTCMinutes())
      const listEmails: string[] = [];
      emails.forEach((e: any) => {listEmails.push(e.value)});                            

      const url = new URL(process.env.VUE_APP_REMOTE_SERVICE_BASE_URL+'/api/Reservation/AutoCreateEvent')
      url.searchParams.append("email", emailStripe);
      url.searchParams.append("dateEvent", dateUTC.toISOString());
      url.searchParams.append("idResa", idResa.toString());
      http.post(url.href, listEmails)
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
    },
  },
  modules: {
  },
  getters:{
  }
})
