import { connect } from "react-redux";
import { configLoad, getInfo } from '../../actions';
import Home from './Home';

const mapStateToProps = state => {
  return {
    config: state.configReducer.config,
    netInfo: state.netReducer
  };
};

const mapDispatchToProps = dispatch => {
  return {
    configLoad: (config) => dispatch(configLoad(config)),
    getInfo: () => dispatch(getInfo())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
