class ErrorBoundary extends React.Component {
    state = { hasError: false };
  
    static getDerivedStateFromError(error) {
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can log the error to an error reporting service
      console.error('Error caught by Error Boundary:', error, errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // Fallback UI
        return <Text>Something went wrong.</Text>;
      }
  
      return this.props.children;
    }
  }
  