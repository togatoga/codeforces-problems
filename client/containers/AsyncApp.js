import React, {
    Component
} from "react";
import {
    fetchProblems
} from "../actions/actions";

import {
    connect
} from "react-redux"


class AsyncApp extends Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        const {
            dispatch
        } = this.props;
        dispatch(fetchProblems());
        console.log(this.props.problemsByApi);
    }
    render() {
        return (
            <div>
            Hello World!!
        </div>);
    }
}

function mapStateToProps(state) {
    const {
        problemsByApi
    } = state;

    return {
        problemsByApi
    }
}

export default connect(mapStateToProps)(AsyncApp);