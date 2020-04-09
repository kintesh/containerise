import './styles/style.scss';
import './index.html';
import State from '../State';
import ContextualIdentity, {NO_CONTAINER} from '../ContextualIdentity';
import HostStorage from '../Storage/HostStorage';
import Tabs from '../Tabs';
import './actions/Actions';
import './ContainerSelector';
import './URLMaps';
import './CSVEditor';

State.setState({
  identities: [],
  selectedIdentity: {},
  urlMaps: {},
});

const getIdentities = () => {
  ContextualIdentity.getAll().then((identities) => {
    State.set('identities', identities);
    State.set('selectedIdentity', identities[0]);
  });
};

const getUrlMaps = () => {
  HostStorage.getAll().then((urlMaps) => {
    State.set('urlMaps', urlMaps);
  });
};

getIdentities();
getUrlMaps();

ContextualIdentity.addOnChangedListener(() => {
  getIdentities();
});

HostStorage.addOnChangedListener(() => {
  getUrlMaps();
});

Tabs.query({active: true}).then(tabs => {
  const activeTab = tabs[0];

  if (activeTab.cookieStoreId === 'firefox-default') {
    State.set('selectedIdentity', NO_CONTAINER);
    return;
  }

  ContextualIdentity.getAll().then((identities) => {
    for(const identity of identities) {
        if (identity.cookieStoreId === activeTab.cookieStoreId) {
          State.set('selectedIdentity', identity);
          break;
        }
    }
  });
});

window.State = State;
