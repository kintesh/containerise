import './styles/style.scss';
import './index.html';
import State from '../State';
import ContextualIdentity from '../ContextualIdentity';
import Storage from '../Storage';
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
  Storage.getAll().then((urlMaps) => {
    State.set('urlMaps', urlMaps);
  });
};

getIdentities();
getUrlMaps();

ContextualIdentity.addOnUpdateListener(() => {
  getIdentities();
});

Storage.addOnChangedListener(() => {
  getUrlMaps();
});
