import App from './App';
import { OPTIONAL } from './INIT_OPTIONS_FOR_APP';

const {
  CONTAINER_SELECTOR: container,
  INIT_STATE: state,
  URL_SERVER: url,
} = OPTIONAL;

new App({ container, state, url });
