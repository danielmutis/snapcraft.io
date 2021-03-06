import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { cancelPendingReleases } from "../actions/pendingReleases";
import { releaseRevisions } from "../actions/releases";

class ReleasesConfirm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: false
    };
  }

  onRevertClick() {
    this.props.cancelPendingReleases();
  }

  onApplyClick() {
    this.setState({
      isLoading: true
    });
    this.props.releaseRevisions().then(() => {
      this.setState({
        isLoading: false
      });
    });
  }

  render() {
    const { isLoading } = this.state;
    const { pendingReleases, pendingCloses } = this.props;
    const releasesCount = Object.keys(pendingReleases).length;
    const closesCount = pendingCloses.length;

    return (
      (releasesCount > 0 || closesCount > 0) && (
        <div className="p-releases-confirm">
          {releasesCount > 0 && (
            <Fragment>
              <span className="p-tooltip">
                <span className="p-help">
                  {releasesCount} revision
                  {releasesCount > 1 ? "s" : ""}
                </span>
                <span className="p-tooltip__message" role="tooltip">
                  Release revisions:
                  <br />
                  {Object.keys(pendingReleases).map(revId => {
                    const release = pendingReleases[revId];

                    return (
                      <span key={revId}>
                        <b>{release.revision.revision}</b> (
                        {release.revision.version}){" "}
                        {release.revision.architectures.join(", ")} to{" "}
                        {release.channels.join(", ")}
                        {"\n"}
                      </span>
                    );
                  })}
                </span>
              </span>{" "}
              to release.
            </Fragment>
          )}{" "}
          {closesCount > 0 && (
            <Fragment>
              <span className="p-tooltip">
                <span className="p-help">
                  {closesCount} channel
                  {closesCount > 1 ? "s" : ""}
                </span>
                <span className="p-tooltip__message" role="tooltip">
                  Close channels: {pendingCloses.join(", ")}
                </span>
              </span>{" "}
              to close.
            </Fragment>
          )}{" "}
          <div className="p-releases-confirm__buttons">
            <button
              className="p-button--positive is-inline u-no-margin--bottom"
              disabled={isLoading}
              onClick={this.onApplyClick.bind(this)}
            >
              {isLoading ? "Loading..." : "Apply"}
            </button>
            <button
              className="p-button--neutral u-no-margin--bottom u-no-margin--right"
              disabled={isLoading}
              onClick={this.onRevertClick.bind(this)}
            >
              Cancel
            </button>
          </div>
        </div>
      )
    );
  }
}

ReleasesConfirm.propTypes = {
  pendingReleases: PropTypes.object.isRequired,
  pendingCloses: PropTypes.array.isRequired,

  releaseRevisions: PropTypes.func.isRequired,
  cancelPendingReleases: PropTypes.func.isRequired
};

const mapStateToProps = state => {
  return {
    pendingCloses: state.pendingCloses,
    pendingReleases: state.pendingReleases
  };
};

const mapDispatchToProps = dispatch => {
  return {
    releaseRevisions: () => dispatch(releaseRevisions()),
    cancelPendingReleases: () => dispatch(cancelPendingReleases())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ReleasesConfirm);
