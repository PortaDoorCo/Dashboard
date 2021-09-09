import React from 'react';
import { Col, Row } from 'reactstrap';
import Page404 from './views/Pages/Page404/Page404';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true};
  }
  
  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    this.setState({error});
  }
  
  render() {
    if (this.state.hasError) {
      return <Page404 error={this.state.error} />;
    }
  
    return this.props.children; 
  }
}

export default ErrorBoundary;