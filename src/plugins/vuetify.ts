import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdiSvg', // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4' || 'faSvg'
    },
    theme:{
        themes:{
            light:{
                primary: '#1B2C48',
                secondary: '#E83950',
                white: '#ffffff',
                accent: '#009688',
                error: '#4caf50',
                warning: '#ffeb3b',
                info: '#ffc107',
                success: '#ff9800'
            }
        }
    }
});
