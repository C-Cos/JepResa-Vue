<template>
    <v-container>
        <v-row class="title">
            <h1 class="booking-title mt-8">Votre réservation</h1>
        </v-row>
        <MySnackBar/>
        <v-stepper v-model="e1" width="100%">
            <v-stepper-header>
                <v-stepper-step step="1" :complete="e1 > 1">
                    Choisir le type d'évènement
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="2" :complete="e1 > 2">
                    Choisir le nombre de joueurs
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="3" :complete="e1 > 3" >
                    Choisir le créneau
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="4" :complete="e1 > 4" >
                    Récapitulatif
                </v-stepper-step>

                <v-divider></v-divider>

                <v-stepper-step step="5">
                    Confirmation
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-container>
                        <div class="d-flex flex-row flex-wrap justify-content-between event-block">
                            <div v-for="(ev, i) in events" :key="i">
                                <div class="event-card-block" @click="onChangeEvent(ev)" :class = "selectEvent.id === ev.id?'event-card-block-selected':''">
                                    <div class="d-flex flex-row event-card-title">
                                        {{ev.title}}
                                    </div>
                                    <div class="d-flex flex-row">
                                        <img
                                        :src="processUrl(ev.urlImg)"
                                        class="card-event-img"
                                        />
                                        <div class="d-flex flex-column event-card-desc">
                                            {{ev.description}}
                                            <div class="d-flex flex-column event-card-price">
                                                Prix total : {{ev.price}}€
                                            </div>
                                        </div>
                                    </div>         
                                </div>
                            </div>
                        </div>
                        <v-layout row wrap justify-end>
                            <v-btn color="accent" @click="toStep2" @mouseover="hovered = true" @mouseleave="hovered = false" :class="{ 'btn-hover': hover }">
                                Continuer
                                <v-icon>
                                mdi-chevron-right
                                </v-icon>
                            </v-btn>
                        </v-layout>    
                    </v-container>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-container>
                        <!-- content nom et adresses des joueurs -->
                        <v-subheader>
                            Vous pouvez ajouter jusqu'à 6 joueurs.
                        </v-subheader>
                        <div
                        v-for="(emailInput, i) in emailInput"
                        :key="i"
                        >
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field
                                    v-model="emailInput.value"
                                    label="Email de l'organisateur"
                                    :rules="[emailRules.required, emailRules.format]"
                                    prepend-icon="mdi-account"
                                    required
                                    v-if="i==0"
                                    hint="email de l'organisateur"
                                    >
                                    </v-text-field>
                                    <v-text-field
                                    v-model="emailInput.value"
                                    label="Email du participant"
                                    :rules="[emailRules.required, emailRules.format]"
                                    prepend-icon="mdi-account"
                                    required
                                    v-else
                                    >
                                    </v-text-field>
                                </v-col>
                                <v-icon class="email-icons" medium @click="removeEmailInput(i)">
                                    {{ i === 0 ? "":  "mdi-close-box" }}
                                </v-icon>
                                <v-icon class="email-icons" medium @click="addEmailInput">
                                    mdi-account-multiple-plus
                                </v-icon>
                            </v-row>
                        </div>
                        <v-layout row wrap justify-end class="stepper-item-footer">
                            <v-btn text @click="e1 = 1">
                                Retour
                            </v-btn>
                            <v-btn color="accent" @click="toStep3">
                                Continuer
                                <v-icon>
                                mdi-chevron-right
                                </v-icon>
                            </v-btn>
                        </v-layout>    
                    </v-container>
                </v-stepper-content>

                <v-stepper-content step="3" :style="{ paddingTop: 'unset'}">
                    <v-container>
                        <v-row>
                            <v-col cols="10" sm="4" :style="{ marginLeft: '2rem'}">
                                <v-date-picker
                                v-model="date"
                                color="green lighten-1"
                                elevation="15"
                                :show-current="true"
                                @click:date="chooseDate"
                                class="mt-4"
                                ></v-date-picker>
                            </v-col>
                            <v-col cols="10" sm="4" :style="{ marginLeft: '2rem'}">
                                <v-time-picker
                                class="mt-4"
                                format="24hr"
                                min="9:00"
                                max="23:00"
                                :allowed-minutes="allowedStep"
                                elevation="15"
                                @change="chooseTime"
                                ></v-time-picker>
                            </v-col>
                            <v-spacer></v-spacer>
                            <v-col class="my-2 px-1" cols="6" sm="3">
                                <div class="block-horaire">
                                    Veuillez choisir la date et l'heure de votre évènement.
                                    <v-row class="res-block-horaire">
                                        {{ dateChoose ? `Votre évènement aura lieu le ${format_date(dateChoose)}` : '' }}
                                        {{ hourChoose ? `à ${hourChoose}.` : ""}}
                                    </v-row>
                                </div>
                            </v-col>
                        </v-row>
                        <v-layout row wrap justify-end>  
                            <v-btn text @click="e1 = 2">
                                Retour
                            </v-btn>                          
                            <v-btn color="accent" @click="toStep4">
                                Continuer
                                <v-icon>
                                mdi-chevron-right
                                </v-icon>
                            </v-btn>
                        </v-layout>    
                    </v-container>
                </v-stepper-content>

                <v-stepper-content step="4">
                    <v-container>
                        <v-overlay :value="overlay">
                            <v-progress-circular
                                indeterminate
                                size="64"
                            ></v-progress-circular>
                        </v-overlay>
                        <v-row>
                            <v-col>
                                <div class="block-recap">
                                    <v-row class="recap-title">
                                        RECAPITULATIF
                                    </v-row>
                                     <v-row class="recap-elem">
                                        <v-col cols="10" sm="4">
                                            Prix
                                        </v-col>
                                        <v-col>
                                            {{selectEvent.price}}.00€
                                        </v-col>
                                    </v-row>
                                    <v-row class="recap-elem">
                                        <v-col cols="10" sm="4">
                                            Evènement
                                        </v-col>
                                        <v-col>
                                            {{selectEvent.title}}
                                        </v-col>
                                    </v-row>
                                    <v-row class="recap-elem">
                                        <v-col cols="10" sm="4">
                                            Date sélectionnée
                                        </v-col>
                                        <v-col>
                                            {{`Le ${format_date(dateChoose)} à ${hourChoose}`}}
                                        </v-col>
                                    </v-row>                            
                                    <v-row class="recap-elem">
                                        <v-col cols="10" sm="4">
                                            Liste des joueurs
                                        </v-col>
                                        <v-col>
                                            <div
                                            v-for="(emailInput, i) in emailInput"
                                            :key="i"
                                            >
                                            {{emailInput.value}}
                                            </div>
                                        </v-col>
                                    </v-row>                        
                                </div>
                            </v-col>
                            <v-col>
                                <div class="block-payment">
                                    <v-text-field class="email-customer"
                                    v-model="emailCustomer"
                                    :rules="[emailRules.required, emailRules.format]"
                                    solo
                                    label="email de facturation"
                                    clearable
                                    ></v-text-field>

                                    <stripe-element-card
                                        ref="elementRef"
                                        :pk="publishableKey"
                                        @element-change="onCardChange"
                                    />
                                    <v-text-field class="name-customer"
                                    v-model="nameCustomer"
                                    :rules="[emailRules.required]"
                                    solo
                                    label="Nom sur la carte"
                                    clearable
                                    ></v-text-field>

                                    <v-btn class="btn-pay" color="accent" @click="submitPayment" v-if="cardValid">
                                        Payer
                                    </v-btn>
                                </div>
                            </v-col>
                        </v-row>
                       
                        <v-layout row wrap justify-end>                            
                            <v-btn text @click="e1 = 3">
                                Retour
                            </v-btn>
                        </v-layout>    
                    </v-container>
                </v-stepper-content>

                 <v-stepper-content step="5">
                    <v-container>
                        <div class="recap-title">Félicitation, votre commande est validée ! Voici votre numéro de commande : '{{resaCode.code_reservation}}'</div>
                        <div class="recap-title">Un email de confirmation va bientôt vous être envoyé à l'adresse {{emailCustomer}}</div>
                        <v-row>
                            <v-col>
                                <div class="block-recap">
                                     <v-row class="recap-elem">
                                        <v-col cols="10" sm="4">
                                            Prix
                                        </v-col>
                                        <v-col>
                                            {{selectEvent.price}}.00€
                                        </v-col>
                                    </v-row>
                                    <v-row class="recap-elem">
                                        <v-col cols="10" sm="4">
                                            Evènement
                                        </v-col>
                                        <v-col>
                                            {{selectEvent.title}}
                                        </v-col>
                                    </v-row>
                                    <v-row class="recap-elem">
                                        <v-col cols="10" sm="4">
                                            Date sélectionnée
                                        </v-col>
                                        <v-col>
                                            {{`Le ${format_date(dateChoose)} à ${hourChoose}`}}
                                        </v-col>
                                    </v-row>                            
                                    <v-row class="recap-elem">
                                        <v-col cols="10" sm="4">
                                            Liste des joueurs
                                        </v-col>
                                        <v-col>
                                            <div
                                            v-for="(emailInput, i) in emailInput"
                                            :key="i"
                                            >
                                            {{emailInput.value}}
                                            </div>
                                        </v-col>
                                    </v-row>                        
                                </div>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-stepper-content>

            </v-stepper-items>
        </v-stepper>
    </v-container>   
