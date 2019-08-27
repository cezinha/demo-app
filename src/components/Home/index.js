import { connect } from "react-redux";
import { configLoad } from '../../actions';
import Home from './Home';

const mapStateToProps = state => {
  return {
    config: state.configReducer.config
  };
};

const mapDispatchToProps = dispatch => {
  return {
    configLoad: (config) => dispatch(configLoad(config))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
