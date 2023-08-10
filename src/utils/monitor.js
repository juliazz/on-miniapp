import WXLogger from './wxLogger.js';
import store from '@/store';
const Monitor = WXLogger.init({
    pid: store.state.templateId[process.env.NODE_ENV].ailiTrackID,
    region: 'cn',
    behavior: true,
    enableConsole: true
});
export default Monitor;