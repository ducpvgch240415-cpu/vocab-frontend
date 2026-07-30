import { createApp } from 'vue'
import 'semantic-ui-css/semantic.css'
import App from './App.vue'
import router from './router/router.ts'

createApp(App)
  .use(router)
  .mount('#app')