</template>

<script>
    import Vue from 'vue'
    import MySnackBar from '../components/SnackBar.vue'
    import { StripeElementCard } from '@vue-stripe/vue-stripe';
    import moment from 'moment';
    import {mapMutations, mapActions} from 'vuex';

    export default {
        components: {
            StripeElementCard,
            MySnackBar
        },
        data: () => ({
            date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
            time: '11:15',
            dateChoose: null,
            hourChoose: null,
            e1: 1,
            eventModels : [],
            selectEvent:{},
            email: '',
            emailRules: {
                required: value => !!value || 'Required.',
                format : value => {
                    if(value.length > 0) {
                        const pattern = /(?:[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[A-Za-z0-9-]*[A-Za-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
                        return pattern.test(value) ? '' : 'Invalid e-mail.';
                    }
                    else{
                        return false;
                    }
                }
            },
            emailInput: [{value: ""}],
            publishableKey: process.env.VUE_APP_STRIPE_PUBLISHABLE_KEY,
            emailCustomer: '',
            nameCustomer: '',
            cardValid: false,
            snackbar: false,
            overlay: false,
            reservation : null,
            code : ""
        }),
        methods: {
            chooseDate (date) {
                this.dateChoose = date;
            },
            chooseTime (time) {
                this.hourChoose = time;
            },
            allowedStep: m => m % 30 === 0,
            addEmailInput () {
                if(this.emailInput.length <= 5){
                    this.emailInput.push({ 
                        value: "",
                    })
                }
            },
            removeEmailInput (index) {
                this.emailInput.splice(index, 1)
            },
            format_date(value){
                if (value) {
                    moment.locale('fr');
                    return moment(String(value)).format('LL');
                }
            },
            toStep2(){
                if(this.selectEvent.id != null){
                    this.e1 = 2;
                    this.setSnackBar(['', false]);
                }
                else{
                    this.setSnackBar(['Vous devez choisir un évènement.', true]);
                }
            },
            toStep3(){
                //if au moins une adresse email
                const pattern = /(?:[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[A-Za-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?\.)+[A-Za-z0-9](?:[A-Za-z0-9-]*[A-Za-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[A-Za-z0-9-]*[A-Za-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/g;
                if(pattern.test(this.emailInput[0].value)){
                    this.e1 = 3;
                    this.setEmail(this.emailInput[0].value);
                    this.setSnackBar(['', false]);
                }
                else{
                    this.setSnackBar(['Vous devez renseigner au moins une adresse mail.', true]);
                }
            },
            toStep4(){
                //if date et heure setté
                if(this.hourChoose && this.dateChoose){
                    this.e1 = 4;
                    this.setSnackBar(['', false]);
                    if(this.selectEvent.price != null){
                        this.createStripeIntentPayment(this.selectEvent.price * 100);
                    }
                }
                else{
                    this.setSnackBar(['Vous devez choisir une date et heure.', true]);
                }
            },
            onCardChange(){
                this.$refs.elementRef.element.on('change', event =>{
                    if (event.complete) {
                        this.cardValid = true;
                    }
                });
            },
            loadEventModels () {
                this.getAllEvent();
            },
            ...mapActions([ 'getAllEvent', 'createStripeIntentPayment', 'initiateReservation', 'autoCreateEvent', 'setIdEvent', 'setEmail', 'setSnackBar']),
            // ...mapMutations(['changeStep']),
            onChangeEvent (ev) {
                this.setIdEvent(ev.id);
                this.selectEvent = ev;
            },
            processUrl (url){
                if(url != null){
                    if(url.includes("http")){
                        return url
                    }
                    else{
                        return process.env.VUE_APP_REMOTE_SERVICE_STATIC_URL + url
                    }
                }
            },
            submitPayment () {
                this.overlay = true;
                const stripe = this.$refs.elementRef.stripe;
                const card = this.$refs.elementRef.element;
                //this.proceedToStripePayment(stripe, card, this.emailCustomer, this.nameCustomer, this.dateChoose, this.hourChoose, this.emailInput);
                stripe.confirmCardPayment(this.$store.state.intentPaymentNumber, {
                    payment_method: {
                            card: card,
                            billing_details: {
                                name: this.nameCustomer,
                            },
                        },
                    receipt_email: this.emailCustomer
                })
                .then((result) => {
                    if (result.error) {
                        // Show error to your customer
                        this.setSnackBar([result.error.code === "parameter_invalid_empty" ? "Vous devez remplir tous les champs pour valider le paiement" : 'Le paiement a échoué. Veuillez contacter votre banque pour plus d\'informations', true]);
                        this.overlay = false;
                    } else {
                        //The payment succeeded!
                        //orderComplete(result.paymentIntent.id);
                        this.e1 = 5;
                        this.autoCreateEvent(this.emailInput, this.dateChoose, this.hourChoose, this.emailCustomer, this.reservation.id);
                    }
                });
            },
        }, 
        computed:{
            events(){
                return this.$store.state.events;
            },
            paymentClientSecret(){
                return this.$store.state.intentPaymentNumber;
            },
            resaCode(){
                return this.$store.state.resaNumber;
            }
        },
        beforeMount : function () {
            this.loadEventModels();
        },
    }
    

</script>

<style>
@font-face{
    font-family: "Ubuntu";
    src: url("../assets/ubuntu-b-webfont.woff") format("woff"),
    url("../assets/ubuntu-b-webfont.woff2") format("woff2");
    font-weight: bold;
}
.title {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  align-self: center;
  padding: 1.5rem;
  padding-top: unset;
}
.v-icon.v-icon::after{
    height: unset;
}
.stepper-item-footer{
    padding-top: 1rem;
}
.email-icons{
    padding-left: .5rem;
}
.v-time-picker-title{
    height: 3.5rem;
}
.block-horaire{
    margin-top: 8rem;
    padding: 1rem;
    background-color: honeydew;
    border-radius: 15px;
}
.res-block-horaire{
    margin: unset;
    margin-top: 1rem;
}
.block-recap{
    padding: 2rem;
}
.recap-title{
    display: flex;
    justify-content: center;
    font-weight: bold;
    text-align: center;
}
.recap-elem{
    display: flex;
    align-content: center;
    align-items: center;
    margin-top: 1rem !important;
    border-radius: 15px;
    border: solid 1px lightgrey;
}
.block-payment{
    border: solid 1px lightgrey;
    border-radius: 15px;
    height: 20rem;
    padding: 1rem;
    box-shadow: 5px 5px 5px lightgrey;
    border: 1px solid #e6ebf1;
}
.btn-pay{
    min-width: 100% !important;
    margin-top: -2rem;
}
.email-customer{
    margin-top: 2rem !important;
    min-height: 40px;
}
.name-customer{
    margin-top: -1rem !important;
    min-height: 40px;
}
.v-text-field.v-text-field--solo:not(.v-text-field--solo-flat) > .v-input__control > .v-input__slot{
    box-shadow: 0 1px 3px 0 #e6ebf1 !important;
    border: 1px solid transparent;
}
.event-card-block{
    height: 14rem;
    width: 30rem;
    font-size: 1.0rem;
    border: 1px solid lightgray;
    border-radius: 10px;
    margin-left: .5rem;
    margin-right: 3rem;
    margin-bottom: 1rem;
    padding: .5rem;
    box-shadow: 0 1px 3px rgb(0 0 0 / 12%), 0 1px 2px rgb(0 0 0 / 24%);
    padding-bottom: .5rem;
}
.event-card-block:hover{
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
    cursor: pointer;
}
.event-card-block-selected{
    border: 2px solid #1B2C48;
}
.card-event-img{
    height: 10rem;
    width : 15rem;
    margin-bottom: .5rem;
    margin-right: .5rem;
    border-radius: 10px;
}
.event-card-title{
    display: flex;
    justify-content: center;
    font-size: 1.3rem;
    font-weight: 500;
}
.event-card-desc{
    display: flex;
    justify-content: center;
    align-content: center;
    font-weight: 300;
}
.event-card-price{
    display: flex;
    justify-content: center;
    align-content: center;
    font-weight: 500;
}

</style>