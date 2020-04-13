import './styles/style.scss';
import './index.html';
import State from '../State';
import ContextualIdentity, {NO_CONTAINER} from '../ContextualIdentity';
import HostStorage from '../Storage/HostStorage';
import Tabs from '../Tabs';
import './actions';
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

    // The selectedIdentity might not exist anymore
    //  or may have completely changed
    let selectedIdentity = identities[0];
    if(State.state.selectedIdentity){
      selectedIdentity = identities.find((identity) => {
        return identity.cookieStoreId === State.state.selectedIdentity.cookieStoreId;
      }) || selectedIdentity;
    }
    State.set('selectedIdentity', selectedIdentity);
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
